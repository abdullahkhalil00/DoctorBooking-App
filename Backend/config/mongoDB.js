import mongoose from 'mongoose'

const connectionToMongoDB = async () =>{
    mongoose.connection.on('connected' ,() => console.log("Data base Connected") )
    await mongoose.connect(process.env.MONGODBURL)
}

export default connectionToMongoDB