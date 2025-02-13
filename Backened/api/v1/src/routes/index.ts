import express from "express";
import consumer from './cosumer.route'
import admin from './admin.route'
import seller from './seller.route'
import ratelimiter from "../middleware/ratelimiter";

const router = express.Router()

router.use('/consumer' , ratelimiter(100 ,1), consumer)

router.use('/admin' ,  ratelimiter(100 , 1), admin )


router.use('/seller', ratelimiter(100 , 2), seller) 







export default router