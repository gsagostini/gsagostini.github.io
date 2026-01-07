---
layout: page
title: Fun
permalink: /fun/
---

<style>
/* === Layout for Fun page === */
.fun-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 2rem;
  align-items: start;
}

.fun-sidebar {
  position: sticky;
  top: 2rem;
}

/* Mobile */
@media (max-width: 900px) {
  .fun-layout {
    grid-template-columns: 1fr;
  }

  .fun-sidebar {
    position: static;
    margin-top: 2rem;
  }
}

/* === Lighter Goodreads widget styling (overrides defaults) === */
.gr_custom_container_1767792814 {
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #ffffff;
}

.gr_custom_header_1767792814 {
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  text-align: left;
}

.gr_custom_each_container_1767792814 {
  border-bottom: 1px solid #eee;
}

.gr_custom_author_1767792814 {
  font-size: 0.8rem;
  color: #666;
}

.gr_custom_review_1767792814 {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #444;
}
</style>

<div class="container fun-layout">

  <!-- MAIN CONTENT -->
  <div class="fun-main">

    <div class="section-header">
      <h2 class="section-title">Urban+</h2>
      <div class="fun-list">
        <div class="fun-item">
          <p>I have written a lot about cities and geography during my undergrad. Here is some of that work:</p>
          <p><b>Brazilian Urban Planning: </b></p>
          <ul>
            <li>In the essay <a href="{{ site.baseurl }}/documents/urban/rio.pdf">Naturally Artificial: Continuity and Change in the Street Network of Rio de Janeiro</a>, I use street network analysis on historical maps to study the change in the street layout of Rio de Janeiro during the colonial period.</li> 
            <li>In the essay <a href="{{ site.baseurl }}/documents/urban/confluences.pdf">Confluences of the Past in Brasília: Another Plano Piloto for Brazilian Modernist Urbanism</a>, I look at the eurocentric historiography that predominantly constrained Brazilian Modernism and propose alternative, de-colonial avenues for future research rooted within Brazil's own city-planning tradition. This piece was published on the <a href="https://www.bcurbanreview.com">Barnard Columbia Urban Review</a> Fall 2021 edition. I wrote <a href="{{ site.baseurl }}/documents/urban/cannibalism.pdf">a review essay</a> on the same topic.</li> 
          </ul>
          <p><b>Architecture and Urban Planning through Art and Fiction: </b></p>
          <ul>
            <li>Still looking at modernism (and Brasília!), I discuss the dissonances between the British architectural collective <a href="https://www.archigram.net/about-archigram">Archigram</a> and modernist town planning in my essay <a href="{{ site.baseurl }}/documents/urban/archigram.pdf">The Life of Yellowing Papers</a>.</li>
            <li>Continuing on the theme of British literature and architecture, I use spatial analysis and GIS to study movement in B.S. Johnson's brutalist novel Albert Angelo as detailed in the essay <a href="{{ site.baseurl }}/documents/urban/f-walking.pdf">OH, FUCK ALL THIS WALKING! The Metafictional Geography of Movement in Albert Angelo</a>.</li>
          </ul>
        </div>
      </div>
    </div>

    <hr class="section-separator">

    <div class="section-header">
      <h2 class="section-title">Cat</h2>
      <div class="fun-list">
        <div class="fun-item">
          <p>Mezcal is my adorable yet sometimes grudgy cat. Check out <a href="{{ site.baseurl }}/mezcal/">pictures of him</a>.</p>
          <p><b>Important clarification:</b> The cat in my profile picture is not Mezcal.</p>
        </div>
      </div>
    </div>

    <hr class="section-separator">

    <div class="section-header">
      <h2 class="section-title">Cocktails</h2>
      <div class="fun-list">
        <div class="fun-item">
          <p>I'm an amateur mixologist and enjoy creating themed cocktail menus. Follow my cocktail adventures on <a href="https://www.instagram.com/tabbycocktails/">Instagram</a>.</p>
        </div>
      </div>
    </div>

    <hr class="section-separator">

    <div class="section-header">
      <h2 class="section-title">Taylor Swift</h2>
      <div class="fun-list">
        <div class="fun-item">
          <p>I spend too much time analyzing Taylor Swift songs. You can read the preprints below:</p>
        </div>
      </div>
    </div>

  </div>

  <!-- SIDEBAR -->
  <aside class="fun-sidebar">
    <h2 class="section-title">Books</h2>

    {{ site.data.goodreads.widget | raw }}

  </aside>

</div>
