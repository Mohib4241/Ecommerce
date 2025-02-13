import express from 'express'
import * as consumerOrder from 'src/controllers/consumer.controller'
import { verifyToken } from '../middleware/verifyToken'

const router = express.Router()

 
router.post('/place' ,verifyToken , consumerOrder.orderNow)
router.get('/history' , verifyToken , consumerOrder.OrderHistory)


export default router