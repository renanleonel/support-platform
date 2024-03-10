import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import { ticketSchema } from '@/types/schema';
import { DeleteTicket } from '@/app/(auth)/tickets/components/delete-ticket';
import { auth } from '@/auth';
import { cn } from '@/lib/utils';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const task = ticketSchema.parse(row.original);

    let role = 'admin';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                    <DotsHorizontalIcon className='h-4 w-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
                {role === 'admin' && (
                    <div>
                        <Link href={`/edit/${task.id}`}>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DeleteTicket />
                    </div>
                )}
                {role !== 'admin' && (
                    <div className='pointer-events-none opacity-30'>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
