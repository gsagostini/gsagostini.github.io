---
layout: page
title: Publications & Talks
permalink: /publications/
---

<div class="container">
  <p> * <em> denotes equal contribution</em></p>

  <div class="publications-container">
    <!-- Publications section -->
    <div class="section-header">
      <h2 class="section-title">Publications</h2>
      <div class="publications-list">
        {% for pub in site.data.publications %}
          <div class="publication">
            <h3>{{ pub.title }}</h3>
            <!-- Replace asterisks with HTML entities to prevent markdown processing -->
            <p class="author-list">{{ pub.authors | replace: '*', '<span class="author-asterisk">*</span>' }}</p>
            <p><em>{{ pub.journal }}</em>, {{ pub.year }}{% if pub.pages %}, {{ pub.pages }}{% endif %}</p>
            {% if pub.notes %}
              <p class="publication-notes">{{ pub.notes | markdownify }}</p>
            {% endif %}
            <p>
              {% if pub.link %}
                <a href="{{ pub.link }}">[link]</a>
              {% endif %}
              {% if pub.slides %}
                <a href="{{ pub.slides }}">[slides]</a>
              {% endif %}
              {% if pub.poster %}
                <a href="{{ pub.poster }}">[poster]</a>
              {% endif %}
              {% if pub.twitter %}
                <a href="{{ pub.twitter }}">[twitter]</a>
              {% endif %}
              {% if pub.bluesky %}
                <a href="{{ pub.bluesky }}">[bluesky]</a>
              {% endif %}
            </p>
          </div>
          {% unless forloop.last %}<hr>{% endunless %}
        {% endfor %}
      </div>
    </div>

    <!-- Separator between sections -->
    <hr class="section-separator">

    <!-- Talks section -->
    <div class="section-header">
      <h2 class="section-title">Talks</h2>
      <div class="talks-list">
        {% for talk in site.data.talks %}
          <div class="talk">
            <h3>{{ talk.title }}</h3>
            <!-- Replace asterisks with HTML entities to prevent markdown processing -->
            <p class="author-list">{{ talk.authors | replace: '*', '<span class="author-asterisk">*</span>' }}</p>
            <p>{{ talk.venue }}, {{ talk.date }}</p>
            {% if talk.notes %}
              <p class="talk-notes">{{ talk.notes | markdownify }}</p>
            {% endif %}
            <p>
              {% if talk.link %}
                <a href="{{ talk.link }}">[link]</a>
              {% endif %}
              {% if talk.slides %}
                <a href="{{ talk.slides }}">[slides]</a>
              {% endif %}
              {% if talk.twitter %}
                <a href="{{ talk.twitter }}">[twitter]</a>
              {% endif %}
              {% if talk.bluesky %}
                <a href="{{ talk.bluesky }}">[bluesky]</a>
              {% endif %}
            </p>
          </div>
          {% unless forloop.last %}<hr>{% endunless %}
        {% endfor %}
      </div>
    </div>
  </div>
</div>
