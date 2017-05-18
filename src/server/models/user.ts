import { GoogleTokens } from './googleTokens';
import { SchoolClass } from './schoolClass';
import { IUser } from '../../shared/interfaces/iModels';


export class User implements IUser {
  id: string;
  name: string;
  googleId: string; // google login for now
  imageUrl: string;
  roles: string[];
  schoolClasses: SchoolClass[];

  //next properties is NOT on interface
  email: string;
  password: string;
  googleTokens: GoogleTokens;
}

export { GoogleTokens } from './googleTokens';