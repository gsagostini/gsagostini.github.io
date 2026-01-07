import feedparser
import json
from bs4 import BeautifulSoup

FEED_URL = "https://www.goodreads.com/review/list_rss/156196841?shelf=read"
OUTPUT = "_data/goodreads_books.json"
MAX_BOOKS = 15

def get_author(entry):
    if hasattr(entry, "authors") and entry.authors:
        return entry.authors[0].get("name", "Unknown")
    if hasattr(entry, "dc_creator"):
        return entry.dc_creator
    if hasattr(entry, "author"):
        return entry.author
    return "Unknown"

feed = feedparser.parse(FEED_URL)
books = []

for entry in feed.entries[:MAX_BOOKS]:
    soup = BeautifulSoup(entry.description, "html.parser")

    cover = soup.find("img")
    cover_url = cover["src"] if cover else ""

    rating_tag = soup.find("span", class_="staticStars")
    rating = rating_tag["title"][0] if rating_tag else ""

    review = soup.find("div", class_="reviewText")
    review_text = review.get_text(strip=True) if review else ""
    book = {
        "title": entry.title,
        "author": get_author(entry),
        "link": entry.link,
        "cover": entry.get("book_large_image_url")
                 or entry.get("book_medium_image_url")
                 or entry.get("book_small_image_url"),
        "rating": entry.get("user_rating"),
        "review": entry.get("summary", "").strip()
    }

    books.append(book)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(books, f, indent=2, ensure_ascii=False)
