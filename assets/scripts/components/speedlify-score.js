(()=>{var f=Object.defineProperty;var p=(a,t,e)=>t in a?f(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var c=(a,t,e)=>p(a,typeof t!="symbol"?t+"":t,e);var l=class a{constructor(){this.fetches={},this.responses={},this.urls={}}static normalizeUrl(t,e){return`${t}${t.endsWith("/")?"":"/"}`+(e.startsWith("/")?e.substr(1):e)}async fetchFromApi(t){this.fetches[t]||(this.fetches[t]=fetch(t));let e=await this.fetches[t];return this.responses[t]||(this.responses[t]=e.json()),await this.responses[t]}async fetchHash(t,e){if(this.urls[t])return this.urls[t][e]?this.urls[t][e].hash:!1;let s=a.normalizeUrl(t,"api/urls.json"),r=await this.fetchFromApi(s);return r[e]?r[e].hash:!1}async fetchData(t,e){let s=a.normalizeUrl(t,`api/${e}.json`);return this.fetchFromApi(s)}},u=new l,i=class i extends HTMLElement{static register(t){customElements.define(t||"speedlify-score",i)}connectedCallback(){if(!(!("replaceSync"in CSSStyleSheet.prototype)||this.shadowRoot)){if(this.speedlifyUrl=this.getAttribute(i.attrs.speedlifyUrl),this.shorthash=this.getAttribute(i.attrs.hash),this.rawData=this.getAttribute(i.attrs.rawData),this.url=this.getAttribute(i.attrs.url)||window.location.href,!this.rawData&&!this.speedlifyUrl){console.error(`Missing \`${i.attrs.speedlifyUrl}\` attribute:`,this);return}this.init()}}_initTemplate(t,e=!1){if(this.shadowRoot&&!e)return;if(this.shadowRoot){this.shadowRoot.innerHTML=this.render(t);return}let s=this.attachShadow({mode:"open"}),r=new CSSStyleSheet;r.replaceSync(i.css),s.adoptedStyleSheets=[r];let h=document.createElement("template");h.innerHTML=this.render(t),s.appendChild(h.content.cloneNode(!0))}async init(){if(this.rawData){let r=JSON.parse(this.rawData);this.setDateAttributes(r),this._initTemplate(r);return}let t=this.shorthash,e=!1;if(t||(this._initTemplate(),e=!0,t=await u.fetchHash(this.speedlifyUrl,this.url)),!t){console.error(`<speedlify-score> could not find hash for URL (${this.url}):`,this);return}e||(this._initTemplate(),e=!0);let s=await u.fetchData(this.speedlifyUrl,t);this.setDateAttributes(s),this._initTemplate(s,e)}setDateAttributes(t){if(!("Intl"in window)||!Intl.DateTimeFormat||!t.timestamp)return;let e=new Intl.DateTimeFormat().format(new Date(t.timestamp));this.setAttribute("title",`Results from ${e}`)}getScoreClass(t){return t===""||t===void 0?"circle":t<.5?"circle circle-bad":t<.9?"circle circle-ok":"circle circle-good"}getScoreHtml(t,e=""){return`<span title="${t}" class="${this.getScoreClass(e)}">${e?parseInt(e*100,10):"\u2026"}</span>`}render(t={}){let e=i.attrs,s=[];(!this.hasAttribute(e.requests)&&!this.hasAttribute(e.weight)&&!this.hasAttribute(e.rank)&&!this.hasAttribute(e.rankChange)||this.hasAttribute(e.score))&&(s.push(this.getScoreHtml("Performance",t.lighthouse?.performance)),s.push(this.getScoreHtml("Accessibility",t.lighthouse?.accessibility)),s.push(this.getScoreHtml("Best Practices",t.lighthouse?.bestPractices)),s.push(this.getScoreHtml("SEO",t.lighthouse?.seo)));let r=[],h=t.weight?.summary?.split(" \u2022 ")||[];if(this.hasAttribute(e.requests)&&h.length&&r.push(`<span class="requests">${h[0]}</span>`),this.hasAttribute(e.weight)&&h.length&&r.push(`<span class="weight">${h[1]}</span>`),t.ranks?.cumulative){if(this.hasAttribute(e.rank)){let n=this.getAttribute("rank-url");r.push(`<${n?`a href="${n}"`:"span"} class="rank">${t.ranks?.cumulative}</${n?"a":"span"}>`)}if(this.hasAttribute(e.rankChange)&&t.previousRanks){let n=t.previousRanks?.cumulative-t.ranks?.cumulative;r.push(`<span class="rank-change ${n>0?"up":n<0?"down":"same"}">${n!==0?Math.abs(n):""}</span>`)}}return r.length&&s.push(`<span class="meta">${r.join("")}</span>`),s.join("")}};c(i,"attrs",{url:"url",speedlifyUrl:"speedlify-url",hash:"hash",rawData:"raw-data",requests:"requests",weight:"weight",rank:"rank",rankChange:"rank-change",score:"score"}),c(i,"css",`
:host {
	--_circle: var(--speedlify-circle);
	display: flex;
	align-items: center;
	gap: 0.375em; /* 6px /16 */
}
.circle {
	font-size: 0.8125em; /* 13px /16 */
	min-width: 2.6em;
	height: 2.6em;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	border: 0.15384615em solid currentColor; /* 2px /13 */
	color: var(--_circle, #666);
}
.circle-good {
	color: var(--_circle, #088645);
	border-color: var(--_circle, #0cce6b);
}
.circle-ok {
	color: var(--_circle, #ffa400);
	border-color: var(--_circle, currentColor);
}
.circle-bad {
	color: var(--_circle, #ff4e42);
	border-color: var(--_circle, currentColor);
}
.meta {
	display: flex;
	align-items: center;
	gap: 0.625em; /* 10px /16 */
}
.circle + .meta {
	margin-left: 0.25em; /* 4px /16 */
}
.rank:before {
	content: "Rank #";
}
.rank-change:before {
	line-height: 1;
}
.rank-change.up {
	color: green;
}
.rank-change.up:before {
	content: "\u2B06";
}
.rank-change.down {
	color: red;
}
.rank-change.down:before {
	content: "\u2B07";
}
`);var o=i;"customElements"in window&&"fetch"in window&&o.register();})();
