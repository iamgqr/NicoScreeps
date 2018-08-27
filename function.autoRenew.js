const consts = require('consts');
const template=consts.template;

module.exports = function(creep){
    if(!_.isEqual(creep.body,template[creep.memory.spawn][creep.memory.role][creep.memory.behaviour])) return;
    var spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            var range=Game.map.getRoomLinearDistance(structure.room.name,creep.room.name)*50+Memory.constReactTime;
            return (structure.structureType == STRUCTURE_SPAWN) &&
                (!structure.spawning||structure.spawning.remainingTime<=range);
        }
    });
    if(creep.ticksToLive<300||(Game.time-creep.memory.needRenew<=creep.body.length*2.2&&creep.ticksToLive<=1400)){
        creep.say('🔄 renew')
        if(spawn){
            if(!creep.pos.inRangeTo(spawn,4)){
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'}});
            }
            else{
                if(spawn.memory.needRenew.name==creep.name&&spawn.memory.needRenew.time>=Game.time-1){
                    if(!creep.pos.inRangeTo(spawn,1)) creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'},reusePath:1});
                    spawn.renewCreep(creep);
                    var renewingCreepName = creep.name;
                    spawn.room.visual.text(
                        '🔄 ' + renewingCreepName,
                        spawn.pos.x + 1, 
                        spawn.pos.y-1, 
                        {align: 'left', opacity: 0.8});
                    spawn.memory.needRenew={time:Game.time,name:creep.name};
                }
                else if(spawn.memory.needRenew.time<Game.time-1){
                    console.log('Renewing creep '+creep.name);
                    spawn.memory.needRenew={time:Game.time,name:creep.name};
                }
            }
        }
        if(creep.ticksToLive<300) creep.memory.needRenew=Game.time;
        return 1;
    }
    else{
        if(creep.memory.needRenew) delete creep.memory.needRenew;
    }
};