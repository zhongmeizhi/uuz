/**
 * @param  {Shape} shape
 * @param  {number} max_objects=10
 * @param  {number} max_levels=4
 * @param  {number} level=0
 */
class Mesh {
  constructor(pRect, max_objects = 10, max_levels = 4, level = 0) {
    this.max_objects = max_objects;
    this.max_levels = max_levels;

    this.level = level;
    this.bounds = pRect;
    this.objects = [];
    this.nodes = [];
  }

  /**
   * @param  {} shape
   */
  insert(shape) {
    let i = 0,
      indexes;

    //if we have subnodes, call insert on matching subnodes
    if (this.nodes.length) {
      indexes = this._getIndex(shape);

      for (i = 0; i < indexes.length; i++) {
        this.nodes[indexes[i]].insert(shape);
      }
      return;
    }

    //otherwise, store object here
    this.objects.push(shape);

    //max_objects reached
    if (
      this.objects.length > this.max_objects &&
      this.level < this.max_levels
    ) {
      //split if we don't already have subnodes
      if (!this.nodes.length) {
        this._splitMesh();
      }

      //add all objects to their corresponding subnode
      for (i = 0; i < this.objects.length; i++) {
        indexes = this._getIndex(this.objects[i]);
        for (let k = 0; k < indexes.length; k++) {
          this.nodes[indexes[k]].insert(this.objects[i]);
        }
      }

      //clean up this node
      this.objects = [];
    }
  }

  /**
   * @param  {} shape
   */
  retrieve(shape) {
    let indexes = this._getIndex(shape),
      returnObjects = this.objects;

    //if we have subnodes, retrieve their objects
    if (this.nodes.length) {
      for (let i = 0; i < indexes.length; i++) {
        returnObjects = returnObjects.concat(
          this.nodes[indexes[i]].retrieve(shape)
        );
      }
    }

    // remove duplicates
    returnObjects = returnObjects.filter(function (item, index) {
      return returnObjects.indexOf(item) >= index;
    });

    return returnObjects;
  }

  /**
   * @param  {number} mouseX
   * @param  {number} mouseY
   * @param  {number} blur
   */
  queryMouse(mouseX, mouseY, blur = 4) {
    return this.retrieve({
      x: mouseX,
      y: mouseY,
      width: blur,
      height: blur,
    });
  }

  clear() {
    this.objects = [];

    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes.length) {
        this.nodes[i].clear();
      }
    }

    this.nodes = [];
  }

  /**
   * @param  {} shape
   */
  // TODO:
  update(shape) {
    const { x, y, width, height } = this._getBoundAttr(shape);
  }

  _getBoundAttr(bound) {
    let attr = bound.core || bound;
    if (attr.radius) {
      const diameter = attr.radius * 2;
      attr.width = diameter;
      attr.height = diameter;
    }
    return attr;
  }

  _splitMesh() {
    let nextLevel = this.level + 1;
    const { x, y, width, height } = this._getBoundAttr(this.bounds);
    let subWidth = width / 2;
    let subHeight = height / 2;

    //top right node
    this.nodes[0] = new Mesh(
      {
        x: x + subWidth,
        y: y,
        width: subWidth,
        height: subHeight,
      },
      this.max_objects,
      this.max_levels,
      nextLevel
    );

    //top left node
    this.nodes[1] = new Mesh(
      {
        x: x,
        y: y,
        width: subWidth,
        height: subHeight,
      },
      this.max_objects,
      this.max_levels,
      nextLevel
    );

    //bottom left node
    this.nodes[2] = new Mesh(
      {
        x: x,
        y: y + subHeight,
        width: subWidth,
        height: subHeight,
      },
      this.max_objects,
      this.max_levels,
      nextLevel
    );

    //bottom right node
    this.nodes[3] = new Mesh(
      {
        x: x + subWidth,
        y: y + subHeight,
        width: subWidth,
        height: subHeight,
      },
      this.max_objects,
      this.max_levels,
      nextLevel
    );
  }

  /**
   * Determine which node the object belongs to
   * @param {Shape} shape
   * @return {number[]}       an array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
   */
  _getIndex(shape) {
    const { x, y, width, height } = this._getBoundAttr(shape);
    let indexes = [],
      verticalMidpoint = this.bounds.x + this.bounds.width / 2,
      horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

    let startIsNorth = y < horizontalMidpoint,
      startIsWest = x < verticalMidpoint,
      endIsEast = x + width > verticalMidpoint,
      endIsSouth = y + height > horizontalMidpoint;

    //top-right quad
    if (startIsNorth && endIsEast) {
      indexes.push(0);
    }

    //top-left quad
    if (startIsWest && startIsNorth) {
      indexes.push(1);
    }

    //bottom-left quad
    if (startIsWest && endIsSouth) {
      indexes.push(2);
    }

    //bottom-right quad
    if (endIsEast && endIsSouth) {
      indexes.push(3);
    }

    return indexes;
  }
}

export default Mesh;
