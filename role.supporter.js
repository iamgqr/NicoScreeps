const consts = require('consts');
const workList=consts.supporter.workList;
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');

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


var moveWork=function(creep,targets,dep=0){
    //console.log(Game.time+" - creep "+creep.name+" Z, CPU="+Game.cpu.getUsed());
    //console.log(Game.time+" - creep "+creep.name+" mw begin, CPU="+Game.cpu.getUsed());
    var findTarget=function(){
        var targets = _.filter(_.map(workList[creep.memory.spawn][creep.memory.behaviour],Game.getObjectById),structure => structure.energy < structure.energyCapacity);
        targets.sort((a,b)=>{
            return a.pos.getRangeTo(creep)-b.pos.getRangeTo(creep);
        })
        return targets;
    };
    if(!targets) targets=findTarget();
    var target=targets[0];
    var getMatrix=function(roomName,visible=false){
        //console.log(Game.time+" - creep "+creep.name+" X, CPU="+Game.cpu.getUsed());
        var matrix=new PathFinder.CostMatrix;
        var cnt=new PathFinder.CostMatrix;
        var visual;
        if(visible) visual=new RoomVisual(roomName);
        for(var x=0;x<50;x++) for(var y=0;y<50;y++) matrix.set(x,y,1);
        var room=Game.rooms[roomName];
        
        var struct=Memory.matrixes.structures[roomName];
        if(!struct||Game.time-struct.time>=100){
            struct=new PathFinder.CostMatrix;
            var structures=room.find(FIND_STRUCTURES);
            for(i in structures){
                if(structures[i].structureType==STRUCTURE_ROAD){
                    if(struct.get(structures[i].pos.x,structures[i].pos.y)!=255) struct.set(structures[i].pos.x,structures[i].pos.y,1);
                }
                else if(OBSTACLE_OBJECT_TYPES.indexOf(structures[i].structureType)!=-1) struct.set(structures[i].pos.x,structures[i].pos.y,255);
            }
            Memory.matrixes.structures[roomName]={time:Game.time,matrix:struct.serialize()}
        }
        else struct=PathFinder.CostMatrix.deserialize(Memory.matrixes.structures[roomName].matrix);
        
        var crp=new PathFinder.CostMatrix;
        if(!ignoreCreeps){
            crp=Memory.matrixes.creeps[roomName];
            if(!crp||Game.time-crp.time>=1){
                crp=new PathFinder.CostMatrix;
                var creeps=room.find(FIND_CREEPS);
                for(i in creeps){
                    crp.set(creeps[i].pos.x,creeps[i].pos.y,255);
                }
                Memory.matrixes.creeps[roomName]={time:Game.time,matrix:crp.serialize()};
            }
            else crp=PathFinder.CostMatrix.deserialize(Memory.matrixes.creeps[roomName].matrix);
        }
        
        //console.log(Game.time+" - creep "+creep.name+" C, CPU="+Game.cpu.getUsed());
        const dxy=[[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1]];
        for(i in targets){
            for(xy in dxy){
                var nx=targets[i].pos.x+dxy[xy][0],ny=targets[i].pos.y+dxy[xy][1];
                if(0<=nx&&nx<50&&0<=ny&&ny<50) cnt.set(nx,ny,cnt.get(nx,ny)+1);
            }
        }
        //console.log(Game.time+" - creep "+creep.name+" D, CPU="+Game.cpu.getUsed());
        for(var x=0;x<50;x++) for(var y=0;y<50;y++){
            if(struct.get(x,y)==255||crp.get(x,y)==255||Game.map.getTerrainAt(x,y,roomName)=='wall'){
                matrix.set(x,y,255);
                continue;
            }
            matrix.set(x,y,Math.max(
                1,
                Math.ceil(
                    (11-cnt.get(x,y)*2)/
                    (struct.get(x,y)+0.5)
                )
            ));
            if(visible&&creep.memory.behaviour==0){
                visual.text(matrix.get(x,y).toString(),x,y,{color:'green',font:0.4,opacity:0.5});
            }
        }
        //console.log(Game.time+" - creep "+creep.name+" E, CPU="+Game.cpu.getUsed());
        //console.log(JSON.stringify(matrix));
        return matrix;
    }
    
    //getMatrix(creep.room.name,true);
    //console.log(creep.name,'-',target);
    if(target) {
        if(!creep.pos.inRangeTo(target,1)) {
            //if(creep.memory.behaviour==2){
            var ignoreCreeps=1;
            if(creep.pos.findInRange(FIND_CREEPS,1,{filter:object=>object.name!=creep.name}).length!=0) ignoreCreeps=0;
            if(!creep.memory.pathWork||creep.memory.pathWork.incomplete||Game.time-creep.memory.pathWork.time>=20||!ignoreCreeps){
                if(creep.memory.pathWork) delete creep.memory.pathWork;
                if(creep.memory._move) delete creep.memory._move;
                creep.memory.pathWork=PathFinder.search(creep.pos,{pos:target.pos,range:1},{
                    maxRooms:1,
                    roomCallback:getMatrix
                });
                //console.log(Game.time+" - creep "+creep.name+" F, CPU="+Game.cpu.getUsed());
                creep.memory.pathWork.time=Game.time;
                creep.memory.pathWork.path.unshift(creep.pos);
                creep.memory.pathWork.path=_.map(_.slice(creep.memory.pathWork.path,0,25),function(object){
                    return {xy:object.x+object.y*50,roomName:object.roomName};
                });
                //console.log(creep.name,'--',JSON.stringify(creep.memory.pathWork));
                //console.log(Game.time+" - creep "+creep.name+" BB, CPU="+Game.cpu.getUsed());
            }
            //console.log(Game.time+" - creep "+creep.name+" B, CPU="+Game.cpu.getUsed());
            var nIndex=_.findIndex(creep.memory.pathWork.path,function(pos){return creep.pos.x==pos.xy%50&&creep.pos.y==Math.floor(pos.xy/50+0.01)&&creep.pos.roomName==pos.roomName;});
            //console.log(creep.name,nIndex);
            if(nIndex!=-1&&nIndex!=creep.memory.pathWork.path.length-1){
                creep.move(creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].xy%50,Math.floor(creep.memory.pathWork.path[nIndex+1].xy/50+0.01)));
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
                    moveWork(creep,targets,dep+1);
                }
            }
            else findEnergy(creep);
            
        }
    }
    else{
        return -1;
    }
    //console.log(Game.time+" - creep "+creep.name+" D, CPU="+Game.cpu.getUsed());
};



var roleSupporter = {

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
            return moveWork(creep);
        }
	    else {
            if(autoRenew(creep)) return;
            //console.log('QWQ'+creep.name);
	        if(findEnergy(creep)==0){
                return moveWork(creep);
	        }
        }
        return 0;
	}
};

module.exports = roleSupporter;

