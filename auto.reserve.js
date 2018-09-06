const consts = require('consts');
const directions=consts.directions;
const needReserveList={
    'Spawn1':['W41N32','W42N32','W43N32'],
    'Spawn2':['W45N32','W46N33','W46N32','W44N33'],
}
const templateClaimer=[CLAIM,MOVE];
const templateDoubleClaimer=[CLAIM,MOVE,CLAIM,MOVE];
const namelist=['N','S','D','T','Q','P','H'];
var autoReserve = {
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
        for(id in needReserveList[spawn.name]){
            room=needReserveList[spawn.name][id];
            if(!Game.rooms[room]) continue;
            if(!spawn.memory.lists['claimer'])spawn.memory.lists['claimer']={};
            const direction=this.getDirection(spawn,'claimer',room);
            var templateNClaimer=[],cnt=0,capacity=spawn.room.energyCapacityAvailable;
            while(capacity>=650){
                templateNClaimer.push(CLAIM);
                templateNClaimer.push(MOVE);
                cnt++;capacity-=650;
            }
            if((spawn.memory.lists['claimer'][room]==null||Game.creeps[spawn.memory.lists['claimer'][room]]==null||Game.creeps[spawn.memory.lists['claimer'][room]].ticksToLive<Game.map.getRoomLinearDistance(spawn.room.name,room)*50+30+Memory.constReactTime+templateClaimer.length*3)&&
                //Game.creeps[spawn.memory.lists['claimer'][room]].ticksToLive<Game.map.getRoomLinearDistance(spawn.room.name,room)*50+30+Memory.constReactTime+templateClaimer.length*3
                (Game.rooms[room].controller.owner&&!Game.rooms[room].controller.my||!Game.rooms[room].controller.reservation||Game.rooms[room].controller.reservation.ticksToEnd<5000-(cnt-1)*550+Game.map.getRoomLinearDistance(spawn.room.name,room)*50+30+Memory.constReactTime+templateClaimer.length*3)
                ){
                var newName = 'Claimer' + Game.time + '-' + room + namelist[cnt];
                
                if(spawn.spawnCreep(templateNClaimer, newName, 
                    {memory: {role: 'claimer',spawn:spawn.name,targetRoomPos:{roomName:room}},directions:direction})==OK){
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