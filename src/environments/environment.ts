// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseURL: 'http://localhost:8080',
  feedbackRelURL: '/api/feedbacks',
  firebaseConfig: {
    apiKey: "AIzaSyA9QEdT_L7oNJvDe5lBUPvQfulERVb5-2E",
    authDomain: "draw0-auth.firebaseapp.com",
    projectId: "draw0-auth",
    storageBucket: "draw0-auth.appspot.com",
    messagingSenderId: "441772183534",
    appId: "1:441772183534:web:31902981bd0ec71ec2c8ff",
    measurementId: "G-HWWK9R1DRT"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
