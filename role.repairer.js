const BEHAVIOUR_NEAREST=0;
const BEHAVIOUR_FIRST=1;

const consts = require('consts');
const targetRoom=consts.repairer.targetRoom;

var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
var avoidRoads = require('function.avoidRoads');
var BTW = require('function.BTW');
var setRoom = require('function.setRoom');
var sigmoid=function(a,b,c){
    return 1.0/(1.0+Math.exp((a-b)/c))
}
var roleRepairer= {
    getValue:creep => a =>
        a?(a.hits-sigmoid(Math.max(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y))+
        0.1*Math.min(Math.abs(a.pos.x-creep.pos.x),Math.abs(a.pos.y-creep.pos.y)),6.0,1.0)*3000):525252525
    ,
    toggleStatus:function(creep,working){
        if(creep.memory.working!=working){
	        creep.memory.working=working;
            creep.say(working?'🔧 repair':'🔄 harvest');
        }
    },
    findTarget:function(creep,role){
        if(!creep.memory.repairerTargetList||Game.time%50==0){
            var targets;
            if(creep.room.find(FIND_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_TOWER}).length==0){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits+300 < object.hitsMax && (!object.owner||object.my) && Memory.dismantleList.indexOf(object.id)==-1
                    //&&object.structureType!=STRUCTURE_ROAD&&object.structureType!=STRUCTURE_CONTAINER
                });
            }
            else if(role=='supporter'){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits+300 < object.hitsMax && (!object.owner||object.my) && Memory.dismantleList.indexOf(object.id)==-1
                    &&object.structureType!=STRUCTURE_ROAD&&object.structureType!=STRUCTURE_CONTAINER&&object.pos.findInRange(FIND_STRUCTURES,1, {
                        filter: object => object.structureType==STRUCTURE_EXTENSION||object.structureType==STRUCTURE_SPAWN}).length!=0
                });
            }
            else{
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits+300 < object.hitsMax && (!object.owner||object.my) && Memory.dismantleList.indexOf(object.id)==-1
                    &&object.structureType!=STRUCTURE_ROAD&&object.structureType!=STRUCTURE_CONTAINER&&object.pos.findInRange(FIND_STRUCTURES,1, {
                        filter: object => object.structureType==STRUCTURE_EXTENSION||object.structureType==STRUCTURE_SPAWN}).length==0
                });
            }
            targets=_.slice(_.sortBy(targets,this.getValue(creep),this),0,8);
            creep.memory.repairerTargetList=_.map(targets,"id");
            return targets;
        }
        else return _.map(creep.memory.repairerTargetList,Game.getObjectById);
    },
    moveWork:function(creep,role='repairer'){
        if(Game.time-creep.room.memory.towerEnergyLow<20){
	        var towers = creep.room.find(FIND_MY_STRUCTURES, {
                filter: object => object.structureType==STRUCTURE_TOWER&&object.energy*4<object.energyCapacity*3
            });
            if(towers.length){
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#00aaff'},range:1});
                }
                return 0;
            }
        }
        
        var targets=this.findTarget(creep,role);
        var target=_.min(targets,this.getValue(creep),this);
        //console.log(creep.name,targets[0]);
        if(target) {
            var ret=creep.repair(target);
            if(ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00aaff'},reusePath:5,ignoreRoads:false,range:3});
                return;
            }
            if(ret==OK){
                avoidRoads(creep);
            }
            return;
        }
        else{
            return -1;
        }
    },
    run: function(creep) {
        //var behaviourDistant=creep.memory.behaviour>=1&&creep.memory.spawn=='Spawn1';
	    if(creep.carry.energy == 0)
	        this.toggleStatus(creep,false);
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity)
	        this.toggleStatus(creep,true);
	    
	    BTW(creep);
	    
        if(creep.room.find(FIND_STRUCTURES,{filter:object=>object.structureType==STRUCTURE_TOWER}).length==0){
            if(creep.working){
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
            }
        }
        
	    if(creep.memory.working) {
	        if(setRoom(creep,targetRoom[creep.memory.spawn][creep.memory.behaviour])==0) return;
	        return this.moveWork(creep);
	    }
	    else {
	        if(autoRenew(creep)) return;
	        delete creep.memory.repairerTargetList;
	        var ret=findEnergy(creep);
            if(ret==0){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00aaff'}});
            }
            else if(ret==-1){
                if(setRoom(creep,Game.spawns[creep.memory.spawn].room.name)==0) return;
            }
	    }
	    return 0;
	}
};

module.exports = roleRepairer;