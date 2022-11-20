import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { logger } from "../../lib/logger";

export default function SimpleCard() {
    const [showPassword, setShowPassword] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    let defaultBody = {
        grant_type: "",
        username: "example@gmail.com",
        password: "example",
        scope: "",
        client_id: "",
        client_secret:"",
    }

    async function onSubmit(values) {
        try {
            const body = { ...defaultBody, ...values };
            console.log(`POSTing ${JSON.stringify(body, null, 2)}`);
            let res = await signIn("credentials", {
                ...body,
                callbackUrl: router.query.callbackUrl,
            });
            logger.debug(`signing:onsubmite:res`, res);
        } catch (error) {
            logger.error(error);
        }
    }

    if (status === "authenticated") {
        router.push("/", {
            query: {
                callbackUrl:router.query.callbackUrl,
            }
        })
    }

    return (
        <section>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" {...register("username")} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type={showPassword? "text": "password"} {...register("password")} />
                        <button type="button" onClick={() => setShowPassword(
                            (showPassword) =>!showPassword
                        )}>{ showPassword?  "hidden" :"show"}</button>
                    </div>
                    {/* {router.query.error &&
                    router.query.error === "CredentialsSignin" && (
                      <p>Invalid credentials</p>
                    )} */}
                    <div>
                        <input type="checkbox" /> Remember Me
                    </div>
                    <button type="submit">Sign In</button>
                    <a href={`signup${router.query.callbackUrl ? `?callbackUrl=${router.query.callbackUrl}` : " "}`}> Register </a>
                </form>
            </div>
            <div className="">
                <button onClick={() => signIn("github", {
                    callbackUrl: router.query.callbackUrl.toString(),
                })}> Github </button>
            </div>
        </section>
    )
}
