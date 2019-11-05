const profiler = require('screeps-profiler');
const roleLink = {
	run: function (link) {
		let target = link.room.storageLink;
		if (link != target && link.cooldown == 0 && target.store.getUsedCapacity() <= 24 && link.store.getUsedCapacity() == 800) {
			link.transferEnergy(target);
		}
	}
}
profiler.registerObject(roleLink, 'roleLink');
module.exports = roleLink;
