const request = require('request');
const nodemailer = require('nodemailer');


const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

// Function to check the latest Ethereum pending transactions and send an email if a transaction costs less than a threshold gas price
function checkEthereumPendingTransactionsAndSendNotification(walletAddress, thresholdGasPrice) {
  // Construct the Etherscan API request URL for pending transactions
  const params = {
    module: 'account',
    action: 'txlist',
    address: walletAddress,
    sort: 'desc',
    apikey: 'YOUR_ETHERSCAN_API_KEY'
  };
  const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  const apiUrl = ETHERSCAN_API_URL + '?' + queryString;


  request(apiUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const txData = JSON.parse(body).result;

      // Loop through the pending transactions and check if any have a gas price less than the threshold
      for (let i = 0; i < txData.length; i++) {
        const tx = txData[i];
        const gasPrice = parseFloat(tx.gasPrice / 1000000000);

        if (gasPrice < thresholdGasPrice) {
          // Create a nodemailer transporter with your email account details
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'your_email@gmail.com',
              pass: 'your_email_password'
            }
          });

          // Construct the email message
          const message = {
            from: 'your_email@gmail.com',
            to: 'recipient_email@example.com',
            subject: 'Ethereum Transaction Alert',
            text: `An Ethereum transaction from the wallet address ${walletAddress} with a gas price of ${gasPrice} gwei is pending.`
          };

          // Send the email using the nodemailer transporter
          transporter.sendMail(message, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      }
    } else {
      console.log('Error checking Ethereum pending transactions:', error);
    }
  });
}

// Call the function to start checking Ethereum pending transactions and sending email notifications
checkEthereumPendingTransactionsAndSendNotification('ETH_WALLET_ADDRESS', 0.000);
