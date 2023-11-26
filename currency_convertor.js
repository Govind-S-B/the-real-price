/**
 * Converts currencies into the user's currency
 * @param {string} cacheKey (eg: "USD_JPY" etc)
 * @returns {bool} - It tells the convert function whether to update the cache or not
 */

function shouldUpdateCache(cacheKey) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([cacheKey], function(result) {
      if (result[cacheKey] && (Date.now() - result[cacheKey].timestamp < 86400000)) {
        resolve(false); // Cache is still valid
      } else {
        resolve(true); // Cache needs to be updated
      }
    });
  });
}

/**
 * Converts currencies into the user's currency
 * @param {string} text_currency - the currency of the text element (eg: "USD", "INR" etc)
 * @param {string} user_currency - the currency of the user (eg: "USD", "INR" etc)
 * @param {number} amount - the amount of the text currency
 * @returns {number} - the converted amount is returned
 */

function convert(text_currency, user_currency, amount) {
  // Check if rates are available in the storage
  const cacheKey = `${text_currency}_${user_currency}`;

  return new Promise((resolve, reject) => {
    chrome.storage.local.get([cacheKey], async function(result) {
      if (result[cacheKey] && !(await shouldUpdateCache(cacheKey))) {
        const convertedAmount = (amount * result[cacheKey].rates[user_currency])/result[cacheKey].rates[text_currency];
        console.log("Present in cache\n"); //debug
        resolve(convertedAmount);
      } else {
        try {
          // Use fetch API to make the request
          const response = await fetch(`https://api.frankfurter.app/latest?to=${user_currency},${text_currency}`);
          if (response.ok) {
            const data = await response.json();
            const { rates } = data;

            // Update rates in the storage
            const newData = {
              timestamp: Date.now(),
              rates: rates
            };
            chrome.storage.local.set({[cacheKey]: newData}, function() {
              console.log("Data set"); //debug
            });
            const convertedAmount = amount * rates[user_currency];
            resolve(convertedAmount);
          } else {
            throw new Error(`Failed to get conversion rate: HTTP status ${response.status}`);
          }
        } catch (error) {
          console.error(error);
          if (result[cacheKey]) {
            // If API call fails, use the old cache data
            const convertedAmount = amount * result[cacheKey].rates[user_currency];
            resolve(convertedAmount);
          } else {
            reject('Failed to convert currencies');
          }
        }
      }
    });
  });
}

// The test
const text_currency = 'JPY';
const user_currency = 'USD';
const amount = 25;

convert(text_currency, user_currency, amount)
  .then(convertedAmount => {
    console.log(`Converted amount: ${convertedAmount}`);
  })
  .catch(error => {
    console.error(error);
  });
