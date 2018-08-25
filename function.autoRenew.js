/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('function.autoRenew');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    autoRenew:function(creep){
        var spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN) &&
                    (!structure.spawning||structure.spawning.remainingTime<=creep.pos.getRangeTo(spawn));
            }
        });
        if(creep.ticksToLive<300||Game.time-creep.memory.needRenew<=creep.body.length*2){
            if(spawn){
                if(!creep.pos.inRangeTo(spawn,1)){
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'}});
                }
                spawn.renewCreep(creep);
                spawn.memory.needRenew={time:Game.time,name:creep.name};
            }
            if(creep.ticksToLive<300) creep.memory.needRenew=Game.time;
            return 1;
        }
    }
};