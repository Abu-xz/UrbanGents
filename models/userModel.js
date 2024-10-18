import mongoose from 'mongoose';

const userSchema =new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    }
},
{timestamps:true});

const Users = mongoose.model('Users', userSchema);

export default Users;