const consts = require('consts');
const template=consts.template;
const maxSpawn=consts.maxSpawn;

const profiler = require('screeps-profiler');
var autoRenew=function(creep){
    //return;
    if(creep.memory.behaviour>=template[creep.memory.spawn][creep.memory.role].length) return;
    if(!_.isEqual(_.map(creep.body,'type'),template[creep.memory.spawn][creep.memory.role][creep.memory.behaviour])) return;
    if(Game.spawns[creep.memory.spawn].memory.lists[creep.memory.role]&&Game.spawns[creep.memory.spawn].memory.lists[creep.memory.role][creep.memory.behaviour]!=creep.name){
        if(Game.creeps[Game.spawns[creep.memory.spawn].memory.lists[creep.memory.role][creep.memory.behaviour]]
            &&!Game.creeps[Game.spawns[creep.memory.spawn].memory.lists[creep.memory.role][creep.memory.behaviour]].spawning
            &&Game.creeps[Game.spawns[creep.memory.spawn].memory.lists[creep.memory.role][creep.memory.behaviour]].pos.inRangeTo(creep.pos,10)) creep.suicide();
        return;
    }
    var spawn = Game.spawns[creep.memory.spawn];
    if(!spawn) return;
    if(creep.room.name!=spawn.room.name) return;
    var range=Game.map.getRoomLinearDistance(spawn.room.name,creep.room.name)*50+Memory.constReactTime*2+template[creep.memory.spawn][creep.memory.role][creep.memory.behaviour].length*3;
    if(creep.ticksToLive<=range||(Game.time-creep.memory.needRenew<=creep.body.length*2&&creep.ticksToLive<=1500-Math.floor(600/creep.body.length))){
        //console.log(creep.name,'A');
        if(creep.ticksToLive<=range) creep.memory.needRenew=Game.time;
        creep.say('🔄 renew');
        if(!spawn.spawning||spawn.spawning.remainingTime<=range*1.2){
            //console.log(creep.name,'B');
            if(!creep.pos.inRangeTo(spawn,4)){
                //console.log(creep.name,'C');
                creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'}});
            }
            else{
                //console.log(creep.name,'D');
                if(spawn.memory.needRenew.name==creep.name&&spawn.memory.needRenew.time>=Game.time-1){
                    //console.log(creep.name,'E');
                    if(!creep.pos.inRangeTo(spawn,1)) creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffff66'},reusePath:0});
                    spawn.renewCreep(creep);
                    var renewingCreepName = creep.name;
                    if(spawn.pos.x>30){
                        spawn.room.visual.text(
                            renewingCreepName+' 🔄',
                            spawn.pos.x - 1, 
                            spawn.pos.y-1, 
                            {align: 'right', opacity: 0.8});
                    }else{
                        spawn.room.visual.text(
                            '🔄 ' + renewingCreepName,
                            spawn.pos.x + 1, 
                            spawn.pos.y-1, 
                            {align: 'left', opacity: 0.8});
                    }
                    spawn.memory.needRenew={time:Game.time,name:creep.name};
                }
                else if(spawn.memory.needRenew.time<Game.time-1){
                    //console.log(creep.name,'E');
                    console.log('Renewing creep '+creep.name);
                    spawn.memory.needRenew={time:Game.time,name:creep.name};
                }
            }
            return 1;
        }
        //console.log(creep.name,'F');
        if(spawn.memory.needRenew.name==creep.name&&Game.time-creep.memory.needRenew<=creep.body.length*2&&creep.ticksToLive<=1500-Math.floor(600/creep.body.length)) return 2;
    }
    else{
        if(creep.memory.needRenew) delete creep.memory.needRenew;
    }
};
module.exports = profiler.registerFN(autoRenew, 'autoRenew');