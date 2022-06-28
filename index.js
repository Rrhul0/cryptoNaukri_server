import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
dotenv.config()

const uri = `mongodb+srv://MONGO14:${process.env.MONGO_DB_PASSWORD}@test.pty3p.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.post('/signup', async (req, res) => {
    const data = req.body
    console.log(data)
    if (!data) {
        res.statusCode(204)
        res.send('No Data Provied')
        return
    }
    try {
        await client.connect()
        const collection = client.db('cryptonaukri').collection('users')
        collection.insertOne(data)

        res.send('User Created')

        await client.db('admin').command({ ping: 1 })
    } finally {
        await client.close()
        return
    }
})
app.get('/test', (req, res) => {
    res.send('App is working')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
