const bolita = artifacts.require("Bolita");
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

contract("Bolita", ([owner, user1]) => {
    let bolitaDeploy;

    before(async () => {
        bolitaDeploy = await bolita.new();

    });

    describe("Initial Variables", () => {
        it("should set bBettingIsOpen to true in contructor and emit this vars value", async () => {

             const event = await getLastEvent("BettingIsOpen", bolitaDeploy);
            assert.equal(event.bettingIsOpenStatus, true);
        });

        //check bBettingIsOpen event

        // it("correct worker address", async () => {
        //     const worker = await slots.workerAddress();
        //     assert.equal(worker, owner);
        // });

        // it("correct worker address", async () => {
        //     const worker = await slots.workerAddress();
        //     assert.equal(worker, owner);
        // });

        // it("correct worker address", async () => {
        //     const worker = await slots.workerAddress();
        //     assert.equal(worker, owner);
        // });

    });


});