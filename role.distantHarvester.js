const consts = require('consts');
const sourceList=consts.distantHarvester.sourceList;
const positList=consts.distantHarvester.positList;
const containerList=consts.distantHarvester.containerList;
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
var BTW = require('function.BTW');

var roleDistantHarvester = {
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy ==0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carryCapacity==_.sum(creep.carry)) {
	        creep.memory.working = true;
	        creep.say('🚚 transfer');
	    }
        BTW(creep);
        if(!creep.pos.isEqualTo(positList[creep.memory.spawn][creep.memory.behaviour])){
            creep.moveTo(positList[creep.memory.spawn][creep.memory.behaviour], {visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        
        var source;
        source=Game.getObjectById(sourceList[creep.memory.spawn][creep.memory.behaviour]);
        
        // var targets = creep.pos.findInRange(FIND_CREEPS,1,
        //     {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&!object.memory.working});
        //var container=Game.getObjectById(containerList[creep.memory.spawn][creep.memory.behaviour]);
            
        var awaiting=!!(source.ticksToRegeneration&&(source.ticksToRegeneration-1)*(source.energyCapacity/ENERGY_REGEN_TIME)>source.energy);
        if(!awaiting){
            creep.harvest(source);
        }
        // if(_.sum(creep.carry)!=creep.carryCapacity){
        var construction = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_CONSTRUCTION_SITES,1,
            {filter:site => site.owner.username=='iamgqr'}));
            if(construction!=null) {
                if(awaiting&&creep.carry.energy>=creep.getActiveBodyparts(WORK)*5){
                    creep.build(construction);
                    return;
                }
            }
            
            // var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
            //     {filter:object => object.structureType==STRUCTURE_CONTAINER&&_.sum(object.store)<object.storeCapacity});
            // var target=targets[0];
            
            // console.log(creep.name,container);
        var container=creep.pos.findClosestByRange(creep.pos.findInRange(FIND_STRUCTURES,1,{filter:object=>object.structureType==STRUCTURE_CONTAINER&&Memory.dismantleList.indexOf(object.id)==-1}));
            if(container&&container.hits<200000){
                if(awaiting&&creep.carry.energy>=creep.getActiveBodyparts(WORK)){
                    creep.repair(container);
                    return;
                }
                //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
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
	}
};

module.exports = roleDistantHarvester;