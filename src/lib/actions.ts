'use server';

import { auth, signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidateTag } from 'next/cache';
import { Resend } from 'resend';

import {
    authSchema,
    changePasswordSchema,
    changeProfileSchema,
    helpSchema,
    organizationSchema,
    projectSchema,
    recoverSchema,
    signUpForm,
    ticketSchema,
    validateOrganizationSchema,
} from '@/types/schema';

import {
    authDV,
    changePasswordDV,
    changeProfileDV,
    deactivateAccountDV,
    helpDV,
    organizationDV,
    projectDV,
    recoverDV,
    signupDV,
    ticketDV,
    validateOrganizationDV,
} from '@/content/default-values';

import {
    fetchMembers,
    fetchOrganization,
    fetchProjects,
    fetchTicketByID,
    fetchTickets,
    fetchUser,
    patchMember,
    patchOrganization,
    patchProject,
    patchTicket,
    postHelp,
    postProject,
    postTicket,
    removeMember,
    removeOrganization,
    removeProject,
    removeTicket,
} from '@/lib/api';
import { Member, Ticket } from '@/types';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function signin(_: any, formData: FormData) {
    try {
        const form = Object.fromEntries(formData.entries());

        const validatedFields = authSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const payload = {
            ...validatedFields.data,
        };

        await signIn('credentials', payload);

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: 'credentials error',
                        errors: {
                            ...authDV,
                            credentials: 'Email ou senha incorretos.',
                        },
                    };
                default:
                    return {
                        message: 'unknown error',
                        errors: {
                            ...authDV,
                            unknown: 'Erro desconhecido.',
                        },
                    };
            }
        }
        throw error;
    }
}

export async function signup(_: any, formData: FormData) {
    try {
        const form = Object.fromEntries(formData.entries());
        const { organizationName, organizationCode } = form;

        if (!organizationName && !organizationCode) {
            return {
                message: 'missing organization',
                errors: {
                    ...signupDV,
                },
            };
        }

        const validatedFields = signUpForm.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        if (organizationCode) {
            // link organization to user
        } else {
            // const organization = await createOrganization(organizationName);
            // link organization to user
        }

        // await sendConfirmationEmail(email);

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...signupDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function signout() {
    await signOut();
}

export async function verifyAuth() {
    const session = await auth();

    if (!session) {
        redirect('/');
    }

    return session.user;
}

export async function sendConfirmationEmail(email: string) {
    await verifyAuth();

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'oi',
        html: '<h1>account created successfully!</h1>',
    });
}

export async function recover(_: any, formData: FormData) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());

        const validatedFields = recoverSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { email } = validatedFields.data;

        // verify if email exists in database

        const emailExists = false;

        if (!emailExists) {
            return {
                message: 'email not found',
                errors: {
                    ...recoverDV,
                    email: 'Email não encontrado.',
                },
            };
        }

        const request = await sendRecoverEmail(email);

        const { error, message } = request;

        if (error) {
            return {
                message: 'email error',
                errors: {
                    ...recoverDV,
                    unknown: message,
                },
            };
        }

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...recoverDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function sendRecoverEmail(email: string) {
    await verifyAuth();

    const resend = new Resend(process.env.RESEND_API_KEY);

    const request = await resend.emails
        .send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'test',
            html: '<h1>test</h1>',
        })
        .then((res) => {
            if (res.error) {
                return {
                    error: true,
                    message: res.error.message,
                };
            }

            return {
                error: false,
                message: 'success',
            };
        })
        .catch((error) => {
            return {
                error: true,
                message: error.message,
            };
        });

    return request;
}

export async function getInvitationOrigin(id: string) {
    await verifyAuth();

    return {
        email: 'test@quark.com',
    };
}

export async function createOrganization(name: string) {
    await verifyAuth();

    return {
        id: '12345',
        name: name,
    };
}

export async function validateOrganization(_: any, formData: FormData) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());

        const validatedFields = validateOrganizationSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...validateOrganizationDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function getUser(email: string, password: string): Promise<any> {
    const request = await fetchUser(email, password);

    return request;
}

export async function getTickets() {
    await verifyAuth();

    try {
        const tickets = await fetchTickets();

        return tickets;
    } catch (error) {
        //sentry
    }
}

export async function getTicketByID(id: string): Promise<Ticket> {
    await verifyAuth();

    try {
        const ticket = await fetchTicketByID(id);

        return ticket;
    } catch (error) {
        throw new Error('Ticket not found');
    }
}

