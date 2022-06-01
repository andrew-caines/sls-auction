import { getEndedAuctions } from '../lib/getEndedAuctions';
import { closeAuction } from '../lib/closeAuction';
import createError from 'http-errors';

async function processAuctions(event, context) {
    console.log(`[processAuctions] Function Body Excecuted`);
    try {
        const auctionsToClose = await getEndedAuctions();
        console.log(`[processAuctions] Auctions ready to be closed: ${auctionsToClose.length}`)
        const closePromises = auctionsToClose.map(auction => closeAuction(auction));
        await Promise.all(closePromises);
        return { closed: closePromises.length };
    } catch (err) {
        console.error(`Got error while trying to close Auction of: ${err}`);
        throw new createError.InternalServerError(err);
    }
}
export const handler = processAuctions;