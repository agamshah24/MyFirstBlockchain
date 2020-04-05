/*
-> Commands to be preformed before starting project
    1. npm init
    2. npm install --save crypto-js
*/

// import Blockchain and Transaction class
const {Blockchain} = require('./blockchain');
const {Transaction} = require('./transaction');

const EC = require('elliptic').ec;
const ec = new EC("secp256k1");

// First execute the keygenerator to public & private key: node .\keygenerator.js

const myKey = ec.keyFromPrivate('4108b117b3e7945fb824611949a6607aeb2a3a26aff02e66169a19a2fbe47f01');
const myWalletAddress = myKey.getPublic('hex');

// To test the block chain
// Create an instance of the Blockchain.
let agamCoin = new Blockchain();

// create transactions

const tx1 = new Transaction(myWalletAddress, 'public key of from address', 10);
tx1.signTransaction(myKey);
agamCoin.addTransaction(tx1);

// let start mining the transactions
console.log('\n Starting the miner....');
agamCoin.minePendingTransactions(myWalletAddress);

// let start mining again, remember the miner will get it's mining reward in the when the next block is mines.
// console.log('\n Starting the miner again....');

//agamCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of miner is : ', agamCoin.getBalanceOfAddress(myWalletAddress));

console.log("Is chain valid?", agamCoin.isChainValid());


/*
// User's address
let rushabhAddress = 'rushabhAddress';
let jainamAddress = 'jainamAddress';
let ankitAddress = 'ankitAddress';
// create the transaction
agamCoin.createTransaction(new Transaction(rushabhAddress, jainamAddress, 200));
agamCoin.createTransaction(new Transaction(ankitAddress, jainamAddress, 50));
agamCoin.createTransaction(new Transaction(ankitAddress, rushabhAddress, 1150));
*/