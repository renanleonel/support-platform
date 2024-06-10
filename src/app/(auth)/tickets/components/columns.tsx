'use client';

import { Ticket } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { types, priorities, projects, statuses } from '@/content/constants';

import { DataTableRowActions } from './data-table-row-actions';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<Ticket>[] = [
    {
        accessorKey: 'title',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Título' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='w-[320px] truncate font-medium'>
                        {row.getValue('title')}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'project',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Projeto' />
        ),
        cell: ({ row }) => {
            const project = projects.find(
                (project) => project.value === row.original.project
            );

            if (!project) {
                return null;
            }

            return (
                <div className='flex space-x-2'>
                    <span className='max-w-[400px] truncate font-medium'>
                        {project.label}
                    </span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'type',
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tipo' />
        ),
        cell: ({ row }) => {
            const type = types.find((type) => type.value === row.original.type);

            return (
                <div className='flex justify-center space-x-2'>
                    {type && <Badge variant='outline'>{type.label}</Badge>}
                </div>
            );
        },
    },

    {
        accessorKey: 'priority',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Prioridade' />
        ),
        cell: ({ row }) => {
            const priority = priorities.find(
                (priority) => priority.value === row.getValue('priority')
            );

            if (!priority) {
                return null;
            }

            return (
                <div className='flex items-center'>
                    {priority.icon && (
                        <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                    )}
                    <span>{priority.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue('status')
            );

            if (!status) {
                return null;
            }

            return (
                <div className='flex items-center'>
                    {status.icon && (
                        <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                    )}
                    <span>{status.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
