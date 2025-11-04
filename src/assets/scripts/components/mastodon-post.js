const mastodonPostTemplate = document.createElement("template");
mastodonPostTemplate.innerHTML = `
<figure>
  <blockquote data-key="content"></blockquote>
  <figcaption>
    <cite>
      <a data-key="url" class="no-indicator"><span data-key="username"></span>@<span data-key="hostname"></span></a>
    </cite>
    <dl>
      <dt>Reposts</dt><dd data-key="reblogs_count"></dd>
      <dt>Replies</dt><dd data-key="replies_count"></dd>
      <dt>Favourites</dt><dd data-key="favourites_count"></dd>
    </dl>
  </figcaption>
</figure>
`;
mastodonPostTemplate.id = "mastodon-post-template";
document.getElementById(mastodonPostTemplate.id) || document.body.appendChild(mastodonPostTemplate);

class MastodonPost extends HTMLElement {
  static register(tagName) {
    if ("customElements" in window) customElements.define(tagName || "mastodon-post", MastodonPost);
  }

  async connectedCallback() {
    this.append(this.template);

    const data = { ...(await this.data), ...this.linkData };

    this.querySelectorAll("[data-key]").forEach(async el => {
      const { key } = el.dataset;
      const val = data[key];

      if (key === "content") {
        el.innerHTML = val;
        return;
      }

      if (typeof val === "string" && val.startsWith("http")) {
        if (el.localName === "a") {
          el.href = val;
          // Ensure the link uses the "no-indicator" class once the URL is set
          el.classList.add("no-indicator");
        } else if (el.localName === "img") {
          el.src = val;
        }
        return;
      }

      el.textContent = val;
    });
  }

  get template() {
    return document.getElementById(mastodonPostTemplate.id).content.cloneNode(true);
  }

  get link() {
    return this.querySelector("a").href;
  }

  get linkData() {
    const u = new URL(this.link);
    const parts = u.pathname.split("/").filter(p => p.length);
    return {
      url: this.link,
      hostname: u.hostname,
      username: parts.find(p => p.startsWith("@")),
      postId: parts.find(p => !p.startsWith("@")),
    };
  }

  get endpoint() {
    return `https://${this.linkData.hostname}/api/v1/statuses/${this.linkData.postId}`;
  }

  get data() {
    return fetch(this.endpoint).then(r => r.json());
  }
}

MastodonPost.register();
