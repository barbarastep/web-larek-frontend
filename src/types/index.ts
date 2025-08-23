export interface IProduct {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}

export interface ICustomer {
  payment: 'card' | 'online' | ''
  email: string
  phone: string
  address: string
}

export interface IProductData {
  products: IProduct[];
  preview: string | null;
}

export type TCatalogMain = Omit<IProduct, 'description'>;

export type TCartItemSummary = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TCartItemWithQty = TCartItemSummary & { qty: number };

export type TCartPayModal = Pick<ICustomer, 'payment' | 'address'>;

export type TCartContactModal = Pick<ICustomer, 'email' | 'phone'>;

export type TOrderPayload = ICustomer & { items: string[] };

export type TOrderResponse = { total: number };

export type TCartItem = { product: IProduct; qty: number };
