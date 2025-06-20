const mongoose = required('mongoose');
const { hashPassword } = required('../services/passwordService')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    }
}, { timestamps : true });

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);