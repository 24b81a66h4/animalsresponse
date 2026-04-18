const Complaint = require('../models/complaint.model');
const { getIO } = require('../config/socket');

const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority, address } = req.body;

        const location = address ? { address } : undefined;

        const media = req.files
            ? req.files.map(file => ({
                url: file.path,
                public_id: file.filename,
                resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            }))
            : [];

        const complaint = new Complaint({
            user_id: req.user._id,
            title,
            description,
            category: category || 'other',
            priority: priority || 'medium',
            location,
            media,
        });

        const created = await complaint.save();
        res.status(201).json(created);
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
            query.assigned_to = req.user._id;
        }

        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;

        const complaints = await Complaint.find(query)
            .populate('user_id', 'name email')
            .populate('assigned_to', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user_id: req.user._id })
            .populate('assigned_to', 'name email')
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
            .populate('assigned_to', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (
            req.user.role === 'user' &&
            complaint.user_id._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
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
        const updated = await complaint.save();

        try {
            const io = getIO();
            if (complaint.user_id) {
                io.to(complaint.user_id.toString()).emit('notification', {
                    message: `Your complaint "${complaint.title}" status changed to ${status}`,
                    complaintId: complaint._id,
                });
            }
        } catch (_) {}

        res.status(200).json(updated);
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
        const updated = await complaint.save();

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPublicComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user_id', 'name')
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (
            req.user.role === 'user' &&
            complaint.user_id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await complaint.deleteOne();
        res.status(200).json({ message: 'Complaint deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getMyComplaints,
    getComplaintById,
    updateComplaintStatus,
    assignComplaint,
    getPublicComplaints,
    deleteComplaint,
};