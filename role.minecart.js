const begins=[
    new RoomPosition(18,13,'W41N32'),
    new RoomPosition(43,12,'W42N32'),
    new RoomPosition(15,41,'W42N32'),
    new RoomPosition(14,45,'W42N32'),
    new RoomPosition( 5,21,'W42N32'),
    new RoomPosition(24,45,'W42N33'),
    new RoomPosition(25,45,'W42N33'),
    new RoomPosition( 7,14,'W42N33'),
];
const ends=[
    new RoomPosition(44,12,'W42N32'),
    new RoomPosition(25,47,'W42N33'),
    new RoomPosition( 6,22,'W42N32'),
    new RoomPosition( 6,23,'W42N32'),
    new RoomPosition(24,47,'W42N33'),
    new RoomPosition(20,28,'W42N33'),
    new RoomPosition(20,27,'W42N33'),
    new RoomPosition(18,26,'W42N33'),
];


module.exports = {
    run:function(creep){
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 begin');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.awaiting=false;
	        creep.memory.working = true;
            creep.say('🔄 end');
	    }
	    if(creep.memory.working){
	        if(creep.pos.isEqualTo(ends[creep.memory.behaviour])){
                var targets = creep.pos.findInRange(FIND_CREEPS,1,
                    {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&object.id!=creep.id&&object.memory.awaiting});
                //targets.sort((a,b)=>a.memory.behaviour-b.memory.behaviour);
                var target=targets[0];
                if(target!=null) {
                    //console.log(creep.name+" meet "+target.name);
                    if(creep.transfer(target,RESOURCE_ENERGY)==OK){
                        creep.moveTo(begins[creep.memory.behaviour],{ignoreCreeps:false,ignoreRoads:true,reusePath:10});
                        return;
                    }
                    //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
                }
                var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
                    {filter:object => object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE||object.structureType==STRUCTURE_TOWER});
                var target=targets[0];
                if(target!=null) {
                    //console.log(creep.name+" transfer "+target.id);
                    if(creep.transfer(target,RESOURCE_ENERGY)==OK&&creep.carry.energy<=target.storeCapacity-_.sum(target.store)){
                        creep.moveTo(begins[creep.memory.behaviour],{ignoreCreeps:false,ignoreRoads:true,reusePath:10});
                        creep.memory.working = false;
                        creep.say('🔄 begin');
                        return;
                    }
                    //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
                }
	        }
            else{
                // if(creep.carry.energy != creep.carryCapacity){
                //     creep.working=false;
                //     return;
                // }
                var reuse=10,ignore=true;
                if(creep.room.name=='W42N33'||creep.pos.inRangeTo(ends[creep.memory.behaviour],5)) reuse=0,ignore=false;
                creep.moveTo(ends[creep.memory.behaviour],{ignoreCreeps:ignore,reusePath:reuse,plainCost:100,swampCost:200});
            }
	    }
	    else{
            var reuse=10;
            if(creep.room.name=='W42N33') reuse=2;
            if(!creep.pos.isEqualTo(begins[creep.memory.behaviour]))
	            creep.moveTo(begins[creep.memory.behaviour],{ignoreCreeps:false,ignoreRoads:true,reusePath:reuse});
	        else{
	            creep.memory.awaiting=true;
                var sources = creep.pos.findInRange(FIND_STRUCTURES,1,
                    {filter:object => object.structureType==STRUCTURE_CONTAINER});
                var source=sources[0];
                if(source){
                    creep.withdraw(source,RESOURCE_ENERGY);
                    if(source.store.energy>=creep.carryCapacity-_.sum(creep.carry)){
                        var reuse=10,ignore=true;
                        if(creep.room.name=='W42N33') reuse=2,ignore=false;
                        creep.moveTo(ends[creep.memory.behaviour],{ignoreCreeps:ignore,reusePath:reuse,plainCost:100,swampCost:200});
                    }
                }
	        }
	    }
    }
};