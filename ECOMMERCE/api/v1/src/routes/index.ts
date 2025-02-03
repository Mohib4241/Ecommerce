import express from "express";
import consumer from './cosumer.route'
import admin from './admin.route'
import seller from './seller.route'
import ratelimiter from "../middleware/ratelimiter";

const router = express.Router()

router.use('/consumer' , ratelimiter(2000 ,1), consumer)

router.use('/admin' ,  ratelimiter(2000 , 1), admin )


router.use('/seller', ratelimiter(3000 , 2), seller) 







export default router