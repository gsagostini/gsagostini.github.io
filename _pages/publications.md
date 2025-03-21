---
layout: page
title: Publications
---

{% for pub in site.data.publications %}
  <div class="publication">
    <h3>{{ pub.title }}</h3>
    <p>{{ pub.authors }}</p>
    <p><em>{{ pub.journal }}</em>, {{ pub.year }}</p>
    <a href="{{ pub.link }}">Read more</a>
  </div>
{% endfor %}
