// Utility file to provide math functions
'use strict';

var pSI = ["", "k", "M", "G", "T"];
var nSI = ["", "m", "&micro;", "&nano;", "&pico;"];
var siaConversionFactor = Math.pow(10,27);

// base units to siacoin
function siacoin(mcoin) {
	return mcoin / siaConversionFactor;
}

// siacoin to base units
function baseUnit(units) {
	return units * siaConversionFactor;
}

// base units & precision to siacoin
function fksiacoin(mcoin, l) {
	if (!l) {
		l = 10;
	}
	var string = parseFloat(siacoin(mcoin).toFixed(1));

	// Indicate if the user has some value with a last digit of '1'
	if (mcoin > 0 && string === parseFloat((0).toFixed(1))) {
		string = parseFloat((0).toFixed(l).substring(0,l-1) + "1");
	}
	return string + " KS";
}

// precision determines the length of number
function limitPrecision(number, precision) {
	return number.toString().slice(0,precision+1);
}

// engineering notation
function engNotation(number, precision) {
	if (number === 0) {
		return "0.0000 ";
	}
	precision = precision || 8;

	var degree = Math.floor(Math.log(Math.abs(number)) / Math.LN10 / 3);

	var numberString = String(number / Math.pow(1000,degree));

	var si = degree > 0 ? pSI[degree] : nSI[degree * -1];

	return numberString.slice(0,precision + 1) + " " + si;
}

// precision determines the length of number
function round(number, flex) {
	flex = flex || 0.01;
	if (Math.ceil(number) - number <= flex) {
		return Math.ceil(number);
	}
	else if (number - Math.floor(number) <= flex) {
		return Math.floor(number);
	}
}

// convert floating-point to full integer
function bigInt(x) {
	var e;
	if (Math.abs(x) < 1.0) {
		e = parseInt(x.toString().split('e-')[1]);
		if (e) {
			x *= Math.pow(10,e-1);
			x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
		}
	} else {
		e = parseInt(x.toString().split('+')[1]);
		if (e > 20) {
			e -= 20;
			x /= Math.pow(10,e);
			x += (new Array(e+1)).join('0');
		}
	}
	return x;
}

// properly controls data size representation
function formatBytes(bytes) {
	if (bytes === 0) {
		return '0B';
	}
	var k = 1000;
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
}

module.exports =  {
	"siaConversionFactor": siaConversionFactor,
	"siacoin": siacoin,
	"baseUnit": baseUnit,
	"fksiacoin": fksiacoin,
	"limitPrecision": limitPrecision,
	"engNotation": engNotation,
	"round": round,
	"bigInt": bigInt,
	"formatBytes": formatBytes
};
