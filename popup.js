document.getElementById('replaceButton').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'replace' });
    });
});

var currencies = [
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
    // Add more currencies here
];
var datalist = document.getElementById('currencies');
for (const currency of currencies) {
    var option = document.createElement('option');

    // Set the value and label for the option
    option.value = currency;
    option.text = currency;

    // Append the option to the datalist
    datalist.appendChild(option);
}
// Create a new option element
var form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    var salaryType = document.getElementById('salary-type').value;
    var salary = document.getElementById('salary').value;
    var hours = document.getElementById('hours').value;
    var currency = document.getElementById('currency').value;
});
