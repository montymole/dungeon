declare var FMODModule: any;

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
        TOTAL_MEMORY: 64 * 1024 * 1024
      };
      global['FMOD'] = this.FMOD;
      FMODModule(this.FMOD);                            // Calling the constructor function with our object 
    }
  }
  preRun () {
    const { FMOD } = this;
    if (this.preloadFiles) {
      this.preloadFiles.forEach((f) => {
        const ff = f.split('/');
        FMOD.FS_createPreloadedFile('/', ff[ff.length - 1], f, true, false);
      });
    }
    console.log('prerun done');
  }
  loadBank (name) {
    const { FMOD, gSystem } = this;
    const bankhandle = {};
    const result = gSystem.loadBankFile('/' + name, FMOD.STUDIO_LOAD_BANK_NORMAL, bankhandle);
    if (result !== FMOD.OK) {
      throw new Error(FMOD.ErrorString(result));
    }
  }
  checkResult (result: any) {
    const { FMOD } = this;
    if (result !== FMOD.OK) {
      const msg = FMOD.ErrorString(result);
      console.error(msg);
      throw new Error(msg);
    }
  }
  onRuntimeInitialized () {
    const { FMOD } = this;
    console.log('Creating FMOD System object');
    const createSysVal: any = {};
    this.checkResult(FMOD.Studio_System_Create(createSysVal));
    this.gSystem = createSysVal.val;
    console.log('Creating FMOD Low Level System object');
    const lowLevelSysVal: any = {};
    this.checkResult(this.gSystem.getLowLevelSystem(lowLevelSysVal));
    this.gSystemLowLevel = lowLevelSysVal.val;
    console.log('set DSP Buffer size');
    this.checkResult(this.gSystemLowLevel.setDSPBufferSize(2048, 2));
    console.log('init FMOD...');
    this.checkResult(this.gSystem.initialize(1024, FMOD.STUDIO_INIT_NORMAL, FMOD.INIT_NORMAL, null));
    if (this.initApp) this.initApp();
    console.log('FMOD init done');
    return FMOD.OK;
  }
}






