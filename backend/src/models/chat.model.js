import mongoose, { model, Schema } from 'mongoose';

const chatSchema = new Schema({
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  avatar:{
    type: String,
    default: null,
  },
  addmembersallowed:{
    type: Boolean,
    default: false,
  },
  sendmessageallowed:{
    type: Boolean,
    default: false,
  },
  isAdmin:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId
      },
      publicKey: {
        type: String,
        default: null,
      },
    },
  ],
  groupchat: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Chat = mongoose.models.Chat || model('Chat', chatSchema);