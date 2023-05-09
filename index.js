const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mzertuj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const chocolateCollection = client
      .db("chocolateDB")
      .collection("chocolates");

    // read data
    app.get("/chocolates", async (req, res) => {
      const result = await chocolateCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    // send specific data for update 1
    app.get("/updateChocolate/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollection.findOne(query);
      res.send(result);
    });

    // create data
    app.post("/chocolates", async (req, res) => {
      const updatedChocolate = req.body;
      console.log(updatedChocolate);
      const result = await chocolateCollection.insertOne(updatedChocolate);
      res.send(result);
    });

    // update data 3
    app.put("/updateChocolate/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedChocolate = req.body;
      const chocolates = {
        $set: {
          name: updatedChocolate.name,
          country: updatedChocolate.country,
          category: updatedChocolate.category,
          photo: updatedChocolate.photo,
        },
      };
      const result = await chocolateCollection.updateOne(
        filter,
        chocolates,
        options
      );
      res.send(result);
    });

    // delete data
    app.delete("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Chocolate Server is running");
});

app.listen(port, () => {
  console.log(`chocolate server is running on port: ${port}`);
});
