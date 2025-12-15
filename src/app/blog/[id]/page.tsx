// @ts-ignore
import { blogPosts } from "@/data/blogs";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  return blogPosts.map((post: any) => ({
    id: post.id.toString(),
  }));
}

export default function Page() {
  return <BlogPostClient />;
}
