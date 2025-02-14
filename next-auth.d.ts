import { DefaultSession } from "next-auth";

declare module "next-auth" {
    // Define Interface
    interface Session {
        user :{
            id:string;

        } & DefaultSession["user"]
    }
}