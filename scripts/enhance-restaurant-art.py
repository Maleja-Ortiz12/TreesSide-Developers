"""Enhance exact updated-restaurant mockup crops with portable Real-ESRGAN.

Run: python scripts/enhance-restaurant-art.py
Downloads the pinned official Windows release into ignored node_modules/.cache;
does not install packages or alter the source mockup. Outputs new WebP files.
"""
from pathlib import Path
import hashlib
import io
import json
import subprocess
import urllib.request
import zipfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'node_modules/.cache/restaurant-ai'
URL = ('https://github.com/xinntao/Real-ESRGAN/releases/download/'
       'v0.2.5.0/realesrgan-ncnn-vulkan-20220424-windows.zip')
SOURCE = ROOT / 'Images/mockup de restaurantes.png'
CROPS = {
    # Omit the mockup navigation and live headings/CTAs; keep the actual scene.
    'hero': (110, 235, 787, 426),
    'pos': (51, 1042, 739, 1384),
    'web': (495, 615, 732, 696),
    'ventas': (495, 719, 732, 800),
    'operacion': (495, 824, 732, 908),
}


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    archive = CACHE / 'realesrgan-windows-20220424.zip'
    if not archive.exists():
        request = urllib.request.Request(URL, headers={'User-Agent': 'RestaurantArtEnhancement/1.0'})
        print('Downloading pinned official Real-ESRGAN release', flush=True)
        with urllib.request.urlopen(request, timeout=90) as response:
            payload = response.read()
        if not zipfile.is_zipfile(io.BytesIO(payload)):
            raise RuntimeError('Official release download is not a valid ZIP archive')
        archive.write_bytes(payload)
    archive_hash = hashlib.sha256(archive.read_bytes()).hexdigest()
    tool = CACHE / 'tool'
    with zipfile.ZipFile(archive) as bundle:
        for entry in bundle.infolist():
            destination = (tool / entry.filename).resolve()
            if not destination.is_relative_to(tool.resolve()):
                raise RuntimeError('Unsafe archive path')
        bundle.extractall(tool)
    executables = list(tool.rglob('realesrgan-ncnn-vulkan.exe'))
    if len(executables) != 1:
        raise RuntimeError('Expected exactly one official Real-ESRGAN executable')
    executable = executables[0]
    output = ROOT / 'public/images/services/restaurantes'
    output.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert('RGB')
    records = []
    for name, box in CROPS.items():
        cropped = source.crop(box)
        input_path = CACHE / f'{name}-input.png'
        enhanced_path = CACHE / f'{name}-4x.png'
        cropped.save(input_path)
        # The UI model retains fine panel edges; the scene model handles food/table art.
        model = 'realesrgan-x4plus' if name == 'hero' else 'realesr-animevideov3'
        command = [str(executable), '-i', str(input_path), '-o', str(enhanced_path),
                   '-m', str(executable.parent / 'models'), '-n', model,
                   '-s', '4', '-t', '128', '-j', '1:2:2']
        print(f'Enhancing {name}: {cropped.size}, model={model}, scale=4', flush=True)
        with (CACHE / f'{name}-inference.log').open('w', encoding='utf-8') as log:
            subprocess.run(command, check=True, stdout=log, stderr=subprocess.STDOUT,
                           timeout=600, cwd=executable.parent)
        with Image.open(enhanced_path) as enhanced:
            expected = (cropped.width * 4, cropped.height * 4)
            if enhanced.size != expected:
                raise RuntimeError(f'{name}: output size {enhanced.size} != {expected}')
            target = output / f'{name}-ai.webp'
            enhanced.convert('RGB').save(target, 'WEBP', quality=95, method=6)
            record = {'name': name, 'source': str(SOURCE.relative_to(ROOT)),
                      'crop': box, 'model': model, 'scale': 4,
                      'size': expected, 'output': str(target.relative_to(ROOT)),
                      'bytes': target.stat().st_size,
                      'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}
            records.append(record)
            print(json.dumps(record), flush=True)
    manifest = {'source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
                'official_release': URL, 'archive_sha256': archive_hash, 'images': records}
    (CACHE / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    print('Completed five exact-crop AI enhancements; provenance in ignored cache.', flush=True)


if __name__ == '__main__':
    main()
