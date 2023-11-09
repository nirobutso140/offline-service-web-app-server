const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iabkpld.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const vehicleServiceCollection = client.db('Vehicle').collection('VehicleServices')
    const addServiceCollection = client.db('Vehicle').collection('addService')
    const bookServiceCollection = client.db('Vehicle').collection('bookService')


    app.get("/services", async (req, res) => {
      const result = await vehicleServiceCollection.find().toArray();
      res.send(result);
    });

    app.get("/readAddedService", async (req, res) => {
      const result = await addServiceCollection.find().toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await vehicleServiceCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.get("/edit/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await addServiceCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.get("/readBookService", async (req, res) => {
      const result = await bookServiceCollection.find().toArray();
      res.send(result);
    });

    app.get("/readBookService/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        userEmail: email,
      };
      const result = await bookServiceCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/addService", async (req, res) => {
      const user = req.body;
      //   console.log(user);
      const result = await addServiceCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.post("/bookService", async (req, res) => {
      const user = req.body;
      //   console.log(user);
      const result = await bookServiceCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.delete("/deleteService/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await addServiceCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("id", id, data);
      const filter = { _id: new ObjectId(id) };
      const updatedUSer = {
        $set: {
          serviceName: data.serviceName,
          name: data.name,
          email: data.email,
          area: data.area,
          price: data.price,
          description: data.description,
          photo: data.photo,

        },
      };
      const result = await addServiceCollection.updateOne(
        filter,
        updatedUSer,
      );
      res.send(result);
    });

    app.patch('/status/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBooking = req.body;
      console.log(updatedBooking);
      const updateDoc = {
          $set: {
              status: updatedBooking.status
          },
      };
      const result = await bookServiceCollection.updateOne(filter, updateDoc);
      res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('car is running')
})

app.listen(port, () => {
  console.log(`car running on ${port}`);
})
//hello plz commit