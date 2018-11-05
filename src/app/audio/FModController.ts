declare var FMODModule: any;
const VERBOSE = false;
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
        TOTAL_MEMORY: 64 * 1024 * 1024  // FMOD Heap defaults to 16mb, but set it to 64mb
      };
      global['fmod'] = this;
      FMODModule(this.FMOD); // Calling the constructor function with our object 
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
    if (VERBOSE) console.log('FMOD prerun done');
  }
  loadBank (name) {
    const { FMOD, gSystem } = this;
    const bank: any = {};
    this.checkResult(gSystem.loadBankFile('/' + name, FMOD.STUDIO_LOAD_BANK_NORMAL, bank));
    const p: any = {};
    const r: any = {};
    this.checkResult(bank.val.getPath(p, 256, r));
    const path = p.val;
    const { eventlist } = this.listBankEvents(bank);
    const events = (eventlist.length && {}) || null;
    eventlist.forEach((ev) => {
      const event = this.getEvent(ev);
      event.loadSampleData();
      // make structure
      const p = ev.replace(' ', '').split('/');
      p.shift();
      events[p.join('')] = event;
    });
    return { path, events };
  }
  checkResult (result: any) {
    const { FMOD } = this;
    if (result !== FMOD.OK) {
      const msg = FMOD.ErrorString(result);
      if (VERBOSE) console.error(msg);
      throw new Error(msg);
    }
  }
  update () {
    this.checkResult(this.gSystem.update());
    requestAnimationFrame(t => this.update());
  }
  async onRuntimeInitialized () {
    const { FMOD } = this;
    if (VERBOSE) console.log('Creating FMOD System object');
    const createSysVal: any = {};
    this.checkResult(FMOD.Studio_System_Create(createSysVal));
    this.gSystem = createSysVal.val;
    if (VERBOSE) console.log('Creating FMOD Low Level System object');
    const lowLevelSysVal: any = {};
    this.checkResult(this.gSystem.getLowLevelSystem(lowLevelSysVal));
    this.gSystemLowLevel = lowLevelSysVal.val;
    if (VERBOSE) console.log('set DSP Buffer size to larger than default');
    this.checkResult(this.gSystemLowLevel.setDSPBufferSize(2048, 2));
    if (VERBOSE) console.log('init FMOD:  1024 virtual channels');
    this.checkResult(this.gSystem.initialize(1024, FMOD.STUDIO_INIT_NORMAL, FMOD.INIT_NORMAL, null));
    if (this.initApp) this.initApp();
    if (VERBOSE) console.log('FMOD init done');
    this.update();
    return FMOD.OK;
  }
  listBankEvents (bank: any = {}, path: string = null) {
    if (!bank.val && path) {
      this.checkResult(this.gSystem.getBank(`bank:/${path}`, bank));
    }
    const a: any = {}; // array
    const c: any = {}; // count
    this.checkResult(bank.val.getEventList(a, 100, c));
    const eventlist = [];
    a.val.forEach((ed) => {
      const p: any = {}; // event path
      ed.getPath(p, 256, {});
      eventlist.push(p.val);
    });
    return {
      eventlist,
      count: c.val
    };
  }
  getEvent (path: string) {
    const d: any = {}; // description
    this.checkResult(this.gSystem.getEvent(path, d));
    return d.val;
  }
  getEventInstance (path: string) {
    const i: any = {}; // instance
    this.getEvent(path).createInstance(i);
    return i.val;
  }
  createEventInstance (event: any) {
    const i: any = {}; // instance
    event.createInstance(i);
    return i.val;
  }
}






