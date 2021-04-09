import QuadTree from "@/mesh/quadTree.js";

const defaultMeshConfig = {
  width: 300,
  height: 150
};

class Mesh {
  /**
   * @param  {} {width
   * @param  {} height}=defaultMeshConfig
   */
  constructor({ width, height } = defaultMeshConfig) {
    this.quadTree = new QuadTree({
      x: 0,
      y: 0,
      width: width,
      height: height,
    });
  }
  
  /**
   * @param  {} geometry
   */
  insert(geometry) {
    this.quadTree.insert(geometry);
  }
  
  /**
   */
  clear() {
    this.quadTree.clear();
  }

  /**
   * @param  {} mouseX
   * @param  {} mouseY
   */
  queryMouse(mouseX, mouseY, blur = 4) {
    return this.quadTree.retrieve({
      x: mouseX,
      y: mouseY,
      width: blur,
      height: blur,
    });
  }
}

export default Mesh;
