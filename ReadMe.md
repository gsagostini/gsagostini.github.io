## Personal Webpage

My personal webpage, built by GitHub Pages (Jekyll) from this repository: edit a file on GitHub (or push a
change) and the site rebuilds itself in a minute or two. The original template was provided by
[Karl Broman](https://github.com/kbroman).

### Where things live

| To change…                     | edit                                    |
|--------------------------------|-----------------------------------------|
| the bio (About)                | `index.md` (Markdown, below the second `---`) |
| news                           | `_data/news.yml`                        |
| publications                   | `_data/publications.yml`                |
| talks                          | `_data/talks.yml`                       |
| the Fun page (film, essays, Mezcal, section order) | `_data/fun.yml`     |
| cocktail menus                 | `_data/cocktails.yml` + the PDF in `documents/cocktails/` |
| the CV                         | replace `documents/Agostini_CV.pdf` (keep the name) |
| Mezcal photos                  | drop a photo in `documents/cat/` (the Mezcal page lists every photo there) |
| name, email, photo, profile links, look (font, colour, background, dark mode and where its button sits) | `_config.yml` → `style:` |

Each `_data` file starts with a short "how to" comment. Keep the indentation (two spaces) as in the existing entries.

**News** — paste two lines at the top of `_data/news.yml`:

```yaml
- date: Oct 2026
  text: "Our paper was accepted at [VENUE](https://example.com)! Markdown works: **bold**, *italic*."
```

The homepage shows the newest `news_limit` items (set in `_config.yml`); older ones fold under "Older news".

**Publications** — copy an entry in `_data/publications.yml` and edit it. Only `title` and `authors` are required:

```yaml
- title: "Paper title"
  authors: "Gabriel Agostini, Coauthor One*, Coauthor Two*"   # your name is bolded automatically; * = equal contribution
  venue: "Conference or journal"
  year: 2026
  pages: "1–12"                  # optional
  paper: "https://…"             # optional: the TITLE becomes this link (no paper → plain title)
  group: working                 # only for working papers (they are listed first)
  status: "Under review"         # optional label before the venue (e.g. "To appear"); delete the line for none
  badges: ["Best Paper Award"]   # optional
  project: "https://…"           # optional buttons: project, arxiv, code, data, poster, slides, video, bluesky, twitter
```

Delete a line to remove that piece (e.g. delete `arxiv:` to drop the arXiv button).

### Things that update themselves

- **Goodreads books** (Fun page): `.github/workflows/goodreads.yml` refreshes `_data/goodreads_books.json` daily.
- **Cocktail-menu covers**: when a PDF in `documents/cocktails/` is pushed, `.github/workflows/menu-thumbnails.yml`
  renders its first page to `assets/images/menus/<name>.jpg` (and its size to `_data/menu_covers.json`).

### Preview a look without editing

Add switches to any page's address, e.g. `/?accent=forest`, `/?font=inter`, `/?bg=white`, `/?accent=336699`
(any hex colour), `/?profile=centered`, `/?theme=dark`, `/?toggle=menu`. To keep a look, set it under `style:` in `_config.yml`.

---

To the extent possible under law,
has waived all copyright and related or neighboring rights to
&ldquo;[simple site](https://github.com/kbroman/simple_site)&rdquo;.
This work is published from the United States.
<br/>
[![CC0](https://i.creativecommons.org/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)
