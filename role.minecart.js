const consts = require('consts');
const begins=consts.minecart.begins;
const ends=consts.minecart.ends;
const typeList=consts.minecart.typeList;

var autoRenew = require('function.autoRenew');

module.exports = {
    run:function(creep){
        const type=typeList[creep.memory.spawn][creep.memory.behaviour];
        var begin,end;
        if(begins[creep.memory.spawn]) begin=begins[creep.memory.spawn][creep.memory.behaviour];
        if(ends[creep.memory.spawn]) end=ends[creep.memory.spawn][creep.memory.behaviour];
        var flag_begin=Game.flags['minecart_'+creep.memory.spawn.substring(5)+'-'+creep.memory.behaviour+'_'+'begin'];
        if(flag_begin)
            begin=flag_begin.pos;
        var flag_end=Game.flags['minecart_'+creep.memory.spawn.substring(5)+'-'+creep.memory.behaviour+'_'+'end'];
        if(flag_end)
            end=flag_end.pos;
        
        if(!creep.memory.working&&_.sum(creep.carry)==creep.carryCapacity){
	        //console.log(creep.name);
            creep.memory.awaiting=false;
	        creep.memory.working = true;
            creep.say('🔄 end');
        }
        if(creep.memory.working==true&&_.sum(creep.carry)==0){
            creep.memory.awaiting=false;
	        creep.memory.working = false;
            creep.say('🔄 begin');
        }
	    if(type!=RESOURCE_ENERGY&& _.sum(creep.carry)&&creep.ticksToLive<30) {
	        creep.memory.awaiting=false;
	        creep.memory.working = true;
            creep.say('🔄 end');
	    }
        var tombstone = creep.pos.findInRange(FIND_TOMBSTONES,1,{filter:object=>object.store.energy});
        if(tombstone[0]!=null&&_.sum(creep.carry)<creep.carryCapacity){
            creep.withdraw(tombstone[0],RESOURCE_ENERGY);
        }
        var resource = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter:object=>object.resourceType==RESOURCE_ENERGY});
        if(resource[0]!=null&&_.sum(creep.carry)<creep.carryCapacity){
            creep.pickup(resource[0]);
        }
    	if(creep.getActiveBodyparts(WORK)&&!creep.room.find(FIND_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_TOWER}).length){
	        var target = creep.pos.findInRange(FIND_STRUCTURES,1, {
                filter: object => object.hits+100 <= object.hitsMax && (object.owner==undefined||object.my) && Memory.dismantleList.indexOf(object.id)==-1
            })[0];
            if(target)creep.repair(target);
        }
	    if(creep.memory.working){
	        //console.log(creep.name);
	        if(!end) return;

	        if(creep.pos.inRangeTo(end,1)){
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
                if(!creep.pos.isEqualTo(end)) creep.moveTo(end,{ignoreCreeps:ignore,reusePath:5,plainCost:3,swampCost:20});
	        }
            else{
                //console.log(creep.name,"goto end");
                // if(creep.carry.energy != creep.carryCapacity){
                //     creep.working=false;
                //     return;
                // }
                var reuse=10,ignore=true;
                if(creep.room.name=='W42N33'||creep.pos.inRangeTo(end,5)) reuse=0,ignore=false;
                creep.moveTo(end,{ignoreCreeps:ignore,reusePath:reuse,plainCost:3,swampCost:20});
            }
	    }
	    else{
	        if(!begin) return;
	        if(begin.roomName=='W42N33') if(autoRenew(creep)) return;
            var reuse=10;
            if(creep.room.name=='W42N33') reuse=2;
            if(!creep.pos.inRangeTo(begin,1))
	            creep.moveTo(begin,{ignoreCreeps:false,ignoreRoads:true,reusePath:reuse});
	        else{
	            creep.memory.awaiting=true;
                var sources = creep.pos.findInRange(FIND_STRUCTURES,1,
                    {filter:object => object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_LINK});
                var source=sources[Math.floor(Math.random()*sources.length)];
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
                    if(source.store&&source.store.energy>=creep.carryCapacity-_.sum(creep.carry)||source.energy&&source.energy>=creep.carryCapacity-_.sum(creep.carry)){
            	        creep.memory.awaiting=false;
            	        creep.memory.working = true;
                        creep.say('🔄 end');
                        var reuse=10,ignore=true;
                        if(creep.room.name=='W42N33') reuse=5,ignore=false;
                        creep.moveTo(end,{ignoreCreeps:ignore,reusePath:reuse,plainCost:3,swampCost:20});
                        return;
                    }
                }
                if(!creep.pos.isEqualTo(begin)) creep.moveTo(begin,{ignoreCreeps:false,ignoreRoads:true,reusePath:reuse});
	        }
	    }
    }
};