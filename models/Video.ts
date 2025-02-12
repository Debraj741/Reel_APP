import mongoose, { model, models, Schema } from "mongoose";

// Fixed dimension video
export const VIDEO_DIMENSION = {
    width : 1080,
    height : 1920
} as const

export interface VideoInterface {
    _id?:mongoose.Types.ObjectId;
    title:string;
    description:string;
    videoUrl:string;
    thumbnailUrl:string;
    controls?:boolean;
    transformation?:{
        height:number;
        width:number;
        quality?:number;
    },
    createdAt?:Date;
    updatedAt?:Date;
}

const videoSchema = new Schema<VideoInterface>(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        videoUrl:{
            type:String,
            required:true
        },
        thumbnailUrl:{
            type:String,
            required:true
        },
        controls:{
            type:Boolean,
            default:true
        },
        transformation:{
            height:{type:Number,default:VIDEO_DIMENSION.height},
            width:{type:Number,default:VIDEO_DIMENSION.width},
            quality:{type:Number, min:1, max:100}
        } 
        
    },{timestamps:true}
)


// As nextJs run in edge so there might possible that schema is already created so I have to handel this case also. [models -> mongoose give all models to find], [model == mongoose.model]

const Video = models?.Video || model<VideoInterface>("Video",videoSchema)

export default Video;