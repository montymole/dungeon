import * as THREE from 'three';
import * as GLTFLoader from 'three-gltf-loader';
global['THREE'] = THREE;
import '../../../node_modules/three/examples/js/utils/BufferGeometryUtils';

import { TILE_TYPE, TILE_SUB_TYPE } from '../../dungeon/constants';

export class Level extends THREE.Object3D {
    glb: any;

    constructor(props) {
        super();
        this.init(props);
        this.update(props);
      }

    async loadGlb (path) {
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => { loader.load(path, resolve); });
    }

    findMeshByName(name) {
        const SCALE = 0.01;
        const origMesh = this.glb.scene.children.find(c => c.name === name);
        const geo = new THREE.Geometry().fromBufferGeometry(origMesh.geometry);
        const mesh = new THREE.Mesh(geo);
        mesh.rotation.x = 90 * (Math.PI / 180);
        mesh.scale.set(SCALE,SCALE,SCALE);
        return mesh;
    }

    async init (props) {
        const {
            tiles,
            world
        } = props;

        if (!this.glb) {
            // load object data 
            this.glb = await this.loadGlb('/gitf/test.glb');
        }
        const material =  new THREE.MeshPhongMaterial({color: 0x808080});
        //loop this
        const level = new THREE.Geometry();
        tiles.forEach((tile) => {
            let tileMesh;
            switch(tile.type) {
                case TILE_TYPE.WALL:
                     tileMesh = this.findMeshByName('WALL');
                    break;
                case TILE_TYPE.FLOOR:
                     tileMesh = this.findMeshByName('FLOOR');
                    break;
                case TILE_TYPE.DOOR:
                    tileMesh = this.findMeshByName('DOOR');
                   break;
            }
            if (tileMesh) {
                if (tile.subtype === TILE_SUB_TYPE.HORIZONTAL) {
                    tileMesh.rotation.y = 90 * (Math.PI / 180);
                }
                tileMesh.position.set(tile.x,tile.y,0.0);
                level.mergeMesh(tileMesh);
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
