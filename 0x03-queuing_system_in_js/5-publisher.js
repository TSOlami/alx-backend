import { createClient } from 'redis';

// Create a Redis client for publishing
const publisherClient = createClient();

// Event handler for when the Redis publisher client connects
publisherClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event handler for Redis publisher client connection errors
publisherClient.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Function to publish a message to the 'holberton school channel' after a delay
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisherClient.publish('holberton school channel', message);
  }, time);
}

// Publish messages with delays
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
