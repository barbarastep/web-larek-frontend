// Отвечает за отображение каталога товаров
// Принимает список карточек и вставляет их в контейнер

export class Gallery {
  private catalogElement: HTMLElement;

  constructor(root: HTMLElement) {
    if (!root) throw new Error('Gallery root element not found');
    this.catalogElement = root;
  }

  // Подменяет содержимое каталога на новые карточки
  setCatalog(items: HTMLElement[]): void {
    this.catalogElement.replaceChildren(...items);
  }
}
