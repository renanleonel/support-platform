'use client';

import { toast } from 'sonner';
import { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { editTicket } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon } from 'lucide-react';
import { ticketIS } from '@/content/initial-states';
import { priorities, statuses, types } from '@/content/constants';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { SuperLink } from '@/components/super-link';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardFooter } from '@/components/ui/card';

import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from '@/components/ui/select';

import { SubmitButton } from '@/components/form/submit-button';
import { DialogUploadFile } from '@/components/drawer/drawer-upload-file';

interface EditFormProps {
    ticket: Ticket;
    projects: {
        value: string;
        label: string;
    }[];
}

export const EditTicketForm = ({ ticket, projects }: EditFormProps) => {
    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);

    const [files, setFiles] = useState<File[]>([]);

    const action = editTicket.bind(null, {
        id: ticket.id as string,
        files,
    });
    const [formState, formAction] = useFormState(action, ticketIS);

    const { errors, message } = formState;

    useEffect(() => {
        if (message === 'success') {
            toast.success('Ticket updated successfully!');
            ref.current?.reset();
            router.replace('/tickets');
        }

        if (message === 'unknown error') {
            toast.error('Error updating ticket, please try again.');
        }
    }, [message, formState, router]);

    return (
        <form action={formAction}>
            <CardContent className='flex flex-col gap-6 lg:flex-row'>
                <section className='flex w-full flex-col gap-6'>
                    <div className='grid gap-2'>
                        <Label htmlFor='subject'>Título</Label>
                        <Input
                            name='title'
                            id='subject'
                            defaultValue={ticket.title}
                            placeholder='Preciso de ajuda com...'
                            className={cn(errors.title && 'border-red-400')}
                        />
                    </div>
                    <div className='flex h-full flex-col gap-2'>
                        <Label htmlFor='description'>Descrição</Label>
                        <Textarea
                            name='description'
                            id='description'
                            defaultValue={ticket.description}
                            className={cn(
                                'h-full',
                                errors.description && 'border-red-400'
                            )}
                            placeholder='Insira todas as informações necessárias para que possamos te ajudar.'
                        />
                    </div>
                </section>

                <section className='flex w-full flex-col gap-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='type'>Tipo</Label>
                            <Select defaultValue={ticket.type} name='type'>
                                <SelectTrigger
                                    id='type'
                                    className={cn(
                                        'truncate lg:w-full',
                                        errors.type && 'border-red-400'
                                    )}
                                >
                                    <SelectValue placeholder='Tipo' />
                                </SelectTrigger>
                                <SelectContent>
                                    {types.map((type, key) => {
                                        return (
                                            <SelectItem
                                                key={key}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='grid gap-2'>
                            <Label htmlFor='priority'>Prioridade</Label>
                            <Select
                                name='priority'
                                defaultValue={ticket.priority}
                            >
                                <SelectTrigger
                                    id='priority'
                                    className={cn(
                                        'truncate lg:w-full',
                                        errors.priority && 'border-red-400'
                                    )}
                                >
                                    <SelectValue placeholder='Prioridade' />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorities.map((priority, key) => {
                                        return (
                                            <SelectItem
                                                key={key}
                                                value={priority.value}
                                            >
                                                {priority.label}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 lg:grid-cols-1'>
                        <div className='grid gap-2'>
                            <Label htmlFor='project'>Project</Label>
                            <Combobox
                                options={projects}
                                defaultValue={ticket.project}
                                placeholderText='Selecione'
                                searchText='Pesquise'
                                name='project'
                                className={cn(
                                    errors.project && 'border-red-400'
                                )}
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='status'>Status</Label>
                            <Select
                                name='status'
                                value={ticket.status}
                                disabled
                            >
                                <SelectTrigger
                                    id='status'
                                    className={cn(
                                        'truncate lg:w-full',
                                        errors.status && 'border-red-400'
                                    )}
                                >
                                    <SelectValue placeholder='Prioridade' />
                                    <input
                                        type='hidden'
                                        name='status'
                                        value={ticket.status}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status, key) => {
                                        return (
                                            <SelectItem
                                                key={key}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='grid gap-2'>
                        <Label htmlFor='Screenshot'>Screenshot</Label>
                        <DialogUploadFile files={files} setFiles={setFiles} />
                    </div>

                    <div className='grid gap-2'>
                        <div className='flex items-center gap-2'>
                            <Label htmlFor='link'>Link</Label>
                            <LinkIcon className='h-3 w-3' />
                        </div>
                        <Input
                            id='link'
                            name='link'
                            placeholder='Link'
                            defaultValue={ticket.link}
                        />
                        {/* {errors.files && (
                            <span className='text-xs text-red-400'>
                                {errors.files}
                            </span>
                        )} */}
                    </div>
                </section>
            </CardContent>
            <CardFooter className='justify-between space-x-2'>
                <SuperLink href='/tickets'>
                    <Button variant='ghost'>Cancelar</Button>
                </SuperLink>
                <SubmitButton text='Enviar' className='w-24' />
            </CardFooter>
        </form>
    );
};
