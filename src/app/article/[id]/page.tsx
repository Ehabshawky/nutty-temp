// @ts-ignore
import { articles } from "@/data/articles";
import ArticlePostClient from "./ArticlePostClient";

export function generateStaticParams() {
  return articles.map((article: any) => ({
    id: article.id.toString(),
  }));
}

export default function Page() {
  return <ArticlePostClient />;
}
