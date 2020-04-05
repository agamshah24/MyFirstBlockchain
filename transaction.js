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

// allows the export of the Transaction class
module.exports.Transaction = Transaction;