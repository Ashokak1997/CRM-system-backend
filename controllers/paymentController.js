const Payment = require('../models/Payment');
const Project = require('../models/Project');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ createdBy: req.user.id })
      .populate('projectId', 'projectName status')
      .populate('customerId', 'name email address')
      .populate('createdBy', 'name');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('projectId', 'projectName status')
      .populate('customerId', 'name email')
      .populate('createdBy', 'name');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.createdBy._id.toString() !== req.user.id && payment.createdBy.toString() !== req.user.id) {
       return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record a new payment
// @route   POST /api/payments
// @access  Private
const recordPayment = async (req, res) => {
  try {
    const { projectId, customerId, amount, paymentMethod, status, notes } = req.body;

    if (!projectId || !customerId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields for payment.' });
    }

    // Verify Project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Linked project not found.' });
    }

    const payment = new Payment({
      projectId,
      customerId,
      amount,
      paymentMethod,
      status: status || 'Completed',
      createdBy: req.user.id,
      notes
    });

    const recordedPayment = await payment.save();
    res.status(201).json(recordedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.createdBy.toString() !== req.user.id) {
       return res.status(401).json({ message: 'User not authorized' });
    }

    payment.status = req.body.status || payment.status;
    const updatedPayment = await payment.save();
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
       return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.createdBy.toString() !== req.user.id) {
       return res.status(401).json({ message: 'User not authorized' });
    }

    await payment.deleteOne();
    res.status(200).json({ message: 'Payment record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  recordPayment,
  updatePaymentStatus,
  deletePayment
};
