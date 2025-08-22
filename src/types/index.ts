export interface Iproduct {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}

export interface Icustomer {
  payment: 'card' | 'online' | ''
  email: string
  phone: string
  address: string
}

export type CartItem = { product: Iproduct; qty: number };
