const Complaint = require('../models/complaint.model');
const Media = require('../models/media.model');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    try {
        const { title, description, category, location, priority } = req.body;

        const complaint = new Complaint({
            user_id: req.user._id,
            title,
            description,
            category,
            location,
            priority
        });

        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all complaints (with filtering)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        let query = {};

        // Normal users only see their own complaints, admins/ngos see based on query or assignment
        if (req.user.role === 'user') {
            query.user_id = req.user._id;
        } else if (req.user.role === 'ngo') {
            query.assigned_to = req.user._id; // simplified, in reality it might check NGO profile ID
        }

        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const complaints = await Complaint.find(query).populate('user_id', 'name email').sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user_id', 'name email')
            .populate('assigned_to', 'name');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check ownership if user
        if (req.user.role === 'user' && complaint.user_id._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin/NGO)
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

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus
};
