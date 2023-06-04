var admin = require("firebase-admin");
var serviceAccount = require("../config/push-notification-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// var token = [
//   "cN3wqfTeSFSzNCmapYVI_D:APA91bGHzeJHc-TbnmotuisoLwMll6lcC3jtpS2RE3VnJVgO3o3nrMCc1y1v-ddC1fLj1U7R-seSxDLl1yzg-_PZgy-Q1OX_a-5XE_e18zk2NDB8MH4ChlnmuzFA_C0RNqw0OPvScJHn",
// ];

const options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

// const payload = {
//   notification: {
//     title: "New Notification",
//     body: "Either you run the day or the day runs you.",
//   },
// };
const sendNotification = (token, payload) => {
  try {
    admin.messaging().sendToDevice(token, payload, options);
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
};

// sendNotification(token, payload);

module.exports = { sendNotification };

// var admin = require("firebase-admin");
// var serviceAccount = require("../config/push-notification-key.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// var token = [
//   "cN3wqfTeSFSzNCmapYVI_D:APA91bGHzeJHc-TbnmotuisoLwMll6lcC3jtpS2RE3VnJVgO3o3nrMCc1y1v-ddC1fLj1U7R-seSxDLl1yzg-_PZgy-Q1OX_a-5XE_e18zk2NDB8MH4ChlnmuzFA_C0RNqw0OPvScJHn",
// ];

// const options = {
//   priority: "high",
//   timeToLive: 60 * 60 * 24,
// };

// // const payload = {
// //   notification: {
// //     title: "New Message",
// //     body: "Either you run the day or the day runs you.",
// //   },
// //   data: {
// //     type: "message",
// //   },
// // };
// const payload = {
//   notification: {
//     title: "Indisk: Important Notification",
//     body: "You have important notification from the manager.",
//   },
//   data: {
//     type: "account_deleted",
//   },
// };
// const sendNotification = (token, payload) => {
//   try {
//     admin.messaging().sendToDevice(token, payload, options);
//     // console.log(result);
//   } catch (err) {
//     console.log(err);
//   }
// };

// sendNotification(token, payload);

// module.exports = { sendNotification };
