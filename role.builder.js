const BEHAVIOUR_NEAREST=0;
const BEHAVIOUR_FIRST=1;
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
var avoidRoads = require('function.avoidRoads');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('🚧 build');
	    }
	    
        // if(creep.room.name!='W42N33'){
        //     creep.moveTo(new RoomPosition(22,22,'W42N33'));
        //     return -2;
        // }
        var target;
        //if(creep.memory.behaviour==BEHAVIOUR_NEAREST){
            target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,
                {filter:site => site.my});
        // }
        // else if(creep.memory.behaviour==BEHAVIOUR_FIRST){
        //     var targets = creep.room.find(FIND_CONSTRUCTION_SITES,
        //         {filter:site => site.owner.username=='iamgqr'});
        //     target=targets[0];
        // }
	    if(creep.memory.working){
            if(target!=null) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    var reuse=6;
                    if(creep.pos.inRangeTo(target,6)) reuse=0;
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'},reusePath:reuse});
                    //38
                }
                else avoidRoads(creep);
            }
            else return -1;
	        /*
                var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,{filter:site => site.owner.username=='iamgqr'});
                if(target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
                    }
                }else// return -1;
                {
                    creep.moveTo(Game.getObjectById('59f1a05082100e1594f36846'), {visualizePathStyle: {stroke: '#ccff33'}});
                }*/
	    }
	    else{
            if(autoRenew(creep)) return;
            if(findEnergy(creep)==0){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
            }
            /*target=Game.getObjectById('5b798bf04602265638d1761b');
            if(creep.withdraw(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
	    }
	    return 0;
	}
};

module.exports = roleBuilder;