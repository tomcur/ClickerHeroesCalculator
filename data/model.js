var goallinear = function(baseLevel, oldLevel) { return base; }
var goallinearhalf = function(base, gold) { return base/2; }
var goallinearfifth = function(base, gold) { return base/5; }
var goalgold = function(base, gold) { return base*gold; }
var goalJuggernaut = function(base, gold) { return Math.pow(base, 0.8); }
var goalMorgulis = function(base, gold) { return Math.pow(base+2+Math.min(base, 100)/5, 2); }

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
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            if(transcended) {
                return Math.pow(baseLevel, 0.8) / Math.pow(alpha, 0.4); 
            } else {
                return Math.min(
                    baseLevel,
                    1.15 * Math.pow(Math.log(3.25 * Math.pow(baseLevel, 2)), 0.4) * Math.pow(baseLevel, 0.8)
                ); 
            }
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "morgulis": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            return Math.pow(baseLevel, 2); 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "siyalatas": { // Idle
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return baseLevel; },
        "goalHybrid": "goalIdle",
        "goalActive": null
    },
    "argaiv": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            return baseLevel; 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
        
    },
    "libertas": { // Idle
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            if(wepwawetLeveledBeyond8k) {
                return 0.905*baseLevel; 
            } else {
                return 0.926*baseLevel; 
            } 
        },
        "goalHybrid": "goalIdle",
        "goalActive": null
    },
    "mammon": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            if(wepwawetLeveledBeyond8k) {
                return 0.905*baseLevel; 
            } else {
                return 0.926*baseLevel; 
            }
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "mimzee": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            if(wepwawetLeveledBeyond8k) {
                return 0.905*baseLevel; 
            } else {
                return 0.926*baseLevel; 
            } 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "dora": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            return 2.877 * Math.log(baseLevel) - 1.4365 * Math.log(100/99 - Math.exp(-0.002 * oldLevel)) - 9.63; 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "atman": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            if(transcended) {
                return 2.832 * Math.log(baseLevel) - 1.416 * Math.log(alpha) - 1.416 * Math.log(4/3 - Math.exp(-0.013 * oldLevel)) - 6.613; 
            } else {
                // Todo: need RoT for this
                return Math.log(baseLevel)/Math.log(2);
            }
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "kumawakamaru": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            if(transcended) {
                return 2.844 * Math.log(baseLevel) - 1.422 * Math.log(alpha) - 1.422 * Math.log(1/4 + Math.exp(-0.01 * oldLevel)) - 7.014; 
            } else {
                // Todo: need RoT for this
                return Math.log(baseLevel)/Math.log(2);
            }
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "dogcog": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            return 2.844 * Math.log(baseLevel) - 1.422 * Math.log(1/99 + Math.exp(-0.01 * oldLevel)) - 7.232; 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "fortuna": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            return 2.875 * Math.log(baseLevel) - 1.4375 * Math.log(10/9 - Math.exp(-0.0025 * oldLevel)) - 9.3; 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "bubos": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            return 2.8 * Math.log(baseLevel) - 1.4 * Math.log(1 + Math.exp(-0.02 * oldLevel)) - 5.94; 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "chronos": { // Both
        "goalIdle": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { 
            baseLevel = Math.max(baseLevel, baseLevel * hybridRatio);
            return 2.75 * Math.log(baseLevel) - 1.375 * Math.log(2 - Math.exp(-0.034 * oldLevel)) - 5.1; 
        },
        "goalHybrid": "goalIdle",
        "goalActive": "goalIdle"
    },
    "fragsworth": { // Active
        "goalIdle": null,
        "goalHybrid": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return hybridRatio * baseLevel; },
        "goalActive": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return baseLevel; }
    },
    "bhaal": { // Active
        "goalIdle": null,
        "goalHybrid": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return hybridRatio * baseLevel; },
        "goalActive": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return baseLevel; }
    },
    "juggernaut": { // Active
        "goalIdle": null,
        "goalHybrid": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return Math.pow(hybridRatio * baseLevel, 0.8); },
        "goalActive": function(baseLevel, oldLevel, alpha, tpcap, transcended, wepwawetLeveledBeyond8k, hybridRatio) { return Math.pow(baseLevel, 0.8); }
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

	window.Ancients = _.mapKeys(data.ancients, function(anc) { return anc.name.toLowerCase().substring(0, anc.name.indexOf(',')); });
    
	addToAncients();
	
	window.Achievements = _.mapValues(data.achievements, function(ach) { return ach.rewardFunction === 'addDps' ? parseInt(ach.rewardParams) : 0; });
	
	window.AncientMin = Math.min.apply(null, _.keys(data.ancients));
	window.AncientMax = Math.max.apply(null, _.keys(data.ancients));
    window.Outsiders = _.mapKeys(data.outsiders, function(outsider) { return outsider.name.toLowerCase(); });
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
    for(var k in Ancients) {
        var ancient = Ancients[k];
        Ancients[k].extraInfo = AncientsExtraInfo[k] ? AncientsExtraInfo[k] : EmptyExtraInfo;
        Ancients[k].costfn = costFunctionCreator(ancient);
        Ancients[k].partialCostfn = costPartialSumFunctionCreator(ancient);
    }
}

