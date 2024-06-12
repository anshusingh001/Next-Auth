import { dbConnect } from "@/dbConfig/dbConfig";
import { getdatatoken } from "@/helpers/getdatatoken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function GET(request: NextRequest) {
    try {
        const userId=await getdatatoken(request);
        
        const user=await User.findOne({_id:userId}).select("-password")

        return NextResponse.json({
            message:"User data fetched successfully",
            success:true,
            data:user
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

