const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

const userRoutes = require('./routes/user')

const port = process.env.PORT || 3000


//middleware
app.use(express.json())
app.use('/api', userRoutes)


mongoose
    .connect(process.env.MONGODB_CONECT)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((err) => console.error(err))



app.listen(port, () => {
    console.log(`Corriendo en el prueto ${port}`)
})