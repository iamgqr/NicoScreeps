
var autoRenew = require('function.autoRenew');

var roleDismantler={

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 dismantle');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('⚡ transport');
	    }
        // if(creep.room.name!='W42N33'){
        //     creep.moveTo(new RoomPosition(22,22,'W42N33'));
        //     return -2;
        // }
        var targets = _.map(Memory.dismantleList[0],Game.getObjectById);
        var target=_.filter(targets,object=>object.room.name==creep.room.name)[0];
        if(!target) return -1;
	    if(creep.memory.working) {
            //return -1;
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            _.sum(structure.store) < structure.storeCapacity;
                    }
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    var reuse=20;
                    if(creep.pos.inRangeTo(target,3)) reuse=0;
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:reuse});
                }
            }
            else return -1;
        }
        else {
            if(autoRenew(creep)) return;
            if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                var reuse=20;
                if(creep.pos.inRangeTo(target,3)) reuse=0;
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:reuse});
            }
        }
        return 0;
	}
}
module.exports=roleDismantler;