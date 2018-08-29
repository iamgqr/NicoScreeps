const profiler = require('screeps-profiler');

var getStructuresMatrix = function(roomName){
    if(!Memory.matrixes.structures[roomName]||Game.time-Memory.matrixes.structures[roomName].time>=100){
        var struct=new PathFinder.CostMatrix;
        var structures=Game.rooms[roomName].find(FIND_STRUCTURES);
        for(i in structures){
            if(structures[i].structureType==STRUCTURE_ROAD){
                if(struct.get(structures[i].pos.x,structures[i].pos.y)!=255) struct.set(structures[i].pos.x,structures[i].pos.y,1);
            }
            else if(OBSTACLE_OBJECT_TYPES.indexOf(structures[i].structureType)!=-1) struct.set(structures[i].pos.x,structures[i].pos.y,255);
        }
        Memory.matrixes.structures[roomName]={time:Game.time,matrix:struct.serialize()}
        return struct;
    }
    else return PathFinder.CostMatrix.deserialize(Memory.matrixes.structures[roomName].matrix);
};

module.exports=profiler.registerFN(getStructuresMatrix, 'getStructuresMatrix');
