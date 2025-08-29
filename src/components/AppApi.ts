// import { IProduct, OrderPayload, OrderResponse, IApi } from '../types';

// export class AppApi {
//   private _baseApi: IApi;

//   constructor(baseApi: IApi) {
//     this._baseApi = baseApi;
//   }

//   // Получить список товаров
//   // getProducts(): Promise<IProduct[]> {
//   //   return this._baseApi.get<IProduct[]>('/products');
//   // }

//   // Получить список товаров (с фолбэком на /products/)
//   async getProducts(): Promise<IProduct[]> {
//     try {
//       return await this._baseApi.get<IProduct[]>('/products');
//     } catch (e) {
//       return this._baseApi.get<IProduct[]>('/products/'); // ← пробуем со слэшем
//     }
//   }

//   // Получить один товар по id (с фолбэком на /products/:id/)
//   async getProduct(id: string): Promise<IProduct> {
//     try {
//       return await this._baseApi.get<IProduct>(`/products/${id}`);
//     } catch (e) {
//       return this._baseApi.get<IProduct>(`/products/${id}/`); // ← пробуем со слэшем
//     }
//   }

//   // Получить один товар по id
//   // getProduct(id: string): Promise<IProduct> {
//   //   return this._baseApi.get<IProduct>(`/products/${id}`);
//   // }

//   // Создать заказ
//   createOrder(payload: OrderPayload): Promise<OrderResponse> {
//     return this._baseApi.post<OrderResponse>('/order', payload);
//   }
// }

import { IProduct, OrderPayload, OrderResponse, IApi, ApiListResponse } from '../types';

export class AppApi {
  constructor(private _baseApi: IApi) { }

  // Получить список товаров
  getProducts(): Promise<IProduct[]> {
    return this._baseApi
      .get<ApiListResponse<IProduct>>('/product')
      .then(res => res.items);
  }

  // Получить один товар по id
  getProduct(id: string): Promise<IProduct> {
    return this._baseApi.get<IProduct>(`/product/${id}`);
  }

  // Создать заказ
  createOrder(payload: OrderPayload): Promise<OrderResponse> {
    return this._baseApi.post<OrderResponse>('/order', payload);
  }
}
