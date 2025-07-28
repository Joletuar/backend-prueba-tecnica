import type { Router } from 'express';

export interface RegistarRoute {
  NAME: string;

  register(router: Router): void;
}
