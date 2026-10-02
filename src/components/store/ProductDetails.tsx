interface ProductDetailsProps {
  images: string[];
  productName: string;
}

const ProductDetails = ({ images, productName }: ProductDetailsProps) => {
  if (!images || images.length < 2) return null;

  const detailImages = images.slice(1);

  return (
    <div className="mt-3 w-full min-w-0 max-w-full space-y-3 overflow-hidden">
      {detailImages.map((img, idx) => (
        <div
          key={idx}
          className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-secondary/20"
        >
          <img
            src={img}
            alt={`${productName} - detalhe ${idx + 1}`}
            className="block w-full max-w-full h-auto object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
};

export default ProductDetails;
