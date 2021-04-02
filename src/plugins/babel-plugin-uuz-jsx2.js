import { declare } from '@babel/helper-plugin-utils';
import jsx from '@babel/plugin-transform-react-jsx';
// import jsx from '@babel/plugin-syntax-jsx';
// import helper from '@babel/helper-builder-react-jsx';
// import * as t from "@babel/types";

const plugin = declare((api, options) => {
	// api.assertVersion(7);

	// const THROW_IF_NAMESPACE = true;
	// const PRAGMA_DEFAULT = options.pragma || "uuz.h";

	// const createIdentifierParser = (id) => () => {
	// 	return id
	// 		.split('.')
	// 		.map(name => t.identifier(name))
	// 		.reduce((object, property) => t.memberExpression(object, property));
	// };

	// const visitor = helper({
	// 	pre(state) {
	// 		const tagName = state.tagName;
	// 		const args = state.args;
	// 		if (t.react.isCompatTag(tagName)) {
	// 			args.push(t.stringLiteral(tagName));
	// 		} else {
	// 			args.push(state.tagExpr);
	// 		}
	// 	},
	// 	post(state, pass) {
	// 		state.callee = pass.get("jsxIdentifier")();
	// 	},
	// 	throwIfNamespace: THROW_IF_NAMESPACE,
	// });

	// visitor.Program = {
	// 	enter(path, state) {
	// 		state.set("jsxIdentifier", createIdentifierParser(PRAGMA_DEFAULT));
	// 	},
	// 	exit(path, state) {
	// 	},
	// };

	// visitor.JSXAttribute = function (path) {
	// 	if (t.isJSXElement(path.node.value)) {
	// 		path.node.value = t.jsxExpressionContainer(path.node.value);
	// 	}
	// };

	return {
		name: "transform-uuz-jsx",
		inherits: jsx,
		// visitor,
		manipulateOptions() {
			return {
				importSource: 'abc'
			}
		}
	};
});

export default plugin;
