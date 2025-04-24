import mongoose,{model,Schema} from 'mongoose';                                                

const institutionSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        unique: true
    },
    shortname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    subscription: {
        plan: {
            type: String,
            default: 'free'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    logo: {
        type: String,
        required:false
    },
    createdAt:{
      type : Date,
      default : Date.now
    }
});

export const User = mongoose.models.Institution || model('Institution', institutionSchema);