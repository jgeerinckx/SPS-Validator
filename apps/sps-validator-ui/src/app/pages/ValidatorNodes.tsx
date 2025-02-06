import { Spinner, Typography, CardBody, Card, Input, Button, Dialog, DialogHeader, DialogBody } from '@material-tailwind/react';
import { FormEvent, useState } from 'react';
import { Table, TableHead, TableRow, TableColumn, TableBody, TableCell, TablePager } from '../components/Table';
import { usePromise } from '../hooks/Promise';
import { DefaultService } from '../services/openapi';
import { Link, useSearchParams } from 'react-router-dom';
import { ValidatorVotesTable } from '../components/ValidatorVotesTable';
import { ValidatorStatsTable } from '../components/ValidatorStatsTable';

function ValidatorNodesCard({ className, onNodeSelected }: { className?: string; onNodeSelected?: (node: string) => void }) {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10); // TODO: Add a limit selector
    const [search, setSearch] = useState('');
    const [count, isLoadingCount] = usePromise(() => DefaultService.getValidators(0, 0), [search]);
    const [result, isLoading] = usePromise(() => DefaultService.getValidators(limit, page * limit, search), [search, page, limit]);

    const [workingSearch, setWorkingSearch] = useState('');
    const updateSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearch(workingSearch);
        setPage(0);
    };

    if (isLoading || isLoadingCount) {
        return <Spinner className="w-full" />;
    }

    const noValidators = result?.validators === undefined || result.validators.length === 0;
    return (
        <Card className={className}>
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2 dark:text-gray-200">
                    Validators
                </Typography>

                <form className="mt-4 w-96 flex justify-self-end gap-4" onSubmit={updateSearch}>
                    <Input value={workingSearch} onChange={(e) => setWorkingSearch(e.target.value)} label="Account" placeholder="Account" className="flex-grow-1 dark:text-gray-300 dark:focus:border-gray-300 dark:focus:border-t-transparent dark:placeholder:text-gray-300 dark:focus:placeholder:text-gray-500" labelProps={{className: "dark:peer-placeholder-shown:text-gray-300 dark:placeholder:text-gray-300 dark:text-gray-300 dark:peer-focus:text-gray-300 dark:peer-focus:before:!border-gray-300 dark:peer-focus:after:!border-gray-300"}}/>
                    <Button className="w-32 dark:bg-blue-800 dark:hover:bg-blue-600 dark:border-gray-300 dark:border dark:text-gray-300 dark:hover:text-gray-100" type="submit">
                        Search
                    </Button>
                </form>

                <Table className="w-full mt-4 border-2 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-300">
                    <TableHead>
                        <TableRow>
                            <TableColumn className="dark:bg-gray-300">
                                <Typography color="blue-gray" className="font-normal text-left dark:text-gray-800">
                                    Validator
                                </Typography>
                            </TableColumn>
                            <TableColumn className="dark:bg-gray-300">
                                <Typography color="blue-gray" className="font-normal text-left dark:text-gray-800">
                                    Active
                                </Typography>
                            </TableColumn>
                            <TableColumn className="dark:bg-gray-300">
                                <Typography color="blue-gray" className="font-normal text-left dark:text-gray-800">
                                    Missed Blocks
                                </Typography>
                            </TableColumn>
                            <TableColumn className="dark:bg-gray-300">
                                <Typography color="blue-gray" className="font-normal text-left dark:text-gray-800">
                                    Total Votes
                                </Typography>
                            </TableColumn>
                            <TableColumn  className="dark:bg-gray-300"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {noValidators && (
                            <TableRow className="dark:border-gray-300">
                                <TableCell colSpan={4}>
                                    <Typography color="blue-gray" className="text-center dark:text-gray-800">
                                        No validators registered. You can register your validator{' '}
                                        <Link to="/validator-nodes/manage" className="text-blue-600 underline dark:text-blue-500">
                                            here.
                                        </Link>
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {result?.validators?.map((validator) => (
                            <TableRow key={validator.account_name}  className="dark:border-gray-300">
                                <TableCell>
                                    <span>
                                        {validator.account_name} (
                                        {validator.post_url && (
                                            <a href={validator.post_url} target="_blank" rel="noreferrer">
                                                {validator.account_name}
                                            </a>
                                        )}
                                        {!validator.post_url && 'no post url set'})
                                    </span>
                                </TableCell>
                                <TableCell>{validator.is_active ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{validator.missed_blocks.toLocaleString()}</TableCell>
                                <TableCell>{validator.total_votes.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button onClick={() => onNodeSelected?.(validator.account_name)} size="sm" className="dark:bg-blue-800 dark:hover:bg-blue-600 dark:border-gray-300 dark:border dark:text-gray-300 dark:hover:text-gray-100">
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {count?.count && <TablePager className="w-full justify-center mt-3" page={page} limit={limit} displayPageCount={2} onPageChange={setPage} count={count?.count} />}
            </CardBody>
        </Card>
    );
}

export function ValidatorNodes() {
    const [searchParams, setSearchParams] = useSearchParams({
        node: '',
    });
    const selectedNode = searchParams.get('node');
    const hasSelectedNode = selectedNode !== '';
    const selectNode = (node: string) => {
        setSearchParams({ node });
    };
    return (
        <div className="grid grid-cols-8 gap-6 auto-rows-min">
            <ValidatorNodesCard className="col-span-full dark:bg-gray-800" onNodeSelected={selectNode} />
            <Dialog className="dialog" open={hasSelectedNode} handler={() => setSearchParams({ node: '' })}>
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Validator Node - {selectedNode}
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Typography variant="h6" color="blue-gray">
                                Stats
                            </Typography>
                            <ValidatorStatsTable validator={selectedNode!} className="w-full mt-3" />
                        </div>
                        <div>
                            <Typography variant="h6" color="blue-gray">
                                Votes
                            </Typography>
                            <ValidatorVotesTable account={selectedNode!} className="w-full mt-3" />
                        </div>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
}
