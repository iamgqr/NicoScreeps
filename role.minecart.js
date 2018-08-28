const consts = require('consts');
const begins=consts.minecart.begins;
const ends=consts.minecart.ends;
const typeList=consts.minecart.typeList;

var autoRenew = require('function.autoRenew');

module.exports = {
    run:function(creep){
        const type=typeList[creep.memory.spawn][creep.memory.behaviour];
        const begin=begins[creep.memory.spawn][creep.memory.behaviour];
        const end=ends[creep.memory.spawn][creep.memory.behaviour];
        if(creep.memory.working && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.say('🔄 begin');
	    }
	    if(!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
	        creep.memory.awaiting=false;
	        creep.memory.working = true;
            creep.say('🔄 end');
	    }
	    if(type!=RESOURCE_ENERGY&& _.sum(creep.carry)&&creep.ticksToLive<30) {
	        creep.memory.awaiting=false;
	        creep.memory.working = true;
            creep.say('🔄 end');
	    }
	    if(creep.memory.working){
	        if(creep.pos.isEqualTo(end)){
                var targets = creep.pos.findInRange(FIND_CREEPS,1,
                    {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&object.id!=creep.id&&object.memory.awaiting});
                //targets.sort((a,b)=>a.memory.behaviour-b.memory.behaviour);
                var target=targets[0];
                if(target!=null) {
                    //console.log(creep.name+" meet "+target.name);
                    if(creep.transfer(target,type)==OK){
                        creep.moveTo(begin,{ignoreCreeps:false,ignoreRoads:true,reusePath:10});
                        return;
                    }
                    //creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'}});
                }
                var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
                    {filter:object => object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE});
                var target=targets[0];
                if(target!=null) {
                    //console.log(creep.name+" transfer "+target.id);
                    if(creep.transfer(target,type)==OK&&creep.carry.energy<=target.storeCapacity-_.sum(target.store)){
                        creep.moveTo(begin,{ignoreCreeps:false,ignoreRoads:true,reusePath:10});
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
                if(creep.room.name=='W42N33'||creep.pos.inRangeTo(end,5)) reuse=5,ignore=false;
                creep.moveTo(end,{ignoreCreeps:ignore,reusePath:reuse,plainCost:3,swampCost:20});
            }
	    }
	    else{
	        if(begin.roomName=='W42N33') if(autoRenew(creep)) return;
            var reuse=10;
            if(creep.room.name=='W42N33') reuse=2;
            if(!creep.pos.isEqualTo(begin))
	            creep.moveTo(begin,{ignoreCreeps:false,ignoreRoads:true,reusePath:reuse});
	        else{
	            creep.memory.awaiting=true;
                var sources = creep.pos.findInRange(FIND_STRUCTURES,1,
                    {filter:object => object.structureType==STRUCTURE_CONTAINER});
                var source=sources[0];
                if(source){
                    if(type!='energy'){
                        creep.drop('energy');
                        if(source.store.energy) creep.withdraw(source,'energy');
                    }
                    // var resource = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter:object=>object.resourceType==RESOURCE_ENERGY});
                    // if(resource[0]!=null){
                    //     creep.pickup(resource[0]);
                    // }
                    creep.withdraw(source,type);
                    if(source.store.energy>=creep.carryCapacity-_.sum(creep.carry)){
                        var reuse=10,ignore=true;
                        if(creep.room.name=='W42N33') reuse=5,ignore=false;
                        creep.moveTo(end,{ignoreCreeps:ignore,reusePath:reuse,plainCost:3,swampCost:20});
                    }
                }
	        }
	    }
    }
};