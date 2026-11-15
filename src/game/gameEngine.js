// Game Engine for Ultimate Night @ Kattaikonam (UNAK)

export const ALL_ROOMS = [
  { id: 'ROOM_A', name: 'Physics Lab', sub: 'Room A', image: './Fnak photos/Rooms/RoomA.jpg', group: null, cx: 240, cy: 75, w: 90, h: 32 },
  { id: 'CORRIDOR_A', name: 'Main Corridor', sub: 'Corridor A', image: './Fnak photos/Rooms/CorridorA.jpg', group: null, cx: 240, cy: 155, w: 100, h: 32 },
  { id: 'CORRIDOR_B', name: 'Supply Hall', sub: 'Corridor B', image: './Fnak photos/Rooms/CorridorB.jpg', group: null, cx: 100, cy: 225, w: 85, h: 32 },
  { id: 'CORRIDOR_C', name: 'Corridor C', sub: 'Front of Office', image: './Fnak photos/Rooms/CorridorC.jpg', group: null, cx: 240, cy: 235, w: 95, h: 32 },
  { id: 'STAIRS', name: 'Central Stairs', sub: 'Staircase', image: './Fnak photos/Stairs.jpg', group: null, cx: 365, cy: 155, w: 90, h: 32 },
  { id: 'BALCONY', name: 'Balcony', sub: 'Terrace', image: './Fnak photos/Rooms/balcony.jpg', group: null, cx: 105, cy: 75, w: 85, h: 32 },
  { id: 'CORRIDOR_X', name: 'Corridor X', sub: 'West Corridor', image: './Fnak photos/Rooms/CorridorX.jpg', group: null, cx: 110, cy: 155, w: 85, h: 32 },
  { id: 'B_127', name: 'Room B-127', sub: 'Classroom B', image: './Fnak photos/Rooms/B-127.jpg', group: null, cx: 370, cy: 75, w: 90, h: 32 },
  { id: 'ALLEY', name: 'Alleyway', sub: 'Service Alley', image: './Fnak photos/Rooms/alley.jpg', group: null, cx: 45, cy: 115, w: 75, h: 30 },
  { id: 'CLASSROOM', name: 'Classroom', sub: 'Main Hall', image: './Fnak photos/Rooms/classroom.jpg', group: null, cx: 180, cy: 30, w: 85, h: 30 },
  { id: 'ELEVATOR', name: 'Elevator', sub: 'Lift Lobby', image: './Fnak photos/Rooms/elevator.jpg', group: null, cx: 370, cy: 235, w: 80, h: 30 },
  { id: 'GEOTECH', name: 'Geotech Lab', sub: 'Civil Dept', image: './Fnak photos/Rooms/Geotechlab.jpg', group: null, cx: 415, cy: 305, w: 85, h: 30 },
  { id: 'PLAYGROUND', name: 'Playground', sub: 'Outer Grounds', image: './Fnak photos/Rooms/Playground.jpg', group: null, cx: 65, cy: 30, w: 85, h: 30 },
  { id: 'ENTRANCE_1', name: 'Entrance (Day)', sub: 'Main Gate 1', image: './Fnak photos/Rooms/Entrance.jpg', group: 'ENTRANCE', cx: 110, cy: 305, w: 95, h: 32 },
  { id: 'ENTRANCE_2', name: 'Entrance (Eve)', sub: 'Main Gate 2', image: './Fnak photos/Rooms/Entrance-2.jpg', group: 'ENTRANCE', cx: 110, cy: 305, w: 95, h: 32 },
  { id: 'STAFF_ROOM_1', name: 'Staff Room 1', sub: 'Faculty Office A', image: './Fnak photos/Rooms/staff-room.jpg', group: 'STAFF_ROOM', cx: 420, cy: 115, w: 90, h: 32 },
  { id: 'STAFF_ROOM_2', name: 'Staff Room 2', sub: 'Faculty Office B', image: './Fnak photos/Rooms/staff-room2.jpg', group: 'STAFF_ROOM', cx: 420, cy: 115, w: 90, h: 32 },
];

export const CAMERAS = ALL_ROOMS;

export const VENT_ROOMS = [
  { id: 'VENT_1', name: 'Vent Entry', sub: 'Duct Intake', image: './Fnak photos/Vents/vents-1.jpg', cx: 80, cy: 60, w: 80, h: 30 },
  { id: 'VENT_2', name: 'Vent Shaft A', sub: 'Upper Bend', image: './Fnak photos/Vents/vents-2.jpg', cx: 200, cy: 60, w: 85, h: 30 },
  { id: 'VENT_3', name: 'Vent Junction', sub: 'Main Hub', image: './Fnak photos/Vents/vents-3.jpg', cx: 200, cy: 150, w: 90, h: 30 },
  { id: 'VENT_4', name: 'Vent Shaft B', sub: 'Lower Bend', image: './Fnak photos/Vents/vents-4.jpg', cx: 320, cy: 150, w: 85, h: 30 },
  { id: 'VENT_5', name: 'Office Vent', sub: 'Desk Grate', image: './Fnak photos/Vents/vents-5.jpg', cx: 320, cy: 240, w: 90, h: 30 },
];

