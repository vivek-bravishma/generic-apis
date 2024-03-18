import axios from "axios";

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

export default { fetchAvayaToken, getAvayaMetricsQueue };
