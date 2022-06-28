import express, { response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import crypto from 'crypto'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
dotenv.config()

const uri = `mongodb+srv://MONGO14:${process.env.MONGO_DB_PASSWORD}@test.pty3p.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.post('/signup', async (req, res) => {
    const data = req.body
    if (!data) {
        res.statusCode(204)
        res.send('No Data Provied')
        return
    }
    const password = data.password
    if (!password) {
        res.statusCode(204)
        res.send('No Password Provied')
        return
    } else {
        const salt = crypto.randomBytes(16).toString('hex')
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
        data.salt = salt
        data.hash = hash
        delete data.password
    }
    console.log(data)
    try {
        await client.connect()
        const collection = client.db('cryptonaukri').collection('users')
        await collection.insertOne(data)

        res.send('User Created')

        await client.db('admin').command({ ping: 1 })
    } finally {
        await client.close()
        return
    }
})

app.post('/check-email', async (req, res) => {
    const email = req.body.email
    if (!email) {
        res.sendStatus(204)
        res.send('No Data Provided')
        return
    }
    try {
        await client.connect()
        const collection = client.db('cryptonaukri').collection('users')
        const remail = await collection.findOne({ email })
        if (!remail) {
            res.sendStatus(200)
            res.send('Not match with db emails')
        } else {
            res.sendStatus(203)
            res.send('matched with db emails, cant use')
        }
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