export const ALL_ENEMIES = [
  { id: 'ab', name: 'Abhishek', photo: './Fnak photos/Enemies/AB-random.jpg', jumpscare: './Fnak photos/Enemies/AB-jumpscare.jpg', desc: 'Breaks into office even if door is closed. Freezes when watched. Scare away with Scare Audio [A].' },
  { id: 'aadesh', name: 'Aadesh', photo: './Fnak photos/Enemies/aadesh-frontfacing.jpg', jumpscare: './Fnak photos/Enemies/aadesh-jumpscare.jpg', desc: 'Sneaks to blind spot. Must close door and turn on light [L] to repel.' },
  { id: 'dipu', name: 'Dipu', photo: './Fnak photos/Enemies/dipu-frontfacing.jpg', jumpscare: './Fnak photos/Enemies/dipu-jumpscare.png', desc: 'Sprints from his room if left unwatched. Close door [D] to block his sprint.' },
  { id: 'johann', name: 'Johann', photo: './Fnak photos/Enemies/johann-2.png', jumpscare: './Fnak photos/Enemies/johann-jumpscare.jpg', desc: 'Lurks outside door window. Wear security mask [M] to fool him.' },
  { id: 'ritul', name: 'Ritul', photo: './Fnak photos/Enemies/ritul.png', jumpscare: './Fnak photos/Enemies/ritul2.png', desc: 'Crawls through vents. Switch to Vent Cams to monitor and seal the vent.' },
  { id: 'mahadev', name: 'Mahadev', photo: './Fnak photos/Enemies/mahadev.png', jumpscare: './Fnak photos/Enemies/mahadev3.png', desc: 'Music box counter. Wind his counter on the camera monitor before it runs out.' },
  { id: 'sijin', name: 'Sjinil', photo: './Fnak photos/Enemies/sijin.png', jumpscare: './Fnak photos/Enemies/sijin-2.png', desc: 'Hacker. Re-establish Internet in Maintenance before he hacks the computer (10-30s timer).' },
  { id: 'ryan', name: 'Ryan', photo: './Fnak photos/Enemies/ryan.png', jumpscare: './Fnak photos/Enemies/ryan.png', desc: 'Infiltrates computer files. Delete .exe files before 3:00 AM or face fatal corruption.' },
];

export const UPLOAD_TASKS = [
  { id: 'ligin', name: 'Ligin', label: 'OMR Evaluation', image: './Fnak photos/upload-confirmation.png', desc: 'Classic OMR answer sheet evaluation.' },
  { id: 'sreekala', name: 'Sreekala', label: 'Assignment Batch', image: './Fnak photos/upload-sreekala.png', desc: 'Upload student assignments batch.' },
  { id: 'vijitha', name: 'Vijitha', label: 'PCM Fast Upload', image: './Fnak photos/upload-vijitha.png', desc: 'Faster upload, requires answering a Class 11 PCM question.' },
  { id: 'danny', name: 'Danny', label: 'Vibrant Protocol', image: './Fnak photos/upload-danny.png', desc: 'Energetic protocol: "GOOD EVENING SIR" and "VIBRANT".' },
];

export const DEFAULT_CONFIG = {
  selectedRooms: ['ROOM_A', 'CORRIDOR_A', 'CORRIDOR_B', 'CORRIDOR_C', 'STAIRS', 'BALCONY'],
  selectedEnemies: ['ab', 'aadesh', 'dipu', 'johann'],
  enemyLevels: {
    ab: 10,
    aadesh: 10,
    dipu: 10,
    johann: 10,
    ritul: 10,
    mahadev: 10,
    sijin: 10,
    ryan: 10
  },
  uploadTask: 'ligin',
  hourSeconds: 400 / 6,
  doorWaitTime: 2.5
};

export const INITIAL_RYAN_FILES = [
  { name: 'aahil.jpg', type: 'image', size: '302 KB', transferred: false, src: './Fnak photos/Files-Ryan/aahil.jpg' },
  { name: 'abhishek.jpg', type: 'image', size: '93 KB', transferred: false, src: './Fnak photos/Files-Ryan/abhishek.jpg' },
  { name: 'aswin.jpg', type: 'image', size: '82 KB', transferred: false, src: './Fnak photos/Files-Ryan/aswin.jpg' },
  { name: 'Eshan.jpg', type: 'image', size: '450 KB', transferred: false, src: './Fnak photos/Files-Ryan/Eshan.jpg' },
  { name: 'free-gta6.exe', type: 'exe', size: '38 KB', transferred: false, deleted: false, src: './Fnak photos/Files-Ryan/free-gta6.webp' },
  { name: 'joewyn-confront.png', type: 'image', size: '970 KB', transferred: false, src: './Fnak photos/Files-Ryan/joewyn-confront.png' },
  { name: 'question-paper.exe', type: 'exe', size: '28 KB', transferred: false, deleted: false, src: './Fnak photos/Files-Ryan/qn-paper.jpg' },
  { name: 'ryan.jpg', type: 'image', size: '714 KB', transferred: false, src: './Fnak photos/Files-Ryan/ryan.jpg' },
  { name: 'sijinil.jpg', type: 'image', size: '315 KB', transferred: false, src: './Fnak photos/Files-Ryan/sijinil.jpg' },
];

