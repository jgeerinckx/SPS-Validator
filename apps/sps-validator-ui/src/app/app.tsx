import { Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    CurrencyDollarIcon,
    HomeIcon,
    Square3Stack3DIcon,
    ServerStackIcon,
    WrenchScrewdriverIcon,
    CogIcon,
    UserIcon,
    ChartBarIcon,
    EnvelopeIcon,
    EnvelopeOpenIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/solid';
import { ListItem, ListItemPrefix } from '@material-tailwind/react';
import { AppNavbar, AppNavbarTickerProps } from './components/layout/Navbar';
import { DefaultService } from './services/openapi';
import { usePromiseRefresh } from './hooks/Promise';
import { AppSidebar } from './components/layout/Sidebar';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { TokenBalances } from './pages/TokenBalances';
import { AccountBalances } from './pages/AccountBalances';
import { ValidatorNodes } from './pages/ValidatorNodes';
import { AccountVotes } from './pages/AccountVotes';
import { ManageValidatorNode } from './pages/ManageValidatorNode';
import { ManageVotes } from './pages/ManageVotes';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/validator-nodes" element={<ValidatorNodes />} />
            <Route path="/validator-nodes/manage" element={<ManageValidatorNode />} />
            <Route path="/token-balances" element={<TokenBalances />} />
            <Route path="/account-balances" element={<AccountBalances />} />
            <Route path="/account-votes" element={<AccountVotes />} />
            <Route path="/account-votes/manage" element={<ManageVotes />} />
            <Route path="/settings" element={<Settings />} />
        </Routes>
    );
}

function AppSidebarItems({ closeSidebar }: { closeSidebar: () => void }) {
    return (
        <>
            <Link to="/" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <HomeIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Home
                </ListItem>
            </Link>
            <Link to="/validator-nodes" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <ServerStackIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Validator Nodes
                </ListItem>
            </Link>
            <Link to="/validator-nodes/manage" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <WrenchScrewdriverIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Manage Validator Node
                </ListItem>
            </Link>
            <Link to="/account-votes" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <EnvelopeIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Account Votes
                </ListItem>
            </Link>
            <Link to="/account-votes/manage" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <PencilSquareIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Manage Votes
                </ListItem>
            </Link>
            <Link to="/token-balances" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <ChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Token Balances
                </ListItem>
            </Link>
            <Link to="/account-balances" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <UserIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Account Balances
                </ListItem>
            </Link>
            <Link to="/settings" onClick={closeSidebar}>
                <ListItem>
                    <ListItemPrefix>
                        <CogIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Site Settings
                </ListItem>
            </Link>
        </>
    );
}

function useTickers() {
    const [spsPrice] = usePromiseRefresh(() => DefaultService.getPriceForToken('SPS'), 5000, []);
    const [status] = usePromiseRefresh(() => DefaultService.getStatus(), 5000, []);
    const [tickers, setTickers] = useState<AppNavbarTickerProps[]>([]);
    useEffect(() => {
        const working: AppNavbarTickerProps[] = [];
        if (spsPrice) {
            working.push({
                name: 'SPS Price',
                icon: <CurrencyDollarIcon className="size-6" />,
                value: `$${spsPrice.price.toFixed(2)}`,
            });
        }
        if (status) {
            working.push({
                name: 'Block Num',
                icon: <Square3Stack3DIcon className="size-6" />,
                value: status.last_block.toString(),
            });
        }
        setTickers(working);
    }, [spsPrice, status]);
    return tickers;
}

export function App() {
    const tickers = useTickers();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    useEffect(() => {
        const listener = () => {
            if (window.innerWidth > 960) {
                setMobileSidebarOpen(false);
            }
        };
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    });
    return (
        <div className="h-screen w-full flex flex-col">
            <AppNavbar tickers={tickers} toggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />
            <div className="flex-grow flex relative">
                <AppSidebar isMobileOpen={mobileSidebarOpen}>
                    <AppSidebarItems closeSidebar={() => setMobileSidebarOpen(false)} />
                </AppSidebar>
                <div className="flex-grow p-5">
                    <AppRoutes />
                </div>
            </div>
        </div>
    );
}

export default App;