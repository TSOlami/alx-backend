import kue, { createQueue } from 'kue';

// Create an array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Create a function to send notifications
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100); // Track progress: 0%

  if (blacklistedNumbers.includes(phoneNumber)) {
    job.failed({ message: `Phone number ${phoneNumber} is blacklisted` });
  } else {
    job.progress(50, 100); // Track progress: 50%
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  }

  done(); // Complete the job
}

// Create a Kue queue
const queue = createQueue();

// Set the concurrency (number of jobs to process at a time)
queue.concurrency(2);

// Process jobs in the queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
