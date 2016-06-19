var functions = {
    one: function (param1) {
        return 1;
    },

    onePartialSum: function (param1) {
        return param1;
    },

    linear01: function (param1) {
        return param1 * 0.01;
    },

    linear05: function (param1) {
        return param1 * 0.05;
    },

    linear1: function (param1) {
        return param1;
    },

    linearEzPz: function (param1) {
        return Math.ceil(param1 / 3);
    },

    linear2: function (param1) {
        return param1 * 2;
    },

    linear3: function (param1) {
        return param1 * 3;
    },

    linear5: function (param1) {
        return param1 * 5;
    },

    linear10: function (param1) {
        return param1 * 10;
    },

    linear11: function (param1) {
        return param1 * 11;
    },

    linear15: function (param1) {
        return param1 * 15;
    },

    linear20: function (param1) {
        return param1 * 20;
    },

    linear25: function (param1) {
        return param1 * 25;
    },

    linear30: function (param1) {
        return param1 * 30;
    },

    linear35: function (param1) {
        return param1 * 35;
    },

    linear40: function (param1) {
        return param1 * 40;
    },

    linear45: function (param1) {
        return param1 * 45;
    },

    linear50: function (param1) {
        return param1 * 50;
    },

    linear100: function (param1) {
        return param1 * 100;
    },

    linear0_25: function (param1) {
        return param1 * 0.25;
    },

    linear: function (param1, param2) {
        param2 = Number(param2);
        return param1 * param2;
    },

    linearPartialSum: function (param1, param2) {
        return param1 * (param1 + 1) * 0.5 * Number(param2);
    },
    
    exponential: function (param1, param2) {
        param2 = Number(param2);
        return Math.pow(param2, param1);
    },

    exponentialPartialSum: function (param1, param2) {
        var r = Number(param2);
        return (1 - Math.pow(r, param1 + 1)) / (1 - r);
    },

    polynomial1_5: function (param1) {
        return Math.ceil(param1 * Math.sqrt(param1));
    },

    quadratic: function (param1) {
        return Math.pow(param1, 2);
    },

    cubic: function (param1) {
        return Math.pow(param1, 3);
    }
};