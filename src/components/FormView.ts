import { IEvents } from "./base/events";

export class FormView {
  private formElement: HTMLFormElement;
  private submitButton: HTMLButtonElement;
  private errorElement: HTMLElement | null;
  private events?: IEvents;
  private onSubmitHandlers: Array<(data: Record<string, string>) => void> = [];

  constructor(formElement: HTMLFormElement, events?: IEvents) {
    this.formElement = formElement;
    this.events = events;

    const button = this.formElement.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!button) throw new Error('FormView: submit button not found');
    this.submitButton = button;
    this.errorElement = this.formElement.querySelector<HTMLElement>('.form__errors')!;

    this.formElement.addEventListener('submit', this.handleSubmit);
  }

  getData(): Record<string, string> {
    const formData = new FormData(this.formElement);
    const result: Record<string, string> = {};
    formData.forEach((value, key) => {
      result[key] = value.toString().trim();
    });
    return result;
  }

  setData(data: Record<string, string>): void {
    Object.entries(data).forEach(([key, value]) => {
      const input = this.formElement.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${key}"]`);
      if (input) input.value = value;
    });
  }

  setErrors(errors: Record<string, string>): void {
    if (this.errorElement) {
      this.errorElement.textContent = Object.values(errors).join(', ');
    }
      this.submitButton.disabled = Object.keys(errors).length > 0;

  }

  onSubmit(handler: (data: Record<string, string>) => void): void {
    this.onSubmitHandlers.push(handler);
  }

  private handleSubmit = (event: Event) => {
    event.preventDefault();
    const data = this.getData();
    this.onSubmitHandlers.forEach((handler) => handler(data));
  }

  public destroy() {
    this.formElement.removeEventListener('submit', this.handleSubmit);
  }
}
