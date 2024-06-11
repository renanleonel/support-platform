import { z } from 'zod';

export const recoverSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Insira o email!' })
        .email({ message: 'Email inválido!' }),
});

export const authSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Insira o email!' })
        .email({ message: 'Email inválido!' }),
    password: z.string().min(1, { message: 'Insira a senha!' }),
});

export const signUpForm = z
    .object({
        name: z
            .string()
            .min(1, { message: 'Insira o nome!' })
            .min(3, { message: 'Nome deve ter no mínimo 3 caracteres!' })
            .trim(),
        email: z
            .string()
            .min(1, { message: 'Insira o email!' })
            .email({ message: 'Email inválido!' }),
        password: z
            .string()
            .min(1, { message: 'Insira a senha!' })
            .min(6, { message: 'Senha deve ter no mínimo 6 caracteres!' }),
        confirmPassword: z.string().min(1, { message: 'Confirme a senha!' }),
        organizationName: z.string().trim().optional(),
        organizationCode: z.string().trim().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Senhas não coincidem!',
        path: ['confirmPassword'],
    });

export const ticketSchema = z.object({
    title: z.string().min(1, { message: 'Insira o título!' }).trim(),
    description: z.string().min(1, { message: 'Insira a descrição!' }).trim(),
    project: z.string().min(1, { message: 'Insira o projeto!' }),
    type: z.string().min(1, { message: 'Insira o tipo!' }),
    priority: z.string().min(1, { message: 'Insira a prioridade!' }),
    status: z.string().min(1, { message: 'Insira o status!' }),
    files: z
        .array(
            z.object({
                size: z.number(),
                type: z.string(),
                name: z.string(),
                lastModified: z.number(),
            })
        )
        .optional(),
    link: z.string().trim().optional(),
});

export const validateOrganizationSchema = z.object({
    code: z.string().min(1, { message: 'Insira o código!' }).trim(),
});

export const projectSchema = z.object({
    name: z.string().min(1, { message: 'Insira o nome!' }).trim(),
});

export const changePasswordSchema = z
    .object({
        password: z.string().min(6, { message: 'Insira a senha atual!' }),
        newPassword: z.string().min(6, { message: 'Insira a nova senha!' }),
        confirmNewPassword: z
            .string()
            .min(6, { message: 'Confirme a nova senha!' }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Senhas não coincidem!',
        path: ['confirmNewPassword'],
    });

export const changeProfileSchema = z.object({
    name: z.string().min(1, { message: 'Insira o nome!' }).trim(),
    language: z.string().min(1, { message: 'Insira o idioma!' }),
    profilePic: z
        .object({
            size: z.number(),
            type: z.string(),
            name: z.string(),
            lastModified: z.number(),
        })
        .optional(),
});

export const helpSchema = z.object({
    title: z.string().min(1, { message: 'Insira o título!' }).trim(),
    message: z
        .string()
        .min(1, { message: 'Insira a mensagem!' })
        .max(500, 'Mensagem muito longa!')
        .trim(),
});

export const organizationSchema = z.object({
    name: z.string().min(1, { message: 'Insira o nome!' }).trim(),
});
