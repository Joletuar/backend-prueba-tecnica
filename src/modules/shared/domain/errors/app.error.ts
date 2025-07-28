export class AppError extends Error {
  constructor(props: { message: string }) {
    const { message } = props;

    super(message);

    this.name = 'AppError';
  }
}
