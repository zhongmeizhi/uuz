import { ShapeFlags, getShapeFlag, Text, isObject, isArr } from "../utils/base.js";

const blockStack = [];
let currentBlock = null;
const EMPTY_ARR = [];

function createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
	// TODO: Block相关
	const vnode = {
		el: null,
		component: null,
		key: (props && props.key) || null,
		type,
		props,
		children,
		shapeFlag: getShapeFlag(type),
	};

	if (isArr(children)) {
		vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
	} else if (typeof children === "string") {
		vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
	}
	return vnode;
}

// TODO:
const openBlock = (disableTracking = false) => {
	blockStack.push((currentBlock = disableTracking ? null : []));
}

// TODO:
function createBlock(type, props, children, patchFlag, dynamicProps) {
	 /* isBlock: prevent a block from tracking itself */
	const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true);
	// save current block children on the block vnode
	vnode.dynamicChildren = currentBlock || EMPTY_ARR;
	// close block
	blockStack.pop();
	currentBlock = blockStack[blockStack.length - 1] || null;
	// a block is always going to be patched, so track it as a child of its
	// parent block
	if (currentBlock) {
		currentBlock.push(vnode);
	}
	return vnode;
}

function createTextVNode(text = '', flag = 0) {
  return createVNode(Text, null, text, flag);
}

const toDisplayString = (val) => {
  return val == null
    ? ''
    : isObject(val)
      ? JSON.stringify(val, replacer, 2)
      : String(val);
};

export {
	createVNode,
	openBlock,
	createBlock,
	createTextVNode,
	toDisplayString
}
