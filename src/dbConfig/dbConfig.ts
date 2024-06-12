import mongoose from "mongoose";

export async function dbConnect(){
    try{
        mongoose.connect(process.env.MONGO_URL!)
        const connection=mongoose.connection;

        connection.on('connected',()=>{
            console.log('MongodB connected');
        })

        connection.on('error',(err)=>{
            console.log('Mongodb connection error'+ err)
            process.exit();
        })

    }catch(error){
        console.log("something went wrong while connecting to DB")
    }
}