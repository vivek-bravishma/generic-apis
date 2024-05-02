import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema(
	{
		licenseKey: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CobrowseUser",
		},
		orgnizationId: {
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

const CobrowseLicense = mongoose.model("CobrowseLicense", licenseSchema);

export default CobrowseLicense;
