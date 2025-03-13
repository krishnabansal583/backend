const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
require('dotenv').config(); // Make sure to have dotenv installed

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addTestInvoice = async () => {
  const testInvoice = new Invoice({
    invoiceNo: "INV-473064",
    userId: "67b39dfa99ab0597d0098ce4",
    userName: "krishna",
    email: "krishnabansal583@gmail.com",
    date: new Date("2025-03-12T13:52:26.300Z"),
    products: [
      {
        productId: "67c45f71a1eadf75a3ca73ed", // Replace with a valid product ID
        productName: "ALPHA FETO PROTEIN",
        quantity: 1,
        price: 100,
        tax: 10,
        taxAmount: 10,
        additionalCharges: 5,
        totalAmount: 115
      }
    ],
    totalAmount: 115,
    status: "pending"
  });

  await testInvoice.save();
  console.log("Test invoice added successfully");
  mongoose.connection.close();
};

addTestInvoice();