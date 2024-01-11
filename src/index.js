import config from "./utils/config.js";
global.CONFIG = config[process.env.NODE_ENV ?? "PRODUCTION"];

console.log("Generic api env==> ", {
  nodeEnv: process.env.NODE_ENV,
  nodePort: process.env.PORT,
});
console.log("Generic api config==> ", CONFIG);

import express from "express";
import cors from "cors";
import axios from "axios";

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
            text: ["Hello from the webhook!", "customParameter43214321"],
          },
        },
      ],
    },
  });
});

app.post("/v3", (req, res) => {
  let data = JSON.stringify({
    serviceType: "EXCESS_BAGGAGE",
    token:
      "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ZfHOBblfth-ijFM3KcAYu-1harmXgxBJUCwwo56EkuJWDoZA-d-zhN6km-ykucoPCt8rP2ysANu4A8M_g4U4yimBkoPCFsY1GGEruX_5nODIP9nIFQ_RqSjRk0s9CwNpdYkS_tsTennz8VyDGTtx7BErcQBk1DMXpNxhd3Gm1ckjl-Fvqp5efI3YzPV6tsKkvRGrUgv25mDxCPHMKmjhUnFgMyoU7Ly_czRpk0z59HCXcnfnSKp4tJG4BE3O9DfnyvOL1TINyHhH5U6dqHSbec3y94EJnv-daOS56T6HygYz1Qw4gyWgogZrX44CH5NXg5LfcFuVFiGzcjvZwXxg-w.U6Jqe6r_okFHJNKvJ_WlYQ.k6GoaJe3MgtRwI5Lp0giFKWOoB85szcXQqYJuyf5maBnIepHEa2y_il-f9Y20favJ8-dtCU7qVw8yUl8BIbEVmPvLcTDsXXY6eTH9r3H7-kF5Wg5DEXbGViCB1nsNb9shAc7enDo4qJRVOt7AU5ABgXdcSsZodebA_BuH7HUSVHZO8n18DeNyg2Gvva-IHX7Q1xUbgrzcLeD_jU2Dv1QDqShleEgxTEloyKxw9bEq9axRvP7jBDDG832KFodN6exMzlqX5nyj-zfgUvjuuMxwek-jmxEBuEU0F9db_zvzcmcIJ6qAr4A1NgCP483xss162wVNC_W07mS4_xKLDcXbahwhFs1c2vhGhO6Pv70A4gZ1h2NlecrS_j74y5ZHi1AToYDJNwgzt5XSICfqd72JA.7Zwdrmk5igEXCBXYBSUu0Em6H8LElvBYxCWJpxF2Ah4",
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
      console.log(JSON.stringify(response.data));
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
    token:
      "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ZfHOBblfth-ijFM3KcAYu-1harmXgxBJUCwwo56EkuJWDoZA-d-zhN6km-ykucoPCt8rP2ysANu4A8M_g4U4yimBkoPCFsY1GGEruX_5nODIP9nIFQ_RqSjRk0s9CwNpdYkS_tsTennz8VyDGTtx7BErcQBk1DMXpNxhd3Gm1ckjl-Fvqp5efI3YzPV6tsKkvRGrUgv25mDxCPHMKmjhUnFgMyoU7Ly_czRpk0z59HCXcnfnSKp4tJG4BE3O9DfnyvOL1TINyHhH5U6dqHSbec3y94EJnv-daOS56T6HygYz1Qw4gyWgogZrX44CH5NXg5LfcFuVFiGzcjvZwXxg-w.U6Jqe6r_okFHJNKvJ_WlYQ.k6GoaJe3MgtRwI5Lp0giFKWOoB85szcXQqYJuyf5maBnIepHEa2y_il-f9Y20favJ8-dtCU7qVw8yUl8BIbEVmPvLcTDsXXY6eTH9r3H7-kF5Wg5DEXbGViCB1nsNb9shAc7enDo4qJRVOt7AU5ABgXdcSsZodebA_BuH7HUSVHZO8n18DeNyg2Gvva-IHX7Q1xUbgrzcLeD_jU2Dv1QDqShleEgxTEloyKxw9bEq9axRvP7jBDDG832KFodN6exMzlqX5nyj-zfgUvjuuMxwek-jmxEBuEU0F9db_zvzcmcIJ6qAr4A1NgCP483xss162wVNC_W07mS4_xKLDcXbahwhFs1c2vhGhO6Pv70A4gZ1h2NlecrS_j74y5ZHi1AToYDJNwgzt5XSICfqd72JA.7Zwdrmk5igEXCBXYBSUu0Em6H8LElvBYxCWJpxF2Ah4",
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
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      res.send(response.data.trip.bounds[0].baggageAllowanceSpecifications[0]);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
