module.exports = function() {
	/*This takes the parameters below and spawns a DynamicCreep*/
	/** @param {Energy} energyAvail @param {Creep Name} name @param {Role} roleName **/
	StructureSpawn.prototype.spawnDynamicCreep =
	function(energyAvail, name, roleName) {
		// create a balanced body
		let numParts = Math.min(Math.floor(energyAvail / 200),8);
		let body = [];
		for (let i = 0; i < numParts; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < numParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < numParts; i++) {
			body.push(MOVE);
		}
		//spawn creep with the body, name, and role
		return this.spawnCreep(body, name, {memory: {role: roleName, workParts: numParts, moveParts: numParts, heavyParts: numParts, home: this.room.name}});
	}
	/*This takes the parameters below and spawns a Harvester*/
	/** @param {Energy} energyAvail @param {Creep Name} name **/
	StructureSpawn.prototype.spawnHarvester =
	function(energyAvail, name) {
		let otherParts = Math.min(Math.floor(energyAvail / (BODYPART_COST[WORK] * 2 + BODYPART_COST[MOVE] + BODYPART_COST[CARRY])), 3);
		let workParts = otherParts * 2;
		let body = [];
		for (let i = 0; i < workParts; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < otherParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < otherParts; i++) {
			body.push(MOVE);
		}
		return this.spawnCreep(body, name, {memory: {role: 'harvester', workParts: workParts, moveParts: otherParts, heavyParts: workParts, home: this.room.name}});
	}
	/*This takes the parameters below and spawns a Caninister Harvester*/
	/** @param {Energy} energyAvail @param {Creep.name} name **/
	StructureSpawn.prototype.spawnCanHarvester =
	function(energyAvail, name) {
		let moveParts = Math.min(Math.floor(energyAvail / (BODYPART_COST[WORK] * 2 + BODYPART_COST[MOVE])),3);
		let workParts = moveParts * 2;
		let body = [];
		for (let i = 0; i < workParts; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < moveParts; i++) {
			body.push(MOVE);
		}
		return this.spawnCreep(body, name, {memory: {role: 'harvester', workParts: workParts, moveParts: moveParts, heavyParts: workParts, home: this.room.name}});
	}
	/*This takes the parameters below and spawns a Supplier*/
	/** @param {Energy} energyAvail @param {Creep Name} name **/
	StructureSpawn.prototype.spawnSupplier =
	function(energyAvail, name) {
		let moveParts = Math.min(Math.floor(energyAvail / (BODYPART_COST[MOVE] + BODYPART_COST[CARRY] * 2)),12);
		let carryParts = moveParts*2;
		let body = [];
		for (let i = 0; i < carryParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < moveParts; i++) {
			body.push(MOVE);
		}
		return this.spawnCreep(body, name, {memory: {role: 'supplier', moveParts: moveParts, heavyParts: 0, home: this.room.name}});
	}
	/*This takes the parameters below and spawns a Harvester*/
	/** @param {Energy} energyAvail @param {Creep Name} name **/
	StructureSpawn.prototype.spawnRanger =
	function(energyAvail, name) {
		let otherParts = Math.floor(energyAvail / (BODYPART_COST[TOUGH] + BODYPART_COST[MOVE] * 5 + BODYPART_COST[RANGED_ATTACK]  * 3 + BODYPART_COST[HEAL]));
		let rangedAttackParts = otherParts * 3;
		let moveParts = otherParts * 5;
		let body = [];
		for (let i = 0; i < otherParts; i++) {
			body.push(TOUGH);
		}
		for (let i = 0; i < moveParts; i++) {
			body.push(MOVE);
		}
		for (let i = 0; i < rangedAttackParts; i++) {
			body.push(RANGED_ATTACK);
		}
		for (let i = 0; i < otherParts; i++) {
			body.push(HEAL);
		}
		return this.spawnCreep(body, name, {memory: {role: 'ranger', attackParts: otherParts * 3, moveParts: otherParts * 5, heavyParts: otherParts * 5, home: this.room.name}});
	}
};
