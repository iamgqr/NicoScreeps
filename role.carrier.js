const begins=[
    '5b7b7822f988e516d4910c38',
    '5b7b7822f988e516d4910c38',
    '5b7e90310d26b75669679479',
];
const ends=[
    '5b7d7dd63d193b0277cc1af4',
    '5b7d7dd63d193b0277cc1af4',
    '5b7d7dd63d193b0277cc1af4',
];

var roleCarrier = {
    run:function(creep){
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 begin');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
            creep.say('🔄 end');
	    }
        if(creep.room.name!='W42N33'){
            creep.moveTo(new RoomPosition(22,22,'W42N33'));
            return -2;
        }
        var target = Game.getObjectById(ends[creep.memory.behaviour]);
        var source = Game.getObjectById(begins[creep.memory.behaviour]);
        if(creep.memory.working) {
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) != ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    return;
                }
                if(!creep.pos.isEqualTo(target.pos))
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	    else {
            if(source) {
                if(source.store[RESOURCE_ENERGY]>=creep.carryCapacity-_.sum(creep.carry)){
                    if(creep.withdraw(source,RESOURCE_ENERGY)!=ERR_NOT_IN_RANGE){
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                }
                if(!creep.pos.isEqualTo(source.pos))
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        return 0;
    }
};
module.exports=roleCarrier;
