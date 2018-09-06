const consts = require('consts');
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
var BTW = require('function.BTW');
const profiler = require('screeps-profiler');
//for(room in Game.rooms){var a=Game.rooms[room].find(FIND_STRUCTURES,{filter:s=>s.structureType==STRUCTURE_CONTAINER&&s.hits<=240000});if(a.length!=0) console.log(room,"ERROR")}

var roleDistantHarvester = {
    moveWork:function(creep,posit,source,role='distantHarvester'){
        // if(creep.memory.spawn=='Spawn2'){
        //     // var minecarts = creep.pos.findInRange(FIND_CREEPS,1,
        //     //     {filter:object => object.my&&object.memory.role=='minecart'&&!object.memory.working});
        //     // var minecart=minecarts[0];
        //     // if(minecart&&creep.carry.energy) {
        //     //     creep.transfer(minecart,RESOURCE_ENERGY);
        //     //     //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
        //     // }
        //     construction = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,
        //     {filter:site => site.owner.username=='iamgqr'});
        //     if(construction!=null&&creep.carry.energy>=creep.getActiveBodyparts(WORK)*5) {
        //         var ret=creep.build(construction);
        //         if(creep.carry.energy==creep.carryCapacity||ret==OK){
        //             if(ret==ERR_NOT_IN_RANGE)
        //                 creep.moveTo(construction);
        //             return;
        //         }
        //     }
        // }
        var construction = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_CONSTRUCTION_SITES,10,
        {filter:site => site.owner.username=='iamgqr'}));
        if(construction!=null&&creep.carry.energy>=creep.getActiveBodyparts(WORK)*5) {
            var ret=creep.build(construction);
            if(creep.carry.energy==creep.carryCapacity||ret==OK){
                if(ret==ERR_NOT_IN_RANGE)
                    creep.moveTo(construction);
                return;
            }
        }
        if(!posit) return;
        if(!creep.pos.isEqualTo(posit)){
            var reuse=20,ignore=true;
            if(creep.pos.inRangeTo(posit,3)) reuse=0,ignore=false;
            creep.moveTo(posit, {visualizePathStyle: {stroke: '#ffaa00'},reusePath:reuse,ignoreCreeps:ignore});
            return;
        }
        
        
        // var targets = creep.pos.findInRange(FIND_CREEPS,1,
        //     {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&!object.memory.working});
        //var container=Game.getObjectById(containerList[creep.memory.spawn][creep.memory.behaviour]);
            
        var awaiting=((source.ticksToRegeneration||ENERGY_REGEN_TIME)-1)*(source.energyCapacity/ENERGY_REGEN_TIME)>source.energy;
        if(!awaiting){
            var ret=creep.harvest(source);
            if(ret!=OK){
                delete creep.memory.sourceId;
                return -1;
            }
        }
        else{
            // if(_.sum(creep.carry)!=creep.carryCapacity){
                
                // var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
                //     {filter:object => object.structureType==STRUCTURE_CONTAINER&&_.sum(object.store)<object.storeCapacity});
                // var target=targets[0];
                
                // console.log(creep.name,container);
            var container=creep.pos.findClosestByRange(creep.pos.findInRange(FIND_STRUCTURES,1,{filter:object=>object.structureType==STRUCTURE_CONTAINER&&Memory.dismantleList.indexOf(object.id)==-1}));
            if(container){
                if(container.hits<245000&&creep.carry.energy>=creep.getActiveBodyparts(WORK)){
                    creep.repair(container);
                    return;
                }
                //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
            }
            else if(construction==null){
                creep.room.createConstructionSite(creep.pos,STRUCTURE_CONTAINER);
            }
        }
        // }
        // if(container&&creep.carry.energy){
        //     creep.transfer(container,RESOURCE_ENERGY);
        //     return;
        // }
        
        // var minecarts = creep.pos.findInRange(FIND_CREEPS,1,
        //     {filter:object => object.my&&object.memory.role=='minecart'&&!object.memory.working});
        // var minecart=minecarts[0];
        // if(minecart&&creep.carry.energy) {
        //     creep.transfer(minecart,RESOURCE_ENERGY);
        //     //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
        // }
    },
    run: function(creep) {
        var posit;
        var flag_posit=Game.flags['distantHarvester_'+creep.memory.spawn.substring(5)+'-'+creep.memory.behaviour];
        if(flag_posit)
            posit=flag_posit.pos;
        var source;
        if(!creep.memory.sourceId){
            if(posit&&Game.rooms[posit.roomName]) source=posit.findInRange(FIND_SOURCES,1)[0];
            creep.memory.sourceId=source.id;
        }
        else source=Game.getObjectById(creep.memory.sourceId);
        if(creep.memory.working && creep.carry.energy ==0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carryCapacity==_.sum(creep.carry)) {
	        creep.memory.working = true;
	        creep.say('🚚 transfer');
	    }
        BTW(creep);
        return this.moveWork(creep,posit,source);
	}
};

profiler.registerClass(roleDistantHarvester, 'distantHarvester');
module.exports = roleDistantHarvester;