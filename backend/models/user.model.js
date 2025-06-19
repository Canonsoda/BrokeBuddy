import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    emailId:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: function(){
            return !this.googleId; // Phone number is required only if not using Google login
        },
        validate: {
        validator: function (v) {
            return v == '' || /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    password: {
    type: String,
    required: function () {
        return !this.googleId;
    },
    },
    googleId: {
    type: String,
    },
    roles: {
        type: String,
        enum: ['lender', 'borrower','both'],
        default: 'both'
    },
},{ timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
