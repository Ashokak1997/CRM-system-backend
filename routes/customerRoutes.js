const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  convertLeadToCustomer,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCustomers);
router.route('/convert').post(protect, convertLeadToCustomer);
router.route('/:id').get(protect, getCustomerById);

module.exports = router;
