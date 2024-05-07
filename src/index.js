import config from "./utils/config.js";
global.CONFIG = config[process.env.NODE_ENV ?? "PRODUCTION"];

import WebSocket from "ws";

import {
	AzureKeyCredential,
	TextAnalyticsClient,
} from "@azure/ai-text-analytics";

import TextTranslationClient from "@azure-rest/ai-translation-text";

import mongoose from "mongoose";
import Ticket from "./models/ticket.js";
import CobrowseAgent from "./models/cobrowseAgent.js";
import CobrowseOrganization from "./models/cobrowse/organization.js";
import CobrowseLicense from "./models/cobrowse/license.js";
import CobrowseUser from "./models/cobrowse/user.js";
import VoicebotCustomer from "./models/voicebot_customer.js";

console.log("Generic api env==> ", {
	nodeEnv: process.env.NODE_ENV,
	nodePort: process.env.PORT,
});
console.log("Generic api config==> ", CONFIG);

import express from "express";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";

import helper from "./helpers/index.js";
import cobroser from "./helpers/cobroser.js";

const { fetchAvayaToken, getAvayaMetricsQueue } = helper;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = CONFIG.PORT || 5155;

app.get("/", (req, res) => {
	res.send("Api working");
});

app.post("/v1", (req, res) => {
	console.log("v1 called");
	res.send({ fulfillmentText: "Hello from the webhook!", success: true });
});

app.post("/v2", (req, res) => {
	console.log("v2 called");
	res.send({
		fulfillmentResponse: {
			messages: [
				{
					text: {
						text: ["this is a sample <h1> text</h1> from webhook"],
					},
				},
			],
		},
	});
});

app.post("/v3", (req, res) => {
	console.log("v3 called");

	let data = JSON.stringify({
		serviceType: "EXCESS_BAGGAGE",
		token: "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ZfHOBblfth-ijFM3KcAYu-1harmXgxBJUCwwo56EkuJWDoZA-d-zhN6km-ykucoPCt8rP2ysANu4A8M_g4U4yimBkoPCFsY1GGEruX_5nODIP9nIFQ_RqSjRk0s9CwNpdYkS_tsTennz8VyDGTtx7BErcQBk1DMXpNxhd3Gm1ckjl-Fvqp5efI3YzPV6tsKkvRGrUgv25mDxCPHMKmjhUnFgMyoU7Ly_czRpk0z59HCXcnfnSKp4tJG4BE3O9DfnyvOL1TINyHhH5U6dqHSbec3y94EJnv-daOS56T6HygYz1Qw4gyWgogZrX44CH5NXg5LfcFuVFiGzcjvZwXxg-w.U6Jqe6r_okFHJNKvJ_WlYQ.k6GoaJe3MgtRwI5Lp0giFKWOoB85szcXQqYJuyf5maBnIepHEa2y_il-f9Y20favJ8-dtCU7qVw8yUl8BIbEVmPvLcTDsXXY6eTH9r3H7-kF5Wg5DEXbGViCB1nsNb9shAc7enDo4qJRVOt7AU5ABgXdcSsZodebA_BuH7HUSVHZO8n18DeNyg2Gvva-IHX7Q1xUbgrzcLeD_jU2Dv1QDqShleEgxTEloyKxw9bEq9axRvP7jBDDG832KFodN6exMzlqX5nyj-zfgUvjuuMxwek-jmxEBuEU0F9db_zvzcmcIJ6qAr4A1NgCP483xss162wVNC_W07mS4_xKLDcXbahwhFs1c2vhGhO6Pv70A4gZ1h2NlecrS_j74y5ZHi1AToYDJNwgzt5XSICfqd72JA.7Zwdrmk5igEXCBXYBSUu0Em6H8LElvBYxCWJpxF2Ah4",
	});

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://dfstg.qatarairways.com/stg/api/public/bff/mobile/standaloneancillary-web/mycart/services-eligibility",
		headers: {
			"Content-Type": "application/json",
			deviceId: "8521eb53-3655-440c-a5ce-8e8855409e47",
			accessToken: "8521eb53-3655-440c-a5ce-8e8855409e48",
			"X-AssignedDeviceID": "8521eb53-3655-440c-a5ce-8e8855409e47",
		},
		data: data,
	};

	axios
		.request(config)
		.then((response) => {
			//   console.log(JSON.stringify(response.data));
			res.send(response.data);
		})
		.catch((error) => {
			console.log(error);
			res.send(error);
		});
});

