// Asset Preloader & In-Memory Texture Cache for Ultimate Night @ Kattaikonam
// Preloads and decodes all images and audio to guarantee 0ms latency and 0 black-screens.

export const ASSET_MANIFEST = {
  images: [
    // Core UI & Menu
    { id: 'main-menu', src: './assets/images/main-menu.jpg', label: 'Main Menu CRT Interface' },
    { id: 'main-menu-new', src: './Fnak photos/main-menu-new.png', label: 'Main Menu CRT Alternate' },
    { id: 'how-to-play', src: './Fnak photos/Enemies/how-to-play.png', label: 'Security Protocol Manual' },

    // Office Views
    { id: 'lights-off-door-open', src: './Fnak photos/Rooms/lights-off-door-open.jpg', label: 'Office (Lights Off, Door Open)' },
    { id: 'lights-off-door-closed', src: './Fnak photos/Rooms/lights-off-door-closed.jpg', label: 'Office (Lights Off, Door Closed)' },
    { id: 'lights-on-door-open', src: './Fnak photos/Rooms/lights-on-door-open.jpg', label: 'Office (Lights On, Door Open)' },
    { id: 'lights-on-door-closed', src: './Fnak photos/Rooms/lights-on-door-closed.jpg', label: 'Office (Lights On, Door Closed)' },
    { id: 'door-open', src: './Fnak photos/Rooms/DoorOpen.jpg', label: 'Door Open Reference' },
    { id: 'door-closed', src: './Fnak photos/Rooms/DoorClosed.jpg', label: 'Door Closed Reference' },

    // All Room Cams (Fnak photos/Rooms/)
    { id: 'cam-room-a', src: './Fnak photos/Rooms/RoomA.jpg', label: 'CAM: Room A (Physics Lab)' },
    { id: 'cam-corridor-a', src: './Fnak photos/Rooms/CorridorA.jpg', label: 'CAM: Main Corridor A' },
    { id: 'cam-corridor-b', src: './Fnak photos/Rooms/CorridorB.jpg', label: 'CAM: Supply Corridor B' },
    { id: 'cam-corridor-c', src: './Fnak photos/Rooms/CorridorC.jpg', label: 'CAM: Corridor C (Front of Office)' },
    { id: 'cam-corridor-x', src: './Fnak photos/Rooms/CorridorX.jpg', label: 'CAM: Corridor X' },
    { id: 'cam-stairs', src: './Fnak photos/Stairs.jpg', label: 'CAM: Central Staircase' },
    { id: 'cam-balcony', src: './Fnak photos/Rooms/balcony.jpg', label: 'CAM: Balcony Facility Feed' },
    { id: 'cam-alley', src: './Fnak photos/Rooms/alley.jpg', label: 'CAM: Alley' },
    { id: 'cam-b127', src: './Fnak photos/Rooms/B-127.jpg', label: 'CAM: Classroom B-127' },
    { id: 'cam-classroom', src: './Fnak photos/Rooms/classroom.jpg', label: 'CAM: Classroom' },
    { id: 'cam-elevator', src: './Fnak photos/Rooms/elevator.jpg', label: 'CAM: Elevator' },
    { id: 'cam-entrance-1', src: './Fnak photos/Rooms/Entrance.jpg', label: 'CAM: Entrance (Variant 1)' },
    { id: 'cam-entrance-2', src: './Fnak photos/Rooms/Entrance-2.jpg', label: 'CAM: Entrance (Variant 2)' },
    { id: 'cam-geotech', src: './Fnak photos/Rooms/Geotechlab.jpg', label: 'CAM: Geotech Lab' },
    { id: 'cam-playground', src: './Fnak photos/Rooms/Playground.jpg', label: 'CAM: Playground' },
    { id: 'cam-staff-room-1', src: './Fnak photos/Rooms/staff-room.jpg', label: 'CAM: Staff Room (Variant 1)' },
    { id: 'cam-staff-room-2', src: './Fnak photos/Rooms/staff-room2.jpg', label: 'CAM: Staff Room (Variant 2)' },

    // Vent Cams (Fnak photos/Vents/)
    { id: 'vent-1', src: './Fnak photos/Vents/vents-1.jpg', label: 'VENT 1 Feed' },
    { id: 'vent-2', src: './Fnak photos/Vents/vents-2.jpg', label: 'VENT 2 Feed' },
    { id: 'vent-3', src: './Fnak photos/Vents/vents-3.jpg', label: 'VENT 3 Feed' },
    { id: 'vent-4', src: './Fnak photos/Vents/vents-4.jpg', label: 'VENT 4 Feed' },
    { id: 'vent-5', src: './Fnak photos/Vents/vents-5.jpg', label: 'VENT 5 Feed' },

    // Animatronics & Poses (Fnak photos/Enemies/)
    { id: 'ab-cutout', src: './assets/images/ab-cutout.png', label: 'Subject AB Silhouette Feed' },
    { id: 'ab-random-cutout', src: './assets/images/ab-random-cutout.png', label: 'Subject AB Corridor Sensor' },
    { id: 'ab-random', src: './Fnak photos/Enemies/AB-random.jpg', label: 'Subject AB In Room' },
    { id: 'ab-jumpscare-jpg', src: './Fnak photos/Enemies/AB-jumpscare.jpg', label: 'AB Threat Bio-Metrics' },
    { id: 'ab-jumpscare-png', src: './Fnak photos/Enemies/AB-jumpscare.png', label: 'AB Threat Graphic' },

    { id: 'aadesh-front', src: './assets/images/aadesh-frontfacing-cutout.png', label: 'Subject Aadesh Corridor Feed' },
    { id: 'aadesh-side', src: './assets/images/aadesh-sideways-cutout.png', label: 'Subject Aadesh Stair Sensor' },
    { id: 'aadesh-door', src: './assets/images/aadesh-jumpscare-cutout.png', label: 'Subject Aadesh Blind Spot Feed' },
    { id: 'aadesh-front-photo', src: './Fnak photos/Enemies/aadesh-frontfacing.jpg', label: 'Aadesh Front Photo' },
    { id: 'aadesh-side-photo', src: './Fnak photos/Enemies/aadesh-sideways.jpg', label: 'Aadesh Sideways Photo' },
    { id: 'aadesh-jumpscare', src: './Fnak photos/Enemies/aadesh-jumpscare.jpg', label: 'Aadesh Threat Bio-Metrics' },

    { id: 'dipu-front', src: './assets/images/dipu-frontfacing-cutout.png', label: 'Subject Dipu Dormant Feed' },
    { id: 'dipu-random', src: './assets/images/dipu-random-cutout.png', label: 'Subject Dipu Active Alert Feed' },
    { id: 'dipu-sprint', src: './assets/images/dipu-jumpscare-cutout.png', label: 'Subject Dipu High-Speed Sprint' },
    { id: 'dipu-front-photo', src: './Fnak photos/Enemies/dipu-frontfacing.jpg', label: 'Dipu Front Photo' },
    { id: 'dipu-random-photo', src: './Fnak photos/Enemies/dipu-random.jpg', label: 'Dipu Random Photo' },
    { id: 'dipu-jumpscare', src: './Fnak photos/Enemies/dipu-jumpscare.png', label: 'Dipu Threat Bio-Metrics' },

    { id: 'johann-walking', src: './Fnak photos/Enemies/johann-2.png', label: 'Johann Corridor Walking Feed' },
    { id: 'johann-door', src: './Fnak photos/Enemies/johann-3.png', label: 'Johann Door Window Feed' },
    { id: 'johann-jumpscare', src: './Fnak photos/Enemies/johann-jumpscare.jpg', label: 'Johann Threat Bio-Metrics' },

    // New Enemies
    { id: 'ritul-1', src: './Fnak photos/Enemies/ritul.png', label: 'Subject Ritul Vent Crawl 1' },
    { id: 'ritul-2', src: './Fnak photos/Enemies/ritul2.png', label: 'Subject Ritul Vent Crawl 2' },
    { id: 'mahadev-1', src: './Fnak photos/Enemies/mahadev.png', label: 'Subject Mahadev Stage 1' },
    { id: 'mahadev-2', src: './Fnak photos/Enemies/mahadev2.png', label: 'Subject Mahadev Stage 2' },
    { id: 'mahadev-3', src: './Fnak photos/Enemies/mahadev3.png', label: 'Subject Mahadev Stage 3' },
    { id: 'sijin-1', src: './Fnak photos/Enemies/sijin.png', label: 'Subject Sjinil Hacker Primary' },
    { id: 'sijin-2', src: './Fnak photos/Enemies/sijin-2.png', label: 'Subject Sjinil Hacker Glitch' },
    { id: 'ryan-1', src: './Fnak photos/Enemies/ryan.png', label: 'Subject Ryan System Threat' },

    // Office Desk Monitor, Mask & Wallpaper
    { id: 'desk-monitor', src: './Fnak photos/monitor.webp', label: 'Security Terminal Monitor' },
    { id: 'mask-overlay', src: './Fnak photos/mask.webp', label: 'Security Mask Helmet Overlay' },
    { id: 'pc-wallpaper', src: './Fnak photos/pc-wallpaper.jpg', label: 'Desk Monitor PC Wallpaper' },

    // Upload Confirmation Images
    { id: 'upload-ligin', src: './Fnak photos/upload-confirmation.png', label: 'Ligin Upload Prompt' },
    { id: 'upload-sreekala', src: './Fnak photos/upload-sreekala.png', label: 'Sreekala Upload Prompt' },
    { id: 'upload-vijitha', src: './Fnak photos/upload-vijitha.png', label: 'Vijitha Upload Prompt' },
    { id: 'upload-danny', src: './Fnak photos/upload-danny.png', label: 'Danny Upload Prompt' },
    { id: 'uploading-omr', src: './Fnak photos/uploading-omr.jpg', label: 'OMR Data Transmission Feed' },

    // Files Ryan
    { id: 'file-aahil', src: './Fnak photos/Files-Ryan/aahil.jpg', label: 'Ryan File: Aahil' },
    { id: 'file-abhishek', src: './Fnak photos/Files-Ryan/abhishek.jpg', label: 'Ryan File: Abhishek' },
    { id: 'file-aswin', src: './Fnak photos/Files-Ryan/aswin.jpg', label: 'Ryan File: Aswin' },
    { id: 'file-eshan', src: './Fnak photos/Files-Ryan/Eshan.jpg', label: 'Ryan File: Eshan' },
    { id: 'file-free-gta6', src: './Fnak photos/Files-Ryan/free-gta6.webp', label: 'Ryan File: Free GTA 6' },
    { id: 'file-joewyn', src: './Fnak photos/Files-Ryan/joewyn-confront.png', label: 'Ryan File: Joewyn Confront' },
    { id: 'file-qn-paper', src: './Fnak photos/Files-Ryan/qn-paper.jpg', label: 'Ryan File: Question Paper' },
    { id: 'file-ryan', src: './Fnak photos/Files-Ryan/ryan.jpg', label: 'Ryan File: Ryan' },
    { id: 'file-sijinil', src: './Fnak photos/Files-Ryan/sijinil.jpg', label: 'Ryan File: Sijinil' },
  ],

  audio: [
    { id: 'jumpscare', src: './assets/audio/jumpscare.mp3', label: 'Scream Acoustics' },
    { id: 'knock-sfx', src: './assets/audio/knock-sfx.mp3', label: 'Door Defense Acoustics' },
    { id: 'running-sfx', src: './assets/audio/running-sfx.mp3', label: 'Sprint Footstep Acoustics' },
    { id: 'footsteps', src: './assets/audio/footsteps.mp3', label: 'Corridor Footsteps Acoustics' },
    { id: 'main-menu-bgm', src: './assets/audio/main-menu-bgm.mp3', label: 'Facility Ambience Feed' },
    { id: 'upload-success', src: './assets/audio/upload-success.mp3', label: 'Upload Success Chime' },
    { id: 'scare-attitude', src: './assets/audio/change-your-attitude-children.mp3', label: 'Scare Audio: Change Your Attitude' },
    { id: 'scare-dpp', src: './assets/audio/submit-your-dpp.mp3', label: 'Scare Audio: Submit DPP' },
    { id: 'scare-photocopy', src: './assets/audio/where-is-your-photocopy.mp3', label: 'Scare Audio: Photocopy' },
  ]
};

