
var setRoom = require('function.setRoom');
const NicoMsg="にっこにっこにー☆";

var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(setRoom(creep,creep.memory.targetRoomPos.roomName,{ignoreRoads:true,ignoreCreeps:false,reusePath:20})==0) return;
        
        const target = creep.room.controller;
        if(target) {
            if(target.owner){
                var ret=creep.attackController(target);
                if(ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:20});
                    return;
                }
                else if(ret==OK) return;
            }
            var ret=creep.reserveController(target);
            if(ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},reusePath:20});
            }
            else if(!creep.room.controller.sign||creep.room.controller.sign.username!='iamgqr') creep.signController(creep.room.controller,NicoMsg);
        }
        return 0;
	}
};

module.exports = roleClaimer;