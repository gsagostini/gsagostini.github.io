"""Refresh the Fun page's books from Goodreads' public custom shelf widget."""

import ast
from html import escape, unescape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_data/goodreads_books.json"
USER_ID = 156196841
MAX_BOOKS = 15
WIDGET_URL = f"https://www.goodreads.com/review/custom_widget/{USER_ID}?" + urlencode({
    "shelf": "read",
    "sort": "date_read",
    "order": "d",
    "num_books": MAX_BOOKS,
    "show_cover": 1,
    "show_author": 1,
    "show_rating": 1,
    "show_review": 1,
})


def widget_html(script):
    match = re.search(r"var widget_code\s*=\s*('(?:\\.|[^'\\])*')", script, re.S)
    if not match:
        raise ValueError("Goodreads did not return its custom widget")
    # The endpoint returns JavaScript containing an HTML string. Parse the string
    # without running any JavaScript from Goodreads.
    return ast.literal_eval(match.group(1)).replace(r"\/", "/")


class WidgetParser(HTMLParser):
    FIELDS = {
        "gr_custom_book_container_": "book",
        "gr_custom_rating_": "rating",
        "gr_custom_title_": "title",
        "gr_custom_author_": "author",
        "gr_custom_review_": "review",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.item_depth = None
        self.item = None
        self.field = None
        self.field_depth = None
        self.parts = []
        self.books = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "div":
            self.depth += 1
            classes = attrs.get("class", "").split()
            if "gr_custom_each_container_" in classes:
                self.item_depth = self.depth
                self.item = {"rating": 0, "rating_images": 0}
            elif self.item is not None:
                for css_class, field in self.FIELDS.items():
                    if css_class in classes:
                        self.field = field
                        self.field_depth = self.depth
                        self.parts = []
                        break
        elif self.item is not None:
            if tag == "a" and self.field == "title":
                self.item["link"] = attrs.get("href", "")
            elif tag == "img" and self.field == "book":
                self.item["cover"] = attrs.get("src", "")
            elif tag == "img" and self.field == "rating":
                self.item["rating_images"] += 1
                if attrs.get("src", "").endswith("gr_flat_red_star_active.png"):
                    self.item["rating"] += 1
            elif tag == "br" and self.field == "review":
                self.parts.append(" ")

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_data(self, data):
        if self.field in ("title", "author", "review"):
            self.parts.append(data)

    def handle_endtag(self, tag):
        if tag != "div":
            return
        if self.item is not None and self.field_depth == self.depth:
            value = re.sub(r"\s+", " ", "".join(self.parts)).strip()
            if self.field == "author":
                value = re.sub(r"^by\s+", "", value, flags=re.I)
            if self.field in ("title", "author", "review"):
                self.item[self.field] = value
            self.field = None
            self.field_depth = None
        if self.item is not None and self.item_depth == self.depth:
            self.books.append(self.item)
            self.item = None
            self.item_depth = None
        self.depth -= 1


class TextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def plain_text(value):
    parser = TextParser()
    parser.feed(value)
    return re.sub(r"\s+", " ", "".join(parser.parts)).strip()


def same_opening(full_review, excerpt):
    # Widget HTML sometimes inserts a space beside a link that the saved RSS
    # review did not include. Ignore whitespace when comparing the opening.
    full = re.sub(r"\s+", "", plain_text(full_review))
    opening = re.sub(r"\s+", "", excerpt.rstrip(". …"))
    return bool(opening) and full.startswith(opening)


def valid_goodreads_review(url):
    parsed = urlparse(unescape(url))
    return parsed.scheme == "https" and parsed.hostname == "www.goodreads.com" and parsed.path.startswith("/review/show/")


def refresh(script, previous):
    parser = WidgetParser()
    parser.feed(widget_html(script))
    if len(parser.books) < min(5, len(previous) or 5):
        raise ValueError(f"Goodreads returned only {len(parser.books)} books; existing data was kept")

    old_by_link = {urlparse(book["link"]).path: book for book in previous}
    books = []
    for item in parser.books[:MAX_BOOKS]:
        link = unescape(item.get("link", ""))
        title = item.get("title", "")
        author = item.get("author", "")
        cover = unescape(item.get("cover", ""))
        if not (title and author and cover and valid_goodreads_review(link) and item["rating_images"] == 5):
            raise ValueError("Goodreads widget is missing a book field; existing data was kept")
        old = old_by_link.get(urlparse(link).path, {})
        excerpt = item.get("review", "")
        old_review = old.get("review", "")
        # The widget shortens reviews. Keep a saved full review when its opening
        # still matches the current excerpt; otherwise publish the new excerpt.
        if old_review and same_opening(old_review, excerpt):
            review = old_review
        elif excerpt:
            review = escape(excerpt)
        else:
            review = old_review

        books.append({
            "title": title,
            "author": author,
            "link": link,
            "cover": cover.replace("_SX50_", "_SX318_").replace("_SY75_", "_SY475_"),
            "rating": str(item["rating"]),
            "read_date": old.get("read_date", ""),
            "review": review,
        })
    return books


def main():
    request = Request(WIDGET_URL, headers={"User-Agent": "Mozilla/5.0", "Accept": "text/javascript"})
    with urlopen(request, timeout=30) as response:
        script = response.read().decode("utf-8")
    previous = json.loads(OUTPUT.read_text(encoding="utf-8"))
    books = refresh(script, previous)
    OUTPUT.write_text(json.dumps(books, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {len(books)} Goodreads books")


if __name__ == "__main__":
    main()
