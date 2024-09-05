'use client';

import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { changeLanguage, changeProfile } from '@/lib/actions';
import { changeProfileIS } from '@/content/initial-states';

import { Theme } from '@/components/ui/theme';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

const languages = [
    { label: 'Português', value: 'ptbr' },
    { label: 'English', value: 'en' },
];

interface ProfileFormProps {
    name: string;
}

export function ProfileForm({ name }: ProfileFormProps) {
    const [formState, formAction] = useFormState(
        changeProfile,
        changeProfileIS
    );

    const { errors } = formState;

    return (
        <form action={formAction} className='space-y-8'>
            <div className='space-y-2'>
                <Label>Name</Label>
                <Input
                    name='name'
                    defaultValue={name}
                    placeholder='Your name'
                    className={cn(errors.name && 'border-red-400')}
                />
                <p className='text-xs text-red-400'>{errors.name}</p>
                <p className='text-sm text-muted-foreground'>
                    This is the name that will be displayed on your profile and
                    in emails.
                </p>
            </div>

            <div className='flex flex-col space-y-2'>
                <Label>Language</Label>
                <Combobox
                    name='language'
                    defaultValue='ptbr'
                    options={languages}
                    placeholderText='Language'
                    searchText='Select a language'
                    onValueChange={async (value) => await changeLanguage(value)}
                    className={cn(
                        'lg:max-w-xs',
                        errors.language && 'border-red-400'
                    )}
                />
                <p className='text-sm text-muted-foreground'>
                    This is the name that will be displayed on your profile and
                    in emails.
                </p>
            </div>

            <div className='flex justify-between'>
                <Button type='submit'>Update</Button>
                <Theme />
            </div>
        </form>
    );
}