app.post("/v4", (req, res) => {
	let data = JSON.stringify({
		serviceType: "EXCESS_BAGGAGE",
		token: "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ZfHOBblfth-ijFM3KcAYu-1harmXgxBJUCwwo56EkuJWDoZA-d-zhN6km-ykucoPCt8rP2ysANu4A8M_g4U4yimBkoPCFsY1GGEruX_5nODIP9nIFQ_RqSjRk0s9CwNpdYkS_tsTennz8VyDGTtx7BErcQBk1DMXpNxhd3Gm1ckjl-Fvqp5efI3YzPV6tsKkvRGrUgv25mDxCPHMKmjhUnFgMyoU7Ly_czRpk0z59HCXcnfnSKp4tJG4BE3O9DfnyvOL1TINyHhH5U6dqHSbec3y94EJnv-daOS56T6HygYz1Qw4gyWgogZrX44CH5NXg5LfcFuVFiGzcjvZwXxg-w.U6Jqe6r_okFHJNKvJ_WlYQ.k6GoaJe3MgtRwI5Lp0giFKWOoB85szcXQqYJuyf5maBnIepHEa2y_il-f9Y20favJ8-dtCU7qVw8yUl8BIbEVmPvLcTDsXXY6eTH9r3H7-kF5Wg5DEXbGViCB1nsNb9shAc7enDo4qJRVOt7AU5ABgXdcSsZodebA_BuH7HUSVHZO8n18DeNyg2Gvva-IHX7Q1xUbgrzcLeD_jU2Dv1QDqShleEgxTEloyKxw9bEq9axRvP7jBDDG832KFodN6exMzlqX5nyj-zfgUvjuuMxwek-jmxEBuEU0F9db_zvzcmcIJ6qAr4A1NgCP483xss162wVNC_W07mS4_xKLDcXbahwhFs1c2vhGhO6Pv70A4gZ1h2NlecrS_j74y5ZHi1AToYDJNwgzt5XSICfqd72JA.7Zwdrmk5igEXCBXYBSUu0Em6H8LElvBYxCWJpxF2Ah4",
	});

	let apiconfig = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://dfstg.qatarairways.com/stg/api/public/bff/mobile/standaloneancillary-web/mycart/services-eligibility",
		headers: {
			"Content-Type": "application/json",
			deviceId: "8521eb53-3655-440c-a5ce-8e8855409e47",
			accessToken: "8521eb53-3655-440c-a5ce-8e8855409e48",
			"X-AssignedDeviceID": "8521eb53-3655-440c-a5ce-8e8855409e47",
		},
		data: data,
	};

	axios
		.request(apiconfig)
		.then((response) => {
			//   console.log(JSON.stringify(response.data));
			res.send(
				response.data.trip.bounds[0].baggageAllowanceSpecifications[0]
			);
		})
		.catch((error) => {
			console.log(error);
			res.send(error);
		});
});

app.post("/v5", (req, res) => {
	console.log("v5 called");
	res.send({
		fulfillmentResponse: {
			messages: [
				{
					text: {
						text: ["This is a text response.", "Custom Parameter"],
					},
				},
				{
					image: {
						imageUri: "https://picsum.photos/300/200",
					},
				},
				{
					card: {
						title: "Card Title",
						subtitle: "Card Subtitle",
						imageUri: "https://picsum.photos/300/200",
						buttons: [
							{
								text: "Button Text",
								postback: "Button Postback",
							},
						],
					},
				},
				{
					quickReplies: {
						quickReplies: ["Quick Reply 1", "Quick Reply 2"],
					},
				},
				{
					payload: {
						google: {
							expectUserResponse: true,
							richResponse: {
								items: [
									{
										simpleResponse: {
											textToSpeech:
												"This is a TTS response.",
										},
									},
								],
							},
						},
					},
				},
			],
		},
	});
});

app.post("/v6", (req, res) => {
	console.log("v6 called");
	res.send({
		fulfillmentResponse: {
			messages: [
				{
					text: {
						text: [
							"You are entitled to  bring one piece of hand baggage weighing 7 kilograms and one checked baggage weighing 30 kilograms.",
						],
					},
				},
			],
		},
	});
});

app.post("/v7", (req, res) => {
	console.log("v7 called");
	res.send({
		fulfillmentResponse: {
			messages: [
				{
					text: {
						text: [
							`Your Baggage Allowance :
1)  type : HAND_BAGGAGE
	quantity : 1
	weight : 7KG
2)  type : CHECKED
	weight : 30KG`,
						],
					},
				},
			],
		},
	});
});

