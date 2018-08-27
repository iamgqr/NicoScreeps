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
    var findTarget=function(){
        var targets = _.filter(_.map(workList[creep.memory.spawn][creep.memory.behaviour],Game.getObjectById),structure => structure.energy < structure.energyCapacity);
        targets.sort((a,b)=>{
            return a.pos.getRangeTo(creep)-b.pos.getRangeTo(creep);
        })
        return targets;
    };
    if(!targets) targets=findTarget();
    var target=targets[0];
    var getMatrix=function(roomName){
        var matrix=new PathFinder.CostMatrix;
        // var visual=new RoomVisual(roomName);
        for(var x=0;x<50;x++) for(var y=0;y<50;y++){
            var nPos=new RoomPosition(x,y,roomName);
            var cst=Math.max(
                _.filter(nPos.lookFor(LOOK_STRUCTURES),
                object=>OBSTACLE_OBJECT_TYPES.indexOf(object.structureType)!=-1).length!=0
                ||nPos.lookFor(LOOK_TERRAIN)=='wall'
                ||(!ignoreCreeps&&nPos.lookFor(LOOK_CREEPS).length!=0)
                ?255:1,
                Math.ceil(
                    (23-nPos.findInRange(targets,1).length*4)/
                    (nPos.lookFor(LOOK_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_ROAD}).length+0.5)
                )
            );
            // if(creep.memory.behaviour==1){
            //     visual.text(cst.toString(),x,y,{color:'green',font:0.4,opacity:0.5});
            // }
            matrix.set(x,y,cst);
        }
        //console.log(JSON.stringify(matrix));
        return matrix;
    }
    
    // getMatrix(creep.room.name);
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
                creep.memory.pathWork.time=Game.time;
                creep.memory.pathWork.path.unshift(creep.pos);
                creep.memory.pathWork.path=_.slice(creep.memory.pathWork.path,0,25);
                //console.log(creep.name,'--',JSON.stringify(creep.memory.pathWork));
            }
            var nIndex=_.findIndex(creep.memory.pathWork.path,function(pos){return creep.pos.x==pos.x&&creep.pos.y==pos.y&&creep.pos.roomName==pos.roomName;});
            //console.log(creep.name,nIndex);
            if(nIndex!=-1&&nIndex!=creep.memory.pathWork.path.length-1){
                creep.move(creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].x,creep.memory.pathWork.path[nIndex+1].y));
                //console.log(creep.name,'---',creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].x,creep.memory.pathWork.path[nIndex+1].y));
            }
            else{
                delete creep.memory.pathWork;
            }
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
            else findEnergy.findEnergy(creep);
            
        }
    }
    else{
        return -1;
    }
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
            if(autoRenew(creep)) return;
            return moveWork(creep);
        }
	    else {
            //console.log('QWQ'+creep.name);
	        if(findEnergy(creep)==0){
                return moveWork(creep);
	        }
        }
        return 0;
	}
};

module.exports = roleSupporter;

