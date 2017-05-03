import { GoogleTokens } from './googleTokens';

export class User {
  id: string;
  name: string;
  googleId: string; // google login for now
  email: string;
  password: string;
  imageUrl: string;
  googleTokens: GoogleTokens;

  protected static setFromData<T extends User>(object: T, name: string, googleId: string) {
    object.name = name;
    object.googleId = googleId;
  }
}

export { Student } from './student';
export { Teacher } from './teacher';
export { GoogleTokens } from './googleTokens';