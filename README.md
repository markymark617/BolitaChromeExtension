<img src="./images/bolita_logo.png" align="right" />

# BOLITA

Players bet on the last 3 digits of the day's positive Covid-19 cases

Bet amount defaults to 5 finney (.005 ETH) sent as msg.value

At 15:00 the application will get the latest Covid-19 data, and set the last 3 digits as the winning numbers, at which point:

- Winners will be paid out (with event emitted)
- Bets will be cleared (with event emitted)
- Betting will be opened again for tomorrow's number (with event emitted)
	
Contract should be deployed with some ETH to payout winners

Currently only supports 1 digit betting and 1 bet per day

Popup.html has a link that describes the history of Bolita in the US. I copied it here below:
https://www.thedailybeast.com/bolita-where-mom-and-pop-meet-the-mafia

Bolita is a fascinating project because it has been decentralized since its Cuban-American adoption in the 40s through the 90s.
People would bet on "the number", done either by betting with 3 bets on each of the last 3 numbers, or all your money on 1 three digit number.
Your odds are higher with 1 digit betting, but your payout is higher with 3 digit betting.
Cash would be handed off to anyone in the neighbourhood such as a bar tender who could just tell police that it was a tip, and that cash would be picked up later on. To put in your bet, you would call in to "The Office" to give your name, number, and bet amount.

The cool part is, they were betting on the last 3 digits of the total handle at a New York City horse racing track. The handle is the total amount bet on all races for the day. 
These numbers would be printed in the paper everyday, and on the day of there was a toll number that you could call from any pay phone and they would read out the results, with the total handle of the day being announced last. So you could get the winning number through word of mouth, but verify the winning number from several independent sources. All without the internet.

Now, the real money was made by banking the cash that was handled - not too dissimilar from an insurance company's business model. Aadditional expenses like paying off cops, renting several apartments so you could flip offices at the drop of a hat, paying bonds for those who got caught, etc hurt their margins, but such is life in a crooked New York City. 

This dapp is trying to achieve the same decentralization. The goal is to allow people to guess winning numbers that they can verify on their own. 

## ABOUT
Popup.js is the core file that:
- successfully runs a clock (to trigger the setWinningNumber at 15:00)
- uses the numbered circles on popup.html to update the input field's values
- sends get request to covidtracking API
- maps correct smart contract functions to the corresponding buttons
- watches events emitted during each function

## Dependencies

Use NPM for the following libraries:

```bash
npm install --save web3
```
```bash
npm install ganache-cli
```

## Usage
The homepage is popup.html. On form submit from betting on 1 digit, you are taken to results.html

Currently, results.html is used for testing.

Run the devtools with preserve logging = true to watch the console for outputs
> 'Get the latest winning numbers' will be used to test call to bolita.sol's setWinningNumber()

> 'GET CNN NUMBERS' will get the positive cases, and parse the last 3 digits.


Run ganache-cli/TestRPC with the command:
```bash
ganache-cli
```

## Outstanding Issues:
1. Content security policy related updates needed to work as a chrome extension