import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//routes


app.get('/', (req, res) => {
    res.send('LaborLedge server is running ...')
})

export default app