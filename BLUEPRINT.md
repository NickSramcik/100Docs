# 🗺️ PROJECT BLUEPRINT
*Generated Aug 8, 2025, 09:13 PM UTC*

## CORE WORKFLOW
1. **Content**: Add/edit markdown files in `src/content/` 
2. **Build**: `npm run build` (Astro generates static site)
3. **Deploy**: Commit changes, submit a pull request for review

## PROJECT STRUCTURE
```
📁 .github
  📁 workflows
    📄 blueprint.yml
📄 README.md
📄 astro.config.mjs
📄 generate-blueprint.mjs
📄 jsconfig.json
📄 package.json
📁 public
  📄 favicon.svg
  📁 styles
    📄 global.css
📁 src
  📁 components
    📄 video.astro
  📁 content
    📄 blogs.md
    📄 classes.md
    📄 config.js
    📄 faq.md
    📄 getting-started.md
    📄 index.md
    📁 knowledge-base
      📁 frontend
        📄 accessibility.md
    📄 news.md
    📄 projects.md
    📄 resources.md
  📁 pages
    📄 [...page].astro
    📄 index.astro
```

## KEY FILE CODE EXAMPLES
### package.json
```json
{
  "name": "100docs",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "blueprint": "node generate-blueprint.mjs"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.3.3",
    "astro": "^5.12.8",
    "astro-embed": "^0.9.0"
  },
  "devDependencies": {
    "postcss": "^8.5.6"
  }
}

```

### astro.config.mjs
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx'; // Markdown support

export default defineConfig({
    integrations: [mdx()],
    markdown: {
        syntaxHighlight: 'shiki',
        shikiConfig: { theme: 'github-dark' },
    },
});

```

### ./src/pages/index.astro
```javascript
---
import { Content } from '../content/index.md';
---
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>100Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/simpledotcss/simple.css">
  <link rel="stylesheet" href="/styles/global.css">
</head>
<body>
  <Content />
</body>
</html>
```

### ./src/pages/[...page].astro
```javascript
---
// @ts-nocheck
export async function getStaticPaths() {
  // Only match Markdown content files
  const contentFiles = Object.keys(import.meta.glob('../content/!(index).md'));
  
  return contentFiles.map(filePath => ({
    params: {
      page: filePath
        .replace('../content/', '')
        .replace('.md', '')
    }
  }));
}

const titleCase = title => title.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
;
const { page } = Astro.params;

// Handle static assets by returning 404 for non-markdown routes
if (!page || page.includes('.')) {
  return new Response(null, {
    status: 404,
    statusText: 'Not found'
  });
}

const { Content } = await import(`../content/${page}.md`);
---
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>100Docs - {page}</title>
  <link rel="stylesheet" href="https://unpkg.com/simpledotcss/simple.css">
  <link rel="stylesheet" href="/styles/global.css">
</head>
<body>
  <h1>{titleCase(page)}</h1>
  <a href="/">← Home</a>
  <Content /> 
</body>
</html>
```

## CONTENT EXAMPLES
### blogs.md
```markdown
## Javascript

- [Currying Functions in Javascript](https://stevenmosescodes.hashnode.dev/currying-functions-in-javascript) by Steven Moses Illagan

## HTML/CSS
...
```

### classes.md
```markdown
# See all classes here:
- https://communitytaught.org/class/all

# Class 1 - Become A Software Engineer For Free
### Motivation
...
```

### faq.md
```markdown
## General Questions

### What is 100Devs?
100Devs is an agency that trains developers to build full-stack web applications. Our training program is 100% free. You can learn to code and get an amazing job through live instruction with an amazing community. For those that need it, we also offer a way to earn while you learn through building real code for real clients.

...
```
