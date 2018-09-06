const consts = require('consts');
const targetList=consts.link.targetList;
module.exports = {
    run:function(link){
        if(link.cooldown!=0) return -1;
        if(targetList[link.id]){
            var target=Game.getObjectById(targetList[link.id]);
            if(link.energy>=200){
                link.transferEnergy(target,Math.min(Math.floor(link.energy/100),Math.floor((target.energyCapacity-target.energy)/100))*100);
            }
        }
    }
};