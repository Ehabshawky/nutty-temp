import ServiceDetailClient from "./ServiceDetailClient";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceDetailClient id={id} />;
}

// Required for static export with dynamic routes
export async function generateStaticParams() {
  try {
    const fs = require('fs');
    const path = require('path');
    const dataFilePath = path.join(process.cwd(), 'data', 'site-content.json');
    const file = fs.readFileSync(dataFilePath, 'utf-8');
    const data = JSON.parse(file);
    const services = data.services || [];
    
    return services.map((service: any) => ({
      id: service.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
