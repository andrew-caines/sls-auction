import middy from '@middy/core';
import httpJsonBodyParse from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

export default handler => middy(handler).use([
    httpJsonBodyParse(),
    httpEventNormalizer(),
    httpErrorHandler(),
    cors({
        credentials: true,
        origin: '*',
        origins: [
            'http://localhost:3000',
            'https://auctions.caines.biz',
            'https://auction.caines.biz'
        ]
    }),
]);