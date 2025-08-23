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

Код приложения разделён на слои согласно парадигме MVP:
- cлой представления, отвечает за отображение данных на странице,
- cлой данных, отвечает за хранение и изменения данных,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах сидпоинт и возвращает промис с объектом, которым ответил сервер.
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляют эти данные на ендпоинт, переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используются в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс IProductData

Класс отвечает за хранение и логику работы с данными товаров. \
Конструктлор класса принимает инстант брокера событий. \
В полях класса хранятся следующие данные:
- `_products: IProduct[]` - массив товаров,
- `preview: string | null` - id товара, выбранного для просмора в модальном окне.


  products: IProduct[];
  preview: string | null;
  getProducts(): IProduct[];
  setProducts(products: IProduct[]): void;
  getSelectedProduct(): IProduct | null;
  setSelectedProduct(product: IProduct): void;
