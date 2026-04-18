const Complaint = require('../models/complaint.model');

const createComplaint = async (req, res) => {
    try {
        const { title, description, category, location, priority } = req.body;
        const complaint = new Complaint({
            user_id: req.user._id,
            title, description, category, location, priority
        });
        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getComplaints = async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        let query = {};

        if (req.user.role === 'user') {
            query.user_id = req.user._id;
        } else if (req.user.role === 'ngo') {
            // NGO sees complaints assigned to their user _id
            query.assigned_to = req.user._id;
        }
        // admin sees all complaints - no filter

        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const complaints = await Complaint.find(query)
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user_id', 'name email')
            .populate('assigned_to', 'name');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (req.user.role === 'user' && complaint.user_id._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status;
        const updatedComplaint = await complaint.save();
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const assignComplaint = async (req, res) => {
    try {
        const { ngo_user_id } = req.body;

        if (!ngo_user_id) {
            return res.status(400).json({ message: 'ngo_user_id is required' });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.assigned_to = ngo_user_id;
        complaint.status = 'Assigned';
        const updatedComplaint = await complaint.save();

        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPublicComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user_id', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
    assignComplaint,
    getPublicComplaints
};