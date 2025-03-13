
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Existing fields
  productName: { type: String, required: true }, // Same as testProfileName
  b2bPrice: { type: Number, required: true },
  mrp: { type: Number, required: true },
  sampleType: { type: String, required: true },
  fastingRequired: { type: Boolean, required: true },
  reportingTAT: { type: String, required: true }, // Same as tat
  productImage: { type: String }, // Same as imageUrl

  // New fields
  srNo: { type: Number }, // Sr No
  testCode: { type: String }, // Test code
  category: { type: String }, // Catagory
  labPartner: { type: String }, // Lab Partner
  premiumMinus5: { type: Number }, // -5 Premium
  premiumROI: { type: Number }, // ROI Premium
  premium5: { type: Number }, // 5 Premium
  processLocation: { type: String }, // Process Location
});

module.exports = mongoose.model('Product', productSchema);