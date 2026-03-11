const Quote = require('../models/Quote');

const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate('customerId', 'name email phone')
      .populate('leadId', 'customerName email phone')
      .populate('creatorId', 'name');
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('customerId', 'name email address')
      .populate('leadId', 'customerName email address')
      .populate('creatorId', 'name email');

    if (quote) {
      res.status(200).json(quote);
    } else {
      res.status(404).json({ message: 'Quote not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const { customerId, leadId, items, status, validUntil, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No quote items provided' });
    }

    // Server-side calculation to prevent tampering
    let subTotal = 0;
    const calculatedItems = items.map(item => {
      const itemTotal = item.quantity * item.unitPrice;
      subTotal += itemTotal;
      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal
      };
    });

    // Simple fixed tax rate of 10% for example purposes
    const taxRate = 0.10;
    const tax = subTotal * taxRate;
    const grandTotal = subTotal + tax;

    // Generate a unique quote number (Q-timestamp)
    const quoteNumber = `Q-${Date.now()}`;

    const quote = new Quote({
      quoteNumber,
      customerId: customerId || null,
      leadId: leadId || null,
      creatorId: req.user._id, // from authMiddleware
      items: calculatedItems,
      subTotal,
      tax,
      grandTotal,
      status: status || 'Draft',
      validUntil,
      notes
    });

    const createdQuote = await quote.save();
    res.status(201).json(createdQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateQuoteStatus = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (quote) {
      quote.status = req.body.status || quote.status;
      const updatedQuote = await quote.save();
      res.status(200).json(updatedQuote);
    } else {
      res.status(404).json({ message: 'Quote not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (quote) {
      await quote.deleteOne();
      res.status(200).json({ message: 'Quote removed' });
    } else {
      res.status(404).json({ message: 'Quote not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuoteStatus,
  deleteQuote
};
