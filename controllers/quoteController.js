const Quote = require('../models/Quote');

const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ createdBy: req.user.id })
      .populate('customerId', 'name email phone')
      .populate('leadId', 'customerName email phone')
      .populate('createdBy', 'name');
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
      .populate('createdBy', 'name email');

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (quote.createdBy._id.toString() !== req.user.id && quote.createdBy.toString() !== req.user.id) {
       return res.status(401).json({ message: 'User not authorized' });
    }
    
    res.status(200).json(quote);
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
      createdBy: req.user.id,
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
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (quote.createdBy.toString() !== req.user.id) {
       return res.status(401).json({ message: 'User not authorized' });
    }

    quote.status = req.body.status || quote.status;
    const updatedQuote = await quote.save();
    res.status(200).json(updatedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    if (quote.createdBy.toString() !== req.user.id) {
       return res.status(401).json({ message: 'User not authorized' });
    }

    await quote.deleteOne();
    res.status(200).json({ message: 'Quote removed' });
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
