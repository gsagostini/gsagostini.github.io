---
layout: page
title: Publications & Talks
---

* denotes equal contribution.

## Publications

{% for pub in site.data.publications %}
  <div class="publication">
    <h3>{{ pub.title }}</h3>
    <p>{{ pub.authors | highlight_author: "Gabriel S. Agostini" }}</p>
    <p><em>{{ pub.journal }}</em>, {{ pub.year }}{% if pub.pages %}, {{ pub.pages }}{% endif %}</p>
    <p>
      {% if pub.link %}
        <a href="{{ pub.link }}">[link]</a>
      {% endif %}
      {% if pub.slides %}
        <a href="{{ pub.slides }}">[slides]</a>
      {% endif %}
    </p>
    {% if pub.notes %}
      <p class="publication-notes">{{ pub.notes | markdownify }}</p>
    {% endif %}
  </div>
  <hr>
{% endfor %}

## Talks

{% for talk in site.data.talks %}
  <div class="talk">
    <h3>{{ talk.title }}</h3>
    <p>{{ talk.venue }}, {{ talk.date }}</p>
    <p>
      {% if talk.link %}
        <a href="{{ talk.link }}">[link]</a>
      {% endif %}
      {% if talk.slides %}
        <a href="{{ talk.slides }}">[slides]</a>
      {% endif %}
    </p>
  </div>
  <hr>
{% endfor %}
