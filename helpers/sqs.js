const { SQS } = require('../config');

const QUEUE_URL = process.env.QUEUE_URL;

sqsHelper = {
    publish,
    consume
}

module.exports = sqsHelper;

function publish(msg) {
    const message = {
        message: msg
    };
    SQS.sendMessage({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(message),
        MessageGroupId: '1'
    }, (err, data) => {
        if (err) console.log(err);
        else console.log(data);
    });
}


function consume() {
    SQS.receiveMessage({
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


