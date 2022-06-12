
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import { getAuctionById } from './getAuction';
import validator from '@middy/validator';
import placeBidSchema from '../lib/schemas/placeBidSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const { email } = event.requestContext.authorizer;
    let updatedAuction;
    const auction = await getAuctionById(id);
    console.log(`AMOUNT CAME IN AS: ${amount}`)
    //Bid idenity Validation
    if (email === auction.seller) {
        let success = false;
        let message = "You cannont bid on your own auctions!";
        return {
            statusCode: 200,
            body: JSON.stringify({ success, message }),
        };
        //throw new createError(406, `You cannont bid on your own auctions!`, { expose: true });
    }

    //Avoid double bidding
    if (email === auction.highestBid.bidder) {
        let success = false;
        let message = "You are already the highest bidder!";
        return {
            statusCode: 200,
            body: JSON.stringify({ success, message }),
        };
        //throw new createError(406, `You are already the highest bidder!`, { expose: true });
    }

    //Auction Status Validation
    if (auction.status !== 'OPEN') {
        throw new createError.Forbidden(`You can not bid on closed auctions.`);
    }

    // Bid amount Validation
    if (amount < auction.highestBid.amount) {
        let success = false;
        let message = `The bid is not higher than current bid, place a bid greater than ${auction.highestBid.amount} to proceed.`;
        return {
            statusCode: 200,
            body: JSON.stringify({ success, message }),
        };
        //throw new createError(406, `The bid is not higher than current bid, place a bid greater than ${auction.highestBid.amount} to proceed.`, { expose: true });
    }

    try {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidderEmail',
            ExpressionAttributeValues: {
                ':amount': parseFloat(amount),
                ':bidderEmail': email
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;

    } catch (err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    }
    if (!updatedAuction) {
        throw new createError.NotFound(`Auction with ID: ${id} not found!`);
    }
    let new_body = { ...updatedAuction, success: true }
    return {
        statusCode: 200,
        body: JSON.stringify(new_body),
    };
}

export const handler = commonMiddleware(placeBid)
    .use(validator({
        inputSchema: placeBidSchema,
        ajvOptions: {
            strict: false,
        },
    }));


