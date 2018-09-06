const consts = require('consts');
var BTW = require('function.BTW');
const profiler = require('screeps-profiler');

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
        var posit;
        var flag_posit=Game.flags['harvester_'+creep.memory.spawn.substring(5)+'-'+creep.memory.behaviour];
        if(flag_posit)
            posit=flag_posit.pos;
        var source;
        if(!creep.memory.sourceId){
            if(posit&&Game.rooms[posit.roomName]) source=posit.findInRange(FIND_SOURCES,1)[0];
            creep.memory.sourceId=source.id;
        }
        else source=Game.getObjectById(creep.memory.sourceId);
        
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
        if(!creep.pos.isEqualTo(posit)){
            creep.moveTo(posit, {ignoreCreeps:true,reusePath:20,plainCost:4,swampCost:20,visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        var ret=creep.harvest(source);
        if(ret!=OK){
            delete creep.memory.sourceId;
            return -1;
        }
        
        var target;
        if(!creep.memory.targetId){
            target = creep.pos.findInRange(FIND_STRUCTURES,1, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_LINK) &&
                            structure.energy < structure.energyCapacity;
                    }
            })[0];
            if(!target) target = creep.pos.findInRange(FIND_STRUCTURES,1, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            _.sum(structure.store) < structure.storeCapacity;
                    }
            })[0];
            if(!target) return;
            creep.memory.targetId=target.id;
        }
        else target=Game.getObjectById(creep.memory.targetId);
        
        if(target) {
            var amount=Math.floor(creep.carry.energy/(creep.getActiveBodyparts(WORK)*6))*creep.getActiveBodyparts(WORK)*6;
            if(amount) {
                var ret=creep.transfer(target, RESOURCE_ENERGY, amount);
                if(ret==OK) return 0;
            }
            else return 0;
        }
        delete creep.memory.targetId;
        
        //var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        return -1;
	}
};
profiler.registerClass(roleHarvester, 'harvester');
module.exports = roleHarvester;