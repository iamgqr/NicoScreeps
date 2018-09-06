var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
const profiler = require('screeps-profiler');

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
            //console.log(creep.name,creep.carry.energy,creep.getActiveBodyparts(WORK));
            if(creep.carry.energy<=creep.getActiveBodyparts(WORK)){
                if(findEnergy(creep)==0) return;
            }
            var reuse=20;
            if(creep.pos.inRangeTo(target,4)) reuse=0;
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:reuse,range:3});
        }
        else {
	       // if(creep.memory.behaviour==1&&creep.room.name=='W42N32'){
	       //     creep.moveTo(new RoomPosition(22,22,'W42N33'));
	       //     return;
	       // }
            //if(autoRenew(creep)) return;
            if(findEnergy(creep)==0){
                var reuse=20;
                if(creep.pos.inRangeTo(target,4)) reuse=0;
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:reuse});
            }
        }
        return 0;
	}
};

profiler.registerClass(roleUpgrader, 'upgrader');
module.exports = roleUpgrader;