export function getUsageBars(state) {
  if (!state || state.isBlackout) return 0;
  let bars = 1;
  if (state.isDoorClosed) bars += 2;
  if (state.isLightOn) bars += 1;
  if (state.isMonitorOpen) bars += 1;
  return Math.min(5, bars);
}

export class GameState {
  constructor(customConfig = null) {
    const config = { ...DEFAULT_CONFIG, ...(customConfig || {}) };
    this.customConfig = config;

    // Room Selection
    this.selectedRooms = Array.isArray(config.selectedRooms) && config.selectedRooms.length >= 6
      ? config.selectedRooms
      : DEFAULT_CONFIG.selectedRooms;

    // Active Camera objects
    this.activeCameras = ALL_ROOMS.filter(r => this.selectedRooms.includes(r.id));
    if (this.activeCameras.length === 0) {
      this.activeCameras = ALL_ROOMS.slice(0, 6);
      this.selectedRooms = this.activeCameras.map(c => c.id);
    }

    // Enemy Selection
    this.selectedEnemies = Array.isArray(config.selectedEnemies) && config.selectedEnemies.length >= 3
      ? config.selectedEnemies
      : DEFAULT_CONFIG.selectedEnemies;

    // AI Levels
    const levels = config.enemyLevels || {};
    this.abLevel = levels.ab ?? 10;
    this.aadeshLevel = levels.aadesh ?? 10;
    this.dipuLevel = levels.dipu ?? 10;
    this.johannLevel = levels.johann ?? 10;
    this.ritulLevel = levels.ritul ?? 10;
    this.mahadevLevel = levels.mahadev ?? 10;
    this.sijinLevel = levels.sijin ?? 10;
    this.ryanLevel = levels.ryan ?? 10;

    // Upload Task
    this.uploadTask = config.uploadTask || 'ligin';

    // Shift & Time Progression
    this.hourSeconds = config.hourSeconds || (400 / 6);
    this.doorWaitTime = config.doorWaitTime || 2.5;
    this.time = 0; // 0 = 12 AM .. 6 = 6 AM
    this.timeProgress = 0;
    this.power = 100.0;
    this.isBlackout = false;
    this.isDoorClosed = false;
    this.isLightOn = false;
    this.isMonitorOpen = false;
    this.isMaskOn = false;
    this.scareCooldown = 0;
    this.isGameOver = false;
    this.isGameWon = false;
    this.jumpscareWho = null;

    // Current camera view
    this.currentCam = this.activeCameras[0]?.id || 'ROOM_A';
    this.isVentCamMode = false;
    this.currentVentCam = 'VENT_1';

    // Generator
    this.isGeneratorAvailable = true;
    this.isGeneratorUsed = false;
    this.isGeneratorPrimed = false;
    this.generatorBonus = 0;

    // FNAF 3 Maintenance System
    // Subsystems: Internet, Cameras, Sounds, Vents
    this.maintenance = {
      internet: 'OK', // 'OK' | 'ERROR' | 'REBOOTING'
      cameras: 'OK',
      sounds: 'OK',
      vents: 'OK',
      rebootingSystem: null,
      rebootTimer: 0,
      nextGlitchTimer: 25 + Math.random() * 30
    };

    // Ritul (Vents)
    this.ritul = {
      enabled: this.selectedEnemies.includes('ritul'),
      pos: 'VENT_1', // VENT_1 -> VENT_2 -> VENT_3 -> VENT_4 -> VENT_5 -> OFFICE
      timer: 0,
      sealedVent: null,
      officeTimer: 0
    };

    // Mahadev (Music Box / Counter)
    this.mahadev = {
      enabled: this.selectedEnemies.includes('mahadev'),
      counter: 100, // 0 to 100%
      isWinding: false,
      drainRate: 1.5 + (this.mahadevLevel * 0.15) // % per second
    };

    // Sjinil (Hacker)
    // Hacks computer if internet goes out for more than 10-30s depending on AI level
    const maxHackWait = Math.max(10, 30 - this.sijinLevel * 0.9);
    this.sijin = {
      enabled: this.selectedEnemies.includes('sijin'),
      maxWait: maxHackWait,
      offlineTimer: 0,
      isHacking: false,
      hasHacked: false
    };

    // Ryan (Files)
    this.ryan = {
      enabled: this.selectedEnemies.includes('ryan'),
      files: INITIAL_RYAN_FILES.map(f => ({ ...f })),
      penetrated: false,
      cooked: false
    };

    // Animatronics - Classic 4
    const firstRoom = this.activeCameras[0]?.id || 'ROOM_A';
    const midRoom = this.activeCameras[Math.floor(this.activeCameras.length / 2)]?.id || 'CORRIDOR_A';
    const stairRoom = this.activeCameras.find(c => c.id === 'STAIRS')?.id || midRoom;
    const supplyRoom = this.activeCameras.find(c => c.id === 'CORRIDOR_B')?.id || firstRoom;
    const balconyRoom = this.activeCameras.find(c => c.id === 'BALCONY')?.id || firstRoom;

    this.ab = {
      enabled: this.selectedEnemies.includes('ab'),
      location: firstRoom,
      atDoorTimer: 0,
      hasBangedDoor: false,
    };

    this.dipu = {
      enabled: this.selectedEnemies.includes('dipu'),
      room: supplyRoom,
      stage: 0,
      sprintTimer: 0,
      stallTimer: 0,
    };

    this.aadesh = {
      enabled: this.selectedEnemies.includes('aadesh'),
      location: stairRoom,
      atBlindSpotTimer: 0,
      wasDoorClosedWhilePresent: false,
    };

    this.johann = {
      enabled: this.selectedEnemies.includes('johann'),
      location: balconyRoom,
      timer: 0,
      hasBanged: false,
      maskTimer: 0,
    };

    // Desk Monitor & Uploads
    this.omrUploadCount = 0;
    this.omrUploadsInCycle = 0;
    this.omrQuota = 2;
    this.omrMaxCooldown = 12;
    this.omrCooldown = 0;
    this.isOmrUploading = false;
  }

