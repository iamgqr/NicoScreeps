const needHuntList={
    'Spawn1':['W44N34'],
};
const consts = require('consts');
const maxSpawn=consts.maxSpawn;
const template=consts.template;

var autoHunt= {
    run: function(spawn){
        if(spawn.spawning) return -3;
        for(id in needHuntList[spawn.name]){
            room=needHuntList[spawn.name][id];
            const role='hunter';
            const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
            if(!spawn.memory.lists[role]) spawn.memory.lists[role]={};
            if(!spawn.memory.lists[role][room]) spawn.memory.lists[role][room]=[];
            for(var id=0;id<maxSpawn[spawn.name][role];id++){
                const listCreep=spawn.memory.lists[role][room][id];
                const Ntemplate=template[spawn.name][role][id];
                if(Ntemplate==null) continue;
                if(listCreep==null||Game.creeps[listCreep]==null||
                    Game.creeps[listCreep].ticksToLive<
                    Game.map.getRoomLinearDistance(spawn.room.name,Game.creeps[listCreep].room.name)*50
                    +Memory.constReactTime+Ntemplate.length*3
                    ){
                    var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+id;
                    if(spawn.spawnCreep(Ntemplate, newName, 
                        {memory: {role: role,spawn:spawn.name,behaviour:id}})==OK){
                            console.log('Spawning new '+upperRole+': ' + newName);
                            spawn.memory.lists[role][room][id]=newName;
                        }
                    return 0;
                }
            }
        }
    }
}
module.exports = autoHunt;