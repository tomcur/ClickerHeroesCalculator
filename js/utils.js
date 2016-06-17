function numberToString(number) {
    var r = Math.round(number * 1000) / 1000;
    return ""+r;
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