const needHuntList={
    'Spawn2':[{roomName:'W45N34',target:0}],
};
const consts = require('consts');
const maxSpawn=consts.maxSpawn;
const template=consts.template;

var autoHunt= {
    run: function(spawn){
        if(spawn.spawning) return -3;
        for(ob in needHuntList[spawn.name]){
            console.log(ob);
            var room=needHuntList[spawn.name][ob].roomName;
            var target=needHuntList[spawn.name][ob].target;
            const role='hunter';
            const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
            if(!spawn.memory.lists[role]) spawn.memory.lists[role]={};
            if(!spawn.memory.lists[role][room]) spawn.memory.lists[role][room]=[];
            if(!spawn.memory.lists[role][room][target]) spawn.memory.lists[role][room][target]=[];
            for(var id=0;id<maxSpawn[spawn.name][role];id++){
                const listCreep=spawn.memory.lists[role][room][target][id];
                const Ntemplate=template[spawn.name][role][id];
                if(Ntemplate==null) continue;
                console.log(id,listCreep,Ntemplate);
                if(listCreep==null||Game.creeps[listCreep]==null||
                    Game.creeps[listCreep].ticksToLive<
                    Game.map.getRoomLinearDistance(spawn.room.name,Game.creeps[listCreep].room.name)*50
                    +Memory.constReactTime+Ntemplate.length*3
                    ){
                    var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+room+'-'+target+id;
                    var ret=spawn.spawnCreep(Ntemplate, newName, 
                        {memory: {role: role,spawn:spawn.name,behaviour:id,hunt:needHuntList[spawn.name][ob]}})
                    console.log(newName,ret);
                    if(ret==OK){
                            console.log('Spawning new '+upperRole+': ' + newName);
                            spawn.memory.lists[role][room][target][id]=newName;
                        }
                    return 0;
                }
            }
        }
    }
}
module.exports = autoHunt;