import { AppError } from './app.error';

export class InfraestructureError extends AppError {
  readonly statusCode?: number;
  readonly isCritical?: boolean;
  readonly originalError?: unknown;

  constructor(props: {
    message: string;
    statusCode?: number;
    isCritical?: Boolean;
    originalError?: unknown;
  }) {
    const { message } = props;

    super({ message });

    this.name = 'InfraestructureError';
  }
}
