import { Person } from './person';
import { Role } from './roles';

export interface User {
  id: string | null | undefined;
  username: string;
  password?: string;
  person: Person;
  roles: Role[];
  active: boolean;
  adress: string;
  resetLinkToken: string | null | undefined;
}
