const needVisualizeList=['W41N32','W43N33','W44N34','W42N32'];
const templateVisualizer=[TOUGH,MOVE,TOUGH,MOVE,ATTACK,MOVE,MOVE,ATTACK];
const templateWarrior=[TOUGH,MOVE,TOUGH,MOVE,MOVE,ATTACK,ATTACK,MOVE,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,HEAL,MOVE,CARRY];
var autoVisualize = {
    run: function(spawn){
        if(spawn.spawning) return -3;
        for(id in needVisualizeList){
            room=needVisualizeList[id];
            if(Memory.dangerMode[room]){
                var newName = 'Warrior' + Game.time + '-' + room;
                if(spawn.spawnCreep(templateWarrior, newName, 
                    {memory: {role: 'visualizer',targetRoomPos:{roomName:room}}})==OK){
                        console.log('Spawning new waarrior: ' + newName);
                        spawn.memory.lists['visualizer'][room]=newName;
                        return 0;
                    }
                return -1;
            }
            if(spawn.memory.lists['visualizer'][room]==null||Game.creeps[spawn.memory.lists['visualizer'][room]]==null||
                Game.creeps[spawn.memory.lists['visualizer'][room]].ticksToLive<Game.map.getRoomLinearDistance(spawn.room.name,room)*50+Memory.constReactTime+templateVisualizer.length*3
                ){
                var newName = 'Visualizer' + Game.time + '-' + room;
                if(spawn.spawnCreep(templateVisualizer, newName, 
                    {memory: {role: 'visualizer',targetRoomPos:{roomName:room}}})==OK){
                        console.log('Spawning new visualizer: ' + newName);
                        spawn.memory.lists['visualizer'][room]=newName;
                        return 0;
                    }
                return -1;
            }
        }
    }
}
module.exports = autoVisualize;