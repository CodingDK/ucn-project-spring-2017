import { NextFunction, Request, Response, Router } from "express";
const GoogleAuth = require('google-auth-library');

import { UserController } from './userController';
import { User } from '../../shared/models/user';
import config from '../config/config';


export class googleController {
  private userCtrl: UserController = new UserController();


  public login(req: Request, res: Response, next: NextFunction) {
    const auth_code = req.body.auth_code;
    const client_Id = config.oauth.google.clientId;
    const client_Secret = config.oauth.google.clientSecret;
    const callback_Url = config.oauth.google.callbackUrl;
    const scopes = [
      'profile',
      'email'
    ];

    console.log("client_Id: ", client_Id);
    console.log("client_Secret: ", client_Secret);
    console.log("auth_code: ", auth_code);

    var google = require('googleapis');
    var OAuth2 = google.auth.OAuth2;

    var oauth2Client = new OAuth2(
      client_Id,
      client_Secret,
      "http://localhost:4200/"
    );
    
    var url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',

      // If you only need one scope you can pass it as a string
      scope: scopes,

      // Optional property that passes state parameters to redirect URI
      // state: { foo: 'bar' }
    });

    console.log('Visit the url: ', url);

    oauth2Client.getToken(auth_code, (err:any, tokens:any) => {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if (!err) {
        oauth2Client.setCredentials(tokens);
      }
      res.json(401, {
        login: false,
        isGoogleUsed: true,
        //message: "error in token validation",
        message: JSON.stringify({error: err, tokens}),
        error: err,
        tokens: tokens
      });
      return next(err);
      //console.log("err", err);
      //console.log("tokens:", tokens);
    });

    /*
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
        console.log("payload, ", payload);
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
        
      });*/
  }
}