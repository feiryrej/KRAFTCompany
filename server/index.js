import express from "express";
import cors from 'cors'
import { adminRouter } from "./routes/AdminRoute.js"

const app = express() 

// Setting up CORS middleware to allow requests from http://localhost:5173
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use('/auth', adminRouter)

// Starting the server on port 3000
app.listen(3000, () => {
    console.log("Server is running")
})