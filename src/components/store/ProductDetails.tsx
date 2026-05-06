interface ProductDetailsProps {
  images: string[];
  productName: string;
}

const ProductDetails = ({ images, productName }: ProductDetailsProps) => {
  if (!images || images.length < 2) return null;

  // Use all images except the first (main) one for the details grid
  const detailImages = images.slice(1);

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8 italic">
        Detalhes do Produto
      </h2>

      <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto">
        {detailImages.map((img, idx) => (
          <div
            key={idx}
            className="aspect-square overflow-hidden rounded-xl bg-secondary"
          >
            <img
              src={img}
              alt={`${productName} - detalhe ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