  getUsageBars() {
    return getUsageBars(this);
  }

  // Toggle Vent Cam Mode
  toggleVentCamMode() {
    this.isVentCamMode = !this.isVentCamMode;
    return this.isVentCamMode;
  }

  // Seal / Unseal a vent against Ritul
  toggleSealVent(ventId) {
    if (this.ritul.sealedVent === ventId) {
      this.ritul.sealedVent = null;
    } else {
      this.ritul.sealedVent = ventId;
      // If Ritul was in this vent, push him back
      if (this.ritul.pos === ventId) {
        this.ritul.pos = 'VENT_1';
        this.ritul.timer = 0;
      }
    }
    return this.ritul.sealedVent;
  }

  // Wind Mahadev's Music Box Counter
  startWindingMahadev() {
    this.mahadev.isWinding = true;
  }

  stopWindingMahadev() {
    this.mahadev.isWinding = false;
  }

  // Maintenance reboot action
  rebootMaintenanceSystem(systemName, onEvent = null) {
    if (this.maintenance.rebootingSystem) return false;
    if (this.maintenance[systemName] !== 'ERROR') return false;

    this.maintenance.rebootingSystem = systemName;
    this.maintenance[systemName] = 'REBOOTING';
    this.maintenance.rebootTimer = 4.0; // 4 seconds to reboot
    if (onEvent) onEvent({ type: 'MAINTENANCE_REBOOT_START', system: systemName });
    return true;
  }

  rebootAllMaintenanceSystems(onEvent = null) {
    if (this.maintenance.rebootingSystem) return false;
    const errors = ['internet', 'cameras', 'sounds', 'vents'].filter(s => this.maintenance[s] === 'ERROR');
    if (errors.length === 0) return false;

    this.maintenance.rebootingSystem = 'ALL';
    errors.forEach(s => { this.maintenance[s] = 'REBOOTING'; });
    this.maintenance.rebootTimer = 6.0;
    if (onEvent) onEvent({ type: 'MAINTENANCE_REBOOT_ALL_START' });
    return true;
  }

  // File Transfer in Ryan's system
  transferFile(fileName, onEvent = null) {
    const file = this.ryan.files.find(f => f.name === fileName);
    if (!file) return false;
    file.transferred = true;
    if (onEvent) onEvent({ type: 'FILE_TRANSFERRED', fileName });
    return true;
  }

  // Delete suspicious .exe in Ryan's system
  deleteFile(fileName, onEvent = null) {
    const file = this.ryan.files.find(f => f.name === fileName);
    if (!file) return false;
    file.deleted = true;
    if (onEvent) onEvent({ type: 'FILE_DELETED', fileName });
    return true;
  }

  // Click on .exe file (triggers Ryan penetration glitch!)
  runFile(fileName, onEvent = null) {
    const file = this.ryan.files.find(f => f.name === fileName);
    if (!file) return false;
    if (file.type === 'exe' && !file.deleted) {
      this.ryan.penetrated = true;
      if (onEvent) onEvent({ type: 'RYAN_PENETRATED' });
      return true;
    }
    return false;
  }

  // Auxiliary Power Generator
  solveGeneratorWirePuzzle(onEvent = null) {
    if (!this.isGeneratorAvailable || this.isGeneratorUsed) return { activated: false, primed: false };
    const powerBonus = Math.floor(Math.random() * 6) + 10;
    this.generatorBonus = powerBonus;

    if (this.power <= 0 || this.isBlackout) {
      return this.activateGenerator(onEvent);
    }

    this.isGeneratorPrimed = true;
    if (onEvent) onEvent({ type: 'GENERATOR_PRIMED', powerBonus });
    return { activated: false, primed: true, powerBonus };
  }

