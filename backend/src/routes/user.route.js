import {Router} from 'express';
import {userSignup,loginUser,updatePublicKey, updateUserPasssword, getAllUsersBasedOnRole,getUserForGroups} from '../controllers/user.controller.js';
import {createGroupChat,getChatDetails,getMyChats} from '../controllers/chat.controller.js';
import { sendMessageController,getIndividualMessageController} from '../controllers/message.controller.js';
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

//chat
router.route('/create-group-chat').post(userAuthenticator,upload.single('avatar'),createGroupChat);
router.route('/get-my-chats').get(userAuthenticator,getMyChats);
router.route('/getchat/:chatId').get(userAuthenticator,getChatDetails)

//message
// router.route('/send-message').post(userAuthenticator,
//     upload.array('attachments', 10)
//     ,sendMessageController);
router.route('/get-all-messages/:chatId').get(userAuthenticator,getIndividualMessageController);

export default router;
