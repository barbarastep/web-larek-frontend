export class Success {
  private root: HTMLElement;
  private messageElement: HTMLElement;
  private continueButton: HTMLButtonElement;
  private continueHandlers: Array<() => void> = [];
  private handleContinue = () => this.continueHandlers.forEach(h => h());

  constructor(root: HTMLElement) {
    this.root = root;

    const messageElement = root.querySelector<HTMLElement>('.order-success__description');
    const continueButton = root.querySelector<HTMLButtonElement>('.order-success__close');

    if (!messageElement) throw new Error('Success: .order-success__description not found');
    if (!continueButton) throw new Error('Success: .order-success__close not found');

    this.messageElement = messageElement;
    this.continueButton = continueButton;

    this.continueButton.addEventListener('click', this.handleContinue);
  }

  setTotal(total: number) {
    const value = Math.max(0, Number(total) || 0);
    this.messageElement.textContent = `Списано ${value} синапсов`;
  }

  onContinue(handler: () => void) {
    this.continueHandlers.push(handler);
  }
}
