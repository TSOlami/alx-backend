import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';
import Redic from 'redic';

const app = express();
const port = 1245;

// Create a Redis client for seat availability
const redisClient = redis.createClient();

// Use promisify to make Redis methods return Promises
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Initialize the number of available seats to 50
let numberOfAvailableSeats = 50;
let reservationEnabled = true;

// Create a Redic client for managing seat availability
const redic = new Redic();

// Create a Kue queue
const queue = kue.createQueue();

// Function to reserve a seat
const reserveSeat = async (number) => {
  await setAsync('available_seats', number);
};

// Function to get the current available seats
const getCurrentAvailableSeats = async () => {
  const seats = await getAsync('available_seats');
  return seats ? parseInt(seats) : 0;
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to get the number of available seats
app.get('/available_seats', (req, res) => {
  res.json({ numberOfAvailableSeats: numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }

  // Create and queue a job in Kue
  const job = queue.create('reserve_seat', {}).save((err) => {
    if (!err) {
      res.json({ status: 'Reservation in process' });
    } else {
      res.json({ status: 'Reservation failed' });
    }
  });
  
  // Listen for job completion
  job.on('complete', (result) => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  // Listen for job failure
  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

// Route to process the queue and reserve a seat
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  // Process the queue 'reserve_seat'
  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = await getCurrentAvailableSeats();
    
    if (currentSeats === 0) {
      reservationEnabled = false;
      done(new Error('Not enough seats available'));
    } else {
      await reserveSeat(currentSeats - 1);
      if (currentSeats - 1 === 0) {
        reservationEnabled = false;
      }
      done();
    }
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