  activateGenerator(onEvent = null) {
    if (!this.isGeneratorAvailable || this.isGeneratorUsed) return { activated: false, powerRestored: 0 };
    const powerRestored = this.generatorBonus || (Math.floor(Math.random() * 6) + 10);
    this.power = Math.min(100, this.power + powerRestored);
    this.isGeneratorUsed = true;
    this.isGeneratorPrimed = false;
    if (this.isBlackout) {
      this.isBlackout = false;
      this.blackoutTimer = 0;
    }
    if (onEvent) onEvent({ type: 'GENERATOR_ACTIVATED', powerRestored, newPower: this.power });
    return { activated: true, powerRestored, newPower: this.power };
  }

  toggleDoor(onEvent) {
    if (this.isBlackout) return false;
    const willClose = !this.isDoorClosed;
    this.isDoorClosed = willClose;

    if (willClose) {
      if (this.aadesh.enabled && this.aadesh.location === 'BLIND_SPOT') {
        this.aadesh.wasDoorClosedWhilePresent = true;
        if (this.isLightOn) {
          this.defendAadesh(onEvent);
          return true;
        }
      }
      return false;
    } else {
      if (this.aadesh.enabled && this.aadesh.location === 'BLIND_SPOT') {
        this.aadesh.wasDoorClosedWhilePresent = false;
      }
    }
    return false;
  }

  toggleLight(onEvent) {
    if (this.isBlackout) return false;
    this.isLightOn = !this.isLightOn;

    if (this.aadesh.enabled && this.isLightOn && this.isDoorClosed && this.aadesh.location === 'BLIND_SPOT') {
      this.defendAadesh(onEvent);
      return true;
    }
    return false;
  }

  defendAadesh(onEvent) {
    const resetRoom = this.activeCameras.find(c => c.id === 'STAIRS')?.id || this.activeCameras[0]?.id || 'STAIRS';
    this.aadesh.location = resetRoom;
    this.aadesh.atBlindSpotTimer = 0;
    this.aadesh.wasDoorClosedWhilePresent = false;
    if (onEvent) onEvent({ type: 'DOOR_DEFENSE', animatronic: 'aadesh' });
  }

  toggleMask(onEvent) {
    if (this.isBlackout || this.isOmrUploading) return false;
    if (!this.isMaskOn && this.isMonitorOpen) {
      this.isMonitorOpen = false;
    }
    this.isMaskOn = !this.isMaskOn;

    if (onEvent) onEvent({ type: 'MASK_TOGGLE', isMaskOn: this.isMaskOn });

    if (this.johann.enabled && this.isMaskOn && this.johann.location === 'DOOR') {
      this.johann.maskTimer = 0.5;
    }

    return this.isMaskOn;
  }

  playScareAudio(targetCam = null, onEvent = null) {
    if (this.scareCooldown > 0) {
      return { success: false, reason: 'COOLDOWN', remaining: this.scareCooldown };
    }
    if (this.maintenance.sounds === 'ERROR') {
      return { success: false, reason: 'MAINTENANCE_ERROR' };
    }

    this.scareCooldown = 10.0;
    const room = targetCam || this.currentCam || 'CORRIDOR_C';
    let abAffected = false;
    let newLocation = null;

    if (this.ab.enabled) {
      const isAbAtDoor = (this.ab.location === 'DOOR');
      const isAbInRoom = (this.ab.location === room);

      if (isAbAtDoor && (room === 'CORRIDOR_C' || room === 'DOOR')) {
        abAffected = true;
        this.ab.atDoorTimer = 0;
        this.ab.hasBangedDoor = false;
        const awayChoices = this.activeCameras.filter(c => c.id !== 'CORRIDOR_C');
        newLocation = awayChoices[Math.floor(Math.random() * awayChoices.length)]?.id || this.activeCameras[0]?.id;
        this.ab.location = newLocation;
      } else if (isAbInRoom) {
        abAffected = true;
        this.ab.atDoorTimer = 0;
        this.ab.hasBangedDoor = false;
        const awayChoices = this.activeCameras.filter(c => c.id !== room);
        newLocation = awayChoices[Math.floor(Math.random() * awayChoices.length)]?.id || this.activeCameras[0]?.id;
        this.ab.location = newLocation;
      }
    }

    if (onEvent) {
      onEvent({ type: 'SCARE_AUDIO_PLAYED', room, abAffected, newLocation });
      if (abAffected) onEvent({ type: 'AB_SCARED', to: newLocation });
    }

    return { success: true, abAffected, newLocation, room };
  }

  skipHour(onEvent) {
    if (this.isGameOver || this.isGameWon) return;
    this.time += 1;
    if (this.time >= 6) {
      this.time = 6;
      this.timeProgress = 0;
      this.isGameWon = true;
      if (onEvent) {
        onEvent({ type: 'HOUR_CHANGE', hour: this.time });
        onEvent({ type: 'GAME_WIN' });
      }
      return;
    }
    if (onEvent) onEvent({ type: 'HOUR_CHANGE', hour: this.time });
  }

