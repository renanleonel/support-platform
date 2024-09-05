'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from './input';

interface ComboboxProps {
    options: { value: string; label: string }[];
    placeholderText: string;
    searchText: string;
    className?: string;
    name?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
}

export const Combobox = ({
    options,
    placeholderText,
    searchText,
    className,
    name,
    defaultValue = '',
    onValueChange,
}: ComboboxProps) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(defaultValue);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className={cn('justify-between', className)}
                >
                    <Input
                        name={name}
                        defaultValue={value}
                        className='hidden'
                    />

                    {value
                        ? options.find((option) => option.value === value)
                              ?.label
                        : placeholderText}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn('p-0', className)}>
                <Command>
                    <CommandInput placeholder={searchText} className='h-9' />
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    setValue(
                                        currentValue === value
                                            ? ''
                                            : currentValue
                                    );
                                    onValueChange?.(currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Input
                                    name={name}
                                    defaultValue={option.value}
                                    className='hidden'
                                />

                                {option.label}
                                <CheckIcon
                                    className={cn(
                                        'ml-auto h-4 w-4',
                                        value === option.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
