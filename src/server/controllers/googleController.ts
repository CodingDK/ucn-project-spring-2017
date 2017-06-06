const GoogleAuth = require('google-auth-library');
const google = require('googleapis');

import { UserController } from './userController';
import { User, GoogleTokens } from '../models/user';
import { ResponseError } from '../errors/responseError';

const UniData = require('../data/mockedUniData.json');
import config from '../config/config';



export class GoogleController {
  private userCtrl: UserController = new UserController();
  private googleTokens: GoogleTokens;

  constructor() { }

  /**
   * Login with Google
   */
  public login(auth_code: string): Promise<User> {
    return this.getClientAndSetTokens(auth_code)
      .then(this.getProfileData.bind(this))
      .then(this.createOrUpdateUserWithGoogleData.bind(this));
  }

  /**
   * Create a oauth client and get tokens from google and set it to client
   */
  private getClientAndSetTokens(auth_code: string): Promise<any> {
    const credentials = config.oauth.google;

    const auth = new GoogleAuth;
    //Make client for communicate with Google
    const oauth2Client = new auth.OAuth2(credentials.clientId, credentials.clientSecret, credentials.callbackUrl);

    //Ask Google for changing the auth_code to access_token and refresh_token
    return new Promise<any>((resolve: any, reject: any) => {
      oauth2Client.getToken(auth_code, (err: any, tokens: any, response: any) => {
        if (err) {
          reject(ResponseError.makeNew(err, "error in getting token"));
        }
        this.googleTokens = GoogleTokens.NewFromTokens(tokens);

        //Use tokens in the client
        oauth2Client.setCredentials(this.googleTokens);

        resolve(oauth2Client);
      });
    });
  }

  /**
   * Request userinfo from Google
   */
  private getProfileData(oauth2Client: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const plus = google.plus('v1');
      plus.people.get({ userId: 'me', auth: oauth2Client }, (err: any, profile: any) => {
        if (err) {
          reject(ResponseError.makeNew(err, "error in getting profile data from google"));
        }
        resolve(profile);
      });
    });
  }

  /**
   * Getting mocking data and update or create the user in the system
   */
  private createOrUpdateUserWithGoogleData(profile: any) {
    const googleId = profile.id;
    const name = profile.displayName;
    const imageUrl = profile.image.url;

    //setting mock data from file, later replace this with real data from UniLogin
    const uniMockedObject = UniData.users.find((x: any) => x.id === googleId);
    const schoolClasses = uniMockedObject ? uniMockedObject.schoolClasses : UniData.defaultSchoolClasses;
    const roles = uniMockedObject ? uniMockedObject.roles : UniData.defaultRoles;
    //console.log("googleId:", googleId);
    //console.log("name:", name);
    //console.log("image:", imageUrl);
    return this.userCtrl.createOrUpdateWithGoogleInfo(googleId, name, imageUrl, this.googleTokens, schoolClasses, roles)
      .then((user: User) => {
        return user;
      })
      .catch((err: any) => {
        throw ResponseError.makeNew(err, "a database error happened");
      });
  }

}
