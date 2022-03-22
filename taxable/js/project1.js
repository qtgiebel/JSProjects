const FEDERAL_TAX_BRACKETS = {
    0.1: 9875, 0.12: 40125, 0.22: 85525, 0.24: 163300,
    0.32: 207350, 0.35: 518400, 0.37: 0
};
const WISCONSIN_TAX_BRACKETS = {
    0.0354: 11970, 0.0465: 23930, 0.0627: 263480, 0.0765: 0
};
const SOCIAL_SECURITY = {
    0.062: 137000
};
const MEDICARE = {
    0.0145: 200000, 0.0235: 0
};

const CATEGORIES = [
    `Gross Income`, `Federal Tax`, `State Tax`, `Medicare Tax`,
    `Social Security Tax`, `Total Tax`, `Net Income`
];

/**
 * Collates the tax amounts and prints them as a table. 
 */
const displayTaxes = event => {
    if (document.getElementsByTagName(`table`)[0]) {
        document.getElementsByTagName(`table`)[0].remove();
    }

    let income = document.getElementById(`income`).value;

    let results = calculateTaxes(income);
    results = sumTaxes(formatResults(results));

    let table = document.createElement(`table`);
    table = populateTable(table, results);
    table.classList.add(`table`, `table-sm`);

    let main = document.getElementsByTagName(`main`)[0];
    main.appendChild(table);
}

/**
 * Calcualtes bracketed taxes using the income and a tax bracket.
 */
const calculateBracketedTax = (income, TAX_BRACKET) => {

    let margin;
    let prevBracket = 0;
    let marginalTaxes = [];

    for (const [taxRate, currentBracket] of Object.entries(TAX_BRACKET)) {

        if (income - currentBracket < 0 || currentBracket === 0) {
            margin = income - prevBracket;
            marginalTaxes.push(margin * taxRate);
            break;
        }

        margin = currentBracket - prevBracket;
        marginalTaxes.push(margin * taxRate);

        prevBracket = currentBracket;
    }

    return marginalTaxes.reduce((a, b) => a + b, 0);
}

/**
 * Creates a thead and a tbody and appends them to the table.
 */
const populateTable = (table, results) => {
    let tableHeader = createTHead();
    let tableBody = createTBody(results);

    table.appendChild(tableHeader);
    table.appendChild(tableBody);

    return table;
}

/***
 * Creates a thead html node.
 */
const createTHead = () => {
    let tableHeader = document.createElement(`thead`);
    let header = document.createElement(`tr`);

    header.innerHTML = `<th colspan="2">Tax Estimates</th>`;

    tableHeader.appendChild(header);

    return tableHeader;
}

/***
 * Creates a tbody html node.
 */
const createTBody = results => {
    let tableBody = document.createElement(`tbody`);

    for (let i = 0; i < results.length; i++) {
        const element = results[i];
        let row = document.createElement(`tr`);
        row.innerHTML = `<td>${CATEGORIES[i]}</td>`
            + `<td>$${results[i]}</td>`;
        tableBody.appendChild(row);
    } // uses a fori loop to keep CATEGORIES and results parallel

    return tableBody;
}

/**
 * Calculates the amount of each tax using the income and adds them to an 
 * array.
 */
const calculateTaxes = income => {
    let results = [income];

    results.push(calculateBracketedTax(income, FEDERAL_TAX_BRACKETS));
    results.push(calculateBracketedTax(income, WISCONSIN_TAX_BRACKETS));
    results.push(calculateBracketedTax(income, MEDICARE));
    results.push(calculateBracketedTax(income, SOCIAL_SECURITY));

    return results;
}

/**
 * Formats the results by rounding to 2 decimal places. 
 */
const formatResults = results => {
    let formattedResults = [];

    results.forEach(element => {
        formattedResults.push(parseFloat(element).toFixed(2));
    });

    return formattedResults;
}

/***
 * Adds each individual tax together to get the total tax owed.
 */
const sumTaxes = results => {
    let totalTax = 0;
    for (let i = 1; i < results.length; i++) {
        const tax = results[i];
        totalTax += parseFloat(tax);
    } // using a fori loop to skip index 0

    results.push(parseFloat(totalTax).toFixed(2));
    results.push(parseFloat(parseFloat(results[0]) - totalTax).toFixed(2));

    return results;
}

/**
 * Initializes the HTML page.
 */
const init = () => {
    document.querySelector(`#submit`).addEventListener(`click`, displayTaxes);
}

