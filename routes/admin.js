
const express = require('express');
const router = express.Router();
const { approveUser, addProduct, getAllProducts, getProductById, updateProduct, deleteProduct, addMultipleProductsFromFile, getAllUsers, getUserState, generateInvoice, singleInvoice } = require('../controllers/adminController');
const multer = require('multer');


const upload = multer({ storage: multer.memoryStorage() });

router.put('/approve-user/:id', approveUser);
router.post('/add-product', addProduct);

router.get('/get-all-products', getAllProducts);
router.post('add-product', addProduct);
router.get('/get-product/:id', getProductById);
router.put('/update-product/:id', updateProduct);
router.delete('/delete-product/:id', deleteProduct);


// Add Multiple Products via File Upload
router.post('/add-products-from-file', upload.single('file'), addMultipleProductsFromFile);

// New route for getting all users
router.get('/get-all-users', getAllUsers);
router.get('/user-state/:userId', getUserState);
router.post("/generate-invoice", generateInvoice);
router.get("/invoices/:invoiceId", singleInvoice);


module.exports = router;