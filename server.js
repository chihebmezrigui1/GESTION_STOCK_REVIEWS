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
app.use(cors({
  origin: '*', // Allow all origins, adjust for production as needed
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

mongoose.connect('mongodb+srv://chihabmezrigui:chiheb123@cluster0.bcgruo1.mongodb.net/ipssi_db?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


// Create a new product
app.post('/add_product', async (req, res) => {
  const { id,product_type, product_name, quantity, price_per_product, desc } = req.body;

  try {
    // Check if product with the same id or product_name already exists
    const existingProduct = await Product.findOne({ 
      $or: [
        { product_name: product_name }
      ]
    });

    if (existingProduct) {
      return res.status(400).json({ message: 'This product is already exists' });
    }

    const newProduct = new Product({ id,product_type, product_name, quantity, price_per_product, desc });
    const savedProduct = await newProduct.save();
    res.status(201).json({ savedProduct, message: 'This product added successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Read all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read a product by id
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});






const upload = multer({ dest: 'uploads/' });

app.use(express.json());
const corsOptions = {
  origin: 'http://10.188.231.218:3000'  // Update this to match your frontend URL
};
app.use(cors(corsOptions));




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

const { Parser } = require('json2csv');


app.post('/upload-csv', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const results = [];

  try {
    // Read CSV file and parse its contents
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Process each review for sentiment analysis
        const analyzedData = await Promise.all(results.map(async (review) => {
          const sentiment = await analyzeSentiment(review.text);
          return { 
            ...review, 
            sentiment: sentiment ? sentiment.sentiment : 'N/A',
            score: sentiment ? sentiment.score : null
          };
        }));

        // Convert analyzedData to CSV string
        const json2csvParser = new Parser({ fields: ['product','text', 'sentiment','score','Year'] });
        const csvData = json2csvParser.parse(analyzedData);

        // Save CSV file to uploads directory
        const timestamp = Date.now();
        const csvFileName = `analyzed_data_${timestamp}.csv`;
        const csvFilePath = path.join('uploads', csvFileName);
        
        fs.writeFile(csvFilePath, csvData, (err) => {
          if (err) {
            console.error('Error saving CSV file:', err);
            res.status(500).json({ error: 'Error saving CSV file' });
          } else {
            console.log('CSV file saved successfully:', csvFileName);
            
            // Send analyzed data as JSON response
            res.json(analyzedData);
          }
        });

        // Clean up: Delete uploaded file after processing
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




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
