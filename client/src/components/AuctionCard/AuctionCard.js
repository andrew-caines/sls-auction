/*
This card will need to support various states,
Is it your auction? (You will be able edit, the price, and the picture, or add a picture if its missing one)
If its not your card, you should be able to bid on it.
If you have a bid on it, it should indicate at a distance that you are the current leader
*/
import { Card, Image, Group, Badge, Text, Skeleton, Button } from '@mantine/core';
import Countdown from 'react-countdown'; //Build this yourself.

export default function AuctionCard(props) {
    console.log(`Props: ${JSON.stringify(props)}`)
    const { endingAt, seller, status, createdAt, pictureURL, highestBid, title, id, userDetail } = props;
    return (
        <Card shadow="sm" p="lg">
            <Card.Section>
                <Image
                    style={{ objectFit: "scale-down" }}
                    src={pictureURL}
                    height="192px"
                    withPlaceholder />

            </Card.Section>
            {/*Logic to see if you are highest bidder should go here, else just show bid*/}
            <Group>
                <Badge color="teal" variant="light">Current Bid: {highestBid.amount}</Badge>
                <Countdown date={endingAt}
                    renderer={({ hours, minutes, seconds }) => (
                        <span>
                            {hours} hours {minutes} mins {seconds} secs
                        </span>
                    )} />
            </Group>

            <Text> {title}</Text>
            <Text weight={100}>Seller: {seller} </Text>
            <Group position="apart" style={{ marginBottom: 5, marginTop: 5 }}>
                {userDetail.email !== seller && <Button>Bid</Button>}
                {userDetail.email === seller && <Button>Edit Listing</Button>}
            </Group>
        </Card>
    )
}