app.post("/v8", async (req, res) => {
	console.log("v8 called");

	let data = JSON.stringify({
		serviceType: "EXCESS_BAGGAGE",
		token: "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ZfHOBblfth-ijFM3KcAYu-1harmXgxBJUCwwo56EkuJWDoZA-d-zhN6km-ykucoPCt8rP2ysANu4A8M_g4U4yimBkoPCFsY1GGEruX_5nODIP9nIFQ_RqSjRk0s9CwNpdYkS_tsTennz8VyDGTtx7BErcQBk1DMXpNxhd3Gm1ckjl-Fvqp5efI3YzPV6tsKkvRGrUgv25mDxCPHMKmjhUnFgMyoU7Ly_czRpk0z59HCXcnfnSKp4tJG4BE3O9DfnyvOL1TINyHhH5U6dqHSbec3y94EJnv-daOS56T6HygYz1Qw4gyWgogZrX44CH5NXg5LfcFuVFiGzcjvZwXxg-w.U6Jqe6r_okFHJNKvJ_WlYQ.k6GoaJe3MgtRwI5Lp0giFKWOoB85szcXQqYJuyf5maBnIepHEa2y_il-f9Y20favJ8-dtCU7qVw8yUl8BIbEVmPvLcTDsXXY6eTH9r3H7-kF5Wg5DEXbGViCB1nsNb9shAc7enDo4qJRVOt7AU5ABgXdcSsZodebA_BuH7HUSVHZO8n18DeNyg2Gvva-IHX7Q1xUbgrzcLeD_jU2Dv1QDqShleEgxTEloyKxw9bEq9axRvP7jBDDG832KFodN6exMzlqX5nyj-zfgUvjuuMxwek-jmxEBuEU0F9db_zvzcmcIJ6qAr4A1NgCP483xss162wVNC_W07mS4_xKLDcXbahwhFs1c2vhGhO6Pv70A4gZ1h2NlecrS_j74y5ZHi1AToYDJNwgzt5XSICfqd72JA.7Zwdrmk5igEXCBXYBSUu0Em6H8LElvBYxCWJpxF2Ah4",
	});

	let apiconfig = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://dfstg.qatarairways.com/stg/api/public/bff/mobile/standaloneancillary-web/mycart/services-eligibility",
		headers: {
			"Content-Type": "application/json",
			deviceId: "8521eb53-3655-440c-a5ce-8e8855409e47",
			accessToken: "8521eb53-3655-440c-a5ce-8e8855409e48",
			"X-AssignedDeviceID": "8521eb53-3655-440c-a5ce-8e8855409e47",
		},
		data: data,
	};

	let responseData = (await axios.request(apiconfig))?.data?.trip?.bounds[0]
		?.baggageAllowanceSpecifications;

	let bag1 = {
		quantity: responseData[0].quantity,
		type: responseData[0].baggageType,
		unit: responseData[0].baggageCharacteristics.unit,
		weight: responseData[0].baggageCharacteristics.weight,
	};
	let bag2 = {
		type: responseData[1].baggageType,
		unit: responseData[1].baggageCharacteristics.unit,
		weight: responseData[1].baggageCharacteristics.weight,
	};

	let respText = `You are entitled to  bring ${bag1.quantity} piece/pieces of ${bag1.type} weighing ${bag1.weight}${bag1.unit} and a ${bag2.type} baggage weighing ${bag2.weight}${bag2.unit}.`;

	res.send({
		fulfillmentResponse: {
			messages: [
				{
					text: {
						text: [respText],
					},
				},
			],
		},
	});
});

