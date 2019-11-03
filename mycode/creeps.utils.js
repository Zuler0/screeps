module.exports = function() {
	function intializeFlags() {
		global.reserveFlags = [];
		global.maintainFlags = [];
		global.claimFlags = [];
		global.harvestFlags = [];
		global.attackFlags = [];
		for (let name in Game.flags) {
			++global.flagCount;
			let flag = Game.flags[name];
			if (name.includes("Reserve")) {
				global.reserveFlags.push(flag);
			}
			if (name.includes("Maintain")) {
				global.maintainFlags.push(flag);
			}
			if (name.includes("Claim")) {
				global.claimFlags.push(flag);
			}
			if (name.includes("Harvest")) {
				global.harvestFlags.push(flag);
			}
			if (name.includes("Attack")) {
				global.attackFlags.push(flag);
			}
		}
		for (let name in Game.rooms) {
			let room = Game.rooms[name];
			room.memory.flagCount = 0;
			//claim ownership of flags in rooms bordering if no master room
			let rooms = Game.map.describeExits(room.name);
			let reserve = global.reserveFlags;
			let harvest = global.harvestFlags;
			let flags = reserve.concat(harvest);
			for (let flag of flags) {
				if (!flag.memory.master) {
					for (let key in rooms) {
						let roomName = rooms[key];
						if (flag.room.name == roomName) {
							flag.memory.master = room.name;
							++room.memory.flagCount;
						}
					}
				}
			}
		}
	}
};
