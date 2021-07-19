import { Router } from 'express'
import personaRouter from './personaController.js'
import userRouter from './userController.js'

const apiRouter = Router()

apiRouter.use('/persona', personaRouter)
apiRouter.use('/user', userRouter)

export default apiRouter
