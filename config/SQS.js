const AWS = require('aws-sdk');


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REGION;
const QUEUE_URL = process.env.QUEUE_URL;

// Configure AWS credentials and region.
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION
});

const sqs = new AWS.SQS();


function publish(msg) {
    const message = {
        message: msg
    };
    sqs.sendMessage({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(message),
        MessageGroupId: '1'
    }, (err, data) => {
        if (err) console.log(err);
        else console.log(data);
    });
}


function consume() {
    sqs.receiveMessage({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1
      }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
}


sqsHandler = {
    publish,
    consume
}

module.exports = sqsHandler;