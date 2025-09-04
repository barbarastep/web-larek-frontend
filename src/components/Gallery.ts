export class Gallery {
  private catalogElement: HTMLElement;

  constructor(root: HTMLElement) {
    if (!root) throw new Error('Gallery root element not found');
    this.catalogElement = root;
  }

  setCatalog(items: HTMLElement[]): void {
    this.catalogElement.replaceChildren(...items);
  }
}
