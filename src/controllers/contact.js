import Contact from "../models/contact.js";

export const contact = async (req, res) => {
	const { message, email, name, type } = req.body;
	try {
		const contact = await Contact.create({ message, email, name, type });

		if (!contact)
			return res.status(500).json({
				message: "Faild to create contact, please try again later.",
				success: false,
			});

		res.status(200).json({
			contact: {
				id: contact._id,
				name: contact.name,
				email: contact.email,
				type: contact.type,
			},
			success: true,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
			success: false,
		});
	}
};
