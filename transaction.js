/* 
    Create a Transaction class
*/
const SHA256 = require('crypto-js/sha256');

const EC = require('elliptic').ec;
const ec = new EC("secp256k1");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        //console.debug('Transaction is created with: ', fromAddress, toAddress, amount);
    }

    // Calculate the Hash for the transaction
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // Sign the transaction
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }

    isValid() {
        // For the miners rewards trasaction we will get the fromAddress as null,
        if (this.fromAddress === null) {
            return true;
        }
        
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

// allows the export of the Transaction class
module.exports.Transaction = Transaction;