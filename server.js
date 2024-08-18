const express = require('express');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (adjust for production)
app.use(cors())

// Middleware to parse JSON
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://chihabmezrigui:chiheb123@cluster0.bcgruo1.mongodb.net/ipssi_db?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


// Serve API routes before static files
app.post('/add_product', async (req, res) => {
  const { id, product_type, product_name, quantity, price_per_product, desc } = req.body;

  try {
    const existingProduct = await Product.findOne({ product_name });
    if (existingProduct) return res.status(400).json({ message: 'This product already exists' });

    const newProduct = new Product({ id, product_type, product_name, quantity, price_per_product, desc });
    const savedProduct = await newProduct.save();
    res.status(201).json({ savedProduct, message: 'Product added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Setup file upload middleware
const upload = multer({ dest: 'uploads/' });

app.post('/upload-csv', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const results = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        const analyzedData = await Promise.all(results.map(async (review) => {
          const sentiment = await analyzeSentiment(review.text);
          return { 
            ...review, 
            sentiment: sentiment ? sentiment.sentiment : 'N/A',
            score: sentiment ? sentiment.score : null
          };
        }));

        const json2csvParser = new Parser({ fields: ['product', 'text', 'sentiment', 'score', 'Year'] });
        const csvData = json2csvParser.parse(analyzedData);

        const timestamp = Date.now();
        const csvFileName = `analyzed_data_${timestamp}.csv`;
        const csvFilePath = path.join('uploads', csvFileName);
        
        fs.writeFile(csvFilePath, csvData, (err) => {
          if (err) {
            console.error('Error saving CSV file:', err);
            res.status(500).json({ error: 'Error saving CSV file' });
          } else {
            console.log('CSV file saved successfully:', csvFileName);
            res.json(analyzedData);
          }
        });

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
          console.log('Uploaded file deleted successfully');
        });
      });
  } catch (error) {
    console.error('Error reading or processing file:', error);
    res.status(500).json({ error: 'Error reading or processing file' });
  }
});

const analyzeSentiment = async (text) => {
    const apiKey = 'I/7VSoqdZ6JRZm2peujA/w==ntb8mokFoAuFBy3n'; // Replace with your API key
    const apiUrl = `https://api.api-ninjas.com/v1/sentiment?text=${encodeURIComponent(text)}`;
    try {
        const response = await axios.get(apiUrl, {
            headers: { 'X-Api-Key': apiKey }
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing sentiment', error);
        return null;
    }
};

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
