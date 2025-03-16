//Revisar roles

import { AuthData, Context } from "@/types";
import { PrismaClient } from "@prisma/client";




export const validateRole = async (
    db: PrismaClient,
    authData: AuthData,
    allowedRoles: string[]
) => {

    if(!authData) {
        throw new Error('Not authorized');
    }

    //llamar al rol de usuario desde la bd
    if(!allowedRoles.includes(authData.role)) {
        throw new Error('Not authorized');
    }
    
}