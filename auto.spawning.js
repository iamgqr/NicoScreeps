const maxSpawn={
    harvester           :2,
    supporter           :2,
    upgrader            :1,
    dismantler          :1,
    minecart            :5,
    distantHarvester    :3,
    carrier             :3,
    repairer            :3,
    builder             :1,
    defender            :4,
};
const template={
    harvester:[
        [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,MOVE],
        [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,MOVE],
    ],
    supporter:[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
    upgrader:[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],//800
    dismantler:[
        [WORK,WORK,MOVE,WORK,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
    ],
    minecart:[
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],//1500
    ],
    distantHarvester:[
        [MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
        [MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
        [MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
    ],//1150
    carrier:[
        [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
    ],//1050
    repairer:[
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,MOVE,MOVE],
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK,MOVE,WORK,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],//1400
        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK,MOVE,WORK,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],//1400
    ],//1200
    builder:[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],//1100
    defender:[WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK],//1240
};
//const templateHarvester=[WORK,WORK,WORK,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
const templateHarvester=[WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,MOVE];
const templateSupporter=[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
const templateUpgrader=[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];//800
const templateDismantler=[WORK,WORK,MOVE,WORK,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE];
const templateMinecart=[CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
const templateMinecartX=[CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
const templateMinecartXX=[CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];//1150
const templateDistantHarvester=[MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK];//1150
//const templateLargeDistantHarvester=[MOVE,CARRY,CARRY,MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,CARRY];
const templateCarrier=[CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE];//1050
const templateRepairer=[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,MOVE,MOVE];//1200
const templateDistantRepairer=[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];//1000
const templateBuilder=[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];//1100
const templateDefender=[WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK];//1240

var autoSpawning = {
    spawnA: function(spawn,role){
        if(spawn.memory.lists==undefined) spawn.memory.lists={};
        if(spawn.memory.lists[role]==undefined) spawn.memory.lists[role]={};
        const upperRole=role.substr(0,1).toUpperCase()+role.substr(1);
        for(var id=0;id<maxSpawn[role];id++){
            const listCreep=spawn.memory.lists[role][id];
            const Ntemplate=template[role][id];
            if(listCreep==null||Game.creeps[listCreep]==null||
                Game.creeps[listCreep].ticksToLive<
                Game.map.getRoomLinearDistance(spawn.room.name,Game.creeps[listCreep].room.name)*50
                +Memory.constReactTime+Ntemplate.length*3
                ){
                var newName = upperRole + Game.time+'-'+id;
                if(spawn.spawnCreep(Ntemplate, newName, 
                    {memory: {role: role,behaviour:id}})==OK){
                        console.log('Spawning new '+upperRole+': ' + newName);
                        spawn.memory.lists[role][id]=newName;
                    }
                return 0;
            }
        }
    },
    run: function(spawn){
        if(spawn.spawning) {
            spawn.spawning.setDirections([BOTTOM_RIGHT,BOTTOM_LEFT,TOP_LEFT]);
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, 
                spawn.pos.y, 
                {align: 'left', opacity: 0.8}).text(
                '📝️' + spawningCreep.name,
                spawn.pos.x + 1, 
                spawn.pos.y + 1, 
                {align: 'left', opacity: 0.8});
        }
        if(!spawn.spawning) {
            if(this.spawnA(spawn,'harvester')!=undefined) return 0;
            
            
            var supporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'supporter');
            //console.log('Harvesters: ' + harvesters.length);
        
            if(supporters.length < maxSpawn['supporter']) {
                var newName = 'Supporter' + Game.time;
                if(spawn.spawnCreep(templateSupporter, newName, 
                    {memory: {role: 'supporter',behaviour:Math.round(Math.random())}})==OK){
                        console.log('Spawning new supporter: ' + newName);
                    }
                return 1;
            }
            
            
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        
            if(Math.random()>0.6) if(upgraders.length < maxSpawn['upgrader']) {
                var newName = 'Upgrader' + Game.time;
                if(spawn.spawnCreep(templateUpgrader, newName, 
                    {memory: {role: 'upgrader',behaviour:Math.round(Math.random())}})==OK){
                        console.log('Spawning new upgrader: ' + newName);
                    }
                return 2;
            }
            
            if(this.spawnA(spawn,'dismantler')!=undefined) return 3;
            
            if(Math.random()>0.6){
                if(this.spawnA(spawn,'minecart')!=undefined) return 4;
            }
            else{
                if(this.spawnA(spawn,'distantHarvester')!=undefined) return 5;
            }
            
            if(_.filter(Game.creeps, (creep) => creep.memory.role == 'distantHarvester').length<maxSpawn['distantHarvester']||
               _.filter(Game.creeps, (creep) => creep.memory.role == 'minecart').length<maxSpawn['minecart'])
                return 5;
            
            //if(Math.random()>0.6) 
            if(this.spawnA(spawn,'carrier')!=undefined) return 6;
            
            
            if(Math.random()>0.3)
                if(this.spawnA(spawn,'repairer')!=undefined) return 7;
            
            
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        
            if(Math.random()>0.3) if(builders.length < maxSpawn['builder']) {
                var beh=Math.round(Math.random());
                var newName = 'Builder' + Game.time + '-'+beh;
                if(spawn.spawnCreep(templateBuilder, newName, 
                    {memory: {role: 'builder',behaviour:beh}})==OK){
                        console.log('Spawning new builder: ' + newName);
                    }
                return 8;
            }
            
            
            var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        
            if(Math.random()>0.3) if(defenders.length < maxSpawn['defender']) {
                var beh=Math.round(Math.random());
                var newName = 'Defender' + Game.time + '-'+beh;
                if(spawn.spawnCreep(templateDefender, newName, 
                    {memory: {role: 'defender',behaviour:beh}})==OK){
                        console.log('Spawning new defender: ' + newName);
                    }
                return 9;
            }
            
            
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        
            if(Math.random()>0.9) if(upgraders.length < 6) {
                var newName = 'Upgrader' + Game.time;
                if(spawn.spawnCreep(templateUpgrader, newName, 
                    {memory: {role: 'upgrader',behaviour:Math.round(Math.random())}})==OK){
                        console.log('Spawning new upgrader: ' + newName);
                    }
                return 10;
            }
            return 9999;
            //return run();
        }
        else return -9999;
    }
}
module.exports=autoSpawning;
