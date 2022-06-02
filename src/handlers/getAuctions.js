
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';

import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    const { status } = event.queryStringParameters;
    let auctions;
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status,
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    };
    try {
        //Scan database assign value to auctions
        const result = await dynamodb.query(params).promise();
        auctions = result.Items;
    } catch (err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions)
    .use(validator({
        inputSchema: getAuctionsSchema,
        ajvOptions: {
            useDefaults: true,
            strict: false,
        },
    }));

