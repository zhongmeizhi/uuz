import { ShapeFlags, getShapeFlag } from "../utils/base.js";

const createVNode = function (type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
	const vnode = {
		el: null,
		component: null,
		key: (props && props.key) || null,
		type,
		props,
		children,
		shapeFlag: getShapeFlag(type),
	};

	if (Array.isArray(children)) {
		vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
	} else if (typeof children === "string") {
		vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
	}
	return vnode;
}

const openBlock = (...args) => {
	console.log(args, 'openBlock');
}

const createBlock = (...args) => {
	console.log(args, 'createBlock');
}

export {
	createVNode,
	openBlock,
	createBlock
}
