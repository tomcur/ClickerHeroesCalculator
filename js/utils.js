function numberToString(number) {
    var r = Math.round(number * 1000) / 1000;
    return ""+r;
}

/**
 * There are some difficulties with locales with this script's number
 * output (when number > 1e21) and Clicker Heroes' input formatting. 
 * This function makes sure there are no decimal points in the output.
 */
function numberToClickerHeroesPasteableString(number) {
    var b = Math.floor(Math.log(number)/Math.log(10));
    if(b >= 21) {
        var intPart;
        intPart = Math.round(number / Math.pow(10, b-10));
        return intPart + "0".repeat(b-10);
    } else {
        return ""+number;
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

function numberToStringFormatted(number) { 
    var number = Number(number);
    if(number > 1000000) {
        return number.toPrecision(3);
    } else {
        number = Math.round(number * 1000) / 1000;
        return addCommas(number);
    }
}