app.post("/v9", async (req, res) => {
	console.log("v9 called");

	let data = JSON.stringify({
		serviceType: "EXCESS_BAGGAGE",
		token: "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ZfHOBblfth-ijFM3KcAYu-1harmXgxBJUCwwo56EkuJWDoZA-d-zhN6km-ykucoPCt8rP2ysANu4A8M_g4U4yimBkoPCFsY1GGEruX_5nODIP9nIFQ_RqSjRk0s9CwNpdYkS_tsTennz8VyDGTtx7BErcQBk1DMXpNxhd3Gm1ckjl-Fvqp5efI3YzPV6tsKkvRGrUgv25mDxCPHMKmjhUnFgMyoU7Ly_czRpk0z59HCXcnfnSKp4tJG4BE3O9DfnyvOL1TINyHhH5U6dqHSbec3y94EJnv-daOS56T6HygYz1Qw4gyWgogZrX44CH5NXg5LfcFuVFiGzcjvZwXxg-w.U6Jqe6r_okFHJNKvJ_WlYQ.k6GoaJe3MgtRwI5Lp0giFKWOoB85szcXQqYJuyf5maBnIepHEa2y_il-f9Y20favJ8-dtCU7qVw8yUl8BIbEVmPvLcTDsXXY6eTH9r3H7-kF5Wg5DEXbGViCB1nsNb9shAc7enDo4qJRVOt7AU5ABgXdcSsZodebA_BuH7HUSVHZO8n18DeNyg2Gvva-IHX7Q1xUbgrzcLeD_jU2Dv1QDqShleEgxTEloyKxw9bEq9axRvP7jBDDG832KFodN6exMzlqX5nyj-zfgUvjuuMxwek-jmxEBuEU0F9db_zvzcmcIJ6qAr4A1NgCP483xss162wVNC_W07mS4_xKLDcXbahwhFs1c2vhGhO6Pv70A4gZ1h2NlecrS_j74y5ZHi1AToYDJNwgzt5XSICfqd72JA.7Zwdrmk5igEXCBXYBSUu0Em6H8LElvBYxCWJpxF2Ah4",
	});

	let apiconfig = {
		method: "post",
		maxBodyLength: Infinity,
		url: "https://dfstg.qatarairways.com/stg/api/public/bff/mobile/standaloneancillary-web/mycart/services-eligibility",
		headers: {
			"Content-Type": "application/json",
			deviceId: "8521eb53-3655-440c-a5ce-8e8855409e47",
			accessToken: "8521eb53-3655-440c-a5ce-8e8855409e48",
			"X-AssignedDeviceID": "8521eb53-3655-440c-a5ce-8e8855409e47",
		},
		data: data,
	};

	let responseData = (await axios.request(apiconfig))?.data?.trip?.bounds[0]
		?.baggageAllowanceSpecifications;

	let bag1 = {
		quantity: responseData[0].quantity,
		type: responseData[0].baggageType,
		unit: responseData[0].baggageCharacteristics.unit,
		weight: responseData[0].baggageCharacteristics.weight,
	};
	let bag2 = {
		type: responseData[1].baggageType,
		unit: responseData[1].baggageCharacteristics.unit,
		weight: responseData[1].baggageCharacteristics.weight,
	};

	let respText = `Your Baggage Allowance :
1)  type : ${bag1.type}
	quantity : ${bag1.quantity}
	weight : ${bag1.weight}${bag1.unit}
2)  type : ${bag2.type}
	weight : ${bag2.weight}${bag2.unit}`;

	res.send({
		fulfillmentResponse: {
			messages: [
				{
					text: {
						text: [respText],
					},
				},
			],
		},
	});
});

app.post("/journey-auth", async (req, res) => {
	let { userId, sessionId } = req.body;
	if (!userId.trim() || !sessionId.trim()) {
		return res.status(400).send("userId or sessionId missing");
	}

	let authRes = await journeySocket(userId, sessionId);
	console.log(authRes);

	return res.send(authRes);
});

async function journeySocket(userId, sessionId) {
	return new Promise((resolve, reject) => {
		const url = `wss://app.journeyid.io/api/iframe/ws/users/${userId}/sessions/${sessionId}`;

		let ws = new WebSocket(url);

		ws.on("open", () => {
			console.log("Connected to websocket");
			ws.send(
				"CONNECT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrYW1sZXNoamFpbiIsImlmciI6IjBlYjcyNDUzLTZmNmMtNDdhMC05YmRhLWYyOTFkN2E1MDNhOCIsImV4cCI6MTcwODY4NTAyNzgzOSwiaWF0IjoxNzA4Njg0OTQxfQ.28rpU-75lyTBO8ZpBP9HrlaWLZNMvc1qekZq92dNGFI"
			);
		});

		ws.on("message", (data) => {
			let messageData = JSON.parse(data);
			console.log("Received message:", messageData.event);

			if (
				messageData.event === "session-authenticated" ||
				messageData.event === "execution-completed"
			) {
				ws.close();
				resolve({ authentication: true });
			}
		});

		ws.on("close", () => {
			console.log("Connection closed");
			// connect();
		});

		ws.on("error", (err) => {
			reject(err);
		});
	});
}

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// ============================ MongoDB connection ============================

mongoose
	.connect(
		"mongodb+srv://vivek:xmM6t85qbIHWlgZx@vivek-custer.kk8uhws.mongodb.net/avaya?retryWrites=true&w=majority&appName=ViveK-Custer"
	)
	.then(
		() => console.log("connected to db"),
		(err) => console.log("Error connecting db", err)
	);

// ========================= XXX MongoDB connection XXX =========================

// ============================ Ticketing System ============================

app.post("/tickets", async (req, res) => {
	const { title, description, reporter } = req.body;
	console.log(req.body);
	if (!title.trim() || !description.trim() || !reporter.trim()) {
		return res.status(400).send("title, description or reporter missing");
	}
	try {
		const totalTickets = await Ticket.countDocuments({});
		const caseId = `case-${totalTickets + 1}`;
		console.log(totalTickets);
		const ticket = new Ticket({
			title,
			description,
			reporter,
			caseId,
		});
		await ticket.save();
		res.send(ticket);
	} catch (error) {
		console.log(error.message);
		res.status(404).send(error);
	}
});

