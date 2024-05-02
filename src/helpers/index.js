import axios from "axios";
import api from "api";

async function fetchAvayaToken() {
	try {
		let data = {
			grant_type: "client_credentials",
			client_id: "clientApp1",
			client_secret: "b4722e9c-9f81-46bf-b442-fa9d9c9c869f",
		};

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://experience.api.avayacloud.com/api/auth/v1/WOEZYD/protocol/openid-connect/token",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			data: data,
		};

		let response = await axios.request(config);
		return response.data;
	} catch (error) {
		throw error;
	}
}

async function getAvayaMetricsQueue(token) {
	try {
		let tokenData = await fetchAvayaToken();
		token = tokenData.access_token;
		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "https://experience.api.avayacloud.com/api/queue-metrics/v1/accounts/WOEZYD/queues/a731edb9-728f-4f46-a82a-8f4e9f415a01/channels/Voice/metrics",
			headers: {
				accept: "application/json",
				Cookie: "JSESSIONID=130FD2E28C8D123B92800BA2AD67D95D",
				Authorization: `Bearer ${token}`,
			},
		};

		let response = (await axios.request(config)).data;
		let processedData = { metricType: response.metricType };

		response.metrics.forEach((metric) => {
			processedData[metric.metricName] = metric.metricValue;
		});

		return processedData;
	} catch (error) {
		throw error;
	}
}

async function createAvayaSubscriptionSDK() {
	let tokenData = await fetchAvayaToken();

	avayaSdk = api("@avaya-experience-platform/v1.0#128n7522lske897r");

	sdk.auth(tokenData.access_token);
	// sdk.auth("appkey");
	sdk.createDigitalWebhookSubscription(
		{
			eventTypes: [
				"MESSAGES",
				"CUSTOMER_MESSAGES",
				"CC_MESSAGES",
				"PARTICIPANT_ADDED",
				"PARTICIPANT_DISCONNECTED",
			],
			channelProviderId: "channelProviderId",
			callbackUrl: "https://callbackUrl.com",
		},
		{ accountId: "acntID" }
	)
		.then(({ data }) => console.log(data))
		.catch((err) => console.error(err));
}

async function createAvayaSubscription() {
	let tokenData = await fetchAvayaToken();

	const options = {
		method: "POST",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: `Bearer ${tokenData.access_token}`,
			// appkey: 'appkey'
		},
		body: JSON.stringify({
			eventTypes: [
				"MESSAGES",
				"CUSTOMER_MESSAGES",
				"CC_MESSAGES",
				"PARTICIPANT_ADDED",
				"PARTICIPANT_DISCONNECTED",
			],
			channelProviderId: "channelProviderId",
			callbackUrl: "https://callbackUrl.com",
		}),
	};

	fetch(
		"https://host-regionf.api.avayacloud.com/api/digital/webhook/v1/accounts/acntID/subscriptions",
		options
	)
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((err) => console.error(err));
}

export default { fetchAvayaToken, getAvayaMetricsQueue };
