import express  from "express";
import * as consumerController from '../controllers/consumer.controller'
import { verifyToken } from "../middleware/verifyToken";
import { verifyRefresh } from "../middleware/verifyRefershToken";

const router = express.Router()

router.post('/signUp' , consumerController.signUp )
router.post('/login' , consumerController.Login)

router.post('/verifyTwofa' , consumerController.verifyTwofa)
router.post('/refresh' , verifyRefresh , consumerController.refresh)

router.post('/verifyMobileOTP', consumerController.verifyMobileOTP)

router.put('/changePassword', verifyToken , consumerController.changePassword)

router.post('/generateForgetPasswordOTP' , consumerController.generateForgetPasswordOTP )

router.post('/verifyforgetEmailOTP', consumerController.verifyforgetEmailOTP)
router.post('/verifyForgetMobileOTP' , consumerController.verifyforgetMobileOTP )

router.put('/newPassword' , consumerController.generateNewPassword)






export default router