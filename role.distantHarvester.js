const consts = require('consts');
const sourceList=consts.distantHarvester.sourceList;
const positList=consts.distantHarvester.positList;
const containerList=consts.distantHarvester.containerList;
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');

var roleDistantHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy ==0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carryCapacity==_.sum(creep.carry)) {
	        creep.memory.working = true;
	        creep.say('🚚 transfer');
	    }
        var source;
        source=Game.getObjectById(sourceList[creep.memory.spawn][creep.memory.behaviour]);
        /*
        if(Game.spawns['Spawn1'].room!=creep.room){
            var target = Game.spawns['Spawn1'];
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else return -1;
        }
        else{
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else return -1;
        }
        */
        if(creep.memory.behaviour>=3){
            //if(autoRenew(creep)) return;
            console.log(creep.name);
            if(creep.memory.working){
                var target=creep.pos.findInRange(FIND_STRUCTURES,1,{filter:object=>object.structureType==STRUCTURE_CONTAINER})[0];//Game.getObjectById(containerList[creep.memory.spawn][creep.memory.behaviour]);
                // console.log(creep.name,target);
                if(target&&creep.carry.energy) {
                    if(target.hits<5000){
                        if(creep.carry.energy>25){
                            creep.repair(target);
                        }
                        return;
                    }
                    creep.transfer(target,RESOURCE_ENERGY);
                    //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
                    return;
                }
                var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,
                    {filter:site => site.owner.username=='iamgqr'});
                if(target!=null) {
                    if(creep.build(target)==ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                }
                return;
            }
            else{
                if(creep.room.name=='W45N33'){
                    if(findEnergy(creep)!=-1) return;
                }
            }
        }
        creep.harvest(source);
        if(!creep.pos.isEqualTo(positList[creep.memory.spawn][creep.memory.behaviour])){
            creep.moveTo(positList[creep.memory.spawn][creep.memory.behaviour], {visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        
        var tombstone = creep.pos.findInRange(FIND_TOMBSTONES,1,{filter:object=>object.store.energy});
        if(tombstone[0]!=null&&_.sum(creep.carry)<creep.carryCapacity){
            creep.withdraw(tombstone[0],RESOURCE_ENERGY);
            return;
        }
        var resource = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter:object=>object.resourceType==RESOURCE_ENERGY});
        if(resource[0]!=null&&_.sum(creep.carry)<creep.carryCapacity){
            creep.pickup(resource[0]);
            return;
        }
        // var targets = creep.pos.findInRange(FIND_CREEPS,1,
        //     {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&!object.memory.working});
        
        var target = creep.pos.findInRange(FIND_CONSTRUCTION_SITES,1,
            {filter:site => site.owner.username=='iamgqr'})[0];
        if(target!=null&&creep.carry.energy>=30) {
            if(creep.build(target)==ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
        
        var targets = creep.pos.findInRange(FIND_CREEPS,1,
            {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&!object.memory.working});
        var target=targets[0];
        if(target&&creep.carry.energy) {
            creep.transfer(target,RESOURCE_ENERGY);
            //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
        }
        
        // var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
        //     {filter:object => object.structureType==STRUCTURE_CONTAINER&&_.sum(object.store)<object.storeCapacity});
        // var target=targets[0];
        var target=creep.pos.findInRange(FIND_STRUCTURES,1,{filter:object=>object.structureType==STRUCTURE_CONTAINER})[0];//Game.getObjectById(containerList[creep.memory.spawn][creep.memory.behaviour]);
        // console.log(creep.name,target);
        if(target&&creep.carry.energy) {
            if(target.hits<5000){
                if(creep.carry.energy>25){
                    creep.repair(target);
                }
                return;
            }
            creep.transfer(target,RESOURCE_ENERGY);
            //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
            return;
        }
        
        return 0;
	}
};

module.exports = roleDistantHarvester;