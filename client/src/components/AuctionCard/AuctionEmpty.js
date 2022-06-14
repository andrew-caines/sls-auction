import { Flame } from 'tabler-icons-react';
import { Blockquote } from '@mantine/core';
export default function AuctionEmpty(props) {
    const { auctionType } = props;
    switch (auctionType) {
        case "/allauctions":
            return (
                <Blockquote cite="-Andrew." icon={<Flame size={24} color="red" />}>
                    There are current no auctions list, click create Auction to be the frist!
                </Blockquote>
            );
        case "/closedauctions":
            return (
                <Blockquote cite="-Andrew." icon={<Flame size={24} color="red" />}>
                    There has yet to be completed auction, or all previous auctions have been deleted after 7 days after successful auction.
                </Blockquote>
            );
        case "/myauctions":
            return (
                <Blockquote cite="-Andrew." icon={<Flame size={24} color="red" />}>
                    You have never completed a auction here. Once you have they will appear here until they are deleted from database after 7 days.
                </Blockquote>
            );
        default:
            return (
                <Blockquote cite="-Andrew." icon={<Flame size={24} color="red" />}>
                    There are current no auctions list, click create Auction to be the frist!
                </Blockquote>
            )

    };
}