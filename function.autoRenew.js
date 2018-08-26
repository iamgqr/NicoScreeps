
module.exports = function(creep){
    
    var spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            var range=Game.map.getRoomLinearDistance(structure.room.name,creep.room.name)*50+Memory.constReactTime;
            return (structure.structureType == STRUCTURE_SPAWN) &&
                (!structure.spawning||structure.spawning.remainingTime<=range);
        }
    });
    if(creep.ticksToLive<300||Game.time-creep.memory.needRenew<=creep.body.length*2){
        if(spawn){
            if(!creep.pos.inRangeTo(spawn,3)){
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'}});
            }
            else{
                if(spawn.memory.needRenew.time!=Game.time){
                    if(!creep.pos.inRangeTo(spawn,1)) creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'}});
                    spawn.renewCreep(creep);
                    var renewingCreepName = creep.name;
                    spawn.room.visual.text(
                        '🔄 ' + renewingCreepName,
                        spawn.pos.x + 1, 
                        spawn.pos.y-1, 
                        {align: 'left', opacity: 0.8});
                    console.log('Renewing creep '+renewingCreepName);
                }
            }
            spawn.memory.needRenew={time:Game.time,name:creep.name};
        }
        if(creep.ticksToLive<300) creep.memory.needRenew=Game.time;
        return 1;
    }
};