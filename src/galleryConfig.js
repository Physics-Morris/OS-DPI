// Gallery config. Contributions are pull requests against this repo; repoint
// owner/repo/branch here to target a different one.
export const GALLERY = {
  owner: "Physics-Morris",
  repo: "OS-DPI",
  branch: "main",
  // Repo path where contributed boards live (used in PR upload links).
  repoDir: "src/public/gallery",
  // Served path under BASE_URL.
  publicPath: "gallery",
};

export function galleryIndexURL() {
  return `${import.meta.env.BASE_URL}${GALLERY.publicPath}/index.json`;
}

// URL that loads a board into OS-DPI via the bundled board file.
export function loadURL(item, edit = false) {
  const board = `${GALLERY.publicPath}/${item.slug}/board.osdpi`;
  return `${import.meta.env.BASE_URL}?fetch=${board}${edit ? "&edit" : ""}#${item.slug}`;
}

// GitHub "upload files" page for a slug's folder (auto-forks and opens a PR).
export function uploadURL(slug) {
  const { owner, repo, branch, repoDir } = GALLERY;
  return `https://github.com/${owner}/${repo}/upload/${branch}/${repoDir}/${slug}`;
}

export function slugify(title) {
  return (title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
