/**
 * Interface for esaiser switch database
 * @interface 
 */
export interface IDatabase {
  /**
   * Method for open a connection to the database
   * @param connectionString string for connection to the database
   */
  openConnection(connectionString: string): void;
  /**
   * Method for closing connection to the database
   */
  closeConnectionEvent(): void;
}
