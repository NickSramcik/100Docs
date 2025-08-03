import { defineCollection } from 'astro:content';

const knowledgeBase = defineCollection({
  type: 'content',
});

export const collections = {
  'knowledge-base': knowledgeBase,
};
