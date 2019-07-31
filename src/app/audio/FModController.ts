declare var FMODModule: any;
declare var global: any;
const VERBOSE = true;
export default class FModController {
  FMOD: any;
  gSystem: any;
  gSystemLowLevel: any;
  initApp: any;
  preloadFiles: string[];
  constructor(opts: any = {}) {
    if (!FMODModule) {
      console.error('please inlcude fmodstudio.js in your page');
      this.FMOD = new Error('please include fmodstudio.js in your page');
    } else {
      const { preloadFiles, initApp } = opts;
      this.preloadFiles = preloadFiles;
      this.initApp = initApp;
      this.FMOD = {
        preRun: () => this.preRun(),
        onRuntimeInitialized: () => this.onRuntimeInitialized(),
        TOTAL_MEMORY: 128 * 1024 * 1024 // FMOD Heap defaults to 16mb, but set it to 64mb
      };
      global.fmod = this;
      FMODModule(this.FMOD); // Calling the constructor function with our object
    }
  }
  preRun() {
    const { FMOD } = this;
    if (this.preloadFiles) {
      this.preloadFiles.forEach((f: any) => {
        const ff = f.split('/');
        console.log('FILE', f);
        FMOD.FS_createPreloadedFile('/', ff[ff.length - 1], f, true, false);
        console.log('PRELOAD', f);
      });
    }
    if (VERBOSE) {
      console.log('FMOD prerun done');
    }
  }
  loadBank(name) {
    const { FMOD, gSystem } = this;
    const bank: any = {};
    this.checkResult(
      gSystem.loadBankFile('/' + name, FMOD.STUDIO_LOAD_BANK_NORMAL, bank),
      `loadBankFile: ${name}`
    );
  }
  checkResult(result: any, description: string = '') {
    const { FMOD } = this;
    if (result !== FMOD.OK) {
      const message = FMOD.ErrorString(result);
      if (VERBOSE) {
        console.error(message, description);
      }
      throw new Error(`${message} + ${description}`);
    } else {
      console.log(description, 'OK');
      4;
    }
  }
  update() {
    this.gSystem.update();
    requestAnimationFrame((t) => this.update());
  }
  async onRuntimeInitialized() {
    const { FMOD } = this;
    const createSysVal: any = {};
    this.checkResult(
      FMOD.Studio_System_Create(createSysVal),
      'Studio System Create'
    );
    this.gSystem = createSysVal.val;
    const lowLevelSysVal: any = {};
    this.checkResult(
      this.gSystem.getLowLevelSystem(lowLevelSysVal),
      'getLowLevelSystem'
    );
    this.gSystemLowLevel = lowLevelSysVal.val;
    this.checkResult(
      this.gSystemLowLevel.setDSPBufferSize(2048, 2),
      'setDSPBufferSize'
    );
    this.checkResult(
      this.gSystem.initialize(
        1024,
        FMOD.STUDIO_INIT_NORMAL,
        FMOD.INIT_NORMAL,
        null
      ),
      'initialize channels'
    );
    if (this.initApp) {
      this.initApp();
    }
    this.update();
    return FMOD.OK;
  }
  listBankEvents(bank: any = {}, id: any = null) {
    if (!bank.val && id) {
      this.checkResult(this.gSystem.getBankByID(id, bank), 'getBankByID');
    }
    const a: any = {}; // array
    const c: any = {}; // count
    this.checkResult(bank.val.getEventList(a, 600, c), 'getEventList');
  }
  getEvent(path: string) {
    const d: any = {}; // description
    this.checkResult(this.gSystem.getEvent(path, d));
    return d.val;
  }
  getEventInstance(path: string) {
    const i: any = {}; // instance
    this.getEvent(path).createInstance(i);
    return i.val;
  }
  createEventInstance(event: any) {
    const i: any = {}; // instance
    event.createInstance(i);
    return i.val;
  }
}
