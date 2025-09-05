// Импорты стилей, моделей, API и view-классов
import './scss/styles.scss';
import { Catalog } from './components/Catalog';
import { Basket } from './components/Basket';
import { Customer } from './components/Customer';

import { EventEmitter, IEvents } from './components/base/events';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';
import { Events, IProduct } from './types';

import { Modal } from './components/Modal';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { BasketView } from './components/BasketView';
import { CatalogCardView } from './components/CatalogCardView';
import { ProductModal } from './components/ProductModal';
import { BasketItemView } from './components/BasketItemView';
import { CheckoutPay } from './components/CheckoutPay';
import { CheckoutContact } from './components/CheckoutContact';
import { Success } from './components/Success';

// Инициализация моделей и API
const events: IEvents = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const customer = new Customer(events);
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// DOM-контейнеры
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const headerElement = document.querySelector('.header') as HTMLElement;

// Шаблоны
const templateCatalogCard = document.getElementById('card-catalog') as HTMLTemplateElement;
const templateProductModal = document.getElementById('card-preview') as HTMLTemplateElement;
const templateBasket = document.getElementById('basket') as HTMLTemplateElement;
const templateBasketItem = document.getElementById('card-basket') as HTMLTemplateElement;
const templateOrder = document.getElementById('order') as HTMLTemplateElement;
const templateContacts = document.getElementById('contacts') as HTMLTemplateElement;
const templateSuccess = document.getElementById('success') as HTMLTemplateElement;

// Проверка на месте ли узлы
console.assert(!!modalContainer, 'modalContainer not found');
console.assert(!!headerElement, 'headerElement not found');
console.assert(!!templateCatalogCard && !!templateProductModal && !!templateBasket && !!templateBasketItem && !!templateOrder && !!templateContacts && !!templateSuccess, 'Some templates not found');

// Клонирование шаблонов
function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  const node = template.content.firstElementChild?.cloneNode(true);
  if (!(node instanceof HTMLElement)) throw new Error('Template is empty or invalid');
  return node;
};

// Представления
const modal = new Modal(modalContainer, events);
const header = new Header(headerElement);
const galleryRoot = document.querySelector<HTMLElement>('main.gallery');
if (!galleryRoot) throw new Error('Gallery root <main class="gallery"> not found');
const gallery = new Gallery(galleryRoot);

const makeCatalogCard = () => new CatalogCardView(cloneTemplate(templateCatalogCard));
const makeProductModal = () => new ProductModal(cloneTemplate(templateProductModal));
const makeBasketItem = () => new BasketItemView(cloneTemplate(templateBasketItem));
const makeBasketView = () => new BasketView(cloneTemplate(templateBasket));
const makeCheckoutPay = () => new CheckoutPay(cloneTemplate(templateOrder) as HTMLFormElement);
const makeCheckoutContact = () => new CheckoutContact(cloneTemplate(templateContacts) as HTMLFormElement);
const makeSuccess = () => new Success(cloneTemplate(templateSuccess));

// Рендер каталога при обновлении данных
events.on(Events.CatalogUpdated, (payload?: unknown) => {
  const products = (payload as IProduct[]) ?? catalog.getProducts();
  console.log('[TEST] products length =', products.length); // временно
  const items = products.map(product => {
    const card = makeCatalogCard();

    card.onCardClick((id) => {
      events.emit(Events.GalleryCardClick, { id });
    });
    return card.render(product);
  });

  gallery.setCatalog(items);
})

// Открытие превью товара
events.on(Events.GalleryCardClick, ({ id }: { id: string }) => {
  catalog.setSelectedProductId(id);
});

events.on(Events.PreviewChanged, ({ id }: { id: string | null }) => {
  const product = catalog.getSelectedProduct();
  if (!product) return;

  const view = makeProductModal();
  view.render(product);

  view.onAddItem(() => {
    events.emit(Events.BasketAddItem, { id: product.id });
  });

  modal.setContent(view.getElement());
});

events.on(Events.ModalClose, () => {
  catalog.clearPreview();
});

appApi
  .getProducts()
  .then(items => catalog.setProducts(items))
  .catch(err => console.error('Failed to load products:', err));

// === DEBUG: временные логи событий ===
events.on(Events.GalleryCardClick, (d) => console.log('[TEST] GalleryCardClick', d));
events.on(Events.PreviewChanged, (d) => console.log('[TEST] PreviewChanged', d));
events.on(Events.ModalClose, () => console.log('[TEST] ModalClose'));
events.on(Events.BasketAddItem, (id) => console.log('[TEST] BasketAddItem', id));

// Удобно: вытащим в window для ручных проверок из консоли
(Object.assign(window as any, { events, catalog, Events }));

// dev-debug only
// @ts-ignore
(window as any).events = events;
// @ts-ignore
(window as any).catalog = catalog;

(Object as any).assign(window as any, { modal });
