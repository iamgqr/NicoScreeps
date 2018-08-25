
var findEnergy = require('function.findEnergy');

var roleSupporter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('🚚 support');
	    }

        if(creep.room.name!='W42N33'){
            creep.moveTo(new RoomPosition(22,22,'W42N33'));
            return -2;
        }
        var findTarget=function(){
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            targets.sort((a,b) =>
            (Math.max(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))+
            0.1*Math.min(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))-
            Math.max(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y))-
            0.1*Math.min(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y)))*50
            );
            return targets;
        };
        var targets=findTarget();
        var target=targets[0];
        if(creep.memory.working) {
            var spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN) &&
                        (!structure.spawning||structure.spawning.remainingTime<=creep.pos.getRangeTo(spawn));
                }
            });
	        if(creep.ticksToLive<300||Game.time-creep.memory.needRenew<=creep.body.length*2){
                if(spawn){
                    if(spawn.renewCreep(creep)==ERR_NOT_IN_RANGE){
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'}});
                    }
                    spawn.memory.needRenew=Game.time;
                }
                if(creep.ticksToLive<300) creep.memory.needRenew=Game.time;
                return;
            }
            if(target) {
                var ret=creep.transfer(target, RESOURCE_ENERGY);
                if(ret == ERR_NOT_IN_RANGE) {
                    var reuse=7;
                    if(creep.pos.inRangeTo(target,3)) reuse=0;
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:reuse,ignoreCreeps:true,plainCost:100,swampCost:100});
                }
                if(ret==OK&&!(creep.carry.energy<=target.energyCapacity-target.energy)){
                    var target=targets[1];
                    if(!target) return;
                    if(creep.pos.inRangeTo(target,1)) return;
                    var reuse=7;
                    if(creep.pos.inRangeTo(target,3)) reuse=0;
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:reuse,ignoreCreeps:true,plainCost:100,swampCost:100});
                }
            }
            else{
                return -2;
            }
        }
	    else {
            //console.log('QWQ'+creep.name);
	        if(findEnergy.findEnergy(creep)==0){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},ignoreCreeps:true,plainCost:100,swampCost:100});
	        }
        }
        return 0;
	}
};

module.exports = roleSupporter;