const loadJSON = async (path) => {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
};

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

const safeURL = (url = "") => {
  try {
    const parsed = new URL(url, window.location.href);
    if (["http:", "https:", "mailto:"].includes(parsed.protocol)) return parsed.href;
  } catch {
    return url;
  }
  return url;
};

const renderStats = (stats = []) => {
  const target = document.querySelector('[data-render="stats"]');
  if (!target) return;
  target.innerHTML = stats.map((item) => `
    <div class="stat">
      <strong>${escapeHTML(item.value)}</strong>
      <span>${escapeHTML(item.label)}</span>
    </div>
  `).join("");
};

const renderBio = (bio = []) => {
  const target = document.querySelector('[data-render="bio"]');
  if (!target) return;
  target.innerHTML = bio.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("");
};

const renderExpertise = (items = []) => {
  const target = document.querySelector('[data-render="expertise"]');
  if (!target) return;
  target.innerHTML = items.map((item) => `<span class="pill">${escapeHTML(item)}</span>`).join("");
};

const renderExperience = (items = []) => {
  const target = document.querySelector('[data-render="experience"]');
  if (!target) return;
  target.innerHTML = items.map((item) => `
    <article class="timeline-item">
      <p class="timeline-meta">${escapeHTML(item.period)} · ${escapeHTML(item.organization)}${item.location ? ` · ${escapeHTML(item.location)}` : ""}</p>
      <h3>${escapeHTML(item.role)}</h3>
      <p>${escapeHTML(item.summary)}</p>
    </article>
  `).join("");
};

const renderCards = (selector, items = [], mapper) => {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = items.map(mapper).join("");
};

const publicationCard = (item) => `
  <article class="content-card">
    <span class="label">${escapeHTML(item.year || "Publication")}</span>
    <h3>${escapeHTML(item.title)}</h3>
    <p>${escapeHTML(item.venue || "")}</p>
  </article>
`;

const writingCard = (item) => `
  <article class="content-card">
    <span class="label">${escapeHTML(item.source || "Article")}</span>
    <h3>${escapeHTML(item.title)}</h3>
    ${item.url ? `<a href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">Read article</a>` : ""}
  </article>
`;

const recognitionCard = (item) => `
  <article class="content-card">
    <span class="label">${escapeHTML(item.type || "Recognition")}</span>
    <h3>${escapeHTML(item.title)}</h3>
    <p>${escapeHTML(item.detail || "")}</p>
  </article>
`;

const renderContact = (profile) => {
  const target = document.querySelector('[data-render="contact"]');
  if (!target) return;
  const links = (profile.links || []).map((link) => `
    <p><a href="${safeURL(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)}</a></p>
  `).join("");
  target.innerHTML = `
    <p><strong>${escapeHTML(profile.name)}</strong></p>
    <p>${escapeHTML(profile.role)}</p>
    <p><a href="mailto:${escapeHTML(profile.email)}">${escapeHTML(profile.email)}</a></p>
    <p>${escapeHTML(profile.location)}</p>
    ${links}
  `;
};

const initMenu = () => {
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  });
};

const initActivePage = () => {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === page) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
};

const init = async () => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initMenu();
  initActivePage();

  const [profile, experience, publications, writing, recognition] = await Promise.all([
    loadJSON("data/profile.json"),
    loadJSON("data/experience.json"),
    loadJSON("data/publications.json"),
    loadJSON("data/writing.json"),
    loadJSON("data/recognition.json")
  ]);

  renderStats(profile.stats);
  renderBio(profile.bio);
  renderExpertise(profile.expertise);
  renderExperience(experience);
  renderCards('[data-render="publications"]', publications, publicationCard);
  renderCards('[data-render="writing"]', writing, writingCard);
  renderCards('[data-render="recognition"]', recognition, recognitionCard);
  renderContact(profile);
};

init().catch((error) => {
  console.error(error);
});
