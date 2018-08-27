var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('⚡ upgrade');
	    }
        // if(creep.room.name!='W42N33'){
        //     creep.moveTo(new RoomPosition(22,22,'W42N33'));
        //     return -2;
        // }
        /*if(creep.room.controller.safeMode==undefined&&creep.room.controller.safeModeCooldown==undefined){
            if(creep.generateSafeMode(creep.room.controller)!=OK) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ff00aa'}});
                return;
            }
            else return;
        }*/
        var target=Game.spawns[creep.memory.spawn].room.controller;
	    if(creep.memory.working) {
	       // if(creep.memory.behaviour==1&&creep.room.name!='W42N32'){
	       //     creep.moveTo(creep.pos.findClosestByPath(FIND_EXIT_BOTTOM),{visualizePathStyle: {stroke: '#ff00aa'}});
	       //     return;
	       // }
            creep.upgradeController(target);
            var reuse=20;
            if(creep.pos.inRangeTo(target,4)) reuse=0;
            //if(creep.room.name!='W42N33'&&creep.pos.inRangeTo(creep.room.controller,1)) return;
            if(creep.pos.inRangeTo(target,3)) return;
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:reuse});
        }
        else {
	       // if(creep.memory.behaviour==1&&creep.room.name=='W42N32'){
	       //     creep.moveTo(new RoomPosition(22,22,'W42N33'));
	       //     return;
	       // }
            if(autoRenew(creep)) return;
            if(findEnergy(creep)==0){
                var reuse=20;
                if(creep.pos.inRangeTo(target,4)) reuse=0;
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:reuse});
            }
        }
        return 0;
	}
};

module.exports = roleUpgrader;