  completeOmrUpload(onEvent) {
    if (this.isGameOver || this.isGameWon) return { hourSkipped: false, newHour: this.time };

    this.omrCooldown = this.omrMaxCooldown;
    this.omrUploadCount += 1;
    this.omrUploadsInCycle += 1;

    let hourSkipped = false;
    if (this.omrUploadsInCycle >= this.omrQuota) {
      this.omrUploadsInCycle = 0;
      hourSkipped = true;
      this.skipHour(onEvent);
    }

    if (onEvent) {
      onEvent({
        type: 'OMR_UPLOAD_COMPLETE',
        totalUploads: this.omrUploadCount,
        uploadsInCycle: this.omrUploadsInCycle,
        quota: this.omrQuota,
        hourSkipped,
        hour: this.time,
      });
    }

    return { hourSkipped, newHour: this.time };
  }

  tick(dt, onEvent) {
    if (this.isGameOver || this.isGameWon) return;

    // Scare cooldown
    if (this.scareCooldown > 0) {
      this.scareCooldown = Math.max(0, this.scareCooldown - dt);
    }

    // OMR cooldown
    if (this.omrCooldown > 0) {
      this.omrCooldown = Math.max(0, this.omrCooldown - dt);
    }

    // Time Progression
    if (!this.isBlackout) {
      this.timeProgress += dt / this.hourSeconds;
      if (this.timeProgress >= 1) {
        this.timeProgress = 0;
        this.time += 1;
        onEvent({ type: 'HOUR_CHANGE', hour: this.time });

        // Ryan 3:00 AM check
        if (this.time === 3 && this.ryan.enabled && !this.ryan.cooked) {
          const undeletedExes = this.ryan.files.filter(f => f.type === 'exe' && !f.deleted);
          if (undeletedExes.length > 0) {
            this.ryan.cooked = true;
            onEvent({ type: 'RYAN_COOKED_COMPUTER' });
            setTimeout(() => {
              this.triggerJumpscare('ryan', onEvent);
            }, 3000);
            return;
          }
        }

        if (this.time >= 6) {
          this.time = 6;
          this.timeProgress = 0;
          this.isGameWon = true;
          onEvent({ type: 'GAME_WIN' });
          return;
        }
      }
    }

    // Power Drain
    if (!this.isBlackout) {
      if (!this.isOmrUploading) {
        const usage = this.getUsageBars();
        let drainPerSec = 0.20 * (1 + (usage - 1) * 0.65);
        if (this.maintenance.vents === 'ERROR') drainPerSec *= 1.35; // ventilation error drains more power

        this.power = Math.max(0, this.power - drainPerSec * dt);

        if (this.power <= 0) {
          if (this.isGeneratorAvailable && this.isGeneratorPrimed && !this.isGeneratorUsed) {
            this.activateGenerator(onEvent);
            return;
          }
          this.isBlackout = true;
          this.isDoorClosed = false;
          this.isLightOn = false;
          this.isMonitorOpen = false;
          this.isMaskOn = false;
          onEvent({ type: 'BLACKOUT_START' });
          return;
        }
      }
    }

    // Blackout
    if (this.isBlackout) {
      this.blackoutTimer = (this.blackoutTimer || 0) + dt;
      if (this.blackoutTimer > 9 + Math.random() * 5) {
        this.triggerJumpscare('ab', onEvent);
      }
      return;
    }

    // Maintenance System Glitches & Reboot progress
    this.updateMaintenance(dt, onEvent);

    // Mahadev (Music Box Counter)
    if (this.mahadev.enabled) {
      this.updateMahadev(dt, onEvent);
    }

    // Sjinil (Hacker)
    if (this.sijin.enabled) {
      this.updateSijin(dt, onEvent);
    }

    // Ritul (Vents)
    if (this.ritul.enabled) {
      this.updateRitul(dt, onEvent);
    }

    // Classic 4
    if (this.ab.enabled) this.updateAB(dt, onEvent);
    if (this.johann.enabled) this.updateJohann(dt, onEvent);
    if (this.aadesh.enabled) this.updateAadesh(dt, onEvent);
    if (this.dipu.enabled) this.updateDipu(dt, onEvent);
  }

  // --- Maintenance Loop ---
  updateMaintenance(dt, onEvent) {
    // Process reboot
    if (this.maintenance.rebootingSystem) {
      this.maintenance.rebootTimer -= dt;
      if (this.maintenance.rebootTimer <= 0) {
        if (this.maintenance.rebootingSystem === 'ALL') {
          ['internet', 'cameras', 'sounds', 'vents'].forEach(s => { this.maintenance[s] = 'OK'; });
        } else {
          this.maintenance[this.maintenance.rebootingSystem] = 'OK';
        }
        const sys = this.maintenance.rebootingSystem;
        this.maintenance.rebootingSystem = null;
        if (onEvent) onEvent({ type: 'MAINTENANCE_REBOOT_COMPLETE', system: sys });
      }
    }

    // Random failure tick
    this.maintenance.nextGlitchTimer -= dt;
    if (this.maintenance.nextGlitchTimer <= 0) {
      this.maintenance.nextGlitchTimer = 35 + Math.random() * 45;
      const systems = ['internet', 'cameras', 'sounds', 'vents'].filter(s => this.maintenance[s] === 'OK');
      if (systems.length > 0) {
        const failSys = systems[Math.floor(Math.random() * systems.length)];
        this.maintenance[failSys] = 'ERROR';
        if (onEvent) onEvent({ type: 'MAINTENANCE_SYSTEM_ERROR', system: failSys });
      }
    }
  }

