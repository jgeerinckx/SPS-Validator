import { useSearchParams } from 'react-router-dom';
import { Hive } from '../services/hive';
import { Button, Card, CardBody, Input, Typography } from '@material-tailwind/react';
import { FormEvent, useState } from 'react';
import { usePromise } from '../hooks/Promise';
import { DefaultService } from '../services/openapi';
import { Table, TableBody, TableCell, TableColumn, TableHead, TableRow } from '../components/Table';

export function AccountBalancesCard({ account }: { account: string }) {
    const [balances, loading] = usePromise(() => DefaultService.getBalances(account), [account]);
    return (
        <Card className="dark:bg-gray-800 dark:text-gray-300">
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2 dark:text-gray-200">
                    Account Balances for {account}
                </Typography>
                {loading && <Typography variant="paragraph"  className="dark:text-gray-300">Loading...</Typography>}
                {balances && (
                    <Table className="w-full mt-4 border-2 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-300">
                        <TableHead>
                            <TableRow>
                                <TableColumn className="dark:bg-gray-300 dark:text-gray-800">Token</TableColumn>
                                <TableColumn className="dark:bg-gray-300 dark:text-gray-800">Balance</TableColumn>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {balances.map((balance) => (
                                <TableRow key={balance.token} className="dark:border-gray-300">
                                    <TableCell>{balance.token}</TableCell>
                                    <TableCell>{balance.balance.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardBody>
        </Card>
    );
}

export function AccountBalances() {
    const [searchParams, setSearchParams] = useSearchParams({
        account: Hive.ACCOUNT ?? '',
    });
    const searchAccount = searchParams.get('account') ?? '';

    const [account, setAccount] = useState<string>(searchAccount);
    const setAccountInParams = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearchParams({ account });
    };

    return (
        <div className="flex flex-col gap-4">
            <Card className="dark:bg-gray-800 dark:text-gray-300">
                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2 dark:text-gray-200">
                        Account Balances
                    </Typography>
                    <Typography variant="paragraph" className="dark:text-gray-300">Enter an account to look up their account balances.</Typography>

                    <form className="mt-4 flex gap-4 2xl:max-w-96 2xl:w-1/4 lg:w-2/3 md:w-full" onSubmit={setAccountInParams}>
                        <Input value={account} onChange={(e) => setAccount(e.target.value)} label="Account" placeholder="Account" className="flex-grow-1 dark:text-gray-300 dark:focus:border-gray-300 dark:focus:border-t-transparent dark:placeholder:text-gray-300 dark:focus:placeholder:text-gray-500" labelProps={{className: "dark:peer-placeholder-shown:text-gray-300 dark:placeholder:text-gray-300 dark:text-gray-300 dark:peer-focus:text-gray-300 dark:peer-focus:before:!border-gray-300 dark:peer-focus:after:!border-gray-300"}} />
                        <Button className="w-32 dark:bg-blue-800 dark:hover:bg-blue-600 dark:border-gray-300 dark:border dark:text-gray-300 dark:hover:text-gray-100" type="submit">
                            Lookup
                        </Button>
                    </form>
                </CardBody>
            </Card>
            {searchAccount && <AccountBalancesCard account={searchAccount} />}
        </div>
    );
}
