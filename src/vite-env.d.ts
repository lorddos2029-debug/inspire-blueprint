/// <reference types="vite/client" />

declare const Pagou: {
  setEnvironment(env: 'sandbox' | 'live'): void;
  elements(options: { publicKey: string; locale?: string; origin?: string }): {
    create(type: 'card', options?: { theme?: string }): {
      mount(selector: string): void;
      on(event: string, callback: (e: any) => void): void;
      unmount(): void;
    };
    submit(options: {
      createTransaction: (tokenData: { token: string }) => Promise<any>;
    }): Promise<{ status: string; error?: string; transaction?: any }>;
  };
  handleNextAction(nextAction: any): Promise<{ status: string }>;
};
