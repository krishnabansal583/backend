const User = require('../models/User');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const xlsx = require('xlsx');
const csv = require('papaparse');

// Approve User
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addProduct = async (req, res) => {
  const {
    productName, // Same as testProfileName
    b2bPrice,
    mrp,
    sampleType,
    fastingRequired,
    reportingTAT, // Same as tat
    productImage, // Same as imageUrl
    srNo,
    testCode,
    category,
    labPartner,
    premiumMinus5,
    premiumROI,
    premium5,
    processLocation,
  } = req.body;

  try {
    const newProduct = new Product({
      productName, // Map to testProfileName
      b2bPrice,
      mrp,
      sampleType,
      fastingRequired,
      reportingTAT, // Map to tat
      productImage, // Map to imageUrl
      srNo,
      testCode,
      category,
      labPartner,
      premiumMinus5,
      premiumROI,
      premium5,
      processLocation,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Product By ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  const { productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage } = req.body;
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, { productName, b2bPrice, mrp, sampleType, fastingRequired, reportingTAT, productImage }, { new: true });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addMultipleProductsFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    let products = [];

    if (req.file.mimetype === 'text/csv') {
      // Parse CSV file
      const csvData = fileBuffer.toString();
      const parsedData = csv.parse(csvData, { header: true });
      products = parsedData.data.map((row) => ({
        productName: row['TEST/PROFILE NAME'], // Map TEST/PROFILE NAME to productName
        b2bPrice: parseFloat(row['-5 Premium']), // Map -5 Premium to b2bPrice
        mrp: parseFloat(row['MRP']),
        sampleType: row['Sample Type'],
        fastingRequired: row['Fasting Required'].toLowerCase() === 'yes',
        reportingTAT: row['TAT'], // Map TAT to reportingTAT
        productImage: row['Image URL (PDF/JPG/PNG)'], // Map Image URL to productImage
        srNo: row['Sr No'],
        testCode: row['Test code'],
        category: row['Catagory'],
        labPartner: row['Lab Partner'],
        premiumMinus5: parseFloat(row['-5 Premium']),
        premiumROI: parseFloat(row['ROI Premium']),
        premium5: parseFloat(row['5 Premium']),
        processLocation: row['Process Location'],
      }));
    } else if (
      req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      req.file.mimetype === 'application/vnd.ms-excel'
    ) {
      // Parse Excel file
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = xlsx.utils.sheet_to_json(sheet);
      products = excelData.map((row) => ({
        productName: row['TEST/PROFILE NAME'], // Map TEST/PROFILE NAME to productName
        b2bPrice: parseFloat(row['-5 Premium']), // Map -5 Premium to b2bPrice
        mrp: parseFloat(row['MRP']),
        sampleType: row['Sample Type'],
        fastingRequired: row['Fasting Required'].toLowerCase() === 'yes',
        reportingTAT: row['TAT'], // Map TAT to reportingTAT
        productImage: row['Image URL (PDF/JPG/PNG)'], // Map Image URL to productImage
        srNo: row['Sr No'],
        testCode: row['Test code'],
        category: row['Catagory'],
        labPartner: row['Lab Partner'],
        premiumMinus5: parseFloat(row['-5 Premium']),
        premiumROI: parseFloat(row['ROI Premium']),
        premium5: parseFloat(row['5 Premium']),
        processLocation: row['Process Location'],
      }));
    } else {
      return res.status(400).json({ msg: 'Unsupported file format' });
    }

    // Validate and insert products
    const newProducts = await Product.insertMany(products);
    res.status(201).json(newProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserState = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's state
    res.json({ state: user.state });
  } catch (error) {
    console.error('Error in getUserState:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Calculate total amount
    let totalAmount = 0;
    const productDetails = await Promise.all(products.map(async (product) => {
      const { productId, quantity, tax, additionalCharges, taxAmount } = product;
      const productData = await Product.findById(productId);
      if (!productData) return res.status(404).json({ msg: 'Product not found' });

      const price = productData.b2bPrice;
      
      // Use the pre-calculated tax amount from frontend or calculate it here
      const actualTaxAmount = taxAmount || (price * quantity * tax / 100);
      
      const total = (price * quantity) + actualTaxAmount + additionalCharges;
      totalAmount += total;

      return {
        productName: productData.productName,
        quantity,
        price,
        tax: `${tax}%`, // Store as percentage for display
        taxAmount: actualTaxAmount, // Store the actual amount for calculations
        additionalCharges,
        totalAmount: total,
      };
    }));

    // Create invoice details
    const invoice = {
      invoiceNo: `INV-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toISOString(),
      userName: user.name,
      email: user.email,
      products: productDetails,
      totalAmount,
    };

    res.status(200).json({ msg: 'Invoice generated successfully', invoice });
  } catch (error) {
    console.error('Error in generateInvoice:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// routes/admin.js (add this new route to your existing admin routes)
// Get a single invoice by ID
exports.singleInvoice = async (req, res) => {
  try {
    // Validate the invoice ID format
    if (!req.params.invoiceId || !req.params.invoiceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ msg: "Invalid invoice ID format" });
    }

    const invoice = await Invoice.findById(req.params.invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    
    // Check if the user has permission to view this invoice
    // Assuming you have user info in req.user (set by auth middleware)
    if (req.user.role !== 'admin' && req.user._id.toString() !== invoice.userId.toString()) {
      return res.status(403).json({ msg: "Not authorized to view this invoice" });
    }
    
    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};