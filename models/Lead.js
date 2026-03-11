const mongoose = require('mongoose');

const leadSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Please add a customer name'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    projectType: {
      type: String,
      required: [true, 'Please specify project type'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Site Visit', 'Quote Sent', 'Won', 'Lost'],
      default: 'New',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
