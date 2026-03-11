const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPaymentById,
  recordPayment,
  updatePaymentStatus,
  deletePayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPayments)
  .post(protect, recordPayment);

router.route('/:id')
  .get(protect, getPaymentById)
  .delete(protect, deletePayment);

router.route('/:id/status').patch(protect, updatePaymentStatus);

module.exports = router;
