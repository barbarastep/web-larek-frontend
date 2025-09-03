import { IEvents } from "./base/events";
import { Events } from "../types";

export class Modal {
  private container: HTMLElement;
  private closeButton: HTMLButtonElement;
  private contentElement: HTMLElement;
  private events: IEvents;
  private isOpen = false;
  private closeHandlers: Array<() => void> = [];
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

  private open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.container.classList.add('modal_active');
    this.container.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', this.onEsc);
    document.body.style.overflow = 'hidden';
  }

  private close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.classList.remove('modal_active');
    this.container.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', this.onEsc);
    document.body.style.overflow = '';
    this.events.emit(Events.ModalClose);
    this.closeHandlers.forEach((handler) => handler());
    this.contentElement.replaceChildren();
  }

  setContent(content: HTMLElement): void {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(content);
    this.open();
  }

  onClose(handler: () => void): void {
    this.closeHandlers.push(handler);
  }

  public destroy() {
  this.closeButton.removeEventListener('click', this.handleCloseClick);
  this.container.removeEventListener('click', this.handleOverlayClick);
  document.removeEventListener('keydown', this.onEsc);
}
}
