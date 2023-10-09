/**
 * Converts an annual salary into an hourly wage.
 * @param {number} hours_worked_per_week - Hours the user works in a week.
 * @param {number} annual_salary - User's annual salary.
 * @returns {number} The hourly wage the user earns.
 */
function hourly_from_annual(hours_worked_per_week, annual_salary) {
    // Ensure valid input
    if (isNaN(hours_worked_per_week) || isNaN(annual_salary) || hours_worked_per_week <= 0 || annual_salary <= 0) {
        return null; // Invalid input, return null or handle the error appropriately
    }

    // Calculate hourly wage
    const hourlyWage = annual_salary / (hours_worked_per_week * 52); // Assuming 52 weeks in a year

    return hourlyWage;
}

/**
 * Converts a monthly salary into an hourly wage.
 * @param {number} hours_worked_per_week - Hours the user works in a week.
 * @param {number} monthly_salary - User's monthly salary.
 * @returns {number} The hourly wage the user earns.
 */
function hourly_from_monthly(hours_worked_per_week, monthly_salary) {
    // Ensure valid input
    if (isNaN(hours_worked_per_week) || isNaN(monthly_salary) || hours_worked_per_week <= 0 || monthly_salary <= 0) {
        return null; // Invalid input, return null or handle the error appropriately
    }

    // Calculate hourly wage
    const hourlyWage = monthly_salary / (hours_worked_per_week * 4); // Assuming 4 weeks in a month

    return hourlyWage;
}

/**
 * Converts a monetary cost into the amount of time the user needs to work to earn this much money (in minutes).
 * @param {number} monetary_cost - The cost of the item.
 * @param {number} hourly_wage - The user's hourly wage.
 * @returns {number} The amount of minutes the user needs to work to earn the specified amount of money (rounded to the nearest integer).
 */
function money_to_time(monetary_cost, hourly_wage) {
    // Ensure valid input
    if (isNaN(monetary_cost) || isNaN(hourly_wage) || monetary_cost <= 0 || hourly_wage <= 0) {
        return null; // Invalid input, return null or handle the error appropriately
    }

    // Calculate minutes required to earn the money
    const minutesToWork = Math.round((monetary_cost / hourly_wage) * 60);

    return minutesToWork;
}
