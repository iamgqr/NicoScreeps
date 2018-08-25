var roleVisualizer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.targetRoomPos.roomName=='W42N32'){
            if(creep.room.name=='W42N33'){creep.moveTo(22,49,{reusePath:20});return;}
        }
        if(creep.memory.targetRoomPos.roomName=='W42N31'){
            if(creep.room.name=='W42N33'){creep.moveTo(22,49,{reusePath:20});return;}
            if(creep.room.name=='W42N32'){creep.moveTo(13,49,{reusePath:20});return;}
        }
        if(creep.memory.targetRoomPos.roomName=='W41N32'){
            if(creep.room.name=='W42N33'){creep.moveTo(22,49,{reusePath:20});return;}
            if(creep.room.name=='W42N32'){creep.moveTo(49,14,{reusePath:20});return;}
        }
        if(creep.memory.targetRoomPos.roomName=='W43N33'){
            if(creep.room.name=='W42N33'){creep.moveTo(0,23,{reusePath:20});return;}
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

module.exports = roleVisualizer;