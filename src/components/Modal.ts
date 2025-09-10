import { IEvents } from "./base/events";
import { Events } from "../types";

// Универсальное модальное окно
// Управляет открытием/закрытием, вставкой содержимого и событиями закрытия
export class Modal {
  private container: HTMLElement;
  private closeButton: HTMLButtonElement;
  private contentElement: HTMLElement;
  private events: IEvents;
  private isOpen = false;
  private closeHandlers: Array<() => void> = [];

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;

    const closeButton = this.container.querySelector<HTMLButtonElement>('.modal__close');
    const content = this.container.querySelector<HTMLElement>('.modal__content');
    if (!closeButton || !content) throw new Error('Modal: required elements not found');
    this.closeButton = closeButton;
    this.contentElement = content;

    this.closeButton.addEventListener('click', this.handleCloseClick);
    this.container.addEventListener('click', this.handleOverlayClick);
  }

  // Обработчики событий (Escape, клик по крестику, клик по фону)
  private onEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  };
  private handleCloseClick = (event: Event) => { event.preventDefault(); this.close(); };
  private handleOverlayClick = (event: MouseEvent) => {
    if (event.target === this.container) this.close();
  };

  // Открыть модалку
  private open() {
    this.container.classList.add('modal_active');
    this.container.setAttribute('aria-hidden', 'false');

    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.events.emit(Events.ModalOpen);
    document.addEventListener('keydown', this.onEsc);
  }

  // Закрыть модалку
  private close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    (document.activeElement as HTMLElement | null)?.blur?.();

    document.removeEventListener('keydown', this.onEsc);

    this.container.classList.remove('modal_active');
    this.container.setAttribute('aria-hidden', 'true');

    this.events.emit(Events.ModalClose);
    this.closeHandlers.forEach((handler) => handler());
    this.contentElement.replaceChildren();
  }

  public hide() {
    this.close();
  }

  // Установить новое содержимое и открыть
  setContent(content: HTMLElement): void {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(content);
    this.open();
  }

  // Подписка на закрытие
  onClose(handler: () => void): void {
    this.closeHandlers.push(handler);
  }
}
