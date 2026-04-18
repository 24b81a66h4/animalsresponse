const Complaint = require('../models/complaint.model');
const NGO = require('../models/ngo.model');
const { createNotification } = require('../services/notification.service');

// @desc    Get NGO profile
// @route   GET /api/ngo/profile
// @access  Private (NGO)
const getNgoProfile = async (req, res) => {
    try {
        const ngo = await NGO.findOne({ user_id: req.user._id }).populate('user_id', 'name email');

        if (!ngo) {
            return res.status(404).json({ message: 'NGO profile not found' });
        }

        res.status(200).json(ngo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get NGO dashboard stats
// @route   GET /api/ngo/analytics
// @access  Private (NGO)
const getNgoAnalytics = async (req, res) => {
    try {
        const [total, pending, resolved, inProgress] = await Promise.all([
            Complaint.countDocuments({ assigned_to: req.user._id }),
            Complaint.countDocuments({ assigned_to: req.user._id, status: 'pending' }),
            Complaint.countDocuments({ assigned_to: req.user._id, status: 'resolved' }),
            Complaint.countDocuments({ assigned_to: req.user._id, status: 'in-progress' }),
        ]);

        res.status(200).json({ total, pending, resolved, inProgress });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get ALL available (unassigned/pending) complaints
// @route   GET /api/ngo/available-complaints
// @access  Private (NGO)
const getAvailableComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            status: { $in: ['pending', 'open'] },
            $or: [
                { assigned_to: null },
                { assigned_to: { $exists: false } }
            ]
        })
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get complaints assigned to this NGO
// @route   GET /api/ngo/complaints
// @access  Private (NGO)
const getAssignedComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ assigned_to: req.user._id })
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    NGO self-assigns a complaint
// @route   PUT /api/ngo/complaints/:id/assign
// @access  Private (NGO)
const selfAssignComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaint.assigned_to) {
            return res.status(400).json({ message: 'Complaint already assigned' });
        }

        complaint.assigned_to = req.user._id;
        complaint.status = 'in-progress';
        const updated = await complaint.save();

        if (complaint.user_id) {
            await createNotification(
                complaint.user_id,
                'Complaint Accepted',
                `An NGO has accepted your complaint: "${complaint.title}"`,
                complaint._id
            );
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update complaint status by NGO
// @route   PUT /api/ngo/complaints/:id/status
// @access  Private (NGO)
const updateNgoComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (!complaint.assigned_to || complaint.assigned_to.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized for this complaint' });
        }

        complaint.status = status;
        const updated = await complaint.save();

        if (complaint.user_id) {
            await createNotification(
                complaint.user_id,
                'Status Updated',
                `Your complaint "${complaint.title}" status changed to ${status}`,
                complaint._id
            );
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNgoProfile,
    getNgoAnalytics,
    getAvailableComplaints,
    getAssignedComplaints,
    selfAssignComplaint,
    updateNgoComplaintStatus,
};
