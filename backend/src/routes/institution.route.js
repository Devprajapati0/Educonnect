import {Router} from 'express';
import { uniqueInstitutionSubdomain,institutionSignup,checkOutSession,checkoutSuccess,institutionLogin,instituteLogout,instituteProfile,updateProfile } from '../controllers/institution.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import instituteAuthenticator from '../middlewares/institute.middleware.js';

const router = Router({ mergeParams: true });

router.route('/unique-subdomain').post(uniqueInstitutionSubdomain);
router.route('/checkout-session').post(checkOutSession);
router.route('/checkout-success').post(checkoutSuccess);
router.route('/signup-institution').post(upload.single('logo'),institutionSignup);
router.route('/login-institution').post(institutionLogin);
router.route('/logout-institution').post(instituteAuthenticator,instituteLogout);
router.route('/profile').get(instituteAuthenticator,instituteProfile);
router.route('/update-profile').put(instituteAuthenticator,upload.single('logo'),updateProfile);

export default router;