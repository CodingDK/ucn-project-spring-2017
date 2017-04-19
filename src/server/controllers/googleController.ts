import { NextFunction, Request, Response, Router } from "express";
const GoogleAuth = require('google-auth-library');

import { UserController } from './userController';
import { User } from '../models/user';
import config from '../config/config';


export class googleController {
  private userCtrl: UserController = new UserController();


  public login(req: Request, res: Response, next: NextFunction) {
    const idToken = req.body.id_token;
    const client_Id = config.oauth.google.clientId;
    console.log("id_token: ", idToken);
    let auth = new GoogleAuth;
    let client = new auth.OAuth2(client_Id, '', '');
    client.verifyIdToken(
      idToken,
      client_Id,
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
      (err: any, login: any) => {
        if (err) {
          console.log("Validation IdToken error: ", err);
          res.json(401, { login: false, isGoogleUsed: true, message: "error in token validation" });
          return next(err);
        }
        let payload = login.getPayload();
        let googleId = payload['sub'];
        //let email = payload['email'];
        //let name = payload['name'];
        new UserController().findByGoogleId(googleId)
          .then((user: User) => {
            if (!user) {
              console.log("no user found with googleId: " + googleId);
              res.json(401, { login: false, isGoogleUsed: true, message: "user is not authorized to run this system" });
              
            } else {
              req.login(user, function (err) {
                if (err) {
                  return next(err);
                }
                res.json({ login: true, isGoogleUsed: true, message: "ok" });
              });
            }
            
            
          })
          .catch((err: any) => {
            if (err) {
              console.log("looking for user in db error?, googleID: ", googleId, "error: ", JSON.stringify(err));
            }
            res.json(401, { login: false, isGoogleUsed: true, message: "an database error happen" });
          });
        
      });
  }
}