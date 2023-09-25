import { createClient } from "redis";

// Create a Redis client
const client = createClient();

// Event handler for when the Redis client connects
client
  .on("connect", () => {
    console.log("Redis client connected to the server");
  });

// Event handler for Redis client connection errors
client
  .on("error", (error) => {
    console.log(`Redis client not connected to the server: ${error}`);
  });

// Close the Redis client when done (for example, when the script exits)
process.on('exit', () => {
	client.quit();
  });