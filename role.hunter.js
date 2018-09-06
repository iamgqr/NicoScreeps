const consts = require('consts');
const sourceList=consts.hunter.sourceList;
const positList=consts.hunter.positList;
const lairList=consts.hunter.lairList;
var findEnergy = require('function.findEnergy');
var autoRenew = require('function.autoRenew');
var BTW = require('function.BTW');
var roleDistantHarvester = require('role.distantHarvester');
//for(room in Game.rooms){var a=Game.rooms[room].find(FIND_STRUCTURES,{filter:s=>s.structureType==STRUCTURE_CONTAINER&&s.hits<=240000});if(a.length!=0) console.log(room,"ERROR")}


var roleHunter={
    run:function(creep){
        //return;
        var posit=positList[creep.memory.spawn][creep.memory.hunt.roomName][creep.memory.hunt.target];
        var source=Game.getObjectById(sourceList[creep.memory.spawn][creep.memory.hunt.roomName][creep.memory.hunt.target]);
        var lair=Game.getObjectById(lairList[creep.memory.spawn][creep.memory.hunt.roomName][creep.memory.hunt.target]);
        if(creep.memory.behaviour==2){
            //return;
            BTW(creep);
            return roleDistantHarvester.moveWork(creep,posit,source);
        }
        else{
            //if(creep.memory.behaviour==0)return;
            var company=Game.creeps[Game.spawns[creep.memory.spawn].memory.lists['hunter'][creep.memory.hunt.roomName][creep.memory.hunt.target][1-creep.memory.behaviour]];
            console.log(company);
            if(!creep.pos.inRangeTo(posit,5)){
                if(company&&!company.spawning)
                    creep.moveTo(posit, {visualizePathStyle: {stroke: '#ffaa00'},reusePath:5,ignoreCreeps:true});
                return;
            }
            if(!lair) return;
            var SK=creep.pos.findClosestByRange(FIND_CREEPS,{filter:c=>c.name=='Keeper'+lair.id});
            if(SK){
                creep.attack(SK);
                creep.moveTo(SK,{reusePath:0});
            }
            else{
                if(creep.getActiveBodyparts(HEAL)!=0){
                    if(creep.hits<creep.hitsMax){
                        creep.heal(creep);
                    }
                    var target=creep.pos.findClosestByRange(FIND_CREEPS,{filter:c=>c.hits<c.hitsMax&&c.memory.hunt&&c.memory.hunt.target==creep.memory.hunt.target});
                    if(target){
                        if(creep.pos.inRangeTo(target,1)) creep.heal(target);
                        else creep.moveTo(target,{range:1,reusePath:0});
                        return;
                    }
                }
                creep.moveTo(lair);
            }
            return;
        }
    }
};


module.exports=roleHunter;