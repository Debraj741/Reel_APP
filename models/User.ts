import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs"

// At first Define INTERFACE

export interface UserInterface {
    email:string;
    password:string;
    _id?:mongoose.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

const userSchema = new Schema<UserInterface>(
    {
        email:{
            type:String,
            required:true,
            unique: true
        },
        password:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)

// Hook -> Pre (Just before save in database)

// 1st time user creation -> encrypt handelled separetly , but if after any time user will change or modify password that time Run this hook as "password" field is modified.

userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})

// As nextJs run in edge so there might possible that schema is already created so I have to handel this case also. [models -> mongoose give all models to find], [model == mongoose.model]

const User = models?.User || model<UserInterface>("User",userSchema)

export default User;