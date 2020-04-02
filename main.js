/*
-> Commands to be preformed before starting project
    1. npm init
    2. npm install --save crypto-js
*/

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash='') {
        // index of block in blockchain
        this.index = index;
        // the time when block is created
        this.timestamp = timestamp;
        // Data to be stored in block
        this.data = data;
        // Hash of previous block
        this.previousHash = previousHash;
        // Hash of currenct block
        this.hash = this.calculateHash();
        // Nonce will be useful to generate the new hash for every block
        this.nonce = 0;
    }

    /* 
        To calculate the Hash for current block.
    */
    calculateHash(){
        // We are going to use SHA-256 as a hash function
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

    // To create our block with a certain amount of zero's
    mineBlock(difficulty) {
        // write a loop that keeps running until our hash starts with enough zero's
        // Let say for example our hash difficulty is 5 then loop will run until the first 5 character of hash value will be equal to 00000
        while (this.hash.substr(0, difficulty) !== Array(difficulty + 1).join(0)) {
            this.hash = this.calculateHash();
        }

        // print the hash of the block
        console.log("Block mine: " + this.hash);

        // The problem over here is that the hash of our block won't change if we don't change the contents of our block,
        // so our above loop will become endless loop.

    }
}


class Blockchain {
    constructor() {
        // To create array of blocks on blockchain
        this.chain = [this.createGenesisBlock()];
        // To Create Genesis block

    }

    /*
        The first block (Genesis block) is always created manually. 
    */
   createGenesisBlock() {
       return new Block(0, '2020/03/21', "Genesis Block", "0");
   }

   /*
        To get the lastest created block on the blockchain
   */
   getLatestBlock() {
       return this.chain[this.chain.length - 1];
   }

   /* 
        To add a new block in the blockchain
   */
   addBlock(newBlock) {
       // First add the previous block's hash
       newBlock.previousHash = this.getLatestBlock().hash;
       // As here we have changed the block property we need to re-calculate the hash of this block
       // IMP: whenever you change the property of any block make sure you will re-calculate it's HASH. 
       newBlock.hash = newBlock.calculateHash();
       // Add the newBlock in the chain
       this.chain.push(newBlock);
       // In reality you can't add a new block this super easily because, there are numerous checks in place.
   }

   /* 
        To verify that the chain is valid or not (to check the integrity of the blockchain)
        return : either true if the chain is valid & false if something is wrong
   */
   isChainValid() {
       // here we are not starting with index 0 because the 0th block is Genesis block
       for(let i = 1; i < this.chain.length; i++) {
           const currentBlock = this.chain[i];
           const previousBlock = this.chain[i - 1];

           // Compare the current block's hash with recalcualting it's hash
           if (currentBlock.hash !== currentBlock.calculateHash()) {
               return false;
           } 
           // Compare the currenct block's previous hash with previous block's hash 
           else if (currentBlock.previousHash != previousBlock.hash) {
               return false;
           }
       }

       return true;
   }
}

// To test the block chain
// Create an instance of the Blockchain.
let agamCoin = new Blockchain();
// add blocks in the blockchain
agamCoin.addBlock(new Block(1, "2020/03/22", {amount: 4}));
agamCoin.addBlock(new Block(2, "2020/03/23", {amount: 10}));

// To verify the integrity of the blockchain
console.log('Is blockchain valid? ' + agamCoin.isChainValid());

// tamper our blockchain 
agamCoin.chain[1].data = {amount: 100};
agamCoin.chain[1].hash = agamCoin.chain[1].calculateHash();
// Re-check the integrity of the blockchain
console.log('Is blockchain valid? ' + agamCoin.isChainValid());

// For output
// console.log(JSON.stringify(agamCoin,null,4));

