import feedparser
import json
from bs4 import BeautifulSoup
from datetime import datetime
import re

FEED_URL = "https://www.goodreads.com/review/list_rss/156196841?key=IE7KV2goTvy3dH87fVMVx5Ziq9vI-6_nynALgkymn6yT3YYP&shelf=read"
OUTPUT_PATH = "_data/goodreads_books.json"
MAX_BOOKS = 15

feed = feedparser.parse(FEED_URL)

books = []

for entry in feed.entries[:MAX_BOOKS]:
    soup = BeautifulSoup(entry.get("summary", ""), "html.parser")

    # --- Cover image ---
    img = soup.find("img")
    cover = img["src"] if img else ""
    cover = cover.replace("_SX50_", "_SX318_").replace("_SY75_", "_SY475_")

    # --- Raw text ---
    text = soup.get_text("\n", strip=True)

    # --- Split metadata vs review ---
    review = ""
    if "review:" in text.lower():
        review = re.split(r"review:\s*", text, flags=re.IGNORECASE, maxsplit=1)[1].strip()

    # --- Metadata extraction ---
    def extract_field(label):
        pattern = rf"{label}:\s*(.+)"
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else ""

    author = extract_field("author") or entry.get("book_author") or "Unknown"
    rating = extract_field("average rating")
    read_date = extract_field("read at")

    # Normalize rating (keep integer if possible)
    if rating:
        rating = rating.split()[0]

    books.append({
        "title": entry.get("title", ""),
        "author": author,
        "link": entry.get("link", ""),
        "cover": cover,
        "rating": entry.user_rating,
        "read_date": read_date,
        "review": review
    })

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(books, f, indent=2, ensure_ascii=False)

print(f"Updated {len(books)} books at {datetime.utcnow().isoformat()}")
