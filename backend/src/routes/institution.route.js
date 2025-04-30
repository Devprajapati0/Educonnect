import {Router} from 'express';
import { uniqueInstitutionSubdomain,institutionSignup,checkOutSession,checkoutSuccess,institutionLogin } from '../controllers/institution.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/unique-subdomain').post(uniqueInstitutionSubdomain);
router.route('/checkout-session').post(checkOutSession);
router.route('/checkout-success').post(checkoutSuccess);
router.route('/signup-institution').post(upload.single('logo'),institutionSignup);
router.route('/login-institution').post(institutionLogin);

export default router;