export async function createTicket(files: File[], _: any, formData: FormData) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());
        const validatedFields = ticketSchema.safeParse({
            ...form,
            files: files,
            status: 'na fila',
        });

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const body = {
            ...validatedFields.data,
        };

        const { error, statusCode, message } = await postTicket(body);

        if (error) {
            return {
                message: 'api error',
                errors: {
                    ...ticketDV,
                    unknown: `statusCode: ${statusCode}, message: ${message}`,
                },
            };
        }

        revalidateTag('@tickets');

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...ticketDV,
                unknown: `unknown error: ${error}`,
            },
        };
    }
}

export async function editTicket(
    params: {
        id: string;
        files: File[];
    },
    _: any,
    formData: FormData
) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());

        const { id, files } = params;

        const validatedFields = ticketSchema.safeParse({
            ...form,
            files,
        });

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const payload = {
            id: id,
            ...validatedFields.data,
        };

        const { error } = await patchTicket(payload);

        if (error) {
            return {
                message: 'unknown error',
                errors: {
                    ...ticketDV,
                    unknown: 'Erro desconhecido.',
                },
            };
        }

        revalidateTag('@tickets');

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...ticketDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function deleteTicket(id: string) {
    await verifyAuth();

    try {
        const { statusCode } = await removeTicket(id);

        return statusCode;
    } catch {
        //sentry
    }
}

export async function getProjects() {
    try {
        const user = await verifyAuth();
        const organizationID = user.organization;

        if (!organizationID) {
            throw new Error('Organization not found');
        }

        const {
            error,
            statusCode,
            message,
            data: projects,
        } = await fetchProjects(organizationID);

        if (error) {
            throw new Error(
                `Projects not found! Status: ${statusCode}, Message: ${message}`
            );
        }

        return projects;
    } catch (error) {
        //sentry
    }
}

export async function getProjectByID(id: string) {
    await verifyAuth();
}

export async function createProject(_: any, formData: FormData) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());

        const validatedFields = projectSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const payload = {
            ...validatedFields.data,
        };

        const { error, statusCode, message } = await postProject(payload);

        if (error) {
            switch (statusCode) {
                case 409:
                    return {
                        message: 'unique constraint',
                        errors: {
                            ...projectDV,
                            name: 'Já existe um projeto com este nome',
                        },
                    };
                default:
                    return {
                        message: 'unknown error',
                        errors: {
                            ...projectDV,
                            unknown: `statusCode: ${statusCode}, message: ${message}`,
                        },
                    };
            }
        }

        revalidateTag('@projects');

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...projectDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function editProject(id: string, _: any, formData: FormData) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());

        const validatedFields = projectSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const payload = {
            ...validatedFields.data,
        };

        const { error, statusCode, message } = await patchProject(id, payload);

        if (error) {
            switch (statusCode) {
                case 409:
                    return {
                        message: 'unique constraint',
                        errors: {
                            ...projectDV,
                            name: 'Já existe um projeto com este nome',
                        },
                    };
                default:
                    return {
                        message: 'unknown error',
                        errors: {
                            ...projectDV,
                            unknown: `statusCode: ${statusCode}, message: ${message}`,
                        },
                    };
            }
        }

        revalidateTag('@projects');

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...projectDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function deleteProject(id: string) {
    await verifyAuth();

    try {
        // delete project
        const { error } = await removeProject(id);

        if (error) {
            return {
                error: true,
                message: 'Erro ao deletar projeto',
            };
        }

        revalidateTag('@tickets');
        revalidateTag('@projects');

        return {
            error: false,
            message: 'Projeto deletado com sucesso',
        };
    } catch (error) {
        return {
            error: true,
            message: 'Erro desconhecido',
        };
        //sentry
    }
}

export async function getMembers(organizationID: string) {
    await verifyAuth();

    try {
        const {
            error,
            message,
            statusCode,
            data: members,
        } = await fetchMembers(organizationID);

        if (error) {
            throw new Error(
                `Members not found! Status: ${statusCode}, Message: ${message}`
            );
        }

        return members;
    } catch (error) {
        //sentry
    }
}

export async function getMemberByID(memberID: string) {
    await verifyAuth();
}

export async function updateMember(memberID: string, body: Member) {
    await verifyAuth();

    try {
        const { statusCode, error } = await patchMember(memberID, body);

        if (!error) {
            revalidateTag('@members');
        }
        return statusCode;
    } catch {
        //sentry
    }
}

