
var BTW = require('function.BTW');

var roleDealer={
    transferMineral:function(creep,lab,type){
        var source=creep.pos.findClosestByRange(FIND_STRUCTURES,{filter:s=>s.structureType==STRUCTURE_STORAGE});
        if(lab.mineralType&&lab.mineralType!=type&&!creep.carry[lab.mineralType]){
            creep.moveTo(lab,{range:1});
            creep.withdraw(lab,lab.mineralType);
            return;
        }
        if(!lab.mineralAmount||lab.mineralAmount<1000){
            for(i in creep.carry) if(i!=type&&creep.carry[i]){
                creep.moveTo(source,{range:1});
                creep.transfer(source,i);
                return;
            }
            
            if(!creep.carry[type]){
                if(!source.store[type]) return 0;
                creep.moveTo(source,{range:1});
                creep.withdraw(source,type);
                return;
            }else{
                creep.moveTo(lab,{range:1});
                creep.transfer(lab,type);
                return;
            }
        }
        else return 0;
    },
    run:function(creep){
        var room=creep.room.name;
        var lab1=Game.getObjectById('5b84eb7ce66e9c6b6cbdf254'),lab2=Game.getObjectById('5b8595cf97b7f817725d1e1a'),lab3=Game.getObjectById('5b85cea0ccea0e567e0b60fa');
        var source=Game.getObjectById('5b7d7dd63d193b0277cc1af4');
        var target=Game.getObjectById('5b86bdd147397c41d642cf62');
        if(Game.time%1000==0)for(i in Game.market.orders){
            // console.log(i,JSON.stringify(Game.market.orders[i]));
            if(!Game.market.orders[i].remainingAmount) Game.market.cancelOrder(Game.market.orders[i].id);
        }
        
        if(!target.cooldown&&target.store.energy>10000){
            var energyOrders=Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY});
            var calcPrice=order=>{
                var amount=Math.min(order.amount,Math.floor(target.store.energy*0.5));
                return order.price*amount/(amount+Game.market.calcTransactionCost(amount,room,order.roomName));
            }
            var bestOrder=_.max(energyOrders,calcPrice);
            if(calcPrice(bestOrder)>0.050){
                var ret=Game.market.deal(bestOrder.id,Math.min(bestOrder.amount,Math.floor(target.store.energy*0.5)),room);
                console.log("Room",room,"Dealt energy",ret,calcPrice(bestOrder),Math.min(bestOrder.amount,Math.floor(target.store.energy*0.5)),JSON.stringify(bestOrder));
            }
        }
        if(lab3.mineralAmount<=1500&&Game.time%50==0){
            Game.market.createOrder(ORDER_BUY,RESOURCE_ZYNTHIUM_OXIDE,0.605,1000,room);
        }
        lab3.runReaction(lab1,lab2);
        if(this.transferMineral(creep,lab1,'Z')!=0) return;
        if(this.transferMineral(creep,lab2,'O')!=0) return;
        if(!creep.pos.isEqualTo(new RoomPosition(19,28,"W42N33"))){
            creep.moveTo(19,28);
            return;
        }
        if(BTW(creep,'ZO')) return;
        if(BTW(creep,'energy')) return;
        if(lab3.mineralType=='ZH'){
            creep.withdraw(lab3,'ZH');
            return;
        }
        if(lab3.energy!=lab3.energyCapacity&&creep.carry.energy){
            creep.transfer(lab3,'energy');
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
        if(creep.carry.ZO&&lab3.mineralAmount!=lab3.mineralCapacity){
            creep.transfer(lab3,'ZO');
            return;
        }
        for(i in creep.carry)if(creep.carry[i]){
            creep.transfer(source,i);
            return;
        }
        if(source&&source.store.energy>100000&&Math.random()<0.5){
            creep.withdraw(source,'energy');
            return;
        }
        if(source&&source.store.Z>30000&&Math.random()<0.5){
            creep.withdraw(source,'Z');
            return;
        }
        if(source&&source.store.ZO&&Math.random()<0.1){
            creep.withdraw(source,'ZO');
            return;
        }
        if(Math.random()<0.5){
            for(i in target.store) if(i!='energy'&&i!='Z'){
                creep.withdraw(target,i);
            }
            return;
        }
    }
};

module.exports=roleDealer;