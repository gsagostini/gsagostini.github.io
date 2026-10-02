/* Fun + Mezcal pages — small progressive enhancements; the page works without them:
   covers link to Goodreads, the Mezcal photos scroll and snap natively, the teaser falls back to a YouTube link. */
(() => {
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => (reduce.matches ? 'auto' : 'smooth');
  const lock = (on) => { doc.style.overflow = on ? 'hidden' : ''; };   // page scroll while an overlay is open

  /* 1 — section nav: show the group currently in view (same as the homepage chrome) */
  (() => {
    const nav = document.querySelector('.toc');
    if (!nav || !('IntersectionObserver' in window)) return;
    const list = nav.querySelector('ul');
    const links = new Map([...nav.querySelectorAll('a[href^="#"]')].map((a) => [a.hash.slice(1), a]));
    let current = null;
    const activate = (id) => {
      if (id === current) return;
      current = id;
      links.forEach((a, key) => {
        const on = key === id;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      const a = links.get(id);
      if (a && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2, behavior: behavior() });
      }
    };
    const first = links.keys().next().value;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) activate(e.target.id); });
    }, { rootMargin: '-30% 0px -65% 0px' });
    activate(first);
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    /* above the first group (page head, phone profile) the first group is the current one */
    const firstEl = document.getElementById(first);
    if (firstEl) {
      window.addEventListener('scroll', () => {
        if (firstEl.getBoundingClientRect().top > window.innerHeight * 0.35) activate(first);
      }, { passive: true });
    }
  })();

  /* 1b — phones: the section bar scrolls sideways when its tabs don't fit; fade the edge that has more */
  (() => {
    const list = document.querySelector('.fun .toc ul');
    if (!list) return;
    const update = () => {
      const max = list.scrollWidth - list.clientWidth;
      const x = list.scrollLeft;
      list.dataset.more = max <= 1 ? 'none' : x <= 1 ? 'end' : x >= max - 1 ? 'start' : 'both';
    };
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    /* a page marked in the bar itself (the Mezcal page): bring its tab into view */
    const here = list.querySelector('a[aria-current="page"]');
    if (here && list.scrollWidth > list.clientWidth) list.scrollLeft = here.offsetLeft - (list.clientWidth - here.offsetWidth) / 2;
  })();

  /* 2 — lite YouTube: nothing is loaded from YouTube until the play button is pressed */
  document.querySelectorAll('.fun .teaser').forEach((fig) => {
    const btn = fig.querySelector('.teaser-play');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = fig.dataset.embed;
      f.title = fig.dataset.title;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      const frame = fig.querySelector('.teaser-frame');
      frame.replaceChildren(f);
      frame.classList.add('is-playing');
      f.focus();
    }, { once: true });
  });

  /* 3 — Mezcal slideshow: one photo at a time. The track is a native scroll-snap strip, so swipe,
     trackpad and scrollbar already work without this script; it adds prev / next (wrapping round),
     the "3 / 7" counter, the dots, and ← → Home End while the slideshow has focus. No autoplay. */
  document.querySelectorAll('.fun [data-show]').forEach((show) => {
    const track = show.querySelector('.show-track');
    const slides = [...track.querySelectorAll('.slide')];
    const n = slides.length;
    const prev = show.querySelector('.show-prev');
    const next = show.querySelector('.show-next');
    const dots = [...show.querySelectorAll('.show-dot')];
    const cur = show.querySelector('.show-cur');
    const live = show.querySelector('.show-live');
    if (!n || !prev || !next || !cur) return;
    let index = 0;   // the photo in view
    let want = 0;    // the photo we are heading to (clicks during a glide add up)
    let tLive = 0;
    let tEnd = 0;
    let raf = 0;
    let gliding = false;   // a scroll started by the buttons, dots or keys is under way
    show.classList.add('is-enhanced');

    const load = (i) => {   // start loading a photo (and its soft backdrop) before it is needed
      slides[(i + n) % n].querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
    };
    const render = (i) => {
      if (i === index) return;
      index = i;
      if (!gliding) want = i;   // a swipe or trackpad scroll moves the target along with it
      cur.textContent = String(i + 1);
      dots.forEach((d, k) => { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      load(i + 1);
      load(i - 1);
      clearTimeout(tLive);
      tLive = setTimeout(() => { if (live) live.textContent = `Photo ${index + 1} of ${n}`; }, 450);
    };
    const go = (i) => {
      const wrap = i < 0 || i >= n;   // last → first (and back) jumps instead of rewinding past every photo
      const t = (i + n) % n;
      want = t;
      gliding = t !== index;
      load(t);
      track.scrollTo({ left: t * track.clientWidth, behavior: wrap ? 'auto' : behavior() });
    };

    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = track.clientWidth || 1;
        render(Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / w))));
      });
      clearTimeout(tEnd);
      tEnd = setTimeout(() => { gliding = false; want = index; }, 160);   // settled
    }, { passive: true });

    prev.addEventListener('click', () => go(want - 1));
    next.addEventListener('click', () => go(want + 1));
    /* the dots are for pointers (keyboards have ← → Home End and the two buttons): tabindex=-1 in the markup */
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    show.addEventListener('keydown', (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest('.show-more')) return;
      const to = { ArrowLeft: want - 1, ArrowRight: want + 1, Home: 0, End: n - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      go(to);
    });
    /* keep the current photo in place when the frame changes size */
    if ('ResizeObserver' in window) {
      let w0 = track.clientWidth;
      new ResizeObserver(() => {
        if (track.clientWidth === w0) return;
        w0 = track.clientWidth;
        track.scrollTo({ left: index * w0, behavior: 'auto' });
      }).observe(track);
    }
    /* fetch the neighbours of the first photo once the slideshow is close to the screen */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        load(1);
        load(n - 1);
        io.disconnect();
      }, { rootMargin: '600px 0px' });
      io.observe(show);
    }
  });

  /* 4 — Goodreads shelf (G1). Mouse: hover shows the review beside the cover, click opens Goodreads
     (as today). Keyboard: focus shows it, Tab reaches the scrollable review, Enter opens Goodreads,
     Esc closes. Touch: a tap opens a bottom sheet instead of a hover popup. */
  (() => {
    const shelf = document.querySelector('.fun .shelf');
    if (!shelf) return;
    const books = [...shelf.querySelectorAll('.book')];
    const sheet = document.querySelector('.fun .sheet');
    let openBook = null;
    let tOpen = 0;
    let tClose = 0;
    let quiet = false;
    let lastPointer = 'mouse';
    window.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; }, { capture: true, passive: true });
    window.addEventListener('keydown', () => { lastPointer = 'key'; }, { capture: true });

    /* beside the cover (right, else left); below / above it when neither side fits; always on screen,
       and never over the cover itself: when neither below nor above has room for the whole popover, it
       takes the roomier of the two and its review scrolls in a shorter panel */
    const place = (book) => {
      const pop = book.querySelector('.pop');
      const cover = book.querySelector('.book-cover');
      pop.style.left = '0px';
      pop.style.top = '0px';
      pop.style.maxHeight = '';
      const m = 12;
      const gap = 14;
      const vw = doc.clientWidth;
      const vh = window.innerHeight;
      const c = cover.getBoundingClientRect();
      const o = book.getBoundingClientRect();
      const pw = pop.offsetWidth;
      let ph = pop.offsetHeight;
      let x;
      let y;
      let side;
      if (c.right + gap + pw <= vw - m) { x = c.right + gap; side = 'right'; }
      else if (c.left - gap - pw >= m) { x = c.left - gap - pw; side = 'left'; }
      if (side) {
        y = Math.max(m, Math.min(c.top, vh - m - ph));
      } else {
        x = Math.max(m, Math.min(c.left + c.width / 2 - pw / 2, vw - m - pw));
        const below = vh - m - (c.bottom + gap);
        const above = c.top - gap - m;
        side = ph <= below || (ph > above && below >= above) ? 'below' : 'above';
        const room = side === 'below' ? below : above;
        if (ph > room && room >= 220) { pop.style.maxHeight = `${Math.floor(room)}px`; ph = pop.offsetHeight; }
        y = side === 'below' ? c.bottom + gap : c.top - gap - ph;
        if (y < m || y + ph > vh - m) y = Math.max(m, Math.min(y, vh - m - ph));   // tiny windows: stay on screen
      }
      pop.dataset.side = side;
      pop.style.left = `${Math.round(x - o.left)}px`;
      pop.style.top = `${Math.round(y - o.top)}px`;
    };
    const close = (book) => {
      book.classList.remove('is-open');
      book.querySelector('.pop').hidden = true;
      if (openBook === book) openBook = null;
    };
    const open = (book) => {
      clearTimeout(tClose);
      clearTimeout(tOpen);
      if (openBook === book) return;
      if (openBook) close(openBook);
      openBook = book;
      book.classList.add('is-open');
      const pop = book.querySelector('.pop');
      pop.hidden = false;
      const review = pop.querySelector('.pop-review');
      if (review) review.scrollTop = 0;
      place(book);
    };

    const openSheet = (book) => {
      if (openBook) close(openBook);
      const pop = book.querySelector('.pop');
      const body = sheet.querySelector('.sheet-body');
      body.replaceChildren(...[...pop.children].map((node) => node.cloneNode(true)));
      body.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      body.querySelectorAll('[tabindex="-1"]').forEach((node) => node.removeAttribute('tabindex'));
      if (!book.classList.contains('is-broken')) {
        const cover = book.querySelector('.book-cover img').cloneNode();
        cover.className = 'pop-cover';
        cover.alt = '';
        cover.loading = 'eager';
        body.querySelector('.pop-head').prepend(cover);
      }
      sheet.setAttribute('aria-label', `Review: ${pop.querySelector('.pop-title').textContent}`);
      sheet.showModal();
      lock(true);
      const review = body.querySelector('.pop-review');
      if (review) review.scrollTop = 0;
    };

    books.forEach((book) => {
      const cover = book.querySelector('.book-cover');
      const img = cover.querySelector('img');
      const broken = () => book.classList.add('is-broken');
      if (img.complete && img.naturalWidth === 0) broken();
      img.addEventListener('error', broken);

      book.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(tClose);
        clearTimeout(tOpen);
        tOpen = setTimeout(() => open(book), openBook ? 0 : 90);
      });
      book.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(tOpen);
        tClose = setTimeout(() => { if (!book.contains(document.activeElement)) close(book); }, 220);
      });
      book.addEventListener('focusin', (e) => {
        if (quiet) return;
        if (e.target === cover && !cover.matches(':focus-visible')) return;
        open(book);
      });
      book.addEventListener('focusout', (e) => {
        if (book.contains(e.relatedTarget) || book.matches(':hover')) return;
        close(book);
      });
      cover.addEventListener('click', (e) => {
        if (lastPointer !== 'touch' && lastPointer !== 'pen') return;   // mouse + keyboard follow the link
        if (!sheet || typeof sheet.showModal !== 'function') return;
        e.preventDefault();
        openSheet(book);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !openBook) return;
      const book = openBook;
      const cover = book.querySelector('.book-cover');
      const inside = book.contains(document.activeElement) && document.activeElement !== cover;
      close(book);
      if (inside) { quiet = true; cover.focus(); quiet = false; }
    });
    window.addEventListener('resize', () => { if (openBook) place(openBook); });

    if (sheet) {
      const panel = sheet.querySelector('.sheet-panel');
      sheet.querySelector('.sheet-close').addEventListener('click', () => sheet.close());
      sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close(); });
      sheet.addEventListener('close', () => { lock(false); panel.style.transform = ''; });
      /* drag the sheet's top down to dismiss it */
      let y0 = null;
      let dy = 0;
      panel.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' || !e.target.closest('.sheet-grip, .pop-head')) return;
        y0 = e.clientY;
        dy = 0;
        panel.setPointerCapture(e.pointerId);
      });
      panel.addEventListener('pointermove', (e) => {
        if (y0 === null) return;
        dy = Math.max(0, e.clientY - y0);
        panel.style.transform = `translateY(${dy}px)`;
      });
      const end = () => {
        if (y0 === null) return;
        y0 = null;
        panel.style.transform = '';
        if (dy > 80) sheet.close();
      };
      panel.addEventListener('pointerup', end);
      panel.addEventListener('pointercancel', end);
    }
  })();
})();
