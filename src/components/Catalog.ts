import type { IProduct, IProductData } from '../types';
import { Events } from '../types';
import { IEvents } from './base/events';

// Каталог (данные)
export class Catalog implements IProductData {
  private productsData: IProduct[] = [];
  private previewId: string | null = null;
  private readonly events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  get products(): IProduct[] { return [...this.productsData]; }
  get preview(): string | null { return this.previewId; }

  getProducts(): IProduct[] { return [...this.productsData]; }

  setProducts(products: IProduct[]): void {
    this.productsData = products;
    this.events.emit(Events.CatalogUpdated, this.productsData);
  }

  getSelectedProduct(): IProduct | null {
    return this.previewId
      ? this.productsData.find(p => p.id === this.previewId) ?? null
      : null;
  }

  setSelectedProduct(product: IProduct): void {
    this.previewId = product.id;
    this.events.emit(Events.PreviewChanged, { id: this.previewId });
  }

  setSelectedProductId(id: string): void {
    if (this.previewId === id) return;
    this.previewId = id;
    this.events.emit(Events.PreviewChanged, { id });
  }

  clearPreview(): void {
    this.previewId = null;
    this.events.emit(Events.PreviewChanged, { id: null });
  }
}
