// API URL for currency conversion
const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-btn');
const resultDiv = document.getElementById('result');

// Currency to country code mapping
const currencyToCountry = {
    'USD': 'us',
    'EUR': 'eu',
    'GBP': 'gb',
    'JPY': 'jp',
    'AUD': 'au',
    'CAD': 'ca',
    'CHF': 'ch',
    'CNY': 'cn',
    'INR': 'in',
    'NZD': 'nz',
    'AED': 'ae',
    'AFN': 'af',
    'ALL': 'al',
    'AMD': 'am',
    'ANG': 'an',
    'AOA': 'ao',
    'ARS': 'ar',
    'AWG': 'aw',
    'AZN': 'az',
    'BAM': 'ba',
    'BBD': 'bb',
    'BDT': 'bd',
    'BGN': 'bg',
    'BHD': 'bh',
    'BIF': 'bi',
    'BMD': 'bm',
    'BND': 'bn',
    'BOB': 'bo',
    'BRL': 'br',
    'BSD': 'bs',
    'BTN': 'bt',
    'BWP': 'bw',
    'BYN': 'by',
    'BZD': 'bz',
    'CDF': 'cd',
    'CLP': 'cl',
    'COP': 'co',
    'CRC': 'cr',
    'CUP': 'cu',
    'CVE': 'cv',
    'CZK': 'cz',
    'DJF': 'dj',
    'DKK': 'dk',
    'DOP': 'do',
    'DZD': 'dz',
    'EGP': 'eg',
    'ERN': 'er',
    'ETB': 'et',
    'FJD': 'fj',
    'FKP': 'fk',
    'FOK': 'fo',
    'GEL': 'ge',
    'GGP': 'gg',
    'GHS': 'gh',
    'GIP': 'gi',
    'GMD': 'gm',
    'GNF': 'gn',
    'GTQ': 'gt',
    'GYD': 'gy',
    'HKD': 'hk',
    'HNL': 'hn',
    'HRK': 'hr',
    'HTG': 'ht',
    'HUF': 'hu',
    'IDR': 'id',
    'ILS': 'il',
    'IMP': 'im',
    'IQD': 'iq',
    'IRR': 'ir',
    'ISK': 'is',
    'JEP': 'je',
    'JMD': 'jm',
    'JOD': 'jo',
    'KES': 'ke',
    'KGS': 'kg',
    'KHR': 'kh',
    'KID': 'ki',
    'KMF': 'km',
    'KRW': 'kr',
    'KWD': 'kw',
    'KYD': 'ky',
    'KZT': 'kz',
    'LAK': 'la',
    'LBP': 'lb',
    'LKR': 'lk',
    'LRD': 'lr',
    'LSL': 'ls',
    'LYD': 'ly',
    'MAD': 'ma',
    'MDL': 'md',
    'MGA': 'mg',
    'MKD': 'mk',
    'MMK': 'mm',
    'MNT': 'mn',
    'MOP': 'mo',
    'MRU': 'mr',
    'MUR': 'mu',
    'MVR': 'mv',
    'MWK': 'mw',
    'MXN': 'mx',
    'MYR': 'my',
    'MZN': 'mz',
    'NAD': 'na',
    'NGN': 'ng',
    'NIO': 'ni',
    'NOK': 'no',
    'NPR': 'np',
    'OMR': 'om',
    'PAB': 'pa',
    'PEN': 'pe',
    'PGK': 'pg',
    'PHP': 'ph',
    'PKR': 'pk',
    'PLN': 'pl',
    'PYG': 'py',
    'QAR': 'qa',
    'RON': 'ro',
    'RSD': 'rs',
    'RUB': 'ru',
    'RWF': 'rw',
    'SAR': 'sa',
    'SBD': 'sb',
    'SCR': 'sc',
    'SDG': 'sd',
    'SEK': 'se',
    'SGD': 'sg',
    'SHP': 'sh',
    'SLE': 'sl',
    'SLL': 'sl',
    'SOS': 'so',
    'SRD': 'sr',
    'SSP': 'ss',
    'STN': 'st',
    'SYP': 'sy',
    'SZL': 'sz',
    'THB': 'th',
    'TJS': 'tj',
    'TMT': 'tm',
    'TND': 'tn',
    'TOP': 'to',
    'TRY': 'tr',
    'TTD': 'tt',
    'TVD': 'tv',
    'TWD': 'tw',
    'TZS': 'tz',
    'UAH': 'ua',
    'UGX': 'ug',
    'UYU': 'uy',
    'UZS': 'uz',
    'VES': 've',
    'VND': 'vn',
    'VUV': 'vu',
    'WST': 'ws',
    'XAF': 'cm',
    'XCD': 'ag',
    'XDR': 'imf',
    'XOF': 'sn',
    'XPF': 'pf',
    'YER': 'ye',
    'ZAR': 'za',
    'ZMW': 'zm',
    'ZWL': 'zw'
};

// Fetch all available currencies
async function fetchCurrencies() {
    try {
        const response = await fetch(`${API_URL}USD`);
        const data = await response.json();
        return Object.keys(data.rates);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        return [];
    }
}

// Create flag element
function createFlagElement(currency) {
    const flag = document.createElement('div');
    flag.className = 'currency-flag';
    const countryCode = currencyToCountry[currency] || currency.toLowerCase();
    flag.style.backgroundImage = `url(https://flagcdn.com/w40/${countryCode}.png)`;
    return flag;
}

// Populate currency dropdowns
async function populateCurrencies() {
    const currencies = await fetchCurrencies();
    
    currencies.forEach(currency => {
        const fromOption = document.createElement('option');
        const toOption = document.createElement('option');
        
        fromOption.value = currency;
        fromOption.textContent = currency;
        toOption.value = currency;
        toOption.textContent = currency;
        
        fromCurrency.appendChild(fromOption);
        toCurrency.appendChild(toOption);
    });
    
    // Add flags to select wrappers
    const fromWrapper = fromCurrency.parentElement;
    const toWrapper = toCurrency.parentElement;
    
    fromWrapper.appendChild(createFlagElement('USD'));
    toWrapper.appendChild(createFlagElement('EUR'));
    
    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
    
    // Update flags when currency changes
    fromCurrency.addEventListener('change', () => {
        fromWrapper.querySelector('.currency-flag').remove();
        fromWrapper.appendChild(createFlagElement(fromCurrency.value));
    });
    
    toCurrency.addEventListener('change', () => {
        toWrapper.querySelector('.currency-flag').remove();
        toWrapper.appendChild(createFlagElement(toCurrency.value));
    });
}

// Convert currency
async function convertCurrency() {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    if (amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}${from}`);
        const data = await response.json();
        
        if (data.rates && data.rates[to]) {
            const rate = data.rates[to];
            const result = (amount * rate).toFixed(2);
            resultDiv.textContent = `${amount} ${from} = ${result} ${to}`;
        } else {
            resultDiv.textContent = 'Error: Currency not found';
        }
    } catch (error) {
        resultDiv.textContent = 'Error: Failed to fetch exchange rates';
        console.error('Error:', error);
    }
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

// Initialize
populateCurrencies(); 