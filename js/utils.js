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
/** Decode a zlib deflated, base-64 encoded string
 */
function decodeSaveGame(str) {
    // Remove first 32 characters (they are some sort of header)
    var strStripped = str.substring(32);
    
    try {
        var json = pako.inflate(atob(strStripped), {raw: false, to: 'string'});
        return $.parseJSON(json);
    } catch(e) {
        alert('Could not decode the save game data.');
        return null;
    }
}

function encodeSaveGame(rawData) {
    // MD5 hash of "zlib", to identify zlib was the encoding algorithm
    var algorithmHeader = "7a990d405d2c6fb93aa8fbb0ec1a3b23";
    
    var json = JSON.stringify(rawData);
    var compressed = pako.deflate(json, {to: 'string'});
    return algorithmHeader + btoa(compressed);
}

/*
 * Return arg if arg is defined, or val if arg is undefined.
 */
function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}