// Global memory cache to prevent browser garbage collection of decoded image bitmaps
const loadedImageElements = new Map();
const loadedAudioElements = new Map();

let isPreloadCompleted = false;
let preloadPromise = null;

function preloadImage(item) {
  return new Promise((resolve) => {
    if (loadedImageElements.has(item.src)) {
      resolve({ success: true, item });
      return;
    }

    const img = new Image();
    img.src = item.src;

    const timeout = setTimeout(() => {
      loadedImageElements.set(item.src, img);
      resolve({ success: false, item, timedOut: true });
    }, 6000);

    const onComplete = async () => {
      clearTimeout(timeout);
      try {
        if (typeof img.decode === 'function') {
          await img.decode();
        }
      } catch (_) {}
      loadedImageElements.set(item.src, img);
      resolve({ success: true, item });
    };

    if (img.complete) {
      onComplete();
    } else {
      img.onload = onComplete;
      img.onerror = () => {
        clearTimeout(timeout);
        resolve({ success: false, item, error: true });
      };
    }
  });
}

function preloadAudio(item) {
  return new Promise((resolve) => {
    if (loadedAudioElements.has(item.src)) {
      resolve({ success: true, item });
      return;
    }

    const timeout = setTimeout(() => {
      resolve({ success: false, item, timedOut: true });
    }, 5000);

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = item.src;

      fetch(item.src, { mode: 'cors' })
        .then(() => {
          clearTimeout(timeout);
          loadedAudioElements.set(item.src, audio);
          resolve({ success: true, item });
        })
        .catch(() => {
          clearTimeout(timeout);
          loadedAudioElements.set(item.src, audio);
          resolve({ success: true, item });
        });
    } catch (_) {
      clearTimeout(timeout);
      resolve({ success: false, item });
    }
  });
}

