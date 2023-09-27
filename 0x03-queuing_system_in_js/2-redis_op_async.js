import { createClient } from 'redis';
import { promisify } from 'util';

// Create a Redis client
const client = createClient();

// Promisify the get method
const asnycGet = promisify(client.get).bind(client);

// Event handler for when the Redis client connects
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event handler for Redis client connection errors
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Function to set a new school in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

// Function to display the value of a school in Redis
asnyc function displaySchoolValue(schoolName) {
  const rep = await client.get(schoolName).catch((error) => {
    if (err) throw err;
    console.log(rep);
  });
}

// Set and display school values
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
