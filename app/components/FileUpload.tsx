"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";

import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess : (res : IKUploadResponse)=> void;
    onProgress? : (progress : number) => void;
    fileType? : "image" | "video"

}


export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image"
} : FileUploadProps) {
  
    
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)


  const onError = (err:{message : string}) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false)
  };
  
  const handelSuccess = (res : IKUploadResponse) => {
    console.log("Success", res);
    setUploading(false)
    setError(null)
    onSuccess(res)
  };
  
  const onUploadProgress = (evt:ProgressEvent) => {
    if(evt.lengthComputable && onProgress){
        const parentComplete = (evt.loaded / evt.total) * 100;
        onProgress(Math.round(parentComplete));
    }
  };
  
  const onUploadStart = () => {
    setUploading(true)
    setError(null)
  };

  const FileValidate = (file:File) =>{
    if(fileType === "video"){
        if(!file.type.startsWith("video/")){
            setError("PLease Upload a Video File!!")
            return false;
        }
        if(file.size > 100 * 1024 * 1024){
            setError("Video must be less than 100 MB!!")
            return false
        }
    }
    else{
        const validImageType = ["image/jpeg","image/jpg","image/png"]
        if(!validImageType.includes(file.type)){
            setError("Please upload a valid File - [JPEG,JPG,PNG]")
            return false; 
        }
        if(file.size > 5 * 1024 * 1024){
            setError("Image must be less than 5 MB!!")
            return false
        }
    }
    return false
  }

  return (
    <div className="space-y-2">
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          useUniqueFileName={true}
          validateFile={FileValidate}
          folder= {fileType === "video" ? "/videos" : "/images"}
          accept={fileType === "video" ? "video/*" : "image/*"}
          className="file-input file-input-bordered w-full"
          onError={onError}
          onSuccess={handelSuccess}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
        />

        {uploading &&(
            <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="animate-spin w-4 h-4"/>
                <span>Uploading...</span>
            </div>
        )}

        {error && (
            <div className="text-error text-sm ">
                {error}
            </div>
        )}

    </div>
  );
}