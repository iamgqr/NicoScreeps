const consts = require('consts');
const sourceList=consts.harvester.sourceList;
const positList=consts.harvester.positList;
var BTW = require('function.BTW');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.memory.behavoiur=Math.round(Math.random()*7);
    //     if(creep.memory.working && creep.carry.energy == 0) {
    //         creep.memory.working = false;
    //         creep.say('🔄 harvest');
	   // }
	   // if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	   //     creep.memory.working = true;
	   //     creep.say('🚚 transport');
	   // }
        // if(creep.room.name!='W42N33'){
        //     creep.moveTo(new RoomPosition(22,22,'W42N33'));
        //     return -2;
        // }
        
        BTW(creep);
        var source=Game.getObjectById(sourceList[creep.memory.spawn][creep.memory.behaviour]);
        var target = creep.pos.findInRange(FIND_STRUCTURES,1, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        _.sum(structure.store) < structure.storeCapacity;
                }
        })[0];
        var link = creep.pos.findInRange(FIND_STRUCTURES,1, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK) &&
                        structure.energy < structure.energyCapacity;
                }
        })[0];
        if(link!=null&&Math.random()<1) target=link;
        //if(creep.memory.working) {
            /*
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
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else return -1;*/
        //}
        if(!creep.pos.isEqualTo(positList[creep.memory.spawn][creep.memory.behaviour])){
            creep.moveTo(positList[creep.memory.spawn][creep.memory.behaviour], {ignoreCreeps:true,reusePath:20,plainCost:4,swampCost:20,visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        if(source==null) return -1;
        creep.harvest(source);
        if(target) {
            var amount=Math.floor(creep.carry.energy/(creep.getActiveBodyparts(WORK)*6))*creep.getActiveBodyparts(WORK)*6;
            if(amount!=0) {
                creep.transfer(target, RESOURCE_ENERGY, amount);
            }
        }
        
        //var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        return 0;
	}
};

module.exports = roleHarvester;