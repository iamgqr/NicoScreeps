const sourceList=[
    '59f1a05082100e1594f36842',
    '59f1a05082100e1594f36844',
];
const positList=[
    new RoomPosition( 5,13,'W42N33'),
    new RoomPosition(36,43,'W42N33'),
];
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
        if(creep.room.name!='W42N33'){
            creep.moveTo(new RoomPosition(22,22,'W42N33'));
            return -2;
        }
        
        var source=Game.getObjectById(sourceList[creep.memory.behaviour]);
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
        if(!creep.pos.isEqualTo(positList[creep.memory.behaviour])){
            creep.moveTo(positList[creep.memory.behaviour], {visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                var reuse=20;
                if(creep.pos.inRangeTo(target,3)) reuse=0;
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:reuse});
                return;
            }
            else{
                var reuse=20;
                if(creep.pos.inRangeTo(source,3)) reuse=0;
                if(!creep.pos.inRangeTo(source,1))
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'},reusePath:reuse});
            }
        }
        
        var tombstone = creep.pos.findInRange(FIND_TOMBSTONES,1,{filter:object=>object.store.energy});
        if(tombstone[0]!=null){
            creep.withdraw(tombstone[0],RESOURCE_ENERGY);
        }
        var resource = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter:object=>object.resourceType==RESOURCE_ENERGY});
        if(resource[0]!=null){
            creep.pickup(resource[0]);
        }
        //var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        var ret;
        if(source==null) return -1;
        
        var ret=creep.harvest(source);
        if(ret == ERR_NOT_ENOUGH_RESOURCES){
            if(creep.carry.energy>0)
                creep.memory.working=true;
        }
        return 0;
	}
};

module.exports = roleHarvester;