
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
    //Bid idenity Validation
    if (email === auction.seller) {
        throw new createError.Forbidden(`You cannont bid on your own auctions!`);
     }

    //Avoid double bidding
    if (email === auction.highestBid.bidder) {
        throw new createError.Forbidden(`You are already the highest bidder!`);
     }
     
    //Auction Status Validation
    if (auction.status !== 'OPEN') {
        throw new createError.Forbidden(`You can not bid on closed auctions.`);
    }

    // Bid amount Validation
    if (amount <= auction.highestBid.amount) {
        throw new createError.Forbidden(`The bid is not higher than current bid, place a bid greater than ${auction.highestBid.amount} to proceed.`);
    }

    try {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidderEmail',
            ExpressionAttributeValues: {
                ':amount': amount,
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
    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid)
    .use(validator({
        inputSchema: placeBidSchema,
        ajvOptions: {
            strict: false,
        },
    }));


