/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();


const PrivateKeyProvider = require("truffle-privatekey-provider");
const privateKey = '0x9450712552098aa8553c5a4f9a7c0d206588a09198135782bc7101f72f0ed25d';

module.exports = {

  // Configure your compilers
  compilers: {
    solc: {
        version: "0.8.0",
        settings: {
            optimizer: {
                enabled: true,
                runs: 300
            }
        },
    }
  },
    
  networks: {
    development: {
        host: "127.0.0.1",
        port: 9545,
        network_id: 5777
    },
    matic: {
        provider: () => new PrivateKeyProvider(
            privateKey,
            'https://testnetv3.matic.network'
        ),
        network_id: 15001,
        gasPrice: '0x0',
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true
    },
    mumbai: {
        provider: () => new PrivateKeyProvider(
            privateKey,
            'https://rpc-mumbai.matic.today'
        ),
        network_id: 80001,
        confirmations: 1,
        timeoutBlocks: 300,
        skipDryRun: true
    },
    maticmain: {
        provider: () => new PrivateKeyProvider(
            privateKey,
            'https://rpc-mainnet.matic.network'
        ),
        network_id: 137,
        confirmations: 1,
        timeoutBlocks: 300,
        skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    useColors: true,
    reporter: "eth-gas-reporter",
    reporterOptions: {
        currency: "USD",
        gasPrice: 10
    }
  }



};
