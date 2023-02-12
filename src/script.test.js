
import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  Curve,
  CylinderGeometry,
  DodecahedronGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LatheGeometry,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RingGeometry,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WireframeGeometry,
  WebGLRenderer
} from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const twoPi = Math.PI * 2;

class CustomSinCurve extends Curve {

  constructor(scale = 1) {

    super();

    this.scale = scale;

  }

  getPoint(t, optionalTarget = new Vector3()) {

    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);

  }

}

function updateGroupGeometry(mesh, geometry) {

  mesh.children[0].geometry.dispose();
  mesh.children[1].geometry.dispose();

  mesh.children[0].geometry = new WireframeGeometry(geometry);
  mesh.children[1].geometry = geometry;

  // these do not update nicely together if shared

}

// heart shape

const x = 0, y = 0;

const heartShape = new Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

const guis = {


  CylinderGeometry: function (mesh) {

    const data = {
      radiusTop: 5,
      radiusBottom: 5,
      height: 10,
      radialSegments: 8,
      heightSegments: 1,
      openEnded: false,
      thetaStart: 0,
      thetaLength: twoPi
    };

    function generateGeometry() {

      updateGroupGeometry(mesh,
        new CylinderGeometry(
          data.radiusTop,
          data.radiusBottom,
          data.height,
          data.radialSegments,
          data.heightSegments,
          data.openEnded,
          data.thetaStart,
          data.thetaLength
        )
      );

    }

    const folder = gui.addFolder('THREE.CylinderGeometry');

    folder.add(data, 'radiusTop', 0, 30).onChange(generateGeometry);
    folder.add(data, 'radiusBottom', 0, 30).onChange(generateGeometry);
    folder.add(data, 'height', 1, 50).onChange(generateGeometry);
    folder.add(data, 'radialSegments', 3, 64).step(1).onChange(generateGeometry);
    folder.add(data, 'heightSegments', 1, 64).step(1).onChange(generateGeometry);
    folder.add(data, 'openEnded').onChange(generateGeometry);
    folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
    folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);


    generateGeometry();

  },

}

const folder = gui.addFolder('THREE.PlaneGeometry');

folder.add(data, 'width', 1, 30).onChange(generateGeometry);
folder.add(data, 'height', 1, 30).onChange(generateGeomet…