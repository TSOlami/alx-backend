import { createClient } from 'redis';
import { promisify } from 'util';

// Create a Redis client
const client = createClient();

// Promisify the get and set methods
const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);

// Event handler for when the Redis client connects
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event handler for Redis client connection errors
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

// Function to set a new school in Redis
async function setNewSchool(schoolName, value) {
  await asyncSet(schoolName, value);
  console.log(`Set ${schoolName} to ${value}`);
}

// Function to display the value of a school in Redis
async function displaySchoolValue(schoolName) {
  const value = await asyncGet(schoolName).catch((err) => {
    if (err) {
		  console.log(err);
      throw err;
  	}
    console.log(value);
  });
  
}

// Set and display school values
(async () => {
  await displaySchoolValue('Holberton');
  await setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
})();
