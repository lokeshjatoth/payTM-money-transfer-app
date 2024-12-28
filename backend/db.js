const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected: ${connect.connection.host}`)
    } catch(error){
        console.log(`Error in connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}


connectDB();

const userSchema = new mongoose.Schema(
    {   
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 3,
            maxLength: 30
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
        
    }
);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account,
}; 