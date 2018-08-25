const sourceList=[
    '59f1a06382100e1594f369d0',
    '59f1a05082100e1594f36848',
    '59f1a05082100e1594f36847',
];
const positList=[
    new RoomPosition(20,13,'W41N32'),
    new RoomPosition(13,47,'W42N32'),
    new RoomPosition(17,39,'W42N32'),
];
const containerList=[
    '5b7fa5cc8a1e7f6a3aa15929',
    '5b7f90ce9b3af8175e52293c',
    '5b7ecdfa1ad7d540025acc17',
];
var roleDistantHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
    //     if(creep.memory.working && creep.carry.energy <250) {
    //         creep.memory.working = false;
    //         creep.say('🔄 harvest');
	   // }
	   // if(!creep.memory.working && creep.carry.energy >= 250) {
	   //     creep.memory.working = true;
	   //     creep.say('🚚 transfer');
	   // }
        var source;
        source=Game.getObjectById(sourceList[creep.memory.behaviour]);
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
        if(!creep.pos.isEqualTo(positList[creep.memory.behaviour])){
            creep.moveTo(positList[creep.memory.behaviour], {visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        creep.harvest(source);
        
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
        var target=Game.getObjectById(containerList[creep.memory.behaviour]);
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
        
        // if(creep.memory.behaviour==0){
        //     var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,
        //         {filter:site => site.owner.username=='iamgqr'});
        //     if(target!=null) {
        //         if(creep.carry.energy>30)creep.build(target);
        //     }
        // }
        
        return 0;
	}
};

module.exports = roleDistantHarvester;