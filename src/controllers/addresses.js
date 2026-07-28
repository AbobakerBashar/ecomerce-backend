import User from "../models/user.js";

export const getAddresses = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("addresses");

		if (!user)
			return res.status(401).json({
				success: false,
				message: "Unauthenticated!",
			});
		const addresses = user.addresses.map((a) => ({
			label: a.label,
			phone: a.phone,
			street: a.street,
			city: a.city,
			state: a.state,
			zip: a.zip,
			country: a.country,
			isDefault: a.isDefault,
			id: a._id,
		}));

		res.status(200).json({ success: true, addresses });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const addAddress = async (req, res) => {
	try {
		const address = req.body;

		const user = await User.findById(req.userId).select("addresses");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Unauthenticated!",
			});
		}

		if (user.addresses.length === 0) {
			address.isDefault = true;
		}

		if (address.isDefault) {
			user.addresses.forEach((a) => {
				a.isDefault = false;
			});
		}

		user.addresses.push(address);

		await user.save();

		const addresses = user.addresses.map((a) => ({
			label: a.label,
			phone: a.phone,
			street: a.street,
			city: a.city,
			state: a.state,
			zip: a.zip,
			country: a.country,
			isDefault: a.isDefault,
			id: a._id,
		}));

		res.status(201).json({
			success: true,
			addresses,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updateAddress = async (req, res) => {
	const address = req.body;
	const id = req.params.id;

	try {
		const user = await User.findById(req.userId);
		if (!user)
			return res.status(401).json({
				success: false,
				message: "Unauthenticated!",
			});

		let updatedAddress = user.addresses.id(id);
		if (!updatedAddress)
			return res.status(404).json({
				success: false,
				message: "Address not found",
			});

		if (address.isDefault && user.addresses.length > 1) {
			user.addresses.forEach((a) => {
				a.isDefault = false;
			});
		}

		Object.assign(updatedAddress, address);

		await user.save();

		const addresses = user.addresses.map((a) => ({
			label: a.label,
			phone: a.phone,
			street: a.street,
			city: a.city,
			state: a.state,
			zip: a.zip,
			country: a.country,
			isDefault: a.isDefault,
			id: a._id,
		}));

		res.status(200).json({
			addresses,
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
