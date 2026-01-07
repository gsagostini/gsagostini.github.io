---
layout: page
title: Fun
permalink: /fun/
---

<div class="container">
  <div class="fun-container">

    <!-- LEFT COLUMN -->
    <div class="fun-left">

      <!-- Urban+ section -->
      <div class="section-header">
        <h2 class="section-title">Urban+</h2>
        <div class="fun-list">
          <div class="fun-item">
            <p>I have written a lot about cities and geography during my undergrad. Here is some of that work:</p>

            <p><b>Brazilian Urban Planning: </b></p>
            <ul>
              <li>
                In the essay
                <a href="{{ site.baseurl }}/documents/urban/rio.pdf">
                  Naturally Artificial: Continuity and Change in the Street Network of Rio de Janeiro
                </a>,
                I use street network analysis on historical maps to study the change in the street layout of Rio de Janeiro during the colonial period.
              </li>
              <li>
                In the essay
                <a href="{{ site.baseurl }}/documents/urban/confluences.pdf">
                  Confluences of the Past in Brasília: Another Plano Piloto for Brazilian Modernist Urbanism
                </a>,
                I look at the eurocentric historiography that predominantly constrained Brazilian Modernism and propose alternative, de-colonial avenues for future research rooted within Brazil's own city-planning tradition. This piece was published on the
                <a href="https://www.bcurbanreview.com">Barnard Columbia Urban Review</a>
                Fall 2021 edition. I wrote
                <a href="{{ site.baseurl }}/documents/urban/cannibalism.pdf">
                  a review essay
                </a>
                on the same topic.
              </li>
            </ul>

            <p><b>Architecture and Urban Planning through Art and Fiction: </b></p>
            <ul>
              <li>
                Still looking at modernism (and Brasília!), I discuss the dissonances between the British architectural collective
                <a href="https://www.archigram.net/about-archigram">Archigram</a>
                and modernist town planning in my essay
                <a href="{{ site.baseurl }}/documents/urban/archigram.pdf">
                  The Life of Yellowing Papers
                </a>.
              </li>
              <li>
                Continuing on the theme of British literature and architecture, I use spatial analysis and GIS to study movement in B.S. Johnson's brutalist novel <i>Albert Angelo</i> as detailed in the essay
                <a href="{{ site.baseurl }}/documents/urban/f-walking.pdf">
                  OH, FUCK ALL THIS WALKING! The Metafictional Geography of Movement in Albert Angelo
                </a>.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr class="section-separator">

      <!-- Cat section -->
      <div class="section-header">
        <h2 class="section-title">Cat</h2>
        <div class="fun-list">
          <div class="fun-item">
            <p>
              Mezcal is my adorable yet sometimes grudgy cat.
              <a href="{{ site.baseurl }}/mezcal/">Pictures of him</a>.
            </p>
          </div>
        </div>
      </div>

      <hr class="section-separator">

      <!-- Cocktails section -->
      <div class="section-header">
        <h2 class="section-title">Cocktails</h2>
        <div class="fun-list">
          <div class="fun-item">
            <p>
              I'm an amateur mixologist and enjoy creating themed cocktail menus.
              Follow my cocktail adventures on
              <a href="https://www.instagram.com/tabbycocktails/">Instagram</a>.
            </p>
          </div>
        </div>
      </div>

      <hr class="section-separator">

      <!-- Taylor Swift section -->
      <div class="section-header">
        <h2 class="section-title">Taylor Swift</h2>
        <div class="fun-list">
          <div class="fun-item">
            <p>
              I spend too much time analyzing Taylor Swift songs and writing about them academically.
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- RIGHT COLUMN -->
    <div class="fun-right">

      <div class="goodreads-section">
        <p>
          When it comes to books, I am a fierce reviewer #2.
          Check my
          <a href="https://www.goodreads.com/user/show/156196841" target="_blank">Goodreads</a> profile to follow my literary criticism.
          Here are some recent additions to my shelf–click on a cover to read more!
        </p>

        <div class="goodreads-grid">
          {% for book in site.data.goodreads_books %}
            <a
              href="{{ book.link }}"
              class="goodreads-book"
              target="_blank"
              data-title="{{ book.title | escape }}"
              data-author="{{ book.author | escape }}"
              data-rating="{{ book.rating }}"
              data-date="{{ book.read_date }}"
              data-review="{{ book.review | strip_newlines | escape }}"
            >
              <img src="{{ book.cover }}" alt="{{ book.title }}">
            </a>
          {% endfor %}
        </div>
      </div>

    </div>

  </div>
</div>

<link rel="stylesheet" href="/assets/css/goodreads.css">
<script src="/assets/js/goodreads.js"></script>
