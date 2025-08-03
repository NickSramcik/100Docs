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
