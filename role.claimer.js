var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.targetRoomPos.roomName!=creep.room.name){
            var exit=Game.map.findRoute(creep.room.name,creep.memory.targetRoomPos.roomName)[0];
            if(exit){
                var exit=creep.pos.findClosestByPath(exit.exit);
                var reuse=20;
                if(creep.room.name=='W42N33') reuse=5;
                else{
                    var crp = creep.pos.findInRange(FIND_CREEPS,2,
                        {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'})[0];
                    if(crp) reuse=0;
                }
                creep.moveTo(exit, {ignoreRoads:true,reusePath:reuse});
            }
            return;
        }
        const target = creep.room.controller;
        if(target) {
            var ret=creep.reserveController(target);
            if(ret == ERR_NOT_IN_RANGE) {
                var reuse=20;
                if(creep.room.name=='W42N33') reuse=2;
                else{
                    var crp = creep.pos.findInRange(FIND_CREEPS,2,
                        {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'})[0];
                    if(crp) reuse=0;
                }
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:20});
            }
            if(ret == OK){
                if(creep.memory.targetRoomPos.roomName=='W42N32')creep.move(TOP);
            }
        }
        return 0;
        /*
        if(creep.room.name=='W42N32'){creep.moveTo(49,4);return;}
        //if(creep.room.name=='W42N33'){creep.moveTo(17,0);return;}
        const target = creep.room.controller;
        if(target) {
            if(creep.claimController(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'}});
            }
        }*/
        return 0;
	}
};

module.exports = roleClaimer;