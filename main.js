var roleHarvester = require('role.harvester');
var roleDistantHarvester = require('role.distantHarvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMinecart = require('role.minecart');
var roleRepairer = require('role.repairer');
var roleSupporter = require('role.supporter');
var roleCarrier = require('role.carrier');
var roleClaimer = require('role.claimer');
var roleDismantler = require('role.dismantler');
var roleDefender = require('role.defender');
var roleVisualizer = require('role.visualizer');
var autoSpawning = require('auto.spawning');
var autoVisualize = require('auto.visualize');
var autoReserve = require('auto.reserve');
var autoTower = require('auto.tower');
var autoLink = require('auto.link');

module.exports.loop = function () {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
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
        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if(creep.memory.role == 'defender') {
            if(roleDefender.run(creep)==-1){
            if(creep.memory.behaviour == 0){
                    if(roleBuilder.run(creep)==-1){
                        roleRepairer.run(creep);
                    }
                }
                else{
                    if(roleBuilder.run(creep)==-1){
                        //creep.memory.behaviour=0;
                        roleUpgrader.run(creep);
                    }
                }
            }
        }
        if(creep.memory.role == 'dismantler') {
            if(roleDismantler.run(creep)==-1)
                roleRepairer.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
    for(var name in Game.spawns) {
        var spawn=Game.spawns[name];
        var ret=autoSpawning.run(spawn);
        //console.log('Now at '+Game.time+' spawn '+spawn.name+' returned '+ret);
        if(ret<=2) continue;
        autoVisualize.run(spawn);
        autoReserve.run(spawn);
    }
    for(var name in Memory.creeps) {
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
            var tpos=structure.pos.y-1;
            for(i in structure.store){
                structure.room.visual.text(
                    i + ':'+structure.store[i],
                    structure.pos.x + 1, 
                    tpos++, 
                    {align: 'left', color:'#ee99cc', opacity: 0.6, font: '1 Consolas', stroke:'#992277', strokeWidth:'0.03'});
            }
        }
        if(structure.structureType==STRUCTURE_LINK){
            autoLink.run(structure);
        }
    }
    var visual=new RoomVisual;
    //Memory.reportCPU=Game.cpu.getUsed();
    Memory.reportCPU=Game.cpu.getUsed()*0.01+Memory.reportCPU*0.99;
    visual.text(
        "CPU:"+Memory.reportCPU.toFixed(2),49,1, 
        {align: 'right', color: '#ee99cc', opacity: 0.4, font: '2 Consolas'});
    if(Game.time%100==0){
        console.log('Currently average used cpu is:'+Memory.reportCPU);
    }
}