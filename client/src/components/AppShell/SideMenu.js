import { Group, Navbar, UnstyledButton, Text } from '@mantine/core';
import User from './User';
import { Award, DeviceAnalytics, ListDetails, History } from 'tabler-icons-react';
import { Link } from "react-router-dom";

export default function SideMenu(props) {

    return (
        <Navbar height={800} p="xs" width={{ base: 340 }}>
            <Navbar.Section mt="xs" >
                <Link to="/createauction">
                    <UnstyledButton>
                        <Group>
                            <Award color="green" />
                            <Text>Create new Auction</Text>
                        </Group>
                    </UnstyledButton>
                </Link>
            </Navbar.Section>
            <Navbar.Section mt="xs" >
                <Link to="/allauctions">
                    <UnstyledButton>
                        <Group>
                            <ListDetails />
                            <Text>All OPEN Auctions</Text>
                        </Group>
                    </UnstyledButton>
                </Link>
            </Navbar.Section>
            <Navbar.Section mt="xs" >
                <Link to="/myauctions">
                    <UnstyledButton>
                        <Group>
                            <DeviceAnalytics color={'#b5d279'} />
                            <Text>Your Auctions</Text>
                        </Group>
                    </UnstyledButton>
                </Link>
            </Navbar.Section>
            <Navbar.Section mt="xs" grow> {/* Last one gets grow to give a gap before User Avatar*/}
                <Link to="/closedauctions">
                    <UnstyledButton>
                        <Group>
                            <History color="gray" />
                            <Text>All CLOSED Auctions</Text>
                        </Group>
                    </UnstyledButton>
                </Link>
            </Navbar.Section>
            <Navbar.Section>
                <User />
            </Navbar.Section>
        </Navbar>
    )


}