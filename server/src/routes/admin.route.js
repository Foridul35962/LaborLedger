import express from 'express'
import * as adminController from '../controllers/admin.controller.js'
import protectAdmin from '../middleware/protectAdmin.js'
import upload from '../middleware/upload.js'

const adminRouter = express.Router()

adminRouter.get('/supervisors', protectAdmin, adminController.getAllSupervisor)
adminRouter.post('/add-supervisor', protectAdmin, upload, adminController.addSupervisor)
adminRouter.patch('/edit-supervisor', protectAdmin, upload, adminController.editSupervisor)
adminRouter.delete('/delete-supervisor/:supervisorId', protectAdmin, adminController.deleteSupervisor)

export default adminRouter