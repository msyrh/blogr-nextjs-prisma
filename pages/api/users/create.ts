import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import sha256 from "crypto-js/sha256";
import { logger } from "../../../lib/logger";
import { Prisma } from "@prisma/client";

export default async function handle(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === "POST") {
        await handlePOST(res, req);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
} 

const hashPassword = (password: string) => {
    return sha256(password).toString();
}

// POST /api/user
async function handlePOST(res, req) {
    logger.debug("creating user", {
        ...req.body,
        password: hashPassword(req.body.password)
    });

    try {
        const user = await prisma.user.create({
            data: { ...req.body, password: hashPassword(req.body.password) }
        });
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (error.code === 'P2002') {
              console.log(
                'There is a unique constraint violation, a new user cannot be created with this email'
              )
            }
        }
        return res.status(500).json(error);
    }
    
    
}