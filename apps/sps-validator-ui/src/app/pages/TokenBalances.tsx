import { Card, CardBody, Checkbox, Spinner, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import { DefaultService } from '../services/openapi';
import { usePromise } from '../hooks/Promise';
import { Table, TableBody, TableCell, TableColumn, TableHead, TablePager, TableRow } from '../components/Table';
import useSpinnerColor from '../hooks/SpinnerColor'

const tokens = ['SPS', 'SPSP', 'LICENSE'];

function TokenBalancesTab({ token }: { token: string }) {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10); // TODO: Add a limit selector
    const [systemAccounts, setSystemAccounts] = useState(false);
    const [count, isLoadingCount] = usePromise(() => DefaultService.getBalancesByToken(token, 0, 0, systemAccounts), [token, systemAccounts]);
    const [balances, isLoading] = usePromise(() => DefaultService.getBalancesByToken(token, limit, page * limit, systemAccounts), [token, page, limit, systemAccounts]);
    const spinnerColor = useSpinnerColor("blue")

    const toggleSystemAccounts = (value: boolean) => {
        setSystemAccounts(value);
        setPage(0);
    };

    if (isLoading || isLoadingCount) {
        return <Spinner className="w-full" color={spinnerColor}/>;
    }

    return (
        <>
            <Table className="w-full border-2 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-300">
                <TableHead>
                    <TableRow>
                        <TableColumn className="dark:bg-gray-300 dark:text-gray-800">Token</TableColumn>
                        <TableColumn className="dark:bg-gray-300 dark:text-gray-800">
                            <div className="flex items-center">
                                Player
                                <div className="ms-5">
                                    <Checkbox checked={systemAccounts} label="Include System Accounts" onChange={(e) => toggleSystemAccounts(e.target.checked)} className="dark:checked:bg-blue-800 dark:border-gray-800 dark:before:bg-blue-400 dark:checked:before:bg-blue-400 dark:text-gray-800" labelProps={{className: "dark:text-gray-800"}}/>
                                </div>
                            </div>
                        </TableColumn>
                        <TableColumn className="dark:bg-gray-300 dark:text-gray-800">Balance</TableColumn>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {balances?.balances?.map((balance) => (
                        <TableRow key={balance.player} className="dark:border-gray-300">
                            <TableCell>{token}</TableCell>
                            <TableCell>{balance.player}</TableCell>
                            <TableCell>{balance.balance.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {count?.count && <TablePager className="w-full justify-center mt-3" page={page} limit={limit} displayPageCount={2} onPageChange={setPage} count={count?.count} />}
        </>
    );
}

export function TokenBalances() {
    return (
        <Card className="dark:bg-gray-800 dark:text-gray-300 dark:shadow-none">
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2 dark:text-gray-200">
                    Token Balances
                </Typography>
                <Tabs className="mt-4" value={tokens[0]}>
                    <TabsHeader className="dark:bg-gray-300 dark:text-gray-800" indicatorProps={{className: "dark:bg-blue-800"}}>
                        {tokens.map((token) => (
                            <Tab key={token} value={token} activeClassName="dark:text-gray-300">
                                {token}
                            </Tab>
                        ))}
                    </TabsHeader>
                    <TabsBody>
                        {tokens.map((token) => (
                            <TabPanel key={token} value={token}>
                                <TokenBalancesTab token={token} />
                            </TabPanel>
                        ))}
                    </TabsBody>
                </Tabs>
            </CardBody>
        </Card>
    );
}
