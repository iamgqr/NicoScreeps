const profiler = require('screeps-profiler');

var getCreepsMatrix = function(roomName,ignoreCreeps=false){
    if(!Game.rooms[roomName]) return new PathFinder.CostMatrix;
    if(!ignoreCreeps){
        if(!Game.rooms[roomName].memory.matrixes) Game.rooms[roomName].memory.matrixes={};
        if(!Game.rooms[roomName].memory.matrixes.creeps||Game.time-Game.rooms[roomName].memory.matrixes.creeps.time>=1){
            var crp=new PathFinder.CostMatrix;
            var creeps=Game.rooms[roomName].find(FIND_CREEPS);
            for(i in creeps){
                crp.set(creeps[i].pos.x,creeps[i].pos.y,255);
            }
            Game.rooms[roomName].memory.matrixes.creeps={time:Game.time,matrix:crp.serialize()};
            return crp;
        }
        else return PathFinder.CostMatrix.deserialize(Game.rooms[roomName].memory.matrixes.creeps.matrix);
    }
    else return new PathFinder.CostMatrix;
};

module.exports=profiler.registerFN(getCreepsMatrix, 'getCreepsMatrix');
