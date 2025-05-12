import {Router} from 'express';
import {userSignup,loginUser,updatePublicKey, updateUserPasssword,updateUserProfile,getUserProfile, getAllUsersBasedOnRole,getUserForGroups,getPublicKey} from '../controllers/user.controller.js';
import {createGroupChat,getChatDetails,updateChatDetail,getMyChats,exitGroup} from '../controllers/chat.controller.js';
import { getIndividualMessageController,getChatMediaController} from '../controllers/message.controller.js';
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


//chat
router.route('/create-group-chat').post(userAuthenticator,upload.single('avatar'),createGroupChat);
router.route('/get-my-chats').get(userAuthenticator,getMyChats);
router.route('/getchat/:chatId').get(userAuthenticator,getChatDetails)
router.route('/update-chat').post(userAuthenticator,updateChatDetail);
router.route('/exit-group').post(userAuthenticator,exitGroup);

//message
router.route('/get-all-messages/:chatId').get(userAuthenticator,getIndividualMessageController);
router.route('/get-chat-media').post(userAuthenticator,getChatMediaController);

export default router;
