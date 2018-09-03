const profiler = require('screeps-profiler');

var avoidRoads=function(creep){
    if(Math.random()<0.3) creep.move(Math.floor(Math.random()*8)+1);
    // var currRoad=_.filter(creep.pos.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD});
    // if(currRoad.length>0){
    //     var posup=creep.pos;posup.y--;
    //     if(posup.y>0&&posup.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posup.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posup.lookFor(LOOK_CREEPS).length==0){
    //         creep.move(TOP);
    //         return;
    //     }
    //     var posright=creep.pos;posright.x++;
    //     if(posright.x<49&&posright.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posright.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posright.lookFor(LOOK_CREEPS).length==0){
    //         creep.move(RIGHT);
    //         return;
    //     }
    //     var posdown=creep.pos;posdown.y++;
    //     if(posdown.y<49&&posdown.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posdown.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posdown.lookFor(LOOK_CREEPS).length==0){
    //         creep.move(BOTTOM);
    //         return;
    //     }
    //     var posleft=creep.pos;posleft.x--;
    //     if(posleft.x> 0&&posleft.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posleft.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posleft.lookFor(LOOK_CREEPS).length==0){
    //         creep.move(LEFT);
    //         return;
    //     }
    // }
};

module.exports = profiler.registerFN(avoidRoads, 'avoidRoads');