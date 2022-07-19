/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { createRef } from 'react';
import './App.scss';

interface DrumPad {
  soundname: string;
  text: string;
  keycode: number;
}

const BASE_SOUND_URL = 'https://s3.amazonaws.com/freecodecamp/drums';
const DRUM_PADS: DrumPad[] = [
  {
    text: 'Q',
    keycode: 81,
    soundname: 'Heater-1',
  },
  {
    text: 'W',
    keycode: 87,
    soundname: 'Cev_H2',
  },
  {
    text: 'E',
    keycode: 69,
    soundname: 'Chord_1',
  },
  {
    text: 'A',
    keycode: 65,
    soundname: 'Dry_Ohh',
  },
  {
    text: 'S',
    keycode: 83,
    soundname: 'Bld_H1',
  },
  {
    text: 'D',
    keycode: 68,
    soundname: 'punchy_kick_1',
  },
  {
    text: 'Z',
    keycode: 90,
    soundname: 'side_stick_1',
  },
  {
    text: 'X',
    keycode: 88,
    soundname: 'RP4_KICK_1',
  },
  {
    text: 'C',
    keycode: 67,
    soundname: 'Brk_Snr',
  },
];

class App extends React.PureComponent {
  private readonly displayRef = createRef<HTMLDivElement>();
  private readonly drumPadItemActiveClassName = 'drum-pad--active';

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  resolveSoundUrlFromSoundName(soundname: string): string {
    return `${BASE_SOUND_URL}/${soundname}.mp3`;
  }

  handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toUpperCase();

    if (key.length != 1 || !key.match(/[A-Z]/i)) {
      return;
    }

    const drumPad = DRUM_PADS.find((p) => p.text === key);
    if (!drumPad) {
      return;
    }

    this.play(drumPad);
  }

  play(drumPad: DrumPad) {
    const audio: HTMLAudioElement = document.getElementById(
      drumPad.text,
    ) as HTMLAudioElement;

    if (audio) {
      const parent = audio.parentElement as HTMLDivElement;
      parent.classList.remove(this.drumPadItemActiveClassName);
      parent.classList.add(this.drumPadItemActiveClassName);
      setTimeout(
        () => parent.classList.remove(this.drumPadItemActiveClassName),
        100,
      );

      audio.currentTime = 0;
      audio.play();
      this.updateDisplay(drumPad);
    }
  }

  updateDisplay(drumPad: DrumPad) {
    const displayRef = this.displayRef.current;
    if (displayRef) {
      displayRef.innerHTML = `Soundname: <b>${drumPad.soundname}</b>`;
    }
  }

  render(): React.ReactNode {
    return (
      <div id='drum-machine' className='drum-machine'>
        <div id='display' className='display' ref={this.displayRef} />
        <div className='drum-pad-container'>
          {DRUM_PADS.map((p, i) => {
            return (
              <div
                key={i}
                id={p.soundname}
                className='drum-pad'
                onClick={() => this.play(p)}
              >
                <audio
                  className='clip'
                  id={p.text}
                  src={this.resolveSoundUrlFromSoundName(p.soundname)}
                ></audio>
                <span>{p.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
