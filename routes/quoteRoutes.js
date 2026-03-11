const express = require('express');
const router = express.Router();
const {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuoteStatus,
  deleteQuote
} = require('../controllers/quoteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getQuotes)
  .post(protect, createQuote);

router.route('/:id')
  .get(protect, getQuoteById)
  .delete(protect, deleteQuote);

router.route('/:id/status').patch(protect, updateQuoteStatus);

module.exports = router;
