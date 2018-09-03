const consts = require('consts');
const maxSpawn=consts.maxSpawn;
const template=consts.template;

var autoBattleGroup= {
    run: function(spawn){
        if(spawn.spawning){spawn.spawning.setDirections([BOTTOM,LEFT,BOTTOM_RIGHT,TOP_LEFT,TOP_RIGHT]); return -3;}
        for(bh in [0]){
            const role='battleGroup';
            const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
            if(!spawn.memory.lists[role]) spawn.memory.lists[role]={};
            if(!spawn.memory.lists[role][bh]) spawn.memory.lists[role][bh]=[];
            for(var id=0;id<4;id++){
                const listCreep=spawn.memory.lists[role][bh][id];
                if(!template[spawn.name][role]) return;
                const Ntemplate=template[spawn.name][role][id];
                if(Ntemplate==null) continue;
                if(listCreep==null||Game.creeps[listCreep]==null||
                    Game.creeps[listCreep].ticksToLive<
                    Game.map.getRoomLinearDistance(spawn.room.name,Game.creeps[listCreep].room.name)*50
                    +Memory.constReactTime+Ntemplate.length*3
                    ){
                    var newName = upperRole + Game.time+'_'+spawn.name.substring(5)+'-'+id;
                    if(spawn.spawnCreep(Ntemplate, newName, 
                        {memory: {role: role,spawn:spawn.name,behaviour:bh}})==OK){
                            console.log('Spawning new '+upperRole+': ' + newName);
                            spawn.memory.lists[role][bh][id]=newName;
                        }
                    return 0;
                }
            }
        }
    }
}
module.exports = autoBattleGroup;