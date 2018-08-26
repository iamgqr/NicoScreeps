
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
const workList=[
    [
        "5b7a27029b3af8175e501058",
        "5b7c04fff86f4e0754ced80e",
        "5b7c059e4b70be3fd7faf99a",
        "5b7c0c6bb8fd8602d2bfbfe1",
        "5b7c1088b8fd8602d2bfc1a8",
        "5b7c1d8453dd664061d8c78b",
        "5b7c20fff86f4e0754cee2be",
        "5b7c251b833a0502a127e75e",
        "5b7c428f37852f3d52e3f2b1",
        "5b7c524037852f3d52e3f875",
        "5b7c5d6fc6080c0780ca22ab",
        "5b7c6f2c11faf97bdeca99c6",
        "5b7e31f5743b3917a0bdef1f",
        "5b7f4a7853dd664061d9f653",
        "5b7f4cd2ed8c3602b5781d72",
        "5b7f4d8573dec0420e27f1a9",
        "5b7f513253dd664061d9f8e1",
        "5b7f6ba6efb476076882c3ed",
        "5b7f79bc4602265638d3a90a",
        "5b7f7d69efb476076882ca95",
        "5b7f806b11faf97bdecbbf3f"
    ],
    [
        "5b78e5d6f79358042e76ff2e",
        "5b7919b09b3af8175e4fa584",
        "5b7c13450979756b62abdf1a",
        "5b7c29bf60dbfa6a6dfca75d",
        "5b7c432f3e1314168cf6d2f2",
        "5b7c537bb0d0407bcad7de55",
        "5b7c73da53dd664061d8e756",
        "5b7e36198355616b4454b2db",
        "5b7f429ab8fd8602d2c10612",
        "5b7f441b257c8d41fa379093"
    ],
    [
        '6f350538710f44fcf6badef6',
        '987ed7763d8e36c115d62489',
        '5e7007063f42c32d951e0044',
        'dd46fa30b233dd28527ff21b',
    ],
];

var moveWork=function(creep,targets){
    var findTarget=function(){
        var targets = _.filter(_.map(workList[creep.memory.behaviour],Game.getObjectById),structure => structure.energy < structure.energyCapacity);
        targets.sort((a,b)=>{
            return a.pos.getRangeTo(creep)-b.pos.getRangeTo(creep);
        })
        return targets;
    };
    if(!targets) targets=findTarget();
    var target=targets[0];
    console.log(creep.name,'-',target);
    if(target) {
        var ret=creep.transfer(target, RESOURCE_ENERGY);
        if(ret !=OK) {
            //if(creep.memory.behaviour==2){
            if(!creep.memory.pathWork||creep.memory.pathWork.incomplete||Game.time-creep.memory.pathWork.time>=20){
                creep.memory.pathWork=PathFinder.search(creep.pos,{pos:target.pos,range:1},{
                    maxRooms:1,
                    roomCallback:function(roomName){
                        var matrix=new PathFinder.CostMatrix;
                        for(var x=0;x<50;x++) for(var y=0;y<50;y++){
                            var nPos=new RoomPosition(x,y,roomName);
                            matrix.set(x,y,Math.max(_.filter(nPos.lookFor(LOOK_STRUCTURES),
                                object=>OBSTACLE_OBJECT_TYPES.indexOf(object.structureType)!=-1).length!=0
                                ||nPos.lookFor(LOOK_TERRAIN)=='wall'?255:1,
                                Math.ceil((23-nPos.findInRange(targets,1).length*4)))/nPos.lookFor(LOOK_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_ROAD}).length);
                        }
                        console.log(JSON.stringify(matrix));
                        return matrix;
                    }
                });
                creep.memory.pathWork.time=Game.time;
                creep.memory.pathWork.path.unshift(creep.pos);
                console.log(creep.name,'--',JSON.stringify(creep.memory.pathWork));
            }
            var nIndex=_.findIndex(creep.memory.pathWork.path,function(pos){return creep.pos.x==pos.x&&creep.pos.y==pos.y&&creep.pos.roomName==pos.roomName;});
            console.log(creep.name,nIndex);
            if(nIndex!=-1&&nIndex!=creep.memory.pathWork.path.length-1){
                creep.move(creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].x,creep.memory.pathWork.path[nIndex+1].y));
                console.log(creep.name,'---',creep.pos.getDirectionTo(creep.memory.pathWork.path[nIndex+1].x,creep.memory.pathWork.path[nIndex+1].y));
            }
            else{
                delete creep.memory.pathWork;
            }
            //return;
            //}
            //creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:5,ignoreCreeps:false,plainCost:100,swampCost:100});
        }
        else{
            //if(!(creep.carry.energy<=target.energyCapacity-target.energy))
            //creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'},reusePath:0,ignoreCreeps:false,plainCost:100,swampCost:100});
            
            delete creep.memory.pathWork;
            if(ret==OK&&!(creep.carry.energy<=target.energyCapacity-target.energy)){
                targets.shift();
                moveWork(creep,targets);
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
        console.log(creep.name,'|');
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
	        if(findEnergy.findEnergy(creep)==0){
                return moveWork(creep);
	        }
        }
        return 0;
	}
};

module.exports = roleSupporter;

