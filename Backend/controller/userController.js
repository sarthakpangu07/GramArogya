
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Facility = require("../models/Facility");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Public registration: patients only
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (role && role !== "patient") {
            return res.status(403).json({
                message: "Public registration is limited to patient accounts"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "patient"
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: "Patient registered successfully",
            user: userResponse
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        return res.status(500).json({
            message: "Failed to create user",
            error: error.message
        });
    }
};

// Admin-only: get users with search, role filter and pagination
const getUsers = async (req, res) => {
    try {
        const {
            search = "",
            role = "",
            page = "1",
            limit = "10"
        } = req.query;

        const allowedRoles = [
            "patient",
            "phc_staff",
            "doctor",
            "specialist",
            "admin"
        ];

        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid user role filter"
            });
        }

        const pageNumber = Math.max(
            1,
            Number.parseInt(page, 10) || 1
        );

        const pageSize = Math.min(
            50,
            Math.max(1, Number.parseInt(limit, 10) || 10)
        );

        const filter = {};

        if (role) {
            filter.role = role;
        }

        const trimmedSearch = search.trim();

        if (trimmedSearch) {
            // Escape special regex characters supplied by the user
            const escapedSearch = trimmedSearch.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            const searchRegex = new RegExp(escapedSearch, "i");

            filter.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];
        }

        const skip = (pageNumber - 1) * pageSize;

        const [users, total] = await Promise.all([
            User.find(filter)
                .select(
                    "name email role assignedFacility createdAt updatedAt"
                )
                .populate(
                    "assignedFacility",
                    "name facilityType village district state"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .lean(),

            User.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
            pagination: {
                total,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

// Admin-only staff creation; route must use protect + authorize("admin")
const createStaffUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            facilityId
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const allowedRoles = [
            "phc_staff",
            "doctor",
            "specialist"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid staff role"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        let assignedFacility = null;

        if (facilityId) {
            if (!mongoose.isValidObjectId(facilityId)) {
                return res.status(400).json({
                    message: "Invalid facility ID"
                });
            }

            if (role !== "specialist") {
                return res.status(400).json({
                    message: "Only specialists can be assigned a facility through this request"
                });
            }

            const facility = await Facility.findOne({
                _id: facilityId,
                isActive: true
            });

            if (!facility) {
                return res.status(404).json({
                    message: "Active facility not found"
                });
            }

            assignedFacility = facility._id;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role,
            assignedFacility
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: "Staff account created successfully",
            user: userResponse
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        return res.status(500).json({
            message: "Failed to create staff account",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                assignedFacility: user.assignedFacility || null
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

// Admin-only: assign or change a specialist's facility
const assignSpecialistFacility = async (req, res) => {
    try {
        const { specialistId, facilityId } = req.body;

        if (!specialistId || !facilityId) {
            return res.status(400).json({
                message: "Specialist ID and facility ID are required"
            });
        }

        if (
            !mongoose.isValidObjectId(specialistId) ||
            !mongoose.isValidObjectId(facilityId)
        ) {
            return res.status(400).json({
                message: "Invalid specialist ID or facility ID"
            });
        }

        const specialist = await User.findById(specialistId);

        if (!specialist) {
            return res.status(404).json({
                message: "Specialist not found"
            });
        }

        if (specialist.role !== "specialist") {
            return res.status(400).json({
                message: "The selected user is not a specialist"
            });
        }

        const facility = await Facility.findOne({
            _id: facilityId,
            isActive: true
        });

        if (!facility) {
            return res.status(404).json({
                message: "Active facility not found"
            });
        }

        specialist.assignedFacility = facility._id;
        await specialist.save();

        await specialist.populate(
            "assignedFacility",
            "name facilityType village district state"
        );

        const specialistResponse = specialist.toObject();
        delete specialistResponse.password;

        return res.status(200).json({
            message: "Facility assigned to specialist successfully",
            specialist: specialistResponse
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to assign facility",
            error: error.message
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    createStaffUser,
    loginUser,
    assignSpecialistFacility
};
