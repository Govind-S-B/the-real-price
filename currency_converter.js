import axios from 'axios';
import storage from 'node-persist';
import dotenv from 'dotenv';
dotenv.config({ path: './api.env' });

// Initialize storage
await storage.init({ dir: './Extension/data', ttl: 86400000 });

/**
 * Converts currencies into the user's currency
 * @param {string} text_currency - the currency of the text element (eg: "USD", "INR" etc)
 * @param {string} user_currency - the currency of the user (eg: "USD", "INR" etc)
 * @param {number} amount - the amount of the text currency
 * @returns {Promise<number>} - a promise that resolves to the amount in the user's currency
 */

async function convert(text_currency, user_currency, amount) {
  const apiKey = process.env.API_KEY;

  // Check if rates are available in the storage
  const cacheKey = `${text_currency}_${user_currency}`;
  const cachedRates = await storage.getItem(cacheKey);

  if (cachedRates) {
    const convertedAmount = amount * cachedRates[user_currency];
    console.log("Present in cache\n"); //debug
    return convertedAmount;
  }

  try {
    // Make API request to get the conversion rate
    const response = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest`, {
      params: {
        apikey: apiKey,
      },
    });
    
    if (response.status === 200) {
      const { rates } = response.data;

      // Update rates in the storage
      const updatedRates = {
        ...rates,
        [text_currency]: 1, // Add the base currency rate to the rates object
      };
      await storage.setItem(cacheKey, updatedRates);
      console.log(await storage.getItem(cacheKey)); //debug
      const convertedAmount = amount * updatedRates[user_currency];
      return convertedAmount;
    } 
    else {
      throw new Error(`Failed to get conversion rate: HTTP status ${response.status}`);
    }
  } 
  
  catch (error) {
    console.error(error);
    throw new Error('Failed to convert currencies');
  }
}

// The test
const text_currency = 'GBP';
const user_currency = 'JPY';
const amount = 25;

convert(text_currency, user_currency, amount)
  .then(convertedAmount => {
    console.log(`Converted amount: ${convertedAmount}`);
  })
  .catch(error => {
    console.error(error);
  });

