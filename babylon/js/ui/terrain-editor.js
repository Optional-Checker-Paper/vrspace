import {VRSPACEUI} from './vrspace-ui.js';

export class TerrainEditor {
  constructor(world) {
    this.world = world;
    this.scene = world.scene;
    this.terrain = world.terrain;
    this.heightIncrement=1;
    this.sharedTerrain = null;
    this.editing = false;
  }
  edit() {
    this.observer = this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if(pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh == this.terrain.mesh()) {
            this.lastIndex = this.updatePicked(pointerInfo.pickInfo);
            this.terrain.mesh().enablePointerMoveEvents = true;
          }
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          this.lastIndex = -1;
          this.terrain.mesh().enablePointerMoveEvents = false;
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          if ( this.lastIndex >= 0 && pointerInfo.pickInfo.pickedMesh == this.terrain.mesh() ) {
            var newIndex = this.terrain.findIndex(pointerInfo.pickInfo.pickedPoint.x,pointerInfo.pickInfo.pickedPoint.z);
            if ( newIndex != this.lastIndex ) {
              this.lastIndex = newIndex;
              this.updatePicked(pointerInfo.pickInfo);
            }
          }
          break;
        }
    });
    
    this.raiseButton = VRSPACEUI.hud.addButton("Raise", "https://www.babylonjs-playground.com/textures/icons/Upload.png"); // FIXME: cdn
    this.digButton = VRSPACEUI.hud.addButton("Dig", "https://www.babylonjs-playground.com/textures/icons/Download.png"); // FIXME: cdn
    this.raiseSlider = VRSPACEUI.hud.addSlider("Height",0,2,this.heightIncrement)
    this.raiseButton.onPointerDownObservable.add( () => {
      this.direction = 1;
      VRSPACEUI.hud.showButtons(this.editing,this.raiseButton,this.raiseSlider);
      this.editing = !this.editing;
      this.terrain.terrainMaterial.wireframe = this.editing;
    });
    this.digButton.onPointerDownObservable.add( () => {
      this.direction = -1;
      VRSPACEUI.hud.showButtons(this.editing,this.digButton,this.raiseSlider);
      this.editing = !this.editing;
      this.terrain.terrainMaterial.wireframe = this.editing;
    });
    this.raiseSlider.onValueChangedObservable.add(value=>{this.heightIncrement=value});
    
    this.diffusePicker = VRSPACEUI.hud.addColorPicker("Diffuse", this.terrain.terrainMaterial.diffuseColor);
    this.specularPicker = VRSPACEUI.hud.addColorPicker("Specular", this.terrain.terrainMaterial.specularColor);
    this.emissivePicker = VRSPACEUI.hud.addColorPicker("Emissive", this.terrain.terrainMaterial.emissiveColor);
    this.specularPicker.onValueChangedObservable.add( (val) => {
      this.terrain.terrainMaterial.specularColor.copyFrom(val);
      this.world.worldManager.VRSPACE.sendEvent(this.sharedTerrain, {specularColor:val});      
    });
    this.diffusePicker.onValueChangedObservable.add( (val) => {
      this.terrain.terrainMaterial.diffuseColor.copyFrom(val);
      this.world.worldManager.VRSPACE.sendEvent(this.sharedTerrain, {diffuseColor:val});      
    });
    this.emissivePicker.onValueChangedObservable.add( (val) => {
      this.terrain.terrainMaterial.emissiveColor.copyFrom(val);
      this.world.worldManager.VRSPACE.sendEvent(this.sharedTerrain, {emissiveColor:val});      
    });
  }
  
  updatePicked( pickInfo ) {
    var index = -1;
    //console.log(pickInfo);
    //console.log(pickInfo.pickedPoint);
    var x = pickInfo.pickedPoint.x;
    var z = pickInfo.pickedPoint.z;
    //var y = this.terrain.terrain.getHeightFromMap(x, z);
    //console.log(x,y,z);
    //var sphere = BABYLON.MeshBuilder.CreateSphere("point", {diameter:0.1}, this.scene);
    //sphere.position = new BABYLON.Vector3(x,y,z);
    if ( this.editing ) {
      index = this.terrain.raise(x,z,this.heightIncrement*this.direction);
      if ( this.world.isOnline() && this.sharedTerrain ) {
        // TODO publish updates
        var change = { change: {index: index, point: this.terrain.point(index)} };
        this.world.worldManager.VRSPACE.sendEvent(this.sharedTerrain, change);
      }
    }
    return index;
  }
    
  
}