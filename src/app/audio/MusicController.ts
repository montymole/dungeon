import { Howl } from 'howler';
const SONG = {
  TEMPO: 90,
  patternBeats: 64,
  numPatterns: 10,
  startPattern: 0,
  playlist: {
    pattern0: { next: 1, stop: true },
    pattern1: { next: 2, stop: true },
    pattern2: { next: 3, stop: true },
    pattern3: { next: 1, stop: true }
  }
}
export default class MusicController {
  music: any;
  currentPattern: any;
  patternPosition: number = 0;
  constructor() {
    console.log('created');
  }
  begin() {
    const { patternBeats, numPatterns, TEMPO, playlist, startPattern } = SONG;
    const beatduration = 60 / TEMPO;
    const patternLengthMs = patternBeats * beatduration * 1000;
    if (!this.music) {
      const sprite = {};
      for (let i = 0; i < numPatterns; i++) {
        sprite['pattern' + i] = [i * patternLengthMs, patternLengthMs, true];
      }
      this.music = new Howl({
        src: ['/wav/90bpm.wav'],
        onload: () => {
          const duration = this.music.duration();
          const numbeats = duration / beatduration;
          console.log('duration', duration);
          console.log('numbeats', numbeats);
          this.currentPattern = this.music.play('pattern' + startPattern);
        },
        sprite,
        onfade: (id) => {
          console.log('faded', id);
        },
        onend: () => {
          console.log('endpoint->', this.patternPosition);
          // looping branching
          const cmd = playlist['pattern' + this.patternPosition];
          if (cmd) {
            console.log(cmd);
            if (cmd.stop) {
              this.music.stop();
            }
            // fade out previous
            if (cmd.fadeOut) {
              this.music.fade(1, 0, patternLengthMs, this.currentPattern.id);
            }
            if (cmd.next !== undefined) {
              this.patternPosition = cmd.next;
              this.currentPattern = this.music.play('pattern' + cmd.next);
            }
          } else {
            this.currentPattern.stop();
          }
        }
      });
    }
  }
}