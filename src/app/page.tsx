import Link from 'next/link';
import { Metadata } from 'next';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import AuthForm from '@/components/form/auth/auth-form';

export const metadata: Metadata = {
	title: 'Entrar',
	description: 'Faça login na sua conta para acessar a página de suporte',
};

const Auth = () => {
	return (
		<main className='min-h-screen flex items-center justify-center'>
			<div className='text-white w-[350px] flex flex-col gap-4'>
				<div className='flex flex-col gap-2 text-center'>
					<h1 className='text-2xl font-semibold'>Entrar</h1>
					<p className='text-sm text-muted-foreground'>
						Digite seu email de acesso
					</p>
				</div>
				<AuthForm />

				<Separator className='bg-white/20' />
				<Link href='/recover'>
					<Button variant='outline' type='button' className='w-full'>
						Recuperar senha
					</Button>
				</Link>

				<Label htmlFor='sign-in'>Não tem uma conta?</Label>
				<Link href='/sign-up'>
					<Button variant='outline' type='button' className='w-full'>
						Cadastrar
					</Button>
				</Link>
			</div>
		</main>
	);
};

export default Auth;
