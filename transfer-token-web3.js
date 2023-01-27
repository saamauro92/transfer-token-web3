const private_key = ""; // get your private key
let abi = require("");// get smart contract abi from etherscan/bscan and save it in other file
let contract_address = "";// smart contract address
let send_to = ""  // address to send tokens

var Web3 = require('web3');
var provider = "https://bsc-dataseed.binance.org/";
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);
var Contract = require('web3-eth-contract');
Contract.setProvider('ws://localhost:8546');

const sendTokens = async () => {


  //connecting 
  var contract = new web3.eth.Contract(abi, contract_address);

  //gets account address from private key.
  const account = await web3.eth.accounts.privateKeyToAccount('0x' + private_key);

  // ads wallet
  await web3.eth.accounts.wallet.add(account);

  // prints token name
  await contract.methods.name().call().then((data) => console.log({ token: data }));

  // prints token symbol
  await contract.methods.symbol().call().then((data) => console.log({ tokenSymb: data }));

  // prints tokens balance
  let balanceOf = await contract.methods.balanceOf(account.address).call().then((data) => data);
  console.log({tokenBalance: balanceOf});

  //set the amount to transfer for the whole balance;
  let amount = balanceOf;

  // calculates nonce and gas price
  let nonce = await web3.eth.getTransactionCount(account.address, 'latest');
  let gasPrice = web3.utils.toWei('10', 'gwei');

  // add the network id, ex; 56( binance smart chain)
  let chainId = '56';

  //estimate gas for transaction
  let gas = await contract.methods
    .transfer(send_to, amount)
    .estimateGas({ from: account.address });

  // proceed with transaction, if success returns transaction code
  await contract.methods
    .transfer(send_to, amount)
    .send({ from: account.address, gasPrice, nonce, gas, chainId }, (err, res) => {
      if (!err) {
        console.log("Success", { transactionCode: res });
      } else {
        console.log('Error message:', { error: err })
      }
    });

}

sendTokens();