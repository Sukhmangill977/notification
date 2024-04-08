const express = require("express");
const app = express();
const webpush = require('web-push');
const cors = require("cors");
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 3000;

const apiKeys = {
    publicKey: "BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg",
    privateKey: "iSfmen5jReU59t7EUhou-u9i0Gm-AVWrtCQwG3psRJ0"
};

webpush.setVapidDetails(
    'mailto:gundeepsinghm@gmail.com',
    apiKeys.publicKey,
    apiKeys.privateKey
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
});

// MongoDB Connection URL
const mongoURL = "mongodb+srv://gundeepsinghm:collegepassword@cluster0.rnnuthn.mongodb.net/?retryWrites=true&w=majority"; // MongoDB Atlas connection URI

// Function to connect to MongoDB
async function connectToDatabase() {
    const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    return client.db();
}

app.post("/save-subscription", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const subscriptions = db.collection('subscriptions');
        await subscriptions.insertOne(req.body);
        res.json({ status: "Success", message: "Subscription saved!" });
    } catch (error) {
        console.error("Error saving subscription:", error);
        res.status(500).json({ status: "Error", message: "Failed to save subscription" });
    }
});

// Function to send notifications to all subscribers
async function sendNotificationToAllSubscribers(message) {
    try {
        const db = await connectToDatabase();
        const subscriptions = db.collection('subscriptions');
        const allSubscriptions = await subscriptions.find().toArray();
        allSubscriptions.forEach(subscription => {
            webpush.sendNotification(subscription, message)
                .catch(error => {
                    console.error("Error sending notification:", error);
                });
        });
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}

app.post("/send-notification", (req, res) => {
    const { message } = req.body;
    sendNotificationToAllSubscribers(message);
    res.json({ status: "Success", message: "Notification sent!" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
