import mongoose, { model, Schema } from 'mongoose';

const subscriptionSchema = new Schema({
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
      type:{
        type:String,
        required:true,
      },
      email:{
        type: String,
        required: true,
      },
      name:{
        type: String,
        required: true,
      }
});

export const subscription = mongoose.models.subscription || model('subscription', subscriptionSchema);