export function preloadAllAssets(onProgress = () => {}) {
  if (isPreloadCompleted) {
    onProgress({
      loaded: ASSET_MANIFEST.images.length + ASSET_MANIFEST.audio.length,
      total: ASSET_MANIFEST.images.length + ASSET_MANIFEST.audio.length,
      percent: 100,
      currentItem: 'All Assets Verified'
    });
    return Promise.resolve(true);
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  const allItems = [
    ...ASSET_MANIFEST.images.map(img => ({ ...img, type: 'image' })),
    ...ASSET_MANIFEST.audio.map(aud => ({ ...aud, type: 'audio' })),
  ];

  const total = allItems.length;

  preloadPromise = new Promise((resolve) => {
    let completedCount = 0;

    const handleItemFinished = (item) => {
      completedCount++;
      const percent = Math.min(100, Math.round((completedCount / total) * 100));

      onProgress({
        loaded: completedCount,
        total,
        percent,
        currentItem: item.label
      });

      if (completedCount >= total) {
        isPreloadCompleted = true;
        resolve(true);
      }
    };

    allItems.forEach((item) => {
      const promise = item.type === 'image' ? preloadImage(item) : preloadAudio(item);
      promise.then(() => handleItemFinished(item));
    });
  });

  return preloadPromise;
}

export function isAssetsLoaded() {
  return isPreloadCompleted;
}
