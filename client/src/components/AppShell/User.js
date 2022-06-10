/*
This component will have the login/logout buttons as well as use details 
If a user it not logged in, it will place a LOGIN button
If a user is loggd in, it will show thier Avatar, with a LOGOUT button
If a user clicks on the Avatar it will pop up a modal with thier details (some from Auth0 some stats, like open auctions, and active bids)
*/
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Box, Button, Group, Text, Loader, Notification } from '@mantine/core';

export default function UserProfile(props) {
    const {
        isLoading,
        isAuthenticated,
        error,
        user,
        loginWithRedirect,
        logout,
    } = useAuth0();

    if (isLoading) {
        //What to show while processing the auth
        return <Loader />
    }

    if (error) {
        //Handle the Case where it fails, this will need to be refined
        return (
            <Notification color="red">
                Oh shizz ${error.message}
            </Notification>
        )

    }

    if (isAuthenticated) {
        console.log(`User: ${JSON.stringify(user)}`);
        //User has successfully auth'd. Show Avatar , and functionality for profile inspection, offer LOGOUT button 
        return (
            <Group>
                <Avatar src={user.picture} radius="xl" />
                <Box>
                    <Text size="sm" weight={500}>
                        {user.name}
                    </Text>
                    <Text color="dimmed" size="xs">
                        {user.email}
                    </Text>
                </Box>
                <Button color="gray" onClick={() => logout({ returnTo: window.location.origin })}>Log out</Button>
            </Group>
        )
    } else {
        //Default state, user has not logged in yet. Show LOGIN button, and the main content will have a LOGIN to continue state
        return (
            <Group>
                <Avatar src={null} />
                <Button onClick={() => loginWithRedirect()}>Log In</Button>
            </Group>
        )
    }

}