import mongoose from "mongoose";

const cobrowseAgentSchema = new mongoose.Schema(
	{
		agentName: {
			type: String,
			required: true,
		},
		licenseKey: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		accountId: {
			type: String,
		},
	},
	{ timestamps: true }
);

const CobrowseAgent = mongoose.model("CobrowseAgent", cobrowseAgentSchema);

export default CobrowseAgent;
