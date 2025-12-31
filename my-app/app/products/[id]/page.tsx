import { ProductDetail } from "@/components/products/product-detail";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductDetail productId={decodeURIComponent(id)} />;
}
