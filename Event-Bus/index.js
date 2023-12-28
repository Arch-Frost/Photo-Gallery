require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 5003;

app.get("/events", async (req, res) => {
  console.log("Received GET request for /events");
  res.send({ status: "OK" });
});

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("\nReceived POST request for /events with type " + event.type);
  console.log("Broadcasting event to all services...");

  await axios
    .post(process.env.USER_ACC_MGMT_SERV_URL + "events/", event)
    .then((res) => {
      console.log(
        "User Account Management Service responded with status " + res.status
      );
    })
    .catch((err) => {
      console.log(
        "User Account Management Service responded with error " + err
      );
    });

  await axios
    .post(process.env.STORAGE_MGMT_SERV_URL + "events/", event)
    .then((res) => {
      console.log(
        "Storage Management Service responded with status " + res.status
      );
    })
    .catch((err) => {
      console.log("Storage Management Service responded with error " + err);
    });

  await axios
    .post(process.env.USAGE_MNTR_SERV_URL + "events/", event)
    .then((res) => {
      console.log(
        "Usage Monitoring Service responded with status " + res.status
      );
    })
    .catch((err) => {
      console.log("Usage Monitoring Service responded with error " + err);
    });


  await axios.post(process.env.LOG_SERV_URL, {
    message: "Event Bus: Event received with type " + event.type,
    code: 200,
  }).then((res) => {
    console.log("Log Service responded with status " + res.status);
  }).catch((err) => {
    console.log("Log Service responded with error " + err);
  })
  res.send({ status: "OK" });
});

app.listen(port, async () => {
  console.log("Listening on 5003");
});
