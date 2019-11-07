const profiler = require('screeps-profiler');
const roleRanger = {
	run: function(creep) {
		let attack = global.attackFlags;
		for (let flag of attack) {
			creep.memory.flag = flag.name;
			break;
		}
		let flag = Game.flags[creep.memory.flag];
		if (creep.room != flag.room || !creep.memory.target) {
			creep.travelTo(flag, {range: 2, ignoreRoads: true});
		}
		let targets = creep.room.enemyCreeps;
		if (creep.memory.target) {
			let target = Game.getObjectById(creep.memory.target);
			if (!target) {
				delete creep.memory.target;
			}
		}
		if (!creep.memory.target) {
			getTarget: {
				for (let target of targets) {
					if (target.getActiveBodyparts(RANGED_ATTACK) > 0) {
						creep.memory.target = target.id;
						break getTarget;
					}
				}
				for (let target of targets) {
					if (target.getActiveBodyparts(ATTACK) > 0) {
						creep.memory.target = target.id;
						break getTarget;
					}
				}
				if (targets.length) {
					let target = creep.pos.findClosestByRange(targets);
					creep.memory.target = target.id;
					break getTarget;
				}
			}
		}
		let target = creep.pos.findClosestByRange(targets);
		creep.rangedAttack(target);
		if (creep.pos.getRangeTo(target) < 2) {
			let path = PathFinder.search(creep.pos, targets.map(t => {
				return{
					pos: t.pos,
					 range:2
				};
			}), {flee:true});
			creep.moveByPath(path);
		}
		target = Game.getObjectById(creep.memory.target);
		if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
			creep.travelTo(target, {ignoreCreeps: false, range: 2, ignoreRoads: true, repath: 1});
		}
	}
}
profiler.registerObject(roleRanger, 'roleRanger');
module.exports = roleRanger;
