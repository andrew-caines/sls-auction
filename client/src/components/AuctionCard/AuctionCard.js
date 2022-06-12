/*
This card will need to support various states,
Is it your auction? (You will be able edit, the price, and the picture, or add a picture if its missing one)
If its not your card, you should be able to bid on it.
If you have a bid on it, it should indicate at a distance that you are the current leader
*/
import React, { useContext } from 'react';
import { Card, Image, Group, Badge, Text, TextInput, Button, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import Countdown from 'react-countdown'; //Build this yourself.
import { GlobalStateContext } from '../../GlobalState';
import { ToastContainer, toast } from 'react-toastify';
import AuctionEdit from './AuctionEdit';

export default function AuctionCard(props) {

    const { endingAt, seller, createdAt, pictureURL, userDetail, title, highestBid, id, reFetch } = props;
    const { placeBid, uploadPicture } = useContext(GlobalStateContext);
    const [opened, setOpened] = useState(false);
    const [editOpened, setEditOpened] = useState(false);

    const form = useForm({
        initialValues: {
            bid: highestBid.amount || 0
        },
        validate: {
            bid: (value) => value > highestBid.amount ? null : "You must big HIGHER than the current bid"
        }
    });
    const yourHighestBidder = (userDetail.email === highestBid.bidder) ? true : false;
    const handleSubmit = async (values) => {
        console.log(`values.bid = ${values.bid}`);
        const { bid } = values;
        setOpened(false);
        let result = await placeBid(bid, id);

        //console.log(result);
        if (result.success) {
            //Bid was a success, refresh auctions
            toast.success(` Your bid on ${title} for ${values.bid} is now the highest bid!`, { autoClose: 2000, position: "top-center", onClose: () => reFetch() })

        } else {
            //Bid was not successfully, notifiy end user why
            toast.error(`Your bid was not succesful! ${result.message}`, { autoClose: 3000, position: "top-center" })
        }

    }

    return (
        <>
            {/* This Modal is for Edit (upload picture and change name*/}
            <Modal
                opened={editOpened}
                onClose={() => {
                    setEditOpened(false);
                    reFetch();
                }}
                title={<Badge color="teal" variant="light">id: {id}</Badge>}
            >
                <AuctionEdit title={title} id={id} pictureURL={pictureURL} uploadPicture={uploadPicture} />
            </Modal>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={`Place a bid on ${title}`}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput required label="Your Bid" placeholder={highestBid.amount || 0} {...form.getInputProps('bid')} />
                </form>
                <Group position="right" mt="md">
                    <Button type="submit" onClick={form.onSubmit(handleSubmit)}>Submit</Button>
                </Group>
            </Modal>
            <Card shadow="xs" p="lg" className={yourHighestBidder ? "highestbid " : ""} style={{ marginBottom: '5px' }}>
                <Card.Section>
                    <Image
                        style={{ objectFit: "scale-down" }}
                        src={pictureURL}
                        height="192px"
                        withPlaceholder />

                </Card.Section>
                {/*Logic to see if you are highest bidder should go here, else just show bid*/}
                <Text size="xs" align="right">Listed: {new Date(createdAt).toLocaleDateString('en-us')}</Text>
                <Group>
                    <Badge color="teal" variant="light">Current Bid:{new Intl.NumberFormat('en-ca', { style: 'currency', currency: 'CAD' }).format(highestBid.amount)}</Badge>
                    <Countdown date={endingAt}
                        renderer={({ hours, minutes, seconds }) => (
                            <span style={{ fontSize: "x-small", fontWeight: "bolder" }} >
                                {hours} hours {minutes} mins {seconds} secs
                            </span>
                        )} />
                </Group>

                <Text weight={600} align="center" size="lg">{title}</Text>
                <Text weight={400}>Seller: {seller} </Text>
                <Text size="xs">Highest Bidder: {highestBid.bidder || <Badge color="green" variant="outline">None Bid Now</Badge>} {yourHighestBidder ? <Badge>✨YOU✨</Badge> : null}</Text>
                <Group position="apart" style={{ marginBottom: 5, marginTop: 5 }}>
                    {userDetail.email !== seller && <Button onClick={() => setOpened(true)}>bid</Button>}
                    {userDetail.email === seller && <Button onClick={() => setEditOpened(true)}>Edit Picture</Button>}
                    <ToastContainer />
                </Group>
            </Card>
        </>
    )
}