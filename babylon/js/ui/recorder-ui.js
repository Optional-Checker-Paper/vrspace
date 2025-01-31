import {VRSPACE} from '../client/vrspace.js';
import {VRSPACEUI} from './vrspace-ui.js';

/**
Event Recorder is server-side component.
This UI sends commands to the server that control recording and playback.
UI buttons (record, stop, play) are bound to current camera.
*/
export class RecorderUI {
  /** @param scene babylonjs scene */
  constructor( scene ) {
    // parameters
    this.scene = scene;
    this.recorder = null;
  }
  /** Shows the UI */
  showUI() {


    this.recordButton = VRSPACEUI.hud.addButton("REC", this.contentBase+"/content/icons/Dot.png");
    this.recordButton.onPointerDownObservable.add( () => this.record());
    
    this.stopButton = VRSPACEUI.hud.addButton("Stop",this.contentBase+"/content/icons/pause.png");
    this.stopButton.onPointerDownObservable.add( () => this.stop());
    this.stopButton.isVisible = false;

    this.playButton = VRSPACEUI.hud.addButton( "Play", this.contentBase+"/content/icons/play.png");
    this.playButton.onPointerDownObservable.add( () => this.play());
    this.playButton.isVisible = false;
  }
  
  /** Start recording */
  record() {
    console.log("Recording...");
    if ( ! this.recorder ) {
      // create recorder on the server
      VRSPACE.send('{"command":{"Recording":{"action":"record"}}}');
    }
    this.stopButton.isVisible = true;
    this.playButton.isVisible = false;
  }
  /** Stop recording */
  stop() {
    console.log('Stopped');
    VRSPACE.send('{"command":{"Recording":{"action":"stop"}}}');
    this.recordButton.isVisible = true;
    this.playButton.isVisible = true;
    this.stopButton.isVisible = false;
  }
  /** Start playing */
  play() {
    console.log('Playing...');
    VRSPACE.send('{"command":{"Recording":{"action":"play"}}}');
    this.recordButton.isVisible = false;
    this.stopButton.isVisible = true;
  }
  
}