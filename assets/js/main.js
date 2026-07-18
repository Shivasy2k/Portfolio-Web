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

const renderImpacts = (items = []) => {
  const target = document.querySelector('[data-render="impacts"]');
  if (!target) return;
  target.innerHTML = items.map((item) => {
    const sources = (item.sources || []).map((source) => `
      <a href="${safeURL(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)}</a>
    `).join("");
    return `
      <article class="impact-card">
        <p class="impact-year">${escapeHTML(item.period)}</p>
        <h3 class="impact-title">${escapeHTML(item.title)} · ${escapeHTML(item.organization)}</h3>
        <p class="impact-details">${escapeHTML(item.summary)}</p>
        ${item.impactValue ? `<span class="impact-savings">${escapeHTML(item.impactValue)}</span>` : ""}
        ${sources ? `<div class="impact-sources">${sources}</div>` : ""}
      </article>
    `;
  }).join("");
};

const renderPeerReviews = (items = []) => {
  const target = document.querySelector('[data-render="peer-reviews"]');
  if (!target) return;
  target.innerHTML = `
    <div class="peer-review-summary">
      <span class="label">Peer Review Statistics</span>
      <p>100+ papers reviewed for IEEE and various international conferences</p>
      <p>20+ conferences served as peer reviewer</p>
    </div>
    <h3 class="peer-review-heading">Conferences Reviewed For</h3>
    <div class="peer-review-tiles">
      ${items.map((item) => `
        <article class="peer-review-tile" title="${escapeHTML(item.conference)}">
          <h3>${escapeHTML(item.label || item.conference)}</h3>
          <p>${escapeHTML(item.location)}</p>
        </article>
      `).join("")}
    </div>
  `;
};

const renderCards = (selector, items = [], mapper) => {
  const target = document.querySelector(selector);
  if (!target) return;
  target.innerHTML = items.map(mapper).join("");
};

const publicationItem = (item) => `
  <article class="publication-item">
    <span class="publication-source">${escapeHTML(item.source || "Article")}</span>
    <div>
      <h3>${escapeHTML(item.title)}</h3>
      ${item.detail ? `<p>${escapeHTML(item.detail)}</p>` : ""}
    </div>
    <span>${escapeHTML(item.date || "")}</span>
    <span class="publication-status">${escapeHTML(item.status || "")}</span>
    ${item.url ? `<a href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">View</a>` : "<span></span>"}
  </article>
`;

const renderPublications = (groups = {}) => {
  const target = document.querySelector('[data-render="publications"]');
  if (!target) return;
  target.innerHTML = `
    <div class="publication-group">
      <h3>${escapeHTML(groups.publishedHeading || "Scholarly Articles - Published")}</h3>
      <div class="publication-list">
        ${(groups.published || []).map(publicationItem).join("")}
      </div>
    </div>
    <div class="publication-group">
      <h3>${escapeHTML(groups.acceptedHeading || "Scholarly Articles - Accepted")}</h3>
      <div class="publication-list">
        ${(groups.accepted || []).map(publicationItem).join("")}
      </div>
    </div>
  `;
};

const renderVolunteering = (items = []) => {
  const target = document.querySelector('[data-render="volunteering"]');
  if (!target) return;
  target.innerHTML = items.map((item) => `
    <article class="volunteer-tile">
      <span class="label">${escapeHTML(item.role)}</span>
      <h3>${escapeHTML(item.event)}</h3>
      <p>${escapeHTML(item.location)}</p>
    </article>
  `).join("");
};

const renderJudging = (items = []) => {
  const target = document.querySelector('[data-render="judging"]');
  if (!target) return;
  const hackathons = items.filter((item) => item.location !== "Industry Awards");
  const industryAwards = items.filter((item) => item.location === "Industry Awards");
  const tile = (item) => `
      <article class="volunteer-tile">
        <span class="label">${escapeHTML(item.role)}</span>
        <h3>${escapeHTML(item.event)}</h3>
        <p>${escapeHTML(item.location)}</p>
      </article>
    `;
  target.innerHTML = `
    ${hackathons.map(tile).join("")}
    ${industryAwards.length ? `
      <div class="volunteer-subheading">Industry Awards Judging</div>
      ${industryAwards.map(tile).join("")}
    ` : ""}
  `;
};

const renderSpeaking = (items = []) => {
  const target = document.querySelector('[data-render="speaking"]');
  if (!target) return;
  target.innerHTML = items.map((item) => `
    <article class="speaking-tile">
      <span class="label">${escapeHTML(item.type)}</span>
      <h3>${item.url ? `<a href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.event)}</a>` : escapeHTML(item.event)}</h3>
      <p>${escapeHTML(item.topic)}</p>
      <small>${escapeHTML(item.location)}</small>
    </article>
  `).join("");
};

const renderTechnicalCommittee = (items = []) => {
  const target = document.querySelector('[data-render="technical-committee"]');
  if (!target) return;
  target.innerHTML = items.map((item) => `
    <article class="volunteer-tile">
      <span class="label">${escapeHTML(item.role)}</span>
      <h3>${escapeHTML(item.event)}</h3>
      <p>${escapeHTML(item.location)}</p>
    </article>
  `).join("");
};

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

const initSectionNavigation = () => {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (!target) return;
      event.preventDefault();
      const navOffset = document.querySelector("[data-nav]")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset - 14;
      window.scrollTo({ top, behavior: "smooth" });
      history.pushState(null, "", id);
    });
  });

  const sections = Array.from(document.querySelectorAll("main section[id], main#home"));
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const sectionGroups = {
    "projects-impacts": "mentoring-and-coaching",
    patents: "mentoring-and-coaching",
    research: "mentoring-and-coaching",
    volunteering: "mentoring-and-coaching",
    judging: "mentoring-and-coaching",
    speaking: "public-influence",
    blogs: "public-influence",
    "technical-committee": "public-influence",
    recognition: "public-influence"
  };

  const updateActiveSection = () => {
    let current = "home";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 140) {
        current = section.id || "home";
      }
    });
    const activeId = sectionGroups[current] || current;
    sectionLinks.forEach((link) => {
      const active = link.dataset.sectionLink === activeId;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  updateActiveSection();
};

const init = async () => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initMenu();
  initActivePage();
  initSectionNavigation();

  const [profile, experience, impacts, peerReviews, publications, volunteering, judging, speaking, technicalCommittee, writing, recognition] = await Promise.all([
    loadJSON("data/profile.json"),
    loadJSON("data/experience.json"),
    loadJSON("data/impacts.json"),
    loadJSON("data/peer-reviews.json"),
    loadJSON("data/publications.json"),
    loadJSON("data/volunteering.json"),
    loadJSON("data/judging.json"),
    loadJSON("data/speaking.json"),
    loadJSON("data/technical-committee.json"),
    loadJSON("data/writing.json"),
    loadJSON("data/recognition.json")
  ]);

  renderStats(profile.stats);
  renderBio(profile.bio);
  renderExpertise(profile.expertise);
  renderExperience(experience);
  renderImpacts(impacts);
  renderPeerReviews(peerReviews);
  renderPublications(publications);
  renderVolunteering(volunteering);
  renderJudging(judging);
  renderSpeaking(speaking);
  renderTechnicalCommittee(technicalCommittee);
  renderCards('[data-render="writing"]', writing, writingCard);
  renderCards('[data-render="recognition"]', recognition, recognitionCard);
  renderContact(profile);
};

init().catch((error) => {
  console.error(error);
});
