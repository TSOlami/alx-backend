import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Object containing the job data
const jobData = {
  phoneNumber: '2347061583271',
  message: 'Give me job'
};

// Create a job and add it to the queue
const job = queue.create('push_notification_code', jobData);

// Event handler for when the job is created without error
job.on('complete', () => {
  console.log('Notification job completed');
});

// Event handler for when the job fails
job.on('failed', () => {
  console.log('Notification job failed');
});

// Save the job to the queue
job.save((err) => {
  if (!err) {
    console.log(`Notification job created: ${job.id}`);
  } else {
    console.error('Error creating job:', err);
  }
  // Exit the script
  process.exit(0);
});