const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


app.use(cors());
app.use(express.json());

console.log(process.env.DB_DENTAL);
console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_DENTAL}:${process.env.DB_PASSWORD}@cluster0.eveocjd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.get('/', (req,res)=>{
    res.send('dental server is running')
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})