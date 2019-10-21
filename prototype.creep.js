module.exports = function() {
	Creep.prototype.moveToEnergy =
	function(target) {
		if (this.pos.isNearTo(target)) {
			this.withdraw(target, RESOURCE_ENERGY)
		} else {
			this.travelTo(target, {ignoreCreeps: false});
		}
	}
	Creep.prototype.getEnergy =
	function() {
		var resByType = Game.rooms[this.room.name].resByType;
		var dropedEnergy = resByType[RESOURCE_ENERGY];
		var structByType = Game.rooms[this.room.name].structByType;
		var containers = structByType[STRUCTURE_CONTAINER] || [];
		var storage = structByType[STRUCTURE_STORAGE] || [];
		var spawns = structByType[STRUCTURE_SPAWN] || [];
		var energyStorage = containers.concat(storage);
		if (dropedEnergy) {
			console.log(this.name+' test');
			var targets = dropedEnergy;
		} else if (energyStorage.length == 0) {
			var targets = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		} else if (!targets) {
			var targets = _.filter(energyStorage, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		}
		var target = this.pos.findClosestByPath(targets);
		this.moveToEnergy(target);
	}
};
