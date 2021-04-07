import QuadTree from "@/mesh/quadTree.js";

const defaultMeshConfig = {
  width: 300,
  height: 150,
  blur: 4,
};

class Mesh {
  /**
   * @param  {} {width
   * @param  {} height
   * @param  {} blur}=defaultMeshConfig
   */
  constructor({ width, height, blur } = defaultMeshConfig) {
    this.blur = blur;
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
  queryMouse(mouseX, mouseY) {
    return this.quadTree.retrieve({
      x: mouseX,
      y: mouseY,
      width: this.blur,
      height: this.blur,
    });
  }
}

export default Mesh;
