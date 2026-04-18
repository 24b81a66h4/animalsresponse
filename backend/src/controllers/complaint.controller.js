const Complaint = require('../models/complaint.model');
const { cloudinary } = require('../config/cloudinary');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (User)
const submitComplaint = async (req, res) => {
    try {
        const { title, description, category, priority, address, lat, lng } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        // Build media array from uploaded files
        const media = (req.files || []).map((file) => ({
            url: file.path,
            public_id: file.filename,
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        }));

        const complaint = await Complaint.create({
            title,
            description,
            category: category || 'other',
            priority: priority || 'medium',
            location: { address, lat, lng },
            media,
            user_id: req.user._id,
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all complaints (admin)
// @route   GET /api/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
    try {
        const { status, priority, category } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;

        const complaints = await Complaint.find(filter)
            .populate('user_id', 'name email')
            .populate('assigned_to', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get logged-in user's complaints
// @route   GET /api/complaints/my
// @access  Private (User)
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user_id: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user_id', 'name email')
            .populate('assigned_to', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
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
        const complaint = await Complaint.findById(req.params.id).populate('user_id', 'name email');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status;
        const updated = await complaint.save();

        // 🔔 Emit real-time notification to complaint owner
        try {
            const { getIO } = require('../config/socket');
            const io = getIO();
            io.to(complaint.user_id._id.toString()).emit('notification', {
                type: 'status_update',
                message: `Your complaint "${complaint.title}" is now ${status}`,
                complaintId: complaint._id,
                status,
            });
        } catch (e) {
            console.log('Socket emit failed:', e.message);
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a complaint + its Cloudinary media
// @route   DELETE /api/complaints/:id
// @access  Private (User/Admin)
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Only owner or admin can delete
        if (complaint.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete media from Cloudinary
        await Promise.all(
            complaint.media.map((m) =>
                cloudinary.uploader.destroy(m.public_id, { resource_type: m.resource_type })
            )
        );

        await complaint.deleteOne();
        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    submitComplaint,
    getAllComplaints,
    getMyComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint,
};