export async function deleteMember(memberID: string) {
    await verifyAuth();

    try {
        const { statusCode, error } = await removeMember(memberID);

        if (!error) {
            revalidateTag('@members');
        }

        return statusCode;
    } catch {
        //sentry
    }
}

export async function changeProfile(_: any, formData: FormData) {
    try {
        const user = await verifyAuth();

        const name = formData.get('name');
        const language = formData.get('language');
        const profilePic = formData.get('profilePic');

        if (name === user.name) {
            return {
                message: 'validation error',
                errors: {
                    ...changeProfileDV,
                    name: 'Nome não pode ser igual ao atual.',
                },
            };
        }

        const validatedFields = changeProfileSchema.safeParse({
            name: name,
            language: language,
            profilePic: profilePic,
        });

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...changeProfileDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function getOrganization() {
    await verifyAuth();

    try {
        const organization = await fetchOrganization();
        return organization;
    } catch (error) {
        //sentry
    }
}

export async function getOrganizationByID(id: string) {
    await verifyAuth();

    return '';
}

export async function getOrganizationStatistics() {
    await verifyAuth();
}

export async function updateUserName(name: string) {
    await verifyAuth();

    try {
    } catch (error) {}
}

export async function updateOrganizationName(
    currentName: string,
    _: any,
    formData: FormData
) {
    try {
        const user = await verifyAuth();
        const organizationID = user.organization;

        const form = Object.fromEntries(formData.entries());

        if (form.name === currentName) {
            return {
                message: 'same name',
                errors: {
                    ...organizationDV,
                    name: 'Nome não pode ser igual ao atual.',
                },
            };
        }

        const validatedFields = organizationSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const name = validatedFields.data.name;

        const { error, message, statusCode } = await patchOrganization(
            organizationID,
            name
        );

        if (error) {
            return {
                message: 'unknown error',
                errors: {
                    ...organizationDV,
                    unknown: `statusCode: ${statusCode}, message: ${message}`,
                },
            };
        }

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...organizationDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function deleteOrganization(_: any, formData: FormData) {
    let success = false;

    try {
        const user = await verifyAuth();

        const organizationID = user.organization;

        const form = Object.fromEntries(formData.entries());

        const validatedFields = organizationSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { name } = validatedFields.data;

        const organizationName = await getOrganizationByID(organizationID);

        if (name !== organizationName) {
            return {
                message: 'wrong name',
                errors: {
                    ...organizationDV,
                    name: 'Nome incorreto.',
                },
            };
        }

        const { error, message, statusCode } =
            await removeOrganization(organizationID);

        if (error) {
            return {
                message: 'unknown error',
                errors: {
                    ...organizationDV,
                    unknown: `statusCode: ${statusCode}, message: ${message}`,
                },
            };
        }

        success = true;
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...organizationDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }

    if (success) {
        await signOut();

        return {
            message: 'success',
            errors: {},
        };
    }

    return {
        message: 'unknown error',
        errors: {
            ...organizationDV,
            unknown: 'Erro desconhecido.',
        },
    };
}

export async function changePassword(_: any, formData: FormData) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());

        const validatedFields = changePasswordSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        // const payload = {
        // ...validatedFields.data,
        // }

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...changePasswordDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function deactivateAccount(_: any, formData: FormData) {
    await verifyAuth();

    let success = false;

    try {
        const email = formData.get('email');
        const session = await auth();

        if (session?.user?.email !== email) {
            return {
                message: 'validation error',
                errors: {
                    email: 'Email incorreto.',
                },
            };
        }
        success = true;

        // delete user
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...deactivateAccountDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }

    if (success) {
        await signOut();

        return {
            message: 'success',
            errors: {},
        };
    }
}

export async function help(_: any, formData: FormData) {
    await verifyAuth();

    try {
        const form = Object.fromEntries(formData.entries());

        const validatedFields = helpSchema.safeParse(form);

        if (!validatedFields.success) {
            return {
                message: 'validation error',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const payload = {
            ...validatedFields.data,
        };

        const { error, message, statusCode } = await postHelp(payload);

        if (error) {
            return {
                message: 'unknown error',
                errors: {
                    ...helpDV,
                    unknown: `statusCode: ${statusCode}, message: ${message}`,
                },
            };
        }

        return {
            message: 'success',
            errors: {},
        };
    } catch (error) {
        return {
            message: 'unknown error',
            errors: {
                ...helpDV,
                unknown: 'Erro desconhecido.',
            },
        };
    }
}

export async function changeLanguage(language: string) {
    await verifyAuth();

    cookies().set('language', language);
}
