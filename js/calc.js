/**
 * See: https://www.reddit.com/r/ClickerHeroes/comments/4naohc/math_and_transcendance/
 */

function buildMode() {
    if(data.settings.buildMode == "idle") {
        return "idle";
    } else if (data.settings.buildMode == "hybrid") {
        return "hybrid";
    } else {
        return "active";
    }
}

function maxTpReward() { 
    return new Decimal(0.05 + data.outsiders["borb"].level * 0.005).times(data.heroSoulsSacrificed);
}
 
function hpScaleFactor() { 
    var zone = data.ascensionZone;
    var i = zone.dividedBy(500).floor();
    var scale = i.times(0.005).plus(1.145);
    return scale;
}

function alphaFactor(wepwawetLeveledBeyond8k) { 
    if(wepwawetLeveledBeyond8k) {
        return data.tp.dividedBy(100).plus(1).ln().times(1.1085).dividedBy(hpScaleFactor().ln());
    } else {
        return data.tp.dividedBy(100).plus(1).ln().times(1.4067).dividedBy(hpScaleFactor().ln());
        
    }
}

/**
 * See: https://www.reddit.com/r/ClickerHeroes/comments/4n80r5/boss_level_to_hit_cap/
 */
function bossToHitCap() {
    if (data.ancients["solomon"].extraInfo.optimalLevel) {
        var solomon = data.ancients["solomon"].extraInfo.optimalLevel
    } else {
        var solomon = data.ancients["solomon"].level;
    }
    
    var ponyboy = data.outsiders["ponyboy"].level;
    var tp = data.tp.dividedBy(100); 
    var maxTP = maxTpReward(); // (5% ((+0.5*Borb)%) of your Sacrificed Souls
    
    var multiplier;
    if (solomon.lessThan(21)) {
        multiplier = ponyboy.plus(1).times(solomon.times(0.05)).plus(1);
    } else if (solomon.lessThan(41)) {
        multiplier = ponyboy.plus(1).times(solomon.minus(20).times(0.04).plus(1)).plus(1);
    } else if (solomon.lessThan(61)) {
        multiplier = ponyboy.plus(1).times(solomon.minus(40).times(0.03).plus(1.8)).plus(1);
    } else if (solomon.lessThan(81)) {
        multiplier = ponyboy.plus(1).times(solomon.minus(60).times(0.02).plus(2.4)).plus(1);
    } else {
        multiplier = ponyboy.plus(1).times(solomon.minus(80).times(0.01).plus(2.8)).plus(1);
    }
    
    var bossNumber = maxTP.dividedBy(multiplier.times(20)).ln().dividedBy(tp.plus(1).ln()).ceil();
    return bossNumber;
}

function zoneToHitCap() {
    return Decimal.max(bossToHitCap().times(5).plus(100), new Decimal(105));
}

function ascensionZone() {
    return data.ascensionZone.times(1.05);
}

function tpCapReached() {
    var boss = ascensionZone().times(1.05).minus(100).dividedBy(5);
    return boss >= bossToHitCap();
}

function resetOptimalLevels() {
    for (var k in data.ancients) {
        data.ancients[k].extraInfo.optimalLevel = null;
    }
}

function calculate() {
    resetOptimalLevels();
    
    var tuneAncient;
    
    if(buildMode() == "idle" || buildMode() == "hybrid") {
        tuneAncient = data.ancients["siyalatas"];
    } else {
        tuneAncient = data.ancients["fragsworth"];
    }
    
    return optimize(tuneAncient);
}

function computeOptimalLevels(tuneAncient, addLevels) {
    var alpha = alphaFactor(data.settings.wep8k);
    var transcendent = alpha > 0;
    var atcap = tpCapReached();
    
    var baseLevel = tuneAncient.level.plus(addLevels);
    for (var k in data.ancients) {
        // Test if this ancient is to be excluded
        if (data.ancients[k].extraInfo.exclude && data.ancients[k].extraInfo.exclude()) {
            continue;
        }
        
        var oldLevel = data.ancients[k].level;
        
        if (oldLevel.greaterThan(0) || k == "soulbank") {
            var goalFun;
            var hybridRatio;
            if (buildMode() == "idle") {
                goalFun = data.ancients[k].extraInfo.goalIdle;
                hybridRatio = 1;
            } else if(buildMode() == "hybrid") {
                goalFun = data.ancients[k].extraInfo.goalHybrid;
                hybridRatio = data.settings.hybridRatio;
            } else {
                goalFun = data.ancients[k].extraInfo.goalActive;
                hybridRatio = 1;
            }
            
            if(typeof goalFun === 'string') {
                goalFun = data.ancients[k].extraInfo[goalFun];
            }
            
            if (goalFun) {
                var g = goalFun(baseLevel, oldLevel, alpha, atcap, transcendent, data.settings.wep8k, hybridRatio);
                
                
                data.ancients[k].extraInfo.optimalLevel = Decimal.max(data.ancients[k].level, g.ceil());
            }
        }
    }
}

/**
 * Calculate the Hero Soul cost to level all ancients to their optimals.
 *
 * Approximates the cost for an ancient if more than 25,000 calculations would be 
 * required. 
 */
