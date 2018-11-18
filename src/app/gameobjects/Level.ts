import * as THREE from 'three';
import { TILE_TYPE } from '../../dungeon/constants';

export class Level extends THREE.Object3D {

    constructor(props) {
        super();
        this.init(props);
        this.update(props);
      }

    init (props) {
        const {
            tiles,
            world
        } = props;

        const level = new THREE.Geometry();
        const material =  new THREE.MeshPhongMaterial({color: 0x808080});

        //loop this
        tiles.forEach((tile) => {
            switch(tile.type) {
                case TILE_TYPE.WALL:
                    const tileMesh = new THREE.Mesh(
                        new THREE.CubeGeometry(1,1,2)
                    );
                    tileMesh.position.z = 1.0;
                    tileMesh.position.x = tile.x;
                    tileMesh.position.y = tile.y;
                    level.mergeMesh(tileMesh);
                    break;
            }
        });

        level.mergeVertices();
        this.add(new THREE.Mesh(level, material));
    
        if (world && world.scene) world.scene.add(this);
    }

    update (props) {}

    // this is called every frame;
    renderAnimationFrame (clock) {}

}
