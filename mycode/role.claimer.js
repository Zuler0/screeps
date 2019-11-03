const profiler = require('screeps-profiler');
const roleClaimer = {
	run: function (creep) {
		if (!creep.memory.flag) {
			creep.getTarget();
		}
		let flag = Game.flags[creep.memory.flag];
		if (!flag) {
			delete creep.memory.flag;
		}
		if (flag && flag.room == creep.room) {
			if (flag.name.includes("Claim")) {
				if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.travelTo(creep.room.controller);
				} else {
					delete creep.memory.flag;
				}
			}
			else if (flag.name.includes("Reserve")) {
				if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.travelTo(creep.room.controller);
				}
			}
		}
		else {
			creep.travelTo(flag);
		}
	}
}
profiler.registerObject(roleClaimer, 'roleClaimer');
module.exports = roleClaimer;
