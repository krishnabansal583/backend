// filepath: /c:/Users/user/Desktop/price-calculator/backend/routes/invoice.js
const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice"); // Import your Invoice model
const auth = require("../middlewares/auth"); // Import your auth middleware

router.post("/", auth, async (req, res) => {
  try {
    const { 
      invoiceNo, // Get the invoice number from the request
      userName, 
      email, 
      products, 
      totalAmount,
      status 
    } = req.body;
    
    // Use provided invoice number or generate a new one if not provided
    const finalInvoiceNo = invoiceNo || `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create a new invoice
    const newInvoice = new Invoice({
      invoiceNo: finalInvoiceNo,
      userId: req.user.id, // From auth middleware
      userName,
      email,
      products,
      totalAmount,
      status: status || "pending"
    });
    // Save the invoice to the database
    const savedInvoice = await newInvoice.save();
    
    
    res.status(201).json(savedInvoice);
  } catch (err) {
    console.error("Error creating invoice:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Route to fetch invoice by ID
// Route to fetch invoice by ID
router.get("/:invoiceId", async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;

    if (!invoiceId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("Invalid invoice ID format:", invoiceId);
      return res.status(400).json({ msg: "Invalid invoice ID format" });
    }

    const invoice = await Invoice.findById(invoiceId)
      .populate("userId", "name email")
      .populate("products.productId", "productName price");

    if (!invoice) {
      console.log("Invoice not found for ID:", invoiceId);
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Route to fetch invoice by invoice number
router.get("/by-number/:invoiceNo", async (req, res) => {
  try {
    const invoiceNo = req.params.invoiceNo;

    if (!invoiceNo || typeof invoiceNo !== "string") {
      console.log("Invalid invoice number");
      return res.status(400).json({ msg: "Invalid invoice number" });
    }

    const invoice = await Invoice.findOne({ invoiceNo })
      .populate("userId", "name email")
      .populate("products.productId", "productName price");

    if (!invoice) {
      return res.status(404).json({ msg: `Invoice not found for number: ${invoiceNo}` });
    }

    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice by number:", err.message, err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
module.exports = router;