export default function h(Component, props, ...children) {
	const _props = props || {};
	_props.children = children || [];

	return {
		Component,
		props: _props
	}
}

export function fragment(props) {
  return props.children
}