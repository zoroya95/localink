import { getCurrentSession, registerUser } from '@/actions/auth'
import SignUp from '@/components/auth/SignUp';
import { redirect } from 'next/navigation';
import React from 'react'
import zod from "zod"


const SignUpSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(5)
})

const SignUpPage = async () => {

    const { user } = await getCurrentSession();

    if (user) {
        return redirect("/")
    }

    const action = async (prevState: any, formData: FormData) => {
        "use server";
        const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));
        if (!parsed.success) {
            return {
                message: "Invalid from data",
            };
        }

        const { email, password } = parsed.data;
        const { user, error } = await registerUser(email, password);
        if (error) {
            return { message: error }
        } else if (user) {
            // Après inscription, rediriger vers la page de connexion
            redirect("/auth/sign-in");
            return { message: undefined };
        }
        return { message: "Unexpected error" };
    }

    return (
        <SignUp action={action} />
    )
}

export default SignUpPage