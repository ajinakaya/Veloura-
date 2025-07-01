const User = require('../models/user');

// Find all users
const findAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
};

// Find user by ID
const findUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
};

const Profile = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId); 

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user); 
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
};

// Update user by ID
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user._id;

        if (userId !== currentUserId.toString()) {
            return res.status(403).json({ error: "Unauthorized to update this account" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
};

// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user._id;

        if (userId !== currentUserId.toString()) {
            return res.status(403).json({ error: "Unauthorized to delete this account" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};

module.exports = {
    findAllUsers,
    findUserById,
    updateUser,
    Profile,
    deleteUser
};