app.get("/tickets", async (req, res) => {
	try {
		const tickets = await Ticket.find({});
		res.send(tickets);
	} catch (error) {
		res.status(404).send(error);
	}
});

app.get("/tickets/:id", async (req, res) => {
	try {
		const ticket = await Ticket.findOne({ caseId: req.params.id });
		if (!ticket) {
			return res.status(404).send("Ticket not found");
		}
		res.send(ticket);
	} catch (error) {
		res.status(404).send(error);
	}
});

app.patch("/tickets/:id", async (req, res) => {
	try {
		const ticket = await Ticket.findOneAndUpdate(
			{ caseId: req.params.id },
			req.body,
			{ new: false }
		);
		if (!ticket) {
			return res.status(404).send("Ticket not found");
		}
		res.send(ticket);
	} catch (error) {
		res.status(404).send(error);
	}
});

app.delete("/tickets/:id", async (req, res) => {
	try {
		await Ticket.findOneAndDelete({ caseId: req.params.id });
		res.status(200).send("Ticket deleted");
	} catch (error) {
		res.status(404).send(error);
	}
});

// ========================= XXX Ticketing System XXX =========================

// ============================ Avaya metrics System ============================

app.post("/metrics-data", async (req, res) => {
	try {
		let tokenData = await fetchAvayaToken();

		let metricsData = await getAvayaMetricsQueue(tokenData.access_token);
		res.send(metricsData);
	} catch (error) {
		res.status(404).send(error);
	}
});

// ========================= XXX Avaya metrics System XXX =========================

// ============================ Cobarowse agent System ============================

app.post("/cobrowse/accounts", async (req, res) => {
	const { agentName, licenseKey, token, accountId } = req.body;
	console.log(req.body);
	if (!agentName.trim() || !licenseKey.trim() || !token.trim()) {
		return res.status(400).send("agentName, licenseKey or token missing");
	}
	try {
		const cobrowseAgent = new CobrowseAgent({
			agentName,
			licenseKey,
			token,
			accountId,
		});
		await cobrowseAgent.save();
		res.send(cobrowseAgent);
	} catch (error) {
		console.log("Error creating new cobrowse agent=> ", error.message);
		res.status(404).send(error);
	}
});

app.get("/cobrowse/accounts", async (req, res) => {
	try {
		const cobrowseAgents = await CobrowseAgent.find({});
		res.send(cobrowseAgents);
	} catch (error) {
		console.log("Error getting cobrowse agents=> ", error.message);
		res.status(404).send(error);
	}
});

app.get("/cobrowse/accounts/:id", async (req, res) => {
	try {
		const cobrowseAgent = await CobrowseAgent.findOne({
			_id: req.params.id,
		});
		if (!cobrowseAgent) {
			return res.status(404).send("Cobrowse Agent not found");
		}
		res.send(cobrowseAgent);
	} catch (error) {
		console.log(
			`Error getting cobrowse agent with id ${req.params.id}=> `,
			error.message
		);
		res.status(404).send(error);
	}
});

app.patch("/cobrowse/accounts/:id", async (req, res) => {
	console.log("update body==> ", req.body);

	try {
		const { agentName, licenseKey, token, accountId } = req.body;
		let payload = {
			agentName: agentName?.trim(),
			licenseKey: licenseKey?.trim(),
			token: token?.trim(),
			accountId: accountId?.trim(),
		};

		console.log("update payload==> ", payload);
		const cobrowseAgent = await CobrowseAgent.findOneAndUpdate(
			{ _id: req.params.id },
			payload,
			{ new: true }
		);
		if (!cobrowseAgent) {
			return res.status(404).send("Cobrowse Agent not found");
		}
		res.send(cobrowseAgent);
	} catch (error) {
		console.log(
			`Error updating cobrowse agent with id ${req.params.id}`,
			error.message
		);
		res.status(404).send(error);
	}
});

app.delete("/cobrowse/accounts/:id", async (req, res) => {
	try {
		await CobrowseAgent.findOneAndDelete({ _id: req.params.id });
		res.status(200).send("Cobrowse Agent deleted");
	} catch (error) {
		console.log(
			`Error deleting cobrowse agent with id ${req.params.id}`,
			error.message
		);
		res.status(404).send(error);
	}
});
// ========================= XXX Cobarowse agent System XXX =========================

// ============================  Vonage api  ============================

app.post("/inbound", (req, res) => {
	console.log("Inbound : ", req.body);
	res.send("Inbound Api working");
});
app.post("/status", (req, res) => {
	console.log("Status : ", req.body);
	res.send("Status Api working");
});

