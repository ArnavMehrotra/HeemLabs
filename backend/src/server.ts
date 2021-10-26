import express from "express"
import {MongoClient, ObjectId} from "mongodb"
import dotenv from "dotenv"
import { resolve } from "path/posix"

//configuration for environment variables
dotenv.config({path: resolve(__dirname, '.env')})

//connect to db and handle requests
const app = express()
MongoClient.connect(process.env.MONGOSTRING as string)
    .then(client => {
        const db = client.db("displayDB")
        const col = db.collection("storeCollection")
        console.log(`${col.dbName}`)
        
        //post request for adding a store to db
        app.post("/addStore", async (req, res) => {
            //TODO: strict error handling
            const store = req.query.s
            const inv = parseInt(req.query.i as string)
            const loc = req.query.l
            const phNum = req.query.ph

            const out = await col.insertOne({
                Store : store,
                Inventory: inv,
                Address: loc,
                PhoneNumber: phNum
            });
            res.send(out.insertedId)
        })

        //post request for updating store inventory
        app.post("/updateStore", (req, res) =>{
            //TODO: strict error handling
            const id = new ObjectId(req.query.id as string)
            const inv = parseInt(req.query.inv as string)

            col.updateOne({_id: id}, {$set: {Inventory: inv}})
            res.send("success")
        })

        //(untested) request for getting stores
        app.get("/getStores", async (_,res)=>{ 
            //TODO: test and error handling
            const arr = await col.find().toArray()
            console.log(arr)
            res.send("good")
        })
})

//server listens on port from env file
app.listen(process.env.PORT, () =>{
    console.log(`listening on port ${process.env.PORT}`)
})


