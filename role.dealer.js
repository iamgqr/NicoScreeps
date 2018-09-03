
var roleDealer={
    transferMineral:function(creep,lab,type){
        var source=creep.pos.findClosestByRange(FIND_STRUCTURES,{filter:s=>s.structureType==STRUCTURE_STORAGE});
        if(lab.mineralAmount<1000){
            for(i in creep.carry) if(i!=type&&creep.carry[i]){
                creep.moveTo(source);
                creep.transfer(source,i);
                return;
            }
            if(!creep.carry[type]){
                creep.moveTo(source);
                creep.withdraw(source,type);
                return;
            }else{
                creep.moveTo(lab);
                creep.transfer(lab,type);
                return;
            }
        }
        else return 0;
    },
    run:function(creep){
        var lab1=Game.getObjectById('5b84eb7ce66e9c6b6cbdf254'),lab2=Game.getObjectById('5b8595cf97b7f817725d1e1a'),lab3=Game.getObjectById('5b85cea0ccea0e567e0b60fa');
        var source=Game.getObjectById('5b7d7dd63d193b0277cc1af4');
        var target=Game.getObjectById('5b86bdd147397c41d642cf62');
        lab3.runReaction(lab1,lab2);
        if(this.transferMineral(creep,lab1,'Z')!=0) return;
        if(this.transferMineral(creep,lab2,'H')!=0) return;
        if(!creep.pos.isEqualTo(new RoomPosition(19,28,"W42N33"))){
            creep.moveTo(19,28);
            return;
        }
        if(lab3.mineralAmount>500){
            creep.withdraw(lab3,'ZH');
            return;
        }
        if(creep.carry.energy){
            creep.transfer(target,'energy');
            return;
        }
        if(creep.carry.Z){
            creep.transfer(target,'Z');
            return;
        }
        if(source&&source.store.energy>100000&&Math.random()<0.5){
            creep.withdraw(source,'energy');
            creep.transfer(target,'energy');
            return;
        }
        if(source&&source.store.Z>30000&&Math.random()<0.5){
            creep.withdraw(source,'Z');
            creep.transfer(target,'Z');
            return;
        }
        if(Math.random()<0.5){
            for(i in target.store) if(i!='energy'&&i!='Z'){
                creep.withdraw(target,i);
            }
            for(i in creep.carry) if(i!='energy'&&i!='Z'){
                creep.transfer(source,i);
            }
            return;
        }
    }
};

module.exports=roleDealer;