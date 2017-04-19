const config = {
  db: {
    production: process.env.MONGO_URL,
    development: process.env.MONGO_URL,
    //development: "mongodb://localhost:27017/typescript-db",
    //test: "mongodb://localhost/expense-tracker-test",
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: "http://localhost:3000/api/login/auth/google/callback"
    }
  },
  //origin, that are allowed to send request
  origin: /localhost:4200$/,
  gitHubSimpleCache: ""
};

export default config;
