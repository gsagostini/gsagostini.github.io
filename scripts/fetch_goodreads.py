import feedparser
import json
import re
from bs4 import BeautifulSoup
from pathlib import Path

# ======================
# Configuration
# ======================

GOODREADS_FEED_URL = (
    "https://www.goodreads.com/review/list_rss/156196841"
    "?key=IE7KV2goTvy3dH87fVMVx5Ziq9vI-6_nynALgkymn6yT3YYP"
    "&shelf=read"
)

MAX_BOOKS = 15

OUTPUT_PATH = Path("_data/goodreads.json")

# ======================
# Fetch feed
# ======================

feed = feedparser.parse(GOODREADS_FEED_URL)

books = []

# ======================
# Parse entries
# ======================

for entry in feed.entries[:MAX_BOOKS]:
    soup = BeautifulSoup(entry.summary, "html.parser")

    # ------------------
    # Extract author
    # ------------------
    author = "Unknown"
    for line in soup.get_text("\n").split("\n"):
        line = line.strip()
        if line.lower().startswith("author:"):
            author = line.replace("author:", "").strip()
            break

    # ------------------
    # Extract review text
    # ------------------
    review_text = ""

    # Goodreads puts "review:" label in plain text
    full_text = soup.get_text("\n")
    parts = re.split(r"\breview:\b", full_text, flags=re.IGNORECASE)

    if len(parts) > 1:
        review_text = parts[1].strip()

    # ------------------
    # Extract cover image
    # ------------------
    cover = ""
    if hasattr(entry, "media_thumbnail"):
        try:
            cover = entry.media_thumbnail[0]["url"]
        except (KeyError, IndexError):
            pass

    # ------------------
    # Extract rating
    # ------------------
    rating = ""
    for line in full_text.split("\n"):
        line = line.strip()
        if line.lower().startswith("rating:"):
            rating = line.replace("rating:", "").strip()
            break

    books.append({
        "title": entry.title,
        "author": author,
        "link": entry.link,
        "cover": cover,
        "rating": rating,
        "review": review_text
    })

# ======================
# Write JSON
# ======================

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(books)} books to {OUTPUT_PATH}")
