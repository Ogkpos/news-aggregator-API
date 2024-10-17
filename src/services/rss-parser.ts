import Parser from "rss-parser";
import { Article } from "../models/article";

let parser = new Parser();
let articles: any[] = [];

export const getNewsFromSources = async (
  sources: string[],
  keywords: string[]
) => {
  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source);
      const filteredArticles = feed.items.filter((item) => {
        return keywords.some(
          (keyword) =>
            item.title?.toLowerCase().includes(keyword.toLowerCase()) ||
            item.content?.toLowerCase().includes(keyword.toLowerCase())
        );
      });

      for (const article of filteredArticles) {
        const existingArticle = await Article.findOne({ url: article.link });
        if (!existingArticle) {
          await Article.build({
            title: article.title || "No title",
            author: article.creator || "Unknown",
            source: article.link || "Unknown source",
            url: article.link,
            content: article.contentSnippet || article.content || "No content",
            keywords,
            publishedAt: new Date(article.pubDate || Date.now()),
            createdAt: new Date(),
          }).save();
        }
      }
      articles.push(...filteredArticles);
    } catch (err) {
      console.error(`Failed to fetch news from ${source}:`, err);
    }
  }
  return articles;
};
