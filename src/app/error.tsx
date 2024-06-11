'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SuperLink } from '@/components/super-link';

export default function Error() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center gap-10'>
            <Label>error!</Label>
            <SuperLink href='/tickets'>
                <Button variant='outline' type='button'>
                    go back
                </Button>
            </SuperLink>
        </main>
    );
}
