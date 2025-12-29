import ProjectDetailClient from "./ProjectDetailClient";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetailClient id={id} />;
}

// Required for static export with dynamic routes
export async function generateStaticParams() {
  try {
    const { data: projects } = await supabaseAdmin
      .from('projects')
      .select('id');
    
    return (projects || []).map((project: any) => ({
      id: project.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
