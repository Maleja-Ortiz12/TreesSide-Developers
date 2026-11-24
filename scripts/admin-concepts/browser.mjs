import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
export async function openBrowser({ safeOrigin } = {}) {
  const profile = await mkdtemp(join(tmpdir(), 'admin-concepts-edge-'));
  const browser = spawn(process.env.BROWSER_EXECUTABLE || process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
  let socket, error; browser.on('error', e => { error = e; });
  const close = async () => {
    socket?.close();
    const exited = new Promise(resolve => browser.exitCode !== null || browser.signalCode !== null ? resolve() : browser.once('exit', resolve));
    browser.kill(); await exited;
    try { await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch { console.log(`SCRATCH_REMAINS ${profile}`); }
  };
  try {
    let port;
    for (let i = 0; i < 100; i++) {
      if (error) throw error;
      try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await new Promise(r => setTimeout(r, 100)); }
    }
    if (!port) throw Error('CDP readiness timed out');
    const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    socket = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((ok, fail) => { socket.onopen = ok; socket.onerror = fail; });
    let next = 0; const pending = new Map();
    const blocked = [], interceptionErrors = [], canceledRequests = new Set();
    socket.onmessage = ({ data }) => {
      const message = JSON.parse(data), task = pending.get(message.id);
      if (message.method === 'Network.loadingFailed' && message.params.canceled) {
        canceledRequests.add(message.params.requestId);
        return;
      }
      if (message.method === 'Fetch.requestPaused') {
        const { request, requestId, networkId } = message.params;
        const safe = new URL(request.url).origin === safeOrigin && ['GET', 'HEAD'].includes(request.method);
        if (!safe) blocked.push(request.url);
        send(safe ? 'Fetch.continueRequest' : 'Fetch.failRequest', safe ? { requestId } : { requestId, errorReason: 'BlockedByClient' }, message.sessionId).catch(e => interceptionErrors.push({ error: e.message, url: request.url, networkId, safe }));
        return;
      }
      if (!task) return;
      pending.delete(message.id); clearTimeout(task.timer);
      message.error ? task.fail(Error(JSON.stringify(message.error))) : task.ok(message.result);
    };
    const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
      const id = ++next, timer = setTimeout(() => { pending.delete(id); fail(Error(`CDP timeout: ${method}`)); }, 20000);
      pending.set(id, { ok, fail, timer }); socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const cdp = (method, params) => send(method, params, sessionId);
    const evaluate = async expression => {
      const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await cdp('Page.enable');
    if (safeOrigin) {
      await cdp('Network.enable');
      await cdp('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    }
    // A safe same-origin request the browser itself canceled (e.g. superseded navigation) can no longer be
    // continued and yields "Invalid InterceptionId"; only that confirmed case is tolerated, never a blocked request.
    const isConfirmedCancellation = item => item.safe && item.error.includes('Invalid InterceptionId') && canceledRequests.has(item.networkId);
    const unhandledInterceptionErrors = () => interceptionErrors.filter(item => !isConfirmedCancellation(item));
    return { cdp, evaluate, close, blocked, interceptionErrors, unhandledInterceptionErrors };
  } catch (e) { await close(); throw e; }
}
export const ready = `new Promise((ok,fail)=>{const end=Date.now()+15000;const poll=()=>document.readyState==='complete'?Promise.all([...document.images].map(i=>i.decode())).then(()=>document.fonts.ready).then(()=>ok(true),fail):Date.now()>end?fail(Error('Page readiness timed out')):setTimeout(poll,50);poll()})`;
