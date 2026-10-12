# Taonga Portfolio Site

A buildless, one-page CV and portfolio website focused on Computer Science first, with sections for projects, experience, education, certifications, languages, and creative work.

## Structure

- `index.html` - single-page semantic layout and SEO metadata.
- `styles.css` - responsive visual design.
- `script.js` - content rendering, mobile navigation, active-section tracking, and gallery behavior.
- `data/portfolio-data.js` - editable professional content.
- `assets/cv/Taonga-CV.pdf` - downloadable CV used by the hero button.
- `tools/generate-cv-pdf.mjs` - local script that regenerates the PDF from `data/portfolio-data.js`.
- `robots.txt` and `sitemap.xml` - static SEO files.

## Update Content

Edit `data/portfolio-data.js`.

Use the top-level sections for:

- `personal` - name, headline, summary, location, and CV path.
- `contact` - email, phone, LinkedIn, GitHub, and location.
- `computerScience` - summary, strengths, skills, and relevant coursework.
- `projects` - featured CS projects.
- `experience` - professional roles.
- `education`, `certifications`, and `languages`.
- `creative` - photography, video, design, music, and optional gallery images.
- `additional` - other strengths and interests.

Empty contact links stay hidden automatically. Project links only appear when URLs are added.

## Add A New Project

Add another object to the `projects` array:

```js
{
  name: "Project Name",
  type: "Short category",
  problem: "The problem this project solves.",
  description: "What the project does.",
  role: "Your contribution.",
  technologies: ["Python", "Django"],
  achievement: "Supported result or learning outcome.",
  links: {
    GitHub: "https://github.com/...",
    Demo: "https://..."
  }
}
```

## Update Experience

Add or edit entries in the `experience` array. Keep highlights concise and use measurable achievements only when they are supported by real information.

## Add Photography Images

Place optimized images in `assets/photography/`, then add items to `creative.gallery`:

```js
{
  src: "assets/photography/photo.webp",
  thumb: "assets/photography/photo-thumb.webp",
  alt: "Short useful description",
  width: 1200,
  height: 800
}
```

The site lazy-loads gallery images and preserves dimensions to reduce layout shift.

## Replace Or Regenerate The CV PDF

To replace the PDF, put the final file at:

```text
assets/cv/Taonga-CV.pdf
```

To regenerate the current PDF from site content, run:

```powershell
node tools/generate-cv-pdf.mjs
```

## Preview Locally

Because this is buildless static HTML, you can open `index.html` directly in a browser. A local server is useful for final checks:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Deploy

Deploy the `portfolio-site` folder to any static host such as Cloudflare Pages, Netlify, Vercel, or GitHub Pages. The current Sites deployment domain is:

```text
https://taonga-cs-portfolio.spry-gem-9457.chatgpt.site/
```

## Missing Information To Finalize

- Full legal/professional name if the public site should show more than "Taonga".
- Email, phone, LinkedIn, GitHub, and any other professional contact links.
- Profile photo.
- Project screenshots, live demos, and repository links.
- Photography gallery images or a photography portfolio/social link.
- Custom production domain, if you want to replace the current Sites URL.
- Any official CV PDF the generated PDF should be replaced with.
