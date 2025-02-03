import express from 'express'
import * as seller from '../controllers/seller.controller'
import { verifyToken } from '../middleware/verifyToken'
import { verifyRefresh } from '../middleware/verifyRefershToken'

const router = express.Router()

router.post('/signUp', seller.signUpSeller )
router.post('/login', seller.loginSeller)

//  twofa
router.post('/verifyTwofa', seller.twoFa)
//  login using mobile
router.post('/verifyMobileOTP', seller.verifyMobileOTP)

router.post('/refresh' ,verifyRefresh , seller.refresh)

router.put('/changePassword', verifyToken , seller.changePassword)

router.post('/generateForgetPasswordOTP' , seller.generateForgetPasswordOTP )

router.post('/verifyforgetEmailOTP', seller.verifyforgetEmailOTP)
router.post('/verifyForgetMobileOTP' , seller.verifyforgetMobileOTP )

router.put('/newPassword' , seller.generateNewPassword)



export default router