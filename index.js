/* // ----------------------------------
// mongo setup
// ----------------------------------
const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://dbUser:0000@cluster0.zypj9.mongodb.net/college?retryWrites=true&w=majority"

const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true}


// add your table schemas
const Schema = mongoose.Schema

const ItemSchema = new Schema({
   name:String
   rarity:String
   description:String
   goldPerTurn:int
})
const Item = mongoose.model("item_table", ItemSchema) */

// ----------------------------------
// express setup
// ----------------------------------
const express = require("express");
const app = express();
app.use(express.json())
const HTTP_PORT = process.env.PORT || 8080;
 

 
// list of url endpoints that your server will respond to
app.get("/", (req, res) => {
 res.send("Hello World!");
});

// ----------------------------------
// Url endpoints
// ----------------------------------
// GET ALL
app.get("/api/items", (req, res) => {
    // 1. search the database for students and return them
    Item.find().exec().then(
        (results) => {
            console.log(results)
            res.send(results)
        }
    ).catch(
        (err) => {
            console.log(error)
            res.status(500).send("Error when getting items from database.")
        }
    )
    
})

// GET BY NAME
// localhost:8080/items/Magpie
app.get("/api/items/:item_name", (req,res) => {
    // console.log(`Searching for: ${req.params.sid}`)

})

// INSERT 
app.post("/api/items", (req, res) => {

    // 1. what did the client send us
    // - what data does the client want us insert into the database
    console.log("I received this from the client:")
    console.log(req.body)
    
    // 2. Take that information and CREATE someone in your database!
    // - mongoose

    Item.create(req.body).then(
        (result) => {
            //javascript
            console.log("Create success!")
            console.log(result)
            // express
            res.status(201).send("Insert success!")
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when getting items from database."
            }
            res.status(500).send(msg)
        }
    )
    //  Item.create() 
})

// UPDATE BY ID
app.put("/api/items/:item_id", (req,res) => {

    // 1. you need a way to retrieve which record you want to update
    // (id)

    console.log(`Person wants to update: ${req.params.sid}`)
    
    // 2. you need a way to figure out WHAT should be updated
    console.log(`What should the new updated data be?`)
    console.log(req.body)

    // 3. Call the databse and make the update

    // parameter 1: The record you want to update (it will search the db for the person with the specified id)
    // parameter 2: A JSON object containing the information you want to update your record to    
    // parameter 3: {new:true} --> Tells Mongo to send you back a copy of the updated record
    Item.findOneAndUpdate({_id:req.params.sid},req.body,{new:true}).exec().then(
        (updatedItem) => {
            if (updatedItem === null) {
                console.log("Could not find the item to update.")   
                res.status(404).send("Could not find the item to update.")
            }
            else {
                console.log(updatedItem)
                res.status(200).send(updatedItem)
            }
        }
    ).catch(
        (err) => {
            console.log(err)   
            res.status(500).send("Error with the update")  
        }
    )
})


// DELETE BY ID
app.delete("/api/items/:item_name", (req,res) => {
    res.status(501).send("Not implemented")  

    // @TODO:
    // 1. Get the id of the student you want to delete from the request params
    // 2. Send the id to the database
    // - Use the mongoose Item.findByIdAndDelete
    // Item.findByIdAndDelete("sdfsdf").exec().then(
    //     (deletedItem) => {
    //         if (deletedItem === null) {           
    //             console.log("Could not find an item to delete")
    //         }
    //         else {
    //             console.log(deletedItem)
    //         }
    //     }
    // ).catch(
    //     (err) => {
    //         console.log(err)
    //     }
    // )
})
 
// ----------------------------------
// start server
// ----------------------------------
const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}


// 1. connect to the databas
// 2. AFTER you successfully connect, that you start he expres server
mongoose.connect(mongoURL, connectionOptions).then(
    () => {
         console.log("Connection success")
         app.listen(HTTP_PORT, onHttpStart); 
    }
 ).catch(
    (err) => {
        console.log("Error connecting to database")
        console.log(err)
    }
)