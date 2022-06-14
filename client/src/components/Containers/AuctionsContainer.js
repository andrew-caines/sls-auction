/*
This re-usable container will be called with a few props to determinte behaviour downstream.
It will take prop QUERYTYPE which can be OPEN,CLOSED,MINE which will be extracted for pathing paramaters /allauctions /myauctions /closedauctions
It will take a prop of who is logged in for context highlighting and other features
It will pass down the DataFetcher Function pre-configured for consumtion on the Component
[userDetails via Auth0, and fetchData will be passed down.]

[Conatiner] -> userDetails, fetchData -> AuctionsList -> AuctionCard | AuctionEdit
<AuctionsContainer>
    <AuctionsList userDetails={userDetails} fetchData={fetchData}/>
</AuctionsContainer>

*/
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ActionIcon, Loader, Group, Center, Blockquote } from '@mantine/core';
import { Refresh, Flame } from 'tabler-icons-react';
import AuctionCard from './AuctionCard/AuctionCard';
import { defaultFilter } from '@mantine/core/lib/components/Select/Select';

export default function AuctionsContainer(props) { 
    
}

export default function AllAuctions(props) {
    const { getIdTokenClaims } = useAuth0();
    let location = useLocation();
    const [auctions, setAuctions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    const fetchData = async () => {
        const URL = "/auctions?status=OPEN"; //This also should be hoisted outta here.
        setIsLoading(true);
        const id = await getIdTokenClaims();
        setUserDetails(id); //In the future, this will be in context, so it wont need to be passed down to Auction card, but for now it will
        const config = {
            headers: {

                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        const result = await axios.get(URL, config);
        //console.log(`result = ${JSON.stringify(result.data)}`);
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
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return (
            <Center>
                <Loader color="teal" variant="bars" />
            </Center>

        );
    }
    if (auctions.length === 0) {
        //There are no current auctions, so somethign other than a blank page
        return (
            <Blockquote cite="-Andrew." icon={<Flame size={24} color="red" />}>
                There are current no auctions list, click create Auction to be the frist!
            </Blockquote>
        );
    }
    if (auctions !== null) {
        //console.log(`auctions: ${JSON.stringify(auctions)}`);
        return (
            <>
                <ActionIcon loading={isLoading} onClick={() => fetchData()}>
                    <Refresh color="green" />
                </ActionIcon>
                <hr></hr>
                <Group style={{ overflowY: 'scroll' }} spacing="xs" >
                    {auctions.map(item => {
                        return (<AuctionCard {...item} key={item.id} userDetail={userDetails} reFetch={fetchData} />)
                    })}
                </Group>
            </>

        );
    }
}