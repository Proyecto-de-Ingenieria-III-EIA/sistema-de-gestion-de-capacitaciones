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
    const user = await db.user.findUnique({
        where: { email: authData.email },
        select: { role: { select: { name: true } } },
    });

    if (!user || !allowedRoles.includes(user.role.name)) {
        throw new Error('Not authorized');
    }
    
}