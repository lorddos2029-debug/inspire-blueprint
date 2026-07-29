export interface CategoryProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  slug?: string;
}

export interface ProductCategory {
  title: string;
  products: CategoryProduct[];
}

/**
 * O layout Casa Prestige usa uma única vitrine ("Tudo para a sua Casa"),
 * portanto não há seções por categoria na home.
 */
export const productCategories: ProductCategory[] = [];