app.post("/send-vonage-sms", async (req, res) => {
	try {
		const { from, text, to, api_key, api_secret } = req.body;

		if (!to || !from || !text || !api_key || !api_secret) {
			return res
				.status(400)
				.send("from, text, to, api_key and api_secret is required");
		}

		let vonagePayload = { from, text, to, api_key, api_secret };
		let vonageUrl = "https://rest.nexmo.com/sms/json";

		let vonageResponse = await axios.post(vonageUrl, vonagePayload);

		res.send(vonageResponse.data);
	} catch (error) {
		res.status(400).send(error);
	}
});

// ========================= XXX Vonage api XXX =========================

// ============================  translation and sentiment apis  ============================

const testSentiEndpoint =
	"https://nlp-ai-chatbot-service.cognitiveservices.azure.com/";
const testSentiKey = "1247acc61cb64ac68787c7994ab7b929";
const textAnalyticsClient = new TextAnalyticsClient(
	testSentiEndpoint,
	new AzureKeyCredential(testSentiKey)
);

const transEndPnoit = "https://api.cognitive.microsofttranslator.com/";
const transKey = "d8c2c98fae25486ba4c9617ae379de9a";
const transReg = "eastus";
const transClient = TextTranslationClient.default(transEndPnoit, {
	key: transKey,
	region: transReg,
});

app.post("/analyze-sentiment", async (req, res) => {
	try {
		let msg = req.body.message;
		let msgSentiment = await getMessageSentiment(msg);
		res.send(msgSentiment);
	} catch (error) {
		res.send(error);
	}
});

app.post("/overall-sentiment", async (req, res) => {
	try {
		let msgs = req.body.messages;
		let msgsSentiment = await getOverallSentiment(msgs);
		res.send(msgsSentiment);
	} catch (error) {
		res.send(error);
	}
});

app.get("/translate-message", async (req, res) => {
	const { message, langs } = req.query;

	try {
		let transResponse = await translateMessage(message, langs);
		res.send(transResponse);
	} catch (error) {
		res.send({ error: error.message });
	}

	// // message=这个怎么翻译&langs=en&langs=hi
	// let fu = await translateMessage("这个怎么翻译", ["hi", "en"]);
	// console.log("fu=> ", JSON.stringify(fu));
});

async function getMessageSentiment(message) {
	try {
		let sentiment = await textAnalyticsClient.analyzeSentiment([message]);
		return sentiment;
	} catch (error) {
		throw new Error(error);
	}
}
async function getOverallSentiment(messages) {
	try {
		let sentiments = await textAnalyticsClient.analyzeSentiment(messages);

		let overAllSentimentScore = 0.0;
		let msgCount = 0;

		sentiments.forEach((sentiment) => {
			let scores = sentiment.confidenceScores;
			let messageSentimentScore = scores.positive - scores.negative;
			overAllSentimentScore += messageSentimentScore;
			msgCount++;
		});

		let averageSentimentScore = overAllSentimentScore / msgCount;
		let threshold = 0.6;
		let overAllSentiment;
		if (averageSentimentScore > threshold) {
			overAllSentiment = "positive";
		} else if (averageSentimentScore < 0.2) {
			overAllSentiment = "negative";
		} else {
			overAllSentiment = "neutral";
		}

		return {
			sentiments,
			overAllSentiment,
			averageSentimentScore,
		};
	} catch (error) {
		throw new Error(error);
	}
}
async function translateMessage(message, langs = ["en"]) {
	// console.log("translateMessage langs==>", langs);
	try {
		let resp = { originalMessage: message };
		let inputText = [{ text: message }];
		let transResp = (
			await transClient.path("/translate").post({
				body: inputText,
				queryParameters: {
					to: langs,
					// to: ["en", "hi"],
					// from: "hi",
				},
			})
		).body;

		if (transResp.error) {
			throw new Error(transResp.error.message);
		}

		transResp.forEach((translations) => {
			resp.detectedLanguage = translations.detectedLanguage.language;
			resp.detectedLanguageScore = translations.detectedLanguage.score;
			translations.translations.forEach((translation) => {
				resp[`translatedMessage_${translation.to}`] = translation.text;
			});
		});

		return resp;
	} catch (error) {
		throw new Error(error.message);
	}
}

// ============================ XXX translation and sentiment apis XXX  ============================

//	=============================     Cobrowse backend     =============================
// Cobrowse Organization

const cobrowseHelper = cobroser(CobrowseUser);

function getcookie(req) {
	let cookie = req.headers.cookie;
	if (!cookie) {
		return {};
	}
	let myCookies = {};
	cookie.split("; ").map((c) => {
		let [key, value] = c.split("=");
		myCookies[key] = value;
	});
	return myCookies;
}

