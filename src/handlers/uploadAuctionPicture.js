import createError from 'http-errors';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';

import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setAuctionPictureURL } from '../lib/setAuctionPictureUrl';
import uploadAuctionPictureSchema from '../lib/schemas/uploadAuctionPictureSchema';


async function uploadAuctionPicture(event) {

    const { id } = event.pathParameters;
    const { email } = event.requestContext.authorizer;
    const { base64Data } = JSON.parse(event.body);
    //console.log(`event body is ${JSON.stringify(event.body)}`);
    const auction = await getAuctionById(id);
    //Verify that person uploading image, is the image OWNER. Do it quickly before wasting LAMBA compute time.
    if (auction.seller !== email) {
        throw new createError.Forbidden(`You are not the Seller.`);
    }

    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, ''); //Stripe out the pre-amble
    //const base64 = event.body;
    const buffer = Buffer.from(base64, 'base64');
    let updatedAuction;

    try {
        const pictureURL = await uploadPictureToS3(auction.id + '.jpg', buffer); //Get S3 Location aka URL
        updatedAuction = await setAuctionPictureURL(auction.id, pictureURL);
    } catch (err) {
        console.error(err)
        throw new createError.InternalServerError(err);
    }

    return {
        statusCode: 200,
        headers: {
            success: true
        },
        body: JSON.stringify(updatedAuction)
    };

}

export const handler = middy(uploadAuctionPicture)
    .use(httpErrorHandler())
    .use(validator({
        inputSchema: uploadAuctionPictureSchema,
        ajvOptions: {
            strict: false
        }
    }));
