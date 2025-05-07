import mongoose, { model, Schema } from 'mongoose';

const userSchema = new Schema({
  institution: {
    _id: {
            type: mongoose.Schema.Types.ObjectId
          },
    fullname: {
      type: String,
      required: true,
   },
    email: {
      type: String,
      required: true,
    },
    subdomain: {
      type: String,
      required: true,
    },
    subscription: {
      plan: {
        type: String,
        default: 'free',
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    logo: {
      type: String,
      required: false,
    },
  },
  rollnumber: {
    type: String,
    required: false,
    // default:Math.random(),,
    default:'0'
  },
  email:{
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  publicKey:{
    type: String,
    default: null,
    required: false,
  },
  parentofemail:{
    type:String,
    required: false,
  },
  parentofname:{
    type:String,
    required:false
  },
  department: {
    type: String,
    required: false,
  },
  batch:{
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || model('User', userSchema);
