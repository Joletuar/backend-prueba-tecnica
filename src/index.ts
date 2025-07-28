import 'dotenv/config';

import { ApiApp } from './apps/api';

async function main(): Promise<void> {
  console.log('Starting application...');

  try {
    await new ApiApp().init();

    console.log('Application started successfully.');
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing');
  process.exit(0);
});

void main();
