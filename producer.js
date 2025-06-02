const amqplib = require('amqplib');

const rabbitmq_url = 'amqp://user:password@localhost:5672';
const queue = 'MessageApp';
const message = 'Bonjour la team dev ' + Date.now();


async function send() {
  // Connexion
  const connection = await amqplib.connect(rabbitmq_url);

  //creation du channel
  const channel = await connection.createChannel();

  //Assertion sur l'existence de la queue
  await channel.assertQueue(queue,  { durable: false });

  // Envoi du message
  channel.sendToQueue(queue, Buffer.from(message));
  console.log("Message envoyé");

  // Fermeture de connexion
  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 300);
}

send();
