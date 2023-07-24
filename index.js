const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const cors = require('cors');
require('dotenv').config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://bksumon51:3oluQzwQal9FOEny@cluster0.yvn7iqz.mongodb.net/?retryWrites=true&w=majority";

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
     client.connect();
    const database = client.db('clg-collage')
    const clgCollection = database.collection('college-collections')
    const CandidateDetails = database.collection('candidate-details')
    const reviews = database.collection('reviews')


    app.get('/colleges', async(req, res) => {
        const result = await clgCollection.find().toArray()
        res.send(result)
    })
    app.get('/college/:id', async(req, res) => {
        const id = req.params.id;
        const result = await clgCollection.findOne({_id : new ObjectId(id) })
        res.send(result)
    })

    app.get('/my-college/:email', async(req, res) => {
      const email = req.params.email;
      
      const result = await CandidateDetails.findOne({email: email})
      res.send(result)
  })
    app.post('/candidate-details', async(req, res) => {
      const details = req.body;
      console.log(details);
      const result = await CandidateDetails.insertOne(details)
      res.send(result)
  })
    app.get('/reviews', async(req, res) => {
      const result = await reviews.find().toArray()
      res.send(result)
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
    res.send('App listening')
})
app.listen(port, () => console.log('hello world', port))