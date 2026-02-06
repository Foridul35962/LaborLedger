import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// local import
import errorHandler from './helpers/ErrorHandler.js'
import adminRouter from './routes/admin.route.js'
import authRouter from './routes/auth.route.js'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//routes
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.get('/', (req, res) => {
    res.send('LaborLedge server is running ...')
})

//global error handler
app.use(errorHandler)

export default app