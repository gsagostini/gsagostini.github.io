import feedparser
import json
from bs4 import BeautifulSoup

FEED_URL = "https://www.goodreads.com/review/list_rss/156196841?shelf=read"
OUTPUT = "_data/goodreads_books.json"
MAX_BOOKS = 12

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

    books.append({
        "title": entry.title,
        "author": entry.author,
        "cover": cover_url,
        "rating": rating,
        "review": review_text,
        "url": entry.link
    })

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(books, f, indent=2, ensure_ascii=False)
