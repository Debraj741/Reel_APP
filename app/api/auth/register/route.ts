import { NextRequest,NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request:NextRequest) {
    try {
        const {email,password} = await request.json()

        // If email or password not given by user
        if(!email || !password){
            return NextResponse.json(
                {error:"Email and Password are Required!!"},
                {status:400}
            )
        }

        // Already registered or not / HAve entry in Database or not?

        await ConnectDB() //Connect DB

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error:"Email is already Registered!!"},
                {status:400}
            )
        }

        // Create new user
        await User.create({
            email,
            password
        })

        return NextResponse.json(
            {message:"User Created Successfully!!"},
            {status:201}
        )

    } catch (error) {
        return NextResponse.json(
            {error:"Failed to Register User!!"},
            {status:500}
        )
    }
}