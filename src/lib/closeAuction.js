import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuction(auction) {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    };
    const result = await dynamodb.update(params).promise();
    const { title, seller, highestBid } = auction;
    const { amount, bidder } = highestBid;
    if (amount === 0) {
        //No bids, inform seller.
        await sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: `Your auction for ${title} `,
                recipient: seller,
                body: `You item ${title} has ran out of time, without a bid. Feel free to re-evaluate and relist it!`
            })

        }).promise();
        return;
    } else {
        //There is a successful bid, inform both parties
        const notifySeller = sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: 'Your ITEM has been sold',
                recipient: seller,
                body: `You item ${title} has been sold for $${amount}`
            })

        }).promise();

        const notifyBidder = sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: 'You have won an auction',
                recipient: bidder,
                body: `You have won the auction for ${title} for $${amount}`
            })

        }).promise();
        return Promise.all([notifyBidder, notifySeller]);
    }




}