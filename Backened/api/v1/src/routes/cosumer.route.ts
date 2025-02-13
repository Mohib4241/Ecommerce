import express from "express";
import consumerAuth from './consumer.auth.route'
import { verifyToken } from "../middleware/verifyToken";
import consumerCart from './consumer.cart.route'
import consumerOrder from './consumer.order.route'
// import 

const router = express.Router()

router.use('/auth', consumerAuth)
router.use('/inventory',  consumerCart)
router.use('/order',consumerOrder )


export default router