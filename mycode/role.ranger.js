const profiler = require('screeps-profiler');
const roleRanger = {
	run: function(creep) {
		let attack = global.attackFlags;
		for (let flag of attack) {
			creep.memory.flag = flag.name;
			break;
		}
		let flag = Game.flags[creep.memory.flag];
		if (flag && creep.room != flag.room || !creep.memory.target) {
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
		let friendlyCreeps = room.friendlyCreeps;
		friendlyCreeps.sort(c => creep.pos.getRangeTo(c));
		for (let fCreep of friendlyCreeps) {
			if (fCreep.hits < fCreep.hitsMax) {
				creep.heal(fCreep);
				break;
			}
		}
		let target = creep.pos.findClosestByRange(targets);
		creep.rangedAttack(target);
		target = Game.getObjectById(creep.memory.target);
		creep.rangedAttack(target)
		let time = Game.cpu.getUsed();
		if (creep.pos.getRangeTo(target) > 2) {
			let path = PathFinder.search(creep.pos, _.map(targets, t => {
				return{pos: t.pos, range:2};
			})).path;
			creep.moveByPath(path);
		}
		if (creep.pos.getRangeTo(target) < 3) {
			let path = PathFinder.search(creep.pos, _.map(targets, t => {
				return{pos: t.pos, range:3};
			}), {flee:true}).path;
			creep.moveByPath(path);
		}
		console.log(creep.name + " used " + (Game.cpu.getUsed()- time).toFixed(4));
	}
}
profiler.registerObject(roleRanger, 'roleRanger');
module.exports = roleRanger;
