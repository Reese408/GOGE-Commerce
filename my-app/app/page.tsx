import { Hero } from "@/components/layout-page/hero";
import { FeaturedSlideshow } from "@/components/home/featured-slideshow";
import { FeaturedProducts } from "@/components/products/featured-products";
import { StructuredData } from "@/components/seo/structured-data";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateWebsiteSchema()} />
      <div>
        <Hero />
        <FeaturedSlideshow />
        <FeaturedProducts />
      </div>
    </>
  );
}
