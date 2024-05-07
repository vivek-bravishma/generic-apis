import mongoose from "mongoose";

const voicebotCustomerSchema = new mongoose.Schema(
	{
		Name: {
			type: String,
			required: true,
		},
		Mobile: {
			type: String,
			required: true,
		},
		IsVipCustomer: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const VoicebotCustomer = mongoose.model(
	"VoicebotCustomer",
	voicebotCustomerSchema
);

export default VoicebotCustomer;
