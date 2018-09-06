var roleHarvester = require('role.harvester');
var roleDistantHarvester = require('role.distantHarvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMinecart = require('role.minecart');
var roleRepairer = require('role.repairer');
var roleSupporter = require('role.supporter');
var roleClaimer = require('role.claimer');
var roleDismantler = require('role.dismantler');
var roleDefender = require('role.defender');
var roleVisualizer = require('role.visualizer');
var roleMiner = require('role.miner');
var roleBattleGroup = require('role.battleGroup');
var roleDealer = require('role.dealer');
var roleHunter = require('role.hunter');
var autoSpawning = require('auto.spawning');
var autoVisualize = require('auto.visualize');
var autoReserve = require('auto.reserve');
var autoTower = require('auto.tower');
var autoLink = require('auto.link');
var autoBattleGroup = require('auto.battleGroup');
var autoHunt = require('auto.hunt');
var visualTrack = require('visual.track');

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
const profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
profiler.enable();

profiler.registerClass(roleBuilder, 'builder');
profiler.registerClass(roleRepairer, 'repairer');
profiler.registerClass(roleClaimer, 'claimer');
profiler.registerClass(roleDismantler, 'dismantler');
profiler.registerClass(roleDefender, 'defender');
profiler.registerClass(roleVisualizer, 'visualizer');
profiler.registerClass(roleMiner, 'miner');
profiler.registerClass(roleBattleGroup, 'battleGroup');
profiler.registerClass(roleDealer, 'dealer');
profiler.registerClass(roleHunter, 'hunter');
profiler.registerClass(autoSpawning, 'spawning');
profiler.registerClass(autoVisualize, 'autoVisualize');
profiler.registerClass(autoReserve, 'autoReserve');
profiler.registerClass(autoTower, 'autoTower');
profiler.registerClass(autoLink, 'autoLink');
profiler.registerClass(autoBattleGroup, 'autoBattleGroup');
profiler.registerClass(visualTrack, 'visualTrack');

module.exports.loop = function () {
profiler.wrap(function() {
    var visual=new RoomVisual;
    visual.text(
        Game.time+1,0,1, 
        {align: 'left', color: '#ee99cc', opacity: 0.4, font: '2 Consolas'})
    // var creep=Game.creeps['Dealer9059661_1-0'];
    // creep.moveTo(19,28);
    // if(!Game.getObjectById('5b86bdd147397c41d642cf62').store[RESOURCE_ZYNTHIUM]||Game.getObjectById('5b86bdd147397c41d642cf62').store[RESOURCE_ZYNTHIUM]<60000){
    //     creep.withdraw(Game.getObjectById('5b7d7dd63d193b0277cc1af4'),RESOURCE_ZYNTHIUM,500);
    //     creep.transfer(Game.getObjectById('5b86bdd147397c41d642cf62'),RESOURCE_ZYNTHIUM,500);
    // }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.spawning) continue;
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'distantHarvester') {
            roleDistantHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
                //roleHarvester.run(creep);
        }
        if(creep.memory.role == 'minecart') {
            roleMinecart.run(creep);
        }
        if(creep.memory.role == 'builder') {
            if(roleBuilder.run(creep)==-1){
                //creep.memory.behaviour=0;
                //if(roleSupporter.run(creep)==-1){
                    roleUpgrader.run(creep);
                //}
            }
        }
        if(creep.memory.role == 'supporter') {
            roleSupporter.run(creep);
        }
        if(creep.memory.role == 'visualizer') {
            roleVisualizer.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if(creep.memory.role == 'defender') {
            if(roleDefender.run(creep)==-1){
                // if(creep.memory.behaviour == 0){
                //     if(roleBuilder.run(creep)==-1){
                //         roleRepairer.run(creep);
                //     }
                // }
                // else{
                    if(roleBuilder.run(creep)==-1){
                        //creep.memory.behaviour=0;
                        roleUpgrader.run(creep);
                    }
                // }
            }
        }
        if(creep.memory.role == 'dismantler') {
            if(roleDismantler.run(creep)==-1)
                roleRepairer.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'battleGroup') {
            roleBattleGroup.run(creep);
        }
        if(creep.memory.role == 'dealer') {
            roleDealer.run(creep);
        }
        if(creep.memory.role == 'hunter') {
            roleHunter.run(creep);
        }
        //console.log(Game.time+" - creep "+name+" over, CPU="+Game.cpu.getUsed());
    }
    for(var name in Game.spawns) {
        var spawn=Game.spawns[name];
        if(spawn.room.name=='W42N33') visualTrack(spawn.room,true);
        else visualTrack(spawn.room,true);
        //autoBattleGroup.run(spawn);
        autoVisualize.run(spawn);
        var ret=autoSpawning.run(spawn);
        //console.log('Now at '+Game.time+' spawn '+spawn.name+' returned '+ret);
        if(ret<=3) continue;
        autoReserve.run(spawn);
        autoHunt.run(spawn);
    }
    //console.log(Game.time+" - Spawns over, CPU="+Game.cpu.getUsed());
    if(Game.time%100==0)for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            console.log('Clearing non-existing creep memory:', name);
            delete Memory.creeps[name];
        }
    }
    for(var name in Game.structures) {
        var structure=Game.structures[name];
        if(structure.structureType==STRUCTURE_TOWER){
            autoTower.run(structure);
        }
        if(structure.structureType==STRUCTURE_STORAGE){
            var tpos=structure.pos.y-1.6;
            for(i in structure.store){
                structure.room.visual.text(
                    i + ':'+structure.store[i],
                    structure.pos.x + 1, 
                    tpos+=0.8, 
                    {align: 'left', color:'#ee99cc', opacity: 0.6, font: '.8 Consolas', stroke:'#992277', strokeWidth:'0.08'});
            }
        }
        if(structure.structureType==STRUCTURE_LINK){
            autoLink.run(structure);
        }
    }
    //console.log(""+Game.time+" - Structure over, CPU="+Game.cpu.getUsed());
    //Memory.reportCPU=Game.cpu.getUsed();
    Memory.reportCPU=Game.cpu.getUsed()*0.01+Memory.reportCPU*0.99;
    visual.text(
        "CPU:"+Memory.reportCPU.toFixed(2),49,3, 
        {align: 'right', color: '#ee99cc', opacity: 0.4, font: '2 Consolas'}).text(
        "bucket:"+Game.cpu.bucket,49,1, 
        {align: 'right', color: '#ee99cc', opacity: 0.4, font: '2 Consolas'});
    if(Game.time%100==0){
        console.log('Currently average used cpu is:'+Memory.reportCPU);
    }
});
}