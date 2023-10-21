import axios from 'axios';
import storage from 'node-persist';


// Initialize storage
await storage.init({ dir: './Extension/data', ttl: 86400000 });

/**
 * Converts currencies into the user's currency
 * @param {string} cacheKey (eg: "USD_JPY" etc)
 * @returns {bool} - It tells the convert function whether to update the cache or not
 */

async function shouldUpdateCache(cacheKey) {
  const cachedData = await storage.getItem(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < 86400000)) {
    return false; // Cache is still valid
  }
  return true; // Cache needs to be updated
}

/**
 * Converts currencies into the user's currency
 * @param {string} text_currency - the currency of the text element (eg: "USD", "INR" etc)
 * @param {string} user_currency - the currency of the user (eg: "USD", "INR" etc)
 * @param {number} amount - the amount of the text currency
 * @returns {number} - the converted amount is returned
 */

async function convert(text_currency, user_currency, amount) {
  // Check if rates are available in the storage
  const cacheKey = `${text_currency}_${user_currency}`;
  const cachedData = await storage.getItem(cacheKey);

  if (!(await shouldUpdateCache(cacheKey))) {
    const convertedAmount = (amount * cachedData.rates[user_currency])/cachedData.rates[text_currency];
    console.log("Present in cache\n"); //debug
    return convertedAmount;
  }

  try {
    // Make API request to get the conversion rate for the specific input currencies
    const response = await axios.get(`https://api.frankfurter.app/latest?to=${user_currency},${text_currency}`);
    
    if (response.status === 200) {
      const { rates } = response.data;

      // Update rates in the storage
      const newData = {
        timestamp: Date.now(),
        rates: rates
      };
      await storage.setItem(cacheKey, newData);
      console.log(await storage.getItem(cacheKey)); //debug
      const convertedAmount = amount * rates[user_currency];
      return convertedAmount;
    } 
    else {
      throw new Error(`Failed to get conversion rate: HTTP status ${response.status}`);
    }
  } 
  
  catch (error) {
    console.error(error);
    if (cachedData) {
      // If API call fails, use the old cache data
      const convertedAmount = amount * cachedData.rates[user_currency];
      return convertedAmount;
    } 
    else {
      throw new Error('Failed to convert currencies');
    }
  }
}
  
  

// A test case
const text_currency = 'USD';
const user_currency = 'JPY';
const amount = 25;

convert(text_currency, user_currency, amount)
  .then(convertedAmount => {
    console.log(`Converted amount: ${convertedAmount}`);
  })
  .catch(error => {
    console.error(error);
  });

