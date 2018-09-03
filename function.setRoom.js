const profiler = require('screeps-profiler');

var setRoom=function(creep,roomName,args){
    if(roomName!=creep.room.name){
        var exit=Game.map.findExit(creep.room.name,roomName);
        if(exit>=0){
            var exit=creep.pos.findClosestByPath(exit);
            creep.moveTo(exit, args);
        }
        return 0;
    }
    else return 1;
};

module.exports = profiler.registerFN(setRoom, 'setRoom');
