import config from "./utils/config.js";
global.CONFIG = config[process.env.NODE_ENV ?? "PRODUCTION"];

import WebSocket from "ws";

import mongoose from "mongoose";
import Ticket from "./models/ticket.js";
import CobrowseAgent from "./models/cobrowseAgent.js";

console.log("Generic api env==> ", {
	nodeEnv: process.env.NODE_ENV,
	nodePort: process.env.PORT,
});
console.log("Generic api config==> ", CONFIG);

import express from "express";
import cors from "cors";
import axios from "axios";

import helper from "./helpers/index.js";

const { fetchAvayaToken, getAvayaMetricsQueue } = helper;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
