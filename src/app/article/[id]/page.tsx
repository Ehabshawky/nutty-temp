import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ArticlePostClient from "./ArticlePostClient";

export const dynamicParams = true; // Allow dynamic fallback for IDs not generated at build time

export async function generateStaticParams() {
  const { data: articles } = await supabase.from('articles').select('id');
  return (articles || []).map((article) => ({
    id: article.id.toString(),
  }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (!article) {
    notFound();
  }

  // Map DB fields to Frontend expected format
  const mappedArticle = {
    ...article,
    readTime_en: article.read_time_en,
    readTime_ar: article.read_time_ar,
  };

  return <ArticlePostClient article={mappedArticle} />;
}
