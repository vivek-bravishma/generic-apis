import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			default: "1234",
		},
		contact: {
			type: String,
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CobrowseOrganization",
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const CobrowseUser = mongoose.model("CobrowseUser", userSchema);

export default CobrowseUser;
