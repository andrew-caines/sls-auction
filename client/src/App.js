
import { AppShell, Navbar, Header } from '@mantine/core';
import { Routes, Route, } from "react-router-dom";
import LOGO from './images/Auction_Logo.png';
import SideMenu from './components/AppShell/SideMenu';
import MainContent from './components/AppShell/MainContent';
import MyAuctions from './components/MyAuctions';
import AllAuctions from './components/AllAuctions';
import ClosedAuctions from './components/ClosedAuctions';

function App() {
  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 350 }} height="95vh" p="xs"><SideMenu /></Navbar>}
      header={<Header height="5vh" p="xs"><img src={LOGO} width={32} height={32} alt="Andrew's Auctions" />Andrew Auctions</Header>}
      style={{ height: '100vh'}}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Routes>
        <Route index element={<MainContent />} />
        <Route path="/allauctions" element={<AllAuctions />} />
        <Route path="/myauctions" element={<MyAuctions />} />
        <Route path="/closedauctions" element={<ClosedAuctions />} />
      </Routes>

    </AppShell>

  );
}

export default App;
