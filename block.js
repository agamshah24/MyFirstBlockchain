// import sha256
const SHA256 = require('crypto-js/sha256');

class Block {
    // To support multiple trasaction we will replace data with trasactions(Array).
    // Remove the index because in blockchain the order of block is determine by their position in the array and not by the index that we can pass.
    constructor(timestamp, transactions, previousHash='') {
        // the time when block is created
        this.timestamp = timestamp;
        // transactions array to be stored in block
        this.transactions = transactions;
        // Hash of previous block
        this.previousHash = previousHash;
        // Hash of currenct block
        this.hash = this.calculateHash();
        // Nonce will be useful to generate the new hash for every block
        // this the random number that doesn't have anything to do with your block, but it can be changed something random.
        this.nonce = 0;
    }

    /* 
        To calculate the Hash for current block.
    */
    calculateHash(){
        // We are going to use SHA-256 as a hash function
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // To create our block with a certain amount of zero's
    mineBlock(difficulty) {
        // write a loop that keeps running until our hash starts with enough zero's
        // Let say for example our hash difficulty is 5 then loop will run until the first 5 character of hash value will be equal to 00000
        while (this.hash.substr(0, difficulty) !== Array(difficulty + 1).join(0)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        // print the hash of the block
        console.log("Block mine: " + this.hash);

        // The problem over here is that the hash of our block won't change if we don't change the contents of our block,
        // so our above loop will become endless loop.

        // Ok, we might need to think that what can we change from our Block contents (Block class's property).
        // We cannot change any of the current property but we can add a new property called "nonce". 

    }
}

// allows the export of the Transaction class
module.exports.Block = Block;