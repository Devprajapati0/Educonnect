import mongoose, { Schema, model } from "mongoose";


const AttachmentSchema = new Schema({
    url: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['image', 'videos',"video", 'raw'],
      required: true,
    },
  });

const messageSchema = new Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
      },
      content: {
        type: String,
        trim: true,
      },
      attachments: [AttachmentSchema],
    },
    { timestamps: true }
  );
  
  export const Message = mongoose.models.Message || model("Message", messageSchema);
  