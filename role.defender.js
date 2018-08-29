const BEHAVIOUR_INITIATIVE=0;
const BEHAVIOUR_PASSIVE=1;
var findEnemy = require('function.findEnemy');

var roleDefender={
    run:function(creep){
        var target = findEnemy(creep);
        if(!target){
            for(i in creep.carry) if(i!=RESOURCE_ENERGY){
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }
                });
                if(creep.transfer(target, i) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            if(creep.carry.energy) return -1;
            var target=creep.pos.findClosestByRange(FIND_TOMBSTONES,{filter:object=>_.sum(object.store)&&object.creep.owner.username!='iamgqr'});
            if(!target) return -1;
            for(i in target.store){
                if(creep.withdraw(target,i)==ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
            return;
        }
        // if(creep.room.name!='W42N33'){
        //     creep.moveTo(new RoomPosition(22,22,'W42N33'));
        //     return -1;
        // }
        creep.drop(RESOURCE_ENERGY);
        if(creep.attack(target) !=OK) {
            if(creep.rangedAttack(target) !=OK)
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'},ignoreRoads:true,reusePath:0});
            else{
                creep.moveTo(creep.pos.findClosestByRange(FIND_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_RAMPART})
                    , {visualizePathStyle: {stroke: '#ff00aa'},ignoreRoads:true,reusePath:0});
                //creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ff00aa'},ignoreRoads:true,reusePath:1});
            }
        }
        return 0;
        /*
        if(creep.room.name=='W42N33')creep.moveTo(15,49);
        if(creep.room.name=='W42N32'){
            var target=Game.getObjectById('5b7433b7a6eaf86b8009d83c');
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00aa'}});
                }
            }
        }*/
    }
}
module.exports=roleDefender;