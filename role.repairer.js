const BEHAVIOUR_NEAREST=0;
const BEHAVIOUR_FIRST=1;
var findEnergy = require('function.findEnergy');

var roleRepairer= {
    /** @param {Creep} creep **/
    run: function(creep) {
        var behaviourDistant=creep.memory.behaviour>=1;
	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.say('🔧 repair');
	    }
        if(!behaviourDistant)if(creep.room.name!='W42N33'){
            creep.moveTo(new RoomPosition(22,22,'W42N33'));
            return -2;
        }
        else{
            var tombstone = creep.pos.findInRange(FIND_TOMBSTONES,1,{filter:object=>object.store.energy});
            if(tombstone[0]!=null){
                creep.withdraw(tombstone[0],RESOURCE_ENERGY);
            }
            var resource = creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter:object=>object.resourceType==RESOURCE_ENERGY});
            if(resource[0]!=null){
                creep.pickup(resource[0]);
            }
        }
        targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax && (object.owner==undefined||object.owner.username=='iamgqr') && Memory.dismantleList.indexOf(object.id)==-1
            &&object.structureType!=STRUCTURE_ROAD
        });
        sigmoid=function(a,b,c){
            return 1.0/(1.0+Math.exp((a-b)/c))
        }
        targets.sort((a,b) =>
        a.hits-b.hits
        -
         (
         sigmoid(Math.max(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))+
         0.1*Math.min(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y)),6.0,1.0)
         -
         sigmoid(Math.max(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y))+
         0.1*Math.min(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y)),6.0,1.0)
         )*3000
        );
        var target=targets[0];
	    if(creep.memory.working) {
	        if(behaviourDistant){
                if(!creep.memory.roomover&&Math.random()<0.003&&creep.room.name=='W42N32'){
    	            creep.moveTo(creep.pos.findClosestByRange(FIND_EXIT_RIGHT));
	                creep.memory.roomover=true;
	                return;
	            }
	            if(creep.memory.roomover&&Math.random()<0.008&&creep.room.name=='W41N32'){
    	            creep.moveTo(creep.pos.findClosestByRange(FIND_EXIT_LEFT));
	                creep.memory.roomover=false;
	                return;
	            }
	            if(creep.room.name=='W42N33'){
	                creep.moveTo(22,49);
	                return;
	            }
	            if(creep.room.name=='W42N32'&&creep.pos.y==0){
	                creep.moveTo(22,1);
	                return;
	            }
	            if(creep.memory.roomover&&creep.room.name=='W42N32'){
    	            creep.moveTo(creep.pos.findClosestByRange(FIND_EXIT_RIGHT));
	                return;
	            }
	            if(!creep.memory.roomover&&creep.room.name=='W41N32'){
    	            creep.moveTo(creep.pos.findClosestByRange(FIND_EXIT_LEFT));
	                return;
	            }
	        }
	        else if(Game.spawns['Spawn1'].memory.towerEnergyLow){
    	        var towers = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: object => object.structureType==STRUCTURE_TOWER&&object.energy*4<object.energyCapacity*3
                });
                if(towers.length){
                    if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#00aaff'}});
                    }
                }
                return 0;
    	    }
	        if(behaviourDistant){
	            const avoidRoads=function(){
                    var currRoad=_.filter(creep.pos.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD});
                    if(currRoad.length>0){
                        var posup=creep.pos;posup.y--;
                        if(posup.y>0&&posup.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posup.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posup.lookFor(LOOK_CREEPS).length==0){
                            creep.move(TOP);
                            return;
                        }
                        var posright=creep.pos;posright.x++;
                        if(posright.x<49&&posright.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posright.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posright.lookFor(LOOK_CREEPS).length==0){
                            creep.move(RIGHT);
                            return;
                        }
                        var posdown=creep.pos;posdown.y++;
                        if(posdown.y<49&&posdown.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posdown.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posdown.lookFor(LOOK_CREEPS).length==0){
                            creep.move(BOTTOM);
                            return;
                        }
                        var posleft=creep.pos;posleft.x--;
                        if(posleft.x> 0&&posleft.lookFor(LOOK_TERRAIN)!='wall'&&_.filter(posleft.lookFor(LOOK_STRUCTURES),{structureType:STRUCTURE_ROAD}).length==0&&posleft.lookFor(LOOK_CREEPS).length==0){
                            creep.move(LEFT);
                            return;
                        }
                    }
	            };
                var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,
                    {filter:site => site.owner.username=='iamgqr'});
                if(target!=null) {
                    var ret=creep.build(target);
                    if(ret == ERR_NOT_IN_RANGE) {
                        var reuse=6;
                        if(creep.pos.inRangeTo(target,6)) reuse=0;
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'},reusePath:reuse,ignoreRoads:true});
                        return;
                    }
                    if(ret==OK){
                        avoidRoads();
                    }
                    return;
                }
                
	            var targets=['5b7ac8f60dd350179443faf6','5b7a8c817f6c003fc2973a6a','5b7a8fc70d26b7566966180c','5b7a8e71a6eaf86b800c6308','5b7aa00a42840302ab3345c9','5b7aa16cf988e516d490b79d','5b7aa2cbf86f4e0754ce55ec','5b7aa439b513456b50613529','5b7aa3f8b81548407f9281c0','5b7aa34454c0a0179f4da7c1','5b7aa1f0a6eaf86b800c6ae1','5b7a9ec179a8fd3d48f45620','5b7aa4c8ff7a3e3d3c321a8d','5b7aa155d9254b07a91ed1ea','5b7a9fcfe11abe3f9e4364e0','5b7a9e5e47397c41d63e76ca'];
	            var target = Game.getObjectById(targets[targets.length-1]);
                while(target==null&&targets.length){
                    targets.splice(targets.length-1,1);
                    target = Game.getObjectById(targets[targets.length-1]);
                }
                if(target!=null) {
                    var ret=creep.dismantle(target);
                    if(ret == ERR_NOT_IN_RANGE) {
                        var reuse=6;
                        if(creep.pos.inRangeTo(target,6)) reuse=0;
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ccff33'},reusePath:reuse,ignoreRoads:true});
                        //38
                    }
                    if(ret==OK)
                        avoidRoads();
                    return;
                }
	            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: object => object.hitsMax>=object.hits*30  && (object.owner==undefined||object.owner.username=='iamgqr')
                    &&(object.structureType==STRUCTURE_ROAD||object.structureType==STRUCTURE_CONTAINER)
                });
                if(target) {
                    var ret=creep.repair(target);
                    if(ret == ERR_NOT_IN_RANGE) {
                        var crp = creep.pos.findInRange(FIND_CREEPS,2,
                            {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'})[0];
                        var reuse=5;

                        creep.moveTo(target, {visualizePathStyle: {stroke: '#00aaff'},reusePath:reuse,ignoreRoads:true});
                        return;
                    }
                    if(ret==OK){
                        avoidRoads();
                    }
                    return;
                }
	            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: object => object.hitsMax-object.hits >=500  && (object.owner==undefined||object.owner.username=='iamgqr')
                    &&(object.structureType==STRUCTURE_ROAD||object.structureType==STRUCTURE_CONTAINER)
                });
                if(target) {
                    var ret=creep.repair(target);
                    if(ret == ERR_NOT_IN_RANGE) {
                        var crp = creep.pos.findInRange(FIND_CREEPS,2,
                            {filter:object => object.owner.username=='iamgqr'&&object.memory.role=='minecart'})[0];
                        var reuse=5;
                        if(crp) reuse=0;
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#00aaff'},reusePath:reuse,ignoreRoads:true});
                        return;
                    }
                    if(ret==OK){
                        avoidRoads();
                    }
                    return;
                }
                else{
                    if(!creep.memory.roomover&&creep.room.name=='W42N32'){
    	                creep.moveTo(creep.pos.findClosestByRange(FIND_EXIT_RIGHT));
    	                creep.memory.roomover=true;
    	                return;
    	            }
    	            if(creep.memory.roomover&&creep.room.name=='W41N32'){
    	                creep.moveTo(creep.pos.findClosestByRange(FIND_EXIT_LEFT));
    	                creep.memory.roomover=false;
    	                return;
    	            }
                }
                return;
	        }
	        else {
                if(target) {
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#00aaff'}});
                    }
                }
                else{
                    //creep.moveTo(15,17,{visualizePathStyle: {stroke: '#00aaff'}});
                    return -1;
                }
	        }
            /*
            if(creep.memory.behaviour==BEHAVIOUR_FIRST){

            }
            if(creep.memory.behaviour==BEHAVIOUR_NEAREST){
                targets.sort((a,b) =>
                a.hits-b.hits+
                (Math.max(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))+
                0.1*Math.min(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))-
                Math.max(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y))-
                0.1*Math.min(Math.abs(b.pos.x-creep.pos.x),Math.abs(b.pos.y-creep.pos.y)))*300
                );
            }
            */
	    }
	    else {
	        if(behaviourDistant&&creep.room.name!='W42N33'){
	            var container = creep.pos.findInRange(FIND_STRUCTURES,20,
                    {filter:object => (object.structureType==STRUCTURE_CONTAINER)&&object.store.energy>1000})[0];
                if(container){
                    if(creep.withdraw(container,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE)
                        creep.moveTo(container);
                    return;
                }
                
	            var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES,
                    {filter:object => object.store.energy});
                if(tombstone){
                    if(creep.withdraw(tombstone,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE)
                        creep.moveTo(tombstone);
                    return;
                }
                
	            var resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                    {filter:object => object.resourceType==RESOURCE_ENERGY});
                if(resource){
                    if(creep.pickup(resource)==ERR_NOT_IN_RANGE)
                        creep.moveTo(resource);
                    return;
                }
                
	            if(creep.room.name=='W42N32'){
	                creep.moveTo(22,0,{reusePath:2,ignoreRoads:true});
	                return;
	            }
	            if(creep.room.name=='W41N32'){
	                creep.moveTo(0,4);
	                return;
	            }
	        }
            if(findEnergy.findEnergy(creep)==0){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00aaff'}});
            }
            //var target=Game.getObjectById('5b7a5c19b0d0407bcad721fe');
            //if(creep.dismantle(target)==ERR_NOT_IN_RANGE) creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
	    }
	    return 0;
	}
};

module.exports = roleRepairer;