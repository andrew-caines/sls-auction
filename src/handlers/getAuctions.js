
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';

import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    const { status } = event.queryStringParameters;
    const { email } = event.requestContext.authorizer;
    let auctions;
    let params;
    switch (status) {
        case 'CLOSED':
        case 'OPEN':
            params = {
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
            break;
        case 'MINE':
            params = {
                TableName: process.env.AUCTIONS_TABLE_NAME,
                IndexName: 'sellersEmail',
                KeyConditionExpression: '#seller = :email',
                ExpressionAttributeValues: {
                    ':email': email,
                },
                ExpressionAttributeNames: {
                    '#seller': 'seller'
                }
            };
            break;
        default:
            console.log(`[getAuctions] Received an invalid status type of ${status}`);
            break;
    }
    try {
        //Scan database assign value to auctions
        console.info(`[getAuctions] called with Params ${JSON.stringify(params)}`);
        const result = await dynamodb.query(params).promise();
        auctions = result.Items;
    } catch (err) {
        console.error(err);
        throw new createError.InternalServerError(err);
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
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


