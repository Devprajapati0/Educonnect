import mongoose, { model, Schema } from 'mongoose';

const institutionSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['school', 'other', 'university'],
    required: true,
    default: 'university'
  },
  password: {
    type: String,
    required: true
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
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  admin:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

}); 

export const Institution = mongoose.models.Institution || model('Institution', institutionSchema);
 