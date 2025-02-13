import express from 'express'
import * as adminController from '../controllers/admin.controller'

const router = express.Router()


router.post('/addCategory', adminController.addCategory )




export default router