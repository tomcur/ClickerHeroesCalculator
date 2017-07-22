var hashesAlgos = {
    "7a990d405d2c6fb93aa8fbb0ec1a3b23": "zlib"
};

var algosHashes = swapKeysValues(hashesAlgos);

var decodeAlgos = {
    "zlib": decodeZlib
};

var encodeAlgos = {
    "zlib": encodeZlib
};

function numberToString(number, decimals) {
    // decimals = 3 default
    decimals = defaultFor(decimals, 3);
    
    return new Decimal(number).toNearest(1 / Math.pow(10, decimals));
}

/**
 * There are some difficulties with locales with this script's number
 * output (when number > 1e21) and Clicker Heroes' input formatting. 
 * This function makes sure there are no decimal points in the output.
 */
function numberToClickerHeroesPasteableString(number, precision) {
    // precision = 10 default
    precision = defaultFor(precision, 10);
    
    number = new Decimal(number);
    var precision = new Decimal(precision);
    var ten = new Decimal(10);
    
    var b = number.log(10).floor();
    
    if(b.greaterThan(precision)) {
        var intPart;
        intPart = number.dividedBy(ten.pow(b.minus(precision))).round();
        return intPart + "e" + (b.minus(precision));
    } else {
        return ""+number.round();
    }
}

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function numberToStringFormatted(number, decimals) { 
    // decimals = 2 default
    decimals = defaultFor(decimals, 2);

    var number = new Decimal(number);
    if(number.greaterThan(1000000)) {
        return number.toPrecision(decimals+1);
    } else {
        return addCommas(number.toNearest(1 / Math.pow(10, decimals)));
    }
}


/* Encoding and decoding save games */

/**
 * Decode a base-64 encoded string of some JSON encoding
 */
function decodeSaveGame(str) {
    // Read the first 32 characters (they are the MD5 hash of the used algorithm)
    var algoHash = str.substring(0,32);
    
    // Default to "sprinkle" (old-style encoding)
    var algo = "sprinkle";
    
    // Test if the MD5 hash header corresponds to a known encoding algorithm
    if (algoHash in hashesAlgos) {
        algo = hashesAlgos[algoHash];
    }
    
    try {
        if (algo == "sprinkle") {
            alert('Decoding sprinkle-style strings temporarily disabled.');
        } else {
            var strStripped = str.substring(32);
            
            var json = decodeAlgos[algo](atob(strStripped));
            return {data: $.parseJSON(json), algo: algo};
        }
    } catch(e) {
        alert('Could not decode the save game data.');
        return null;
    }
}

/**
 * Decode a zlib deflated string
 */
function decodeZlib(str) {
    return pako.inflate(str, {to: 'string'});
}

function encodeSaveGame(rawData, algo) {
    // Special case old-style sprinkle encoding
    if (algo == "sprinkle") {
        alert('Encoding data in sprinkle-style temporarily disabled.');
    } else {
        if (!(algo in encodeAlgos)) {
            alert('Cannot encode using algo: ' + algo);
        }
        
        var algorithmHeader = algosHashes[algo];
        
        var json = JSON.stringify(rawData);
        var compressed = encodeAlgos[algo](json);
        return algorithmHeader + btoa(compressed);
    }
}

/**
 * Encode a string as zlib
 */
function encodeZlib(str) {
    return pako.deflate(str, {to: 'string'});
}

/**
 * Return arg if arg is defined, or val if arg is undefined.
 */
function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}

/**
 * Swap dictionary keys with values
 */
function swapKeysValues(dict) {
    var swapped = {};
    
    for (var key in dict) {
        swapped[dict[key]] = key;
    }
    
    return swapped;
}
