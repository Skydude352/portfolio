(function () {
  const data = window.portfolioData;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const text = (selector, value) => {
    const node = $(selector);
    if (node && value) node.textContent = value;
  };

  const make = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };

  const list = (items) => {
    const ul = document.createElement("ul");
    items.forEach((item) => ul.append(make("li", "", item)));
    return ul;
  };

  const hasValue = (value) => typeof value === "string" && value.trim().length > 0;

  text("[data-field='name']", data.personal.name);
  text("[data-field='headline']", data.personal.headline);
  text("[data-field='summary']", data.personal.summary);
  text("[data-cs-summary]", data.computerScience.summary);
  text("[data-creative-summary]", data.creative.summary);
  text("[data-year]", String(new Date().getFullYear()));

  const cvLink = $("[data-cv-link]");
  if (cvLink && data.personal.cvPath) {
    cvLink.href = data.personal.cvPath;
    cvLink.setAttribute("download", data.personal.cvPath.split("/").pop());
  }

  const contactStrip = $("[data-contact-strip]");
  const contactLinks = $("[data-contact-links]");
  const contactItems = [
    hasValue(data.contact.linkedin) && { label: "LinkedIn", href: data.contact.linkedin },
    hasValue(data.contact.github) && { label: "GitHub", href: data.contact.github },
    hasValue(data.contact.email) && { label: "Email", href: `mailto:${data.contact.email}` },
    hasValue(data.contact.phone) && { label: "Phone", href: `tel:${data.contact.phone.replace(/\s+/g, "")}` },
    hasValue(data.contact.location) && { label: data.contact.location }
  ].filter(Boolean);

  contactItems.forEach((item) => {
    const node = item.href ? make("a", "meta-pill", item.label) : make("span", "meta-pill", item.label);
    if (item.href) node.href = item.href;
    contactStrip.append(node.cloneNode(true));
    contactLinks.append(node);
  });

  const contactMessage = $("[data-contact-message]");
  const directContactCount = contactItems.filter((item) => item.href).length;
  contactMessage.textContent = directContactCount
    ? "Available for Computer Science, AI/ML, software development, teaching, translation, and creative collaboration opportunities."
    : "Professional contact links have not been supplied yet. Add email, phone, LinkedIn, or GitHub in data/portfolio-data.js when ready.";

  const strengthsRoot = $("[data-strengths]");
  data.computerScience.strengths.forEach((item) => strengthsRoot.append(make("div", "strength-item", item)));

  const skillRoot = $("[data-skill-groups]");
  data.computerScience.skillGroups.forEach((group) => {
    const card = make("article", "skill-card panel");
    card.append(make("h3", "", group.name));
    const tags = make("div", "tag-list");
    group.items.forEach((skill) => tags.append(make("span", "tag", skill)));
    card.append(tags);
    skillRoot.append(card);
  });

  const projectRoot = $("[data-projects]");
  data.projects.forEach((project) => {
    const card = make("article", "project-card");
    const preview = make("div", "project-preview");
    preview.innerHTML = '<div class="project-preview__screen" aria-hidden="true"><div class="project-preview__bar"><span></span><span></span><span></span></div><div class="project-preview__body"><span></span><span></span><span></span></div></div>';
    const body = make("div", "project-card__body");
    body.append(make("div", "project-card__type", project.type));
    body.append(make("h3", "", project.name));
    body.append(make("p", "", project.problem));
    body.append(make("p", "", project.description));
    body.append(make("p", "", `Role: ${project.role}`));
    if (project.achievement) body.append(make("p", "", project.achievement));
    const tags = make("div", "tag-list");
    project.technologies.forEach((tech) => tags.append(make("span", "tag", tech)));
    body.append(tags);
    const links = Object.entries(project.links || {}).filter(([, href]) => hasValue(href));
    if (links.length) {
      const linkWrap = make("div", "project-links");
      links.forEach(([label, href]) => {
        const link = make("a", "", label);
        link.href = href;
        link.target = "_blank";
        link.rel = "noreferrer";
        linkWrap.append(link);
      });
      body.append(linkWrap);
    }
    card.append(preview, body);
    projectRoot.append(card);
  });

  const experienceRoot = $("[data-experience]");
  data.experience.forEach((experience) => {
    const item = make("article", "timeline-item");
    const side = make("div");
    side.append(make("div", "timeline-item__meta", experience.period));
    side.append(make("strong", "", experience.category));
    const body = make("div");
    body.append(make("h3", "", experience.title));
    body.append(make("p", "", experience.organization));
    body.append(list(experience.highlights));
    const tags = make("div", "tag-list");
    experience.skills.forEach((skill) => tags.append(make("span", "tag", skill)));
    body.append(tags);
    item.append(side, body);
    experienceRoot.append(item);
  });

  const creativeRoot = $("[data-creative-items]");
  data.creative.items.forEach((item) => creativeRoot.append(make("article", "creative-item", item)));

  const gallery = $("[data-gallery]");
  if (Array.isArray(data.creative.gallery) && data.creative.gallery.length) {
    gallery.hidden = false;
    data.creative.gallery.forEach((image) => {
      const link = make("a", "gallery__item");
      link.href = image.src;
      const img = document.createElement("img");
      img.src = image.thumb || image.src;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = image.width || 800;
      img.height = image.height || 600;
      img.alt = image.alt || "Photography work";
      link.append(img);
      gallery.append(link);
    });
  }

  const educationRoot = $("[data-education]");
  data.education.forEach((education) => {
    const card = make("article", "education-card");
    card.append(make("div", "education-card__period", education.period));
    card.append(make("h3", "", education.institution));
    card.append(make("p", "", education.qualification));
    card.append(list(education.details));
    educationRoot.append(card);
  });

  const certRoot = $("[data-certifications]");
  data.certifications.forEach((cert) => certRoot.append(make("li", "", cert)));

  const languageRoot = $("[data-languages]");
  data.languages.forEach((language) => languageRoot.append(make("li", "", `${language.name}: ${language.level}`)));

  const additionalRoot = $("[data-additional]");
  data.additional.forEach((group) => {
    const card = make("article", "additional-card");
    card.append(make("h3", "", group.name));
    card.append(list(group.items));
    additionalRoot.append(card);
  });

  const toggle = $(".menu-toggle");
  const menu = $("#site-menu");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  $$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });

  const observedSections = $$("main section[id]");
  const navLinks = new Map($$(".nav-links a").map((link) => [link.getAttribute("href").slice(1), link]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove("is-active"));
        const active = navLinks.get(entry.target.id);
        if (active) active.classList.add("is-active");
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );
  observedSections.forEach((section) => observer.observe(section));
})();
