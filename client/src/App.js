import { AppShell, Navbar, Header } from '@mantine/core';
import { Routes, Route, } from "react-router-dom";
import { ProtectedRoute } from './components/ProtectedRoute';
import LOGO from './images/Auction_Logo.png';
import SideMenu from './components/AppShell/SideMenu';
import MainContent from './components/AppShell/MainContent';
import AllAuctions from './components/AllAuctions';
import CreateAuction from './components/CreateAuction/CreateAuction';
import { useNavigate } from "react-router-dom";

function App() {
  let navigate = useNavigate();
  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 350 }} height="90vh" p="xs"><SideMenu /></Navbar>}
      header={<Header height="64px" p="xs" onClick={() => navigate('/')}><img src={LOGO} width={32} height={32} alt="Andrew's Auctions"  />Andrew Auctions</Header>}
      style={{ height: '100vh' }}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Routes>
        <Route index element={<MainContent />} />
        <Route path="/createauction" element={<ProtectedRoute component={CreateAuction} />} />
        <Route path="/allauctions" element={<ProtectedRoute component={AllAuctions} />} />
        <Route path="/myauctions" element={<ProtectedRoute component={AllAuctions} />} />
        <Route path="/closedauctions" element={<ProtectedRoute component={AllAuctions} />} />
      </Routes>

    </AppShell>

  );
}

export default App;