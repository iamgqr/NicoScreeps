const consts = require('consts');
const positList=consts.visualizer.positList;

var findEnemy = require('function.findEnemy');

var roleVisualizer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targx,targy;
        /*if(Math.random()<0.5)
            creep.say(Math.random()<0.5?'Visualizer':'Don\'t kill.',{public:true});
        else
            creep.say(Math.random()<0.5?'Nonhostile':'Please QAQ',{public:true});*/
        /*
        if(creep.memory.targetRoomPos.roomName=='W42N32'){
            if(creep.room.name=='W42N33'){creep.moveTo(22,49,{reusePath:5});return;}
            if(creep.room.name=='W42N32')targx=14,targy=5;
        }
        if(creep.memory.targetRoomPos.roomName=='W42N31'){
            if(creep.room.name=='W42N33'){creep.moveTo(22,49,{reusePath:5});return;}
            if(creep.room.name=='W42N32'){creep.moveTo(13,49,{reusePath:20});return;}
            if(creep.room.name=='W42N31')targx=12,targy=4;
        }
        if(creep.memory.targetRoomPos.roomName=='W41N32'){
            if(creep.room.name=='W42N33'){creep.moveTo(22,49,{reusePath:5});return;}
            if(creep.room.name=='W42N32'){creep.moveTo(49,4,{reusePath:20});return;}
            if(creep.room.name=='W41N32')targx=1,targy=2;
        }
        if(creep.memory.targetRoomPos.roomName=='W43N33'){
            if(creep.room.name=='W42N33'){creep.moveTo(0,23,{reusePath:5});return;}
            if(creep.room.name=='W43N33')targx=47,targy=25;
        }
        if(creep.memory.targetRoomPos.roomName=='W43N34'){
            if(creep.room.name=='W42N33'){creep.moveTo(0,23,{reusePath:5});return;}
            if(creep.room.name=='W43N33'){creep.moveTo(41,0,{reusePath:20});return;}
            if(creep.room.name=='W43N34')targx=47,targy=25;
        }
        */
        for(i in creep.carry) if(i!=RESOURCE_ENERGY){
            var target = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE);
                }
            })[0];
            if(creep.transfer(target, i) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return;
        }
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
        var target = findEnemy(creep);
        //target=Game.getObjectById('5b821b3fa9b3d711efa5d115');
        //target=null;
        if(target) {
            Memory.dangerMode[creep.memory.targetRoomPos.roomName]=1;
            creep.rangedAttack(target);
            if(creep.attack(target) != OK){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},ignoreRoads:true,reusePath:20});
                //;//creep.moveTo(targx,targy, {visualizePathStyle: {stroke: '#ff00aa'},ignoreRoads:true,reusePath:20});
            }
        }
        else{
            Memory.dangerMode[creep.memory.targetRoomPos.roomName]=0;
            if(creep.hits<creep.hitsMax&&creep.heal(creep)==OK){
                return;
            }
            
            var target=creep.pos.findClosestByRange(FIND_TOMBSTONES,{filter:object=>_.sum(object.store)&&object.creep.owner.username!='iamgqr'});
            if(target){
                for(i in target.store){
                    if(creep.withdraw(target,i)==ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                }
            }
            else creep.moveTo(positList[creep.memory.spawn][creep.memory.targetRoomPos.roomName], {visualizePathStyle: {stroke: '#ff00aa'},ignoreRoads:true,reusePath:20});
        }
        return 0;
	}
};

module.exports = roleVisualizer;