import { html, render } from "uhtml";
import "css/gallery.css";
import db from "app/db";
import { galleryIndexURL, loadURL, GALLERY } from "app/galleryConfig";

// Example gallery landing view. Lists boards from the manifest and loads one
// via the existing `?fetch=` path. Rendered directly with uhtml.

const CONTRIBUTE_DOCS_URL = `https://github.com/${GALLERY.owner}/${GALLERY.repo}/tree/${GALLERY.branch}/${GALLERY.repoDir}`;

let mount = null;
let allItems = [];
let activeTab = "official";
let activeTag = null;

// Start a fresh design in a new tab, like File > New.
async function newDesign(event) {
  event.preventDefault();
  const name = await db.uniqueName("new");
  window.open(`${import.meta.env.BASE_URL}#${name}`, "_blank", "noopener=true");
}

async function fetchIndex() {
  try {
    const res = await fetch(galleryIndexURL(), { cache: "no-cache" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.examples || [];
    return list.filter((it) => it && it.slug);
  } catch (e) {
    console.error("gallery: failed to load index", e);
    return null;
  }
}

// A clickable #hashtag that toggles the tag filter.
function tagChip(t) {
  const active = t === activeTag;
  return html`<button
    class=${"gallery-tag" + (active ? " gallery-tag--active" : "")}
    @click=${() => {
      activeTag = active ? null : t;
      rerender();
    }}
  >
    #${t}
  </button>`;
}

function card(item) {
  return html`<article class="gallery-card">
    <h2 class="gallery-card-title">${item.title}</h2>
    ${item.description
      ? html`<p class="gallery-card-desc">${item.description}</p>`
      : null}
    ${item.tags && item.tags.length
      ? html`<div class="gallery-tags">${item.tags.map(tagChip)}</div>`
      : null}
    ${item.author
      ? html`<p class="gallery-card-author">by ${item.author}</p>`
      : null}
    <div class="gallery-card-actions">
      <a
        class="gallery-btn gallery-btn--primary"
        href=${loadURL(item, false)}
        target="_blank"
        rel="noopener"
      >
        Try it
      </a>
      <a
        class="gallery-btn gallery-btn--ghost"
        href=${loadURL(item, true)}
        target="_blank"
        rel="noopener"
        title="Open in the editor"
      >
        Open in editor
      </a>
    </div>
  </article>`;
}

function contributeCard() {
  return html`<article class="gallery-card gallery-card--cta">
    <a class="gallery-cta-main" href=${import.meta.env.BASE_URL} @click=${newDesign}>
      <span class="gallery-cta-icon" aria-hidden="true">+</span>
      <span class="gallery-cta-title">Build &amp; share your own</span>
      <span class="gallery-cta-sub"
        >Create a board, then File &rarr; Share to Gallery to open a pull
        request</span
      >
    </a>
    <a class="gallery-link" href=${CONTRIBUTE_DOCS_URL} target="_blank" rel="noopener">
      How sharing works
    </a>
  </article>`;
}

function header() {
  return html`<header class="gallery-header">
    <div class="gallery-header-bar"></div>
    <div class="gallery-header-text">
      <h1 class="gallery-title">Example gallery</h1>
      <p class="gallery-subtitle">
        Browse boards and load one into OS-DPI with a click.
      </p>
    </div>
  </header>`;
}

function tab(id, label, count) {
  const active = activeTab === id;
  return html`<button
    role="tab"
    aria-selected=${active}
    class=${"gallery-tab" + (active ? " gallery-tab--active" : "")}
    @click=${() => {
      activeTab = id;
      activeTag = null;
      rerender();
    }}
  >
    ${label} <span class="gallery-tab-count">${count}</span>
  </button>`;
}

// Row of every #tag in the current tab, plus an "All" reset.
function tagBar(items) {
  const tags = [...new Set(items.flatMap((it) => it.tags || []))].sort();
  if (!tags.length) return null;
  return html`<div class="gallery-tagbar">
    <button
      class=${"gallery-tag" + (activeTag === null ? " gallery-tag--active" : "")}
      @click=${() => {
        activeTag = null;
        rerender();
      }}
    >
      All
    </button>
    ${tags.map(tagChip)}
  </div>`;
}

function view() {
  const official = allItems.filter((it) => it.official);
  const community = allItems.filter((it) => !it.official);
  const isCommunity = activeTab === "community";
  const tabItems = isCommunity ? community : official;
  const list = activeTag
    ? tabItems.filter((it) => (it.tags || []).includes(activeTag))
    : tabItems;
  return html`<div class="gallery">
    ${header()}
    <div class="gallery-tabbar">
      <div class="gallery-tabs" role="tablist">
        ${tab("official", "OS-DPI", official.length)}
        ${tab("community", "Community", community.length)}
      </div>
    </div>
    ${tagBar(tabItems)}
    <div class="gallery-grid">
      ${list.map(card)} ${isCommunity ? contributeCard() : null}
    </div>
  </div>`;
}

function errorView() {
  return html`<div class="gallery">
    ${header()}
    <div class="gallery-empty">
      <p>Could not load the gallery.</p>
      <button class="gallery-btn gallery-btn--primary" @click=${() => showGallery()}>
        Retry
      </button>
    </div>
  </div>`;
}

function rerender() {
  if (mount) render(mount, view());
}

// Render the gallery into #gallery and switch the page into gallery mode.
export async function showGallery(id = "gallery") {
  mount = document.getElementById(id);
  if (!mount) return;
  document.body.classList.add("gallery-mode");
  const items = await fetchIndex();
  if (items === null) {
    render(mount, errorView());
    return;
  }
  allItems = items;
  activeTab = items.some((it) => it.official) ? "official" : "community";
  rerender();
}
