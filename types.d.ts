import { Connection } from "mongoose";

declare global{
    var mongoose:{
        conn : Connection | null     // Varaible conn -> Type (Connection [mongoose define])
        promise: Promise<Connection> | null
    }
}

export {}