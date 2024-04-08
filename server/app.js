const express = require("express");
const app = express();
const webpush = require('web-push');
const cors = require("cors");
const mongoose = require('mongoose');
const User = require('./user');

const port = 3000;

const apiKeys = {
    publicKey: "BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg",
    privateKey: "iSfmen5jReU59t7EUhou-u9i0Gm-AVWrtCQwG3psRJ0"
};

webpush.setVapidDetails(
    'mailto:gundeepsinghm@gmail.com@gmail.com',
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
        const user = new User({ name, email, subscription });
        await user.save();
        res.json({ status: "Success", message: "Subscription saved!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Failed to save subscription" });
    }
});

// Function to send notifications to all subscribers
function sendNotificationToAllSubscribers(message) {
    User.find({}, (err, users) => {
        if (err) {
            console.error("Error retrieving users:", err);
            return;
        }
        users.forEach(user => {
            webpush.sendNotification(user.subscription, message)
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