function calculateHSCostToOptimalLevel() {
    multiplier = Decimal.pow(0.95, data.outsiders["chor'gorloth"].level);
    
    var maxNumSteps = 2500; // Precision of approximation
    
    var totalCost = new Decimal(0);
    for (var k in data.ancients) {
        var oldLevel = data.ancients[k].level;
        if (data.ancients[k].extraInfo.optimalLevel) {
            var optimalLevel = data.ancients[k].extraInfo.optimalLevel;
            
            var diff = optimalLevel.minus(oldLevel);
            if (diff.lessThan(0)) {
                data.ancients[k].extraInfo.costToLevelToOptimal = new Decimal(0);
                continue;
            }
            
            var thisAncientCost = new Decimal(0);
            
            if(data.ancients[k].partialCostfn) {
                // We have defined the partial sum for this level cost formula,
                // use it instead of iterating
                thisAncientCost = data.ancients[k].partialCostfn(optimalLevel).minus(data.ancients[k].partialCostfn(oldLevel));
            } else {
                var numSteps = Decimal.min(maxNumSteps, diff);
                var stepSize = diff.dividedBy(numSteps);
                
                var temp = 0;
                for(var step = 1; step <= numSteps; step++) {
                    var prevAddLevels = step.minus(1).times(stepSize).ceil();
                    var addLevels = step.times(stepSize).ceil();
                    
                    var level = oldLevel.plus(addLevels);
                    var thisStepSize = addLevels.minus(prevAddLevels);
                    
                    temp = temp.plus(data.ancients[k].costfn(level).times(thisStepSize));
                }
                
                thisAncientCost = temp;
            }
            
            if (k != "soulbank") {
                thisAncientCost = thisAncientCost.times(multiplier).ceil();
            }
            
            data.ancients[k].extraInfo.costToLevelToOptimal = thisAncientCost;
            totalCost = totalCost.plus(thisAncientCost); 
        }
    }
    
    return totalCost;
}

function compute(tuneAncient, addLevels) {
    computeOptimalLevels(tuneAncient, addLevels);
    return calculateHSCostToOptimalLevel();
}

function optimize(tuneAncient) {
    var hs = data.heroSoulsForLeveling;
    var baseLevel = tuneAncient.level;
    
    if (! data.ancients["morgulis"].level.greaterThan(0)) {
        // We do not own Morgulis, so activate the soulbank
        data.ancients["soulbank"] = {
            "name": "soulbank", 
            "level": new Decimal(0), 
            "costfn": functions.one,
            "partialCostfn": functions.onePartialSum,
            "extraInfo": {
                "goalIdle": data.ancients["morgulis"].extraInfo.goalIdle,
                "goalHybrid": data.ancients["morgulis"].extraInfo.goalHybrid,
                "goalActive": data.ancients["morgulis"].extraInfo.goalActive,
                }
        };
    }
    
    var left = baseLevel.times(-1);
    if (hs.greaterThan(0)) {
        var right = hs.plus(baseLevel.times(baseLevel.plus(1))).sqrt().ceil().minus(baseLevel);
    } else {
        var right = new Decimal(0);
    }
    var spentHS;
    
    // Iterate until we have converged, or until we are very close to convergence.
    // Converging exactly has run-time complexity in O(log(hs)), which, though sub-
    // polynomial in hs, is still very slow (as hs is basically exponential 
    // in play-time). As such, we'll make do with an approximation.
    var initialDiff = right.minus(left);
    while (right.minus(left).greaterThan(1) && right.minus(left).dividedBy(initialDiff).greaterThan(0.00001)) {
        if(typeof spentHS === 'undefined') {
            var mid = right.plus(left).dividedBy(2).floor();
        } else { 
            var fitIndicator = spentHS.dividedBy(hs).ln();
            var interval = right.minus(left);
            
            /*
            var modifier = Decimal.max(Decimal.min(fitIndicator.neg().dividedBy(10), 0.5), -0.5);
            var mid = left.plus(interval.dividedBy(2)).plus(interval.times(modifier).dividedBy(2)).floor();
            */
            
            // If the (log of) the number of the percentage of spent hero souls is very 
            // large or very small, place the new search point off-center.
            if (fitIndicator.lessThan(-0.1)) {
                var mid = left.plus(interval.dividedBy(1.25)).floor();
            } else if (fitIndicator.greaterThan(0.1)) {
                var mid = left.plus(interval.dividedBy(4)).floor();
            } else {
                var mid = right.plus(left).dividedBy(2).floor();
            }
        }
        
        // Level according to RoT and calculate new cost
        spentHS = compute(tuneAncient, mid);
        if (spentHS.lessThan(hs)) {
            left = mid;
        } else { 
            right = mid;
        }
    }
    
    // Level according to RoT and calculate new cost
    spentHS = compute(tuneAncient, left);
    
    if  (data.ancients["soulbank"]) {
        // Soul bank was used, subtract number of HS put into soulbank
        // from the number of spent HS.
        spentHS = spentHS.minus(data.ancients["soulbank"].extraInfo.optimalLevel);
        delete data.ancients["soulbank"];
    }
    
    return spentHS;
}
