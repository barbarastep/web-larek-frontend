import type { IProduct, IProductData } from '../types';
import { Events } from '../types';
import { IEvents } from './base/events';

// Каталог (модель данных для списка товаров)
export class Catalog implements IProductData {
  private productsData: IProduct[] = [];
  private previewId: string | null = null;
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Геттеры для доступа к данным
  get products(): IProduct[] { return [...this.productsData]; }
  get preview(): string | null { return this.previewId; }

  // Вернуть список товаров
  getProducts(): IProduct[] { return [...this.productsData]; }

  // Установить товары каталога и сообщить об обновлении
  setProducts(products: IProduct[]): void {
    this.productsData = products;
    this.events.emit(Events.CatalogUpdated, this.productsData);
  }

  // Найти товар по id
  getProductById(id: string): IProduct | null {
    return this.productsData.find(p => p.id === id) ?? null;
  }

  // Получить выбранный товар (по previewId)
  getSelectedProduct(): IProduct | null {
    return this.previewId
      ? this.productsData.find(p => p.id === this.previewId) ?? null
      : null;
  }

  // Установить выбранный товар по объекту
  setSelectedProduct(product: IProduct): void {
    this.previewId = product.id;
    this.events.emit(Events.PreviewChanged, { id: this.previewId });
  }

  // Установить выбранный товар по id
  setSelectedProductId(id: string): void {
    if (this.previewId === id) return;
    this.previewId = id;
    this.events.emit(Events.PreviewChanged, { id });
  }

  // Очистить выбор товара
  clearPreview(): void {
    this.previewId = null;
    this.events.emit(Events.PreviewChanged, { id: null });
  }
}
