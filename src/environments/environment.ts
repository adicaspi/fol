// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import 'zone.js/dist/zone-error';
export const environment = {
  production: false,
  //BASE_API_URL: 'http://followear-dev.zpgietiqcn.eu-west-1.elasticbeanstalk.com/api',
  BASE_API_URL: 'https://devenv.followear.com/api',
  //BASE_API_URL: 'http://localhost:8080/api',
  loginWithFbUrl: 'https://localauth.followear.com/oauth2/authorize?identity_provider=Facebook&redirect_uri=https://localhost:4200&response_type=CODE&client_id=k60gq4qju60fgadkps8obq59h&scope=email%20openid%20aws.cognito.signin.user.admin%20profile',
  bloggersPosts: [{ userId: 65, postId: 341 },
  { userId: 2, postId: 482 },
  { userId: 7, postId: 301 },
  { userId: 92, postId: 262 },
  { userId: 89, postId: 254 }]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
