import { createClient } from 'redis';

// Create a Redis client for subscribing
const subscriberClient = createClient();

// Event handler for when the Redis subscriber client connects
subscriberClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event handler for Redis subscriber client connection errors
subscriberClient.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Subscribe to the 'holberton school channel'
subscriberClient.subscribe('holberton school channel');

// Event handler for received messages on the subscribed channel
subscriberClient.on('message', (channel, message) => {
  console.log(message);

  // Check if the message is 'KILL_SERVER' and unsubscribe
  if (message === 'KILL_SERVER') {
    subscriberClient.unsubscribe('holberton school channel');
    subscriberClient.quit();
  }
});
