import Link from 'next/link';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Chart } from './components/chart';
import { Button } from '@/components/ui/button';
import { CardData } from './components/card-data';
import { Separator } from '@/components/ui/separator';
import { ProjectRanking } from './components/project-ranking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getOrganization, getTickets } from '@/lib/api';

export const metadata: Metadata = {
    title: 'Organização',
    description: 'Organização',
};

export default async function Organization() {
    const session = await auth();
    if (!session) redirect('/');

    const { role } = session.user;
    const tickets = await getTickets();
    const organization = await getOrganization();

    const features = tickets.filter((ticket) => ticket.type === 'feature');
    const { members, projects } = organization;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organização</CardTitle>
                <CardDescription>Organização</CardDescription>
            </CardHeader>
            <Separator className='mb-6' />

            <main className='flex flex-col'>
                <div className='flex-1 space-y-4 px-8 pb-8'>
                    <Tabs defaultValue='overview' className='space-y-4'>
                        <div className='flex flex-col-reverse justify-between gap-4 md:flex-row'>
                            <TabsList className='w-full md:w-fit'>
                                <TabsTrigger
                                    value='overview'
                                    className='w-full'
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value='analytics'
                                    className='w-full'
                                >
                                    Analytics
                                </TabsTrigger>
                            </TabsList>
                            {role === 'admin' && (
                                <div className='flex flex-col gap-4 sm:flex-row md:gap-2'>
                                    <Link
                                        href='/organization/projects'
                                        className='w-full'
                                    >
                                        <Button
                                            variant='secondary'
                                            className='w-full md:w-fit'
                                        >
                                            Projetos
                                        </Button>
                                    </Link>
                                    <Link
                                        href='/organization/members'
                                        className='w-full'
                                    >
                                        <Button
                                            variant='secondary'
                                            className='w-full md:w-fit'
                                        >
                                            Membros
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <TabsContent value='overview' className='space-y-4'>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                                <CardData
                                    title={
                                        tickets.length === 1
                                            ? 'Ticket'
                                            : 'Tickets'
                                    }
                                    value={tickets.length}
                                    description={
                                        tickets.length === 1
                                            ? 'ticket aberto no momento'
                                            : 'tickets abertos no momento'
                                    }
                                />
                                <CardData
                                    title='Features'
                                    value={features.length}
                                    // description='sugestões de features'
                                    description={
                                        features.length === 1
                                            ? 'sugestão de feature'
                                            : 'sugestões de features'
                                    }
                                />
                                <CardData
                                    title='Membros'
                                    value={members.length}
                                    description='membros cadastrados na organização'
                                />
                                <CardData
                                    title='Projetos'
                                    value={projects.length}
                                    description={
                                        projects.length === 1
                                            ? 'projeto cadastrado na organização'
                                            : 'projetos cadastrados na organização'
                                    }
                                />
                            </div>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-8'>
                                <Card className='col-span-4'>
                                    <CardHeader>
                                        <CardDescription>
                                            Projetos com mais tickets abertos
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ProjectRanking projects={projects} />
                                    </CardContent>
                                </Card>
                                <Card className='col-span-4'>
                                    <CardHeader>
                                        <CardDescription>
                                            Projetos com mais tickets resolvidos
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ProjectRanking projects={projects} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value='analytics' className='space-y-4'>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                                <Card className='col-span-7'>
                                    <CardHeader>
                                        <CardTitle>Tickets per month</CardTitle>
                                    </CardHeader>
                                    <CardContent className='pl-2'>
                                        <Chart />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </Card>
    );
}
