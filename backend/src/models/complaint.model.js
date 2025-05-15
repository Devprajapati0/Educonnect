import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User model (student/teacher/parent)
    required: true,
  },
  toAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming admins are also in the User model
    required: true,
  },
  referToStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional reference to a student
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
 institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution', // assuming you have an Institution model
        required: true,
    },
  attachment: {
    type: String, // cloud URL or file path if needed
  },
}, { timestamps: true });

export const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
