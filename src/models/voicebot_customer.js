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
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const VoicebotCustomer = mongoose.model(
	"Voicebot_Customer",
	voicebotCustomerSchema
);

export default VoicebotCustomer;
