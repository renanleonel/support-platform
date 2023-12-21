import { Metadata } from 'next';

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import SupportForm from '@/components/form/support/support-form';

export const metadata: Metadata = {
	title: 'Suporte',
	description: 'Envie um ticket para o suporte',
};

const Home = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Suporte</CardTitle>
				<CardDescription>
					Envie um ticket para a nossa equipe
				</CardDescription>
			</CardHeader>

			<SupportForm />
		</Card>
	);
};

export default Home;
