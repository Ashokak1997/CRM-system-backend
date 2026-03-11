const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user.id }).populate('leadId', 'projectType assignedTo status');
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('leadId', 'projectType assignedTo notes createdAt');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const convertLeadToCustomer = async (req, res) => {
  try {
    const { leadId } = req.body;

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (lead.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to convert this lead' });
    }

    const customerExists = await Customer.findOne({ leadId });
    if (customerExists) {
      return res.status(400).json({ message: 'Lead has already been converted to a customer' });
    }
    const customer = new Customer({
      name: lead.customerName,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      leadId: lead._id,
      createdBy: req.user.id
    });

    const createdCustomer = await customer.save();
    lead.status = 'Won';
    await lead.save();

    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  convertLeadToCustomer,
};
