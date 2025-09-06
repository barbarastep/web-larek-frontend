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
header.onBasketClick(() => { renderBasketModal(); });
const galleryRoot = document.querySelector<HTMLElement>('main.gallery');
if (!galleryRoot) throw new Error('Gallery root <main class="gallery"> not found');
const gallery = new Gallery(galleryRoot);

// Хелперы
const makeCatalogCard = () => new CatalogCardView(cloneTemplate(templateCatalogCard));
const makeProductModal = () => new ProductModal(cloneTemplate(templateProductModal));
const makeBasketItem = () => new BasketItemView(cloneTemplate(templateBasketItem));
const makeBasketView = () => new BasketView(cloneTemplate(templateBasket));
const makeCheckoutPay = () => new CheckoutPay(cloneTemplate(templateOrder) as HTMLFormElement);
const makeCheckoutContact = () => new CheckoutContact(cloneTemplate(templateContacts) as HTMLFormElement);
const makeSuccess = () => new Success(cloneTemplate(templateSuccess));

// Найти товар в каталоге по id
function getProductById(id: string) {
  return catalog.getProducts().find(p => p.id === id) ?? null;
}

// Рендер корзины в модалку
function renderBasketModal() {
  const basketView = makeBasketView();

  const items = basket.getItems().map((p, i) => {
    const row = makeBasketItem();
    row.renderItem({
      id: p.id,
      title: p.title,
      price: p.price,
      index: i + 1,
    });

    row.onRemove((id) => {
      events.emit(Events.BasketRemoveItem, { id });
    });

    return row.getElement ? (row as any).getElement?.() ?? (row as any) : (row as any);
  });

  basketView.setItems(items);
  basketView.setTotal(basket.getTotal());

  basketView.onCheckout(() => {
    events.emit(Events.BasketCheckout);
  });

  modal.setContent(basketView.getElement());
}

// Рендер каталога при обновлении данных
events.on(Events.CatalogUpdated, (payload?: unknown) => {
  const products = (payload as IProduct[]) ?? catalog.getProducts();
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
  view.setInBasket(basket.hasInBasket(product.id));

  view.onAddItem(() => {
    if (basket.hasInBasket(product.id)) {
      basket.removeProduct(product.id);
      view.setInBasket(false);
    } else {
      basket.addItem(product);
      view.setInBasket(true);
    }
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

// Добавление товара в корзину
events.on(Events.BasketAddItem, ({ id }: { id: string }) => {
  const product = getProductById(id);
  if (!product) return;
  basket.addItem(product);
});

events.on(Events.BasketRemoveItem, ({ id }: { id: string }) => {
  basket.removeProduct(id);
  renderBasketModal();
});

events.on(Events.BasketChanged, () => {
  header.setCounter(basket.getCount());
});
