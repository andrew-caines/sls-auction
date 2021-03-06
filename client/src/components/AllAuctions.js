import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ActionIcon, Loader, Group, Center, Blockquote } from '@mantine/core';
import { Refresh, Flame } from 'tabler-icons-react';
import AuctionCard from './AuctionCard/AuctionCard';
import { useLocation } from 'react-router-dom';
import AuctionEmpty from './AuctionCard/AuctionEmpty';


export default function AllAuctions(props) {
    let location = useLocation();
    const { getIdTokenClaims } = useAuth0();
    const [auctions, setAuctions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    let status;

    const fetchData = async () => {

        switch (location.pathname) {
            case "/allauctions":
                status = 'OPEN';
                break;
            case "/closedauctions":
                status = 'CLOSED';
                break;
            case "/myauctions":
                status = "MINE";
                break;
            default:
                status = "OPEN";

        };
        const URL = `/auctions?status=${status}`; //This also should be hoisted outta here.
        setIsLoading(true);
        const id = await getIdTokenClaims();
        setUserDetails(id); //In the future, this will be in context, so it wont need to be passed down to Auction card, but for now it will
        const config = { headers: {} }
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
    }, [location]);// eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return (
            <Center>
                <Loader color="teal" variant="bars" />
            </Center>

        );
    }
    
    if (auctions.length === 0) {
        //There are no current auctions, Show the correct response for 3 possible paths
        return (<AuctionEmpty auctionType={status} />)
    }

    if (auctions !== null) {
        //console.log(`auctions: ${JSON.stringify(auctions)}`);
        return (
            <>
                <ActionIcon loading={isLoading} onClick={() => fetchData(status)}>
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