import express from 'express'
import * as supervisorController from '../controllers/supervisor.controller.js'
import protect from '../middleware/protect.js'

const supervisorRouter = express.Router()

supervisorRouter.post('/add-worker', protect, supervisorController.addWorker)
supervisorRouter.patch('/edit-worker/:workerId', protect, supervisorController.editWorker)
supervisorRouter.delete('/delete-worker', protect, supervisorController.deleteWorker)
supervisorRouter.get('/all-workers', protect, supervisorController.viewWorker)
supervisorRouter.post('/checkIn-worker', protect, supervisorController.checkInWorker)
supervisorRouter.patch('/checkOut-worker', protect, supervisorController.checkOutWorker)

export default supervisorRouter