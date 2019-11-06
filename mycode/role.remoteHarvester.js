const profiler = require('screeps-profiler');
const roleRemoteHarvester = {
	run: function (creep) {
		if (!creep.memory.target) {
			creep.getTarget();
		}
		let flag = Game.flags[creep.memory.flag];
		if (flag.room != creep.room) {
			creep.travelTo(flag);
		}
		else {
			creep.mine();
		}
	}
}
profiler.registerObject(roleRemoteHarvester, 'roleRemoteHarvester');
module.exports = roleRemoteHarvester;
