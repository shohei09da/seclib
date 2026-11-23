// src/content.config.ts
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 1. セキュリティ用語・技術体系（サイトのハブ）
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/glossary' }),
  schema: z.object({
    title: z.string(),
    reading: z.string().optional(), // 五十音順ソート用
    category: z.enum(['crypto', 'network', 'auth', 'governance', 'attack', 'defense']),
    summary: z.string(),
    draft: z.boolean().default(false),
    updatedAt: z.coerce.date(),
  }),
});

// 2. IPA試験 解説（FE / AP / SC の3区分）
const exams = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/exams' }),
  schema: z.object({
    title: z.string(),
    examType: z.enum(['fe', 'ap', 'sc']),
    examYear: z.string(), // 例: "2026-autumn", "sample"
    themeTags: z.array(z.string()), // 例: ["認可制御", "PKCE"]
    relatedGlossary: z.array(reference('glossary')).default([]),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date(),
  }),
});

// 3. トピックス解説（インシデント・制度・製品・ニュース・書籍）
const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    title: z.string(),
    topicType: z.enum(['incident', 'regulation', 'product', 'news', 'book']),
    relatedGlossary: z.array(reference('glossary')).default([]),
    // topicType が 'book' のときだけ任意で使う書誌情報
    bookInfo: z
      .object({
        author: z.string(),
        publisher: z.string().optional(),
        targetLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      })
      .optional(),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { glossary, exams, topics };