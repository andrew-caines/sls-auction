import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import createAuctionSchema from '../lib/schemas/createAuctionSchema';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title, base64Data } = event.body;
  const { email } = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    pictureURL: '',
    seller: email
  };

  //Store it to database
  try {
    //If there is base64Data present, save the data to S3, then update the pictureURL and save to DB!
    if (base64Data) {
      console.info(`[createAuction] IMAGE DATA PRESENT`);
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, ''); //Strip out the pre-amble
      const buffer = Buffer.from(base64, 'base64');
      const pictureURL = await uploadPictureToS3(auction.id + '.jpg', buffer); //Get S3 Location aka URL
      console.info(`[createAuction] URL created ${pictureURL}`);
      auction.pictureURL = pictureURL;
    }

    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,

    }).promise();
  } catch (err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }


  return {
    statusCode: 201,
    body: JSON.stringify({ event, context, auction }),
  };
}

export const handler = commonMiddleware(createAuction)
  .use(validator({
    inputSchema: createAuctionSchema,
    ajvOptions: {
      strict: false,
    },
  }));


