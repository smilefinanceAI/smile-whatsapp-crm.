const { Client, LocalAuth } = require('whatsapp-web.js');
const admin = require('firebase-admin');

// Firebase Setup
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smile-finance-ai-2026-default-rtdb.firebaseio.com"
});
const db = admin.database();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

// Jab QR Code aaye toh use Firebase mein save kar do
client.on('qr', (qr) => {
    console.log('New QR Received');
    db.ref('auth/qr').set(qr); 
});

// Jab login ho jaye
client.on('ready', () => {
    console.log('Smile Financial WhatsApp Ready!');
    db.ref('auth/status').set('Connected');
});

// LIVE INBOX: Jab koi reply kare
client.on('message', async (msg) => {
    const contact = await msg.getContact();
    db.ref('inbox/' + msg.from).push({
        sender: contact.pushname || msg.from,
        text: msg.body,
        time: Date.now()
    });
});

client.initialize();
