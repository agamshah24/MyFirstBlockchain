/*
-> Commands to be preformed before starting project
    1. npm init
    2. npm install --save crypto-js
*/

// import Blockchain and Transaction class
const {Blockchain} = require('./blockchain');
const {Transaction} = require('./transaction');

// To test the block chain
// Create an instance of the Blockchain.
let agamCoin = new Blockchain();

// User's address
let rushabhAddress = 'rushabhAddress';
let jainamAddress = 'jainamAddress';
let ankitAddress = 'ankitAddress';

// miners address
let nishithAddress = 'nishithAddress';

// create the transaction
agamCoin.createTransaction(new Transaction(rushabhAddress, jainamAddress, 200));
agamCoin.createTransaction(new Transaction(ankitAddress, jainamAddress, 50));
agamCoin.createTransaction(new Transaction(ankitAddress, rushabhAddress, 1150));

// let start mining the transactions
console.log('\n Starting the miner....');
agamCoin.minePendingTransactions(nishithAddress);

// console.log('\n Balance of nishith (miner) is : ', agamCoin.getBalanceOfAddress(nishithAddress))

// let start mining again, remember the miner will get it's mining reward in the when the next block is mines.
console.log('\n Starting the miner again....');
agamCoin.minePendingTransactions(nishithAddress);

console.log('\n Balance of nishith (miner) is : ', agamCoin.getBalanceOfAddress(nishithAddress));