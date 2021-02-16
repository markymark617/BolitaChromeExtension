const Token = artifacts.require("Bolita");
const catchRevert = require("./exceptionsHelpers.js").catchRevert;

require("./utils");

const getLastEvent = async (eventName, instance) => {
    const events = await instance.getPastEvents(eventName, {
        fromBlock: 0,
        toBlock: "latest"
    });
    return events.pop().returnValues;
};


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

