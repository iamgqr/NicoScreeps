const consts = require('consts');
const begins=consts.minecart.begins;
const ends=consts.minecart.ends;
const typeList=consts.minecart.typeList;

var autoRenew = require('function.autoRenew');
var BTW = require('function.BTW');
var avoidRoads = require('function.avoidRoads');
var getStructuresMatrix = require('function.getStructuresMatrix');

const profiler = require('screeps-profiler');
var plainCost=4;
var swampCost=20;

var roleMinecart = {
    getMatrix:function(visible=false){
        var minecartGetMatrix=function(roomName){
            var visual;
            if(visible) visual=new RoomVisual(roomName);
            
            var matrix=getStructuresMatrix(roomName);
            
            return matrix;
        }
        return profiler.registerFN(minecartGetMatrix,'minecartGetMatrix');
    },
    goto:function(creep,pos,args={}){
        if(creep.room.controller) if(creep.room.controller.my||creep.room.controller.reservation&&creep.room.controller.reservation.username=='iamgqr')args.ignoreCreeps=true;
        args.reusePath=20;
        args.plainCost=4;
        args.swampCost=20;
        args.ignoreDestructibleStructures=true;
        args.ignoreRoads=true;
        args.costCallback=this.getMatrix();
        if(pos.pos) pos=pos.pos;
        //console.log(creep.name,pos,args.ignoreRoads);
        creep.moveTo(pos,args);
    },
    toggleStatus:function(creep,working){
        if(creep.memory.working!=working){
            creep.memory.awaiting=false;
	        creep.memory.working=working;
            creep.say(working?'🔄 end':'🔄 begin');
        }
    },
    work_source:function(creep,type){
        if(!creep.memory.sourceId) return -1;
        var source=Game.getObjectById(creep.memory.sourceId);
        if(source){
            var ret=creep.withdraw(source,type);
            if(ret!=OK) return -1;
            if(source.store&&source.store.energy>=creep.carryCapacity-_.sum(creep.carry)||source.energy&&source.energy>=creep.carryCapacity-_.sum(creep.carry)){
                return 1;
            }
            return 0;
        }
        else return -1;
    },
    get_source:function(creep,type){
        var sources = creep.pos.findInRange(FIND_STRUCTURES,1,
            {filter:object => object.structureType==STRUCTURE_LINK});
        var source=sources[0];
        if(source){
            creep.memory.sourceId=source.id;
            return this.work_source(creep,type);
        }
        var sources = creep.pos.findInRange(FIND_STRUCTURES,1,
            {filter:object => (object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE)&&object.store.energy});
        var source=sources[0];
        if(source){
            creep.memory.sourceId=source.id;
            return this.work_source(creep,type);
        }
        //console.log(Game.time,creep.name,'can\'t get source');
        return -1;
    },
    work_target:function(creep,type){
        if(!creep.memory.targetId) return -1;
        var target=Game.getObjectById(creep.memory.targetId);
        if(target){
            var ret=creep.transfer(target,type);
            if(ret!=OK) return -1;
            if(target.store&&creep.carry.energy<=target.storeCapacity-_.sum(target.store)||target.carry&&creep.carry.energy<=target.carryCapacity-_.sum(target.carry)){
                return 1;
            }
            return 0;
        }
        else return -1;
    },
    get_target:function(creep,type){
        var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
            {filter:object => object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE});
        var target=targets[0];
        if(target) {
            creep.memory.targetId=target.id;
            return this.work_target(creep,type);
        }
        // var targets = creep.pos.findInRange(FIND_CREEPS,1,
        //     {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'&&object.id!=creep.id&&object.memory.awaiting});
        // var target=targets[0];
        // if(target) {
        //     creep.memory.targetId=target.id;
        //     return this.work_target(creep,type);
        // }
        //console.log(Game.time,creep.name,'can\'t get target');
        return -1;
    },
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
        
        if(_.sum(creep.carry)>=creep.carryCapacity-50)
            this.toggleStatus(creep,true);
        if(_.sum(creep.carry)==0)
            this.toggleStatus(creep,false);
	    if(type!=RESOURCE_ENERGY&& _.sum(creep.carry)&&creep.ticksToLive<30)
            this.toggleStatus(creep,true);
        
        BTW(creep,type);
        
    	if(creep.getActiveBodyparts(WORK)&&!creep.room.find(FIND_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_TOWER}).length){
	        var target = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_STRUCTURES,3, {
                filter: object => object.structureType==STRUCTURE_ROAD&&object.hits+100 <= object.hitsMax && (object.owner==undefined||object.my) && Memory.dismantleList.indexOf(object.id)==-1
            }));
            if(target)creep.repair(target);
            else{
    	        var target = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_STRUCTURES,3, {
                    filter: object =>object.structureType==STRUCTURE_CONTAINER&& object.hits+100 <= object.hitsMax && (object.owner==undefined||object.my) && Memory.dismantleList.indexOf(object.id)==-1
                }));
                if(target)creep.repair(target);
                else{
                    var target = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3,
                        {filter:site => site.owner.username=='iamgqr'}));
                    if(target!=null) {
                        creep.build(target);
                    }
                }
            }
        }
        
	    if(creep.memory.working){
	        if(!end) return;
	        if(creep.pos.inRangeTo(end,1)){
	            var ret=this.work_target(creep,type);
	            if(ret==-1) ret=this.get_target(creep,type);
	            if(ret==1){
                    this.toggleStatus(creep,false);
                    this.goto(creep,begin,{ignoreRoads:false});
                    return;
	            }
	            else{
	                avoidRoads(creep);
	            }
	        }
	        if(!creep.pos.isEqualTo(end)) this.goto(creep,end);
	    }
	    else{
	        if(!begin) return;
	        if(begin.roomName==Game.spawns[creep.memory.spawn].room.name)
	            if(autoRenew(creep)) return;
            if(creep.pos.inRangeTo(begin,1)){
	            creep.memory.awaiting=true;
	            var ret=this.work_source(creep,type);
	            if(ret==-1) ret=this.get_source(creep,type);
	            if(ret==1){
                    this.toggleStatus(creep,true);
                    this.goto(creep,end);
                    return;
	            }
	            else{
	                avoidRoads(creep);
	            }
                // if(type!='energy'){
                //     creep.drop('energy');
                //     if(source.store.energy) creep.withdraw(source,'energy');
                // }
	        }
            if(!creep.pos.isEqualTo(begin)) this.goto(creep,begin,{ignoreRoads:false});
	    }
    }
};
profiler.registerClass(roleMinecart, 'roleMinecart');
module.exports=roleMinecart;
