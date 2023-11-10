import { ICar } from './car';
import { Transaction } from './transaction';

export enum PAYMENT_STATUS {
  DELIVER = 'DELIVER',
  IN_EDITOR = 'IN_EDITOR',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export interface Payment {
  id?: number | undefined | null;
  status?: PAYMENT_STATUS;
  amount: number;
  car: ICar;
}
