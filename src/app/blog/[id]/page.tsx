import { supabase } from "@/lib/supabase";
import BlogPostClient from "./BlogPostClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getBlogPost(id: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
