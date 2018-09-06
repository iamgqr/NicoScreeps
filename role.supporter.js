const consts = require('consts');
const workList=consts.supporter.workList;
const plainCost=consts.supporter.plainCost;
const swampCost=consts.supporter.swampCost;
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
var avoidRoads = require('function.avoidRoads');
var BTW = require('function.BTW');

var getCreepsMatrix = require('function.getCreepsMatrix');
var getStructuresMatrix = require('function.getStructuresMatrix');
var roleRepairer = require('role.repairer');

const profiler = require('screeps-profiler');

// var findTarget=function(){
//     var targets = creep.room.find(FIND_STRUCTURES, {
//             filter: (structure) => {
//                 return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
//                     structure.energy < structure.energyCapacity;
//             }
//     });
//     targets.sort((a,b) =>
//     (Math.max(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))+
//     0.1*Math.min(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))-
//     Math.max(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y))-
//     0.1*Math.min(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y)))*50
//     );
//     return targets;
// };
// var targets=findTarget();
// var target=targets[0];

// JSON.stringify(_.map(Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,{filter:object=>(object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_SPAWN)&&object.pos.x+object.pos.y<42}),'id'))


var roleSupporter = {
    findTarget:function(creep){
        var targets = _.filter(_.map(workList[creep.memory.spawn][creep.memory.behaviour],Game.getObjectById),object => object&&object.energy < object.energyCapacity);
        return targets;
    },
    toggleStatus:function(creep,working){
        if(creep.memory.working!=working){
	        creep.memory.working=working;
            creep.say(working?'🚚 support':'🔄 harvest');
        }
    },
    getTargetsMatrix:function(roomName,targets){
        var cnt=new PathFinder.CostMatrix;
        const dxy=[[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];
        for(i in targets) if(targets[i].pos.roomName==roomName){
            for(p in dxy){
                const nx=targets[i].pos.x+dxy[p][0],ny=targets[i].pos.y+dxy[p][1];
                if(0<=nx&&nx<50&&0<=ny&&ny<50) cnt.set(nx,ny,cnt.get(nx,ny)+1);
            }
        }
        return cnt;
    },
    getMatrix:function(creep,targets,visible=false){
        var getTargetsMatrix=this.getTargetsMatrix;
        var supporterGetMatrix=function(roomName){
            var visual;
            if(visible) visual=new RoomVisual(roomName);
            
            var cnt=getTargetsMatrix(roomName,targets);
            var matrix=getStructuresMatrix(roomName);
            for(var x=0;x<50;x++) for(var y=0;y<50;y++){
                var currTerrain=Game.map.getTerrainAt(x,y,roomName);
                if(visible){//&&creep.memory.behaviour==0){
                    visual.text(matrix.get(x,y).toString(),x,y,{color:'green',font:0.4,opacity:0.5});
                }
                if(matrix.get(x,y)==255) continue;
                matrix.set(x,y,Math.max(1,Math.ceil(((currTerrain=='swamp'&&matrix.get(x,y)==0)?swampCost:plainCost)*(3-2*matrix.get(x,y))/(cnt.get(x,y)+1))));
            }
            return matrix;
        }
        return profiler.registerFN(supporterGetMatrix,'supporterGetMatrix');
    },
    moveWork:function(creep,targets,dep=0){
        //console.log(Game.time+" - creep "+creep.name+" Z, CPU="+Game.cpu.getUsed());
        //console.log(Game.time+" - creep "+creep.name+" mw begin, CPU="+Game.cpu.getUsed());
        var ignoreCreeps=false;
        if(!targets) targets=this.findTarget(creep);
        var target;
        if(!creep.memory.targetId||Game.time%5==0||Game.getObjectById(creep.memory.targetId).energy==Game.getObjectById(creep.memory.targetId).energyCapacity){
            target=creep.pos.findClosestByRange(targets);
            if(target) creep.memory.targetId=target.id;
            else delete creep.memory.targetId;
        }
        else target=Game.getObjectById(creep.memory.targetId);
        //getMatrix=profiler.registerFN(getMatrix, 'roleSupporter.getMatrix');
        //this.getMatrix(creep.room.name,true);
        //console.log(creep.name,'-',target);
        //console.log(creep.name,target);
        if(target) {
            if(!creep.pos.isNearTo(target)) {
                // //if(creep.memory.behaviour==2){
                // if(creep.pos.findInRange(FIND_CREEPS,1,{filter:object=>object.name!=creep.name}).length==0) ignoreCreeps=true;
                // if(!creep.memory.pathWork||creep.memory.pathWork.incomplete||Game.time-creep.memory.pathWork.time>=20/*||!ignoreCreeps*/){
                //     if(creep.memory.pathWork) delete creep.memory.pathWork;
                //     if(creep.memory._move) delete creep.memory._move;
                //     var getMatrix=this.getMatrix(creep,targets,ignoreCreeps);
                //     creep.memory.pathWork=PathFinder.search(creep.pos,{pos:target.pos,range:1},{
                //         maxRooms:1,
                //         roomCallback:getMatrix
                //     });
                //     //console.log(Game.time+" - creep "+creep.name+" F, CPU="+Game.cpu.getUsed());
                //     creep.memory.pathWork.time=Game.time;
                //     creep.memory.pathWork.path.unshift(creep.pos);
                //     creep.memory.pathWork.path=_.map(_.slice(creep.memory.pathWork.path,0,25),function(object){
                //         return {p:object.x+object.y*50,roomName:object.roomName};
                //     });
                //     //console.log(creep.name,'--',JSON.stringify(creep.memory.pathWork));
                //     //console.log(Game.time+" - creep "+creep.name+" BB, CPU="+Game.cpu.getUsed());
                // }
                // //console.log(Game.time+" - creep "+creep.name+" B, CPU="+Game.cpu.getUsed());
                // var nIndex=_.findIndex(creep.memory.pathWork.path,function(pos){return creep.pos.x==pos.p%50&&creep.pos.y==Math.floor(pos.p/50+0.01)&&creep.pos.roomName==pos.roomName;});
                // //console.log(creep.name,nIndex);
                // if(nIndex!=-1&&nIndex!=creep.memory.pathWork.path.length-1){
                //     creep.move(creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].p%50,Math.floor(creep.memory.pathWork.path[nIndex+1].p/50+0.01)));
                //     if(nIndex>0) creep.memory.pathWork.path.shift();
                //     //console.log(creep.name,'---',creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].x,creep.memory.pathWork.path[nIndex+1].y));
                // }
                // else{
                //     delete creep.memory.pathWork;
                // }
                // //console.log(Game.time+" - creep "+creep.name+" C, CPU="+Game.cpu.getUsed());
                // //return;
                // //}
                if(Game.time%10==0) creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:0,range:1,ignoreCreeps:false});
                else creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:20,range:1,ignoreCreeps:true,ignoreDestructibleStructures:true,ignoreRoads:true,costCallback:this.getMatrix(creep,targets,false)});
            }
            else{
                if(dep==1) return;
                var ret=creep.transfer(target, RESOURCE_ENERGY);
                //if(!(creep.carry.energy<=target.energyCapacity-target.energy))
                //creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:0,ignoreCreeps:false,plainCost:100,swampCost:100});
                
                // delete creep.memory.pathWork;
                if(ret==OK&&!(creep.carry.energy<=target.energyCapacity-target.energy)){
                    delete creep.memory.targetId;
                    this.moveWork(creep,_.filter(targets,a=>a!=target),dep+1);
                }
                else{
                    return 1;
                }
            }
            return 0;
        }
        else{
            if(!creep.getActiveBodyparts(WORK)){
                avoidRoads(creep);
                return -1;
            }
            else{
                return roleRepairer.moveWork(creep,'supporter');
            }
        }
        return 0;
        //console.log(Game.time+" - creep "+creep.name+" D, CPU="+Game.cpu.getUsed());
    },
    run: function(creep) {
        
        if(creep.carry.energy == 0)
            this.toggleStatus(creep,false);
	    if(creep.carry.energy == creep.carryCapacity)
            this.toggleStatus(creep,true);
            
        BTW(creep);
        //console.log(creep.name,'|');
/*
        if(creep.room.name!='W42N33'){
            creep.moveTo(new RoomPosition(22,22,'W42N33'));
            return -2;
        }*/
        if(creep.memory.working) {
            if(this.moveWork(creep)==1){
                this.toggleStatus(creep,false);
                findEnergy(creep);
            }
        }
	    else {
            delete creep.memory.targetId;
            if(autoRenew(creep)) return;
            //console.log('QWQ'+creep.name);
	        if(findEnergy(creep)==0){
                this.toggleStatus(creep,true);
                return this.moveWork(creep);
	        }
        }
        return 0;
	}
};

profiler.registerClass(roleSupporter, 'roleSupporter');
module.exports = roleSupporter;

