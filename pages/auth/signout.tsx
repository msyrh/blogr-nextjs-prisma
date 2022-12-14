import { GetStaticProps } from "next";
import { signOut } from "next-auth/react";
import { logger } from "../../lib/logger";

interface Props{
    callbackUrl: string;
}
export default function logout({ callbackUrl }: Props) {
    logger.debug('callbackUrl');
    logger.debug(callbackUrl);
    signOut({ callbackUrl });
    return <div></div>;
}

export const getStaticProps = async (context: GetStaticProps) => ({
    props:{callbackUrl:process.env.NEXTAUTH_URL},
})