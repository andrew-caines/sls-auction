import { useAuth0 } from '@auth0/auth0-react';
import { Loader, Timeline, Blockquote, Text } from '@mantine/core';
import { HandClick, HandStop, Heart, ReportMoney, ZoomQuestion } from 'tabler-icons-react';

export default function MainContent(props) {
    const { isLoading, isAuthenticated, } = useAuth0();
    if (isLoading) {
        return (<Loader />)
    }
    if (isAuthenticated) {
        return (
            <div>
                <Timeline active={0} bulletSize={24} lineWidth={2}>
                    <Timeline.Item title="You open this site!" />
                    <Timeline.Item bullet={<HandClick color="blue" />} title="You click a menu item on the left" />
                    <Timeline.Item bullet={<HandStop color="orange" />} title="You either bid on item, or see which auctions you have highest bid on!" />
                    <Timeline.Item bullet={<Heart color="red" />} title="You love it so much, you list your own auction" />
                    <Timeline.Item bullet={<ZoomQuestion />} title="a bunch of stuff.." />
                    <Timeline.Item bullet={<ReportMoney color="green" />} title="Profit!" />
                </Timeline>
                <br/>
                <hr />
                <Blockquote cite="Alexander Gilkes">
                    <Text>I always have my lucky gavel in case I have to do an auction on short notice.</Text>
                </Blockquote>
            </div>
        )
    } else {
        return (<div>Fancy thing pointing to login button at bottom of page maybe a big arrow?</div>)
    }
}