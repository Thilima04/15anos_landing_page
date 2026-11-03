"""Rebuild the invitation's optimized images and download its local font assets."""
from pathlib import Path
from urllib.request import urlopen
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
images = ROOT / 'assets' / 'images'
fonts = ROOT / 'assets' / 'fonts'
images.mkdir(parents=True, exist_ok=True)
fonts.mkdir(parents=True, exist_ok=True)

with Image.open(ROOT / 'floral-background.png') as source:
    for width in (480, 768, 1024):
        resized = source.resize((width, round(source.height * width / source.width)), Image.Resampling.LANCZOS)
        output = images / f'floral-{width}.webp'
        resized.save(output, 'WEBP', quality=82, method=6)
        print(f'{output.relative_to(ROOT)}: {output.stat().st_size:,} bytes')

downloads = {
    'cormorant-garamond-latin.woff2': 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2',
    'great-vibes-latin.woff2': 'https://fonts.gstatic.com/s/greatvibes/v21/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2',
    'Cormorant-Garamond-OFL.txt': 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt',
    'Great-Vibes-OFL.txt': 'https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/OFL.txt',
}
for name, url in downloads.items():
    output = fonts / name
    if not output.exists():
        with urlopen(url, timeout=30) as response:
            output.write_bytes(response.read())
    print(f'{output.relative_to(ROOT)}: {output.stat().st_size:,} bytes')
