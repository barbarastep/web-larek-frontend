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

  // обработчики событий (Escape, клик по крестику, клик по фону)
  private onEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  };
  private handleCloseClick = (event: Event) => { event.preventDefault(); this.close(); };
  private handleOverlayClick = (event: MouseEvent) => {
    if (event.target === this.container) this.close();
  };

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

  // открыть модалку
private open() {
  this.container.classList.add('modal_active');
  this.container.setAttribute('aria-hidden', 'false');

  if (this.isOpen) {
    return;
  }

  this.isOpen = true;
  document.addEventListener('keydown', this.onEsc);
  document.body.style.overflow = 'hidden';
}

// закрыть модалку
private close() {
  if (!this.isOpen) return;

  this.isOpen = false;

  (document.activeElement as HTMLElement | null)?.blur?.();

  document.removeEventListener('keydown', this.onEsc);
  document.body.style.overflow = '';

  this.container.classList.remove('modal_active');
  this.container.setAttribute('aria-hidden', 'true');

  this.events.emit(Events.ModalClose);
  this.closeHandlers.forEach((handler) => handler());
  this.contentElement.replaceChildren();
}

// установить новое содержимое и открыть
  setContent(content: HTMLElement): void {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(content);
    this.open();
  }

  // подписка на закрытие
  onClose(handler: () => void): void {
    this.closeHandlers.push(handler);
  }
}
