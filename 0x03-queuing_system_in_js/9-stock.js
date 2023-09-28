// Import required modules and initialize Express app
import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Create a Redis client
const redisClient = redis.createClient();

// Use promisify to make Redis methods return Promises
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Sample product data
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Function to get an item by its ID
const getItemById = (id) => {
  return listProducts.find((product) => product.itemId === id);
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to list all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route to get product details by itemId
app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(parseInt(itemId));
  if (product) {
    // Get the current reserved stock for the item from Redis
    const currentReservedStock = await getAsync(`item.${itemId}`);
    const currentQuantity = product.initialAvailableQuantity - (currentReservedStock || 0);
    res.json({ ...product, currentQuantity: currentQuantity });
  } else {
    res.status(404).json({ status: 'Product not found' });
  }
});

// Route to reserve a product by itemId
app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(parseInt(itemId));

  if (!product) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }

  // Get the current reserved stock for the item from Redis
  const currentReservedStock = await getAsync(`item.${itemId}`);
  const currentQuantity = product.initialAvailableQuantity - (currentReservedStock || 0);

  if (currentQuantity <= 0) {
    res.json({ status: 'Not enough stock available', itemId: product.itemId });
  } else {
    // Reserve one item by decrementing the stock in Redis
    await setAsync(`item.${itemId}`, parseInt(currentReservedStock) + 1);
    res.json({ status: 'Reservation confirmed', itemId: product.itemId });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
