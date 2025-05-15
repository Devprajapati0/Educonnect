import {Router} from 'express';
import {userSignup,loginUser,updatePublicKey, updateUserPasssword,updateUserProfile,getUserProfile, getAllUsersBasedOnRole,getUserForGroups,getPublicKey,getAllUsersForAdmin,deleteUser,getDashboardStats,logoutUser} from '../controllers/user.controller.js';
import {createGroupChat,getChatDetails,updateChatDetail,getMyChats,exitGroup,deleteChat,deleteanyChatForAdmin,getAllChatsOfAllUsers,removeMemeberFromGroupChat} from '../controllers/chat.controller.js';
import { getIndividualMessageController,getChatMediaController} from '../controllers/message.controller.js';
import {getAdminsAndStudents,submitComplaint,getMyComplaints,resolveComplaint,getComplaintsAssignedToMe} from "../controllers/complain.controller.js"
import { upload } from '../middlewares/multer.middleware.js';
import userAuthenticator from '../middlewares/jwt.middleware.js';

const router = Router({ mergeParams: true });
//users
router.route('/register').post(userAuthenticator,upload.single('avatar'),userSignup);
router.route('/login').post(loginUser)
router.route('/updatePublicKey').post(updatePublicKey);
router.route('/forgot-password').put(updateUserPasssword);
router.route('/get-all-users').get(userAuthenticator,getAllUsersBasedOnRole)
router.route('/get-user-for-group').get(userAuthenticator,getUserForGroups);
router.route('/get-user-profile').get(userAuthenticator,getUserProfile);
router.route('/update-user-profile').post(userAuthenticator,updateUserProfile);
router.route('/get-public-key').post(userAuthenticator,getPublicKey);
router.route('/get-all-users-for-admin').get(userAuthenticator,getAllUsersForAdmin);
router.route('/delete-user').post(userAuthenticator,deleteUser);
router.route('/get-dashboard-stats').get(userAuthenticator,getDashboardStats);
router.route('/logout').get(userAuthenticator,logoutUser);


//chat
router.route('/create-group-chat').post(userAuthenticator,upload.single('avatar'),createGroupChat);
router.route('/get-my-chats').get(userAuthenticator,getMyChats);
router.route('/getchat/:chatId').get(userAuthenticator,getChatDetails)
router.route('/update-chat').post(userAuthenticator,updateChatDetail);
router.route('/exit-group').post(userAuthenticator,exitGroup);
router.route('/delete-chat').post(userAuthenticator,deleteChat);
router.route('/delete-any-chat').post(userAuthenticator,deleteanyChatForAdmin);
router.route('/get-all-chats-of-all-users').get(userAuthenticator,getAllChatsOfAllUsers);
router.route('/remove-member').post(userAuthenticator,removeMemeberFromGroupChat);


//message
router.route('/get-all-messages/:chatId').get(userAuthenticator,getIndividualMessageController);
router.route('/get-chat-media').post(userAuthenticator,getChatMediaController);

//complain
router.route('/submit-complaint').post(userAuthenticator,upload.single('attachment'),submitComplaint);
router.route('/get-my-complaints').get(userAuthenticator,getMyComplaints);
router.route('/get-complaints-assigned-to-me').get(userAuthenticator,getComplaintsAssignedToMe);
router.route('/resolve-complaint').post(userAuthenticator,resolveComplaint);
router.route('/get-admins-and-students').get(userAuthenticator,getAdminsAndStudents);


export default router;
