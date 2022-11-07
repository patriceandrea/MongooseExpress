const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require("./models/product");
const methodOverride = require('method-override')
const Farm = require('./models/farm');
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!")
  })
  .catch((err) => {
    console.log("Oh no MONGO CONNECTION error!!")
    console.log(err)
  });


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// Farm Routes 
app.get('/farms', async (req, res) => {
  const farms = await Farm.find({});
  res.render('farms/index', { farms });
})

app.get('/farms/new', (req, res) => {
  res.render('farms/new')
})

app.get('/farms/:id', async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  res.render('farms/show', { farm })
})


app.post('/farms', async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  res.redirect('/farms')
})


//Product Routes
const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category })
    res.render('products/index', { products, category })
  } else {
    const products = await Product.find({})
    console.log(products);
    res.render('products/index', {
      products,
      category: 'All'
    })
  }


})

app.get('/products/new', (req, res) => {
  res.render('products/new', { categories })
})


app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product, categories })
})

app.post('/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`)
})

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id)
  res.redirect('/products');
})

app.listen(3000, () => {
  console.log("APP IS LISTENNING ON 3000");
})

