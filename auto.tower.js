
 var findEnemy = require('function.findEnemy');

module.exports = {
    run:function(tower){
        if(Game.spawns['Spawn1'].memory.towerEnergyLow<Game.time&&tower.energy*3<tower.energyCapacity){
            Game.spawns['Spawn1'].memory.towerEnergyLow=Game.time;
        }
        var target = findEnemy(tower);
        if(target) {
            tower.attack(target);
            return 1;
        }
        target = tower.pos.findClosestByRange(FIND_MY_CREEPS,{filter: creep => creep.hitsMax!=creep.hits});
        if(target) {
            tower.heal(target);
            return 1;
        }
        var targets = tower.room.find(FIND_STRUCTURES, {
            filter: object => (object.structureType==STRUCTURE_ROAD||object.structureType==STRUCTURE_RAMPART||object.structureType==STRUCTURE_CONTAINER)
            //&& object.hitsMax-object.hits>=200
            && (object.owner==undefined||object.owner.username=='iamgqr')
        });
        targets.sort((a,b) =>
            a.hits/(a.structureType.length-3)/(a.structureType.length-3)-b.hits/(b.structureType.length-3)/(b.structureType.length-3)
        );
        target=targets[0];
        if(target){
            if(target.hitsMax-target.hits>=600){//.structureType==STRUCTURE_ROAD){
                tower.repair(target);
            }
            //else if(Math.random()<0.3) tower.repair(target);
        }
    }
};