interface Tokens {
  access_token: string;
  id_token: string;
  token_type: string;
  expiry_date: number;
  refresh_token?: string;
}

export class GoogleTokens {
  access_token: string;
  //id_token: string;
  //token_type: string;
  expiry_date: number;
  refresh_token?: string;

  constructor() {
  }

  static NewFromTokens(tokens: Tokens) {
    let newObj = new GoogleTokens();
    newObj.access_token = tokens.access_token;
    newObj.expiry_date = tokens.expiry_date;
    newObj.refresh_token = tokens.refresh_token;
    return newObj;
  }

}