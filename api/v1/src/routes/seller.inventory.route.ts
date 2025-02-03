import express from 'express'
import { verifyToken } from '../middleware/verifyToken'
import * as Inventory from '../controllers/seller.controller'

const router = express.Router()

router.use(verifyToken)

router.post('/addProduct' ,Inventory.addInventory  )

router.post('')




export default router