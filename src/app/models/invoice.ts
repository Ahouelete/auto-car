import { ICar } from './car';
import { Payment } from './payment';

export interface Invoice {
  id: number | undefined | null;
  customer?: any;
  carList: ICar[];
  payment: Payment;
  status?: string;
  dateLiv?: Date;
  date?: Date;
}
