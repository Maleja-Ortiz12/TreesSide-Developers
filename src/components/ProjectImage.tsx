'use client';

import { useState, useSyncExternalStore } from 'react';
import Image, { type ImageProps } from 'next/image';

const subscribe = (notify: () => void) => {
  window.addEventListener('resize', notify);
  return () => window.removeEventListener('resize', notify);
};
const displayDensity = () => window.devicePixelRatio || 1;
const serverDensity = () => 1;

export function useDisplayDensity() {
  return useSyncExternalStore(subscribe, displayDensity, serverDensity);
}

/** Preserve native raster detail on high-density screens; vectors can scale freely. */
export function ProjectImage({ src, style, onLoad, ...props }: ImageProps & { src: string }) {
  const density = useDisplayDensity();
  const [natural, setNatural] = useState<{ src: string; width: number; height: number } | null>(null);
  const raster = !src.split('?')[0].endsWith('.svg');
  const size = raster && natural?.src === src ? natural : null;
  return <Image {...props} src={src} data-project-media=""
    onLoad={event => {
      const image = event.currentTarget;
      if (image.naturalWidth && image.naturalHeight) {
        setNatural({ src, width: image.naturalWidth, height: image.naturalHeight });
      }
      onLoad?.(event);
    }}
    style={{ ...style, objectFit: 'contain', margin: 'auto',
      ...(size ? { maxWidth: `${Math.floor(size.width / density)}px`, maxHeight: `${Math.floor(size.height / density)}px` } : {}),
    }} />;
}
