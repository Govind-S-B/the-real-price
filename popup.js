import {
    hourly_from_monthly,
    hourly_from_annual,
} from '/wage_and_time_calculator.js';

let userData = {
    salaryType: undefined,
    salary: undefined,
    hours: undefined,
    currency: undefined,
    hourlyWage: undefined,
};
let time = undefined;
document.getElementById('replaceButton').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'replace',
            time: 'fiibar',
            data: userData,
        });
    });
});
const jsonFilePath = chrome.runtime.getURL('currencies.json');

let wageText = document.getElementById('hourly-wage');
let datalist = document.getElementById('currencies');
let currencies = [
    'AUD',
    'BGN',
    'BRL',
    'CAD',
    'CHF',
    'CNY',
    'CZK',
    'DKK',
    'EUR',
    'GBP',
    'HKD',
    'HUF',
    'IDR',
    'ILS',
    'INR',
    'ISK',
    'JPY',
    'KRW',
    'MXN',
    'MYR',
    'NOK',
    'NZD',
    'PHP',
    'PLN',
    'RON',
    'SEK',
    'SGD',
    'THB',
    'TRY',
    'USD',
    'ZAR',
];

chrome.storage.local.get(['userData']).then((storedData) => {
    if (!storedData.userData.hourlyWage) {
        console.log(storedData);
        return;
    }
    userData = storedData.userData;
    document.getElementById('salary-type').value = userData.salaryType;
    document.getElementById('salary').value = userData.salary;
    document.getElementById('hours').value = userData.hours;
    document.getElementById('currency').value = userData.currency;

    wageText.innerHTML = `Hourly Wage: ${Math.round(userData.hourlyWage)} ${
        userData.currency
    }`;
});

for (const currency of currencies) {
    let option = document.createElement('option');

    // Set the value and label for the option
    option.value = currency;
    option.text = currency;

    // Append the option to the datalist
    datalist.appendChild(option);
}
// Create a new option element
let form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    userData.salaryType = document.getElementById('salary-type').value;
    userData.salary = document.getElementById('salary').value;
    userData.hours = document.getElementById('hours').value;
    userData.currency = document.getElementById('currency').value;
    if (userData.salaryType === 'monthly') {
        userData.hourlyWage = hourly_from_monthly(
            userData.hours,
            userData.salary
        );
    } else if (userData.salaryType === 'yearly') {
        userData.hourlyWage = hourly_from_annual(
            userData.hours,
            userData.salary
        );
    } else {
        throw new TypeError('not monthly or yearly');
    }
    chrome.storage.local.set({ userData: userData });
    wageText.innerHTML = `Hourly Wage: ${Math.round(userData.hourlyWage)} ${
        userData.currency
    }`;
});
