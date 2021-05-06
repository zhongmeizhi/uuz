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

    if (this.nodes.length) {
      indexes = this._getIndex(shape);

      for (i = 0; i < indexes.length; i++) {
        this.nodes[indexes[i]].insert(shape);
      }
      return;
    }

    shape.parentBound = this.objects;
    this.objects.push(shape);

    if (
      this.objects.length > this.max_objects &&
      this.level < this.max_levels
    ) {
      if (!this.nodes.length) {
        this._splitMesh();
      }

      for (i = 0; i < this.objects.length; i++) {
        indexes = this._getIndex(this.objects[i]);
        for (let k = 0; k < indexes.length; k++) {
          this.nodes[indexes[k]].insert(this.objects[i]);
        }
      }

      this.objects = [];
    }
  }

  /**
   * @param  {} shape
   */
  retrieve(shape) {
    let indexes = this._getIndex(shape),
      returnObjects = this.objects;

    if (this.nodes.length) {
      for (let i = 0; i < indexes.length; i++) {
        returnObjects = returnObjects.concat(
          this.nodes[indexes[i]].retrieve(shape)
        );
      }
    }

    // 筛选，感觉算法可以优化
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
  queryMouse({ offsetX, offsetY }, blur = 4) {
    return this.retrieve({
      x: offsetX,
      y: offsetY,
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
  update(shape) {
    if (shape.parentBound) {
      const idx = shape.parentBound.findIndex((item) => item === shape);
      shape.parentBound.splice(idx, 1);
      delete shape.parentBound;
      const root = this.findRoot();
      root.insert(shape);
    }
  }

  findRoot() {
    let mesh = this;
    while (mesh.parentMesh) {
      mesh = mesh.parentMesh;
    }
    return mesh;
  }

  _getBoundAttr(bound) {
    let attr = bound.core || bound;
    let result = { ...attr };
    if (result.radius) {
      const diameter = result.radius * 2;
      result.width = diameter;
      result.height = diameter;
    }
    return result;
  }

  _splitMesh() {
    let nextLevel = this.level + 1;
    const { x, y, width, height } = this._getBoundAttr(this.bounds);
    let subWidth = width / 2;
    let subHeight = height / 2;

    const axis = [
      {
        x: x + subWidth,
        y: y,
      },
      {
        x: x,
        y: y,
      },
      {
        x: x,
        y: y + subHeight,
      },
      {
        x: x + subWidth,
        y: y + subHeight,
      },
    ];

    axis.forEach(({ x, y }) => {
      const mesh = new Mesh(
        { x, y, width: subWidth, height: subHeight },
        this.max_objects,
        this.max_levels,
        nextLevel
      );
      mesh.parentMesh = this;
      this.nodes.push(mesh);
    });
  }

  /**
   * @param {Shape} shape
   * @return {number[]}
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

    if (startIsNorth && endIsEast) {
      indexes.push(0);
    }

    if (startIsWest && startIsNorth) {
      indexes.push(1);
    }

    if (startIsWest && endIsSouth) {
      indexes.push(2);
    }

    if (endIsEast && endIsSouth) {
      indexes.push(3);
    }

    return indexes;
  }
}

export default Mesh;
