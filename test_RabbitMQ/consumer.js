const amqplib = require('amqplib');

const rabbitmq_url = 'amqp://user:password@localhost:5672';
const queue = 'MessageApp';

async function receive() {
    // Connexion
    const connection = await amqplib.connect(rabbitmq_url);

    // Création du channel
    const channel = await connection.createChannel();

    // Assertion sur l'existence de la queue
    await channel.assertQueue(queue, { durable: false });

    // Réception du message
    channel.consume(queue, consume, { noAck: true });
}

function consume(message) {
    console.log('Message reçu :', message.content.toString());
}

receive();
