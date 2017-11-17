var Decimal = require('decimal.js');

module.exports = {
    one: function (param1) {
        return 1;
    },

    onePartialSum: function (param1) {
        return param1;
    },

    linear01: function (param1) {
        return param1.times(0.01);
    },

    linear05: function (param1) {
        return param1.times(0.05);
    },

    linear1: function (param1) {
        return param1;
    },

    linearEzPz: function (param1) {
        return param1.dividedBy(3).ceil();
    },

    linear2: function (param1) {
        return param1.times(2);
    },

    linear3: function (param1) {
        return param1.times(3);
    },

    linear5: function (param1) {
        return param1.times(5);
    },

    linear10: function (param1) {
        return param1.times(10);
    },

    linear11: function (param1) {
        return param1.times(11);
    },

    linear15: function (param1) {
        return param1.times(15);
    },

    linear20: function (param1) {
        return param1.times(20);
    },

    linear25: function (param1) {
        return param1.times(25);
    },

    linear30: function (param1) {
        return param1.times(30);
    },

    linear35: function (param1) {
        return param1.times(35);
    },

    linear40: function (param1) {
        return param1.times(40);
    },

    linear45: function (param1) {
        return param1.times(45);
    },

    linear50: function (param1) {
        return param1.times(50);
    },

    linear100: function (param1) {
        return param1.times(100);
    },

    linear0_25: function (param1) {
        return param1.times(0.25);
    },

    linear: function (param1, param2) {
        param2 = new Decimal(param2);
        return param1.times(param2);
    },

    linearPartialSum: function (param1, param2) {
        param2 = new Decimal(param2);
        return param1.times(param1.plus(1)).times(0.5).times(param2);
    },
    
    exponential: function (param1, param2) {
        param2 = new Decimal(param2);
        return param2.pow(param1);
    },

    exponentialPartialSum: function (param1, param2) {
        var r = new Decimal(param2);
        var one = new Decimal(1);
        return one.minus(r.pow(param1.plus(1))).dividedBy(one.minus(r));
    },

    polynomial1_5: function (param1) {
        return param1.times(param1.sqrt()).ceil();
    },
    
    /* Approximation */
    polynomial1_5PartialSum: function (param1) {
        return Decimal.div(2, 5).times(param1.pow(Decimal.div(5, 2)))
            .plus(Decimal.div(1, 2).times(param1.pow(Decimal.div(3, 2))))
            .plus(Decimal.div(1, 8).times(param1.pow(Decimal.div(1, 2))))
            .plus(Decimal.div(1, 1920).times(param1.pow(Decimal.div(-3, 2)))).ceil();
        /*
        param1 = param1.plus(1);
        var _loc2_ = param1.sqrt();
        var _loc3_ = param1.times(_loc2_);
        var _loc4_ = param1.times(_loc3_).times(0.4);
        var _loc5_ = _loc3_.times(0.5);
        var _loc6_ = _loc2_.times(0.125);
        var _loc7_ = new Decimal(0.00052).dividedBy(_loc3_);
        return _loc4_.minus(_loc5_).plus(_loc6_).minus(_loc7_).ceil();
        */
    },

    quadratic: function (param1) {
        return param1.pow(2);
    },

    cubic: function (param1) {
        return param1.pow(3);
    }
};