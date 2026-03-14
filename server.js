const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Client Setup
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true } // Ye piche background mein kaam karega
});

// QR Code generate karna (Terminal mein dikhega ya UI par bhej sakte hain)
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

// Jab WhatsApp connect ho jaye
client.on('ready', () => {
    console.log('Smile Financial WhatsApp is READY!');
});

// Message Receive karne ke liye (Live Inbox)
client.on('message', async msg => {
    console.log(`New Message from ${msg.from}: ${msg.body}`);
    // Ise hum aapke Firebase mein save kar denge
});

// Bulk Message bhejne ka function
async function sendBulk(numbers, message) {
    numbers.forEach(num => {
        const chatId = num.includes('@c.us') ? num : `${num}@c.us`;
        client.sendMessage(chatId, message);
    });
}

client.initialize();
