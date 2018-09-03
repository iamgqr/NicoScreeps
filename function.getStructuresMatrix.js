const profiler = require('screeps-profiler');

var getStructuresMatrix = function(roomName){
    if(!Game.rooms[roomName]) return new PathFinder.CostMatrix;
    if(!Game.rooms[roomName].memory.matrixes) Game.rooms[roomName].memory.matrixes={};
    if(!Game.rooms[roomName].memory.matrixes.structures||Game.time-Game.rooms[roomName].memory.matrixes.structures.time>=500){
        var struct=new PathFinder.CostMatrix;
        //console.log(roomName);
        var structures=Game.rooms[roomName].find(FIND_STRUCTURES);
        for(i in structures){
            if(structures[i].structureType==STRUCTURE_ROAD){
                if(struct.get(structures[i].pos.x,structures[i].pos.y)!=255) struct.set(structures[i].pos.x,structures[i].pos.y,1);
            }
            else if(OBSTACLE_OBJECT_TYPES.indexOf(structures[i].structureType)!=-1) struct.set(structures[i].pos.x,structures[i].pos.y,255);
        }
        
        for(var x=0;x<50;x++) for(var y=0;y<50;y++){
            var currTerrain=Game.map.getTerrainAt(x,y,roomName);
            if(currTerrain=='wall'){
                struct.set(x,y,255);
                continue;
            }
        }
        Game.rooms[roomName].memory.matrixes.structures={time:Game.time,matrix:struct.serialize()}
        return struct;
    }
    else return PathFinder.CostMatrix.deserialize(Game.rooms[roomName].memory.matrixes.structures.matrix);
};

module.exports=profiler.registerFN(getStructuresMatrix, 'getStructuresMatrix');
