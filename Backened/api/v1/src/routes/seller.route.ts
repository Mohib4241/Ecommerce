import express from 'express'
import authSeller from './seller.auth.route'
import sellerInventory from './seller.inventory.route'

export const router = express.Router()

router.use('/auth', authSeller )
router.use('/inventory' , sellerInventory)




export default router