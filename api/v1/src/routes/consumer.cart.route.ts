import express from 'express'
import * as consumerCart from '../controllers/consumer.controller'
import { verifyToken } from '../middleware/verifyToken'

const router = express.Router()

router.use(verifyToken)

router.get('/' ,  consumerCart.inventoryDetail)

router.get('/cartInfo', consumerCart.cartItem)
router.post('/addToCart' ,  consumerCart.addToCart)
router.put('/removeFromCart', consumerCart.removeFromCart)

export default router