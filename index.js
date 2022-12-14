const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


app.use(cors());
app.use(express.json());



// const uri = 'mongodb://localhost:27017';
const uri = `mongodb+srv://${process.env.DB_DENTAL}:${process.env.DB_PASSWORD}@cluster0.eveocjd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try {
    const serviceCollection = client.db('dentalSolution').collection('services');
    const reviewCollection = client.db('dentalSolution').collection('reviews');

    app.get('/services', async(req,res)=>{
        const query = {};
        const cursor = serviceCollection.find(query).sort({$natural: -1});;
        const services = await cursor.toArray();
        res.send(services);
    });

    app.get('/services/3', async(req,res)=>{
        const query = {};
        const cursor = serviceCollection.find(query).sort({$natural: -1});
        const services = await cursor.limit(3).toArray();
        res.send(services);
    });

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await serviceCollection.findOne(query);
        res.send(service);
    });

    app.get('/review/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const review = await reviewCollection.findOne(query);
        res.send(review);
    });

   
// service post api 
app.post('/services', async (req, res) => {
    const service = req.body;
    const result = await  serviceCollection.insertOne(service);
    res.send(result);
});


    // reviews apis  here 
    // review post api 
    app.post('/reviews', async (req, res) => {
        const review = req.body;
        const result = await  reviewCollection.insertOne(review);
        res.send(result);
    });


    // review get api for specific user
    app.get('/reviews', async (req, res) => {
        let query = {};
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = reviewCollection.find(query).sort({$natural: -1});
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    // review get api for specific service 
    app.get('/reviews/service', async (req, res) => {
        let query = {};
        if(req.query.service){
            query = { service: req.query.service }
        }
        const cursor = reviewCollection.find(query).sort({$natural: -1});
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    // update review api 
    app.put('/review/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const review = req.body;
        const updatedReview = {
            $set: {
                ratings: review.ratings,
                message: review.message
            }
        }
        const result = await  reviewCollection.updateOne(filter, updatedReview);
        res.send(result);
    })

    // delete a review 
    app.delete('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        console.log(query);
        const result = await reviewCollection.deleteOne(query);
        console.log(result);
        res.send(result);
    })


} 
finally {
    
}



}
run().catch(err=> console.error(err))

app.get('/', (req,res)=>{
    res.send('dental server is running')
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})