import * as mongoose from 'mongoose';

import {IDatabase} from '../config/iDatabase';

/**
 * Class for handling MongoDb
 */
export class MongoDatabase implements IDatabase {
  /**
   * Method for open a connection to mongodb
   * @param connectionString string for connection to the database
   */
  openConnection(connectionString: string): void {
    //workaround for https://github.com/Automattic/mongoose/issues/4951#issuecomment-283327958
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(connectionString);
  }

  /**
   * Method for closing connection to mongodb
   */
  closeConnectionEvent() : void {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  }
}
