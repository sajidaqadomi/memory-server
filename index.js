import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'

import postRoutes from './routes/postsRoute.js';
import userRoutes from './routes/userRoute.js';

var app = express();
dotenv.config()

app.use(cors())
app.use(bodyParser.json({ limit: '30mb' }))

app.use('/posts', postRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.send('hello to memories api')
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true }).then(() => {
    app.listen(PORT, () => console.log(`server runing on Port ${PORT}`));
}).catch((err) => console.log(err))

