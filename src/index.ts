// Импорты
import './scss/styles.scss';
import { Catalog } from './components/Catalog';
import { Basket } from './components/Basket';
import { Customer } from './components/Customer';

import { EventEmitter, IEvents } from './components/base/events';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { Events, IProduct } from './types';
import { lockBodyScroll, unlockBodyScroll } from './utils/utils';

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

// DOM-узлы
const modalContainer = document.getElementById('modal-container') as HTMLElement;
const headerElement = document.querySelector('.header') as HTMLElement;
const galleryRoot = document.querySelector<HTMLElement>('main.gallery');
if (!galleryRoot) throw new Error('Gallery root <main class="gallery"> not found');

// Шаблоны
const templateCatalogCard = document.getElementById('card-catalog') as HTMLTemplateElement;
const templateProductModal = document.getElementById('card-preview') as HTMLTemplateElement;
const templateBasket = document.getElementById('basket') as HTMLTemplateElement;
const templateBasketItem = document.getElementById('card-basket') as HTMLTemplateElement;
const templateOrder = document.getElementById('order') as HTMLTemplateElement;
const templateContacts = document.getElementById('contacts') as HTMLTemplateElement;
const templateSuccess = document.getElementById('success') as HTMLTemplateElement;

// Фабрики представлений
const makeCatalogCard = () => new CatalogCardView(cloneTemplate(templateCatalogCard));
const makeProductModal = () => new ProductModal(cloneTemplate(templateProductModal));
const makeBasketView = () => new BasketView(cloneTemplate(templateBasket));
const makeCheckoutPay = () => new CheckoutPay(cloneTemplate(templateOrder) as HTMLFormElement);
const makeCheckoutContact = () => new CheckoutContact(cloneTemplate(templateContacts) as HTMLFormElement);
const makeSuccess = () => new Success(cloneTemplate(templateSuccess));

// Представления
const modal = new Modal(modalContainer, events);
events.on(Events.ModalOpen, lockBodyScroll);
events.on(Events.ModalClose, unlockBodyScroll);
const header = new Header(headerElement, events);
const gallery = new Gallery(galleryRoot);
const basketView = makeBasketView();
header.setCounter(basket.getCount());
basketView.onCheckout(() => events.emit(Events.BasketCheckout));

// Хелпер: показать модалку
function showInModal(content: HTMLElement) {
  modal.setContent(content);
}

// Рендер содержимого корзины
function buildBasketItems(): HTMLElement[] {
  return basket.getItems().map((product, index) => {
    const row = new BasketItemView(
      cloneTemplate(templateBasketItem),
      () => events.emit(Events.BasketRemoveItem, { id: product.id })
    );

    return row.renderItem({
      id: product.id,
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });
}

// Реакция на изменение состава корзины
events.on(Events.BasketChanged, () => {
  basketView.setItems(buildBasketItems());
  basketView.setTotal(basket.getTotal());
  header.setCounter(basket.getCount());
});

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

// Открытие корзины
events.on(Events.BasketOpen, () => {
  showInModal(basketView.getElement());
});

// Выбор товара по клику в каталоге
events.on(Events.GalleryCardClick, ({ id }: { id: string }) => {
  catalog.setSelectedProductId(id);
});

// Показ превью товара в модалке
events.on(Events.PreviewChanged, ({ id }: { id: string | null }) => {
  const product = catalog.getSelectedProduct();
  if (!product) return;

  const view = makeProductModal();
  view.render(product);
  view.setPurchaseState(
    basket.hasInBasket(product.id),
    product.price !== null
  );

  view.onAddItem(() => {
    if (basket.hasInBasket(product.id)) {
      basket.removeProduct(product.id);
      view.setPurchaseState(false, product.price !== null);
    } else {
      basket.addItem(product);
      view.setPurchaseState(true, product.price !== null);
    }
  });

  showInModal(view.getElement());
});

// Закрытие модалки
events.on(Events.ModalClose, () => {
  catalog.clearPreview();
});

// Добавление товара в корзину
events.on(Events.BasketAddItem, ({ id }: { id: string }) => {
  const product = catalog.getProductById(id);
  if (product) basket.addItem(product);
});

// Удаление товара из корзины
events.on(Events.BasketRemoveItem, ({ id }: { id: string }) => {
  basket.removeProduct(id);
});

// Оформление заказа: выбор способа оплаты, переход к контактной форме
events.on(Events.BasketCheckout, () => {
  const formPay = makeCheckoutPay();
  formPay.render(customer.getData(), customer.validatePay());

  formPay.onPaymentSelect((payment) => {
    customer.updateData({ payment });
    formPay.render(customer.getData(), customer.validatePay());
  });

  formPay.onAddressChange((address) => {
    customer.updateData({ address });
    formPay.render(customer.getData(), customer.validatePay());
  });

  formPay.onSubmit(() => {
    const formContact = makeCheckoutContact();

    formContact.render(
      { email: customer.getData().email, phone: customer.getData().phone },
      customer.validateContacts()
    );

    formContact.onChange((contactData) => {
      customer.updateData(contactData);
      formContact.render(customer.getData(), customer.validateContacts());
    });

    formContact.onSubmit((contactData) => {
      customer.updateData(contactData);
      events.emit(Events.CheckoutContactSubmit);
    });

    showInModal(formContact.getElement());
  });

  showInModal(formPay.getElement());
});

// Оформление заказа: сабмит контактной формы, отправка заказа
events.on(Events.CheckoutContactSubmit, async () => {
  try {
    const payload = {
      ...customer.getData(),
      items: basket.buildOrderItems(),
      total: basket.getTotal(),
    };

    const response = await appApi.createOrder(payload);

    const view = makeSuccess();
    view.setTotal(response.total);
    view.onContinue(() => {
      modal.hide();
    });

    showInModal(view.getElement());
    basket.clearBasket();
    customer.clearData();
  } catch (err) {
    console.error('Order failed:', err);
  }
});

// Начальная загрузка каталога с сервера
appApi
  .getProducts()
  .then(items => catalog.setProducts(items))
  .catch(err => console.error('Failed to load products:', err));