// auth middleware
async function authMiddleware(req, res, next) {
	try {
		const { accessToken, refreshToken } = getcookie(req);
		if (!accessToken) {
			return res.send({ message: "Unauthorized" });
		}
		const { payload, expired } = cobrowseHelper.verifyJWT(
			accessToken,
			true
		);
		if (payload) {
			req.user = payload;
			return next();
		}

		console.log("========refreshToken=========> ", refreshToken);

		const { payload: refresh } =
			expired && refreshToken
				? cobrowseHelper.verifyJWT(refreshToken, false)
				: { payload: null };

		console.log("=========refresh========> ", refresh);

		if (!refresh) {
			return next();
		}
		let { iat, exp, ...newPayload } = refresh;
		const newAccessToken = cobrowseHelper.signJwt(newPayload, true);

		res.cookie("accessToken", newAccessToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 1,
		});

		return next();
	} catch (error) {
		console.log("=========error.message========> ", error.message);
	}
}

class serializeCobroUser {
	constructor(user) {
		this.username = user.name;
		this.email = user.email;
		this.contact = user.contact;
		this.organizationId = user.organizationId;
		this.userId = user._id;
	}
}
class serializeCobroOrg {
	constructor(org) {
		this.organizationName = org.name;
		this.email = org.email;
		this.contact = org.contact;
		this.address = org.address;
	}
}
class serializeCobroLicense {
	constructor(lic) {
		this.licenseKey = lic.licenseKey;
		this.token = lic.token;
		this.userId = lic.userId;
		this.organizationId = lic.orgnizationId;
	}
}

app.post("/cobrowse/orgs", async (req, res) => {
	const { name, email, contact, address } = req.body;
	if (!name.trim() || !email.trim()) {
		return res
			.status(400)
			.send({ error: "Organization name and email is required" });
	}

	try {
		const org = new CobrowseOrganization({
			name,
			email,
			contact,
			address,
		});
		await org.save();
		const user = await createCobrowseUser({
			name,
			email,
			contact,
			organizationId: org._id,
		});

		res.status(201).send(new serializeCobroUser(user));
	} catch (error) {
		console.log("Error creating cobro Org --> ", error);
		if (error.code === 11000) {
			return res.status(400).send({
				error: "Organization already exists with same email",
			});
		}
		res.status(400).send({ error: error.message });
	}
});

