const consts = require('consts');
const workList=consts.supporter.workList;
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');

var getCreepsMatrix = require('function.getCreepsMatrix');
var getStructuresMatrix = require('function.getStructuresMatrix');

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
        var targets = _.filter(_.compact(_.map(workList[creep.memory.spawn][creep.memory.behaviour],Game.getObjectById)),structure => structure.energy < structure.energyCapacity);
        targets.sort((a,b)=>{
            return a.pos.getRangeTo(creep)-b.pos.getRangeTo(creep);
        })
        return targets;
    },
    getTargetsMatrix:function(targets){
        var cnt=new PathFinder.CostMatrix;
        const dxy=[[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];
        for(i in targets){
            for(p in dxy){
                const nx=targets[i].pos.x+dxy[p][0],ny=targets[i].pos.y+dxy[p][1];
                if(0<=nx&&nx<50&&0<=ny&&ny<50) cnt.set(nx,ny,cnt.get(nx,ny)+1);
            }
        }
        return cnt;
    },
    getMatrix:function(creep,targets,ignoreCreeps,visible=false){
        var getTargetsMatrix=this.getTargetsMatrix;
        return function(roomName){
            //console.log(creep.name,targets.length,ignoreCreeps,visible);
            var matrix=new PathFinder.CostMatrix;
            var visual;
            if(visible) visual=new RoomVisual(roomName);
            
            var struct=getStructuresMatrix(roomName);
            
            var crp=getCreepsMatrix(roomName,ignoreCreeps);
            
            var cnt=getTargetsMatrix(targets);
            
            for(var x=0;x<50;x++) for(var y=0;y<50;y++){
                if(struct.get(x,y)==255||crp.get(x,y)==255||Game.map.getTerrainAt(x,y,roomName)=='wall'){
                    matrix.set(x,y,255);
                }
                else{
                    matrix.set(x,y,Math.max(1,Math.ceil((15-cnt.get(x,y)*2)/(2*struct.get(x,y)+1))));
                    if(visible&&creep.memory.behaviour==0){
                        visual.text(matrix.get(x,y).toString(),x,y,{color:'green',font:0.4,opacity:0.5});
                    }
                }
            }
            return matrix;
        }
    },
    moveWork:function(creep,targets,dep=0){
        //console.log(Game.time+" - creep "+creep.name+" Z, CPU="+Game.cpu.getUsed());
        //console.log(Game.time+" - creep "+creep.name+" mw begin, CPU="+Game.cpu.getUsed());
        var ignoreCreeps=false;
        if(!targets) targets=this.findTarget(creep);
        var target=targets[0];
        //getMatrix=profiler.registerFN(getMatrix, 'roleSupporter.getMatrix');
        //this.getMatrix(creep.room.name,true);
        //console.log(creep.name,'-',target);
        if(target) {
            if(!creep.pos.isNearTo(target)) {
                //if(creep.memory.behaviour==2){
                if(creep.pos.findInRange(FIND_CREEPS,1,{filter:object=>object.name!=creep.name}).length==0) ignoreCreeps=true;
                if(!creep.memory.pathWork||creep.memory.pathWork.incomplete||Game.time-creep.memory.pathWork.time>=20||!ignoreCreeps){
                    if(creep.memory.pathWork) delete creep.memory.pathWork;
                    if(creep.memory._move) delete creep.memory._move;
                    var getMatrix=this.getMatrix(creep,targets,ignoreCreeps);
                    creep.memory.pathWork=PathFinder.search(creep.pos,{pos:target.pos,range:1},{
                        maxRooms:1,
                        roomCallback:getMatrix
                    });
                    //console.log(Game.time+" - creep "+creep.name+" F, CPU="+Game.cpu.getUsed());
                    creep.memory.pathWork.time=Game.time;
                    creep.memory.pathWork.path.unshift(creep.pos);
                    creep.memory.pathWork.path=_.map(_.slice(creep.memory.pathWork.path,0,25),function(object){
                        return {p:object.x+object.y*50,roomName:object.roomName};
                    });
                    //console.log(creep.name,'--',JSON.stringify(creep.memory.pathWork));
                    //console.log(Game.time+" - creep "+creep.name+" BB, CPU="+Game.cpu.getUsed());
                }
                //console.log(Game.time+" - creep "+creep.name+" B, CPU="+Game.cpu.getUsed());
                var nIndex=_.findIndex(creep.memory.pathWork.path,function(pos){return creep.pos.x==pos.p%50&&creep.pos.y==Math.floor(pos.p/50+0.01)&&creep.pos.roomName==pos.roomName;});
                //console.log(creep.name,nIndex);
                if(nIndex!=-1&&nIndex!=creep.memory.pathWork.path.length-1){
                    creep.move(creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].p%50,Math.floor(creep.memory.pathWork.path[nIndex+1].p/50+0.01)));
                    if(nIndex>0) creep.memory.pathWork.path.shift();
                    //console.log(creep.name,'---',creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].x,creep.memory.pathWork.path[nIndex+1].y));
                }
                else{
                    delete creep.memory.pathWork;
                }
                //console.log(Game.time+" - creep "+creep.name+" C, CPU="+Game.cpu.getUsed());
                //return;
                //}
                //creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:5,ignoreCreeps:false,plainCost:100,swampCost:100});
            }
            else{
                var ret=creep.transfer(target, RESOURCE_ENERGY);
                //if(!(creep.carry.energy<=target.energyCapacity-target.energy))
                //creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:0,ignoreCreeps:false,plainCost:100,swampCost:100});
                
                delete creep.memory.pathWork;
                if(ret==OK&&!(creep.carry.energy<=target.energyCapacity-target.energy)){
                    if(dep==0){
                        targets.shift();
                        this.moveWork(creep,targets,dep+1);
                    }
                }
                else findEnergy(creep);
                
            }
        }
        else{
            return -1;
        }
        //console.log(Game.time+" - creep "+creep.name+" D, CPU="+Game.cpu.getUsed());
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('🚚 support');
	    }
        //console.log(creep.name,'|');
/*
        if(creep.room.name!='W42N33'){
            creep.moveTo(new RoomPosition(22,22,'W42N33'));
            return -2;
        }*/
        if(creep.memory.working) {
            return this.moveWork(creep);
        }
	    else {
            if(autoRenew(creep)) return;
            //console.log('QWQ'+creep.name);
	        if(findEnergy(creep)==0){
                return this.moveWork(creep);
	        }
        }
        return 0;
	}
};

profiler.registerClass(roleSupporter, 'roleSupporter');
module.exports = roleSupporter;

