import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '@mantine/core';
export default function MainContent(props) {
    const { isLoading, isAuthenticated, } = useAuth0();
    if (isLoading) {
        return (<Loader />)
    }
    if (isAuthenticated) {
        return (
            <div>
                Please select a feature from the LEFT to begin.
            </div>
        )
    } else {
        return (<div>Fancy thing pointing to login button at bottom of page maybe a big arrow?</div>)
    }
}