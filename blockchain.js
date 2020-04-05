// import block and transaction class
const {Block} = require('./block');
const {Transaction} = require('./transaction');

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
       const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
       this.pendingTransactions.push(rewardTx);

       // create a block
       let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
       // mine the block
       block.mineBlock(this.difficulty);

       console.log('Block successfully mined!');
       // add the block to blockchain
       this.chain.push(block);

       // console.debug('Added to the Block with transaction : ', block);

       this.pendingTransactions = [];
       /*
       // reset the pending trasaction array
       this.pendingTransactions = [
           // Also sent the rewards to the miner
           // After the block has been mined, we created this transaction for the miner's reward.
           // so the mining reward will only be sent when the next block is mines.
           new Transaction(null, miningRewardAddress, this.miningReward)
       ];
       */
    }

   /* 
    To add the transaction into the pending trasaction list
    */
   addTransaction(transaction) {
       // check if from and to address are not empty
       if (!transaction.fromAddress || !transaction.toAddress) {
           throw new Error('Transaction must include from and to address.');
       }

       // Validate the trasaction
       if (!transaction.isValid()) {
           throw new Error('Cannot add invalid transaction to chain.');           
       }

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
           
           // Verify if all the transactions are valid in the current block
           if(!currentBlock.hasValidTransactions()) {
               return false;
           }

           // Compare the current block's hash with recalcualting it's hash
           if (currentBlock.hash !== currentBlock.calculateHash()) {
               return false;
           } 

           // Compare the currenct block's previous hash with previous block's hash 
           else if (currentBlock.previousHash != previousBlock.hash) {
               console.log("currentBlock previousHash: ", currentBlock);
               console.log("previousBlock previousHash: ", previousBlock);
               return false;
           }
       }

       return true;
   }
}

// allows the export of the Transaction class
module.exports.Blockchain = Blockchain;