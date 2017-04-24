export class User {
  id: string;
  name: string;
  uniLoginId: string; // google login for now
  email: string;
  password: string;

  protected static setFromData<T extends User>(object: T, name: string, uniLoginId: string) {
    object.name = name;
    object.uniLoginId = uniLoginId;
  }
}

export { Student } from './Student';
export { Teacher } from './Teacher';