/*
    Problem: Withour this implementation any one can make any transaction that he wants, So effectively you can make transaction and spend coins that aren't yours.
    Solution: We are going to make it madatory for transactions to be signed with a private and public key, that way you can only spent coins in a wallet if you have a private key of it.
*/

/* 
    This class is used to generate public and private key.
*/

// Elliptic library allows us to generate a public and private key, 
// It also has methods to sign something and also a method to verify a signature.
// To install library: npm install elliptic
const EC = require('elliptic').ec;

// Create an instance of elliptic, we have to pass the elliptic curve that we want to use, I am using here "secp256k1".
// "secp256k1" is the algorithm that's also basis of Bitcoin wallets.
const ec = new EC("secp256k1");

// To generate key pair
const key = ec.genKeyPair();

// Get the public & private key in the hex fromat
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private key', privateKey);
console.log();
console.log('Public key', publicKey);

// Execute this file with node to get public & private key: node .\keygenerator.js
