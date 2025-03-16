import { AuthData } from "@/types";

export const validateAuth = async (authData: AuthData) => {
    if(!authData) {
        throw new Error('Not authorized');
    }
}