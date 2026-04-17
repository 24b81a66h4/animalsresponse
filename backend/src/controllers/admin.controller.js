const Complaint = require('../models/complaint.model');
const NGO = require('../models/ngo.model');
// @desc    Assign complaint to NGO
// @route   PUT /api/admin/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res) => {
    try {
        const { ngo_id } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Verify NGO exists
        const ngo = await NGO.findById(ngo_id);
        if (!ngo) {
            return res.status(404).json({ message: 'NGO not found' });
        }

        complaint.assigned_to = ngo_id;
        complaint.status = 'Assigned';
        const updatedComplaint = await complaint.save();
        
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all NGOs
// @route   GET /api/admin/ngos
// @access  Private (Admin)
const getNgos = async (req, res) => {
    try {
        const ngos = await NGO.find().populate('user_id', 'name email');
        res.status(200).json(ngos);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    assignComplaint,
    getNgos
};
