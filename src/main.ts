import "./style.css";
import { artworks } from "./artworks";

const artworkLinks = document.querySelector<HTMLUListElement>("#artwork-links");
const artworkTitle = document.querySelector<HTMLHeadingElement>("#artwork-title");
const artworkCategory = document.querySelector<HTMLParagraphElement>("#artwork-category");
const artworkDescription = document.querySelector<HTMLParagraphElement>("#artwork-description");
const artworkCanvas = document.querySelector<HTMLDivElement>("#artwork-canvas");

if (!artworkLinks || !artworkTitle || !artworkCategory || !artworkDescription || !artworkCanvas) {
  throw new Error("Missing artwork UI elements.");
}

const renderNavigation = () => {
  artworkLinks.innerHTML = artworks
    .map((artwork) => {
      return `
        <li>
          <a href="#${artwork.id}" data-artwork="${artwork.id}">${artwork.title}</a>
        </li>
      `;
    })
    .join("");
};

const updateActiveLink = (currentId: string) => {
  const links = artworkLinks.querySelectorAll<HTMLAnchorElement>("a[data-artwork]");
  links.forEach((link) => {
    const isActive = link.dataset.artwork === currentId;
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const renderArtwork = (id?: string) => {
  const selected = artworks.find((artwork) => artwork.id === id) ?? artworks[0];
  artworkTitle.textContent = selected.title;
  artworkCategory.textContent = selected.category;
  artworkDescription.textContent = selected.description;
  artworkCanvas.textContent = selected.render();
  updateActiveLink(selected.id);
};

const getArtworkFromHash = () => {
  const hash = window.location.hash.replace("#", "");
  return hash || artworks[0].id;
};

const handleHashChange = () => {
  renderArtwork(getArtworkFromHash());
};

renderNavigation();
renderArtwork(getArtworkFromHash());
window.addEventListener("hashchange", handleHashChange);
