const consts = require('consts');
const sourceList=consts.miner.sourceList;
const positList=consts.miner.positList;
const containerList=consts.miner.containerList;
const typeList=consts.miner.typeList;

var BTW = require('function.BTW');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const posit=positList[creep.memory.spawn][creep.memory.behaviour];
        const type=typeList[creep.memory.spawn][creep.memory.behaviour];
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
        
        creep.harvest(source);
        if(!creep.pos.isEqualTo(posit)){
            creep.moveTo(posit, {visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        
        BTW(creep,type);
        
        // var targets = creep.pos.findInRange(FIND_CREEPS,1,
        //     {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&!object.memory.working});
        
        var targets = creep.pos.findInRange(FIND_CREEPS,1,
            {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&!object.memory.working});
        var target=targets[0];
        if(target&&creep.carry.energy) {
            creep.transfer(target,type);
            //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
        }
        
        // var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
        //     {filter:object => object.structureType==STRUCTURE_CONTAINER&&_.sum(object.store)<object.storeCapacity});
        // var target=targets[0];
        var target=Game.getObjectById(containerList[creep.memory.spawn][creep.memory.behaviour]);
        // console.log(creep.name,target);
        if(target&&creep.carry[type]) {
            creep.transfer(target,type);
            //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
            return;
        }
        
        
        return 0;
	}
};

module.exports = roleMiner;