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


//CONTRACT SPECIFIC GLOBALS
const firstDigitBetTypeEnumVal = 0;
const secondDigitBetTypeEnumVal = 1;
const thirdDigitBetTypeEnumVal = 2;

contract("Bolita", ([owner, user1]) => {
    let bolitaDeploy;

    before(async () => {
        bolitaDeploy = await bolita.new();

    });

    describe("Initial Variables and getter or helper functions", () => {
        it("should set bBettingIsOpen to true in contructor and emit this vars value", async () => {

             const event = await getLastEvent("BettingIsOpen", bolitaDeploy);
            assert.equal(event.bettingIsOpenStatus, true);
        });

        it("should accept ETH sent to contract - aka tips are accepted", async () => {

            
            const msgValeEth = 1;
            const contractBalanceBefore = await web3.eth.getBalance(bolitaDeploy.address);
            
            await bolitaDeploy.sendETHtoContract( {from: user1, value: web3.utils.toWei("1")} );

            const contractBalanceAfter = await web3.eth.getBalance(bolitaDeploy.address);
           

            assert.equal(contractBalanceBefore, web3.utils.toWei("0"));
            assert.equal(contractBalanceAfter, web3.utils.toWei("1"));
       });

    });

    describe("Error Testing", () => {
        it("should not allow more than 1 bet per day", async () => {

            //FIRST BET
            const firstnumberBetOnUser1 = 9;

            await bolitaDeploy.makeBet(user1, firstnumberBetOnUser1, firstDigitBetTypeEnumVal, {from: user1, value: web3.utils.toWei(".005")});
            
            const firstevent = await getLastEvent("BetAccepted", bolitaDeploy);
            assert.equal(firstevent.bettor, user1);
            assert.equal(firstevent.numberBetOn, firstnumberBetOnUser1);

            //SECOND BET
            const secondnumberBetOnUser1 = 5;

            await catchRevert(
                bolitaDeploy.makeBet(user1, secondnumberBetOnUser1, secondDigitBetTypeEnumVal, {from: user1, value: web3.utils.toWei(".005")}),
                "revert CANNOT EXCEED 1 BET PER DAY"
            );

        });


        //make bet with zero_address account - catchrevert paywinners error


    });

    describe("Betting Positive Cases", () => {
        
        beforeEach(async () => {
            bolitaDeploy = await bolita.new();

        });
        
        it("should accept valid bet on first digit", async () => {

            const numberBetOnUser1 = 9;

            await bolitaDeploy.makeBet(user1, numberBetOnUser1, firstDigitBetTypeEnumVal, {from: user1, value: web3.utils.toWei(".005")});
            
            const event = await getLastEvent("BetAccepted", bolitaDeploy);
            assert.equal(event.bettor, user1);
            assert.equal(event.numberBetOn, numberBetOnUser1);
        });

        it("should accept valid bet on second digit", async () => {

            const numberBetOnUser1 = 8;

            await bolitaDeploy.makeBet(user1, numberBetOnUser1, secondDigitBetTypeEnumVal, {from: user1, value: web3.utils.toWei(".005")});
            
            const event = await getLastEvent("BetAccepted", bolitaDeploy);
            assert.equal(event.bettor, user1);
            assert.equal(event.numberBetOn, numberBetOnUser1);
        });

        it("should accept valid bet on third digit", async () => {

            const numberBetOnUser1 = 7;

            await bolitaDeploy.makeBet(user1, numberBetOnUser1, thirdDigitBetTypeEnumVal, {from: user1, value: web3.utils.toWei(".005")});
            
            const event = await getLastEvent("BetAccepted", bolitaDeploy);
            assert.equal(event.bettor, user1);
            assert.equal(event.numberBetOn, numberBetOnUser1);
        });

        it("should accept valid bet as OBO from owner address", async () => {

            const numberBetOnUser1 = 9;
            const firstDigitBetTypeEnumVal = 0;

            await bolitaDeploy.makeBet(user1, numberBetOnUser1, firstDigitBetTypeEnumVal, {from: owner, value: web3.utils.toWei(".005")});
            
            
            const event = await getLastEvent("BetAccepted", bolitaDeploy);
            assert.equal(event.bettor, user1);
            assert.equal(event.numberBetOn, numberBetOnUser1);
        });



    });


    describe("Access Control testing", () => {
        it("should enfore onlyAdmin for clearBets function", async () => {

            

        });



        //closeBetting

    });





});