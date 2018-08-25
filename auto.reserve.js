const needReserveList=['W42N32','W41N32'];//,'W43N33'];
const templateClaimer=[CLAIM,MOVE];
const templateDoubleClaimer=[CLAIM,MOVE,CLAIM,MOVE];
var autoReserve = {
    run: function(spawn){
        if(spawn.spawning) return -3;
        for(id in needReserveList){
            room=needReserveList[id];
            if(spawn.memory.lists['claimer'][room]==null||Game.creeps[spawn.memory.lists['claimer'][room]]==null||
                Game.creeps[spawn.memory.lists['claimer'][room]].ticksToLive<Game.map.getRoomLinearDistance(spawn.room.name,room)*50+30+Memory.constReactTime+templateClaimer.length*3
                ){
                var newName = 'Claimer' + Game.time + '-' + room;
                var templateNClaimer=templateClaimer;
                if(Math.random()>0.8){
                    templateNClaimer=templateDoubleClaimer;
                    newName=newName+'D'
                }
                if(spawn.spawnCreep(templateNClaimer, newName, 
                    {memory: {role: 'claimer',targetRoomPos:{roomName:room}}})==OK){
                        console.log('Spawning new claimer: ' + newName);
                        spawn.memory.lists['claimer'][room]=newName;
                        return 0;
                    }
                return -1;
            }
        }
    }
}
module.exports = autoReserve;