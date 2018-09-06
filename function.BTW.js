const profiler = require('screeps-profiler');
var BTW=function(creep,type=RESOURCE_ENERGY){
    var done=0;
    var tombstone = creep.pos.findInRange(FIND_TOMBSTONES,1,{filter:object=>object.store[type]});
    if(tombstone[0]!=null&&_.sum(creep.carry)<creep.carryCapacity){
        creep.withdraw(tombstone[0],type);
        done=1;
    }
    var resource = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter:object=>object.resourceType==type});
    if(resource[0]!=null&&_.sum(creep.carry)<creep.carryCapacity){
        creep.pickup(resource[0]);
        done=1;
    }
    return done;
};
module.exports = profiler.registerFN(BTW, 'BTW');