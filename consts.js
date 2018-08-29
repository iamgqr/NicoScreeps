
module.exports = {
maxSpawn:{
    'Spawn1':{
        harvester           :2,
        supporter           :2,
        upgrader            :1,
        dismantler          :1,
        minecart            :9,
        distantHarvester    :3,
        //carrier             :3,
        repairer            :2,
        builder             :1,
        defender            :2,
        miner               :1,
        hunter              :0,
    },
    'Spawn2':{
        harvester           :2,
        supporter           :1,
        upgrader            :5,
        dismantler          :1,
        minecart            :1,
        distantHarvester    :1,
        repairer            :1,
        builder             :2,
        defender            :2,
    }
},
template:{
    'Spawn1':{
        harvester:[
            [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,MOVE],
            [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,MOVE],
        ],
        supporter:[
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        ],
        upgrader:[
            [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],//1000
            [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],//1000
        ],
        dismantler:[
            [WORK,WORK,MOVE,WORK,WORK,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        ],
        minecart:[
            [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,MOVE,WORK],
            [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,MOVE,WORK],
            [CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,CARRY,MOVE,WORK],
            ,
            ,
            [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
            [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
            [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
            [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
        ],
        distantHarvester:[
            [MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
            [MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
            [MOVE,CARRY,WORK,MOVE,CARRY,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK],
        ],//1150
        // carrier:[
        //     [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        //     [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        //     [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE],
        // ],//1050
        repairer:[
            [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,MOVE,MOVE],
            [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,WORK,MOVE,WORK,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],//1400
        ],//1200
        builder:[
            [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],//1100
            [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],//1100
        ],
        defender:[
            [WORK,CARRY,CARRY,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK],//1240
            [WORK,CARRY,CARRY,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK],//1240
        ],
        miner:[
            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        ],
        hunter:[
            [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
            [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL],
        ],
    },
    'Spawn2':{
        harvester:[
            [WORK,WORK,CARRY,MOVE,MOVE],
            [WORK,WORK,WORK,CARRY,MOVE,MOVE],
        ],
        supporter:[
            [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
        ],
        upgrader:[
            [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        ],
        dismantler:[
            [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE],
        ],
        minecart:[
            [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE],
        ],
        distantHarvester:[
            [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE],
        ],
        repairer:[
            [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE],
            [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE],
        ],//1200
        builder:[
            [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE],
            [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE],
        ],
        defender:[
            [WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK],//1240
            [WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK],//1240
        ],
    },
},

distantHarvester:{
sourceList:{
    'Spawn1':[
        '59f1a06382100e1594f369d0',
        '59f1a05082100e1594f36848',
        '59f1a05082100e1594f36847',
        '59f1a02582100e1594f36279',
        '59f1a02582100e1594f36279',
    ],
    'Spawn2':[
        '59f1a02582100e1594f3627b',
    ],
},
positList:{
    'Spawn1':[
        new RoomPosition(20,13,'W41N32'),
        new RoomPosition(13,47,'W42N32'),
        new RoomPosition(17,39,'W42N32'),
        new RoomPosition(32,33,'W45N33'),
        new RoomPosition(33,33,'W45N33'),
    ],
    'Spawn2':[
        new RoomPosition(32,7,'W45N32'),
    ],
},
containerList:{
    'Spawn1':[
        '5b83711da4dafb41cb674131',
        '5b7f90ce9b3af8175e52293c',
        '5b7ecdfa1ad7d540025acc17',
        ,
        '5b83f551f9ee417bc43a7f59',
    ],
    'Spawn2':[
        
    ],
},
},

harvester:{
sourceList:{
    'Spawn1':[
        '59f1a05082100e1594f36842',
        '59f1a05082100e1594f36844',
    ],
    'Spawn2':[
        '59f1a02582100e1594f36279',
        '59f1a02582100e1594f36279',
    ],
},
positList:{
    'Spawn1':[
        new RoomPosition( 5,13,'W42N33'),
        new RoomPosition(36,43,'W42N33'),
    ],
    'Spawn2':[
        new RoomPosition(32,32,'W45N33'),
        new RoomPosition(32,33,'W45N33'),
    ],
},
},

minecart:{
begins:{
    'Spawn2':[
        new RoomPosition(32, 6,'W45N32'),
    ],
},
ends:{
    'Spawn2':[
        new RoomPosition(31,33,'W45N33'),
    ],
},
typeList:{
    'Spawn1':[
        RESOURCE_ENERGY,
        RESOURCE_ENERGY,
        RESOURCE_ENERGY,
        RESOURCE_ENERGY,
        RESOURCE_ENERGY,
        RESOURCE_ENERGY,
        RESOURCE_ENERGY,
        RESOURCE_ENERGY,
        RESOURCE_ZYNTHIUM,
        RESOURCE_ENERGY,
    ],
    'Spawn2':[
        RESOURCE_ENERGY,
    ],
}
},

miner:{
sourceList:{
    'Spawn1':[
        '59f1c0cf7d0b3d79de5f0421',
    ],
},
positList:{
    'Spawn1':[
        new RoomPosition(45,19,'W42N33'),
    ],
},
containerList:{
    'Spawn1':[
        '5b83ae67833a0502a12aead9',
    ],
},
typeList:{
    'Spawn1':[
        RESOURCE_ZYNTHIUM,
    ],
},
},

repairer:{
targetRoom:{
    'Spawn1':[
        'W42N33',
        'W42N33',
        'W42N33'
    ],
    'Spawn2':[
        'W45N33',
        'W45N32',
    ],
},
},

supporter:{
workList:{
    'Spawn1':[
        [
            '5b78e5d6f79358042e76ff2e',
            "5b7a27029b3af8175e501058",
            "5b7c04fff86f4e0754ced80e",
            "5b7c059e4b70be3fd7faf99a",
            "5b7c0c6bb8fd8602d2bfbfe1",
            "5b7c1088b8fd8602d2bfc1a8",
            "5b7c1d8453dd664061d8c78b",
            "5b7c20fff86f4e0754cee2be",
            "5b7c251b833a0502a127e75e",
            "5b7c428f37852f3d52e3f2b1",
            "5b7c524037852f3d52e3f875",
            "5b7c5d6fc6080c0780ca22ab",
            "5b7c6f2c11faf97bdeca99c6",
            "5b7e31f5743b3917a0bdef1f",
            "5b7f4a7853dd664061d9f653",
            "5b7f4cd2ed8c3602b5781d72",
            "5b7f4d8573dec0420e27f1a9",
            "5b7f513253dd664061d9f8e1",
            "5b7f6ba6efb476076882c3ed",
            "5b7f79bc4602265638d3a90a",
            "5b7f7d69efb476076882ca95",
            "5b7f806b11faf97bdecbbf3f"
        ],
        [
            "5b78e5d6f79358042e76ff2e",
            "5b7919b09b3af8175e4fa584",
            "5b7c13450979756b62abdf1a",
            "5b7c432f3e1314168cf6d2f2",
            "5b7c537bb0d0407bcad7de55",
            "5b7c73da53dd664061d8e756",
            "5b7e36198355616b4454b2db",
            "5b7f429ab8fd8602d2c10612",
            "5b7f441b257c8d41fa379093",
            "5b83bda1733c3316f8eb3cde",
            "5b83beb46282f1177d33a0b7",
            "5b83bee5b513456b5064c8ee",
            "5b83bf97c866f7408b9bed09",
            "5b83c2b031b3b16a31499b0d",
            "5b83c40631b3b16a31499b9e",
            "5b8496e9b8fd8602d2c32ec2",
            "5b84a758f417ed6b6e067864",
            "5b84aa0b87f60417786aeb33",
            "5b8519082c021d168b1bf24b",
            "5b862aa2b38af1564b116525",
            "5b862c1ac866f7408b9cdce0"
        ]
    ],
    'Spawn2':[
        [
            '5b83ead1a6eaf86b80101301',
            '5b840280f9ee417bc43a848c',
            '5b8412b50d26b7566969a754',
            '5b84064b37852f3d52e6c587',
            '5b841577f86f4e0754d1e771',
            "5b841bf6b2fa0416d2402468",
            "5b852134b513456b50655808",
            "5b85322731b3b16a314a2d85",
            "5b853ddb37852f3d52e73ad8",
            "5b85493bea914f3d53b4320b",
            "5b8551b75a28eb5655c0e8bb"
        ],
    ],
},
},

visualizer:{
positList:{
    'Spawn1':{
        W42N32:new RoomPosition(14, 5,'W42N32'),
        W42N31:new RoomPosition(12, 4,'W42N31'),
        W41N32:new RoomPosition( 1, 2,'W41N32'),
        W43N33:new RoomPosition(47,25,'W43N33'),
        W44N33:new RoomPosition(47,44,'W44N33'),
        W45N33:new RoomPosition(46,21,'W45N33'),
    },
    'Spawn2':{
        W45N32:new RoomPosition(27,4,'W45N32'),
    },
},
},

};