const consts = require('consts');
const positList=consts.visualizer.positList;

var findEnemy = require('function.findEnemy');

var setRoom = require('function.setRoom');

var roleVisualizer = {
    run: function(creep) {
        var targx,targy;
        /*if(Math.random()<0.5)
            creep.say(Math.random()<0.5?'Visualizer':'Don\'t kill.',{public:true});
        else
            creep.say(Math.random()<0.5?'Nonhostile':'Please QAQ',{public:true});*/
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
        
        if(setRoom(creep,creep.memory.targetRoomPos.roomName,{ignoreRoads:true,reusePath:20})==0) return;
        
        var target = findEnemy(creep);
        if(target) {
            creep.room.memory.dangerMode=1;
            creep.rangedAttack(target);
            if(creep.attack(target) != OK){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},ignoreRoads:true,reusePath:20});
            }
        }
        else{
            creep.room.memory.dangerMode=0;
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