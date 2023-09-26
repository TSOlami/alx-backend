import { createClient } from 'redis';

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

// Function to set a new school in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

// Function to display the value of a school in Redis
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) throw err;
    console.log(`Value for key '${schoolName}': ${reply}`);
  });
}

// Set and display school values
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
