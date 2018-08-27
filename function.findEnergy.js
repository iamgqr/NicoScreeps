
module.exports = {
    findEnergy:function(creep){
        var source = null;// creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        var container= creep.pos.findClosestByRange(FIND_STRUCTURES,
            {filter:object => (object.structureType==STRUCTURE_CONTAINER||
                object.structureType==STRUCTURE_STORAGE)&&object.store.energy*2>=creep.carryCapacity-_.sum(creep.carry)});
        if(creep.room.name=='W45N33'){
        container= creep.pos.findClosestByRange(FIND_STRUCTURES,
            {filter:object => (object.structureType==STRUCTURE_CONTAINER||object.structureType==STRUCTURE_STORAGE)&&object.store.energy});
        source= creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        }
        var link = creep.pos.findInRange(FIND_STRUCTURES,3,
            {filter:object => object.structureType==STRUCTURE_LINK&&object.energy})[0];
        var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
            {filter:object => object.resourceType==RESOURCE_ENERGY&&object.amount>20});
        var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES,
            {filter:object => object.store.energy});
        var targets=[source,container,link,resource,tombstone];
        targets.sort(
            function(a,b){
                if(a==null&&b==null) return 0;
                if(b==null) return -1;
                if(a==null) return 1;
                return a.pos.getRangeTo(creep.pos)>b.pos.getRangeTo(creep.pos)?1:-1;
            }
            );
        if(targets[0]==null){
            return -1;
        }
        if(targets[0].deathTime!=null||targets[0].structureType==STRUCTURE_CONTAINER||targets[0].structureType==STRUCTURE_STORAGE||targets[0].structureType==STRUCTURE_LINK){
            //console.log(creep.name+' : Go to container/tombstone : ' + targets[0].id);
            if(creep.withdraw(targets[0],RESOURCE_ENERGY)!=ERR_NOT_IN_RANGE){
                if(targets[0].store&&targets[0].store.energy>=creep.carryCapacity-_.sum(creep.carry)) return 0;
                if(targets[0].energy&&targets[0].energy>=creep.carryCapacity-_.sum(creep.carry)) return 0;
                
                return 2;
            }
        }
        else if(targets[0].ticksToRegeneration!=null){
            //console.log(creep.name+' : Go to source : ' + targets[0].id);
            if(creep.harvest(targets[0])!=ERR_NOT_IN_RANGE){
                return 2;
            }
        }
        else{
            //console.log(creep.name+' : Go to resource : ' + targets[0].id);
            if(creep.pickup(targets[0])!=ERR_NOT_IN_RANGE){
                return 0;
            }
        }
        
        var reuse=7;
        if(creep.pos.inRangeTo(targets[0],3)) reuse=0;
        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'},reusePath:reuse});
        return 1;
    }
};