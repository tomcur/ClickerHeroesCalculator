var Decimal = require('decimal.js');
var functions = require(__dirname + '/functions.js');

exports.createObjects = createObjects;

var EmptyExtraInfo = {
    "goalEval": null,
    "goalfunction": null,
    "fIncludeForSol": false,
    "fIdle": false,
    "fActive": false
};

// Base level for idle: Siyalatas' level
// Base level for hybrid: Siyalatas' level
// Base level for active: Fragsworth's level
var AncientsExtraInfo = {
    "solomon": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            if(transcended) {
                return baseLevel.pow(0.8).dividedBy(alpha.pow(0.4));
            } else {
                return Decimal.min(
                    baseLevel,
                    baseLevel.pow(2).times(3.25).ln().pow(0.4).times(baseLevel.pow(0.8)).times(1.15)
                ); 
            }
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "morgulis": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            return baseLevel.pow(2); 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "siyalatas": { // Idle
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return baseLevel; },
        "goalHybrid": "goalIdle",
        "goalActive": null,
        "exclude": null
    },
    "argaiv": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            return baseLevel; 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
        
    },
    "libertas": { // Idle
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            if(wepwawetLeveledBeyond8k) {
                return baseLevel.times(0.905); 
            } else {
                return baseLevel.times(0.926); 
            } 
        },
        "goalHybrid": "goalIdle",
        "goalActive": null,
        "exclude": null
    },
    "mammon": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            if(wepwawetLeveledBeyond8k) {
                return baseLevel.times(0.905); 
            } else {
                return baseLevel.times(0.926); 
            }
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "mimzee": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            if(wepwawetLeveledBeyond8k) {
                return baseLevel.times(0.905); 
            } else {
                return baseLevel.times(0.926); 
            } 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "pluto": { // Active
        // TODO: As Pluto is a skill ancient, perhaps we should take the skillAncientLevelRate into account.
        "goalIdle": null,
        "goalHybrid": "goalActive",
        "goalActive": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) {
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            if(wepwawetLeveledBeyond8k) {
                return baseLevel.times(0.905); 
            } else {
                return baseLevel.times(0.926); 
            }
        },
        "exclude": null
    },
    "dora": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            var level = baseLevel.ln().times(2.877).minus(Decimal.div(100, 99).minus(oldLevel.times(-0.002).exp()).ln().times(1.4365)).minus(9.63);
            return Decimal.min(level, 18715);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "atman": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            var level;
            if(transcended) {
                level = baseLevel.ln().times(2.832).minus(alpha.ln().times(1.416)).minus(Decimal.div(4, 3).minus(oldLevel.times(-0.013).exp()).ln().times(1.416)).minus(6.613);
            } else {
                // Todo: need RoT for this
                level = baseLevel.ln().dividedBy(new Decimal(2).ln());
            }
            return Decimal.min(level, 2880);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "kumawakamaru": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            var level;
            if(transcended) {
                level = baseLevel.ln().times(2.844).minus(alpha.ln().times(1.422)).minus(Decimal.div(1, 4).plus(oldLevel.times(-0.01).exp()).ln().times(1.422)).minus(7.014);
            } else {
                // Todo: need RoT for this
                level = baseLevel.ln().dividedBy(new Decimal(2).ln());
            }
            return Decimal.min(level, 14972);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "dogcog": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            var level = baseLevel.ln().times(2.844).minus(Decimal.div(1, 99).plus(oldLevel.times(-0.01).exp()).ln().times(1.422)).minus(7.232);
            return Decimal.min(level, 3743);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "fortuna": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            var level = baseLevel.ln().times(2.875).minus(Decimal.div(10, 9).minus(oldLevel.times(-0.0025).exp()).ln().times(1.4375)).minus(9.3);
            return Decimal.min(level, 14972);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "bubos": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            var level = baseLevel.ln().times(2.8).minus(new Decimal(1).plus(oldLevel.times(-0.02).exp()).ln().times(1.4)).minus(5.94);
            return Decimal.min(level, 18715);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "chronos": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            var level = baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
            return Decimal.min(level, 1101);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": null
    },
    "fragsworth": { // Active
        "goalIdle": null,
        "goalHybrid": "goalActive",
        "goalActive": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return baseLevel.times(hybridRatio); },
        "exclude": null
    },
    "bhaal": { // Active
        "goalIdle": null,
        "goalHybrid": "goalActive",
        "goalActive": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return baseLevel.times(hybridRatio); },
        "exclude": null
    },
    "juggernaut": { // Active
        "goalIdle": null,
        "goalHybrid": "goalActive",
        "goalActive": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return baseLevel.times(hybridRatio).pow(0.8); },
        "exclude": null
    },
    "nogardnit": { // Idle
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) {
            baseLevel = Decimal.max(baseLevel, baseLevel.times(hybridRatio));
            if(wepwawetLeveledBeyond8k) {
                return baseLevel.times(0.905).pow(0.8);
            } else {
                return baseLevel.times(0.926).pow(0.8);
            }
        },
        "goalHybrid": "goalIdle",
        "goalActive": null,
        "exclude": null
    },
    "berserker": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.skillAncientsLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.skillAncientsLevelRate).pow(2))
            );
            return baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.skillAncientsLevelRate <= 0;
        }
    },
    "chawedo": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.skillAncientsLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.skillAncientsLevelRate).pow(2))
            );
            return baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.skillAncientsLevelRate <= 0;
        }
    },
    "energon": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.skillAncientsLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.skillAncientsLevelRate).pow(2))
            );
            return baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.skillAncientsLevelRate <= 0;
        }
    },
    "hecatoncheir": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.skillAncientsLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.skillAncientsLevelRate).pow(2))
            );
            return baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.skillAncientsLevelRate <= 0;
        }
    },
    "kleptos": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.skillAncientsLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.skillAncientsLevelRate).pow(2))
            );
            return baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.skillAncientsLevelRate <= 0;
        }
    },
    "revolc": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.revolcLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.revolcLevelRate).pow(2))
            );
            var level = baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
            return Decimal.min(level, 3743);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.revolcLevelRate <= 0;
        }
    },
    "sniperino": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.skillAncientsLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.skillAncientsLevelRate).pow(2))
            );
            return baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.skillAncientsLevelRate <= 0;
        }
    },
    "vaagur": {
        "goalIdle": function(baseLevel, oldLevel, alpha, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Decimal.max(
                baseLevel.times(new Decimal(data.settings.skillAncientsLevelRate).pow(2)), 
                baseLevel.times(hybridRatio).times(new Decimal(data.settings.skillAncientsLevelRate).pow(2))
            );
            var level = baseLevel.ln().times(2.75).minus(new Decimal(2).minus(oldLevel.times(-0.034).exp()).ln().times(1.375)).minus(5.1);
            return Decimal.min(level, 1440);
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle",
        "exclude": function() {
            return data.settings.skillAncientsLevelRate <= 0;
        }
    }
};

