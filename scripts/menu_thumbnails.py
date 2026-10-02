"""Render the first page of every cocktail-menu PDF as a JPEG cover image.

    python scripts/menu_thumbnails.py

documents/cocktails/<name>.pdf  ->  assets/images/menus/<name>.jpg   (longest side 1400px)
Only (re)renders when the image is missing or older than its PDF. Also writes _data/menu_covers.json
({"<name>": [width, height]}) so the Fun page can show every cover whole, all at one scale. Runs automatically on GitHub
(.github/workflows/menu-thumbnails.yml) whenever a menu PDF is pushed, so adding a new menu is just:
drop the PDF into documents/cocktails/ and list it in _data/cocktails.yml.
"""
import json
import pathlib

import pymupdf
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "documents" / "cocktails"
OUT = ROOT / "assets" / "images" / "menus"
LONG_SIDE = 1400

SIZES = ROOT / "_data" / "menu_covers.json"

OUT.mkdir(parents=True, exist_ok=True)
for pdf in sorted(SRC.glob("*.pdf")):
    jpg = OUT / (pdf.stem + ".jpg")
    if jpg.exists() and jpg.stat().st_mtime >= pdf.stat().st_mtime:
        continue
    page = pymupdf.open(pdf)[0]
    zoom = LONG_SIDE / max(page.rect.width, page.rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom))
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img.save(jpg, quality=84, optimize=True, progressive=True)
    print(f"rendered {pdf.name} -> {jpg.relative_to(ROOT)} ({img.width}x{img.height})")

sizes = {j.stem: list(Image.open(j).size) for j in sorted(OUT.glob("*.jpg"))}
new = json.dumps(sizes, indent=2) + "\n"
if not SIZES.exists() or SIZES.read_text() != new:
    SIZES.write_text(new)
    print(f"wrote {SIZES.relative_to(ROOT)}")
