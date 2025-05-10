import mongoose, { model, Schema } from 'mongoose';

const chatSchema = new Schema({
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  creator: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'parent','teacher','student'],
      default: 'student',
    },
    fullname: {
      type: String,
      default: null,
    },
  },
  avatar: {
    type: String,
    default: null,
  },
  addmembersallowed: {
    type: Boolean,
    default: false,
  },
  sendmessageallowed: {
    type: Boolean,
    default: false,
  },
  isAdmin: [
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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      publicKey: {
        type: String,
        default: null,
      },
      role: {
        type: String,
        enum:  ['admin', 'parent','teacher','student'],
        default: 'user',
      },
      name: {
        type: String,
        default: null,
      },
      avatar: {
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
  description: {
    type: String,
    default: null,
  },
});

export const Chat = mongoose.models.Chat || model('Chat', chatSchema);