import {MongoClient} from 'mongodb'

const mongoURI = process.env.mongoURI || "mongodb://0.0.0.0:27017/";

export const client = new MongoClient(mongoURI)

export async function runDb() {
    try {
        await client.connect()
        await client.db('HW').command({ping: 1})
        console.log('Connected successfully to mongo server')
    } catch (e) {
        console.log('Cant connect to mongo server')
        await client.close()
    }
}