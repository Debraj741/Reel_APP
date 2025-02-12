import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;

if(!MONGODB_URL){
    throw new Error("Database Url Not Found. Please check ENV File!!")
}

// Check Already Database connection established or not?

// Global is a global object accessed anywhere but declare its variable by own

let cached = global.mongoose

// Not have connection then Declare conn and promise as null
if(!cached){
    cached = global.mongoose = {conn:null,promise:null}
}

export async function ConnectDB() {
    // Already have connection
    if(cached.conn){
        return cached.conn;
    }

    // If not have conn and not run Promise
    if(!cached.promise){
        const opt = {

            // bufferCommands -> Defines How mongoose handel database operation when the database connection is not yet established. "true"-> Queue all operation one by one, 'false'-> Not queue any operation till database not connected.

            bufferCommands : true,


            // maxPoolSize -> Define how many database connection done at a time

            maxPoolSize : 10
        }

        // Create New Connection Request

        cached.promise = mongoose
        .connect(MONGODB_URL,opt)
        .then(()=> mongoose.connection)
    }

    // Send Connection request already means promise is under process

    try {
        cached.conn = await cached.promise
    } catch (error) {

        // Remove Promise of cached first then through error
        cached.promise = null

        throw new Error("Failed to Connect DB!!")
    }


    return cached.conn;
}