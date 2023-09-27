import { createClient, print } from 'redis';

// Create a Redis client
const client = createClient();

// Event handler for when the Redis client connects
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event handler for Redis client connection errors
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Functions to create a hash in Redis
client.hset('HolbertonSchools', 'Portland', '50', print);
client.hset('HolbertonSchools', 'Seattle', '80', print);
client.hset('HolbertonSchools', 'New York', '20', print);
client.hset('HolbertonSchools', 'Bogota', '20', print);
client.hset('HolbertonSchools', 'Cali', '40', print);
client.hset('HolbertonSchools', 'Paris', '2', print);

client.hgetall('HolbertonSchools', (err, reply) => {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log(reply);
});