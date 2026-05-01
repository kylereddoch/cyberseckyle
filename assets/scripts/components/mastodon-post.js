(()=>{var i=document.createElement("template");i.innerHTML=`
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
`;i.id="mastodon-post-template";document.getElementById(i.id)||document.body.appendChild(i);var r=class o extends HTMLElement{static register(e){"customElements"in window&&customElements.define(e||"mastodon-post",o)}async connectedCallback(){if(this.dataset.mastodonReady==="true")return;this.dataset.mastodonReady="true",this.append(this.template);let e=this.statusUrl;if(!e){this.hidden=!0;return}this.setStatusLinks(e);let a;try{a={...await this.data,...this.linkData}}catch(t){console.warn("Could not load Mastodon post data:",t),this.hidden=!0;return}this.querySelectorAll("[data-key]").forEach(async t=>{let{key:n}=t.dataset,s=a[n];if(n==="content"){t.innerHTML=s;return}if(typeof s=="string"&&s.startsWith("http")){t.localName==="a"?(t.href=s,t.classList.add("no-indicator")):t.localName==="img"&&(t.src=s);return}t.textContent=s})}get template(){return document.getElementById(i.id).content.cloneNode(!0)}get statusUrl(){return this.getAttribute("url")||this.dataset.url||this.querySelector("[data-mastodon-link='status']")?.href||this.querySelector("a[href]")?.href||""}get link(){return this.statusUrl}get linkData(){let e=new URL(this.link),a=e.pathname.split("/").filter(t=>t.length);return{url:this.link,hostname:e.hostname,username:a.find(t=>t.startsWith("@")),postId:a.find(t=>!t.startsWith("@"))}}get endpoint(){return`https://${this.linkData.hostname}/api/v1/statuses/${this.linkData.postId}`}setStatusLinks(e){let a=e.replace(/\/+$/,"");this.querySelectorAll("[data-mastodon-link]").forEach(t=>{let n=t.getAttribute("data-mastodon-link");n==="reblogs"?t.href=`${a}/reblogs/`:n==="favourites"?t.href=`${a}/favourites/`:t.href=a})}get data(){return fetch(this.endpoint).then(e=>e.json())}};r.register();})();
