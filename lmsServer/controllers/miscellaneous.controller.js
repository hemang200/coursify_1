// Contact Us Controller
export const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Here you can add logic to save the message to DB or send an email
        // For now, just log it
        console.log("Contact Form Submission:", { name, email, message });

        return res.status(200).json({
            success: true,
            message: "Your message has been received. Thank you for contacting us!",
        });
    } catch (error) {
        console.error("Contact form error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

// ...existing code...

// User Stats Controller
export const userStats = async (req, res) => {
    try {
        // Replace this with actual logic to fetch stats from your DB
        const stats = {
            totalUsers: 120,
            activeUsers: 85,
            newUsersThisMonth: 10,
        };

        return res.status(200).json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error("User stats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user stats.",
        });
    }
};

// ...existing code...

