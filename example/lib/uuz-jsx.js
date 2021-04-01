(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@babel/plugin-syntax-jsx'), require('@babel/helper-plugin-utils'), require('@babel/core'), require('@babel/helper-module-imports'), require('@babel/helper-annotate-as-pure')) :
  typeof define === 'function' && define.amd ? define(['@babel/plugin-syntax-jsx', '@babel/helper-plugin-utils', '@babel/core', '@babel/helper-module-imports', '@babel/helper-annotate-as-pure'], factory) :
  (global = global || self, global['uuz-jsx'] = factory(global.jsx, global.helperPluginUtils, global.core, global.helperModuleImports, global.annotateAsPure));
}(this, (function (jsx, helperPluginUtils, core, helperModuleImports, annotateAsPure) { 'use strict';

  jsx = jsx && Object.prototype.hasOwnProperty.call(jsx, 'default') ? jsx['default'] : jsx;
  annotateAsPure = annotateAsPure && Object.prototype.hasOwnProperty.call(annotateAsPure, 'default') ? annotateAsPure['default'] : annotateAsPure;

  //   importSource: "react",
  //   runtime: "automatic",
  //   pragma: "React.createElement",
  //   pragmaFrag: "React.Fragment",
  // };

  const DEFAULT = {
    importSource: "uuz",
    runtime: "automatic",
    pragma: "uuz.h",
    pragmaFrag: "uuz.h"
  };
  const JSX_SOURCE_ANNOTATION_REGEX = /\*?\s*@jsxImportSource\s+([^\s]+)/;
  const JSX_RUNTIME_ANNOTATION_REGEX = /\*?\s*@jsxRuntime\s+([^\s]+)/;
  const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
  const JSX_FRAG_ANNOTATION_REGEX = /\*?\s*@jsxFrag\s+([^\s]+)/;

  const get = (pass, name) => pass.get(`@babel/plugin-react-jsx/${name}`);

  const set = (pass, name, v) => pass.set(`@babel/plugin-react-jsx/${name}`, v);

  function createPlugin({
    name,
    development
  }) {
    return helperPluginUtils.declare((api, options) => {
      const {
        pure: PURE_ANNOTATION,
        throwIfNamespace = true,
        // TODO (Babel 8): It should throw if this option is used with the automatic runtime
        filter,
        runtime: RUNTIME_DEFAULT = process.env.BABEL_8_BREAKING ? "automatic" : development ? "automatic" : "classic",
        importSource: IMPORT_SOURCE_DEFAULT = DEFAULT.importSource,
        pragma: PRAGMA_DEFAULT = DEFAULT.pragma,
        pragmaFrag: PRAGMA_FRAG_DEFAULT = DEFAULT.pragmaFrag
      } = options;

      if (process.env.BABEL_8_BREAKING) {
        if ("useSpread" in options) {
          throw new Error('@babel/plugin-transform-react-jsx: Since Babel 8, an inline object with spread elements is always used, and the "useSpread" option is no longer available. Please remove it from your config.');
        }

        if ("useBuiltIns" in options) {
          const useBuiltInsFormatted = JSON.stringify(options.useBuiltIns);
          throw new Error(`@babel/plugin-transform-react-jsx: Since "useBuiltIns" is removed in Babel 8, you can remove it from the config.
- Babel 8 now transforms JSX spread to object spread. If you need to transpile object spread with
\`useBuiltIns: ${useBuiltInsFormatted}\`, you can use the following config
{
  "plugins": [
    "@babel/plugin-transform-react-jsx"
    ["@babel/plugin-proposal-object-rest-spread", { "loose": true, "useBuiltIns": ${useBuiltInsFormatted} }]
  ]
}`);
        }
      } else {
        // eslint-disable-next-line no-var
        var {
          useSpread = false,
          useBuiltIns = false
        } = options;

        if (RUNTIME_DEFAULT === "classic") {
          if (typeof useSpread !== "boolean") {
            throw new Error("transform-react-jsx currently only accepts a boolean option for " + "useSpread (defaults to false)");
          }

          if (typeof useBuiltIns !== "boolean") {
            throw new Error("transform-react-jsx currently only accepts a boolean option for " + "useBuiltIns (defaults to false)");
          }

          if (useSpread && useBuiltIns) {
            throw new Error("transform-react-jsx currently only accepts useBuiltIns or useSpread " + "but not both");
          }
        }
      }

      const injectMetaPropertiesVisitor = {
        JSXOpeningElement(path, state) {
          for (const attr of path.get("attributes")) {
            if (!attr.isJSXElement()) continue;
            const {
              name
            } = attr.node.name;

            if (name === "__source" || name === "__self") {
              throw path.buildCodeFrameError(`__source and __self should not be defined in props and are reserved for internal usage.`);
            }
          }

          const self = core.types.jsxAttribute(core.types.jsxIdentifier("__self"), core.types.jsxExpressionContainer(core.types.thisExpression()));
          const source = core.types.jsxAttribute(core.types.jsxIdentifier("__source"), core.types.jsxExpressionContainer(makeSource(path, state)));
          path.pushContainer("attributes", [self, source]);
        }

      };
      return {
        name,
        inherits: jsx,
        visitor: {
          JSXNamespacedName(path) {
            if (throwIfNamespace) {
              throw path.buildCodeFrameError(`Namespace tags are not supported by default. React's JSX doesn't support namespace tags. \
You can set \`throwIfNamespace: false\` to bypass this warning.`);
            }
          },

          JSXSpreadChild(path) {
            throw path.buildCodeFrameError("Spread children are not supported in React.");
          },

          Program: {
            enter(path, state) {
              const {
                file
              } = state;
              let runtime = RUNTIME_DEFAULT;
              let source = IMPORT_SOURCE_DEFAULT;
              let pragma = PRAGMA_DEFAULT;
              let pragmaFrag = PRAGMA_FRAG_DEFAULT;
              let sourceSet = !!options.importSource;
              let pragmaSet = !!options.pragma;
              let pragmaFragSet = !!options.pragmaFrag;

              if (file.ast.comments) {
                for (const comment of file.ast.comments) {
                  const sourceMatches = JSX_SOURCE_ANNOTATION_REGEX.exec(comment.value);

                  if (sourceMatches) {
                    source = sourceMatches[1];
                    sourceSet = true;
                  }

                  const runtimeMatches = JSX_RUNTIME_ANNOTATION_REGEX.exec(comment.value);

                  if (runtimeMatches) {
                    runtime = runtimeMatches[1];
                  }

                  const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);

                  if (jsxMatches) {
                    pragma = jsxMatches[1];
                    pragmaSet = true;
                  }

                  const jsxFragMatches = JSX_FRAG_ANNOTATION_REGEX.exec(comment.value);

                  if (jsxFragMatches) {
                    pragmaFrag = jsxFragMatches[1];
                    pragmaFragSet = true;
                  }
                }
              }

              set(state, "runtime", runtime);

              if (runtime === "classic") {
                if (sourceSet) {
                  throw path.buildCodeFrameError(`importSource cannot be set when runtime is classic.`);
                }

                const createElement = toMemberExpression(pragma);
                const fragment = toMemberExpression(pragmaFrag);
                set(state, "id/createElement", () => core.types.cloneNode(createElement));
                set(state, "id/fragment", () => core.types.cloneNode(fragment));
                set(state, "defaultPure", pragma === DEFAULT.pragma);
              } else if (runtime === "automatic") {
                if (pragmaSet || pragmaFragSet) {
                  throw path.buildCodeFrameError(`pragma and pragmaFrag cannot be set when runtime is automatic.`);
                }

                const define = (name, id) => set(state, name, createImportLazily(state, path, id, source));

                define("id/jsx", development ? "jsxDEV" : "jsx");
                define("id/jsxs", development ? "jsxDEV" : "jsxs");
                define("id/createElement", "createElement");
                define("id/fragment", "Fragment");
                set(state, "defaultPure", source === DEFAULT.importSource);
              } else {
                throw path.buildCodeFrameError(`Runtime must be either "classic" or "automatic".`);
              }

              if (development) {
                path.traverse(injectMetaPropertiesVisitor, state);
              }
            } // TODO (Babel 8): Decide if this should be removed or brought back.
            // see: https://github.com/babel/babel/pull/12253#discussion_r513086528
            //
            // exit(path, state) {
            //   if (
            //     get(state, "runtime") === "classic" &&
            //     get(state, "pragmaSet") &&
            //     get(state, "usedFragment") &&
            //     !get(state, "pragmaFragSet")
            //   ) {
            //     throw new Error(
            //       "transform-react-jsx: pragma has been set but " +
            //         "pragmaFrag has not been set",
            //     );
            //   }
            // },


          },
          JSXElement: {
            exit(path, file) {
              let callExpr;

              if (get(file, "runtime") === "classic" || shouldUseCreateElement(path)) {
                callExpr = buildCreateElementCall(path, file);
              } else {
                callExpr = buildJSXElementCall(path, file);
              }

              path.replaceWith(core.types.inherits(callExpr, path.node));
            }

          },
          JSXFragment: {
            exit(path, file) {
              let callExpr;

              if (get(file, "runtime") === "classic") {
                callExpr = buildCreateElementFragmentCall(path, file);
              } else {
                callExpr = buildJSXFragmentCall(path, file);
              }

              path.replaceWith(core.types.inherits(callExpr, path.node));
            }

          },

          JSXAttribute(path) {
            if (core.types.isJSXElement(path.node.value)) {
              path.node.value = core.types.jsxExpressionContainer(path.node.value);
            }
          }

        }
      };

      function call(pass, name, args) {
        const node = core.types.callExpression(get(pass, `id/${name}`)(), args);
        if (PURE_ANNOTATION ?? get(pass, "defaultPure")) annotateAsPure(node);
        return node;
      } // We want to use React.createElement, even in the case of
      // jsx, for <div {...props} key={key} /> to distinguish it
      // from <div key={key} {...props} />. This is an intermediary
      // step while we deprecate key spread from props. Afterwards,
      // we will stop using createElement in the transform.


      function shouldUseCreateElement(path) {
        const openingPath = path.get("openingElement");
        const attributes = openingPath.node.attributes;
        let seenPropsSpread = false;

        for (let i = 0; i < attributes.length; i++) {
          const attr = attributes[i];

          if (seenPropsSpread && core.types.isJSXAttribute(attr) && attr.name.name === "key") {
            return true;
          } else if (core.types.isJSXSpreadAttribute(attr)) {
            seenPropsSpread = true;
          }
        }

        return false;
      }

      function convertJSXIdentifier(node, parent) {
        if (core.types.isJSXIdentifier(node)) {
          if (node.name === "this" && core.types.isReferenced(node, parent)) {
            return core.types.thisExpression();
          } else if (core.types.isValidIdentifier(node.name, false)) {
            node.type = "Identifier";
          } else {
            return core.types.stringLiteral(node.name);
          }
        } else if (core.types.isJSXMemberExpression(node)) {
          return core.types.memberExpression(convertJSXIdentifier(node.object, node), convertJSXIdentifier(node.property, node));
        } else if (core.types.isJSXNamespacedName(node)) {
          /**
           * If the flag "throwIfNamespace" is false
           * print XMLNamespace like string literal
           */
          return core.types.stringLiteral(`${node.namespace.name}:${node.name.name}`);
        }

        return node;
      }

      function convertAttributeValue(node) {
        if (core.types.isJSXExpressionContainer(node)) {
          return node.expression;
        } else {
          return node;
        }
      }

      function accumulateAttribute(array, attribute) {
        if (core.types.isJSXSpreadAttribute(attribute.node)) {
          const arg = attribute.node.argument; // Collect properties into props array if spreading object expression

          if (core.types.isObjectExpression(arg)) {
            array.push(...arg.properties);
          } else {
            array.push(core.types.spreadElement(arg));
          }

          return array;
        }

        const value = convertAttributeValue(attribute.node.name.name !== "key" ? attribute.node.value || core.types.booleanLiteral(true) : attribute.node.value);

        if (attribute.node.name.name === "key" && value === null) {
          throw attribute.buildCodeFrameError('Please provide an explicit key value. Using "key" as a shorthand for "key={true}" is not allowed.');
        }

        if (core.types.isStringLiteral(value) && !core.types.isJSXExpressionContainer(attribute.node.value)) {
          value.value = value.value.replace(/\n\s+/g, " "); // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.

          delete value.extra?.raw;
        }

        if (core.types.isJSXNamespacedName(attribute.node.name)) {
          attribute.node.name = core.types.stringLiteral(attribute.node.name.namespace.name + ":" + attribute.node.name.name.name);
        } else if (core.types.isValidIdentifier(attribute.node.name.name, false)) {
          attribute.node.name.type = "Identifier";
        } else {
          attribute.node.name = core.types.stringLiteral(attribute.node.name.name);
        }

        array.push(core.types.inherits(core.types.objectProperty(attribute.node.name, value), attribute.node));
        return array;
      }

      function buildChildrenProperty(children) {
        let childrenNode;

        if (children.length === 1) {
          childrenNode = children[0];
        } else if (children.length > 1) {
          childrenNode = core.types.arrayExpression(children);
        } else {
          return undefined;
        }

        return core.types.objectProperty(core.types.identifier("children"), childrenNode);
      } // Builds JSX into:
      // Production: React.jsx(type, arguments, key)
      // Development: React.jsxDEV(type, arguments, key, isStaticChildren, source, self)


      function buildJSXElementCall(path, file) {
        const openingPath = path.get("openingElement");
        const args = [getTag(openingPath)];
        let attribs = [];
        const extracted = Object.create(null); // for React.jsx, key, __source (dev), and __self (dev) is passed in as
        // a separate argument rather than in the args object. We go through the
        // props and filter out these three keywords so we can pass them in
        // as separate arguments later

        for (const attr of openingPath.get("attributes")) {
          if (attr.isJSXAttribute() && core.types.isJSXIdentifier(attr.node.name)) {
            const {
              name
            } = attr.node.name;

            switch (name) {
              case "__source":
              case "__self":
                if (extracted[name]) throw sourceSelfError(path, name);

              /* falls through */

              case "key":
                {
                  const keyValue = convertAttributeValue(attr.node.value);

                  if (keyValue === null) {
                    throw attr.buildCodeFrameError('Please provide an explicit key value. Using "key" as a shorthand for "key={true}" is not allowed.');
                  }

                  extracted[name] = keyValue;
                  break;
                }

              default:
                attribs.push(attr);
            }
          } else {
            attribs.push(attr);
          }
        }

        const children = core.types.react.buildChildren(path.node);

        if (attribs.length || children.length) {
          attribs = buildJSXOpeningElementAttributes(attribs, file, children);
        } else {
          // attributes should never be null
          attribs = core.types.objectExpression([]);
        }

        args.push(attribs);

        if (development) {
          // isStaticChildren, __source, and __self are only used in development
          // automatically include __source and __self in this plugin
          // so we can eliminate the need for separate Babel plugins in Babel 8
          args.push(extracted.key ?? path.scope.buildUndefinedNode(), core.types.booleanLiteral(children.length > 1), extracted.__source ?? path.scope.buildUndefinedNode(), extracted.__self ?? core.types.thisExpression());
        } else if (extracted.key !== undefined) {
          args.push(extracted.key);
        }

        return call(file, children.length > 1 ? "jsxs" : "jsx", args);
      } // Builds props for React.jsx. This function adds children into the props
      // and ensures that props is always an object


      function buildJSXOpeningElementAttributes(attribs, file, children) {
        const props = attribs.reduce(accumulateAttribute, []); // In React.jsx, children is no longer a separate argument, but passed in
        // through the argument object

        if (children?.length > 0) {
          props.push(buildChildrenProperty(children));
        }

        return core.types.objectExpression(props);
      } // Builds JSX Fragment <></> into
      // Production: React.jsx(type, arguments)
      // Development: React.jsxDEV(type, { children })


      function buildJSXFragmentCall(path, file) {
        const args = [get(file, "id/fragment")()];
        const children = core.types.react.buildChildren(path.node);
        args.push(core.types.objectExpression(children.length > 0 ? [buildChildrenProperty(children)] : []));

        if (development) {
          args.push(path.scope.buildUndefinedNode(), core.types.booleanLiteral(children.length > 1));
        }

        return call(file, children.length > 1 ? "jsxs" : "jsx", args);
      } // Builds JSX Fragment <></> into
      // React.createElement(React.Fragment, null, ...children)


      function buildCreateElementFragmentCall(path, file) {
        if (filter && !filter(path.node, file)) return;
        return call(file, "createElement", [get(file, "id/fragment")(), core.types.nullLiteral(), ...core.types.react.buildChildren(path.node)]);
      } // Builds JSX into:
      // Production: React.createElement(type, arguments, children)
      // Development: React.createElement(type, arguments, children, source, self)


      function buildCreateElementCall(path, file) {
        const openingPath = path.get("openingElement");
        return call(file, "createElement", [getTag(openingPath), buildCreateElementOpeningElementAttributes(file, path, openingPath.get("attributes")), ...core.types.react.buildChildren(path.node)]);
      }

      function getTag(openingPath) {
        const tagExpr = convertJSXIdentifier(openingPath.node.name, openingPath.node);
        let tagName;

        if (core.types.isIdentifier(tagExpr)) {
          tagName = tagExpr.name;
        } else if (core.types.isLiteral(tagExpr)) {
          tagName = tagExpr.value;
        }

        if (core.types.react.isCompatTag(tagName)) {
          return core.types.stringLiteral(tagName);
        } else {
          return tagExpr;
        }
      }
      /**
       * The logic for this is quite terse. It's because we need to
       * support spread elements. We loop over all attributes,
       * breaking on spreads, we then push a new object containing
       * all prior attributes to an array for later processing.
       */


      function buildCreateElementOpeningElementAttributes(file, path, attribs) {
        const runtime = get(file, "runtime");

        if (!process.env.BABEL_8_BREAKING) {
          if (runtime !== "automatic") {
            const objs = [];
            const props = attribs.reduce(accumulateAttribute, []);

            if (!useSpread) {
              // Convert syntax to use multiple objects instead of spread
              let start = 0;
              props.forEach((prop, i) => {
                if (core.types.isSpreadElement(prop)) {
                  if (i > start) {
                    objs.push(core.types.objectExpression(props.slice(start, i)));
                  }

                  objs.push(prop.argument);
                  start = i + 1;
                }
              });

              if (props.length > start) {
                objs.push(core.types.objectExpression(props.slice(start)));
              }
            } else if (props.length) {
              objs.push(core.types.objectExpression(props));
            }

            if (!objs.length) {
              return core.types.nullLiteral();
            }

            if (objs.length === 1) {
              return objs[0];
            } // looks like we have multiple objects


            if (!core.types.isObjectExpression(objs[0])) {
              objs.unshift(core.types.objectExpression([]));
            }

            const helper = useBuiltIns ? core.types.memberExpression(core.types.identifier("Object"), core.types.identifier("assign")) : file.addHelper("extends"); // spread it

            return core.types.callExpression(helper, objs);
          }
        }

        const props = [];
        const found = Object.create(null);

        for (const attr of attribs) {
          const name = core.types.isJSXAttribute(attr) && core.types.isJSXIdentifier(attr.name) && attr.name.name;

          if (runtime === "automatic" && (name === "__source" || name === "__self")) {
            if (found[name]) throw sourceSelfError(path, name);
            found[name] = true;
          }

          accumulateAttribute(props, attr);
        }

        return props.length === 1 && core.types.isSpreadElement(props[0]) ? props[0].argument : props.length > 0 ? core.types.objectExpression(props) : core.types.nullLiteral();
      }
    });

    function getSource(source, importName) {
      switch (importName) {
        case "Fragment":
          return `${source}/${development ? "jsx-dev-runtime" : "jsx-runtime"}`;

        case "jsxDEV":
          return `${source}/jsx-dev-runtime`;

        case "jsx":
        case "uuz":
        case "jsxs":
          return `${source}/jsx-runtime`;

        case "createElement":
          return source;
      }
    }

    function createImportLazily(pass, path, importName, source) {
      return () => {
        const actualSource = getSource(source, importName);

        if (helperModuleImports.isModule(path)) {
          let reference = get(pass, `imports/${importName}`);
          if (reference) return core.types.cloneNode(reference);
          reference = helperModuleImports.addNamed(path, importName, actualSource, {
            importedInterop: "uncompiled",
            importPosition: "after"
          });
          set(pass, `imports/${importName}`, reference);
          return reference;
        } else {
          let reference = get(pass, `requires/${actualSource}`);

          if (reference) {
            reference = core.types.cloneNode(reference);
          } else {
            reference = helperModuleImports.addNamespace(path, actualSource, {
              importedInterop: "uncompiled"
            });
            set(pass, `requires/${actualSource}`, reference);
          }

          return core.types.memberExpression(reference, core.types.identifier(importName));
        }
      };
    }
  }

  function toMemberExpression(id) {
    return id.split(".").map(name => core.types.identifier(name)).reduce((object, property) => core.types.memberExpression(object, property));
  }

  function makeSource(path, state) {
    const location = path.node.loc;

    if (!location) {
      // the element was generated and doesn't have location information
      return path.scope.buildUndefinedNode();
    }

    if (!state.fileNameIdentifier) {
      const {
        filename = ""
      } = state;
      const fileNameIdentifier = path.scope.generateUidIdentifier("_jsxFileName");
      const scope = path.hub.getScope();

      if (scope) {
        scope.push({
          id: fileNameIdentifier,
          init: core.types.stringLiteral(filename)
        });
      }

      state.fileNameIdentifier = fileNameIdentifier;
    }

    return makeTrace(core.types.cloneNode(state.fileNameIdentifier), location.start.line, location.start.column);
  }

  function makeTrace(fileNameIdentifier, lineNumber, column0Based) {
    const fileLineLiteral = lineNumber != null ? core.types.numericLiteral(lineNumber) : core.types.nullLiteral();
    const fileColumnLiteral = column0Based != null ? core.types.numericLiteral(column0Based + 1) : core.types.nullLiteral();
    const fileNameProperty = core.types.objectProperty(core.types.identifier("fileName"), fileNameIdentifier);
    const lineNumberProperty = core.types.objectProperty(core.types.identifier("lineNumber"), fileLineLiteral);
    const columnNumberProperty = core.types.objectProperty(core.types.identifier("columnNumber"), fileColumnLiteral);
    return core.types.objectExpression([fileNameProperty, lineNumberProperty, columnNumberProperty]);
  }

  function sourceSelfError(path, name) {
    const pluginName = `transform-react-jsx-${name.slice(2)}`;
    return path.buildCodeFrameError(`Duplicate ${name} prop found. You are most likely using the deprecated ${pluginName} Babel plugin. Both __source and __self are automatically set when using the automatic runtime. Please remove transform-react-jsx-source and transform-react-jsx-self from your Babel config.`);
  }

  var babelPluginUuzJsx = createPlugin({
    name: "transform-uuz-jsx",
    development: false
  });

  return babelPluginUuzJsx;

})));
