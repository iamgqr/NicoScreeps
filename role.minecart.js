const consts = require('consts');
const typeList=consts.minecart.typeList;
const boostList=consts.minecart.boostList;

var autoRenew = require('function.autoRenew');
var BTW = require('function.BTW');
var avoidRoads = require('function.avoidRoads');
var getStructuresMatrix = require('function.getStructuresMatrix');

const profiler = require('screeps-profiler');
var plainCost=4;
var swampCost=20;
//var from=new RoomPosition(23,49,'W45N34');var to=new RoomPosition(11,39,'W45N34');var path=from.findPathTo(to,{range:1,ignoreRoads:true,ignoreCreeps:true});for(i in path){var room=Game.rooms[from.roomName];room.createConstructionSite(path[i].x,path[i].y,STRUCTURE_ROAD)}
var minecartPaths={};
//minecartPaths[from][to]=[PathFinder path]

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
    minecartGetPath:function(from,to){
        if(Object.keys(minecartPaths).length==0){
            console.log("Global reset at",Game.time);
            Game.notify("Global reset at "+Game.time,0);
        }
        if(!minecartPaths[from.toString()]) minecartPaths[from.toString()]={};
        if(!minecartPaths[from.toString()][to.toString()]||Game.time%2000==0){
            //calculate path
            var getMatrix=this.getMatrix();
            var path=PathFinder.search(from,to,{
                plainCost:4,swampCost:20,ignoreDestructibleStructures:true,ignoreRoads:true,roomCallback:getMatrix
            }).path;
            //console.log('Calculated path from',from,'to',to);
            return minecartPaths[from.toString()][to.toString()]=path;
        }
        else return minecartPaths[from.toString()][to.toString()];
    },
    goto:function(creep,from,to){
        // if(creep.room.controller) if(creep.room.controller.my||creep.room.controller.reservation&&creep.room.controller.reservation.username=='iamgqr')
        //     /*args.ignoreCreeps=true,*/args.reusePath=20;
        // args.plainCost=4;
        // args.swampCost=20;
        // args.visualizePathStyle= {stroke: '#000000',opacity:0.3};
        // args.ignoreDestructibleStructures=true;
        // args.ignoreRoads=true;
        // args.costCallback=this.getMatrix();
        // if(pos.pos) pos=pos.pos;
        // //console.log(creep.name,pos,args.ignoreRoads);
        // creep.moveTo(pos,args);
        var path=this.minecartGetPath(from,to);
        var ret=creep.moveByPath(path,{visualizePathStyle:{stroke: '#000000',opacity:.3}});
        if(ret!=OK&&ret!=ERR_TIRED){
            var getMatrix=this.getMatrix();
            creep.moveTo(to,{
                plainCost:4,swampCost:20,ignoreDestructibleStructures:true,ignoreRoads:true,costCallback:getMatrix,reusePath:20,
                visualizePathStyle:{
                    stroke:'#000000',opacity:.3
                }
            });
        }
        else if(false){
            path=_.dropWhile(path,o=>!o.isEqualTo(creep.pos));
            creep.room.visual.poly(_.filter(_.drop(path),o=>o.roomName==creep.room.name),{
                fill:'transparent',stroke:'#000000',lineStyle:'dashed',strokeWidth:.05,opacity:.3
            });
        }
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
        if(source&&source.store[type]>=50){
            // if(type!='energy'){
            //     if(creep.carry.energy) creep.drop('energy');
            //     if(source.store.energy){
            //         creep.withdraw(source,'energy');
            //         return -1;
            //     }
            // }
            for(i in creep.carry) if(creep.carry[i]&&i!=type) creep.drop(i);
            for(i in source.store) if(source.store[i]&&i!=type){
                creep.withdraw(source,i);
                return -1;
            }
            var ret=creep.withdraw(source,type);
            if(ret!=OK) return -1;
            if(source.store&&source.store[type]>=creep.carryCapacity-_.sum(creep.carry)||source[type]&&source[type]>=creep.carryCapacity-_.sum(creep.carry)){
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
            {filter:object => (object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE)&&object.store[type]});
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
            //console.log(creep.name,ret);
            if(ret!=OK) return -1;
            if(ret==ERR_NOT_IN_RANGE) return 0;
            if(target.store&&creep.carry[type]<=target.storeCapacity-_.sum(target.store)||target.carry&&creep.carry[type]<=target.carryCapacity-_.sum(target.carry)){
                return 1;
            }
            return 0;
        }
        else return -1;
    },
    get_target:function(creep,type){
        var targets = creep.pos.findInRange(FIND_STRUCTURES,1,
            {filter:object => object.structureType==STRUCTURE_TERMINAL});
        var target=targets[0];
        if(target&&Math.random()<.5) {
            creep.memory.targetId=target.id;
            return this.work_target(creep,type);
        }
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
        const type=typeList[creep.memory.spawn][creep.memory.behaviour]||RESOURCE_ENERGY;
        var begin,end;
        var flag_begin=Game.flags['minecart_'+creep.memory.spawn.substring(5)+'-'+creep.memory.behaviour+'_'+'begin'];
        if(flag_begin)
            begin=flag_begin.pos;
        var flag_end=Game.flags['minecart_'+creep.memory.spawn.substring(5)+'-'+creep.memory.behaviour+'_'+'end'];
        if(flag_end)
            end=flag_end.pos;
        
        if(creep.room.name==Game.spawns[creep.memory.spawn].room.name&&boostList[creep.memory.spawn]&&boostList[creep.memory.spawn][creep.memory.behaviour]&&creep.getActiveBodyparts(MOVE)<10){
            // console.log(creep.name);
            if(creep.ticksToLive<50){
                if(creep.pos.inRangeTo(19,28,1)){
                    creep.suicide();
                    return;
                }
                else{
                    creep.moveTo(19,28);
                }
            }
            for(id in boostList[creep.memory.spawn][creep.memory.behaviour]){
                var mineral=boostList[creep.memory.spawn][creep.memory.behaviour][id];
                var boosted=_.filter(creep.body,p=>p.boost==mineral);
                // console.log(boosted);
                if(boosted.length){
                    var all=_.filter(creep.body,p=>p.type==boosted[0].type);
                    // console.log(all);
                    if(all.length<=1+boosted.length) continue;
                }
                var lab=creep.pos.findClosestByRange(FIND_STRUCTURES,{filter:l=>l.structureType==STRUCTURE_LAB&&l.mineralType&&l.mineralType==mineral});
                // console.log(lab);
                if(lab){
                    creep.say('🚀 Boost!');
                    var amount=6;
                    if(creep.getActiveBodyparts(MOVE)==8) amount=7;
                    if(lab.boostCreep(creep,amount)!=OK){
                        creep.moveTo(lab);
                    }
                    return;
                }
            }
        }
        
        if(_.sum(creep.carry)>=creep.carryCapacity-50)
            this.toggleStatus(creep,true);
        if(_.sum(creep.carry)==0)
            this.toggleStatus(creep,false);
	    if(type!=RESOURCE_ENERGY&& _.sum(creep.carry)&&creep.ticksToLive<30)
            this.toggleStatus(creep,true);
        
        BTW(creep,type);
        
    	if(creep.getActiveBodyparts(WORK)&&!creep.room.find(FIND_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_TOWER&&object.my}).length){
	        var target = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_STRUCTURES,3, {
                filter: object => object.structureType==STRUCTURE_ROAD&&object.hits+100 <= object.hitsMax && (object.owner==undefined||object.my) && Memory.dismantleList.indexOf(object.id)==-1
            }));
            //console.log(creep.name,target);
            if(target)creep.repair(target);
            else{
    	       // var target = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_STRUCTURES,3, {
            //         filter: object =>object.structureType==STRUCTURE_CONTAINER&& object.hits+100 <= object.hitsMax && (object.owner==undefined||object.my) && Memory.dismantleList.indexOf(object.id)==-1
            //     }));
            //     if(target)creep.repair(target);
            //     else{
                    var target = creep.pos.findClosestByRange(creep.pos.findInRange(FIND_CONSTRUCTION_SITES,3,
                        {filter:site => site.owner.username=='iamgqr'}));
            //console.log(creep.name,target);
                    if(target!=null) {
                        creep.build(target);
                    }
                // }
            }
        }
        if(creep.carry.energy&&creep.room.controller.level!=8){
            var link=creep.pos.findInRange(FIND_STRUCTURES,1,{filter:s=>s.structureType==STRUCTURE_LINK})[0];
            if(link){
                var amount=Math.min(link.energyCapacity-link.energy-(link.cooldown||0)*10-50,creep.carry.energy);
                if(amount>0){
                    creep.transfer(link,RESOURCE_ENERGY,amount);
                }
            }
        }
        
	    if(creep.memory.working){
	        if(!end) return;
	        if(creep.pos.inRangeTo(end,1)){
	            var ret=this.work_target(creep,type);
	            //console.log(creep.name,ret);
	            if(ret==-1) ret=this.get_target(creep,type);
	            if(ret==1){
                    this.toggleStatus(creep,false);
                    this.goto(creep,end,begin);
                    return;
	            }
	            else{
	                avoidRoads(creep);
	            }
	        }
	        if(!creep.pos.isEqualTo(end)) this.goto(creep,begin,end);
	    }
	    else{
	        if(!begin) return;
	       // if(begin.roomName==Game.spawns[creep.memory.spawn].room.name)
	       //     if(autoRenew(creep)) return;
            if(creep.pos.inRangeTo(begin,1)){
	            creep.memory.awaiting=true;
	            var ret=this.work_source(creep,type);
	            if(ret==-1) ret=this.get_source(creep,type);
	            if(ret==1){
                    this.toggleStatus(creep,true);
                    this.goto(creep,begin,end);
                    return;
	            }
	            else{
	                avoidRoads(creep);
	            }
	        }
            if(!creep.pos.isEqualTo(begin)) this.goto(creep,end,begin);
	    }
    }
};
profiler.registerClass(roleMinecart, 'roleMinecart');
module.exports=roleMinecart;
