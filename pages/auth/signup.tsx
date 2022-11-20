import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { logger } from "../../lib/logger";

export default function SignupCard() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    async function onSubmit(values) {
        try {
            const body = { ...values };
            console.log(`POSTing ${JSON.stringify(body, null, 2)}`);
            const res = await fetch(`/api/users/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            logger.debug('res ', res);
            reset();
            router.push(`signin${router.query.callbackUrl ? `?callbackUrl=${router.query.callbackUrl}`: " "}`)
        } catch (error) {
            setErrorMessage(error);
        }
    }

    return (
        <section>
            <div>
                {errorMessage}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" {...register("name")} required/>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" {...register("email")} required/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type={showPassword? "text": "password"} {...register("password")} required/>
                        <button type="button" onClick={() => setShowPassword(
                            (showPassword) =>!showPassword
                        )}>{ showPassword? "hidden" : "show" }</button>
                    </div>
                    {/* {router.query.error &&
                    router.query.error === "CredentialsSignin" && (
                      <p>Invalid credentials</p>
                    )} */}
                    <button type="submit">Sign Up</button>
                    <p>Already a user ? </p>
                    <a href="singin"> Sign In</a>
                </form>
            </div>
        </section>
    )
}