  // --- Mahadev (Music Box) ---
  updateMahadev(dt, onEvent) {
    if (this.mahadev.isWinding) {
      this.mahadev.counter = Math.min(100, this.mahadev.counter + 24 * dt);
    } else {
      this.mahadev.counter = Math.max(0, this.mahadev.counter - this.mahadev.drainRate * dt);
      if (this.mahadev.counter <= 0) {
        this.triggerJumpscare('mahadev', onEvent);
      }
    }
  }

  // --- Sjinil (Hacker) ---
  updateSijin(dt, onEvent) {
    if (this.maintenance.internet === 'ERROR') {
      this.sijin.offlineTimer += dt;
      if (this.sijin.offlineTimer >= this.sijin.maxWait && !this.sijin.hasHacked) {
        this.sijin.hasHacked = true;
        this.sijin.isHacking = true;
        if (onEvent) onEvent({ type: 'SJINIL_HACKED_COMPUTER' });
        setTimeout(() => {
          this.triggerJumpscare('sijin', onEvent);
        }, 3200);
      }
    } else {
      this.sijin.offlineTimer = Math.max(0, this.sijin.offlineTimer - dt * 1.5);
    }
  }

  // --- Ritul (Vents) ---
  updateRitul(dt, onEvent) {
    const ventSequence = ['VENT_1', 'VENT_2', 'VENT_3', 'VENT_4', 'VENT_5', 'OFFICE'];
    const currentIdx = ventSequence.indexOf(this.ritul.pos);

    if (this.ritul.pos === 'OFFICE') {
      this.ritul.officeTimer += dt;
      if (this.ritul.officeTimer >= 2.5) {
        this.triggerJumpscare('ritul', onEvent);
      }
      return;
    }

    this.ritul.timer += dt;
    const stepDuration = Math.max(4.0, 16.0 - this.ritulLevel * 0.6);

    if (this.ritul.timer >= stepDuration) {
      this.ritul.timer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.ritulLevel) {
        const nextVent = ventSequence[currentIdx + 1];

        // Check if next vent is sealed
        if (this.ritul.sealedVent === nextVent) {
          // Blocked by vent seal! Push back to VENT_1
          this.ritul.pos = 'VENT_1';
          if (onEvent) onEvent({ type: 'RITUL_BLOCKED_BY_VENT_SEAL' });
        } else {
          this.ritul.pos = nextVent;
          if (nextVent === 'OFFICE') {
            this.ritul.officeTimer = 0;
            if (onEvent) onEvent({ type: 'RITUL_AT_OFFICE_VENT' });
          } else {
            if (onEvent) onEvent({ type: 'RITUL_VENT_MOVE', vent: nextVent });
          }
        }
      }
    }
  }

  // --- Abhishek (AB) ---
  updateAB(dt, onEvent) {
    if (this.isMonitorOpen && !this.isVentCamMode && this.currentCam === this.ab.location && this.ab.location !== 'DOOR') {
      this.abMoveTimer = 0;
      return;
    }

    if (this.ab.location === 'DOOR') {
      this.ab.atDoorTimer += dt;
      if (this.isDoorClosed && !this.ab.hasBangedDoor && this.ab.atDoorTimer >= 1.2) {
        this.ab.hasBangedDoor = true;
        onEvent({ type: 'AB_BREAKING_IN' });
      }
      if (this.ab.atDoorTimer >= this.doorWaitTime) {
        this.triggerJumpscare('ab', onEvent);
      }
      return;
    }

    this.abMoveTimer = (this.abMoveTimer || 0) + dt;
    if (this.abMoveTimer >= 3.8) {
      this.abMoveTimer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.abLevel) {
        // Find next step in selected rooms leading towards office
        const candidateRooms = this.activeCameras.map(c => c.id).filter(id => id !== this.ab.location);
        const rollStep = Math.random();

        if (rollStep < 0.45 && candidateRooms.length > 0) {
          this.ab.location = candidateRooms[Math.floor(Math.random() * candidateRooms.length)];
          onEvent({ type: 'MOVEMENT', animatronic: 'ab', to: this.ab.location });
        } else if (rollStep < 0.8) {
          const nearOffice = this.activeCameras.find(c => c.id === 'CORRIDOR_C')?.id || candidateRooms[0] || 'DOOR';
          if (this.ab.location === nearOffice) {
            this.ab.location = 'DOOR';
            this.ab.atDoorTimer = 0;
            this.ab.hasBangedDoor = false;
            onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'ab' });
          } else {
            this.ab.location = nearOffice;
            onEvent({ type: 'MOVEMENT', animatronic: 'ab', to: this.ab.location });
          }
        } else {
          this.ab.location = 'DOOR';
          this.ab.atDoorTimer = 0;
          this.ab.hasBangedDoor = false;
          onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'ab' });
        }
      }
    }
  }

  // --- Johann ---
  updateJohann(dt, onEvent) {
    if (this.isMonitorOpen && !this.isVentCamMode && this.currentCam === this.johann.location && this.johann.location !== 'DOOR') {
      this.johannMoveTimer = 0;
      return;
    }

    if (this.johann.location === 'DOOR') {
      this.johann.timer += dt;
      if (this.isMaskOn) {
        this.johann.maskTimer += dt;
        if (this.johann.maskTimer >= 0.8) {
          const resetRoom = this.activeCameras.find(c => c.id === 'BALCONY')?.id || this.activeCameras[0]?.id;
          this.johann.location = resetRoom;
          this.johann.timer = 0;
          this.johann.hasBanged = false;
          this.johann.maskTimer = 0;
          if (onEvent) onEvent({ type: 'JOHANN_RETREAT', to: this.johann.location });
          return;
        }
      } else {
        this.johann.maskTimer = 0;
      }

      if (this.johann.timer >= 2.0 && !this.johann.hasBanged) {
        this.johann.hasBanged = true;
        if (onEvent) onEvent({ type: 'JOHANN_BANG' });
      }

      if (this.johann.timer >= 5.0) {
        this.triggerJumpscare('johann', onEvent);
      }
      return;
    }

    this.johannMoveTimer = (this.johannMoveTimer || 0) + dt;
    if (this.johannMoveTimer >= 4.0) {
      this.johannMoveTimer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.johannLevel) {
        const candidateRooms = this.activeCameras.map(c => c.id).filter(id => id !== this.johann.location);
        if (Math.random() < 0.6 && candidateRooms.length > 0) {
          this.johann.location = candidateRooms[Math.floor(Math.random() * candidateRooms.length)];
          onEvent({ type: 'MOVEMENT', animatronic: 'johann', to: this.johann.location });
        } else {
          this.johann.location = 'DOOR';
          this.johann.timer = 0;
          this.johann.hasBanged = false;
          this.johann.maskTimer = 0;
          onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'johann' });
          onEvent({ type: 'JOHANN_AT_DOOR' });
        }
      }
    }
  }

  // --- Aadesh ---
  updateAadesh(dt, onEvent) {
    if (this.aadesh.location === 'BLIND_SPOT') {
      if (this.isDoorClosed && this.isLightOn) {
        this.defendAadesh(onEvent);
        return;
      }
      if (!this.isDoorClosed) {
        this.aadesh.atBlindSpotTimer += dt;
        if (this.aadesh.atBlindSpotTimer >= this.doorWaitTime) {
          this.triggerJumpscare('aadesh', onEvent);
        }
      }
      return;
    }

    this.aadeshMoveTimer = (this.aadeshMoveTimer || 0) + dt;
    if (this.aadeshMoveTimer >= 3.6) {
      this.aadeshMoveTimer = 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= this.aadeshLevel) {
        const candidateRooms = this.activeCameras.map(c => c.id).filter(id => id !== this.aadesh.location);
        if (Math.random() < 0.65 && candidateRooms.length > 0) {
          this.aadesh.location = candidateRooms[Math.floor(Math.random() * candidateRooms.length)];
          onEvent({ type: 'MOVEMENT', animatronic: 'aadesh', to: this.aadesh.location });
        } else {
          this.aadesh.location = 'BLIND_SPOT';
          this.aadesh.atBlindSpotTimer = 0;
          this.aadesh.wasDoorClosedWhilePresent = this.isDoorClosed;
          onEvent({ type: 'ENEMY_AT_DOOR', animatronic: 'aadesh' });
        }
      }
    }
  }

  // --- Dipu ---
  updateDipu(dt, onEvent) {
    const isWatchingDipu = this.isMonitorOpen && !this.isVentCamMode && this.currentCam === this.dipu.room;

    if (this.dipu.stage === 0 || this.dipu.stage === 1) {
      if (isWatchingDipu) {
        this.dipu.stallTimer = 0;
        return;
      }
      this.dipu.stallTimer += dt;
      const advanceThreshold = Math.max(5, 17 - this.dipuLevel * 0.7);
      if (this.dipu.stallTimer >= advanceThreshold) {
        this.dipu.stallTimer = 0;
        this.dipu.stage += 1;
        onEvent({ type: 'DIPU_STAGE', stage: this.dipu.stage });
        if (this.dipu.stage === 2) {
          this.dipu.sprintTimer = 0;
          onEvent({ type: 'DIPU_SPRINT' });
        }
      }
    } else if (this.dipu.stage === 2) {
      this.dipu.sprintTimer += dt;
      if (this.dipu.sprintTimer >= 2.6) {
        if (this.isDoorClosed) {
          onEvent({ type: 'DOOR_DEFENSE', animatronic: 'dipu' });
          this.dipu.stage = 0;
          this.dipu.sprintTimer = 0;
          this.dipu.stallTimer = 0;
          this.power = Math.max(0, this.power - 4);
        } else {
          this.triggerJumpscare('dipu', onEvent);
        }
      }
    }
  }

  triggerJumpscare(who, onEvent) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.jumpscareWho = who;
    this.isMonitorOpen = false;
    this.isMaskOn = false;
    if (onEvent) onEvent({ type: 'JUMPSCARE', animatronic: who });
  }
}
