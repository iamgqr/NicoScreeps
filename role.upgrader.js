var findEnergy = require('function.findEnergy');
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
        if(creep.room.name!='W42N33'){
            creep.moveTo(new RoomPosition(22,22,'W42N33'));
            return -2;
        }
        /*if(creep.room.controller.safeMode==undefined&&creep.room.controller.safeModeCooldown==undefined){
            if(creep.generateSafeMode(creep.room.controller)!=OK) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ff00aa'}});
                return;
            }
            else return;
        }*/
	    if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                var reuse=20;
                if(creep.pos.inRangeTo(creep.room.controller,4)) reuse=0;
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:reuse});
            }
        }
        else {
            if(findEnergy.findEnergy(creep)==0){
                var reuse=20;
                if(creep.pos.inRangeTo(creep.room.controller,4)) reuse=0;
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:reuse});
            }
        }
        return 0;
	}
};

module.exports = roleUpgrader;