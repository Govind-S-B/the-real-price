/**
 * Converts a monetary cost into the amount of time the user needs to work to earn this much money (in minutes).
 * @param {number} monetary_cost - The cost of the item.
 * @param {number} hourly_wage - The user's hourly wage.
 * @returns {number} The amount of minutes the user needs to work to earn the specified amount of money (rounded to the nearest integer).
 */
function money_to_time(monetary_cost, hourly_wage) {
    // Ensure valid input
    if (
        isNaN(monetary_cost) ||
        isNaN(hourly_wage) ||
        monetary_cost <= 0 ||
        hourly_wage <= 0
    ) {
        return null; // Invalid input, return null or handle the error appropriately
    }

    // Calculate minutes required to earn the money
    const minutesToWork = Math.round((monetary_cost / hourly_wage) * 60);

    return minutesToWork;
}

function replaceCurrency(text, wage) {
    let regex = /(₹|\$|€|£|RS|USD|EUR)\s?([,\d]+)(\.(\d{2}))?/g;
    let money = regex.exec(text)?.[2]?.replace(',', '');
    // console.log(money);
    let time = `${money_to_time(parseInt(money), wage)} mins`;
    return text.replace(regex, time);
}
function replaceText(ReplacementText) {
    let walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    let node;
    while ((node = walker.nextNode())) {
        node.textContent = replaceCurrency(node.textContent, ReplacementText);
    }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.time !== undefined) {
        replaceText(request.data.hourlyWage);
    } else {
        console.log(request);
    }
});
