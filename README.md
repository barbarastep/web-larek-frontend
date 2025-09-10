# Проектная работа "Веб-ларек"

**Стек:** HTML, SCSS, TS, Webpack

**Структура проекта:**
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

**Важные файлы:**
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Описание товара

```
export interface IProduct {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}
```

Данные покупателя

```
export interface ICustomer {
  payment: 'online' | 'cash' | ''
  email: string
  phone: string
  address: string
}
```

Каталог товаров

```
export interface IProductData {
  products: IProduct[];
  preview: string | null;
  getProducts(): IProduct[];
  setProducts(products: IProduct[]): void;
  getSelectedProduct(): IProduct | null;
  setSelectedProduct(product: IProduct): void;
  setSelectedProductId(id: string): void;
  getProductById(id: string): IProduct | null;
}
```
Товар для главной страницы

```
export type CatalogMain = Omit<IProduct, 'description'>;
```

Краткие данные товара в корзине

```
export type BasketItemSummary = Pick<IProduct, 'id' | 'title' | 'price'>;
```

Данные формы оплаты

```
export type CheckoutPayModalData = Pick<ICustomer, 'payment' | 'address'>;
```

Данные формы контактов

```
export type CheckoutContactModalData = Pick<ICustomer, 'email' | 'phone'>;
```

Служебные типы

