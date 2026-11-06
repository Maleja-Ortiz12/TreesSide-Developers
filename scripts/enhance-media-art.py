"""Enhance exact new Streaming/Social mockup crops using the cached AI tool.

Usage: python scripts/enhance-media-art.py [--category streaming|redes-sociales]
Requires the official portable tool already cached by enhance-restaurant-art.py.
Never downloads tools, installs packages, or modifies the source mockups.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'node_modules/.cache/restaurant-ai'
SOURCES = {
    'streaming': ('Plataformas de streaming a tu medida-1 mockup actualizado.png', {
        'hero': ((500, 90, 1040, 338), 'realesrgan-x4plus'),
        'concept': ((151, 474, 844, 806), 'realesr-animevideov3'),
    }),
    'redes-sociales': ('Marca, fotografía y presencia digital-2 redes mockup actualizado.png', {
        'hero': ((560, 90, 1058, 388), 'realesrgan-x4plus'),
        'concept': ((18, 549, 1040, 857), 'realesr-animevideov3'),
        'cta-left': ((20, 1215, 290, 1357), 'realesrgan-x4plus'),
        'cta-right': ((845, 1255, 1040, 1358), 'realesrgan-x4plus'),
    }),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--category', choices=list(SOURCES), help='Enhance only this category; default: both.')
    args = parser.parse_args()
    binaries = list((CACHE / 'tool').rglob('realesrgan-ncnn-vulkan.exe'))
    if len(binaries) != 1:
        raise RuntimeError('Expected the existing official portable Real-ESRGAN cache; no download was attempted.')
    executable = binaries[0]
    scratch = CACHE / 'media-services'
    scratch.mkdir(parents=True, exist_ok=True)
    records = []
    for category in ([args.category] if args.category else SOURCES):
        filename, crops = SOURCES[category]
        source_path = ROOT / 'Images' / filename
        source_hash = hashlib.sha256(source_path.read_bytes()).hexdigest()
        with Image.open(source_path) as image:
            source = image.convert('RGB')
        output = ROOT / 'public/images/services' / category
        output.mkdir(parents=True, exist_ok=True)
        for name, (box, model) in crops.items():
            if not (0 <= box[0] < box[2] <= source.width and 0 <= box[1] < box[3] <= source.height):
                raise ValueError(f'{category}/{name}: crop is outside the original image')
            crop = source.crop(box)
            stem = f'{category}-{name}'
            input_path, result_path = scratch / f'{stem}-input.png', scratch / f'{stem}-4x.png'
            crop.save(input_path)
            print(f'Enhancing {stem}: {crop.size}, {model}, scale=4', flush=True)
            command = [str(executable), '-i', str(input_path), '-o', str(result_path),
                       '-m', str(executable.parent / 'models'), '-n', model,
                       '-s', '4', '-t', '128', '-j', '1:2:2']
            with (scratch / f'{stem}.log').open('w', encoding='utf-8') as log:
                subprocess.run(command, check=True, stdout=log, stderr=subprocess.STDOUT,
                               timeout=600, cwd=executable.parent)
            with Image.open(result_path) as enhanced:
                expected = (crop.width * 4, crop.height * 4)
                if enhanced.size != expected:
                    raise RuntimeError(f'{stem}: unexpected enhanced dimensions {enhanced.size}')
                target = output / f'{name}-ai.webp'
                enhanced.convert('RGB').save(target, 'WEBP', quality=95, method=6)
                record = {'category': category, 'name': name,
                          'source': str(source_path.relative_to(ROOT)), 'source_sha256': source_hash,
                          'crop': box, 'model': model, 'scale': 4, 'size': expected,
                          'output': str(target.relative_to(ROOT)), 'bytes': target.stat().st_size,
                          'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}
                records.append(record)
                print(json.dumps(record, ensure_ascii=True), flush=True)
        if hashlib.sha256(source_path.read_bytes()).hexdigest() != source_hash:
            raise RuntimeError(f'{category}: original source changed during processing')
    manifest = scratch / f'manifest-{args.category or "all"}.json'
    manifest.write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f'Completed {len(records)} exact-crop AI enhancements; provenance: {manifest}', flush=True)


if __name__ == '__main__':
    main()
