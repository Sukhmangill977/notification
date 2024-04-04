function showLoginForm() {
    document.getElementById("isadmin").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

function login() {
    var usernameInput = document.getElementById("username").value;
    var passwordInput = document.getElementById("password").value;

    // Check if the entered credentials match the predefined ones
    if (usernameInput === "gundeep" && passwordInput === "qwerty") {
        alert("Login successful!");
        document.getElementById("sendNotificationButton").style.display = "block";
        document.getElementById("loginForm").style.display = "none";
        // Redirect to a different page or perform other actions upon successful login
    } else {
        alert("Invalid username or password!");
    }
}

const checkPermission = () => {
    if (!('serviceWorker' in navigator)){
        throw new Error('No Service Worker support!');
    }
    if (!('Notification' in window)){
        throw new Error('No Notification support API!');
    }
};

const registerSW = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
};

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted'){
        throw new Error('Permission not granted for Notification');
    } 
};

const enableNotifications = async () => {
    checkPermission();
    await requestNotificationPermission();  
    await registerSW();
};

const sendNotification = async () => {
    // Send notification manually
    const response = await fetch('https://notification-0xlp.onrender.com/send-notification', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify({ message: "Event is organized!" })
    });
    const result = await response.json();
    console.log(result);
};

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

const saveSubscription = async (subscription) => {
    const response = await fetch('https://notification-0xlp.onrender.com/save-subscription', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    });

    return response.json();
};

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BFKnRoDz48jEu9XMhT7ogCHkMb82kgCIpVBrdWb9MFOoDQ_S7vQ4TXFf9YLGAvB2XAKXufCEeMuRvpoNUkRP8Xg')
    });
    console.log(subscription);
    const response = await saveSubscription(subscription);
    console.log(response);
});

self.addEventListener('push', e => {
    self.registration.showNotification('Wohoooo', {body:e.data.text() });
});
