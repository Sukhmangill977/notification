// const express = require("express");
// const app = express();
// const webpush = require('web-push');
// const cors = require("cors");

// const port = 3000;

// const apiKeys = {
//     publicKey: "BEf6SoNWNwqi2UMja0XbHTrNVGHur9I-XholtoRp3zIEKvWQuwRDTAWr25ihx-UBx1xiMiLaMMraq37ttzvBWZc",
//     privateKey: "_rbRgc0cTiKMrKAkdhCNuRv0xPoRgbF1yhDIAP9fqBo"
// };

// webpush.setVapidDetails(
//     'mailto:goyalyash1605@gmail.com',
//     apiKeys.publicKey,
//     apiKeys.privateKey
// );

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Hello world");
// });

// const subDatabase = [];

// app.post("/save-subscription", (req, res) => {
//     subDatabase.push(req.body);
//     res.json({ status: "Success", message: "Subscription saved!" });
// });

// // Function to send notifications to all subscribers
// function sendNotificationToAllSubscribers(message) {
//     subDatabase.forEach(subscription => {
//         webpush.sendNotification(subscription, message)
//             .catch(error => {
//                 console.error("Error sending notification:", error);
//             });
//     });
// }

// // Route to handle sending push notification triggered by button click
// app.post("/send-notification", (req, res) => {
//     const { message } = req.body;
//     sendNotificationToAllSubscribers(message);
//     res.json({ status: "Success", message: "Notification sent!" });
// });

// // Trigger the function when the server starts
// app.listen(port, () => {
//     console.log("Server running on port 3000!");
// });



const express = require("express");
const app = express();
const webpush = require('web-push');
const cors = require("cors");
const mongoose = require('mongoose');
const users = require('./users');

const port = 3000;

const apiKeys = {
    publicKey: "BEf6SoNWNwqi2UMja0XbHTrNVGHur9I-XholtoRp3zIEKvWQuwRDTAWr25ihx-UBx1xiMiLaMMraq37ttzvBWZc",
    privateKey: "_rbRgc0cTiKMrKAkdhCNuRv0xPoRgbF1yhDIAP9fqBo"
};

webpush.setVapidDetails(
    'mailto:gundeepsinhm@gmail.com',
    apiKeys.publicKey,
    apiKeys.privateKey
);

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://gundeepsinghm:collegepassword@cluster0.rnnuthn.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello world");
}); 

app.post("/save-subscription", async (req, res) => {
    const { name, email, subscription } = req.body;
    try {
        const newUser = new users({ name, email, subscription });
        await newUser.save();
        res.json({ status: "Success", message: "Subscription saved!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Failed to save subscription" });
      }
      
});

// Function to send notifications to all subscribers
function sendNotificationToAllSubscribers(message) {
    users.find({}, (err, users) => {
        if (err) {
            console.error("Error retrieving users:", err);
            return;
        }
        users.forEach(users => {
            webpush.sendNotification(users.subscription, message)
                .catch(error => {
                    console.error("Error sending notification:", error);
                });
        });
    });
}

// Route to handle sending push notification triggered by button click
app.post("/send-notification", (req, res) => {
    const { message } = req.body;
    sendNotificationToAllSubscribers(message);
    res.json({ status: "Success", message: "Notification sent!" });
});

// Trigger the function when the server starts
app.listen(port, () => {
    console.log("Server running on port 3000!");
});
