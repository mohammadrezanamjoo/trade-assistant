const request = require('request');
const nodemailer = require('nodemailer');

// Etherscan API endpoint for getting the latest transactions of an Ethereum address
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

// Function to check the latest Ethereum transactions and send an email if a transaction is larger than a threshold value
function checkEthereumTransactionsAndSendNotification(walletAddress, thresholdAmount) {
  // Construct the Etherscan API request URL
  const params = {
    module: 'account',
    action: 'txlist',
    address: walletAddress,
    sort: 'desc',
    apikey: 'YOUR_ETHERSCAN_API_KEY'
  };
  const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  const apiUrl = ETHERSCAN_API_URL + '?' + queryString;

  // Check the latest Ethereum transactions using the Etherscan API
  request(apiUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const txData = JSON.parse(body).result;

      // Loop through the transactions and check if any are larger than the threshold amount
      for (let i = 0; i < txData.length; i++) {
        const tx = txData[i];
        const txValue = parseFloat(tx.value / 1000000000000000000);

        if (txValue > thresholdAmount) {
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
            text: `An Ethereum transaction of ${txValue} ETH has been made from the wallet address ${walletAddress}.`
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
      console.log('Error checking Ethereum transactions:', error);
    }
  });
}

// Call the function to start checking Ethereum transactions and sending email notifications
checkEthereumTransactionsAndSendNotification('ETH_WALLET_ADDRESS', 1000000);
