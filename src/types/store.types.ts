import { PublicProductItem, ProductDivision } from './public-catalog.types';

export type { ProductDivision };
export type ProductItem = PublicProductItem;

export interface CartItem extends PublicProductItem {
  quantity: number;
  selectedVariantId?: string;
  selectedVariantName?: string;
}