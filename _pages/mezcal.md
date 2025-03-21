---
layout: page
title: Mezcal the Cat
permalink: /mezcal/
---

<div class="container">
  <div class="cat-container">
    <div class="section-header">
      <h2 class="section-title">Mezcal the Cat</h2>
      <div class="cat-gallery">
        <!-- Loop through images in the directory -->
        {% for image in site.static_files %}
          {% if image.path contains 'documents/cat' %}
            <div class="cat-image">
              <img src="{{ image.path }}" alt="Mezcal the Cat">
            </div>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </div>
</div>
