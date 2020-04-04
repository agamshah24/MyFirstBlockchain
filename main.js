/*
-> Commands to be preformed before starting project
    1. npm init
    2. npm install --save crypto-js
*/

const SHA256 = require('crypto-js/sha256');

// 1. To support multiple trasaction we will replace data with trasactions(Array) in the Block class.
// 2. Remove the index from the Block class because in blockchain the order of block is determine by their position in the array and not by the index that we can pass.
// 3. Remove the index parmeter passed in the Genisis block.
// 4. Create a Transaction class.
// 5. We need a place to store pending transactions.
    // We need a place to store pending transctions becuase we only create block on a specific time interval, in bitcoin case the proof-of-work algorithm makes sure that there is only one block created at every 10 minutes. All the transactions made between the 
// 6. We need a new method to mine a new block for the pending transactions.
// 7. We need to add mining rewards.



/* 
    Create a Transaction class
*/
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        //console.debug('Transaction is created with: ', fromAddress, toAddress, amount);
    }
}

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


class Blockchain {
    constructor() {
        // To create array of blocks on blockchain
        this.chain = [this.createGenesisBlock()]; // To Create Genesis block
        this.difficulty = 3;
        // Used for pending transactions
        this.pendingTransactions = [];
        // To control how much coin the miners get as a reward
        this.miningReward = 100; // Miners will get 100 coins if they successfully mine the block
    }

    /*
        The first block (Genesis block) is always created manually. 
    */
   createGenesisBlock() {
       return new Block('2020/03/21', "Genesis block", "0");
   }

   /*
        To get the lastest created block on the blockchain
   */
   getLatestBlock() {
       return this.chain[this.chain.length - 1];
   }

   minePendingTransactions(miningRewardAddress) {
       // miningRewardAddress = miners address
       // create a block
       let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock.hash);
       // mine the block
       block.mineBlock(this.difficulty);

       console.log('Block successfully mined!');
       // add the block to blockchain
       this.chain.push(block);

       // console.debug('Added to the Block with transaction : ', block);

       // reset the pending trasaction array
       this.pendingTransactions = [
           // Also sent the rewards to the miner
           // After the block has been mined, we created this transaction for the miner's reward.
           // so the mining reward will only be sent when the next block is mines.
           new Transaction(null, miningRewardAddress, this.miningReward)
       ];
    }

   /* 
    To add the transaction into the pending trasaction list
    */
   createTransaction(transaction) {
       this.pendingTransactions.push(transaction);
   }

   /* 
    To check the balance of an address,
        - Many people thinks that if you send some bitcoins around they actually move away from your wallets balance to someone else's balance
        - But in reality, you don't have a balance. 
        - The transaction is just stored on the blockchain and  if you ask for your balance you have to go through all the transactions that involves your address and calculate it that way.
   */
   getBalanceOfAddress(address) {
       let balance = 0;
       // Tranvers all the blocks on the blockchain
       for(const block of this.chain) {
        // Traverse each transctions of the block
        for(const trans of block.transactions) {
               // if the given address found in fromAddress of the transaction, it means you have sent the money to someone.
               if (trans.fromAddress === address) {
                   balance -= trans.amount;
               }
               // if the given address found in toAddress of the transaction, it means you have received the money from someone.
               if(trans.toAddress === address) {
                   balance += trans.amount;
               } 
           }
       }
       // return the calculated transaction
       return balance;
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