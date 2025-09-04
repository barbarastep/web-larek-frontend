import { IProduct, OrderPayload, OrderResponse, IApi, ApiListResponse } from '../types';

// Класс-обертка для работы с серверным API
// Использует базовый API-клиент (IApi) и предоставляет методы для товаров и заказов
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

  // Создать заказ с суммой заказа
  createOrder(payload: OrderPayload): Promise<OrderResponse> {
    return this._baseApi.post<OrderResponse>('/order', payload);
  }
}
