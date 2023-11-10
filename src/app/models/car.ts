import { ICarBody } from './carBody';
import { ICarColor } from './carColor';
import { IEnginePower } from './enginePower';
import { Payment } from './payment';
import { User } from './user';
import { IVehiculeModel } from './vehiculeModel';

export interface ICar {
  carBody: ICarBody;
  color: ICarColor;
  desiredAmount: number;
  enginePower: IEnginePower;
  id: string | undefined | null;
  isfuel: boolean;
  numberOfDoor: number;
  numberOfKey: number;
  numberOfKilometerUsed: number;
  payment: Payment | null | undefined;
  productionYear: number;
  realSellAmount: number;
  sell: boolean;
  systemAmount: number;
  technicalVisitCheck: boolean;
  vehiculeInsurance: boolean;
  vehiculeModel: IVehiculeModel;
  user: User | null | undefined;
  images?: any[];
}
