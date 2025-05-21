// complaint.controller.js
import { apiresponse } from "../utils/apiresponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../helpers/cloudinary.js"
import { Complaint } from "../models/complaint.model.js"

// 1. Get all admins and students
const getAdminsAndStudents = async (req, res) => {
  try {
    if(!req.user || req.user.role !== "teacher") {
      return res.json(new apiresponse(403, null, "Unauthorized access"));
    }
    const data ={
        admin: [],
        student: []
    }
    const users = await User.find({
      role: { $in: ["admin", "student"] },
      "institution._id": req.user.institution._id,
    }).select("_id name role avatar email");
    if (!users || users.length === 0) {
      return res.json(new apiresponse(404, null, "No admins or students found"));
    }
    const admins = users.filter(user => user.role === "admin");
    const students = users.filter(user => user.role === "student");
    data.admin = admins;
    data.student = students;

    return res.json(new apiresponse(200, data, "Admins and students fetched successfully"));
  } catch (error) {
    console.error("getAdminsAndStudents error:", error);
    return res.json(new apiresponse(500, null, "Server error"));
  }
};
// complaint.controller.js


// 2. Submit a complaint (by teacher)
const submitComplaint = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.json(new apiresponse(403, null, "Unauthorized access"));
    }
    const { toAdmin, referToStudent, content, attachment } = req.body;

    if (!toAdmin || !content) {
      return res.json(new apiresponse(400, null, "Admin and content are required"));
    }
    let image = null;
    if(attachment){
        const url = await uploadOnCloudinary(attachment);
        if(!url){
            return res.json(new apiresponse(500, null, "Failed to upload attachment"));
        }
        image = url.url;
    }

    const complaint = await Complaint.create({
      content,
      toAdmin,
      referToStudent,
      submittedBy: req.user._id,
      institution: req.user.institution._id,
      attachment: image || null,
    });

    return res.json(new apiresponse(201, complaint, "Complaint submitted successfully"));
  } catch (error) {
    console.error("submitComplaint error:", error);
    return res.json(new apiresponse(500, null, "Failed to submit complaint"));
  }
};


const getMyComplaints = async (req, res) => {
    try {
      if (!req.user || req.user.role !== "teacher") {
        return res.json(new apiresponse(403, null, "Unauthorized access"));
      }
  
      const complaints = await Complaint.aggregate([
        {
          $match: {
            submittedBy: req.user._id,
            institution: req.user.institution._id,
          },
        },
        {
          $addFields: {
            statusPriority: {
              $cond: [{ $eq: ["$status", "pending"] }, 0, 1], // 0 for pending, 1 for others
            },
          },
        },
        {
          $sort: {
            statusPriority: 1, // pending first
            createdAt: -1,     // newest first within each group
          },
        },
      ]);
  
      if (!complaints || complaints.length === 0) {
        return res.json(new apiresponse(404, null, "No complaints found"));
      }
  
      // Populate manually since aggregation doesn't auto-populate
      const populatedComplaints = await Complaint.populate(complaints, [
        { path: "toAdmin", select: "name email role avatar" },
        { path: "referToStudent", select: "name avatar" },
      ]);
  
      return res.json(
        new apiresponse(200, populatedComplaints, "Complaints submitted by you fetched successfully")
      );
    } catch (error) {
      console.error("getMyComplaints error:", error);
      return res.json(new apiresponse(500, null, "Failed to fetch complaints"));
    }
  };

// 4. Admin: Accept or Reject a complaint
const resolveComplaint = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.json(new apiresponse(403, null, "Unauthorized access"));
    }
    const { complaintId, decision } = req.body;
    console.log("complaintId", complaintId);
    console.log("decision", decision);
    if (!complaintId || !decision) {
      return res.json(new apiresponse(400, null, "Complaint ID and decision are required"));
    }
    
    if (!['approved', 'rejected'].includes(decision)) {
      return res.json(new apiresponse(400, null, "Invalid decision"));
    }

    const complaint = await Complaint.findOne({
      _id: complaintId,
      toAdmin: req.user._id,
    });

    if (!complaint) {
      return res.json(new apiresponse(404, null, "Complaint not found or unauthorized"));
    }

    complaint.status = decision;
    await complaint.save();

    return res.json(new apiresponse(200, complaint, `Complaint ${decision}`));
  } catch (error) {
    console.error("resolveComplaint error:", error);
    return res.json(new apiresponse(500, null, "Failed to resolve complaint"));
  }
};

// 5. Get all complaints addressed to this admin
const getComplaintsAssignedToMe = async (req, res) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.json(new apiresponse(403, null, "Unauthorized access"));
      }
  
      const complaints = await Complaint.find({
        toAdmin: req.user._id,
        institution: req.user.institution._id,
      })
        .populate("submittedBy", "name email role avatar")
        .populate("referToStudent", "name avatar")
        .sort({
          // Custom order: Pending first (equivalent to 0), then sort by createdAt desc
          createdAt: -1, // recent first
        });
  
      // Sort manually: Pending first, then others by date
      const sortedComplaints = [
        ...complaints.filter(c => c.status === "Pending"),
        ...complaints.filter(c => c.status !== "Pending"),
      ];
  
      if (sortedComplaints.length === 0) {
        return res.json(new apiresponse(404, null, "No complaints assigned to you"));
      }
  
      return res.json(new apiresponse(200, sortedComplaints, "Complaints assigned to you fetched successfully"));
    } catch (error) {
      console.error("getComplaintsAssignedToMe error:", error);
      return res.json(new apiresponse(500, null, "Failed to fetch assigned complaints"));
    }
  };
export {
    getAdminsAndStudents,
    submitComplaint,
    getMyComplaints,
    resolveComplaint,
    getComplaintsAssignedToMe,
}