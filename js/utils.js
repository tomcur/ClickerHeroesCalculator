function numberToString(number, decimals = 3) {
    return new Decimal(number).toNearest(1 / Math.pow(10, decimals));
}

/**
 * There are some difficulties with locales with this script's number
 * output (when number > 1e21) and Clicker Heroes' input formatting. 
 * This function makes sure there are no decimal points in the output.
 */
function numberToClickerHeroesPasteableString(number, precision = 10) {
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

function numberToStringFormatted(number, decimals = 2) { 
    var number = new Decimal(number);
    if(number.greaterThan(1000000)) {
        return number.toPrecision(decimals+1);
    } else {
        return addCommas(number.toNearest(1 / Math.pow(10, decimals)));
    }
}


/* Encoding and decoding save games */
var ANTI_CHEAT_CODE = "Fe12NAfA3R6z4k0z";
var SALT = "af0ik392jrmt0nsfdghy0";
var CHARACTERS = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
function decodeSaveGame(txtIn) {
    var txtOut="";

    if (txtIn.search("ClickerHeroesAccountSO") != -1) {
        var start = 53;
        txtOut = txtIn.substr(start, txtIn.length - start - 1);
    } else {
        txtIn = txtIn.trim();
        if (txtIn=="") {
            return;
        }
        if (txtIn.search(ANTI_CHEAT_CODE) != -1) {
            var result = txtIn.split(ANTI_CHEAT_CODE);
            for (var i = 0; i < result[0].length; i += 2) {
                txtOut += result[0][i];
            }
            if (CryptoJS.MD5(txtOut + SALT) != result[1]) {
                alert("Bad hash");
                return;
            }
        }
        txtOut = atob(txtOut);
    }

    try {
        var rawData = $.parseJSON(txtOut);
        return rawData;
    } catch(e) {
        alert('Could not decode the save game data.');
        return null;
    }
}

function encodeSaveGame(rawData) {
    var json = JSON.stringify(rawData);
    var base64String = btoa(json);
    return sprinkle(base64String) + ANTI_CHEAT_CODE + getHash(base64String);
}

/* Thanks to:
 * https://jsfiddle.net/A45327Eq/fr1vmz3x/
 */
function sprinkle(string) {
    var characters;
    var randomIndex;
    var array = string.split("");
    var result = [];
    var counter = 0;
    while (counter < array.length) {
        result[counter * 2] = array[counter];
        characters = CHARACTERS;
        randomIndex = Math.floor(Math.random() * (characters.length - 1));
        result[counter * 2 + 1] = characters.substr(randomIndex, 1);
        counter++;
    }
    return result.join("");
}

function getHash(string) {
    var charaters = string.split();
    charaters.sort();
    var sortedCharaters = charaters.join();
    return CryptoJS.MD5(sortedCharaters + SALT);
}
