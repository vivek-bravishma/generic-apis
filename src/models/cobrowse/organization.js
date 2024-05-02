import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
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
		address: {
			type: String,
			default: null,
		},
		contact: {
			type: String,
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const CobrowseOrganization = mongoose.model(
	"CobrowseOrganization",
	organizationSchema
);

export default CobrowseOrganization;
