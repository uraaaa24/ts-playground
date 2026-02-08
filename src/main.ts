import "./style.css";
import { artworks, getArtworkBySlug } from "./registry";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element.");
}

let cleanup: (() => void) | null = null;

const clearCleanup = () => {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
};

const renderHome = () => {
  document.body.classList.remove("artwork-active");
  app.className = "home";
  app.innerHTML = `
    <h1>PG.js Gallery</h1>
    <p>作品を選んでページ遷移してください。</p>
    <ul>
      ${artworks
        .map(
          (artwork) =>
            `<li><a href="/${artwork.slug}">${artwork.title}</a></li>`
        )
        .join("")}
    </ul>
  `;
};

const renderArtwork = (slug: string) => {
  document.body.classList.add("artwork-active");
  app.className = "artwork-container";
  app.innerHTML = "";
  const artwork = getArtworkBySlug(slug);
  if (!artwork) {
    renderNotFound();
    return;
  }
  // 作品側の mount は「描画開始 + クリーンアップ関数」を返す想定
  cleanup = artwork.mount(app);
};

const renderNotFound = () => {
  app.className = "home";
  app.innerHTML = `
    <h1>Not Found</h1>
    <p>作品が見つかりませんでした。</p>
    <a href="/">ホームに戻る</a>
  `;
};

const navigate = (path: string) => {
  clearCleanup();
  if (path === "/") {
    renderHome();
  } else {
    renderArtwork(path.replace("/", ""));
  }
};

const handleLinkClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const link = target.closest("a");
  if (!link) {
    return;
  }
  const href = link.getAttribute("href");
  if (!href || !href.startsWith("/")) {
    return;
  }
  event.preventDefault();
  window.history.pushState({}, "", href);
  navigate(href);
};

window.addEventListener("popstate", () => navigate(window.location.pathname));
document.addEventListener("click", handleLinkClick);

navigate(window.location.pathname);
