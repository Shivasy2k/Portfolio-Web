# Sivakumar Dhanasekar Portfolio Website

Static, content-driven portfolio starter inspired by modern single-page portfolio layouts, but written with original structure and styling.

## Run Locally

Because the site loads JSON with `fetch`, serve it with a local web server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Main Files

- `index.html` - single-page portfolio shell
- `assets/css/styles.css` - responsive visual design
- `assets/js/main.js` - renders JSON data into the page
- `data/*.json` - editable website content
- `content/` - folders for files you want to upload and link later

## Upload Folders

- `content/resume/` - resume PDF or DOCX
- `content/certificates/` - certificates
- `content/publications/` - publication PDFs
- `content/talks/` - talks, speaker decks, posters
- `content/blogs/` - blog drafts or exported articles
- `content/patents/` - patent documents
- `content/media/` - interviews, press, podcasts
- `content/documents/` - miscellaneous supporting documents
- `assets/img/profile/` - profile photo
- `assets/img/projects/` - project or case study images
- `assets/img/logos/` - logos and partner marks

## Editing Content

Update:

- `data/profile.json` for bio, stats, contact, links, and expertise
- `data/experience.json` for career timeline
- `data/publications.json` for research papers
- `data/writing.json` for external blog links
- `data/recognition.json` for certificates, memberships, patents, and service

After editing JSON, refresh the browser.