// Todo, find goals for optimization: 
// Chor vs. Pony: https://www.reddit.com/r/ClickerHeroes/comments/4o3f98/chorpony_balance/
var outsiderExtraInfo = {
    
};

function createObjects(data) {
    // Add ItemId's to ancients.
    for (var type in data.itemBonusTypes) {
        data.ancients[data.itemBonusTypes[type].ancientId].itemId = type; 
    }

    data.ancients = _.mapKeys(data.ancients, function(anc) { return anc.name.toLowerCase().substring(0, anc.name.indexOf(',')); });
    
    addToAncients();
    
    data.achievements = _.mapValues(data.achievements, function(ach) { return ach.rewardFunction === 'addDps' ? parseInt(ach.rewardParams) : 0; });
    
    data.ancientMin = Math.min.apply(null, _.keys(data.ancients));
    data.ancientMax = Math.max.apply(null, _.keys(data.ancients));
    data.outsiders = _.mapKeys(data.outsiders, function(outsider) { return outsider.name.toLowerCase(); });
}

function costFunctionCreator(ancient) {
    return function(lvl) { 
        if (ancient.levelCostParams) {
            return functions[ancient.levelCostFormula](lvl, ancient.levelCostParams);
        } else {
            return functions[ancient.levelCostFormula](lvl);
        }
    };
}

function costPartialSumFunctionCreator(ancient) {
    if(functions[ancient.levelCostFormula + "PartialSum"]) {
        return function(lvl) { 
            if (ancient.levelCostParams) {
                return functions[ancient.levelCostFormula + "PartialSum"](lvl, ancient.levelCostParams);
            } else {
                return functions[ancient.levelCostFormula + "PartialSum"](lvl);
            }
        };
    } else {
        return null;
    }
}

function addToAncients() {
    for(var k in data.ancients) {
        var ancient = data.ancients[k];
        data.ancients[k].extraInfo = AncientsExtraInfo[k] ? AncientsExtraInfo[k] : EmptyExtraInfo;
        data.ancients[k].costfn = costFunctionCreator(ancient);
        data.ancients[k].partialCostfn = costPartialSumFunctionCreator(ancient);
    }
}

