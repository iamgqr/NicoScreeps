const consts = require('consts');
const directions=consts.directions;
const needVisualizeList={
    'Spawn1':['W41N32','W43N33','W44N33','W42N32','W43N32','W43N31'],
    'Spawn2':['W45N32','W46N33','W46N32'],
};
const templateVisualizer=[TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK];
const templateWarrior=[TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,HEAL];
var autoVisualize = {
    getDirection:function(spawn,role,behaviour){
        var direction;
        if(directions[spawn.name]){
            if(directions[spawn.name].default) direction=directions[spawn.name].default;
            if(directions[spawn.name][role]){
                if(directions[spawn.name][role].default) direction=directions[spawn.name][role].default;
                if(directions[spawn.name][role][behaviour]) direction=directions[spawn.name][role][behaviour];
            }
        }
        return direction;
    },
    run: function(spawn){
        if(spawn.spawning) return -3;
        for(id in needVisualizeList[spawn.name]){
            room=needVisualizeList[spawn.name][id];
            if(!spawn.memory.lists['visualizer']) spawn.memory.lists['visualizer']={};
            const direction=this.getDirection(spawn,'visualizer',room);
            if(Memory.rooms[room]&&Memory.rooms[room].dangerMode&&room!='W43N31'){
                var newName = 'Warrior' + Game.time + '-' + room;
                if(spawn.spawnCreep(templateWarrior, newName, 
                    {memory: {role: 'visualizer',spawn:spawn.name,targetRoomPos:{roomName:room}},directions:direction})==OK){
                        console.log('Spawning new Warrior: ' + newName);
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
                    {memory: {role: 'visualizer',spawn:spawn.name,targetRoomPos:{roomName:room}},directions:direction})==OK){
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