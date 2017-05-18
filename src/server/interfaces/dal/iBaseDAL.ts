export interface IBaseDAL<T> {
  insert(user: any, item: T): Promise<T>;

  deleteById(user: any, id: string): Promise<boolean>;

  update(user: any, item: T): Promise<T>;

  getAll(user: any): Promise<T[]>;

  findById(user: any, id: string): Promise<T>
}