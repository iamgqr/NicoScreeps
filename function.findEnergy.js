const profiler = require('screeps-profiler');

var findEnergy = function(creep){
    var source = null;// creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    var container= creep.pos.findClosestByRange(FIND_STRUCTURES,
        {filter:object => (//object.structureType==STRUCTURE_CONTAINER||
        object.structureType==STRUCTURE_TERMINAL||
            object.structureType==STRUCTURE_STORAGE)&&object.store.energy/*&&object.store.energy*2>=creep.carryCapacity-_.sum(creep.carry)*/});
    if(creep.room.find(FIND_STRUCTURES,{filter:structure=>structure.structureType==STRUCTURE_STORAGE}).length==0||creep.room.name=='W45N33'){
        container= creep.pos.findClosestByRange(FIND_STRUCTURES,
        {filter:object => (object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE)&&object.store.energy*2>=creep.carryCapacity-_.sum(creep.carry)});
    }
    if(creep.memory.role=='supporter'&&creep.memory.spawn=='Spawn2'){
        container= creep.pos.findClosestByRange(FIND_STRUCTURES,
        {filter:object => (object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE)&&object.store.energy});
        //console.log(creep.name,source);
    }
    if(creep.memory.role=='upgrader'&&creep.memory.spawn=='Spawn2')
        source= creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    
    var link = creep.pos.findInRange(FIND_STRUCTURES,3,
        {filter:object => object.structureType==STRUCTURE_LINK&&object.energy})[0];
    var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
        {filter:object => object.resourceType==RESOURCE_ENERGY&&object.amount>20});
    var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES,
        {filter:object => object.store.energy});
    var targets=_.compact([source,container,link,resource,tombstone]);
    targets.sort(
        function(a,b){
            return a.pos.getRangeTo(creep.pos)>b.pos.getRangeTo(creep.pos)?1:-1;
        }
        );
    var target=targets[0];
    if(target==null){
        if(Math.random()<0.3)creep.move(Math.floor(Math.random()*8)+1);
        return -1;
    }
    if(target.deathTime!=null||target.structureType==STRUCTURE_CONTAINER||target.structureType==STRUCTURE_STORAGE||target.structureType==STRUCTURE_TERMINAL||target.structureType==STRUCTURE_LINK){
        //console.log(creep.name+' : Go to container/tombstone : ' + target.id);
        if(creep.withdraw(target,RESOURCE_ENERGY)!=ERR_NOT_IN_RANGE){
            if(target.store&&target.store.energy>=creep.carryCapacity-_.sum(creep.carry)) return 0;
            if(target.energy&&target.energy>=creep.carryCapacity-_.sum(creep.carry)) return 0;
            
            return 2;
        }
    }
    else if(target.resourceType!=null){
        //console.log(creep.name+' : Go to resource : ' + target.id);
        if(creep.pickup(target)!=ERR_NOT_IN_RANGE){
            return 2;
        }
    }
    else{
        //console.log(creep.name+' : Go to source : ' + target.id);
        if(creep.harvest(target)!=ERR_NOT_IN_RANGE){
            return 2;
        }
    }
    
    var reuse=7;
    if(creep.pos.inRangeTo(target,3)) reuse=0;
    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'},reusePath:reuse});
    return 1;
};

module.exports = profiler.registerFN(findEnergy, 'findEnergy');