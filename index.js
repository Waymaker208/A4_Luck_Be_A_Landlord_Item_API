// ----------------------------------
// mongo setup
// ----------------------------------
const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://dbUser:0000@clustera4.gg5ii.mongodb.net/A4?retryWrites=true&w=majority"

const connectionOptions = {useNewUrlParser: true, useUnifiedTopology: true}


// add your table schemas
const Schema = mongoose.Schema

const ItemSchema = new Schema({
   name:String,
   rarity:String,
   description:String,
   goldPerTurn:Number
})
const Item = mongoose.model("item_table", ItemSchema)

// ----------------------------------
// express setup
// ----------------------------------
const express = require("express");
const app = express();
app.use(express.json())
const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
 res.send("Hello World!");
});

// ----------------------------------
// Url endpoints
// ----------------------------------

// GET ALL
app.get("/api/items", (req, res) => {
    Item.find().exec().then(
        (results) => {
            console.log(results)
            res.send(results)
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
})

// GET ONE
app.get("/api/items/:item_name", (req, res) => {
    console.log(`Searching for: ${req.params.item_name}`)

    Item.findOne({name:req.params.item_name}).exec().then(
        (result) => {
            if (result) {
                console.log(result)
                res.status(200).send(result)
            }
            else {
                console.log(result)
                const msg = {
                    statusCode:404,
                    msg: "Item not Found!"
                }
                console.log(msg)
                res.status(404).send(msg)
            }
        }
   ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when getting item from database."
            }
            res.status(500).send(msg)
        }
    )
})

// INSERT 
app.post("/api/items", (req, res) => {

    console.log("I received this from the client:")
    console.log(req.body)

    Item.create(req.body).then(
        (result) => {
            const msg = {
                statusCode:201,
                msg: "Create/Insert success!"
            }
            console.log(msg)
            res.status(201).send(msg)
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when Creating/Inserting item into database."
            }
            res.status(500).send(msg)
        }
    )
})

// UPDATE BY ID
app.put("/api/items/:item_id", (req,res) => {

    const msg = {
        statusCode:501,
        msg: "The requested endpoint is currently not available, but may be implemented in the future."
    }
    console.log(msg)
    res.status(501).send(msg)

})

// DELETE BY NAME
app.delete("/api/items/:item_name", (req,res) => {

    console.log(`Item to Delete: ${req.params.item_name}`)
    // 2. Send the id to the database
    // - Use the mongoose Item.findByIdAndDelete

    Item.findOneAndDelete({name:req.params.item_name}).exec().then(
        (deletedItem) => {
            if (deletedItem === null) {
                const msg = {
                    statusCode:404,
                    msg: "Could not find an item to delete"
                }
                console.log(msg)
                res.status(404).send(msg)
            }
            else {
                console.log(deletedItem)
                const msg = {
                    statusCode:200,
                    msg: "Item deleted successfully"
                }
                console.log(msg)
                res.status(200).send(msg)
            }
        }
    ).catch(
        (err) => {
            console.log(`Error`)
            console.log(err)
            const msg = {
                statusCode:500,
                msg: "Error when Deleting item from database."
            }
            res.status(500).send(msg)
        }
    )
})
 
// ----------------------------------
// start server
// ----------------------------------
const onHttpStart = () => {
    console.log(`Server has started and is listening on port ${HTTP_PORT}`)
}

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