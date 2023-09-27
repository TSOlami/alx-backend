import kue from 'kue';

// Create a Kue queue
const queue = kue.createQueue();

// Function to send a notification
function sendNotification(phoneNumber, message) { 
	console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs in the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function
  sendNotification(phoneNumber, message);
  
  // Mark the job as completed
  done();
});

console.log('Job processor is running...');
