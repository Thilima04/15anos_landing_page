"""Package only the files needed to publish the static invitation."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
files = [root / name for name in ('index.html', 'style.css', 'script.js', 'robots.txt', 'vercel.json', 'README.txt')]
files += sorted((root / 'assets').rglob('*'))
output = root / 'convite-julia-otimizado.zip'
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path in files:
        if path.is_file():
            archive.write(path, path.relative_to(root))
print(f'{output.name}: {output.stat().st_size:,} bytes')
