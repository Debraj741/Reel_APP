import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import { ConnectDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs"

export const authOptions : NextAuthOptions = {

    // Define Providers array

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials :{
                email: {label:"Email", type:"text"},
                password: {label:"Password", type:"password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing Email or Password!!")
                }

                // Log In Process
                try {
                    //Connect DB First

                    await ConnectDB()   

                    const existingUser = await User.findOne({email:credentials.email})
                    if(!existingUser){
                        throw new Error("User Not Found!!")
                    }

                    // Check password and then login

                    const isValid = await bcrypt.compare(credentials.password , existingUser.password)
                    if(!isValid){
                        throw new Error("Invalid Password!!")
                    }

                    // Returned thing will create as a Session of User
                    return{
                        id:existingUser._id.toString(),
                        email: existingUser.email
                    }
                } catch (error) {
                    throw error;
                }
            }
        })
    ],

    callbacks: {
        async jwt({token,user}){
            if(user){
                token.id = user.id
            }
            return token;
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session;
        }
    },

    pages:{
        signIn:"/login",
        error:"/login"
    },

    session:{
        strategy:"jwt",
        maxAge: 30*24*60*60
    },

    secret: process.env.NEXTAUTH_SECRET
}