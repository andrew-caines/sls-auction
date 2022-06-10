import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ActionIcon, Loader, Group, Center } from '@mantine/core';
import { Refresh } from 'tabler-icons-react';
import AuctionCard from './AuctionCard/AuctionCard';

export default function AllAuctions(props) {
    const { getIdTokenClaims, isAuthenticated } = useAuth0();
    const [auctions, setAuctions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    const fetchData = async () => {
        const URL = "https://59ri3t8ope.execute-api.ca-central-1.amazonaws.com/dev/auctions?status=OPEN"; //This also should be hoisted outta here.
        setIsLoading(true);
        const id = await getIdTokenClaims();
        console.log(JSON.stringify(id));
        setUserDetails(id); //In the future, this will be in context, so it wont need to be passed down to Auction card, but for now it will
        const id_token = id.__raw; //TODO. Make a context store, that when authorized, stores this in one place. This is the ID token require to auth against AWS
        const config = {
            headers: {
                "Authorization": `Bearer ${id_token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        const result = await axios.get(URL, config);
        console.log(`result = ${JSON.stringify(result.data)}`);
        setAuctions(result.data);
        setIsLoading(false);
    };

    useEffect(() => {
        //Reach out, and grab all Open Auction
        const controller = new AbortController();
        try {

            fetchData();

        } catch (err) {
            console.error(err.message);
        }

        return () => { controller.abort(); };
    }, []);

    if (isLoading) {
        return (
            <Center>
                <Loader color="teal" variant="bars" />
            </Center>

        );
    }
    if (auctions !== null) {
        console.log(`auctions: ${JSON.stringify(auctions)}`);
        return (
            <>
                <ActionIcon loading={isLoading} onClick={() => fetchData()}>
                    <Refresh color="green" />
                </ActionIcon>
                <Group>

                    {auctions.map(item => {
                        return (<AuctionCard {...item} key={item.id} userDetail={userDetails} />)
                    })}
                </Group>
            </>

        );
    }
}