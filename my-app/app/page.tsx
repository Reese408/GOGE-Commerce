import { Hero } from "@/components/layout-page/hero";
import { FeaturedSlideshow } from "@/components/home/featured-slideshow";
import { FeaturedProducts } from "@/components/products/featured-products";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedSlideshow />
      <FeaturedProducts />
    </div>
  );
}
