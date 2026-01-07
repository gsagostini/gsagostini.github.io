import feedparser
import json
from bs4 import BeautifulSoup
from datetime import datetime

FEED_URL = "https://www.goodreads.com/review/list_rss/156196841?key=IE7KV2goTvy3dH87fVMVx5Ziq9vI-6_nynALgkymn6yT3YYP&shelf=read"
OUTPUT_PATH = "_data/goodreads_books.json"
MAX_BOOKS = 15

feed = feedparser.parse(FEED_URL)

books = []

for entry in feed.entries[:MAX_BOOKS]:
    # --- Parse summary HTML ---
    soup = BeautifulSoup(entry.get("summary", ""), "html.parser")

    # --- Cover image ---
    img = soup.find("img")
    cover = img["src"] if img else ""

    # --- Rating ---
    rating = ""
    if "rating" in entry:
        rating = entry.rating
    else:
        # fallback: try to find stars text
        text = soup.get_text(" ", strip=True)
        if "Rating:" in text:
            rating = text.split("Rating:")[1].strip()[0]

    # --- Review text ---
    # Remove images and strong labels
    for tag in soup(["img", "strong"]):
        tag.decompose()

    review_text = soup.get_text("\n", strip=True)

    # Goodreads often repeats title/author boilerplate — clean it
    review_lines = [
        line.strip()
        for line in review_text.splitlines()
        if line.strip() and not line.lower().startswith("rating")
    ]

    review = "\n".join(review_lines)

    # --- Author ---
    author = (
        entry.get("book_author")
        or entry.get("author")
        or "Unknown"
    )

    books.append({
        "title": entry.get("title", ""),
        "author": author,
        "link": entry.get("link", ""),
        "cover": cover,
        "rating": rating,
        "review": review
    })

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(books, f, indent=2, ensure_ascii=False)

print(f"Updated {len(books)} books at {datetime.utcnow().isoformat()}")
