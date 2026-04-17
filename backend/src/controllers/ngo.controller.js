const Complaint = require('../models/complaint.model');
const NGO = require('../models/ngo.model');

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

// @desc    Get assigned complaints
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

        // Only allow update if assigned to this NGO
        if (complaint.assigned_to.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized for this complaint' });
        }

        complaint.status = status;
        const updated = await complaint.save();

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNgoProfile,
    getAssignedComplaints,
    updateNgoComplaintStatus
};