```
export type CustomerErrors = Record<string, string>;
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

Данные для создания заказа

```
export type OrderPayload = ICustomer & { items: string[]; total: number };
```

Ответ сервера: итоговая сумма заказа

```
export type OrderResponse = { total: number };
```

## Архитектура приложения

Приложение разделено по MVP:
- Слой представления — рендер данных и обработка пользовательских действий
- Слой данных — хранение и изменение данных, бизнес‑логика
- Презентер - связь слоев представления и данных

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый URL и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет `GET`-запрос на эндпоинт, переданный в параметрах метода, и возвращает промис с объектом ответа сервера в формате JSON.
- `post` - принимает объект с данными, которые будут преобразованы в JSON и отправлены в теле запроса на эндпоинт, указанный в параметрах метода. По умолчанию выполняется `POST`-запрос, но можно передать третий параметр, чтобы использовать PUT или DELETE.

#### Класс EventEmitter
Брокер событий: позволяет подписываться и инициировать события между слоями (используется презентером). Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс Catalog
Класс отвечает за хранение и логику работы с данными товаров (реализует интерфейс `IProductData`). Конструктор принимает инстанс брокера событий.

Поля:
- productsData: IProduct[] — массив товаров
- previewId: string | null — id товара, выбранного для просмотра в модальном окне
- events: IEvents — экземпляр `EventEmitter` для оповещения об изменениях

Методы:
- getProducts(): IProduct[] — возвращает массив всех товаров каталога
- setProducts(products: IProduct[]): void — сохраняет массив товаров и генерирует событие обновления
- getSelectedProduct(): IProduct | null — возвращает выбранный товар; если не выбран — null
- setSelectedProduct(product: IProduct): void — сохраняет выбранный товар (по его id) и генерирует событие изменения выбора
- setSelectedProductId(id: string): void — сохраняет выбор по переданному id

#### Класс Basket
Класс отвечает за хранение и логику работы с товарами в корзине (реализует интерфейс `IBasketModel`). Конструктор принимает инстанс брокера событий.

Поля:
- items: IProduct[] — массив товаров, добавленных в корзину
- events: IEvents — экземпляр `EventEmitter` для оповещения об изменениях

Методы:
- addItem(product: IProduct): void — добавляет товар в корзину; если он уже есть, повторно не добавляется
- removeProduct(productId: string): void — удаляет товар по id
- getItems(): IProduct[] — возвращает список товаров в корзине
- hasInBasket(productId: string): boolean — проверяет наличие товара по id
- clearBasket(): void — очищает корзину
- getCount(): number — возвращает количество уникальных товаров в корзине
- getTotal(): number — возвращает итоговую стоимость всех товаров; товары с price == null пропускаются
- buildOrderItems(): string[] — формирует список id для заказа, по одному на каждый товар

#### Класс Customer
Класс отвечает за хранение и логику работы с данными пользователя (реализует интерфейс `ICustomerModel`). Конструктор принимает инстанс брокера событий.

Поля:
- payment — выбранный способ оплаты
- email — введённый адрес электронной почты
- phone — введённый номер телефона
- address — введённый адрес доставки
- events: IEvents — экземпляр `EventEmitter` для оповещения об изменениях

Методы:
- updateData(data: Partial<ICustomer>): void — обновляет данные (полностью или частично)
- getData(): ICustomer — возвращает текущие данные пользователя
- validateData(): CustomerErrors — возвращает объект ошибок по полям (пустой объект = ошибок нет)
- clearData(): void — сбрасывает все поля в пустые значения

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Modal
Класс управляет модальным окном: показывает внутри себя любое содержимое и закрывается по кнопке. Используется как общий контейнер для всех модалок.

Поля:
- container: HTMLElement
- closeButton: HTMLButtonElement
- contentElement: HTMLElement

Методы:
- setContent(content: HTMLElement) — вставляет содержимое
- onClose(handler: () => void) — сообщает о нажатии кнопки закрытия

#### FormView (базовый класс формы)
Базовый шаблон формы. Позволяет отображать поля, кнопку отправки и ошибки. Используется как основа для форм оформления заказа.

Поля:
- formElement: HTMLFormElement
- submitButton: HTMLButtonElement
- errorElement: HTMLElement | null

Методы:
- setData(data: Record<string, string>) — заполняет поля формы
- getData(): Record<string, string> — возвращает введённые значения
- setErrors(errors: Record<string, string>) — отображает ошибки
- onSubmit(handler: (data: Record<string, string>) => void) — сообщает о клике кнопки отправки

#### CheckoutPay (форма оплаты и адреса)
Форма для выбора способа оплаты и ввода адреса доставки.  Наследуется от FormView, поэтому использует общую логику работы с формами. Отображает кнопки для способов оплаты и поле для адреса. Передает данные при нажатии «Далее».

Поля:
- buttonCard: HTMLButtonElement
- buttonCash: HTMLButtonElement
- addressInput: HTMLInputElement
- submitButton: HTMLButtonElement

Методы:
- setData(data: CheckoutPayModalData) — заполняет данные формы
- getData(): CheckoutPayModalData — возвращает введённые данные
- onSubmit(handler: (data: CheckoutPayModalData) => void) — сообщает о клике «Далее»

#### CheckoutContact (форма контактов)
Форма для ввода контактных данных: email и телефона. Наследуется от FormView, поэтому использует общую логику работы с формами. Передает данные при нажатии кнопки «Оплатить».

Поля:
- emailInput: HTMLInputElement
- phoneInput: HTMLInputElement
- submitButton: HTMLButtonElement

Методы:
- setData(data: CheckoutContactModalData) — заполняет данные формы
- getData(): CheckoutContactModalData — возвращает введённые данные
- onSubmit(handler: (data: CheckoutContactModalData) => void) — сообщает о клике «Оплатить»

#### ProductCardBase (базовый шаблон карточки товара)
Базовый шаблон карточки товара. Содержит общие элементы (название и цену). Используется как основа для других карточек, чтобы не дублировать код.

Поля:
- titleElement: HTMLElement
- priceElement: HTMLElement

Методы:
- render(product: IProduct) — подставляет данные в карточку

#### CatalogCardView (карточка товара в списке)
Карточка товара в списке. Наследуется от ProductCardBase, поэтому использует базовую разметку карточки. Показывает основные данные товара и реагирует на клик по карточке.

Поля:
- container: HTMLButtonElement

Методы:
- render(data: ProductCardCommon) — рендерит карточку
- onCardClick(handler: (id: string) => void) — сообщает о клике по карточке

#### ProductModal (карточка товара в модалке)
Отвечает за отображение карточки товара в модальном окне. Наследуется от ProductCardBase, поэтому использует базовую разметку карточки. Показывает информацию о товаре и кнопку «В корзину». Сообщает, когда пользователь хочет добавить товар.

Поля:
- addButton: HTMLButtonElement

Методы:
- render(product: IProduct) — рендерит карточку товара
- onAddItem(handler: () => void) — сообщает о клике «В корзину»

#### BasketItemView (карточка товара в корзине)
Карточка товара в корзине. Наследуется от ProductCardBase, поэтому использует базовую разметку карточки. Показывает информацию о товаре и кнопку «Удалить». Сообщает о клике по кнопке удаления.

Поля:
- container: HTMLLIElement
- deleteBtn: HTMLButtonElement

Методы:
- render(data: ProductCardCommon & { index: number }) — рендерит строку корзины
- onRemove(handler: (id: string) => void) — сообщает о клике «Удалить»

#### BasketView (корзина)
Представляет корзину пользователя. Показывает список выбранных товаров, общую стоимость и кнопку «Оформить». Сообщает о клике для перехода к оформлению.

Поля:
- listElement: HTMLElement — список товаров
- checkoutButton: HTMLButtonElement — кнопка «Оформить»
- totalElement: HTMLElement — сумма заказа

Методы:
- setItems(items: HTMLElement[]) — вставляет список товаров
- setTotal(value: number) — обновляет сумму
- onCheckout(handler: () => void) — сообщает о клике «Оформить»

#### Success (подтверждение заказа)
Окно подтверждения заказа. Показывает сообщение об успешной оплате и сумму покупки. Сообщает о клике «За новыми покупками!».

Поля:
- messageElement: HTMLElement — сумма заказа
- continueButton: HTMLButtonElement — кнопка «За новыми покупками!»

Методы:
- setTotal(total: number) — обновляет текст с суммой
- onContinue(handler: () => void) — сообщает о клике по кнопке

#### Header (шапка сайта с корзиной)
Отображает шапку сайта. Включает кнопку корзины и счётчик товаров. Сообщает о клике по корзине.

Поля:
- basketButton: HTMLButtonElement
- counterElement: HTMLElement

Методы:
- setCounter(value: number) — обновляет число товаров
- onBasketClick(handler: () => void) — сообщает о клике по корзине

#### Gallery (список карточек товаров)
Представляет список карточек товаров в каталоге. Отвечает только за рендеринг карточек в контейнер.

Поля:
- catalogElement: HTMLElement

Методы:
- setCatalog(items: HTMLElement[]) — вставляет карточки каталога

### Слой коммуникации
#### Класс AppApi
Принимает в конструктор экземпляр класса `Api` и предоставляет методы, реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера. Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`. В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

**Список всех событий, которые могут генерироваться в системе:**

*События изменения данных (генерируются моделями данных)*
- `catalog:updated` — каталог товаров загружен/обновлён.
- `catalog:previewChanged` — выбран товар для просмотра.
- `basket:changed` — состав корзины изменился (добавление/удаление/очистка).
- `customer:updated` — данные покупателя обновлены/очищены.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `gallery:cardClick` — клик по карточке товара (передаёт `productId`).
- `basket:addItem` — добавление товара в корзину (передаёт `productId`).
- `basket:removeItem` — удаление позиции из корзины (передаёт `productId`).
- `basket:checkout` — клик «Оформить» в корзине.
- `basket:open` — открыть корзину в модалке.
- `checkout:contactSubmit` — сабмит формы контактов (передаёт `{ email, phone }`).
- `modal:open` — модалка открыта.
- `modal:close` — модалка закрыта.
