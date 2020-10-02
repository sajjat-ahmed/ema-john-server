const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3phgf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect(err => {
  const productsCollection = client.db("emaJohnShop").collection("products")
  const ordersCollection = client.db("emaJohnShop").collection("orders")
// transfer backend data from the lazy
  app.post('/addProducts', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/connect', (req, res) => {
    
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)