app.get("/cobrowse/orgs", async (req, res) => {
	try {
		const orgs = await CobrowseOrganization.find({});
		res.send(orgs);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.get("/cobrowse/orgs/:id", async (req, res) => {
	try {
		const org = await CobrowseOrganization.findOne({ _id: req.params.id });
		if (!org) {
			return res.status(404).send("Organization not found");
		}
		res.send(org);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.patch("/cobrowse/orgs/:id", async (req, res) => {
	try {
		console.log("wtf");
		const { name, email, contact, address } = req.body;
		const org = await CobrowseOrganization.findOneAndUpdate(
			{ _id: req.params.id },
			{ name, email, contact, address },
			{ new: true }
		);
		if (!org) {
			return res.status(404).send("Organization not found");
		}
		res.send(org);
	} catch (error) {
		console.log("Err updating cobrowse org=> ", error);
		res.status(404).send(error.message);
	}
});

app.delete("/cobrowse/orgs/:id", async (req, res) => {
	try {
		await CobrowseOrganization.findByIdAndUpdate(
			{ _id: req.params.id },
			{ isDeleted: true }
		);
		res.status(200).send("Organization deleted");
	} catch (error) {
		res.status(404).send(error);
	}
});

// Cobrowse User

// login
app.post("/cobrowse/user/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).send({ error: "Email and password required" });
	}

	try {
		let userData = await cobrowseHelper.login(email, password);

		res.cookie("accessToken", userData.accessToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 1,
		});
		res.cookie("refreshToken", userData.refreshToken, {
			httpOnly: true,
			maxAge: 1000 * 60 * 5,
		});

		res.status(200).send(new serializeCobroUser(userData.user));
	} catch (error) {
		console.log("Error cobrowse user login  --> ", error);
		res.status(400).send({ error: error.message });
	}
});

app.get("/cobrowse/login/test", authMiddleware, async (req, res) => {
	res.send(req.user);
});

// logout
app.post("/cobrowse/user/logout", async (req, res) => {
	try {
		// await cobrowseHelper.logout()
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
	} catch (error) {
		console.log("Error cobrowse user logout --> ", error);
		res.status(400).send(error.message);
	}
});

app.post("/cobrowse/users", async (req, res) => {
	const { name, email, password, contact, organizationId } = req.body;
	if (!name.trim() || !email.trim()) {
		return res.status(400).send(" name and email is required");
	}

	try {
		const user = await createCobrowseUser({
			name,
			email,
			password,
			contact,
			organizationId,
		});

		res.send(user);
	} catch (error) {
		console.log("Error creating cobrowse user => ", error);
		if (error.code === 11000) {
			return res.status(400).send("User already exists with same email");
		}
		res.status(400).send(error);
	}
});

app.get("/cobrowse/users", async (req, res) => {
	try {
		const users = await CobrowseUser.find({});
		res.send(users);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.get("/cobrowse/users/:id", async (req, res) => {
	try {
		const user = await CobrowseUser.findOne({ _id: req.params.id });
		if (!user) {
			return res.status(404).send("User not found");
		}
		res.send(user);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.patch("/cobrowse/users/:id", async (req, res) => {
	try {
		const { name, email, contact, address } = req.body;
		const org = await CobrowseUser.findOneAndUpdate(
			{ _id: req.params.id },
			{ name, email, contact, address },
			{ new: true }
		);
		if (!org) {
			return res.status(404).send("Organization not found");
		}
		res.send(org);
	} catch (error) {
		console.log("Err updating cobrowse org=> ", error);
		res.status(404).send(error.message);
	}
});

app.delete("/cobrowse/users/:id", async (req, res) => {
	try {
		await CobrowseUser.findByIdAndUpdate(
			{ _id: req.params.id },
			{ isDeleted: true }
		);
		res.status(200).send("User deleted");
	} catch (error) {
		res.status(404).send(error);
	}
});

// Cobrowse License
app.post("/cobrowse/licenses", async (req, res) => {
	const { licenseKey, token, userId, organizationId } = req.body;
	if (!licenseKey.trim() || !token.trim() || !organizationId.trim()) {
		return res
			.status(400)
			.send("licenseKey, token and organizationId is required");
	}

	try {
		const license = new CobrowseLicense({
			licenseKey,
			token,
			userId,
			organizationId,
		});
		await license.save();

		res.send(license);
	} catch (error) {
		console.log("Error creating cobrowse license => ", error);
		res.status(400).send(error);
	}
});

app.get("/cobrowse/licenses", async (req, res) => {
	try {
		const licenses = await CobrowseLicense.find({});
		res.send(licenses);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.get("/cobrowse/licenses/:id", async (req, res) => {
	try {
		const license = await CobrowseLicense.findOne({ _id: req.params.id });
		if (!license) {
			return res.status(404).send("License not found");
		}
		res.send(license);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.patch("/cobrowse/licenses/:id", async (req, res) => {
	try {
		const { licenseKey, token, userId, orgnizationId } = req.body;
		const license = await CobrowseLicense.findOneAndUpdate(
			{ _id: req.params.id },
			{ licenseKey, token, userId, orgnizationId },
			{ new: true }
		);
		if (!license) {
			return res.status(404).send("license not found");
		}
		res.send(license);
	} catch (error) {
		console.log("Err updating cobrowse license => ", error);
		res.status(404).send(error.message);
	}
});

app.delete("/cobrowse/licenses/:id", async (req, res) => {
	try {
		await CobrowseLicense.findByIdAndUpdate(
			{ _id: req.params.id },
			{ isDeleted: true }
		);
		res.status(200).send("License deleted");
	} catch (error) {
		res.status(404).send(error);
	}
});

// 	=========== functions ==========
async function createCobrowseUser(userDetails) {
	try {
		const user = new CobrowseUser(userDetails);
		await user.save();
		return user;
	} catch (error) {
		throw new Error(error);
	}
}

async function deleteAll(organizationId, model) {
	try {
		let usrs = await model.updateMany(
			{ organizationId: organizationId },
			{ isDeleted: true }
		);
		return usrs;
	} catch (error) {
		throw new Error(error);
	}
}

//	============================= XXX Cobrowse backend XXX ==========================

//	=========================  Avaya messaging connector backend  =========================

//	=====================  XXX Avaya messaging connector backend XXX  =====================

//	=========================  Voice bot customer backend  =========================

app.get("/voice-bot/customers", async (req, res) => {
	try {
		const customers = await VoiceBotCustomer.find({});
		res.send(customers);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.post("/voice-bot/customers", async (req, res) => {
	try {
		const { name, mobile, isVipCustomer } = req.body;
		const customer = new VoiceBotCustomer({
			name,
			mobile,
			isVipCustomer,
		});
		await customer.save();
		res.send(customer);
	} catch (error) {
		res.status(400).send(error);
	}
});
//	=====================  XXX Voice bot customer backend XXX  =====================
