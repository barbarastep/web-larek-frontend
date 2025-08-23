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
  payment: 'card' | 'online' | ''
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
}
```
Товар для главной страницы

```
export type CatalogMain = Omit<IProduct, 'description'>;
```

Краткие данные товара в корзине

```
export type CartItemSummary = Pick<IProduct, 'id' | 'title' | 'price'>;
```

Позиция корзины: товар + количество

```
export type CartItemView = TCartItemSummary & { qty: number };
```

Данные формы оплаты

```
export type CartPayModal = Pick<ICustomer, 'payment' | 'address'>;
```

Данные формы контактов

```
export type CartContactModal = Pick<ICustomer, 'email' | 'phone'>;
```

Данные для создания заказа

```
export type OrderPayload = ICustomer & { items: string[] };
```

Ответ сервера: итоговая сумма заказа

```
export type OrderResponse = { total: number };
```

Элемент корзины

```
export type CartItem = { product: IProduct; qty: number };
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
Брокер событий: позволяет подписываться и инициировать события между слоями (используется презентером). \
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс IProductData

Класс отвечает за хранение и логику работы с данными товаров. \
Конструктор принимает инстанс брокера событий.

Поля:
- _products: IProduct[] — массив товаров
- _preview: string | null — id товара, выбранного для просмотра в модальном окне
- events: IEvents — экземпляр `EventEmitter` для оповещения об изменениях

Методы:
- getProducts(): IProduct[] — возвращает массив всех товаров каталога
- setProducts(products: IProduct[]): void — сохраняет массив товаров и генерирует событие обновления
- getSelectedProduct(): IProduct | null — возвращает выбранный товар; если не выбран — null
- setSelectedProduct(product: IProduct): void — сохраняет выбранный товар (по его id) и генерирует событие изменения выбора

#### Класс ICartModel
Класс отвечает за хранение и логику работы с товарами в корзине. \
Конструктор принимает инстанс брокера событий.

Поля:
- _items: CartItem[] — позиции корзины
- events: IEvents — экземпляр `EventEmitter` для оповещения об изменениях

Методы:
- addProduct(product: IProduct): void — добавляет товар; если уже есть, увеличивает количество
- setQuantity(productId: string, qty: number): void — задаёт количество; qty <= 0 удаляет товар
- removeProduct(productId: string): void — удаляет товар по id
- count(): number — возвращает суммарное количество единиц товаров (сумма qty)
- total(): number — возвращает итоговую стоимость (учитывает qty, пропускает товары с price == null)
- getItems(): CartItem[] — возвращает список позиций корзины
- has(productId: string): boolean — проверяет наличие товара по id
- clear(): void — очищает корзину
- buildOrderItems(): string[] — формирует список id для заказа, дублируя id по количеству

#### Класс ICustomerModel
Класс отвечает за хранение и логику работы с данными пользователя. \
Конструктор принимает инстанс брокера событий.

Поля:
- _payment — выбранный способ оплаты
- _email — введённый email
- _phone — введённый номер телефона
- _address — введённый адрес
- events: IEvents — экземпляр EventEmitter для оповещения об изменениях

Методы:
- update(data: Partial<ICustomer>): void — обновляет данные (полностью или частично)
- getData(): ICustomer — возвращает текущие данные пользователя
- validate(): string[] — проверяет корректность адреса; пустой массив = ошибок нет
- clear(): void — сбрасывает все поля в пустые значения
