const profiler = require('screeps-profiler');

var getCreepsMatrix = function(roomName,ignoreCreeps=false){
    if(!ignoreCreeps){
        if(!Memory.matrixes.creeps[roomName]||Game.time-Memory.matrixes.creeps[roomName].time>=1){
            var crp=new PathFinder.CostMatrix;
            var creeps=Game.rooms[roomName].find(FIND_CREEPS);
            for(i in creeps){
                crp.set(creeps[i].pos.x,creeps[i].pos.y,255);
            }
            Memory.matrixes.creeps[roomName]={time:Game.time,matrix:crp.serialize()};
            return crp;
        }
        else return PathFinder.CostMatrix.deserialize(Memory.matrixes.creeps[roomName].matrix);
    }
    else return new PathFinder.CostMatrix;
};

module.exports=profiler.registerFN(getCreepsMatrix, 'getCreepsMatrix');
