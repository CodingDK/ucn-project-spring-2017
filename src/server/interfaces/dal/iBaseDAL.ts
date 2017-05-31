import { IUser } from '../../../shared/interfaces/iModels';

export interface IBaseDAL<T> {
  insert(user: IUser, item: T): Promise<T>;

  deleteById(user: IUser, id: string): Promise<boolean>;

  update(user: IUser, item: T): Promise<T>;
}
