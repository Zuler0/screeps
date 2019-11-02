module.exports = function() {
	Creep.prototype.getTarget =
	function() {
		//get room vars
		let structByType = this.room.structByType;
		let spawns = structByType[STRUCTURE_SPAWN] || [];
		let extensions = structByType[STRUCTURE_EXTENSION] || [];
		let towers = structByType[STRUCTURE_TOWER] || [];
		let supplyTargets = (spawns.concat(extensions).concat(towers));
		let filteredTargets = _.filter(supplyTargets, (s) => (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
		let targetsByType = _.groupBy(filteredTargets, (s) => s.structureType);
		let targetSpawns = this.pos.findInRange(targetsByType[STRUCTURE_SPAWN], 25);
		let storage = this.room.storage;
		let targetExtensions = this.pos.findInRange(targetsByType[STRUCTURE_EXTENSION], 20);
		let targetTowers = targetsByType[STRUCTURE_TOWER] || [];
		switch (this.memory.role) {
			case "supplier": {
				let target;
				if (targetSpawns.length || targetExtensions.length) {
					target = this.pos.findClosestByRange(targetSpawns.concat(targetExtensions));
					this.memory.target = target.id;
				} else if (targetTowers.length) {
					target = this.pos.findClosestByRange(targetTowers);
					this.memory.target = target.id;
				} else if (storage) {
					if (storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
						target = storage;
						this.memory.target = target.id;
					}
				}
				break;
			}
			case "repairer": {//if repairer run this
				//get room vars
				let walls = this.room.walls;
				let infrastructure = this.room.infrastructure;
				//find some infrastructure to repair
				if (infrastructure.length) {
					this.memory.target = infrastructure[0].id;
					this.memory.targetOldHits = infrastructure[0].hits;
					break;
				}
				flagTarget: {
					if (!this.memory.flag) {
						let maintain = global.maintainFlags;
						for (let flag of maintain) {
							switch (flag.memory.repairers) {
								case 0: {
									this.memory.flag = flag.name;
									++flag.memory.repairers;
									break flagTarget;
								}
								case 1:{
									break;
								}
								default: {
									this.memory.flag = flag.name;
									flag.memory.repairers = 1;
									break flagTarget;
								}
							}
						}
					}
				}
				//get flag from memory
				let flag = Game.flags[this.memory.flag];
				if (flag && flag.room) {
					infrastructure = flag.room.infrastructure;
					if (infrastructure.length) {
						this.memory.target = infrastructure[0].id;
						this.memory.targetOldHits = infrastructure[0].hits;
						break;
					}
				}
				//if repairer still doesn't have a target and walls are repairable, find a wall to repair
				if (this.room.controller.level > 1 && walls.length) {
					this.memory.target = walls[0].id;
					this.memory.targetOldHits =  walls[0].hits;
				}
				break;
			}
			case "claimer": {
				flagTarget: {
					let claim = global.claimFlags;
					for (let flag of claim) {
						switch (flag.memory.claimers) {
							case 0: {
								this.memory.flag = flag.name;
								++flag.memory.claimers;
								break flagTarget;
							}
							case 1:{
								break;
							}
							default: {
								this.memory.flag = flag.name;
								flag.memory.claimers = 1;
								break flagTarget;
							}
						}
					}
					let reserve = global.reserveFlags;
					for (let flag of reserve) {
						switch (flag.memory.claimers) {
							case 0: {
								this.memory.flag = flag.name;
								++flag.memory.claimers;
								break flagTarget;
							}
							case 1:{
								break;
							}
							default: {
								this.memory.flag = flag.name;
								flag.memory.claimers = 1;
								break flagTarget;
							}
						}
					}
				}
				break;
			}
			case "builder": {
				//get room vars
				let constuctByType = this.room.constuctByType;
				let containers = constuctByType[STRUCTURE_CONTAINER] || [];
				let extensions = constuctByType[STRUCTURE_EXTENSION] || [];
				let targets;
				//if there are containers to build, build them
				if (containers.length) {
					this.memory.target = this.pos.findClosestByRange(containers).id;
					break;
				}
				//otherwise if there are extensions to build, build them
				else if (extensions.length) {
					this.memory.target = this.pos.findClosestByRange(extensions).id;
					break;
				}
				//otherwise build closest construction site
				else {
					targets = this.room.constuctSites;
					if (targets.length) {
						this.memory.target = this.pos.findClosestByRange(targets).id;
						break;
					}
				}
				flagTarget: {
					let maintain = global.maintainFlags;
					for (let flag of maintain) {
						switch (flag.memory.builders) {
							case 0: {
								this.memory.flag = flag.name;
								++flag.memory.builders;
								break flagTarget;
							}
							case 1:{
								break;
							}
							default: {
								this.memory.flag = flag.name;
								flag.memory.builders = 1;
								break flagTarget;
							}
						}
					}
				}
				let flag = Game.flags[this.memory.flag];
				if (flag && flag.room) {
					let flagTargets = flag.room.constuctSites;
					if (flagTargets.length) {
						this.memory.target = flagTargets[0].id;
						this.memory.targetOldHits = flagTargets[0].hits;
						break;
					}
				}
				break;
			}
			case "harvester": {
				sourceTarget: {
					for (let source of this.room.sources) {
						switch (source.memory.harvesters) {
							case 0: {
								this.memory.source = source.id;
								++source.memory.harvesters;
								break sourceTarget;
							}
							case 1:{
								break;
							}
							default: {
								this.memory.source = source.id;
								source.memory.harvesters = 1;
								break sourceTarget;
							}
						}
					}
				}
			}
			case "remoteHarvester": {
				sourceTarget: {
					flagTarget: {
						let harvest = global.harvestFlags;
						for (let flag of harvest) {
							if (!flag.memory.harvesters) {
								this.memory.flag = flag.name;
								flag.memory.harvesters = 1;
								break flagTarget;
							}
							else if (flag.memory.harvesters < flag.room.sources.length) {
								this.memory.flag = flag.name;
								++flag.memory.harvesters;
								break flagTarget;
							}
						}
					}
					let flag = Game.flags[this.memory.flag];
					for (let source of flag.room.sources) {
						switch (source.memory.harvesters) {
							case 0: {
								this.memory.source = source.id;
								++source.memory.harvesters;
								break sourceTarget;
							}
							case 1:{
								break;
							}
							default: {
								this.memory.source = source.id;
								source.memory.harvesters = 1;
								break sourceTarget;
							}
						}
					}
				}
			}
		}
		if (this.memory.target) {
			this.memory.targetRoom = Game.getObjectById(this.memory.target).room.name;
		}
	}

	Creep.prototype.getEnergy =
	function() {
		//get room vars
		let resByType = this.room.resByType;
		let dropedEnergy = resByType[RESOURCE_ENERGY] || [];
		let structByType = this.room.structByType;
		let spawns = structByType[STRUCTURE_SPAWN] || [];
		let containers = structByType[STRUCTURE_CONTAINER] || [];
		let storage = this.room.storage;
		let ruins = this.room.ruins;
		let tombstones = this.room.tombstones;
		//run based off role
		switch (this.memory.role) {
			case "supplier": {//if supplier
				let targets;
				let target;
				//interate through sources
				if (!this.memory.source) {
					sourceTarget: {
						for (let source of this.room.sources) {
							switch (source.memory.suppliers) {
								case 0: {
									this.memory.source = source.id;
									++source.memory.suppliers;
									break sourceTarget;
								}
								case 1:{
									break;
								}
								default: {
									this.memory.source = source.id;
									source.memory.suppliers = 1;
									break sourceTarget;
								}
							}
						}
					}
				}
				let source = Game.getObjectById(this.memory.source);
				//get dropedEnergy
				if (dropedEnergy.length) {
					target = this.pos.findClosestByRange(dropedEnergy);
					let amount = this.store.getFreeCapacity() - target.amount;
					if (this.pickup(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						this.goTo(target);
					}
					if (this.store.getFreeCapacity() > amount) {
						target = this.pos.findClosestByRange(containers);
						this.withdraw(target, RESOURCE_ENERGY, amount);
					}
				}//if no dropedEnergy get tombstones with energy
				else if (tombstones.length) {
					targets = tombstones;
				}
				//if no tombstones get ruins with energy
				else if (ruins.length) {
					targets = ruins;
				}
				//otherwise get containers with energy
				else if (source) {
					targets = source.pos.findInRange(_.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY))),1);
				}
				//if there is a target list find closest and get energy from it
				if (targets) {
					target = this.pos.findClosestByRange(targets);
					if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						this.goTo(target);
					}
				}
				break;
			}
			default: { //if not supplier
				let targets;
				let target;
				if (ruins.length) {
					targets = ruins;
				}
				else if (storage) {
					target = storage;
				}
				else if (containers.length) {
					targets = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
				}
				else if (this.pos.findClosestByPath(this.room.sources, { ignoreCreeps: false })) {
					this.mine();
				}
				else if (spawns.length) {
					targets = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
				}
				else {
					this.travelTo(Game.rooms[this.memory.home].controller);
				}
				if (targets) {
					target = this.pos.findClosestByRange(targets);
				}
				if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.travelTo(target, {ignoreCreeps: false});
				}
			}
		}
	}

	Creep.prototype.mine =
	function() {
		//intialize target
		let target;
		//if creep has source
		if (this.memory.source) {
			//set target to source
			target = Game.getObjectById(this.memory.source);
			//set targetRoom in memory to room of target, if it didn't exist
			if (!creep.memory.targetRoom) {
				creep.memory.targetRoom = target.room.name;
			}
			//get targetRoom
			let targetRoom = Game.rooms[creep.memory.targetRoom];
			//if creep is in targetRoom
			if (creep.room == targetRoom) {
				//if source isn't empty
				if (target.energy > 0) {
					//harvest source, if it isn't in range move to it
					if (this.harvest(target) == ERR_NOT_IN_RANGE) {
						this.travelTo(target);
					}
				}
			//otherwise move to room the source is in
			} else {
				creep.travelTo(new RoomPosition(25, 25, creep.memory.targetRoom));
			}
		//if wasn't assigned a source mine closest available one
		} else {
			target = this.pos.findClosestByPath(this.room.sources, {ignoreCreeps:false});
			if (target && target.energy > 0) {
				if (this.harvest(target) == ERR_NOT_IN_RANGE) {
					this.travelTo(target);
				}
			}
		}
	}

	Creep.prototype.goTo =
	function(target) {
		//switch based off role
		switch (this.memory.role) {
			case "supplier": {
				if (this.store[RESOURCE_ENERGY] <= this.store.getCapacity()/10) {
					this.travelTo(target, {offRoad: true});
				} else
				if (this.store[RESOURCE_ENERGY] <= this.store.getCapacity()/2) {
					this.travelTo(target, {ignoreRoads: true});
				}
				else {
					this.travelTo(target);
				}
				break;
			}
		}
	}
};
