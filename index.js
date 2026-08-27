(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
/*! (c) Andrea Giammarchi @webreflection ISC */
(function() {
  var attributesObserver = function(whenDefined2, MutationObserver2) {
    var attributeChanged = function attributeChanged2(records) {
      for (var i = 0, length = records.length; i < length; i++) dispatch(records[i]);
    };
    var dispatch = function dispatch2(_ref2) {
      var target = _ref2.target, attributeName = _ref2.attributeName, oldValue = _ref2.oldValue;
      target.attributeChangedCallback(attributeName, oldValue, target.getAttribute(attributeName));
    };
    return function(target, is2) {
      var attributeFilter = target.constructor.observedAttributes;
      if (attributeFilter) {
        whenDefined2(is2).then(function() {
          new MutationObserver2(attributeChanged).observe(target, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter
          });
          for (var i = 0, length = attributeFilter.length; i < length; i++) {
            if (target.hasAttribute(attributeFilter[i])) dispatch({
              target,
              attributeName: attributeFilter[i],
              oldValue: null
            });
          }
        });
      }
      return target;
    };
  };
  function _unsupportedIterableToArray(o2, minLen) {
    if (!o2) return;
    if (typeof o2 === "string") return _arrayLikeToArray(o2, minLen);
    var n2 = Object.prototype.toString.call(o2).slice(8, -1);
    if (n2 === "Object" && o2.constructor) n2 = o2.constructor.name;
    if (n2 === "Map" || n2 === "Set") return Array.from(o2);
    if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2)) return _arrayLikeToArray(o2, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelper(o2, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o2[Symbol.iterator] || o2["@@iterator"];
    if (!it) {
      if (Array.isArray(o2) || (it = _unsupportedIterableToArray(o2)) || allowArrayLike) {
        if (it) o2 = it;
        var i = 0;
        var F = function() {
        };
        return {
          s: F,
          n: function() {
            if (i >= o2.length) return {
              done: true
            };
            return {
              done: false,
              value: o2[i++]
            };
          },
          e: function(e2) {
            throw e2;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err2;
    return {
      s: function() {
        it = it.call(o2);
      },
      n: function() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function(e2) {
        didErr = true;
        err2 = e2;
      },
      f: function() {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err2;
        }
      }
    };
  }
  /*! (c) Andrea Giammarchi - ISC */
  var TRUE = true, FALSE = false, QSA$1 = "querySelectorAll";
  var notify = function notify2(callback) {
    var root = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : document;
    var MO = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : MutationObserver;
    var query2 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ["*"];
    var loop = function loop2(nodes, selectors, added, removed, connected, pass) {
      var _iterator = _createForOfIteratorHelper(nodes), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var node = _step.value;
          if (pass || QSA$1 in node) {
            if (connected) {
              if (!added.has(node)) {
                added.add(node);
                removed["delete"](node);
                callback(node, connected);
              }
            } else if (!removed.has(node)) {
              removed.add(node);
              added["delete"](node);
              callback(node, connected);
            }
            if (!pass) loop2(node[QSA$1](selectors), selectors, added, removed, connected, TRUE);
          }
        }
      } catch (err2) {
        _iterator.e(err2);
      } finally {
        _iterator.f();
      }
    };
    var mo = new MO(function(records) {
      if (query2.length) {
        var selectors = query2.join(",");
        var added = /* @__PURE__ */ new Set(), removed = /* @__PURE__ */ new Set();
        var _iterator2 = _createForOfIteratorHelper(records), _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            var _step2$value = _step2.value, addedNodes = _step2$value.addedNodes, removedNodes = _step2$value.removedNodes;
            loop(removedNodes, selectors, added, removed, FALSE, FALSE);
            loop(addedNodes, selectors, added, removed, TRUE, FALSE);
          }
        } catch (err2) {
          _iterator2.e(err2);
        } finally {
          _iterator2.f();
        }
      }
    });
    var observe = mo.observe;
    (mo.observe = function(node) {
      return observe.call(mo, node, {
        subtree: TRUE,
        childList: TRUE
      });
    })(root);
    return mo;
  };
  var QSA = "querySelectorAll";
  var _self$1 = self, document$2 = _self$1.document, Element$1 = _self$1.Element, MutationObserver$2 = _self$1.MutationObserver, Set$2 = _self$1.Set, WeakMap$1 = _self$1.WeakMap;
  var elements2 = function elements3(element) {
    return QSA in element;
  };
  var filter2 = [].filter;
  var qsaObserver = function(options) {
    var live = new WeakMap$1();
    var drop2 = function drop3(elements3) {
      for (var i = 0, length = elements3.length; i < length; i++) live["delete"](elements3[i]);
    };
    var flush = function flush2() {
      var records = observer.takeRecords();
      for (var i = 0, length = records.length; i < length; i++) {
        parse3(filter2.call(records[i].removedNodes, elements2), false);
        parse3(filter2.call(records[i].addedNodes, elements2), true);
      }
    };
    var matches = function matches2(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };
    var notifier = function notifier2(element, connected) {
      var selectors;
      if (connected) {
        for (var q, m2 = matches(element), i = 0, length = query2.length; i < length; i++) {
          if (m2.call(element, q = query2[i])) {
            if (!live.has(element)) live.set(element, new Set$2());
            selectors = live.get(element);
            if (!selectors.has(q)) {
              selectors.add(q);
              options.handle(element, connected, q);
            }
          }
        }
      } else if (live.has(element)) {
        selectors = live.get(element);
        live["delete"](element);
        selectors.forEach(function(q2) {
          options.handle(element, connected, q2);
        });
      }
    };
    var parse3 = function parse4(elements3) {
      var connected = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      for (var i = 0, length = elements3.length; i < length; i++) notifier(elements3[i], connected);
    };
    var query2 = options.query;
    var root = options.root || document$2;
    var observer = notify(notifier, root, MutationObserver$2, query2);
    var attachShadow2 = Element$1.prototype.attachShadow;
    if (attachShadow2) Element$1.prototype.attachShadow = function(init2) {
      var shadowRoot = attachShadow2.call(this, init2);
      observer.observe(shadowRoot);
      return shadowRoot;
    };
    if (query2.length) parse3(root[QSA](query2));
    return {
      drop: drop2,
      flush,
      observer,
      parse: parse3
    };
  };
  var _self = self, document$1 = _self.document, Map2 = _self.Map, MutationObserver$1 = _self.MutationObserver, Object$1 = _self.Object, Set$1 = _self.Set, WeakMap2 = _self.WeakMap, Element2 = _self.Element, HTMLElement2 = _self.HTMLElement, Node = _self.Node, Error2 = _self.Error, TypeError$1 = _self.TypeError, Reflect = _self.Reflect;
  var defineProperty = Object$1.defineProperty, keys = Object$1.keys, getOwnPropertyNames = Object$1.getOwnPropertyNames, setPrototypeOf2 = Object$1.setPrototypeOf;
  var legacy = !self.customElements;
  var expando = function expando2(element) {
    var key = keys(element);
    var value = [];
    var ignore = new Set$1();
    var length = key.length;
    for (var i = 0; i < length; i++) {
      value[i] = element[key[i]];
      try {
        delete element[key[i]];
      } catch (SafariTP) {
        ignore.add(i);
      }
    }
    return function() {
      for (var _i = 0; _i < length; _i++) ignore.has(_i) || (element[key[_i]] = value[_i]);
    };
  };
  if (legacy) {
    var HTMLBuiltIn = function HTMLBuiltIn2() {
      var constructor = this.constructor;
      if (!classes.has(constructor)) throw new TypeError$1("Illegal constructor");
      var is2 = classes.get(constructor);
      if (override) return augment(override, is2);
      var element = createElement.call(document$1, is2);
      return augment(setPrototypeOf2(element, constructor.prototype), is2);
    };
    var createElement = document$1.createElement;
    var classes = new Map2();
    var defined = new Map2();
    var prototypes = new Map2();
    var registry = new Map2();
    var query = [];
    var handle = function handle2(element, connected, selector) {
      var proto = prototypes.get(selector);
      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        override = setPrototypeOf2(element, proto);
        try {
          new proto.constructor();
        } finally {
          override = null;
          redefine();
        }
      }
      var method = "".concat(connected ? "" : "dis", "connectedCallback");
      if (method in proto) element[method]();
    };
    var _qsaObserver = qsaObserver({
      query,
      handle
    }), parse2 = _qsaObserver.parse;
    var override = null;
    var whenDefined = function whenDefined2(name) {
      if (!defined.has(name)) {
        var _, $ = new Promise(function($2) {
          _ = $2;
        });
        defined.set(name, {
          $,
          _
        });
      }
      return defined.get(name).$;
    };
    var augment = attributesObserver(whenDefined, MutationObserver$1);
    self.customElements = {
      define: function define2(is2, Class) {
        if (registry.has(is2)) throw new Error2('the name "'.concat(is2, '" has already been used with this registry'));
        classes.set(Class, is2);
        prototypes.set(is2, Class.prototype);
        registry.set(is2, Class);
        query.push(is2);
        whenDefined(is2).then(function() {
          parse2(document$1.querySelectorAll(is2));
        });
        defined.get(is2)._(Class);
      },
      get: function get2(is2) {
        return registry.get(is2);
      },
      whenDefined
    };
    defineProperty(HTMLBuiltIn.prototype = HTMLElement2.prototype, "constructor", {
      value: HTMLBuiltIn
    });
    self.HTMLElement = HTMLBuiltIn;
    document$1.createElement = function(name, options) {
      var is2 = options && options.is;
      var Class = is2 ? registry.get(is2) : registry.get(name);
      return Class ? new Class() : createElement.call(document$1, name);
    };
    if (!("isConnected" in Node.prototype)) defineProperty(Node.prototype, "isConnected", {
      configurable: true,
      get: function get2() {
        return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
      }
    });
  } else {
    legacy = !self.customElements.get("extends-br");
    if (legacy) {
      try {
        var BR = function BR2() {
          return self.Reflect.construct(HTMLBRElement, [], BR2);
        };
        BR.prototype = HTMLLIElement.prototype;
        var is = "extends-br";
        self.customElements.define("extends-br", BR, {
          "extends": "br"
        });
        legacy = document$1.createElement("br", {
          is
        }).outerHTML.indexOf(is) < 0;
        var _self$customElements = self.customElements, get = _self$customElements.get, _whenDefined = _self$customElements.whenDefined;
        self.customElements.whenDefined = function(is2) {
          var _this = this;
          return _whenDefined.call(this, is2).then(function(Class) {
            return Class || get.call(_this, is2);
          });
        };
      } catch (o_O) {
      }
    }
  }
  if (legacy) {
    var _parseShadow = function _parseShadow2(element) {
      var root = shadowRoots.get(element);
      _parse(root.querySelectorAll(this), element.isConnected);
    };
    var customElements2 = self.customElements;
    var _createElement = document$1.createElement;
    var define = customElements2.define, _get = customElements2.get, upgrade = customElements2.upgrade;
    var _ref = Reflect || {
      construct: function construct2(HTMLElement3) {
        return HTMLElement3.call(this);
      }
    }, construct = _ref.construct;
    var shadowRoots = new WeakMap2();
    var shadows = new Set$1();
    var _classes = new Map2();
    var _defined = new Map2();
    var _prototypes = new Map2();
    var _registry = new Map2();
    var shadowed = [];
    var _query = [];
    var getCE = function getCE2(is2) {
      return _registry.get(is2) || _get.call(customElements2, is2);
    };
    var _handle = function _handle2(element, connected, selector) {
      var proto = _prototypes.get(selector);
      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        _override = setPrototypeOf2(element, proto);
        try {
          new proto.constructor();
        } finally {
          _override = null;
          redefine();
        }
      }
      var method = "".concat(connected ? "" : "dis", "connectedCallback");
      if (method in proto) element[method]();
    };
    var _qsaObserver2 = qsaObserver({
      query: _query,
      handle: _handle
    }), _parse = _qsaObserver2.parse;
    var _qsaObserver3 = qsaObserver({
      query: shadowed,
      handle: function handle2(element, connected) {
        if (shadowRoots.has(element)) {
          if (connected) shadows.add(element);
          else shadows["delete"](element);
          if (_query.length) _parseShadow.call(_query, element);
        }
      }
    }), parseShadowed = _qsaObserver3.parse;
    var attachShadow = Element2.prototype.attachShadow;
    if (attachShadow) Element2.prototype.attachShadow = function(init2) {
      var root = attachShadow.call(this, init2);
      shadowRoots.set(this, root);
      return root;
    };
    var _whenDefined2 = function _whenDefined22(name) {
      if (!_defined.has(name)) {
        var _, $ = new Promise(function($2) {
          _ = $2;
        });
        _defined.set(name, {
          $,
          _
        });
      }
      return _defined.get(name).$;
    };
    var _augment = attributesObserver(_whenDefined2, MutationObserver$1);
    var _override = null;
    getOwnPropertyNames(self).filter(function(k2) {
      return /^HTML.*Element$/.test(k2);
    }).forEach(function(k2) {
      var HTMLElement3 = self[k2];
      function HTMLBuiltIn2() {
        var constructor = this.constructor;
        if (!_classes.has(constructor)) throw new TypeError$1("Illegal constructor");
        var _classes$get = _classes.get(constructor), is2 = _classes$get.is, tag2 = _classes$get.tag;
        if (is2) {
          if (_override) return _augment(_override, is2);
          var element = _createElement.call(document$1, tag2);
          element.setAttribute("is", is2);
          return _augment(setPrototypeOf2(element, constructor.prototype), is2);
        } else return construct.call(this, HTMLElement3, [], constructor);
      }
      defineProperty(HTMLBuiltIn2.prototype = HTMLElement3.prototype, "constructor", {
        value: HTMLBuiltIn2
      });
      defineProperty(self, k2, {
        value: HTMLBuiltIn2
      });
    });
    document$1.createElement = function(name, options) {
      var is2 = options && options.is;
      if (is2) {
        var Class = _registry.get(is2);
        if (Class && _classes.get(Class).tag === name) return new Class();
      }
      var element = _createElement.call(document$1, name);
      if (is2) element.setAttribute("is", is2);
      return element;
    };
    customElements2.get = getCE;
    customElements2.whenDefined = _whenDefined2;
    customElements2.upgrade = function(element) {
      var is2 = element.getAttribute("is");
      if (is2) {
        var _constructor = _registry.get(is2);
        if (_constructor) {
          _augment(setPrototypeOf2(element, _constructor.prototype), is2);
          return;
        }
      }
      upgrade.call(customElements2, element);
    };
    customElements2.define = function(is2, Class, options) {
      if (getCE(is2)) throw new Error2("'".concat(is2, "' has already been defined as a custom element"));
      var selector;
      var tag2 = options && options["extends"];
      _classes.set(Class, tag2 ? {
        is: is2,
        tag: tag2
      } : {
        is: "",
        tag: is2
      });
      if (tag2) {
        selector = "".concat(tag2, '[is="').concat(is2, '"]');
        _prototypes.set(selector, Class.prototype);
        _registry.set(is2, Class);
        _query.push(selector);
      } else {
        define.apply(customElements2, arguments);
        shadowed.push(selector = is2);
      }
      _whenDefined2(is2).then(function() {
        if (tag2) {
          _parse(document$1.querySelectorAll(selector));
          shadows.forEach(_parseShadow, [selector]);
        } else parseShadowed(document$1.querySelectorAll(selector));
      });
      _defined.get(is2)._(Class);
    };
  }
})();
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var stacktrace = { exports: {} };
var errorStackParser = { exports: {} };
var stackframe = { exports: {} };
var hasRequiredStackframe;
function requireStackframe() {
  if (hasRequiredStackframe) return stackframe.exports;
  hasRequiredStackframe = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory();
      }
    })(commonjsGlobal, function() {
      function _isNumber(n2) {
        return !isNaN(parseFloat(n2)) && isFinite(n2);
      }
      function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      }
      function _getter(p2) {
        return function() {
          return this[p2];
        };
      }
      var booleanProps = ["isConstructor", "isEval", "isNative", "isToplevel"];
      var numericProps = ["columnNumber", "lineNumber"];
      var stringProps = ["fileName", "functionName", "source"];
      var arrayProps = ["args"];
      var objectProps = ["evalOrigin"];
      var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);
      function StackFrame(obj) {
        if (!obj) return;
        for (var i2 = 0; i2 < props.length; i2++) {
          if (obj[props[i2]] !== void 0) {
            this["set" + _capitalize(props[i2])](obj[props[i2]]);
          }
        }
      }
      StackFrame.prototype = {
        getArgs: function() {
          return this.args;
        },
        setArgs: function(v2) {
          if (Object.prototype.toString.call(v2) !== "[object Array]") {
            throw new TypeError("Args must be an Array");
          }
          this.args = v2;
        },
        getEvalOrigin: function() {
          return this.evalOrigin;
        },
        setEvalOrigin: function(v2) {
          if (v2 instanceof StackFrame) {
            this.evalOrigin = v2;
          } else if (v2 instanceof Object) {
            this.evalOrigin = new StackFrame(v2);
          } else {
            throw new TypeError("Eval Origin must be an Object or StackFrame");
          }
        },
        toString: function() {
          var fileName = this.getFileName() || "";
          var lineNumber = this.getLineNumber() || "";
          var columnNumber = this.getColumnNumber() || "";
          var functionName = this.getFunctionName() || "";
          if (this.getIsEval()) {
            if (fileName) {
              return "[eval] (" + fileName + ":" + lineNumber + ":" + columnNumber + ")";
            }
            return "[eval]:" + lineNumber + ":" + columnNumber;
          }
          if (functionName) {
            return functionName + " (" + fileName + ":" + lineNumber + ":" + columnNumber + ")";
          }
          return fileName + ":" + lineNumber + ":" + columnNumber;
        }
      };
      StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf("(");
        var argsEndIndex = str.lastIndexOf(")");
        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(",");
        var locationString = str.substring(argsEndIndex + 1);
        if (locationString.indexOf("@") === 0) {
          var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, "");
          var fileName = parts[1];
          var lineNumber = parts[2];
          var columnNumber = parts[3];
        }
        return new StackFrame({
          functionName,
          args: args || void 0,
          fileName,
          lineNumber: lineNumber || void 0,
          columnNumber: columnNumber || void 0
        });
      };
      for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype["get" + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype["set" + _capitalize(booleanProps[i])] = /* @__PURE__ */ function(p2) {
          return function(v2) {
            this[p2] = Boolean(v2);
          };
        }(booleanProps[i]);
      }
      for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype["get" + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype["set" + _capitalize(numericProps[j])] = /* @__PURE__ */ function(p2) {
          return function(v2) {
            if (!_isNumber(v2)) {
              throw new TypeError(p2 + " must be a Number");
            }
            this[p2] = Number(v2);
          };
        }(numericProps[j]);
      }
      for (var k2 = 0; k2 < stringProps.length; k2++) {
        StackFrame.prototype["get" + _capitalize(stringProps[k2])] = _getter(stringProps[k2]);
        StackFrame.prototype["set" + _capitalize(stringProps[k2])] = /* @__PURE__ */ function(p2) {
          return function(v2) {
            this[p2] = String(v2);
          };
        }(stringProps[k2]);
      }
      return StackFrame;
    });
  })(stackframe);
  return stackframe.exports;
}
var hasRequiredErrorStackParser;
function requireErrorStackParser() {
  if (hasRequiredErrorStackParser) return errorStackParser.exports;
  hasRequiredErrorStackParser = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireStackframe());
      }
    })(commonjsGlobal, function ErrorStackParser(StackFrame) {
      var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
      var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
      var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
      return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
          if (typeof error.stacktrace !== "undefined" || typeof error["opera#sourceloc"] !== "undefined") {
            return this.parseOpera(error);
          } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
            return this.parseV8OrIE(error);
          } else if (error.stack) {
            return this.parseFFOrSafari(error);
          } else {
            throw new Error("Cannot parse given Error object");
          }
        },
        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
          if (urlLike.indexOf(":") === -1) {
            return [urlLike];
          }
          var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
          var parts = regExp.exec(urlLike.replace(/[()]/g, ""));
          return [parts[1], parts[2] || void 0, parts[3] || void 0];
        },
        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
          var filtered = error.stack.split("\n").filter(function(line) {
            return !!line.match(CHROME_IE_STACK_REGEXP);
          }, this);
          return filtered.map(function(line) {
            if (line.indexOf("(eval ") > -1) {
              line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
            }
            var sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
            var location2 = sanitizedLine.match(/ (\(.+\)$)/);
            sanitizedLine = location2 ? sanitizedLine.replace(location2[0], "") : sanitizedLine;
            var locationParts = this.extractLocation(location2 ? location2[1] : sanitizedLine);
            var functionName = location2 && sanitizedLine || void 0;
            var fileName = ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1 ? void 0 : locationParts[0];
            return new StackFrame({
              functionName,
              fileName,
              lineNumber: locationParts[1],
              columnNumber: locationParts[2],
              source: line
            });
          }, this);
        },
        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
          var filtered = error.stack.split("\n").filter(function(line) {
            return !line.match(SAFARI_NATIVE_CODE_REGEXP);
          }, this);
          return filtered.map(function(line) {
            if (line.indexOf(" > eval") > -1) {
              line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
            }
            if (line.indexOf("@") === -1 && line.indexOf(":") === -1) {
              return new StackFrame({
                functionName: line
              });
            } else {
              var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
              var matches = line.match(functionNameRegex);
              var functionName = matches && matches[1] ? matches[1] : void 0;
              var locationParts = this.extractLocation(line.replace(functionNameRegex, ""));
              return new StackFrame({
                functionName,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: line
              });
            }
          }, this);
        },
        parseOpera: function ErrorStackParser$$parseOpera(e2) {
          if (!e2.stacktrace || e2.message.indexOf("\n") > -1 && e2.message.split("\n").length > e2.stacktrace.split("\n").length) {
            return this.parseOpera9(e2);
          } else if (!e2.stack) {
            return this.parseOpera10(e2);
          } else {
            return this.parseOpera11(e2);
          }
        },
        parseOpera9: function ErrorStackParser$$parseOpera9(e2) {
          var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
          var lines = e2.message.split("\n");
          var result = [];
          for (var i = 2, len = lines.length; i < len; i += 2) {
            var match2 = lineRE.exec(lines[i]);
            if (match2) {
              result.push(new StackFrame({
                fileName: match2[2],
                lineNumber: match2[1],
                source: lines[i]
              }));
            }
          }
          return result;
        },
        parseOpera10: function ErrorStackParser$$parseOpera10(e2) {
          var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
          var lines = e2.stacktrace.split("\n");
          var result = [];
          for (var i = 0, len = lines.length; i < len; i += 2) {
            var match2 = lineRE.exec(lines[i]);
            if (match2) {
              result.push(
                new StackFrame({
                  functionName: match2[3] || void 0,
                  fileName: match2[2],
                  lineNumber: match2[1],
                  source: lines[i]
                })
              );
            }
          }
          return result;
        },
        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
          var filtered = error.stack.split("\n").filter(function(line) {
            return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
          }, this);
          return filtered.map(function(line) {
            var tokens = line.split("@");
            var locationParts = this.extractLocation(tokens.pop());
            var functionCall = tokens.shift() || "";
            var functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || void 0;
            var argsRaw;
            if (functionCall.match(/\(([^)]*)\)/)) {
              argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, "$1");
            }
            var args = argsRaw === void 0 || argsRaw === "[arguments not available]" ? void 0 : argsRaw.split(",");
            return new StackFrame({
              functionName,
              args,
              fileName: locationParts[0],
              lineNumber: locationParts[1],
              columnNumber: locationParts[2],
              source: line
            });
          }, this);
        }
      };
    });
  })(errorStackParser);
  return errorStackParser.exports;
}
var stackGenerator = { exports: {} };
var hasRequiredStackGenerator;
function requireStackGenerator() {
  if (hasRequiredStackGenerator) return stackGenerator.exports;
  hasRequiredStackGenerator = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireStackframe());
      }
    })(commonjsGlobal, function(StackFrame) {
      return {
        backtrace: function StackGenerator$$backtrace(opts) {
          var stack = [];
          var maxStackSize = 10;
          if (typeof opts === "object" && typeof opts.maxStackSize === "number") {
            maxStackSize = opts.maxStackSize;
          }
          var curr = arguments.callee;
          while (curr && stack.length < maxStackSize && curr["arguments"]) {
            var args = new Array(curr["arguments"].length);
            for (var i = 0; i < args.length; ++i) {
              args[i] = curr["arguments"][i];
            }
            if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
              stack.push(new StackFrame({ functionName: RegExp.$1 || void 0, args }));
            } else {
              stack.push(new StackFrame({ args }));
            }
            try {
              curr = curr.caller;
            } catch (e2) {
              break;
            }
          }
          return stack;
        }
      };
    });
  })(stackGenerator);
  return stackGenerator.exports;
}
var stacktraceGps = { exports: {} };
var sourceMapConsumer = {};
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  (function(exports) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }
    exports.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      var match2 = aUrl.match(urlRegexp);
      if (!match2) {
        return null;
      }
      return {
        scheme: match2[1],
        auth: match2[2],
        host: match2[3],
        port: match2[4],
        path: match2[5]
      };
    }
    exports.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      var url = "";
      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ":";
      }
      url += "//";
      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + "@";
      }
      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port;
      }
      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }
      return url;
    }
    exports.urlGenerate = urlGenerate;
    function normalize(aPath) {
      var path = aPath;
      var url = urlParse(aPath);
      if (url) {
        if (!url.path) {
          return aPath;
        }
        path = url.path;
      }
      var isAbsolute = exports.isAbsolute(path);
      var parts = path.split(/\/+/);
      for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
        part = parts[i];
        if (part === ".") {
          parts.splice(i, 1);
        } else if (part === "..") {
          up++;
        } else if (up > 0) {
          if (part === "") {
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }
      path = parts.join("/");
      if (path === "") {
        path = isAbsolute ? "/" : ".";
      }
      if (url) {
        url.path = path;
        return urlGenerate(url);
      }
      return path;
    }
    exports.normalize = normalize;
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || "/";
      }
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
      var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports.join = join;
    exports.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || !!aPath.match(urlRegexp);
    };
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      aRoot = aRoot.replace(/\/$/, "");
      var level = 0;
      while (aPath.indexOf(aRoot + "/") !== 0) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports.relative = relative;
    var supportsNullProto = function() {
      var obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    }();
    function identity2(s2) {
      return s2;
    }
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return "$" + aStr;
      }
      return aStr;
    }
    exports.toSetString = supportsNullProto ? identity2 : toSetString;
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
      return aStr;
    }
    exports.fromSetString = supportsNullProto ? identity2 : fromSetString;
    function isProtoString(s2) {
      if (!s2) {
        return false;
      }
      var length = s2.length;
      if (length < 9) {
        return false;
      }
      if (s2.charCodeAt(length - 1) !== 95 || s2.charCodeAt(length - 2) !== 95 || s2.charCodeAt(length - 3) !== 111 || s2.charCodeAt(length - 4) !== 116 || s2.charCodeAt(length - 5) !== 111 || s2.charCodeAt(length - 6) !== 114 || s2.charCodeAt(length - 7) !== 112 || s2.charCodeAt(length - 8) !== 95 || s2.charCodeAt(length - 9) !== 95) {
        return false;
      }
      for (var i = length - 10; i >= 0; i--) {
        if (s2.charCodeAt(i) !== 36) {
          return false;
        }
      }
      return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = mappingA.source - mappingB.source;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return mappingA.name - mappingB.name;
    }
    exports.compareByOriginalPositions = compareByOriginalPositions;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = mappingA.source - mappingB.source;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return mappingA.name - mappingB.name;
    }
    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
      if (aStr1 > aStr2) {
        return 1;
      }
      return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
  })(util);
  return util;
}
var binarySearch = {};
var hasRequiredBinarySearch;
function requireBinarySearch() {
  if (hasRequiredBinarySearch) return binarySearch;
  hasRequiredBinarySearch = 1;
  (function(exports) {
    exports.GREATEST_LOWER_BOUND = 1;
    exports.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
      var mid = Math.floor((aHigh - aLow) / 2) + aLow;
      var cmp = aCompare(aNeedle, aHaystack[mid], true);
      if (cmp === 0) {
        return mid;
      } else if (cmp > 0) {
        if (aHigh - mid > 1) {
          return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports.LEAST_UPPER_BOUND) {
          return aHigh < aHaystack.length ? aHigh : -1;
        } else {
          return mid;
        }
      } else {
        if (mid - aLow > 1) {
          return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports.LEAST_UPPER_BOUND) {
          return mid;
        } else {
          return aLow < 0 ? -1 : aLow;
        }
      }
    }
    exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
      if (aHaystack.length === 0) {
        return -1;
      }
      var index = recursiveSearch(
        -1,
        aHaystack.length,
        aNeedle,
        aHaystack,
        aCompare,
        aBias || exports.GREATEST_LOWER_BOUND
      );
      if (index < 0) {
        return -1;
      }
      while (index - 1 >= 0) {
        if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
          break;
        }
        --index;
      }
      return index;
    };
  })(binarySearch);
  return binarySearch;
}
var arraySet = {};
var hasRequiredArraySet;
function requireArraySet() {
  if (hasRequiredArraySet) return arraySet;
  hasRequiredArraySet = 1;
  var util2 = requireUtil();
  var has = Object.prototype.hasOwnProperty;
  function ArraySet() {
    this._array = [];
    this._set = /* @__PURE__ */ Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set2 = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set2.add(aArray[i], aAllowDuplicates);
    }
    return set2;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = util2.toSetString(aStr);
    var isDuplicate = has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[sStr] = idx;
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    var sStr = util2.toSetString(aStr);
    return has.call(this._set, sStr);
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    var sStr = util2.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  arraySet.ArraySet = ArraySet;
  return arraySet;
}
var base64Vlq = {};
var base64 = {};
var hasRequiredBase64;
function requireBase64() {
  if (hasRequiredBase64) return base64;
  hasRequiredBase64 = 1;
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  base64.encode = function(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };
  base64.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
  return base64;
}
var hasRequiredBase64Vlq;
function requireBase64Vlq() {
  if (hasRequiredBase64Vlq) return base64Vlq;
  hasRequiredBase64Vlq = 1;
  var base642 = requireBase64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  base64Vlq.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base642.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base642.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
  return base64Vlq;
}
var quickSort = {};
var hasRequiredQuickSort;
function requireQuickSort() {
  if (hasRequiredQuickSort) return quickSort;
  hasRequiredQuickSort = 1;
  function swap(ary, x, y2) {
    var temp = ary[x];
    ary[x] = ary[y2];
    ary[y2] = temp;
  }
  function randomIntInRange(low, high) {
    return Math.round(low + Math.random() * (high - low));
  }
  function doQuickSort(ary, comparator2, p2, r) {
    if (p2 < r) {
      var pivotIndex = randomIntInRange(p2, r);
      var i = p2 - 1;
      swap(ary, pivotIndex, r);
      var pivot = ary[r];
      for (var j = p2; j < r; j++) {
        if (comparator2(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }
      swap(ary, i + 1, j);
      var q = i + 1;
      doQuickSort(ary, comparator2, p2, q - 1);
      doQuickSort(ary, comparator2, q + 1, r);
    }
  }
  quickSort.quickSort = function(ary, comparator2) {
    doQuickSort(ary, comparator2, 0, ary.length - 1);
  };
  return quickSort;
}
var hasRequiredSourceMapConsumer;
function requireSourceMapConsumer() {
  if (hasRequiredSourceMapConsumer) return sourceMapConsumer;
  hasRequiredSourceMapConsumer = 1;
  var util2 = requireUtil();
  var binarySearch2 = requireBinarySearch();
  var ArraySet = requireArraySet().ArraySet;
  var base64VLQ = requireBase64Vlq();
  var quickSort2 = requireQuickSort().quickSort;
  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ""));
    }
    return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap) : new BasicSourceMapConsumer(sourceMap);
  }
  SourceMapConsumer.fromSourceMap = function(aSourceMap) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
  };
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
    get: function() {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__generatedMappings;
    }
  });
  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
    get: function() {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__originalMappings;
    }
  });
  SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c2 = aStr.charAt(index);
    return c2 === ";" || c2 === ",";
  };
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;
  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;
  SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    var mappings;
    switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var sourceRoot = this.sourceRoot;
    mappings.map(function(mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util2.join(sourceRoot, source);
      }
      return {
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };
  SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util2.getArg(aArgs, "line");
    var needle = {
      source: util2.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util2.getArg(aArgs, "column", 0)
    };
    if (this.sourceRoot != null) {
      needle.source = util2.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);
    var mappings = [];
    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util2.compareByOriginalPositions,
      binarySearch2.LEAST_UPPER_BOUND
    );
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (aArgs.column === void 0) {
        var originalLine = mapping.originalLine;
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;
        while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      }
    }
    return mappings;
  };
  sourceMapConsumer.SourceMapConsumer = SourceMapConsumer;
  function BasicSourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ""));
    }
    var version = util2.getArg(sourceMap, "version");
    var sources = util2.getArg(sourceMap, "sources");
    var names = util2.getArg(sourceMap, "names", []);
    var sourceRoot = util2.getArg(sourceMap, "sourceRoot", null);
    var sourcesContent = util2.getArg(sourceMap, "sourcesContent", null);
    var mappings = util2.getArg(sourceMap, "mappings");
    var file = util2.getArg(sourceMap, "file", null);
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    sources = sources.map(String).map(util2.normalize).map(function(source) {
      return sourceRoot && util2.isAbsolute(sourceRoot) && util2.isAbsolute(source) ? util2.relative(sourceRoot, source) : source;
    });
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this.file = file;
  }
  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
  BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);
    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(
      smc._sources.toArray(),
      smc.sourceRoot
    );
    smc.file = aSourceMap._file;
    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];
    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping();
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;
      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;
        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }
        destOriginalMappings.push(destMapping);
      }
      destGeneratedMappings.push(destMapping);
    }
    quickSort2(smc.__originalMappings, util2.compareByOriginalPositions);
    return smc;
  };
  BasicSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
    get: function() {
      return this._sources.toArray().map(function(s2) {
        return this.sourceRoot != null ? util2.join(this.sourceRoot, s2) : s2;
      }, this);
    }
  });
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }
  BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;
    while (index < length) {
      if (aStr.charAt(index) === ";") {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      } else if (aStr.charAt(index) === ",") {
        index++;
      } else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);
        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }
          if (segment.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (segment.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          cachedSegments[str] = segment;
        }
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;
        if (segment.length > 1) {
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;
          if (segment.length > 4) {
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }
        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === "number") {
          originalMappings.push(mapping);
        }
      }
    }
    quickSort2(generatedMappings, util2.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;
    quickSort2(originalMappings, util2.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };
  BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
    }
    return binarySearch2.search(aNeedle, aMappings, aComparator, aBias);
  };
  BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];
        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }
      mapping.lastGeneratedColumn = Infinity;
    }
  };
  BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util2.compareByGeneratedPositionsDeflated,
      util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
    );
    if (index >= 0) {
      var mapping = this._generatedMappings[index];
      if (mapping.generatedLine === needle.generatedLine) {
        var source = util2.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util2.join(this.sourceRoot, source);
          }
        }
        var name = util2.getArg(mapping, "name", null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source,
          line: util2.getArg(mapping, "originalLine", null),
          column: util2.getArg(mapping, "originalColumn", null),
          name
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
      return sc == null;
    });
  };
  BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }
    if (this.sourceRoot != null) {
      aSource = util2.relative(this.sourceRoot, aSource);
    }
    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }
    var url;
    if (this.sourceRoot != null && (url = util2.urlParse(this.sourceRoot))) {
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }
      if ((!url.path || url.path == "/") && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util2.getArg(aArgs, "source");
    if (this.sourceRoot != null) {
      source = util2.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);
    var needle = {
      source,
      originalLine: util2.getArg(aArgs, "line"),
      originalColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util2.compareByOriginalPositions,
      util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
    );
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (mapping.source === needle.source) {
        return {
          line: util2.getArg(mapping, "generatedLine", null),
          column: util2.getArg(mapping, "generatedColumn", null),
          lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
        };
      }
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };
  sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer;
  function IndexedSourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ""));
    }
    var version = util2.getArg(sourceMap, "version");
    var sections = util2.getArg(sourceMap, "sections");
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    this._sources = new ArraySet();
    this._names = new ArraySet();
    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function(s2) {
      if (s2.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var offset = util2.getArg(s2, "offset");
      var offsetLine = util2.getArg(offset, "line");
      var offsetColumn = util2.getArg(offset, "column");
      if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      lastOffset = offset;
      return {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util2.getArg(s2, "map"))
      };
    });
  }
  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
  IndexedSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
    get: function() {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      }
      return sources;
    }
  });
  IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var sectionIndex = binarySearch2.search(
      needle,
      this._sections,
      function(needle2, section2) {
        var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }
        return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
      }
    );
    var section = this._sections[sectionIndex];
    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }
    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
      bias: aArgs.bias
    });
  };
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function(s2) {
      return s2.consumer.hasContentsOfAllSources();
    });
  };
  IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      if (section.consumer.sources.indexOf(util2.getArg(aArgs, "source")) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
        };
        return ret;
      }
    }
    return {
      line: null,
      column: null
    };
  };
  IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];
        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util2.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);
        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);
        var adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name
        };
        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }
    quickSort2(this.__generatedMappings, util2.compareByGeneratedPositionsDeflated);
    quickSort2(this.__originalMappings, util2.compareByOriginalPositions);
  };
  sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
  return sourceMapConsumer;
}
var hasRequiredStacktraceGps;
function requireStacktraceGps() {
  if (hasRequiredStacktraceGps) return stacktraceGps.exports;
  hasRequiredStacktraceGps = 1;
  (function(module, exports) {
    (function(root, factory) {
      {
        module.exports = factory(requireSourceMapConsumer(), requireStackframe());
      }
    })(commonjsGlobal, function(SourceMap, StackFrame) {
      function _xdr(url) {
        return new Promise(function(resolve2, reject) {
          var req = new XMLHttpRequest();
          req.open("get", url);
          req.onerror = reject;
          req.onreadystatechange = function onreadystatechange() {
            if (req.readyState === 4) {
              if (req.status >= 200 && req.status < 300 || url.substr(0, 7) === "file://" && req.responseText) {
                resolve2(req.responseText);
              } else {
                reject(new Error("HTTP status: " + req.status + " retrieving " + url));
              }
            }
          };
          req.send();
        });
      }
      function _atob(b64str) {
        if (typeof window !== "undefined" && window.atob) {
          return window.atob(b64str);
        } else {
          throw new Error("You must supply a polyfill for window.atob in this environment");
        }
      }
      function _parseJson(string) {
        if (typeof JSON !== "undefined" && JSON.parse) {
          return JSON.parse(string);
        } else {
          throw new Error("You must supply a polyfill for JSON.parse in this environment");
        }
      }
      function _findFunctionName(source, lineNumber) {
        var syntaxes = [
          // {name} = function ({args}) TODO args capture
          /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/,
          // function {name}({args}) m[1]=name m[2]=args
          /function\s+([^('"`]*?)\s*\(([^)]*)\)/,
          // {name} = eval()
          /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
          // fn_name() {
          /\b(?!(?:if|for|switch|while|with|catch)\b)(?:(?:static)\s+)?(\S+)\s*\(.*?\)\s*\{/,
          // {name} = () => {
          /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*\(.*?\)\s*=>/
        ];
        var lines = source.split("\n");
        var code = "";
        var maxLines = Math.min(lineNumber, 20);
        for (var i = 0; i < maxLines; ++i) {
          var line = lines[lineNumber - i - 1];
          var commentPos = line.indexOf("//");
          if (commentPos >= 0) {
            line = line.substr(0, commentPos);
          }
          if (line) {
            code = line + code;
            var len = syntaxes.length;
            for (var index = 0; index < len; index++) {
              var m2 = syntaxes[index].exec(code);
              if (m2 && m2[1]) {
                return m2[1];
              }
            }
          }
        }
        return void 0;
      }
      function _ensureSupportedEnvironment() {
        if (typeof Object.defineProperty !== "function" || typeof Object.create !== "function") {
          throw new Error("Unable to consume source maps in older browsers");
        }
      }
      function _ensureStackFrameIsLegit(stackframe2) {
        if (typeof stackframe2 !== "object") {
          throw new TypeError("Given StackFrame is not an object");
        } else if (typeof stackframe2.fileName !== "string") {
          throw new TypeError("Given file name is not a String");
        } else if (typeof stackframe2.lineNumber !== "number" || stackframe2.lineNumber % 1 !== 0 || stackframe2.lineNumber < 1) {
          throw new TypeError("Given line number must be a positive integer");
        } else if (typeof stackframe2.columnNumber !== "number" || stackframe2.columnNumber % 1 !== 0 || stackframe2.columnNumber < 0) {
          throw new TypeError("Given column number must be a non-negative integer");
        }
        return true;
      }
      function _findSourceMappingURL(source) {
        var sourceMappingUrlRegExp = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/mg;
        var lastSourceMappingUrl;
        var matchSourceMappingUrl;
        while (matchSourceMappingUrl = sourceMappingUrlRegExp.exec(source)) {
          lastSourceMappingUrl = matchSourceMappingUrl[1];
        }
        if (lastSourceMappingUrl) {
          return lastSourceMappingUrl;
        } else {
          throw new Error("sourceMappingURL not found");
        }
      }
      function _extractLocationInfoFromSourceMapSource(stackframe2, sourceMapConsumer2, sourceCache) {
        return new Promise(function(resolve2, reject) {
          var loc = sourceMapConsumer2.originalPositionFor({
            line: stackframe2.lineNumber,
            column: stackframe2.columnNumber
          });
          if (loc.source) {
            var mappedSource = sourceMapConsumer2.sourceContentFor(loc.source);
            if (mappedSource) {
              sourceCache[loc.source] = mappedSource;
            }
            resolve2(
              // given stackframe and source location, update stackframe
              new StackFrame({
                functionName: loc.name || stackframe2.functionName,
                args: stackframe2.args,
                fileName: loc.source,
                lineNumber: loc.line,
                columnNumber: loc.column
              })
            );
          } else {
            reject(new Error("Could not get original source for given stackframe and source map"));
          }
        });
      }
      return function StackTraceGPS(opts) {
        if (!(this instanceof StackTraceGPS)) {
          return new StackTraceGPS(opts);
        }
        opts = opts || {};
        this.sourceCache = opts.sourceCache || {};
        this.sourceMapConsumerCache = opts.sourceMapConsumerCache || {};
        this.ajax = opts.ajax || _xdr;
        this._atob = opts.atob || _atob;
        this._get = function _get(location2) {
          return new Promise((function(resolve2, reject) {
            var isDataUrl = location2.substr(0, 5) === "data:";
            if (this.sourceCache[location2]) {
              resolve2(this.sourceCache[location2]);
            } else if (opts.offline && !isDataUrl) {
              reject(new Error("Cannot make network requests in offline mode"));
            } else {
              if (isDataUrl) {
                var supportedEncodingRegexp = /^data:application\/json;([\w=:"-]+;)*base64,/;
                var match2 = location2.match(supportedEncodingRegexp);
                if (match2) {
                  var sourceMapStart = match2[0].length;
                  var encodedSource = location2.substr(sourceMapStart);
                  var source = this._atob(encodedSource);
                  this.sourceCache[location2] = source;
                  resolve2(source);
                } else {
                  reject(new Error("The encoding of the inline sourcemap is not supported"));
                }
              } else {
                var xhrPromise = this.ajax(location2, { method: "get" });
                this.sourceCache[location2] = xhrPromise;
                xhrPromise.then(resolve2, reject);
              }
            }
          }).bind(this));
        };
        this._getSourceMapConsumer = function _getSourceMapConsumer(sourceMappingURL, defaultSourceRoot) {
          return new Promise((function(resolve2) {
            if (this.sourceMapConsumerCache[sourceMappingURL]) {
              resolve2(this.sourceMapConsumerCache[sourceMappingURL]);
            } else {
              var sourceMapConsumerPromise = new Promise((function(resolve3, reject) {
                return this._get(sourceMappingURL).then(function(sourceMapSource) {
                  if (typeof sourceMapSource === "string") {
                    sourceMapSource = _parseJson(sourceMapSource.replace(/^\)\]\}'/, ""));
                  }
                  if (typeof sourceMapSource.sourceRoot === "undefined") {
                    sourceMapSource.sourceRoot = defaultSourceRoot;
                  }
                  resolve3(new SourceMap.SourceMapConsumer(sourceMapSource));
                }).catch(reject);
              }).bind(this));
              this.sourceMapConsumerCache[sourceMappingURL] = sourceMapConsumerPromise;
              resolve2(sourceMapConsumerPromise);
            }
          }).bind(this));
        };
        this.pinpoint = function StackTraceGPS$$pinpoint(stackframe2) {
          return new Promise((function(resolve2, reject) {
            this.getMappedLocation(stackframe2).then((function(mappedStackFrame) {
              function resolveMappedStackFrame() {
                resolve2(mappedStackFrame);
              }
              this.findFunctionName(mappedStackFrame).then(resolve2, resolveMappedStackFrame)["catch"](resolveMappedStackFrame);
            }).bind(this), reject);
          }).bind(this));
        };
        this.findFunctionName = function StackTraceGPS$$findFunctionName(stackframe2) {
          return new Promise((function(resolve2, reject) {
            _ensureStackFrameIsLegit(stackframe2);
            this._get(stackframe2.fileName).then(function getSourceCallback(source) {
              var lineNumber = stackframe2.lineNumber;
              var columnNumber = stackframe2.columnNumber;
              var guessedFunctionName = _findFunctionName(source, lineNumber);
              if (guessedFunctionName) {
                resolve2(new StackFrame({
                  functionName: guessedFunctionName,
                  args: stackframe2.args,
                  fileName: stackframe2.fileName,
                  lineNumber,
                  columnNumber
                }));
              } else {
                resolve2(stackframe2);
              }
            }, reject)["catch"](reject);
          }).bind(this));
        };
        this.getMappedLocation = function StackTraceGPS$$getMappedLocation(stackframe2) {
          return new Promise((function(resolve2, reject) {
            _ensureSupportedEnvironment();
            _ensureStackFrameIsLegit(stackframe2);
            var sourceCache = this.sourceCache;
            var fileName = stackframe2.fileName;
            this._get(fileName).then((function(source) {
              var sourceMappingURL = _findSourceMappingURL(source);
              var isDataUrl = sourceMappingURL.substr(0, 5) === "data:";
              var defaultSourceRoot = fileName.substring(0, fileName.lastIndexOf("/") + 1);
              if (sourceMappingURL[0] !== "/" && !isDataUrl && !/^https?:\/\/|^\/\//i.test(sourceMappingURL)) {
                sourceMappingURL = defaultSourceRoot + sourceMappingURL;
              }
              return this._getSourceMapConsumer(sourceMappingURL, defaultSourceRoot).then(function(sourceMapConsumer2) {
                return _extractLocationInfoFromSourceMapSource(stackframe2, sourceMapConsumer2, sourceCache).then(resolve2)["catch"](function() {
                  resolve2(stackframe2);
                });
              });
            }).bind(this), reject)["catch"](reject);
          }).bind(this));
        };
      };
    });
  })(stacktraceGps);
  return stacktraceGps.exports;
}
(function(module, exports) {
  (function(root, factory) {
    {
      module.exports = factory(requireErrorStackParser(), requireStackGenerator(), requireStacktraceGps());
    }
  })(commonjsGlobal, function StackTrace(ErrorStackParser, StackGenerator, StackTraceGPS) {
    var _options = {
      filter: function(stackframe2) {
        return (stackframe2.functionName || "").indexOf("StackTrace$$") === -1 && (stackframe2.functionName || "").indexOf("ErrorStackParser$$") === -1 && (stackframe2.functionName || "").indexOf("StackTraceGPS$$") === -1 && (stackframe2.functionName || "").indexOf("StackGenerator$$") === -1;
      },
      sourceCache: {}
    };
    var _generateError = function StackTrace$$GenerateError() {
      try {
        throw new Error();
      } catch (err2) {
        return err2;
      }
    };
    function _merge(first, second) {
      var target = {};
      [first, second].forEach(function(obj) {
        for (var prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            target[prop] = obj[prop];
          }
        }
        return target;
      });
      return target;
    }
    function _isShapedLikeParsableError(err2) {
      return err2.stack || err2["opera#sourceloc"];
    }
    function _filtered(stackframes, filter2) {
      if (typeof filter2 === "function") {
        return stackframes.filter(filter2);
      }
      return stackframes;
    }
    return {
      /**
       * Get a backtrace from invocation point.
       *
       * @param {Object} opts
       * @returns {Array} of StackFrame
       */
      get: function StackTrace$$get(opts) {
        var err2 = _generateError();
        return _isShapedLikeParsableError(err2) ? this.fromError(err2, opts) : this.generateArtificially(opts);
      },
      /**
       * Get a backtrace from invocation point.
       * IMPORTANT: Does not handle source maps or guess function names!
       *
       * @param {Object} opts
       * @returns {Array} of StackFrame
       */
      getSync: function StackTrace$$getSync(opts) {
        opts = _merge(_options, opts);
        var err2 = _generateError();
        var stack = _isShapedLikeParsableError(err2) ? ErrorStackParser.parse(err2) : StackGenerator.backtrace(opts);
        return _filtered(stack, opts.filter);
      },
      /**
       * Given an error object, parse it.
       *
       * @param {Error} error object
       * @param {Object} opts
       * @returns {Promise} for Array[StackFrame}
       */
      fromError: function StackTrace$$fromError(error, opts) {
        opts = _merge(_options, opts);
        var gps = new StackTraceGPS(opts);
        return new Promise((function(resolve2) {
          var stackframes = _filtered(ErrorStackParser.parse(error), opts.filter);
          resolve2(Promise.all(stackframes.map(function(sf) {
            return new Promise(function(resolve3) {
              function resolveOriginal() {
                resolve3(sf);
              }
              gps.pinpoint(sf).then(resolve3, resolveOriginal)["catch"](resolveOriginal);
            });
          })));
        }).bind(this));
      },
      /**
       * Use StackGenerator to generate a backtrace.
       *
       * @param {Object} opts
       * @returns {Promise} of Array[StackFrame]
       */
      generateArtificially: function StackTrace$$generateArtificially(opts) {
        opts = _merge(_options, opts);
        var stackFrames = StackGenerator.backtrace(opts);
        if (typeof opts.filter === "function") {
          stackFrames = stackFrames.filter(opts.filter);
        }
        return Promise.resolve(stackFrames);
      },
      /**
       * Given a function, wrap it such that invocations trigger a callback that
       * is called with a stack trace.
       *
       * @param {Function} fn to be instrumented
       * @param {Function} callback function to call with a stack trace on invocation
       * @param {Function} errback optional function to call with error if unable to get stack trace.
       * @param {Object} thisArg optional context object (e.g. window)
       */
      instrument: function StackTrace$$instrument(fn, callback, errback, thisArg) {
        if (typeof fn !== "function") {
          throw new Error("Cannot instrument non-function object");
        } else if (typeof fn.__stacktraceOriginalFn === "function") {
          return fn;
        }
        var instrumented = (function StackTrace$$instrumented() {
          try {
            this.get().then(callback, errback)["catch"](errback);
            return fn.apply(thisArg || this, arguments);
          } catch (e2) {
            if (_isShapedLikeParsableError(e2)) {
              this.fromError(e2).then(callback, errback)["catch"](errback);
            }
            throw e2;
          }
        }).bind(this);
        instrumented.__stacktraceOriginalFn = fn;
        return instrumented;
      },
      /**
       * Given a function that has been instrumented,
       * revert the function to it's original (non-instrumented) state.
       *
       * @param {Function} fn to de-instrument
       */
      deinstrument: function StackTrace$$deinstrument(fn) {
        if (typeof fn !== "function") {
          throw new Error("Cannot de-instrument non-function object");
        } else if (typeof fn.__stacktraceOriginalFn === "function") {
          return fn.__stacktraceOriginalFn;
        } else {
          return fn;
        }
      },
      /**
       * Given an error message and Array of StackFrames, serialize and POST to given URL.
       *
       * @param {Array} stackframes
       * @param {String} url
       * @param {String} errorMsg
       * @param {Object} requestOptions
       */
      report: function StackTrace$$report(stackframes, url, errorMsg, requestOptions) {
        return new Promise(function(resolve2, reject) {
          var req = new XMLHttpRequest();
          req.onerror = reject;
          req.onreadystatechange = function onreadystatechange() {
            if (req.readyState === 4) {
              if (req.status >= 200 && req.status < 400) {
                resolve2(req.responseText);
              } else {
                reject(new Error("POST to " + url + " failed with status: " + req.status));
              }
            }
          };
          req.open("post", url);
          req.setRequestHeader("Content-Type", "application/json");
          if (requestOptions && typeof requestOptions.headers === "object") {
            var headers = requestOptions.headers;
            for (var header2 in headers) {
              if (Object.prototype.hasOwnProperty.call(headers, header2)) {
                req.setRequestHeader(header2, headers[header2]);
              }
            }
          }
          var reportPayload = { stack: stackframes };
          if (errorMsg !== void 0 && errorMsg !== null) {
            reportPayload.message = errorMsg;
          }
          req.send(JSON.stringify(reportPayload));
        });
      }
    };
  });
})(stacktrace);
var stacktraceExports = stacktrace.exports;
const udomdiff = (parentNode, a2, b3, get, before) => {
  const bLength = b3.length;
  let aEnd = a2.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map2 = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? get(b3[bStart - 1], -0).nextSibling : get(b3[bEnd], 0) : before;
      while (bStart < bEnd)
        parentNode.insertBefore(get(b3[bStart++], 1), node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map2 || !map2.has(a2[aStart]))
          parentNode.removeChild(get(a2[aStart], -1));
        aStart++;
      }
    } else if (a2[aStart] === b3[bStart]) {
      aStart++;
      bStart++;
    } else if (a2[aEnd - 1] === b3[bEnd - 1]) {
      aEnd--;
      bEnd--;
    } else if (a2[aStart] === b3[bEnd - 1] && b3[bStart] === a2[aEnd - 1]) {
      const node = get(a2[--aEnd], -0).nextSibling;
      parentNode.insertBefore(
        get(b3[bStart++], 1),
        get(a2[aStart++], -0).nextSibling
      );
      parentNode.insertBefore(get(b3[--bEnd], 1), node);
      a2[aEnd] = b3[bEnd];
    } else {
      if (!map2) {
        map2 = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd)
          map2.set(b3[i], i++);
      }
      if (map2.has(a2[aStart])) {
        const index = map2.get(a2[aStart]);
        if (bStart < index && index < bEnd) {
          let i = aStart;
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map2.get(a2[i]) === index + sequence)
            sequence++;
          if (sequence > index - bStart) {
            const node = get(a2[aStart], 0);
            while (bStart < index)
              parentNode.insertBefore(get(b3[bStart++], 1), node);
          } else {
            parentNode.replaceChild(
              get(b3[bStart++], 1),
              get(a2[aStart++], -1)
            );
          }
        } else
          aStart++;
      } else
        parentNode.removeChild(get(a2[aStart++], -1));
    }
  }
  return b3;
};
const { isArray: isArray$2 } = Array;
const { getPrototypeOf: getPrototypeOf$1, getOwnPropertyDescriptor } = Object;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const empty = [];
const newRange = () => document.createRange();
const set = (map2, key, value) => {
  map2.set(key, value);
  return value;
};
const gPD = (ref2, prop) => {
  let desc;
  do {
    desc = getOwnPropertyDescriptor(ref2, prop);
  } while (!desc && (ref2 = getPrototypeOf$1(ref2)));
  return desc;
};
const find = (content, path) => path.reduceRight(childNodesIndex, content);
const childNodesIndex = (node, i) => node.childNodes[i];
const ELEMENT_NODE = 1;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;
const { setPrototypeOf } = Object;
const custom = (Class) => {
  function Custom(target) {
    return setPrototypeOf(target, new.target.prototype);
  }
  Custom.prototype = Class.prototype;
  return Custom;
};
let range$1;
const drop = (firstChild, lastChild, preserve) => {
  if (!range$1) range$1 = newRange();
  if (preserve)
    range$1.setStartAfter(firstChild);
  else
    range$1.setStartBefore(firstChild);
  range$1.setEndAfter(lastChild);
  range$1.deleteContents();
  return firstChild;
};
const remove = ({ firstChild, lastChild }, preserve) => drop(firstChild, lastChild, preserve);
let checkType = false;
const diffFragment = (node, operation) => checkType && node.nodeType === DOCUMENT_FRAGMENT_NODE ? 1 / operation < 0 ? operation ? remove(node, true) : node.lastChild : operation ? node.valueOf() : node.firstChild : node;
const comment = (value) => document.createComment(value);
class PersistentFragment extends custom(DocumentFragment) {
  #firstChild = comment("<>");
  #lastChild = comment("</>");
  #nodes = empty;
  constructor(fragment) {
    super(fragment);
    this.replaceChildren(...[
      this.#firstChild,
      ...fragment.childNodes,
      this.#lastChild
    ]);
    checkType = true;
  }
  get firstChild() {
    return this.#firstChild;
  }
  get lastChild() {
    return this.#lastChild;
  }
  get parentNode() {
    return this.#firstChild.parentNode;
  }
  remove() {
    remove(this, false);
  }
  replaceWith(node) {
    remove(this, true).replaceWith(node);
  }
  valueOf() {
    const { parentNode } = this;
    if (parentNode === this) {
      if (this.#nodes === empty)
        this.#nodes = [...this.childNodes];
    } else {
      if (parentNode) {
        let { firstChild, lastChild } = this;
        this.#nodes = [firstChild];
        while (firstChild !== lastChild)
          this.#nodes.push(firstChild = firstChild.nextSibling);
      }
      this.replaceChildren(...this.#nodes);
    }
    return this;
  }
}
const setAttribute = (element, name, value) => element.setAttribute(name, value);
const removeAttribute = (element, name) => element.removeAttribute(name);
const aria = (element, value) => {
  for (const key in value) {
    const $ = value[key];
    const name = key === "role" ? key : `aria-${key}`;
    if ($ == null) removeAttribute(element, name);
    else setAttribute(element, name, $);
  }
  return value;
};
let listeners;
const at = (element, value, name) => {
  name = name.slice(1);
  if (!listeners) listeners = /* @__PURE__ */ new WeakMap();
  const known2 = listeners.get(element) || set(listeners, element, {});
  let current = known2[name];
  if (current && current[0]) element.removeEventListener(name, ...current);
  current = isArray$2(value) ? value : [value, false];
  known2[name] = current;
  if (current[0]) element.addEventListener(name, ...current);
  return value;
};
const hole = (detail2, value) => {
  const { t: node, n: hole2 } = detail2;
  let nullish = false;
  switch (typeof value) {
    case "object":
      if (value !== null) {
        (hole2 || node).replaceWith(detail2.n = value.valueOf());
        break;
      }
    case "undefined":
      nullish = true;
    default:
      node.data = nullish ? "" : value;
      if (hole2) {
        detail2.n = null;
        hole2.replaceWith(node);
      }
      break;
  }
  return value;
};
const className = (element, value) => maybeDirect(
  element,
  value,
  value == null ? "class" : "className"
);
const data = (element, value) => {
  const { dataset } = element;
  for (const key in value) {
    if (value[key] == null) delete dataset[key];
    else dataset[key] = value[key];
  }
  return value;
};
const direct = (ref2, value, name) => ref2[name] = value;
const dot = (element, value, name) => direct(element, value, name.slice(1));
const maybeDirect = (element, value, name) => value == null ? (removeAttribute(element, name), value) : direct(element, value, name);
const ref = (element, value) => (typeof value === "function" ? value(element) : value.current = element, value);
const regular = (element, value, name) => (value == null ? removeAttribute(element, name) : setAttribute(element, name, value), value);
const style = (element, value) => value == null ? maybeDirect(element, value, "style") : direct(element.style, value, "cssText");
const toggle = (element, value, name) => (element.toggleAttribute(name.slice(1), value), value);
const array = (node, value, prev) => {
  const { length } = value;
  node.data = `[${length}]`;
  if (length)
    return udomdiff(node.parentNode, prev, value, diffFragment, node);
  switch (prev.length) {
    case 1:
      prev[0].remove();
    case 0:
      break;
    default:
      drop(
        diffFragment(prev[0], 0),
        diffFragment(prev.at(-1), -0),
        false
      );
      break;
  }
  return empty;
};
const attr = /* @__PURE__ */ new Map([
  ["aria", aria],
  ["class", className],
  ["data", data],
  ["ref", ref],
  ["style", style]
]);
const attribute = (element, name, svg2) => {
  switch (name[0]) {
    case ".":
      return dot;
    case "?":
      return toggle;
    case "@":
      return at;
    default:
      return svg2 || "ownerSVGElement" in element ? name === "ref" ? ref : regular : attr.get(name) || (name in element ? name.startsWith("on") ? direct : gPD(element, name)?.set ? maybeDirect : regular : regular);
  }
};
const text = (element, value) => (element.textContent = value == null ? "" : value, value);
const abc = (a2, b3, c2) => ({ a: a2, b: b3, c: c2 });
const bc = (b3, c2) => ({ b: b3, c: c2 });
const detail = (u2, t2, n2, c2) => ({ v: empty, u: u2, t: t2, n: n2, c: c2 });
const cache$1 = () => abc(null, null, empty);
const create = (parse2) => (
  /**
   * @param {TemplateStringsArray} template
   * @param {any[]} values
   * @returns {import("./literals.js").Cache}
   */
  (template2, values) => {
    const { a: fragment, b: entries, c: direct2 } = parse2(template2, values);
    const root = document.importNode(fragment, true);
    let details = empty;
    if (entries !== empty) {
      details = [];
      for (let current, prev, i = 0; i < entries.length; i++) {
        const { a: path, b: update2, c: name } = entries[i];
        const node = path === prev ? current : current = find(root, prev = path);
        details[i] = detail(
          update2,
          node,
          name,
          update2 === array ? [] : update2 === hole ? cache$1() : null
        );
      }
    }
    return bc(
      direct2 ? root.firstChild : new PersistentFragment(root),
      details
    );
  }
);
const TEXT_ELEMENTS = /^(?:plaintext|script|style|textarea|title|xmp)$/i;
const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
const elements = /<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g;
const attributes = /([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g;
const holes = /[\x01\x02]/g;
const parser$1 = (template2, prefix2, xml) => {
  let i = 0;
  return template2.join("").trim().replace(
    elements,
    (_, name, attrs, selfClosing) => `<${name}${attrs.replace(attributes, "=$2$1").trimEnd()}${selfClosing ? xml || VOID_ELEMENTS.test(name) ? " /" : `></${name}` : ""}>`
  ).replace(
    holes,
    (hole2) => hole2 === "" ? `<!--${prefix2 + i++}-->` : prefix2 + i++
  );
};
let template = document.createElement("template"), svg, range;
const createContent = (text2, xml) => {
  if (xml) {
    if (!svg) {
      svg = document.createElementNS(SVG_NAMESPACE, "svg");
      range = newRange();
      range.selectNodeContents(svg);
    }
    return range.createContextualFragment(text2);
  }
  template.innerHTML = text2;
  const { content } = template;
  template = template.cloneNode(false);
  return content;
};
const createPath = (node) => {
  const path = [];
  let parentNode;
  while (parentNode = node.parentNode) {
    path.push(path.indexOf.call(parentNode.childNodes, node));
    node = parentNode;
  }
  return path;
};
const textNode = () => document.createTextNode("");
const resolve = (template2, values, xml) => {
  const content = createContent(parser$1(template2, prefix, xml), xml);
  const { length } = template2;
  let entries = empty;
  if (length > 1) {
    const replace = [];
    const tw = document.createTreeWalker(content, 1 | 128);
    let i = 0, search = `${prefix}${i++}`;
    entries = [];
    while (i < length) {
      const node = tw.nextNode();
      if (node.nodeType === COMMENT_NODE) {
        if (node.data === search) {
          const update2 = isArray$2(values[i - 1]) ? array : hole;
          if (update2 === hole) replace.push(node);
          entries.push(abc(createPath(node), update2, null));
          search = `${prefix}${i++}`;
        }
      } else {
        let path;
        while (node.hasAttribute(search)) {
          if (!path) path = createPath(node);
          const name = node.getAttribute(search);
          entries.push(abc(path, attribute(node, name, xml), name));
          removeAttribute(node, search);
          search = `${prefix}${i++}`;
        }
        if (!xml && TEXT_ELEMENTS.test(node.localName) && node.textContent.trim() === `<!--${search}-->`) {
          entries.push(abc(path || createPath(node), text, null));
          search = `${prefix}${i++}`;
        }
      }
    }
    for (i = 0; i < replace.length; i++)
      replace[i].replaceWith(textNode());
  }
  const { childNodes } = content;
  let { length: len } = childNodes;
  if (len < 1) {
    len = 1;
    content.appendChild(textNode());
  } else if (len === 1 && // ignore html`static` or svg`static` because
  // these nodes can be passed directly as never mutated
  length !== 1 && childNodes[0].nodeType !== ELEMENT_NODE) {
    len = 0;
  }
  return set(cache, template2, abc(content, entries, len === 1));
};
const cache = /* @__PURE__ */ new WeakMap();
const prefix = "isµ";
const parser = (xml) => (template2, values) => cache.get(template2) || resolve(template2, values, xml);
const createHTML = create(parser(false));
const createSVG = create(parser(true));
const unroll = (info, { s: s2, t: t2, v: v2 }) => {
  if (info.a !== t2) {
    const { b: b3, c: c2 } = (s2 ? createSVG : createHTML)(t2, v2);
    info.a = t2;
    info.b = b3;
    info.c = c2;
  }
  for (let { c: c2 } = info, i = 0; i < c2.length; i++) {
    const value = v2[i];
    const detail2 = c2[i];
    switch (detail2.u) {
      case array:
        detail2.v = array(
          detail2.t,
          unrollValues(detail2.c, value),
          detail2.v
        );
        break;
      case hole:
        const current = value instanceof Hole ? unroll(detail2.c || (detail2.c = cache$1()), value) : (detail2.c = null, value);
        if (current !== detail2.v)
          detail2.v = hole(detail2, current);
        break;
      default:
        if (value !== detail2.v)
          detail2.v = detail2.u(detail2.t, value, detail2.n, detail2.v);
        break;
    }
  }
  return info.b;
};
const unrollValues = (stack, values) => {
  let i = 0, { length } = values;
  if (length < stack.length) stack.splice(length);
  for (; i < length; i++) {
    const value = values[i];
    if (value instanceof Hole)
      values[i] = unroll(stack[i] || (stack[i] = cache$1()), value);
    else stack[i] = null;
  }
  return values;
};
class Hole {
  constructor(svg2, template2, values) {
    this.s = svg2;
    this.t = template2;
    this.v = values;
  }
  toDOM(info = cache$1()) {
    return unroll(info, this);
  }
}
const known = /* @__PURE__ */ new WeakMap();
const render = (where, what) => {
  const info = known.get(where) || set(known, where, cache$1());
  const { b: b3 } = info;
  if (b3 !== (typeof what === "function" ? what() : what).toDOM(info))
    where.replaceChildren(info.b.valueOf());
  return where;
};
/*! (c) Andrea Giammarchi - MIT */
const tag = (svg2) => (template2, ...values) => new Hole(svg2, template2, values);
const html = tag(false);
var main = {};
var parse$1 = {};
var alwaysDeniedIdentifiers = [
  " ",
  "&",
  "'",
  "(",
  ")",
  "*",
  "+",
  ",",
  "-",
  ".",
  "`",
  "\n",
  "\r",
  "\\",
  "\u2028",
  "\u2029",
  "/",
  ":",
  ";",
  "<",
  "=",
  "?",
  "[",
  "]",
  "{",
  "|",
  "}",
  '"'
];
var MAX_STRING_LENGTH = 5242880;
var window$1 = { document: {} };
var nativeHasOwn$1 = Object.prototype.hasOwnProperty;
var nativeCall$1 = Function.prototype.call;
var nativeApply$1 = Function.prototype.apply;
var hasOwn$1 = nativeCall$1.bind(nativeCall$1, nativeHasOwn$1);
var $call = Function.prototype.call.bind(Function.prototype.call);
var $apply$1 = nativeCall$1.bind(nativeCall$1, nativeApply$1);
var lowercase = function(string) {
  return isString(string) ? string.toLowerCase() : string;
};
var isArray$1 = Array.isArray;
var manualLowercase = function(s2) {
  return isString(s2) ? s2.replace(/[A-Z]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) | 32);
  }) : s2;
};
if ("I".toLowerCase() !== "i") {
  lowercase = manualLowercase;
}
function runWithFunctionConstructorProtection(fn) {
  var originalFunctionConstructorDescriptor = Object.getOwnPropertyDescriptor(
    Function.prototype,
    "constructor"
  );
  if (originalFunctionConstructorDescriptor) {
    delete Function.prototype.constructor;
  }
  try {
    return fn();
  } finally {
    if (originalFunctionConstructorDescriptor) {
      Object.defineProperty(
        Function.prototype,
        "constructor",
        originalFunctionConstructorDescriptor
      );
    }
  }
}
var jqLite, toString$1 = Object.prototype.toString, getPrototypeOf = Object.getPrototypeOf, ngMinErr = minErr("ng");
function isArrayLike$1(obj) {
  if (obj == null || isWindow(obj)) {
    return false;
  }
  if (isArray$1(obj) || isString(obj) || jqLite) {
    return true;
  }
  var length = "length" in Object(obj) && obj.length;
  return isNumber(length) && (length >= 0 && (length - 1 in obj || obj instanceof Array) || typeof obj.item === "function");
}
function forEach(obj, iterator2) {
  var key, length;
  if (obj) {
    if (isArray$1(obj) || isArrayLike$1(obj)) {
      for (key = 0, length = obj.length; key < length; key++) {
        if (key in obj) {
          $call(iterator2, /* @__PURE__ */ Object.create(null), obj[key], key, obj);
        }
      }
    } else {
      for (key in obj) {
        if (hasOwn$1(obj, key)) {
          $call(iterator2, /* @__PURE__ */ Object.create(null), obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}
function setHashKey(obj, h2) {
  if (h2) {
    obj.$$hashKey = h2;
  } else {
    delete obj.$$hashKey;
  }
}
function noop$1() {
}
function isUndefined(value) {
  return typeof value === "undefined";
}
function isDefined(value) {
  return typeof value !== "undefined";
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isString(value) {
  return typeof value === "string";
}
function isNumber(value) {
  return typeof value === "number";
}
function isFunction$1(value) {
  return typeof value === "function";
}
function isWindow(obj) {
  return obj && obj.window === obj;
}
function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}
function copy(source, destination) {
  var stackSource = [];
  var stackDest = [];
  return copyElement(source);
  function copyRecurse(source2, destination2) {
    var h2 = destination2.$$hashKey;
    var key;
    if (isArray$1(source2)) {
      for (var i = 0, ii = source2.length; i < ii; i++) {
        destination2.push(copyElement(source2[i]));
      }
    } else {
      for (key in source2) {
        if (hasOwn$1(source2, key)) {
          destination2[key] = copyElement(source2[key]);
        }
      }
    }
    setHashKey(destination2, h2);
    return destination2;
  }
  function copyElement(source2) {
    if (!isObject(source2)) {
      return source2;
    }
    var index = stackSource.indexOf(source2);
    if (index !== -1) {
      return stackDest[index];
    }
    if (isWindow(source2) || isScope(source2)) {
      throw ngMinErr(
        "cpws",
        "Can't copy! Making copies of Window or Scope instances is not supported."
      );
    }
    var needsRecurse = false;
    var destination2 = copyType(source2);
    if (destination2 === void 0) {
      destination2 = isArray$1(source2) ? [] : Object.create(getPrototypeOf(source2));
      needsRecurse = true;
    }
    stackSource.push(source2);
    stackDest.push(destination2);
    return needsRecurse ? copyRecurse(source2, destination2) : destination2;
  }
  function copyType(source2) {
    switch ($call(toString$1, source2)) {
      case "[object Int8Array]":
      case "[object Int16Array]":
      case "[object Int32Array]":
      case "[object Float32Array]":
      case "[object Float64Array]":
      case "[object Uint8Array]":
      case "[object Uint8ClampedArray]":
      case "[object Uint16Array]":
      case "[object Uint32Array]":
        return new source2.constructor(
          copyElement(source2.buffer),
          source2.byteOffset,
          source2.length
        );
      case "[object ArrayBuffer]":
        if (!source2.slice) {
          var copied = new ArrayBuffer(source2.byteLength);
          new Uint8Array(copied).set(new Uint8Array(source2));
          return copied;
        }
        return source2.slice(0);
      case "[object Boolean]":
      case "[object Number]":
      case "[object String]":
      case "[object Date]":
        return new source2.constructor(source2.valueOf());
      case "[object RegExp]":
        var re = new RegExp(
          source2.source,
          source2.toString().match(/[^\/]*$/)[0]
        );
        re.lastIndex = source2.lastIndex;
        return re;
      case "[object Blob]":
        return new source2.constructor([source2], { type: source2.type });
    }
    if (isFunction$1(source2.cloneNode)) {
      return source2.cloneNode(true);
    }
  }
}
function toJsonReplacer(key, value) {
  var val = value;
  if (typeof key === "string" && key.charAt(0) === "$" && key.charAt(1) === "$") {
    val = void 0;
  } else if (isWindow(value)) {
    val = "$WINDOW";
  } else if (value && window$1.document === value) {
    val = "$DOCUMENT";
  } else if (isScope(value)) {
    val = "$SCOPE";
  }
  return val;
}
function createMap() {
  return /* @__PURE__ */ Object.create(null);
}
function serializeObject(obj) {
  var seen2 = [];
  return JSON.stringify(obj, function(key, val) {
    val = toJsonReplacer(key, val);
    if (isObject(val)) {
      if (seen2.indexOf(val) >= 0) {
        return "...";
      }
      seen2.push(val);
    }
    return val;
  });
}
function toDebugString(obj) {
  if (typeof obj === "function") {
    return obj.toString().replace(/ \{[\s\S]*$/, "");
  } else if (isUndefined(obj)) {
    return "undefined";
  } else if (typeof obj !== "string") {
    return serializeObject(obj);
  }
  return obj;
}
function minErr(module, ErrorConstructor) {
  ErrorConstructor = ErrorConstructor || Error;
  return function() {
    var SKIP_INDEXES = 2;
    var templateArgs = arguments, code = templateArgs[0], message = "[" + (module ? module + ":" : "") + code + "] ", template2 = templateArgs[1], paramPrefix, i;
    message += template2.replace(/\{\d+\}/g, function(match2) {
      var index = +match2.slice(1, -1), shiftedIndex = index + SKIP_INDEXES;
      if (shiftedIndex < templateArgs.length) {
        return toDebugString(templateArgs[shiftedIndex]);
      }
      return match2;
    });
    message += '\nhttp://errors.angularjs.org/"NG_VERSION_FULL"/' + (module ? module + "/" : "") + code;
    for (i = SKIP_INDEXES, paramPrefix = "?"; i < templateArgs.length; i++, paramPrefix = "&") {
      message += paramPrefix + "p" + (i - SKIP_INDEXES) + "=" + encodeURIComponent(toDebugString(templateArgs[i]));
    }
    return new ErrorConstructor(message);
  };
}
var $parseMinErr = minErr("$parse");
function getStringValue(name) {
  return name + "";
}
var OPERATORS = createMap();
forEach(
  "+ - * / % === !== == != < > <= >= && || ?? ! = | ?".split(" "),
  function(operator) {
    OPERATORS[operator] = true;
  }
);
var ESCAPE = {
  n: "\n",
  f: "\f",
  r: "\r",
  t: "	",
  v: "\v",
  "'": "'",
  '"': '"'
};
function Lexer$1(options) {
  this.options = options || {};
}
Lexer$1.prototype = {
  constructor: Lexer$1,
  lex: function(text2) {
    this.text = text2;
    this.index = 0;
    this.tokens = [];
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch === '"' || ch === "'" || ch === "`") {
        this.readString(ch);
      } else if (this.isNumber(ch) || ch === "." && this.isNumber(this.peek())) {
        this.readNumber();
      } else if (this.isIdentifierStart(this.peekMultichar())) {
        this.readIdent();
      } else if (this.is(ch, "(){}[].,;:")) {
        this.tokens.push({ index: this.index, text: ch });
        this.index++;
      } else if (this.isWhitespace(ch)) {
        this.index++;
      } else {
        var ch2 = ch + this.peek();
        var ch3 = ch2 + this.peek(2);
        var op1 = OPERATORS[ch];
        var op2 = OPERATORS[ch2];
        var op3 = OPERATORS[ch3];
        if (op1 || op2 || op3) {
          var token = op3 ? ch3 : op2 ? ch2 : ch;
          this.tokens.push({ index: this.index, text: token, operator: true });
          this.index += token.length;
        } else {
          this.throwError(
            "Unexpected next character ",
            this.index,
            this.index + 1
          );
        }
      }
    }
    return this.tokens;
  },
  is: function(ch, chars) {
    return chars.indexOf(ch) !== -1;
  },
  peek: function(i) {
    var num = i || 1;
    return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
  },
  isNumber: function(ch) {
    return ch >= "0" && ch <= "9" && typeof ch === "string";
  },
  isWhitespace: function(ch) {
    return ch === " " || ch === "\r" || ch === "	" || ch === "\n" || ch === "\v" || ch === " ";
  },
  isIdentifierStart: function(ch) {
    if (!this.options.isIdentifierStart) {
      return this.isValidIdentifierStart(ch);
    }
    if (!this.options.isIdentifierStart(ch, this.codePointAt(ch))) {
      return false;
    }
    if (alwaysDeniedIdentifiers.indexOf(ch) !== -1) {
      throw new Error(
        "Character " + ch + " should never be part of an identifier"
      );
    }
    return true;
  },
  isValidIdentifierStart: function(ch) {
    return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch === "_" || ch === "$";
  },
  isIdentifierContinue: function(ch) {
    if (!this.options.isIdentifierContinue) {
      return this.isValidIdentifierContinue(ch);
    }
    if (!this.options.isIdentifierContinue(ch, this.codePointAt(ch))) {
      return false;
    }
    if (alwaysDeniedIdentifiers.indexOf(ch) !== -1) {
      throw new Error(
        "Character " + ch + " should never be part of an identifier"
      );
    }
    return true;
  },
  isValidIdentifierContinue: function(ch, cp) {
    return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
  },
  codePointAt: function(ch) {
    if (ch.length === 1) {
      return ch.charCodeAt(0);
    }
    return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 56613888;
  },
  peekMultichar: function() {
    var ch = this.text.charAt(this.index);
    var peek = this.peek();
    if (!peek) {
      return ch;
    }
    var cp1 = ch.charCodeAt(0);
    var cp2 = peek.charCodeAt(0);
    if (cp1 >= 55296 && cp1 <= 56319 && cp2 >= 56320 && cp2 <= 57343) {
      return ch + peek;
    }
    return ch;
  },
  isExpOperator: function(ch) {
    return ch === "-" || ch === "+" || this.isNumber(ch);
  },
  throwError: function(error, start2, end) {
    end = end || this.index;
    var colStr = isDefined(start2) ? "s " + start2 + "-" + this.index + " [" + this.text.substring(start2, end) + "]" : " " + end;
    throw $parseMinErr(
      "lexerr",
      "Lexer Error: {0} at column{1} in expression [{2}].",
      error,
      colStr,
      this.text
    );
  },
  readNumber: function() {
    var number = "";
    var start2 = this.index;
    while (this.index < this.text.length) {
      var ch = lowercase(this.text.charAt(this.index));
      if (ch === "." || this.isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = this.peek();
        if (ch === "e" && this.isExpOperator(peekCh)) {
          number += ch;
        } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) === "e") {
          number += ch;
        } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) === "e") {
          this.throwError("Invalid exponent");
        } else {
          break;
        }
      }
      this.index++;
    }
    this.tokens.push({
      index: start2,
      text: number,
      constant: true,
      value: Number(number)
    });
  },
  readIdent: function() {
    var start2 = this.index;
    this.index += this.peekMultichar().length;
    while (this.index < this.text.length) {
      var ch = this.peekMultichar();
      if (!this.isIdentifierContinue(ch)) {
        break;
      }
      this.index += ch.length;
    }
    this.tokens.push({
      index: start2,
      text: this.text.slice(start2, this.index),
      identifier: true
    });
  },
  readString: function(quote) {
    var start2 = this.index;
    this.index++;
    var string = "";
    var rawString = quote;
    var isTemplateLiteral = quote === "`";
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (isTemplateLiteral && !escape && ch === "$" && this.text.charAt(this.index + 1) === "{") {
        this.tokens.push({
          index: start2,
          text: rawString,
          constant: true,
          value: string
        });
        this.index += 2;
        var exprStart = this.index;
        var depth = 1;
        while (this.index < this.text.length && depth > 0) {
          var c2 = this.text.charAt(this.index);
          if (c2 === "{") {
            depth++;
          } else if (c2 === "}") {
            depth--;
            if (depth === 0) {
              break;
            }
          }
          this.index++;
        }
        if (depth !== 0) {
          this.throwError("Unterminated template expression", exprStart);
        }
        var exprText = this.text.substring(exprStart, this.index);
        try {
          var innerAst = new AST(new Lexer$1(this.options), this.options);
          innerAst.ast(exprText);
        } catch (e2) {
          this.throwError(
            "Invalid expression in template literal '" + exprText + "': " + e2.message,
            exprStart
          );
        }
        var innerTokens = new Lexer$1(this.options).lex(exprText);
        this.tokens.push({ index: exprStart, text: "+", operator: true });
        for (var i = 0, len = innerTokens.length; i < len; i++) {
          this.tokens.push(innerTokens[i]);
        }
        this.tokens.push({ index: this.index, text: "+", operator: true });
        this.index++;
        string = "";
        rawString = "`";
        start2 = this.index;
        continue;
      }
      rawString += ch;
      if (escape) {
        if (ch === "u") {
          var hex = this.text.substring(this.index + 1, this.index + 5);
          if (!hex.match(/[\da-f]{4}/i)) {
            this.throwError("Invalid unicode escape [\\u" + hex + "]");
          }
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          string = string + (rep || ch);
        }
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === quote) {
        this.index++;
        this.tokens.push({
          index: start2,
          text: rawString,
          constant: true,
          value: string
        });
        return;
      } else {
        string += ch;
      }
      this.index++;
    }
    this.throwError("Unterminated quote", start2);
  }
};
var existingSyntaxes = [
  "Program",
  "ExpressionStatement",
  "AssignmentExpression",
  "ConditionalExpression",
  "LogicalExpression",
  "BinaryExpression",
  "UnaryExpression",
  "CallExpression",
  "MemberExpression",
  "Identifier",
  "Literal",
  "ArrayExpression",
  "Property",
  "ObjectExpression",
  "ThisExpression",
  "LocalsExpression",
  "NGValueParameter",
  "FilterExpression"
];
function AST(lexer, options) {
  this.lexer = lexer;
  this.options = options;
  if (!this.options.disabledSyntaxes) {
    this.options.disabledSyntaxes = [];
  }
  for (var i = 0, len = this.options.disabledSyntaxes.length; i < len; i++) {
    var syntax = this.options.disabledSyntaxes[i];
    if (existingSyntaxes.indexOf(syntax) === -1) {
      throw new Error(
        'Invalid syntax in disabledSyntaxes: "' + syntax + '"\nExpected one of: [' + existingSyntaxes.map(function(s2) {
          return '"' + s2 + '"';
        }).join(", ") + "]"
      );
    }
  }
}
AST.Program = "Program";
AST.ExpressionStatement = "ExpressionStatement";
AST.AssignmentExpression = "AssignmentExpression";
AST.ConditionalExpression = "ConditionalExpression";
AST.LogicalExpression = "LogicalExpression";
AST.BinaryExpression = "BinaryExpression";
AST.UnaryExpression = "UnaryExpression";
AST.CallExpression = "CallExpression";
AST.FilterExpression = "FilterExpression";
AST.MemberExpression = "MemberExpression";
AST.Identifier = "Identifier";
AST.Literal = "Literal";
AST.ArrayExpression = "ArrayExpression";
AST.Property = "Property";
AST.ObjectExpression = "ObjectExpression";
AST.ThisExpression = "ThisExpression";
AST.LocalsExpression = "LocalsExpression";
AST.NGValueParameter = "NGValueParameter";
AST.prototype = {
  ast: function(text2) {
    this.text = text2;
    this.tokens = this.lexer.lex(text2);
    var value = this.program();
    if (this.tokens.length !== 0) {
      this.throwError("is an unexpected token", this.tokens[0]);
    }
    return value;
  },
  program: function() {
    var body = [];
    while (true) {
      if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]")) {
        body.push(this.expressionStatement());
      }
      if (!this.expect(";")) {
        return this.guardSyntax({ type: AST.Program, body });
      }
    }
  },
  guardSyntax: function(suggestion) {
    var syntax = suggestion.type;
    for (var i = 0, len = this.options.disabledSyntaxes.length; i < len; i++) {
      var disabledSyntax = this.options.disabledSyntaxes[i];
      if (disabledSyntax === syntax) {
        throw new Error(
          '"' + disabledSyntax + '" is blocked by disabledSyntaxes'
        );
      }
    }
    return suggestion;
  },
  expressionStatement: function() {
    return this.guardSyntax({
      type: AST.ExpressionStatement,
      expression: this.filterChain()
    });
  },
  filterChain: function() {
    var left = this.expression();
    while (this.expect("|")) {
      left = this.filter(left);
    }
    return left;
  },
  expression: function() {
    return this.assignment();
  },
  assignment: function() {
    var result = this.ternary();
    if (this.expect("=")) {
      if (!isAssignable(result)) {
        throw $parseMinErr("lval", "Trying to assign a value to a non l-value");
      }
      result = this.guardSyntax({
        type: AST.AssignmentExpression,
        left: result,
        right: this.assignment(),
        operator: "="
      });
    }
    return result;
  },
  ternary: function() {
    var test = this.nullishCoalescing();
    var alternate;
    var consequent;
    if (this.expect("?")) {
      alternate = this.expression();
      if (this.consume(":")) {
        consequent = this.expression();
        return this.guardSyntax({
          type: AST.ConditionalExpression,
          test,
          alternate,
          consequent
        });
      }
    }
    return test;
  },
  nullishCoalescing: function() {
    var left = this.logicalOR();
    while (this.expect("??")) {
      left = this.guardSyntax({
        type: AST.LogicalExpression,
        operator: "??",
        left,
        right: this.logicalOR()
      });
    }
    return left;
  },
  logicalOR: function() {
    var left = this.logicalAND();
    while (this.expect("||")) {
      left = this.guardSyntax({
        type: AST.LogicalExpression,
        operator: "||",
        left,
        right: this.logicalAND()
      });
    }
    return left;
  },
  logicalAND: function() {
    var left = this.equality();
    while (this.expect("&&")) {
      left = this.guardSyntax({
        type: AST.LogicalExpression,
        operator: "&&",
        left,
        right: this.equality()
      });
    }
    return left;
  },
  equality: function() {
    var left = this.relational();
    var token;
    while (token = this.expect("==", "!=", "===", "!==")) {
      left = this.guardSyntax({
        type: AST.BinaryExpression,
        operator: token.text,
        left,
        right: this.relational()
      });
    }
    return left;
  },
  relational: function() {
    var left = this.additive();
    var token;
    while (token = this.expect("<", ">", "<=", ">=")) {
      left = this.guardSyntax({
        type: AST.BinaryExpression,
        operator: token.text,
        left,
        right: this.additive()
      });
    }
    return left;
  },
  additive: function() {
    var left = this.multiplicative();
    var token;
    while (token = this.expect("+", "-")) {
      left = this.guardSyntax({
        type: AST.BinaryExpression,
        operator: token.text,
        left,
        right: this.multiplicative()
      });
    }
    return left;
  },
  multiplicative: function() {
    var left = this.unary();
    var token;
    while (token = this.expect("*", "/", "%")) {
      left = this.guardSyntax({
        type: AST.BinaryExpression,
        operator: token.text,
        left,
        right: this.unary()
      });
    }
    return left;
  },
  unary: function() {
    var token;
    if (token = this.expect("+", "-", "!")) {
      return this.guardSyntax({
        type: AST.UnaryExpression,
        operator: token.text,
        prefix: true,
        argument: this.unary()
      });
    }
    return this.primary();
  },
  primary: function() {
    var primary;
    if (this.expect("(")) {
      primary = this.guardSyntax(this.filterChain());
      this.consume(")");
    } else if (this.expect("[")) {
      primary = this.guardSyntax(this.arrayDeclaration());
    } else if (this.expect("{")) {
      primary = this.guardSyntax(this.object());
    } else if (hasOwn$1(this.selfReferential, this.peek().text)) {
      primary = this.guardSyntax(
        copy(this.selfReferential[this.consume().text])
      );
    } else if (hasOwn$1(this.options.literals, this.peek().text)) {
      primary = this.guardSyntax({
        type: AST.Literal,
        value: this.options.literals[this.consume().text]
      });
    } else if (this.peek().identifier) {
      primary = this.guardSyntax(this.identifier());
    } else if (this.peek().constant) {
      primary = this.guardSyntax(this.constant());
    } else {
      this.throwError("not a primary expression", this.peek());
    }
    var next;
    while (next = this.expect("(", "[", ".")) {
      if (next.text === "(") {
        primary = this.guardSyntax({
          type: AST.CallExpression,
          callee: primary,
          arguments: this.parseArguments()
        });
        this.consume(")");
      } else if (next.text === "[") {
        primary = this.guardSyntax({
          type: AST.MemberExpression,
          object: primary,
          property: this.expression(),
          computed: true
        });
        this.consume("]");
      } else if (next.text === ".") {
        primary = this.guardSyntax({
          type: AST.MemberExpression,
          object: primary,
          property: this.identifier(),
          computed: false
        });
      } else {
        this.throwError("IMPOSSIBLE");
      }
    }
    return primary;
  },
  filter: function(baseExpression) {
    var args = [baseExpression];
    var result = this.guardSyntax({
      type: AST.FilterExpression,
      callee: this.identifier(),
      arguments: args,
      filter: true
    });
    while (this.expect(":")) {
      args.push(this.expression());
    }
    return result;
  },
  parseArguments: function() {
    var args = [];
    if (this.peekToken().text !== ")") {
      do {
        args.push(this.filterChain());
      } while (this.expect(","));
    }
    return args;
  },
  identifier: function() {
    var token = this.consume();
    if (!token.identifier) {
      this.throwError("is not a valid identifier", token);
    }
    return this.guardSyntax({ type: AST.Identifier, name: token.text });
  },
  constant: function() {
    return this.guardSyntax({ type: AST.Literal, value: this.consume().value });
  },
  arrayDeclaration: function() {
    var elements2 = [];
    if (this.peekToken().text !== "]") {
      do {
        if (this.peek("]")) {
          break;
        }
        elements2.push(this.expression());
      } while (this.expect(","));
    }
    this.consume("]");
    return this.guardSyntax({ type: AST.ArrayExpression, elements: elements2 });
  },
  object: function() {
    var properties = [], property;
    if (this.peekToken().text !== "}") {
      do {
        if (this.peek("}")) {
          break;
        }
        property = this.guardSyntax({ type: AST.Property, kind: "init" });
        if (this.peek().constant) {
          property.key = this.constant();
          property.computed = false;
          this.consume(":");
          property.value = this.expression();
        } else if (this.peek().identifier) {
          property.key = this.identifier();
          property.computed = false;
          if (this.peek(":")) {
            this.consume(":");
            property.value = this.expression();
          } else {
            property.value = property.key;
          }
        } else if (this.peek("[")) {
          this.consume("[");
          property.key = this.expression();
          this.consume("]");
          property.computed = true;
          this.consume(":");
          property.value = this.expression();
        } else {
          this.throwError("invalid key", this.peek());
        }
        properties.push(property);
      } while (this.expect(","));
    }
    this.consume("}");
    return this.guardSyntax({
      type: AST.ObjectExpression,
      properties
    });
  },
  throwError: function(msg, token) {
    throw $parseMinErr(
      "syntax",
      "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].",
      token.text,
      msg,
      token.index + 1,
      this.text,
      this.text.substring(token.index)
    );
  },
  consume: function(e1) {
    if (this.tokens.length === 0) {
      throw $parseMinErr(
        "ueoe",
        "Unexpected end of expression: {0}",
        this.text
      );
    }
    var token = this.expect(e1);
    if (!token) {
      this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
    }
    return token;
  },
  peekToken: function() {
    if (this.tokens.length === 0) {
      throw $parseMinErr(
        "ueoe",
        "Unexpected end of expression: {0}",
        this.text
      );
    }
    return this.tokens[0];
  },
  peek: function(e1, e2, e3, e4) {
    return this.peekAhead(0, e1, e2, e3, e4);
  },
  peekAhead: function(i, e1, e2, e3, e4) {
    if (this.tokens.length > i) {
      var token = this.tokens[i];
      var t2 = token.text;
      if (t2 === e1 || t2 === e2 || t2 === e3 || t2 === e4 || !e1 && !e2 && !e3 && !e4) {
        return token;
      }
    }
    return false;
  },
  expect: function(e1, e2, e3, e4) {
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      this.tokens.shift();
      return token;
    }
    return false;
  }
};
function ifDefined(v2, d2) {
  return typeof v2 !== "undefined" ? v2 : d2;
}
function plusFn(l2, r) {
  if (typeof l2 === "string" && l2.length > MAX_STRING_LENGTH || typeof r === "string" && r.length > MAX_STRING_LENGTH) {
    throw new Error("Max string length exceeded");
  }
  if (l2 == null) {
    return r;
  }
  if (r == null) {
    return l2;
  }
  var result = l2 + r;
  if (result.length > MAX_STRING_LENGTH) {
    throw new Error("Max string length exceeded");
  }
  return result;
}
function minusFn(l2, r) {
  if (l2 == null || r == null) {
    return void 0;
  }
  return l2 - r;
}
function timesFn(l2, r) {
  if (l2 == null || r == null) {
    return void 0;
  }
  return l2 * r;
}
function divideFn(l2, r) {
  if (l2 == null || r == null) {
    return void 0;
  }
  return l2 / r;
}
function moduloFn(l2, r) {
  if (l2 == null || r == null) {
    return void 0;
  }
  return l2 % r;
}
function findUndefinedFilters(ast, $filter) {
  switch (ast.type) {
    case AST.Program:
      forEach(ast.body, function(expr) {
        findUndefinedFilters(expr.expression, $filter);
      });
      break;
    case AST.UnaryExpression:
      findUndefinedFilters(ast.argument, $filter);
      break;
    case AST.AssignmentExpression:
    case AST.BinaryExpression:
    case AST.LogicalExpression:
      findUndefinedFilters(ast.left, $filter);
      findUndefinedFilters(ast.right, $filter);
      break;
    case AST.ConditionalExpression:
      findUndefinedFilters(ast.test, $filter);
      findUndefinedFilters(ast.alternate, $filter);
      findUndefinedFilters(ast.consequent, $filter);
      break;
    case AST.MemberExpression:
      findUndefinedFilters(ast.object, $filter);
      if (ast.computed) {
        findUndefinedFilters(ast.property, $filter);
      }
      break;
    case AST.FilterExpression:
    case AST.CallExpression:
      if (ast.type === AST.FilterExpression) {
        var fn = $filter(ast.callee.name);
        if (!fn) {
          throw new Error("Filter '" + ast.callee.name + "' is not defined");
        }
      }
      findUndefinedFilters(ast.callee, $filter);
      forEach(ast.arguments, function(expr) {
        findUndefinedFilters(expr, $filter);
      });
      break;
    case AST.ArrayExpression:
      forEach(ast.elements, function(expr) {
        findUndefinedFilters(expr, $filter);
      });
      break;
    case AST.ObjectExpression:
      forEach(ast.properties, function(expr) {
        findUndefinedFilters(expr.key, $filter);
        findUndefinedFilters(expr.value, $filter);
      });
      break;
  }
}
function isAssignable(ast) {
  return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
}
function assignableAST(ast, astBuilder) {
  if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
    return astBuilder.guardSyntax({
      type: AST.AssignmentExpression,
      left: ast.body[0].expression,
      right: astBuilder.guardSyntax({ type: AST.NGValueParameter }),
      operator: "="
    });
  }
}
function ASTCompiler(astBuilder, $filter) {
  this.astBuilder = astBuilder;
  this.$filter = $filter;
}
ASTCompiler.prototype = {
  compile: function(expression) {
    var self2 = this;
    var ast = this.astBuilder.ast(expression);
    this.state = {
      nextId: 0,
      filters: /* @__PURE__ */ Object.create(null),
      fn: { vars: [], body: [], own: {} },
      assign: { vars: [], body: [], own: {} },
      inputs: []
    };
    findUndefinedFilters(ast, self2.$filter);
    var extra = "";
    var assignable;
    this.stage = "assign";
    if (assignable = assignableAST(ast, this.astBuilder)) {
      this.state.computing = "assign";
      var result = this.nextId();
      this.recurse(assignable, result);
      this.return_(result);
      extra = "fn.assign=" + this.generateFunction("assign", "s,v,l");
    }
    self2.stage = "inputs";
    this.state.computing = "fn";
    this.stage = "main";
    this.recurse(ast);
    var fnString = (
      // The build and minification steps remove the string "use strict" from the code, but this is done using a regex.
      // This is a workaround for this until we do a better job at only removing the prefix only when we should.
      '"' + this.USE + " " + this.STRICT + '";\nvar fn=' + this.generateFunction("fn", "s,l") + extra + this.watchFns() + "return fn;"
    );
    if (commonjsGlobal.storeFnString) {
      commonjsGlobal.storeFnString(fnString);
    }
    var wrappedFn = new Function(
      "$filter",
      "$call",
      "getStringValue",
      "ifDefined",
      "plus",
      "minus",
      "times",
      "divide",
      "modulo",
      "hasOwn",
      "assertSafeValue",
      fnString
    )(
      function() {
        var args = new Array(arguments.length);
        for (var i = 0, len = arguments.length; i < len; i++) {
          args[i] = arguments[i];
        }
        return $apply$1(self2.$filter, /* @__PURE__ */ Object.create(null), args);
      },
      $call,
      getStringValue,
      ifDefined,
      plusFn,
      minusFn,
      timesFn,
      divideFn,
      moduloFn,
      hasOwn$1,
      assertSafeValue
    );
    var fn = function(s2, l2) {
      return runWithFunctionConstructorProtection(function() {
        return wrappedFn(s2, l2);
      });
    };
    fn.assign = function(s2, v2, l2) {
      return runWithFunctionConstructorProtection(function() {
        return wrappedFn.assign(s2, v2, l2);
      });
    };
    this.state = this.stage = void 0;
    fn.ast = ast;
    return fn;
  },
  USE: "use",
  STRICT: "strict",
  watchFns: function() {
    var result = [];
    var fns = this.state.inputs;
    var self2 = this;
    forEach(fns, function(name) {
      result.push("var " + name + "=" + self2.generateFunction(name, "s"));
    });
    if (fns.length) {
      result.push("fn.inputs=[" + fns.join(",") + "];");
    }
    return result.join("");
  },
  generateFunction: function(name, params) {
    return "function(" + params + "){" + this.filterPrefix() + this.varsPrefix(name) + this.body(name) + "};";
  },
  filterPrefix: function() {
    var parts = [];
    var self2 = this;
    forEach(this.state.filters, function(id, filter2) {
      parts.push(id + "=$filter(" + self2.escape(filter2) + ")");
    });
    if (parts.length) {
      return "var " + parts.join(",") + ";";
    }
    return "";
  },
  varsPrefix: function(section) {
    return this.state[section].vars.length ? "var " + this.state[section].vars.join(",") + ";" : "";
  },
  body: function(section) {
    return this.state[section].body.join("");
  },
  recurse: function(ast, intoId, nameId, recursionFn, create2) {
    var left, right, self2 = this, args, expression, computed;
    recursionFn = recursionFn || noop$1;
    this.astBuilder.guardSyntax(ast);
    switch (ast.type) {
      case AST.Program:
        forEach(ast.body, function(expression2, pos) {
          self2.recurse(
            expression2.expression,
            void 0,
            void 0,
            function(expr) {
              right = expr;
            }
          );
          if (pos !== ast.body.length - 1) {
            self2.current().body.push(right, ";");
          } else {
            self2.return_(right);
          }
        });
        break;
      case AST.Literal:
        expression = this.escape(ast.value);
        this.assign(intoId, expression);
        recursionFn(intoId || expression);
        break;
      case AST.UnaryExpression:
        this.recurse(ast.argument, void 0, void 0, function(expr) {
          right = expr;
        });
        expression = ast.operator + "(" + this.ifDefined(right, 0) + ")";
        this.assign(intoId, expression);
        recursionFn(expression);
        break;
      case AST.BinaryExpression:
        this.recurse(ast.left, void 0, void 0, function(expr) {
          left = expr;
        });
        this.recurse(ast.right, void 0, void 0, function(expr) {
          right = expr;
        });
        if (ast.operator === "+") {
          expression = "plus(" + left + "," + right + ")";
        } else if (ast.operator === "-") {
          expression = "minus(" + left + "," + right + ")";
        } else if (ast.operator === "*") {
          expression = "times(" + left + "," + right + ")";
        } else if (ast.operator === "/") {
          expression = "divide(" + left + "," + right + ")";
        } else if (ast.operator === "%") {
          expression = "modulo(" + left + "," + right + ")";
        } else {
          expression = "(" + left + ")" + ast.operator + "(" + right + ")";
        }
        this.assign(intoId, expression);
        recursionFn(expression);
        break;
      case AST.LogicalExpression:
        intoId = intoId || this.nextId();
        self2.recurse(ast.left, intoId);
        if (ast.operator === "??") {
          self2.if_(
            self2.or_(
              self2.isNull(intoId),
              "typeof " + intoId + " === 'undefined'"
            ),
            self2.lazyRecurse(ast.right, intoId)
          );
        } else {
          self2.if_(
            ast.operator === "&&" ? intoId : self2.not(intoId),
            self2.lazyRecurse(ast.right, intoId)
          );
        }
        recursionFn(intoId);
        break;
      case AST.ConditionalExpression:
        intoId = intoId || this.nextId();
        self2.recurse(ast.test, intoId);
        self2.if_(
          intoId,
          self2.lazyRecurse(ast.alternate, intoId),
          self2.lazyRecurse(ast.consequent, intoId)
        );
        recursionFn(intoId);
        break;
      case AST.Identifier:
        intoId = intoId || this.nextId();
        var inAssignment = self2.current().inAssignment;
        if (nameId) {
          if (inAssignment) {
            nameId.context = this.assign(this.nextId(), "s");
          } else {
            nameId.context = self2.stage === "inputs" ? "s" : this.assign(
              this.nextId(),
              this.getHasOwnProperty("l", ast.name) + "?l:s"
            );
          }
          nameId.computed = false;
          nameId.name = ast.name;
        }
        self2.if_(
          self2.stage === "inputs" || self2.not(self2.getHasOwnProperty("l", ast.name)),
          function() {
            self2.if_(self2.stage === "inputs" || "s", function() {
              var tmpId = self2.nextId();
              self2.assign(tmpId, self2.nonComputedMember("s", ast.name));
              self2.if_(
                self2.or_(
                  self2.isNull(tmpId),
                  self2.hasOwnProperty_("s", ast.name, false)
                ),
                function() {
                  if (create2 && create2 !== 1) {
                    self2.if_(
                      self2.isNull(tmpId),
                      self2.lazyAssign(
                        self2.nonComputedMember("s", ast.name),
                        "{}"
                      )
                    );
                    self2.assign(intoId, self2.nonComputedMember("s", ast.name));
                  } else {
                    self2.assign(intoId, tmpId);
                  }
                }
              );
            });
          },
          intoId && function() {
            self2.if_(
              self2.hasOwnProperty_("l", ast.name, false),
              self2.lazyAssign(intoId, self2.nonComputedMember("l", ast.name))
            );
          }
        );
        self2.current().body.push("assertSafeValue(" + intoId + ");");
        recursionFn(intoId);
        break;
      case AST.MemberExpression:
        left = nameId && (nameId.context = this.nextId()) || this.nextId();
        intoId = intoId || this.nextId();
        self2.recurse(
          ast.object,
          left,
          void 0,
          function() {
            var member = null;
            var inAssignment2 = self2.current().inAssignment;
            if (ast.computed) {
              right = self2.nextId();
              if (inAssignment2 || self2.state.computing === "assign") {
                member = self2.unsafeComputedMember(left, right);
              } else {
                member = self2.computedMember(left, right);
              }
            } else {
              if (inAssignment2 || self2.state.computing === "assign") {
                member = self2.unsafeNonComputedMember(left, ast.property.name);
              } else {
                member = self2.nonComputedMember(left, ast.property.name);
              }
              right = ast.property.name;
            }
            if (right === "__proto__") {
              return;
            }
            if (ast.computed) {
              self2.recurse(ast.property, right);
              self2.getStringValue(right);
            }
            self2.current().body.push("assertSafeValue(" + left + ");");
            self2.if_(
              self2.and_(
                self2.notNull(left),
                self2.or_(
                  self2.isNull(member),
                  self2.hasOwnProperty_(left, right, ast.computed)
                )
              ),
              function() {
                if (ast.computed) {
                  if (create2 && create2 !== 1) {
                    self2.if_(self2.not(member), self2.lazyAssign(member, "{}"));
                  }
                  self2.assign(intoId, member);
                  if (nameId) {
                    nameId.computed = true;
                    nameId.name = right;
                  }
                } else {
                  if (create2 && create2 !== 1) {
                    self2.if_(
                      self2.isNull(member),
                      self2.lazyAssign(member, "{}")
                    );
                  }
                  self2.assign(intoId, member);
                  if (nameId) {
                    nameId.computed = false;
                    nameId.name = ast.property.name;
                  }
                }
              },
              function() {
                self2.assign(intoId, "undefined");
              }
            );
            self2.current().body.push("assertSafeValue(" + intoId + ");");
            recursionFn(intoId);
          },
          !!create2
        );
        break;
      case AST.FilterExpression:
      case AST.CallExpression:
        intoId = intoId || this.nextId();
        if (ast.filter) {
          right = self2.filter(ast.callee.name);
          args = [];
          forEach(ast.arguments, function(expr) {
            var argument = self2.nextId();
            self2.recurse(expr, argument);
            args.push(argument);
          });
          expression = "$call(" + right + "," + right + "," + args.join(",") + ")";
          self2.assign(intoId, expression);
          self2.current().body.push("assertSafeValue(" + intoId + ");");
          recursionFn(intoId);
        } else {
          right = self2.nextId();
          left = {};
          args = [];
          self2.recurse(ast.callee, right, left, function() {
            self2.if_(
              self2.notNull(right),
              function() {
                forEach(ast.arguments, function(expr) {
                  self2.recurse(
                    expr,
                    ast.constant ? void 0 : self2.nextId(),
                    void 0,
                    function(argument) {
                      args.push(argument);
                    }
                  );
                });
                if (left.name) {
                  var x = self2.member(left.context, left.name, left.computed);
                  expression = "(" + x + " == null ? null :\n										$call(" + self2.unsafeMember(left.context, left.name, left.computed) + ",\n											" + [left.context].concat(args).join(",") + "\n											)\n										)";
                } else {
                  expression = "$call(" + right + ",Object.create(null)" + (args.length ? "," + args.join(",") : "") + ")";
                }
                self2.assign(intoId, expression);
                self2.current().body.push("assertSafeValue(" + intoId + ");");
              },
              function() {
                self2.assign(intoId, "undefined");
              }
            );
            recursionFn(intoId);
          });
        }
        break;
      case AST.AssignmentExpression:
        right = this.nextId();
        intoId = intoId || this.nextId();
        left = {};
        self2.current().inAssignment = true;
        this.recurse(
          ast.left,
          void 0,
          left,
          function() {
            if (left.computed === false && left.name === "__proto__") {
              return;
            }
            self2.if_(
              self2.and_(
                left.computed === false ? false : self2.noteqeqeq_(
                  "'__proto__'",
                  left.computed ? left.name : "'" + left.name + "'"
                ),
                self2.notNull(left.context),
                self2.or_(
                  self2.hasOwnProperty_(left.context, left.name, left.computed),
                  self2.isNull(
                    self2.member(left.context, left.name, left.computed)
                  )
                )
              ),
              function() {
                self2.recurse(ast.right, right);
                expression = self2.memberLeft(left.context, left.name, left.computed) + ast.operator + right;
                self2.assign(intoId, expression);
                recursionFn(intoId || expression);
              },
              // ELSE Branch: Blocked / Safe fallback
              function() {
                self2.assign(intoId, "undefined");
              }
            );
            self2.current().inAssignment = false;
            self2.current().inAssignment = true;
          },
          1
        );
        self2.current().inAssignment = false;
        break;
      case AST.ArrayExpression:
        args = [];
        forEach(ast.elements, function(expr) {
          self2.recurse(
            expr,
            ast.constant ? void 0 : self2.nextId(),
            void 0,
            function(argument) {
              args.push(argument);
            }
          );
        });
        expression = "[" + args.join(",") + "]";
        this.assign(intoId, expression);
        recursionFn(intoId || expression);
        break;
      case AST.ObjectExpression:
        args = [];
        computed = false;
        forEach(ast.properties, function(property) {
          if (property.computed) {
            computed = true;
          }
        });
        if (computed) {
          intoId = intoId || this.nextId();
          this.assign(intoId, "{}");
          forEach(ast.properties, function(property) {
            if (property.computed) {
              left = self2.nextId();
              self2.recurse(property.key, left);
            } else {
              if (property.key.type === "Literal" && property.key.value === "__proto__") {
                return;
              }
              if (property.key.type === "Identifier" && property.key.name === "__proto__") {
                return;
              }
              left = property.key.type === AST.Identifier ? property.key.name : "" + property.key.value;
            }
            right = self2.nextId();
            self2.recurse(property.value, right);
            self2.assign(
              self2.unsafeMember(intoId, left, property.computed),
              right
            );
          });
        } else {
          forEach(ast.properties, function(property) {
            if (property.key.name === "__proto__") {
              return;
            }
            self2.recurse(
              property.value,
              ast.constant ? void 0 : self2.nextId(),
              void 0,
              function(expr) {
                args.push(
                  self2.escape(
                    property.key.type === AST.Identifier ? property.key.name : "" + property.key.value
                  ) + ":" + expr
                );
              }
            );
          });
          expression = "{" + args.join(",") + "}";
          this.assign(intoId, expression);
        }
        recursionFn(intoId || expression);
        break;
      case AST.ThisExpression:
        this.assign(intoId, "s");
        self2.current().body.push("assertSafeValue(" + (intoId || "s") + ");");
        recursionFn(intoId || "s");
        break;
      case AST.LocalsExpression:
        this.assign(intoId, "l");
        self2.current().body.push("assertSafeValue(" + (intoId || "l") + ");");
        recursionFn(intoId || "l");
        break;
      case AST.NGValueParameter:
        this.assign(intoId, "v");
        recursionFn(intoId || "v");
        break;
    }
  },
  getHasOwnProperty: function(element, property) {
    var key = element + "." + property;
    var own = this.current().own;
    if (!hasOwn$1(own, key)) {
      own[key] = this.nextId(
        false,
        element + "&&(" + this.escape(property) + " in " + element + ")"
      );
    }
    return own[key];
  },
  assign: function(id, value) {
    if (!id) {
      return;
    }
    this.current().body.push(id, "=", value, ";");
    return id;
  },
  filter: function(filterName) {
    if (!hasOwn$1(this.state.filters, filterName)) {
      this.state.filters[filterName] = this.nextId(true);
    }
    return this.state.filters[filterName];
  },
  ifDefined: function(id, defaultValue) {
    return "ifDefined(" + id + "," + this.escape(defaultValue) + ")";
  },
  plus: function(left, right) {
    return "plus(" + left + "," + right + ")";
  },
  return_: function(id) {
    this.current().body.push("return ", id, ";");
  },
  if_: function(test, alternate, consequent) {
    if (test === true) {
      alternate();
    } else {
      var body = this.current().body;
      body.push("if(", test, "){");
      alternate();
      body.push("}");
      if (consequent) {
        body.push("else{");
        consequent();
        body.push("}");
      }
    }
  },
  or_: function() {
    var args = Array.prototype.slice.call(arguments);
    return "(" + args.join(") || (") + ")";
  },
  hasOwnProperty_: function(obj, prop, computed) {
    if (computed) {
      return "(hasOwn(" + obj + "," + prop + "))";
    }
    return "(hasOwn(" + obj + ",'" + prop + "'))";
  },
  and_: function() {
    var args = Array.prototype.slice.call(arguments);
    var myArgs = [];
    for (var i = 0, len = args.length; i < len; i++) {
      var arg = args[i];
      if (arg == false) {
        continue;
      }
      myArgs.push(arg);
    }
    return "(" + myArgs.join(") && (") + ")";
  },
  not: function(expression) {
    return "!(" + expression + ")";
  },
  isNull: function(expression) {
    return expression + "==null";
  },
  notNull: function(expression) {
    return expression + "!=null";
  },
  eqeqeq_: function(a2, b3) {
    return "(" + a2 + "===" + b3 + ")";
  },
  noteqeqeq_: function(a2, b3) {
    return "(" + a2 + "!==" + b3 + ")";
  },
  nonComputedMember: function(left, right) {
    var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
    var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
    var expr = "";
    if (SAFE_IDENTIFIER.test(right)) {
      expr = left + "." + right;
    } else {
      right = right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn);
      expr = left + '["' + right + '"]';
    }
    return expr;
  },
  unsafeComputedMember: function(left, right) {
    return left + "[" + right + "]";
  },
  unsafeNonComputedMember: function(left, right) {
    return this.nonComputedMember(left, right);
  },
  computedMember: function(left, right) {
    if (this.state.computing === "assign") {
      return this.unsafeComputedMember(left, right);
    }
    return "(hasOwn(" + left + "," + right + ") ? " + left + "[" + right + "] : undefined)";
  },
  unsafeMember: function(left, right, computed) {
    if (computed) {
      return this.unsafeComputedMember(left, right);
    }
    return this.unsafeNonComputedMember(left, right);
  },
  member: function(left, right, computed) {
    if (computed) {
      return this.computedMember(left, right);
    }
    return this.nonComputedMember(left, right);
  },
  memberLeft: function(left, right, computed) {
    if (!computed) {
      right = "'" + right + "'";
    }
    return left + "[" + right + "]";
  },
  getStringValue: function(item) {
    this.assign(item, "getStringValue(" + item + ")");
  },
  lazyRecurse: function(ast, intoId, nameId, recursionFn, create2) {
    var self2 = this;
    return function() {
      self2.recurse(ast, intoId, nameId, recursionFn, create2);
    };
  },
  lazyAssign: function(id, value) {
    var self2 = this;
    return function() {
      self2.assign(id, value);
    };
  },
  stringEscapeRegex: /[^ a-zA-Z0-9]/g,
  stringEscapeFn: function(c2) {
    return "\\u" + ("0000" + c2.charCodeAt(0).toString(16)).slice(-4);
  },
  escape: function(value) {
    if (isString(value)) {
      return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
    }
    if (isNumber(value)) {
      return value.toString();
    }
    if (value === true) {
      return "true";
    }
    if (value === false) {
      return "false";
    }
    if (value === null) {
      return "null";
    }
    if (typeof value === "undefined") {
      return "undefined";
    }
    throw $parseMinErr("esc", "IMPOSSIBLE");
  },
  nextId: function(skip, init2) {
    var id = "v" + this.state.nextId++;
    if (!skip) {
      this.current().vars.push(id + (init2 ? "=" + init2 : ""));
    }
    return id;
  },
  current: function() {
    return this.state[this.state.computing];
  }
};
function ASTInterpreter(astBuilder, $filter) {
  this.astBuilder = astBuilder;
  this.$filter = $filter;
}
function assertSafeValue(value) {
  var dangerousObjects = [
    globalThis,
    /* Eval is just used to say that this value should not be the result of an expression */
    /* eslint-disable-next-line no-eval */
    eval,
    setTimeout,
    setInterval,
    Object,
    Function
  ];
  var isDangerousObject = false;
  for (var i = 0; i < dangerousObjects.length; i++) {
    if (dangerousObjects[i] === value) {
      isDangerousObject = true;
    }
  }
  if (isDangerousObject) {
    throw new Error(
      "Security Error: Direct operations on the global scope are forbidden."
    );
  }
  if (typeof value === "string" && value.length > MAX_STRING_LENGTH) {
    throw new Error("string too long");
  }
}
ASTInterpreter.prototype = {
  compile: function(expression) {
    var self2 = this;
    var ast = this.astBuilder.ast(expression);
    findUndefinedFilters(ast, self2.$filter);
    var assignable;
    var assign;
    if (assignable = assignableAST(ast, this.astBuilder)) {
      assign = this.recurse(assignable);
    }
    var expressions = [];
    forEach(ast.body, function(expression2) {
      expressions.push(self2.recurse(expression2.expression));
    });
    var wrappedFn = ast.body.length === 0 ? noop$1 : ast.body.length === 1 ? expressions[0] : function(scope, locals) {
      var lastValue;
      forEach(expressions, function(exp) {
        lastValue = exp(scope, locals);
      });
      return lastValue;
    };
    if (assign) {
      wrappedFn.assign = function(scope, value, locals) {
        return assign(scope, locals, value);
      };
    }
    var fn = function(scope, locals) {
      return runWithFunctionConstructorProtection(function() {
        return wrappedFn(scope, locals);
      });
    };
    fn.assign = function(scope, value, locals) {
      return runWithFunctionConstructorProtection(function() {
        return wrappedFn.assign(scope, value, locals);
      });
    };
    fn.ast = ast;
    return fn;
  },
  recurse: function(ast, context, create2) {
    var left, right, self2 = this, args;
    this.astBuilder.guardSyntax(ast);
    switch (ast.type) {
      case AST.Literal:
        return this.value(ast.value, context);
      case AST.UnaryExpression:
        right = this.recurse(ast.argument);
        return this["unary" + ast.operator](right, context);
      case AST.BinaryExpression:
        left = this.recurse(ast.left);
        right = this.recurse(ast.right);
        return this["binary" + ast.operator](left, right, context);
      case AST.LogicalExpression:
        left = this.recurse(ast.left);
        right = this.recurse(ast.right);
        return this["binary" + ast.operator](left, right, context);
      case AST.ConditionalExpression:
        return this["ternary?:"](
          this.recurse(ast.test),
          this.recurse(ast.alternate),
          this.recurse(ast.consequent),
          context
        );
      case AST.Identifier:
        return self2.identifier(ast.name, context, create2);
      case AST.MemberExpression:
        left = this.recurse(ast.object, false, !!create2);
        assertSafeValue(left);
        if (!ast.computed) {
          right = ast.property.name;
        }
        if (ast.computed) {
          right = this.recurse(ast.property);
        }
        return ast.computed ? this.computedMember(left, right, context, create2) : this.nonComputedMember(left, right, context, create2);
      case AST.FilterExpression:
      case AST.CallExpression:
        args = [];
        forEach(ast.arguments, function(expr) {
          args.push(self2.recurse(expr));
        });
        if (!ast.filter) {
          right = this.recurse(ast.callee, true);
        }
        return ast.filter ? function(scope, locals, assign) {
          if (ast.filter) {
            right = self2.$filter(ast.callee.name);
          }
          var values = [];
          for (var i = 0; i < args.length; ++i) {
            values.push(args[i](scope, locals, assign));
          }
          var value = $apply$1(right, right, values);
          assertSafeValue(value);
          return context ? { context: void 0, name: void 0, value } : value;
        } : function(scope, locals, assign) {
          var rhs = right(scope, locals, assign);
          var value;
          if (rhs.value != null) {
            var values = [];
            for (var i = 0; i < args.length; ++i) {
              values.push(args[i](scope, locals, assign));
            }
            if (typeof rhs.value === "function") {
              value = $apply$1(
                rhs.value,
                rhs.context != null ? rhs.context : /* @__PURE__ */ Object.create(null),
                values
              );
              assertSafeValue(value);
            }
          }
          return context ? { value } : value;
        };
      case AST.AssignmentExpression:
        left = this.recurse(ast.left, true, 1);
        right = this.recurse(ast.right);
        return function(scope, locals, assign) {
          var lhs = left(scope, false, assign);
          var rhs = right(scope, locals, assign);
          if (lhs.context) {
            if (hasOwn$1(lhs.context, lhs.name) || lhs.context[lhs.name] == null) {
              lhs.context[lhs.name] = rhs;
            }
            return context ? { value: rhs } : rhs;
          }
          return null;
        };
      case AST.ArrayExpression:
        args = [];
        forEach(ast.elements, function(expr) {
          args.push(self2.recurse(expr));
        });
        return function(scope, locals, assign) {
          var value = [];
          for (var i = 0; i < args.length; ++i) {
            value.push(args[i](scope, locals, assign));
          }
          return context ? { value } : value;
        };
      case AST.ObjectExpression:
        args = [];
        forEach(ast.properties, function(property) {
          if (property.computed) {
            args.push({
              key: self2.recurse(property.key),
              computed: true,
              value: self2.recurse(property.value)
            });
          } else {
            args.push({
              key: property.key.type === AST.Identifier ? property.key.name : "" + property.key.value,
              computed: false,
              value: self2.recurse(property.value)
            });
          }
        });
        return function(scope, locals, assign) {
          var value = {};
          for (var i = 0; i < args.length; ++i) {
            var key;
            if (args[i].computed) {
              key = args[i].key(scope, locals, assign);
            } else {
              key = args[i].key;
            }
            if (key === "__proto__") {
              continue;
            }
            value[key] = args[i].value(scope, locals, assign);
          }
          return context ? { value } : value;
        };
      case AST.ThisExpression:
        return function(scope) {
          assertSafeValue(scope);
          return context ? { value: scope } : scope;
        };
      case AST.LocalsExpression:
        return function(scope, locals) {
          assertSafeValue(locals);
          return context ? { value: locals } : locals;
        };
      case AST.NGValueParameter:
        return function(scope, locals, assign) {
          return context ? { value: assign } : assign;
        };
    }
  },
  "unary+": function(argument, context) {
    return function(scope, locals, assign) {
      var arg = argument(scope, locals, assign);
      if (isDefined(arg)) {
        arg = +arg;
      } else {
        arg = 0;
      }
      return context ? { value: arg } : arg;
    };
  },
  "unary-": function(argument, context) {
    return function(scope, locals, assign) {
      var arg = argument(scope, locals, assign);
      if (isDefined(arg)) {
        arg = -arg;
      } else {
        arg = -0;
      }
      return context ? { value: arg } : arg;
    };
  },
  "unary!": function(argument, context) {
    return function(scope, locals, assign) {
      var arg = !argument(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary+": function(left, right, context) {
    return function(scope, locals, assign) {
      var lhs = left(scope, locals, assign);
      var rhs = right(scope, locals, assign);
      var arg = plusFn(lhs, rhs);
      return context ? { value: arg } : arg;
    };
  },
  "binary-": function(left, right, context) {
    return function(scope, locals, assign) {
      var lhs = left(scope, locals, assign);
      var rhs = right(scope, locals, assign);
      var arg = minusFn(lhs, rhs);
      return context ? { value: arg } : arg;
    };
  },
  "binary*": function(left, right, context) {
    return function(scope, locals, assign) {
      var lhs = left(scope, locals, assign);
      var rhs = right(scope, locals, assign);
      var arg = timesFn(lhs, rhs);
      return context ? { value: arg } : arg;
    };
  },
  "binary/": function(left, right, context) {
    return function(scope, locals, assign) {
      var lhs = left(scope, locals, assign);
      var rhs = right(scope, locals, assign);
      var arg = divideFn(lhs, rhs);
      return context ? { value: arg } : arg;
    };
  },
  "binary%": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = moduloFn(
        left(scope, locals, assign),
        right(scope, locals, assign)
      );
      return context ? { value: arg } : arg;
    };
  },
  "binary===": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) === right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary!==": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) !== right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary==": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) == right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary!=": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) != right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary<": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) < right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary>": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) > right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary<=": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) <= right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary>=": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) >= right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary&&": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) && right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary||": function(left, right, context) {
    return function(scope, locals, assign) {
      var arg = left(scope, locals, assign) || right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "binary??": function(left, right, context) {
    return function(scope, locals, assign) {
      var lhs = left(scope, locals, assign);
      var arg = lhs != null && typeof lhs !== "undefined" ? lhs : right(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  "ternary?:": function(test, alternate, consequent, context) {
    return function(scope, locals, assign) {
      var arg = test(scope, locals, assign) ? alternate(scope, locals, assign) : consequent(scope, locals, assign);
      return context ? { value: arg } : arg;
    };
  },
  value: function(value, context) {
    return function() {
      return context ? { context: void 0, name: void 0, value } : value;
    };
  },
  identifier: function(name, context, create2) {
    return function(scope, locals) {
      var base = locals && name in locals ? locals : scope;
      if (create2 && create2 !== 1 && base && base[name] == null) {
        base[name] = {};
      }
      var value;
      if (base && hasOwn$1(base, name)) {
        value = base[name];
      }
      assertSafeValue(value);
      if (context) {
        return { context: base, name, value };
      }
      return value;
    };
  },
  computedMember: function(left, right, context, create2) {
    return function(scope, locals, assign) {
      var lhs = left(scope, locals, assign);
      assertSafeValue(lhs);
      var rhs;
      var value;
      if (lhs != null) {
        rhs = right(scope, locals, assign);
        rhs = getStringValue(rhs);
        if (create2 && create2 !== 1) {
          if (lhs && !lhs[rhs]) {
            lhs[rhs] = {};
          }
        }
        if (hasOwn$1(lhs, rhs)) {
          value = lhs[rhs];
        }
      }
      assertSafeValue(value);
      if (context) {
        return { context: lhs, name: rhs, value };
      }
      return value;
    };
  },
  nonComputedMember: function(left, right, context, create2) {
    return function(scope, locals, assign) {
      var lhs = left(scope, locals, assign);
      assertSafeValue(lhs);
      if (create2 && create2 !== 1) {
        if (lhs && lhs[right] == null) {
          lhs[right] = {};
        }
      }
      var value = void 0;
      if (lhs != null && hasOwn$1(lhs, right)) {
        value = lhs[right];
      }
      assertSafeValue(value);
      if (context) {
        return { context: lhs, name: right, value };
      }
      return value;
    };
  }
};
var Parser$1 = function Parser(lexer, $filter, options) {
  this.lexer = lexer;
  this.$filter = $filter;
  options = options || {};
  options.handleThis = options.handleThis != null ? options.handleThis : true;
  this.options = options;
  this.ast = new AST(lexer, options);
  this.ast.selfReferential = {
    $locals: { type: AST.LocalsExpression }
  };
  if (options.handleThis) {
    this.ast.selfReferential.this = { type: AST.ThisExpression };
  }
  this.astCompiler = options.csp ? new ASTInterpreter(this.ast, $filter) : new ASTCompiler(this.ast, $filter);
};
Parser$1.prototype = {
  constructor: Parser$1,
  parse: function(text2) {
    return this.astCompiler.compile(text2);
  }
};
parse$1.Lexer = Lexer$1;
parse$1.Parser = Parser$1;
var parse = parse$1;
var filters = /* @__PURE__ */ Object.create(null);
var Lexer = parse.Lexer;
var Parser2 = parse.Parser;
var nativeSlice = Array.prototype.slice;
var nativeHasOwn = Object.prototype.hasOwnProperty;
var nativeCall = Function.prototype.call;
var nativeApply = Function.prototype.apply;
var hasOwn = nativeCall.bind(nativeCall, nativeHasOwn);
var $apply = nativeCall.bind(nativeCall, nativeApply);
var slice = nativeCall.bind(nativeCall, nativeSlice);
var defaultCacheLimit = 256;
function LruNode(key, value) {
  this.key = key;
  this.value = value;
  this.prev = null;
  this.next = null;
}
function isInteger(value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
}
function LruCache(limit) {
  if (!isInteger(limit) || limit < 0) {
    throw new Error("limit must be a non-negative integer");
  }
  this.limit = limit;
  this.size = 0;
  this.cache = /* @__PURE__ */ Object.create(null);
  this.head = null;
  this.tail = null;
}
LruCache.prototype._moveToHead = function(node) {
  if (node === this.head) {
    return;
  }
  if (node.prev) {
    node.prev.next = node.next;
  }
  if (node.next) {
    node.next.prev = node.prev;
  }
  if (node === this.tail) {
    this.tail = node.prev;
  }
  node.next = this.head;
  node.prev = null;
  if (this.head) {
    this.head.prev = node;
  }
  this.head = node;
  if (!this.tail) {
    this.tail = node;
  }
};
LruCache.prototype._removeTail = function() {
  if (!this.tail) {
    return null;
  }
  var oldTail = this.tail;
  if (this.tail.prev) {
    this.tail = this.tail.prev;
    this.tail.next = null;
  } else {
    this.head = null;
    this.tail = null;
  }
  return oldTail;
};
LruCache.prototype.get = function(key) {
  if (hasOwn(this.cache, key)) {
    var node = this.cache[key];
    this._moveToHead(node);
    return node.value;
  }
  return void 0;
};
LruCache.prototype.set = function(key, value) {
  if (hasOwn(this.cache, key)) {
    var node = this.cache[key];
    node.value = value;
    this._moveToHead(node);
  } else {
    var newNode = new LruNode(key, value);
    this.cache[key] = newNode;
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
    if (this.size > this.limit) {
      var evicted = this._removeTail();
      if (evicted) {
        delete this.cache[evicted.key];
        this.size--;
      }
    }
  }
};
LruCache.prototype.setMaxSize = function(newSize) {
  if (!isInteger(newSize) || newSize < 0) {
    throw new Error("limit must be a non-negative integer");
  }
  this.limit = newSize;
  while (this.size > this.limit) {
    var evicted = this._removeTail();
    if (evicted) {
      delete this.cache[evicted.key];
      this.size--;
    } else {
      break;
    }
  }
};
function addOptionDefaults(options) {
  options = options || /* @__PURE__ */ Object.create(null);
  options.filters = options.filters || filters;
  return options;
}
function getParserOptions(options) {
  return {
    handleThis: options.handleThis != null ? options.handleThis : true,
    csp: options.csp != null ? options.csp : false,
    disabledSyntaxes: options.disabledSyntaxes != null ? options.disabledSyntaxes : [],
    literals: options.literals != null ? options.literals : {
      true: true,
      false: false,
      null: null,
      undefined: void 0
    }
  };
}
function compile(src, options) {
  if (typeof src !== "string") {
    throw new TypeError(
      "src must be a string, instead saw '" + typeof src + "'"
    );
  }
  options = addOptionDefaults(options);
  var parserOptions = getParserOptions(options);
  var lexerOptions = Object.assign({}, options, parserOptions);
  var lexer = new Lexer(lexerOptions);
  var filters2 = /* @__PURE__ */ Object.create(null);
  if (options.filters) {
    var keys = Object.keys(options.filters);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      var value = options.filters[key];
      if (typeof value === "function") {
        filters2[key] = value;
      }
    }
  }
  function getFilter(name) {
    if (hasOwn(filters2, name)) {
      return filters2[name];
    }
  }
  var parser2 = new Parser2(lexer, getFilter, parserOptions);
  delete options.src;
  var allOptions = {};
  for (var k2 in options) {
    if (k2 === "cache" || k2 === "filters") {
      continue;
    }
    allOptions[k2] = options[k2];
  }
  var cacheKey = JSON.stringify(Object.assign({ src }, allOptions));
  var cache2 = compile.cache.get(cacheKey);
  if (!cache2) {
    var fn = parser2.parse(src);
    cache2 = {
      fn,
      parser: parser2
    };
    compile.cache.set(cacheKey, cache2);
  }
  function run() {
    cache2.parser.astCompiler.$filter = getFilter;
    var args = slice(arguments);
    return $apply(cache2.fn, /* @__PURE__ */ Object.create(null), args);
  }
  function runAssign() {
    cache2.parser.astCompiler.$filter = getFilter;
    var args = slice(arguments);
    return $apply(cache2.fn.assign, /* @__PURE__ */ Object.create(null), args);
  }
  run.ast = cache2.fn.ast;
  run.assign = runAssign;
  return run;
}
compile.cache = new LruCache(defaultCacheLimit);
main.Lexer = Lexer;
main.Parser = Parser2;
main.compile = compile;
main.filters = filters;
const Globals = {};
const instanceOfAny = (object, constructors) => constructors.some((c2) => object instanceof c2);
let idbProxyableTypes;
let cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const transactionDoneMap = /* @__PURE__ */ new WeakMap();
const transformCache = /* @__PURE__ */ new WeakMap();
const reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve2, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve2(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve2, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve2();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(this.request);
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db2) => {
    if (terminated)
      db2.addEventListener("close", () => terminated());
    if (blocking) {
      db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
const writeMethods = ["put", "add", "delete", "clear"];
const cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));
const advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
const methodMap = {};
const advanceResults = /* @__PURE__ */ new WeakMap();
const ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
const cursorIteratorTraps = {
  get(target, prop) {
    if (!advanceMethodProps.includes(prop))
      return target[prop];
    let cachedFunc = methodMap[prop];
    if (!cachedFunc) {
      cachedFunc = methodMap[prop] = function(...args) {
        advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
      };
    }
    return cachedFunc;
  }
};
async function* iterate(...args) {
  let cursor2 = this;
  if (!(cursor2 instanceof IDBCursor)) {
    cursor2 = await cursor2.openCursor(...args);
  }
  if (!cursor2)
    return;
  cursor2 = cursor2;
  const proxiedCursor = new Proxy(cursor2, cursorIteratorTraps);
  ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor2);
  reverseTransformCache.set(proxiedCursor, unwrap(cursor2));
  while (cursor2) {
    yield proxiedCursor;
    cursor2 = await (advanceResults.get(proxiedCursor) || cursor2.continue());
    advanceResults.delete(proxiedCursor);
  }
}
function isIteratorProp(target, prop) {
  return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get(target, prop, receiver) {
    if (isIteratorProp(target, prop))
      return iterate;
    return oldTraps.get(target, prop, receiver);
  },
  has(target, prop) {
    return isIteratorProp(target, prop) || oldTraps.has(target, prop);
  }
}));
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start2) {
  var b3 = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b3[i] = start2 += 1 << eb[i - 1];
  }
  var r = new i32(b3[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b3[i]; j < b3[i + 1]; ++j) {
      r[j] = j - b3[i] << 5 | i;
    }
  }
  return { b: b3, r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b.b, revfd = _b.r;
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
  var x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var hMap = function(cd, mb, r) {
  var s2 = cd.length;
  var i = 0;
  var l2 = new u16(mb);
  for (; i < s2; ++i) {
    if (cd[i])
      ++l2[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l2[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s2; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v2 = le[cd[i] - 1]++ << r_1;
        for (var m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2) {
          co[rev[v2] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s2);
    for (i = 0; i < s2; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
  flt[i] = 8;
for (var i = 144; i < 256; ++i)
  flt[i] = 9;
for (var i = 256; i < 280; ++i)
  flt[i] = 7;
for (var i = 280; i < 288; ++i)
  flt[i] = 8;
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
  fdt[i] = 5;
var flm = /* @__PURE__ */ hMap(flt, 9, 0), flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0), fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a2) {
  var m2 = a2[0];
  for (var i = 1; i < a2.length; ++i) {
    if (a2[i] > m2)
      m2 = a2[i];
  }
  return m2;
};
var bits = function(d2, p2, m2) {
  var o2 = p2 / 8 | 0;
  return (d2[o2] | d2[o2 + 1] << 8) >> (p2 & 7) & m2;
};
var bits16 = function(d2, p2) {
  var o2 = p2 / 8 | 0;
  return (d2[o2] | d2[o2 + 1] << 8 | d2[o2 + 2] << 16) >> (p2 & 7);
};
var shft = function(p2) {
  return (p2 + 7) / 8 | 0;
};
var slc = function(v2, s2, e2) {
  if (s2 == null || s2 < 0)
    s2 = 0;
  if (e2 == null || e2 > v2.length)
    e2 = v2.length;
  return new u8(v2.subarray(s2, e2));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e2 = new Error(msg || ec[ind]);
  e2.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e2, err);
  if (!nt)
    throw e2;
  return e2;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l3) {
    var bl = buf.length;
    if (l3 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l3));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s2 = shft(pos) + 4, l2 = dat[s2 - 4] | dat[s2 - 3] << 8, t2 = s2 + l2;
        if (t2 > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l2);
        buf.set(dat.subarray(s2, t2), bt);
        st.b = bt += l2, st.p = pos = t2 * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm2 = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm2[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s2 = r >> 4;
          if (s2 < 16) {
            ldt[i++] = s2;
          } else {
            var c2 = 0, n2 = 0;
            if (s2 == 16)
              n2 = 3 + bits(dat, pos, 3), pos += 2, c2 = ldt[i - 1];
            else if (s2 == 17)
              n2 = 3 + bits(dat, pos, 7), pos += 3;
            else if (s2 == 18)
              n2 = 11 + bits(dat, pos, 127), pos += 7;
            while (n2--)
              ldt[i++] = c2;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c2 = lm[bits16(dat, pos) & lms], sym = c2 >> 4;
      pos += c2 & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c2)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b3 = fleb[i];
          add = bits(dat, pos, (1 << b3) - 1) + fl[i];
          pos += b3;
        }
        var d2 = dm[bits16(dat, pos) & dms], dsym = d2 >> 4;
        if (!d2)
          err(3);
        pos += d2 & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b3 = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b3) - 1, pos += b3;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var wbits = function(d2, p2, v2) {
  v2 <<= p2 & 7;
  var o2 = p2 / 8 | 0;
  d2[o2] |= v2;
  d2[o2 + 1] |= v2 >> 8;
};
var wbits16 = function(d2, p2, v2) {
  v2 <<= p2 & 7;
  var o2 = p2 / 8 | 0;
  d2[o2] |= v2;
  d2[o2 + 1] |= v2 >> 8;
  d2[o2 + 2] |= v2 >> 16;
};
var hTree = function(d2, mb) {
  var t2 = [];
  for (var i = 0; i < d2.length; ++i) {
    if (d2[i])
      t2.push({ s: i, f: d2[i] });
  }
  var s2 = t2.length;
  var t22 = t2.slice();
  if (!s2)
    return { t: et, l: 0 };
  if (s2 == 1) {
    var v2 = new u8(t2[0].s + 1);
    v2[t2[0].s] = 1;
    return { t: v2, l: 1 };
  }
  t2.sort(function(a2, b3) {
    return a2.f - b3.f;
  });
  t2.push({ s: -1, f: 25001 });
  var l2 = t2[0], r = t2[1], i0 = 0, i1 = 1, i2 = 2;
  t2[0] = { s: -1, f: l2.f + r.f, l: l2, r };
  while (i1 != s2 - 1) {
    l2 = t2[t2[i0].f < t2[i2].f ? i0++ : i2++];
    r = t2[i0 != i1 && t2[i0].f < t2[i2].f ? i0++ : i2++];
    t2[i1++] = { s: -1, f: l2.f + r.f, l: l2, r };
  }
  var maxSym = t22[0].s;
  for (var i = 1; i < s2; ++i) {
    if (t22[i].s > maxSym)
      maxSym = t22[i].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t2[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t22.sort(function(a2, b3) {
      return tr[b3.s] - tr[a2.s] || a2.f - b3.f;
    });
    for (; i < s2; ++i) {
      var i2_1 = t22[i].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t22[i].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i;
    }
    for (; i >= 0 && dt; --i) {
      var i2_3 = t22[i].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n2, l2, d2) {
  return n2.s == -1 ? Math.max(ln(n2.l, l2, d2 + 1), ln(n2.r, l2, d2 + 1)) : l2[n2.s] = d2;
};
var lc = function(c2) {
  var s2 = c2.length;
  while (s2 && !c2[--s2])
    ;
  var cl = new u16(++s2);
  var cli = 0, cln = c2[0], cls = 1;
  var w2 = function(v2) {
    cl[cli++] = v2;
  };
  for (var i = 1; i <= s2; ++i) {
    if (c2[i] == cln && i != s2)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w2(32754);
        if (cls > 2) {
          w2(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w2(cln), --cls;
        for (; cls > 6; cls -= 6)
          w2(8304);
        if (cls > 2)
          w2(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w2(cln);
      cls = 1;
      cln = c2[i];
    }
  }
  return { c: cl.subarray(0, cli), n: s2 };
};
var clen = function(cf, cl) {
  var l2 = 0;
  for (var i = 0; i < cl.length; ++i)
    l2 += cf[i] * cl[i];
  return l2;
};
var wfblk = function(out, pos, dat) {
  var s2 = dat.length;
  var o2 = shft(pos + 2);
  out[o2] = s2 & 255;
  out[o2 + 1] = s2 >> 8;
  out[o2 + 2] = out[o2] ^ 255;
  out[o2 + 3] = out[o2 + 1] ^ 255;
  for (var i = 0; i < s2; ++i)
    out[o2 + i + 4] = dat[i];
  return (o2 + 4 + s2) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p2) {
  wbits(out, p2++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i = 0; i < lclt.length; ++i)
    ++lcfreq[lclt[i] & 31];
  for (var i = 0; i < lcdt.length; ++i)
    ++lcfreq[lcdt[i] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p2, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p2, 1 + (dtlen < ftlen)), p2 += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p2, nlc - 257);
    wbits(out, p2 + 5, ndc - 1);
    wbits(out, p2 + 10, nlcc - 4);
    p2 += 14;
    for (var i = 0; i < nlcc; ++i)
      wbits(out, p2 + 3 * i, lct[clim[i]]);
    p2 += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i = 0; i < clct.length; ++i) {
        var len = clct[i] & 31;
        wbits(out, p2, llm[len]), p2 += lct[len];
        if (len > 15)
          wbits(out, p2, clct[i] >> 5 & 127), p2 += clct[i] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i = 0; i < li; ++i) {
    var sym = syms[i];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p2, lm[len + 257]), p2 += ll[len + 257];
      if (len > 7)
        wbits(out, p2, sym >> 23 & 31), p2 += fleb[len];
      var dst = sym & 31;
      wbits16(out, p2, dm[dst]), p2 += dl[dst];
      if (dst > 3)
        wbits16(out, p2, sym >> 5 & 8191), p2 += fdeb[dst];
    } else {
      wbits16(out, p2, lm[sym]), p2 += ll[sym];
    }
  }
  wbits16(out, p2, lm[256]);
  return p2 + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st) {
  var s2 = st.z || dat.length;
  var o2 = new u8(pre + s2 + 5 * (1 + Math.ceil(s2 / 7e3)) + post);
  var w2 = o2.subarray(pre, o2.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w2[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n2 = opt >> 13, c2 = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i2) {
      return (dat[i2] ^ dat[i2 + 1] << bs1_1 ^ dat[i2 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i + 2 < s2; ++i) {
      var hv = hsh(i);
      var imod = i & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i) {
        var rem = s2 - i;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w2, 0, syms, lf, df, eb, li, bs, i - bs, pos);
          li = lc_1 = eb = 0, bs = i;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l2 = 2, d2 = 0, ch_1 = c2, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i - dif)) {
          var maxn = Math.min(n2, rem) - 1;
          var maxd = Math.min(32767, i);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i + l2] == dat[i + l2 - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                ;
              if (nl > l2) {
                l2 = nl, d2 = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d2) {
          syms[li++] = 268435456 | revfl[l2] << 18 | revfd[d2];
          var lin = revfl[l2] & 31, din = revfd[d2] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i + l2;
          ++lc_1;
        } else {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
      }
    }
    for (i = Math.max(i, wi); i < s2; ++i) {
      syms[li++] = dat[i];
      ++lf[dat[i]];
    }
    pos = wblk(dat, w2, lst, syms, lf, df, eb, li, bs, i - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w2[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i, st.w = wi;
    }
  } else {
    for (var i = st.w || 0; i < s2 + lst; i += 65535) {
      var e2 = i + 65535;
      if (e2 >= s2) {
        w2[pos / 8 | 0] = lst;
        e2 = s2;
      }
      pos = wfblk(w2, pos + 1, dat.subarray(i, e2));
    }
    st.i = s2;
  }
  return slc(o2, 0, pre + shft(pos) + post);
};
var crct = /* @__PURE__ */ function() {
  var t2 = new Int32Array(256);
  for (var i = 0; i < 256; ++i) {
    var c2 = i, k2 = 9;
    while (--k2)
      c2 = (c2 & 1 && -306674912) ^ c2 >>> 1;
    t2[i] = c2;
  }
  return t2;
}();
var crc = function() {
  var c2 = -1;
  return {
    p: function(d2) {
      var cr = c2;
      for (var i = 0; i < d2.length; ++i)
        cr = crct[cr & 255 ^ d2[i]] ^ cr >>> 8;
      c2 = cr;
    },
    d: function() {
      return ~c2;
    }
  };
};
var dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
};
var mrg = function(a2, b3) {
  var o2 = {};
  for (var k2 in a2)
    o2[k2] = a2[k2];
  for (var k2 in b3)
    o2[k2] = b3[k2];
  return o2;
};
var b2 = function(d2, b3) {
  return d2[b3] | d2[b3 + 1] << 8;
};
var b4 = function(d2, b3) {
  return (d2[b3] | d2[b3 + 1] << 8 | d2[b3 + 2] << 16 | d2[b3 + 3] << 24) >>> 0;
};
var b8 = function(d2, b3) {
  return b4(d2, b3) + b4(d2, b3 + 4) * 4294967296;
};
var wbytes = function(d2, b3, v2) {
  for (; v2; ++b3)
    d2[b3] = v2, v2 >>>= 8;
};
function deflateSync(data2, opts) {
  return dopt(data2, opts || {}, 0, 0);
}
function inflateSync(data2, opts) {
  return inflt(data2, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var fltn = function(d2, p2, t2, o2) {
  for (var k2 in d2) {
    var val = d2[k2], n2 = p2 + k2, op = o2;
    if (Array.isArray(val))
      op = mrg(o2, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t2[n2] = [val, op];
    else {
      t2[n2 += "/"] = [new u8(0), op];
      fltn(val, n2, t2, o2);
    }
  }
};
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e2) {
}
var dutf8 = function(d2) {
  for (var r = "", i = 0; ; ) {
    var c2 = d2[i++];
    var eb = (c2 > 127) + (c2 > 223) + (c2 > 239);
    if (i + eb > d2.length)
      return { s: r, r: slc(d2, i - 1) };
    if (!eb)
      r += String.fromCharCode(c2);
    else if (eb == 3) {
      c2 = ((c2 & 15) << 18 | (d2[i++] & 63) << 12 | (d2[i++] & 63) << 6 | d2[i++] & 63) - 65536, r += String.fromCharCode(55296 | c2 >> 10, 56320 | c2 & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c2 & 31) << 6 | d2[i++] & 63);
    else
      r += String.fromCharCode((c2 & 15) << 12 | (d2[i++] & 63) << 6 | d2[i++] & 63);
  }
};
function strToU8(str, latin1) {
  var i;
  if (te)
    return te.encode(str);
  var l2 = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w2 = function(v2) {
    ar[ai++] = v2;
  };
  for (var i = 0; i < l2; ++i) {
    if (ai + 5 > ar.length) {
      var n2 = new u8(ai + 8 + (l2 - i << 1));
      n2.set(ar);
      ar = n2;
    }
    var c2 = str.charCodeAt(i);
    if (c2 < 128 || latin1)
      w2(c2);
    else if (c2 < 2048)
      w2(192 | c2 >> 6), w2(128 | c2 & 63);
    else if (c2 > 55295 && c2 < 57344)
      c2 = 65536 + (c2 & 1023 << 10) | str.charCodeAt(++i) & 1023, w2(240 | c2 >> 18), w2(128 | c2 >> 12 & 63), w2(128 | c2 >> 6 & 63), w2(128 | c2 & 63);
    else
      w2(224 | c2 >> 12), w2(128 | c2 >> 6 & 63), w2(128 | c2 & 63);
  }
  return slc(ar, 0, ai);
}
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s2 = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s2;
  }
}
var slzh = function(d2, b3) {
  return b3 + 30 + b2(d2, b3 + 26) + b2(d2, b3 + 28);
};
var zh = function(d2, b3, z) {
  var fnl = b2(d2, b3 + 28), efl = b2(d2, b3 + 30), fn = strFromU8(d2.subarray(b3 + 46, b3 + 46 + fnl), !(b2(d2, b3 + 8) & 2048)), es = b3 + 46 + fnl;
  var _a2 = z64hs(d2, es, efl, z, b4(d2, b3 + 20), b4(d2, b3 + 24), b4(d2, b3 + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d2, b3 + 10), sc, su, fn, es + efl + b2(d2, b3 + 32), off];
};
var z64hs = function(d2, b3, l2, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e2 = b3 + l2;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b3 + 4 < e2; b3 += 4 + b2(d2, b3 + 2)) {
      if (b2(d2, b3) == 1) {
        return [
          nsc ? b8(d2, b3 + 4 + 8 * nsu) : sc,
          nsu ? b8(d2, b3 + 4) : su,
          noff ? b8(d2, b3 + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
var exfl = function(ex) {
  var le = 0;
  if (ex) {
    for (var k2 in ex) {
      var l2 = ex[k2].length;
      if (l2 > 65535)
        err(9);
      le += l2 + 4;
    }
  }
  return le;
};
var wzh = function(d2, b3, f2, fn, u2, c2, ce, co) {
  var fl2 = fn.length, ex = f2.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d2, b3, ce != null ? 33639248 : 67324752), b3 += 4;
  if (ce != null)
    d2[b3++] = 20, d2[b3++] = f2.os;
  d2[b3] = 20, b3 += 2;
  d2[b3++] = f2.flag << 1 | (c2 < 0 && 8), d2[b3++] = u2 && 8;
  d2[b3++] = f2.compression & 255, d2[b3++] = f2.compression >> 8;
  var dt = new Date(f2.mtime == null ? Date.now() : f2.mtime), y2 = dt.getFullYear() - 1980;
  if (y2 < 0 || y2 > 119)
    err(10);
  wbytes(d2, b3, y2 << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b3 += 4;
  if (c2 != -1) {
    wbytes(d2, b3, f2.crc);
    wbytes(d2, b3 + 4, c2 < 0 ? -c2 - 2 : c2);
    wbytes(d2, b3 + 8, f2.size);
  }
  wbytes(d2, b3 + 12, fl2);
  wbytes(d2, b3 + 14, exl), b3 += 16;
  if (ce != null) {
    wbytes(d2, b3, col);
    wbytes(d2, b3 + 6, f2.attrs);
    wbytes(d2, b3 + 10, ce), b3 += 14;
  }
  d2.set(fn, b3);
  b3 += fl2;
  if (exl) {
    for (var k2 in ex) {
      var exf = ex[k2], l2 = exf.length;
      wbytes(d2, b3, +k2);
      wbytes(d2, b3 + 2, l2);
      d2.set(exf, b3 + 4), b3 += 4 + l2;
    }
  }
  if (col)
    d2.set(co, b3), b3 += col;
  return b3;
};
var wzf = function(o2, b3, c2, d2, e2) {
  wbytes(o2, b3, 101010256);
  wbytes(o2, b3 + 8, c2);
  wbytes(o2, b3 + 10, c2);
  wbytes(o2, b3 + 12, d2);
  wbytes(o2, b3 + 16, e2);
};
function zipSync(data2, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data2, "", r, opts);
  var o2 = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p2 = _a2[1];
    var compression = p2.level == 0 ? 0 : 8;
    var f2 = strToU8(fn), s2 = f2.length;
    var com = p2.comment, m2 = com && strToU8(com), ms = m2 && m2.length;
    var exl = exfl(p2.extra);
    if (s2 > 65535)
      err(11);
    var d2 = compression ? deflateSync(file, p2) : file, l2 = d2.length;
    var c2 = crc();
    c2.p(file);
    files.push(mrg(p2, {
      size: file.length,
      crc: c2.d(),
      c: d2,
      f: f2,
      m: m2,
      u: s2 != fn.length || m2 && com.length != ms,
      o: o2,
      compression
    }));
    o2 += 30 + s2 + exl + l2;
    tot += 76 + 2 * (s2 + exl) + (ms || 0) + l2;
  }
  var out = new u8(tot + 22), oe = o2, cdl = tot - o2;
  for (var i = 0; i < files.length; ++i) {
    var f2 = files[i];
    wzh(out, f2.o, f2, f2.f, f2.u, f2.c.length);
    var badd = 30 + f2.f.length + exfl(f2.extra);
    out.set(f2.c, f2.o + badd);
    wzh(out, o2, f2, f2.f, f2.u, f2.c.length, f2.o, f2.m), o2 += 16 + badd + (f2.m ? f2.m.length : 0);
  }
  wzf(out, o2, files.length, cdl, oe);
  return out;
}
function unzipSync(data2, opts) {
  var files = {};
  var e2 = data2.length - 22;
  for (; b4(data2, e2) != 101010256; --e2) {
    if (!e2 || data2.length - e2 > 65558)
      err(13);
  }
  var c2 = b2(data2, e2 + 8);
  if (!c2)
    return {};
  var o2 = b4(data2, e2 + 16);
  var z = b4(data2, e2 - 20) == 117853008;
  if (z) {
    var ze = b4(data2, e2 - 12);
    z = b4(data2, ze) == 101075792;
    if (z) {
      c2 = b4(data2, ze + 32);
      o2 = b4(data2, ze + 48);
    }
  }
  for (var i = 0; i < c2; ++i) {
    var _a2 = zh(data2, o2, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b3 = slzh(data2, off);
    o2 = no;
    {
      if (!c_2)
        files[fn] = slc(data2, b3, b3 + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data2.subarray(b3, b3 + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}
const e$1 = (() => {
  if ("undefined" == typeof self) return false;
  if ("top" in self && self !== top) try {
    top.window.document._ = 0;
  } catch (e2) {
    return false;
  }
  return "showOpenFilePicker" in self;
})(), t$1 = e$1 ? Promise.resolve().then(function() {
  return l;
}) : Promise.resolve().then(function() {
  return v;
});
async function n(...e2) {
  return (await t$1).default(...e2);
}
e$1 ? Promise.resolve().then(function() {
  return y;
}) : Promise.resolve().then(function() {
  return b;
});
const a = e$1 ? Promise.resolve().then(function() {
  return m;
}) : Promise.resolve().then(function() {
  return k;
});
async function o$1(...e2) {
  return (await a).default(...e2);
}
const s = async (e2) => {
  const t2 = await e2.getFile();
  return t2.handle = e2, t2;
};
var c = async (e2 = [{}]) => {
  Array.isArray(e2) || (e2 = [e2]);
  const t2 = [];
  e2.forEach((e3, n3) => {
    t2[n3] = { description: e3.description || "Files", accept: {} }, e3.mimeTypes ? e3.mimeTypes.map((r2) => {
      t2[n3].accept[r2] = e3.extensions || [];
    }) : t2[n3].accept["*/*"] = e3.extensions || [];
  });
  const n2 = await window.showOpenFilePicker({ id: e2[0].id, startIn: e2[0].startIn, types: t2, multiple: e2[0].multiple || false, excludeAcceptAllOption: e2[0].excludeAcceptAllOption || false }), r = await Promise.all(n2.map(s));
  return e2[0].multiple ? r : r[0];
}, l = { __proto__: null, default: c };
function u(e2) {
  function t2(e3) {
    if (Object(e3) !== e3) return Promise.reject(new TypeError(e3 + " is not an object."));
    var t3 = e3.done;
    return Promise.resolve(e3.value).then(function(e4) {
      return { value: e4, done: t3 };
    });
  }
  return u = function(e3) {
    this.s = e3, this.n = e3.next;
  }, u.prototype = { s: null, n: null, next: function() {
    return t2(this.n.apply(this.s, arguments));
  }, return: function(e3) {
    var n2 = this.s.return;
    return void 0 === n2 ? Promise.resolve({ value: e3, done: true }) : t2(n2.apply(this.s, arguments));
  }, throw: function(e3) {
    var n2 = this.s.return;
    return void 0 === n2 ? Promise.reject(e3) : t2(n2.apply(this.s, arguments));
  } }, new u(e2);
}
const p = async (e2, t2, n2 = e2.name, r) => {
  const i = [], a2 = [];
  var o2, s2 = false, c2 = false;
  try {
    for (var l2, d2 = function(e3) {
      var t3, n3, r2, i2 = 2;
      for ("undefined" != typeof Symbol && (n3 = Symbol.asyncIterator, r2 = Symbol.iterator); i2--; ) {
        if (n3 && null != (t3 = e3[n3])) return t3.call(e3);
        if (r2 && null != (t3 = e3[r2])) return new u(t3.call(e3));
        n3 = "@@asyncIterator", r2 = "@@iterator";
      }
      throw new TypeError("Object is not async iterable");
    }(e2.values()); s2 = !(l2 = await d2.next()).done; s2 = false) {
      const o3 = l2.value, s3 = `${n2}/${o3.name}`;
      "file" === o3.kind ? a2.push(o3.getFile().then((t3) => (t3.directoryHandle = e2, t3.handle = o3, Object.defineProperty(t3, "webkitRelativePath", { configurable: true, enumerable: true, get: () => s3 })))) : "directory" !== o3.kind || !t2 || r && r(o3) || i.push(p(o3, t2, s3, r));
    }
  } catch (e3) {
    c2 = true, o2 = e3;
  } finally {
    try {
      s2 && null != d2.return && await d2.return();
    } finally {
      if (c2) throw o2;
    }
  }
  return [...(await Promise.all(i)).flat(), ...await Promise.all(a2)];
};
var d = async (e2 = {}) => {
  e2.recursive = e2.recursive || false, e2.mode = e2.mode || "read";
  const t2 = await window.showDirectoryPicker({ id: e2.id, startIn: e2.startIn, mode: e2.mode });
  return (await (await t2.values()).next()).done ? [t2] : p(t2, e2.recursive, void 0, e2.skipDirectory);
}, y = { __proto__: null, default: d }, f = async (e2, t2 = [{}], n2 = null, r = false, i = null) => {
  Array.isArray(t2) || (t2 = [t2]), t2[0].fileName = t2[0].fileName || "Untitled";
  const a2 = [];
  let o2 = null;
  if (e2 instanceof Blob && e2.type ? o2 = e2.type : e2.headers && e2.headers.get("content-type") && (o2 = e2.headers.get("content-type")), t2.forEach((e3, t3) => {
    a2[t3] = { description: e3.description || "Files", accept: {} }, e3.mimeTypes ? (0 === t3 && o2 && e3.mimeTypes.push(o2), e3.mimeTypes.map((n3) => {
      a2[t3].accept[n3] = e3.extensions || [];
    })) : o2 ? a2[t3].accept[o2] = e3.extensions || [] : a2[t3].accept["*/*"] = e3.extensions || [];
  }), n2) try {
    await n2.getFile();
  } catch (e3) {
    if (n2 = null, r) throw e3;
  }
  const s2 = n2 || await window.showSaveFilePicker({ suggestedName: t2[0].fileName, id: t2[0].id, startIn: t2[0].startIn, types: a2, excludeAcceptAllOption: t2[0].excludeAcceptAllOption || false });
  !n2 && i && i(s2);
  const c2 = await s2.createWritable();
  if ("stream" in e2) {
    const t3 = e2.stream();
    return await t3.pipeTo(c2), s2;
  }
  return "body" in e2 ? (await e2.body.pipeTo(c2), s2) : (await c2.write(await e2), await c2.close(), s2);
}, m = { __proto__: null, default: f }, w = async (e2 = [{}]) => (Array.isArray(e2) || (e2 = [e2]), new Promise((t2, n2) => {
  const r = document.createElement("input");
  r.type = "file";
  const i = [...e2.map((e3) => e3.mimeTypes || []), ...e2.map((e3) => e3.extensions || [])].join();
  r.multiple = e2[0].multiple || false, r.accept = i || "", r.style.display = "none", document.body.append(r);
  const a2 = (e3) => {
    "function" == typeof o2 && o2(), t2(e3);
  }, o2 = e2[0].legacySetup && e2[0].legacySetup(a2, () => o2(n2), r), s2 = () => {
    window.removeEventListener("focus", s2), r.remove();
  };
  r.addEventListener("click", () => {
    window.addEventListener("focus", s2);
  }), r.addEventListener("change", () => {
    window.removeEventListener("focus", s2), r.remove(), a2(r.multiple ? Array.from(r.files) : r.files[0]);
  }), "showPicker" in HTMLInputElement.prototype ? r.showPicker() : r.click();
})), v = { __proto__: null, default: w }, h = async (e2 = [{}]) => (Array.isArray(e2) || (e2 = [e2]), e2[0].recursive = e2[0].recursive || false, new Promise((t2, n2) => {
  const r = document.createElement("input");
  r.type = "file", r.webkitdirectory = true;
  const i = (e3) => {
    "function" == typeof a2 && a2(), t2(e3);
  }, a2 = e2[0].legacySetup && e2[0].legacySetup(i, () => a2(n2), r);
  r.addEventListener("change", () => {
    let t3 = Array.from(r.files);
    e2[0].recursive ? e2[0].recursive && e2[0].skipDirectory && (t3 = t3.filter((t4) => t4.webkitRelativePath.split("/").every((t5) => !e2[0].skipDirectory({ name: t5, kind: "directory" })))) : t3 = t3.filter((e3) => 2 === e3.webkitRelativePath.split("/").length), i(t3);
  }), "showPicker" in HTMLInputElement.prototype ? r.showPicker() : r.click();
})), b = { __proto__: null, default: h }, P = async (e2, t2 = {}) => {
  Array.isArray(t2) && (t2 = t2[0]);
  const n2 = document.createElement("a");
  let r = e2;
  "body" in e2 && (r = await async function(e3, t3) {
    const n3 = e3.getReader(), r2 = new ReadableStream({ start: (e4) => async function t4() {
      return n3.read().then(({ done: n4, value: r3 }) => {
        if (!n4) return e4.enqueue(r3), t4();
        e4.close();
      });
    }() }), i2 = new Response(r2), a3 = await i2.blob();
    return n3.releaseLock(), new Blob([a3], { type: t3 });
  }(e2.body, e2.headers.get("content-type"))), n2.download = t2.fileName || "Untitled", n2.href = URL.createObjectURL(await r);
  const i = () => {
    "function" == typeof a2 && a2();
  }, a2 = t2.legacySetup && t2.legacySetup(i, () => a2(), n2);
  return n2.addEventListener("click", () => {
    setTimeout(() => URL.revokeObjectURL(n2.href), 3e4), i();
  }), n2.click(), null;
}, k = { __proto__: null, default: P };
class DB {
  constructor() {
    this.dbPromise = openDB("os-dpi", 6, {
      async upgrade(db2, oldVersion, _newVersion, transaction) {
        if (oldVersion < 6) {
          let logStore = db2.createObjectStore("logstore", {
            keyPath: "id",
            autoIncrement: true
          });
          logStore.createIndex("by-name", "name");
        }
        if (oldVersion < 5) {
          let store5 = db2.createObjectStore("store5", {
            keyPath: ["name", "type"]
          });
          store5.createIndex("by-name", "name");
          if (oldVersion == 4) {
            const store4 = transaction.objectStore("store");
            for await (const cursor2 of store4) {
              const record4 = cursor2.value;
              store5.put(record4);
            }
            db2.deleteObjectStore("store");
            transaction.objectStore("url").createIndex("by-etag", "etag");
          } else if (oldVersion < 4) {
            db2.createObjectStore("media");
            let savedStore = db2.createObjectStore("saved", {
              keyPath: "name"
            });
            savedStore.createIndex("by-etag", "etag");
            const urlStore = db2.createObjectStore("url", {
              keyPath: "url"
            });
            urlStore.createIndex("by-etag", "etag");
          }
        }
      },
      blocked(currentVersion, blockedVersion, event) {
        console.log("blocked", { currentVersion, blockedVersion, event });
      },
      blocking(_currentVersion, _blockedVersion, _event) {
        window.location.reload();
      },
      terminated() {
        console.log("terminated");
      }
    });
    this.updateListeners = [];
    this.designName = "";
    this.fileName = "";
    this.fileHandle = null;
    this.fileVersion = 0;
    this.fileUid = "";
  }
  /** set the name for the current design
   * @param {string} name
   */
  setDesignName(name) {
    this.designName = name;
    document.title = name;
  }
  /** rename the design
   * @param {string} newName
   */
  async renameDesign(newName) {
    const db2 = await this.dbPromise;
    newName = await this.uniqueName(newName);
    const tx = db2.transaction(["store5", "media", "saved"], "readwrite");
    const index = tx.objectStore("store5").index("by-name");
    for await (const cursor3 of index.iterate(this.designName)) {
      const record = { ...cursor3.value, name: newName };
      cursor3.delete();
      tx.objectStore("store5").put(record);
    }
    const mst = tx.objectStore("media");
    for await (const cursor3 of mst.iterate()) {
      if (cursor3 && cursor3.key[0] == this.designName) {
        const record = { ...cursor3.value };
        const key = cursor3.key;
        cursor3.delete();
        key[0] = newName;
        mst.put(record, key);
      }
    }
    const cursor2 = await tx.objectStore("saved").openCursor(this.designName);
    if (cursor2) {
      cursor2.delete();
    }
    await tx.done;
    this.fileHandle = null;
    this.fileName = "";
    this.notify({ action: "rename", name: this.designName, newName });
    this.designName = newName;
  }
  /**
   * return list of names of designs in the db
   * @returns {Promise<string[]>}
   */
  async names() {
    const db2 = await this.dbPromise;
    const keys = await db2.getAllKeysFromIndex("store5", "by-name");
    const result = [...new Set(keys.map((key) => key.valueOf()[0]))];
    return result;
  }
  /**
   * return list of names of saved designs in the db
   * @returns {Promise<string[]>}
   */
  async saved() {
    const db2 = await this.dbPromise;
    const result = [];
    for (const key of await db2.getAllKeys("saved")) {
      result.push(key.toString());
    }
    return result;
  }
  /**
   * Create a unique name for new design
   * @param {string} name - the desired name
   * @returns {Promise<string>}
   */
  async uniqueName(name = "new") {
    name = name.replace(/\.osdpi$|\.zip$/, "");
    name = name.replace(/-\d+$/, "") || name;
    name = name.replaceAll(/[^a-zA-Z0-9]/g, "_");
    name = name.replaceAll(/_+/g, "_");
    name = name.replace(/_+$/, "");
    name = name.replace(/^_+/, "");
    name = name || "noname";
    const allNames = await this.names();
    if (allNames.indexOf(name) < 0) return name;
    const base = name;
    for (let i = 1; ; i++) {
      const name2 = `${base}-${i}`;
      if (allNames.indexOf(name2) < 0) return name2;
    }
  }
  /** Return the record for type or the defaultValue
   * @param {string} type
   * @param {any} defaultValue
   * @returns {Promise<Object>}
   */
  async read(type, defaultValue = {}) {
    const db2 = await this.dbPromise;
    const record = await db2.get("store5", [this.designName, type]);
    let data2 = record ? record.data : defaultValue;
    data2 = JSON.parse(
      JSON.stringify(data2, (_key, value) => {
        if (typeof value === "string") {
          return value.normalize("NFC");
        }
        return value;
      })
    );
    return data2;
  }
  /**
   * Read log records
   *
   * @returns {Promise<Object[]>}
   */
  async readLog() {
    const db2 = await this.dbPromise;
    const index = db2.transaction("logstore", "readonly").store.index("by-name");
    const key = this.designName;
    const result = [];
    for await (const cursor2 of index.iterate(key)) {
      const data2 = cursor2.value.data;
      result.push(data2);
    }
    return result;
  }
  /** Write a design record
   * @param {string} type
   * @param {Object} data
   */
  async write(type, data2) {
    const db2 = await this.dbPromise;
    data2 = JSON.parse(
      JSON.stringify(data2, (_key, value) => {
        if (typeof value === "string") {
          return value.normalize("NFC");
        }
        return value;
      })
    );
    const tx = db2.transaction(["store5", "saved"], "readwrite");
    await tx.objectStore("saved").delete(this.designName);
    const store = tx.objectStore("store5");
    await store.put({ name: this.designName, type, data: data2 });
    await tx.done;
    this.notify({ action: "update", name: this.designName });
  }
  /** Write a log record
   * @param {Object} data
   */
  async writeLog(data2) {
    const db2 = await this.dbPromise;
    const tx = db2.transaction(["logstore"], "readwrite");
    tx.objectStore("logstore").put({ name: this.designName, data: data2 });
    await tx.done;
  }
  /**
   * delete records of this type
   *
   * @param {string} type
   * @returns {Promise<void>}
   */
  async clear(type) {
    const db2 = await this.dbPromise;
    return db2.delete("store5", [this.designName, type]);
  }
  /**
   * delete log records
   *
   * @returns {Promise<void>}
   */
  async clearLog() {
    const db2 = await this.dbPromise;
    const tx = db2.transaction("logstore", "readwrite");
    const index = tx.store.index("by-name");
    for await (const cursor2 of index.iterate(this.designName)) {
      cursor2.delete();
    }
    await tx.done;
  }
  /** Read a design from a local file
   * @param {import("browser-fs-access").FileWithHandle} file
   */
  async readDesignFromFile(file) {
    this.fileHandle = file.handle;
    return this.readDesignFromBlob(file, file.name);
  }
  /** Read a design from a URL
   * @param {string} url
   * @param {string} [name]
   * @returns {Promise<boolean>}
   */
  async readDesignFromURL(url, name = "") {
    if (!url) return false;
    let design_url = url;
    let response;
    const db2 = await this.dbPromise;
    if (!url.startsWith("http")) {
      response = await fetch(url);
    } else {
      if (!url.match(/.*\.(osdpi|zip)$/)) {
        response = await fetch("https://gb.cs.unc.edu/cors/", {
          headers: { "Target-URL": url }
        });
        if (!response.ok) {
          throw new Error(
            `Fetching the URL (${url}) failed: ${response.status}`
          );
        }
        const html2 = await response.text();
        const parser2 = new DOMParser();
        const doc = parser2.parseFromString(html2, "text/html");
        const link = doc.querySelector(`a[href$="${name}.zip"]`) || doc.querySelector(`a[href$="${name}.osdpi"]`);
        if (link instanceof HTMLAnchorElement) {
          design_url = link.href;
        } else {
          throw new Error(`Invalid URL ${url}`);
        }
      }
      const urlRecord = await db2.get("url", design_url);
      const headers = {};
      if (urlRecord) {
        const etag2 = urlRecord.etag;
        const savedKey = await db2.getKeyFromIndex("saved", "by-etag", etag2);
        if (savedKey) {
          headers["If-None-Match"] = etag2;
          name = savedKey.toString();
        }
      }
      headers["Target-URL"] = design_url;
      response = await fetch("https://gb.cs.unc.edu/cors/", { headers });
    }
    if (response.status == 304) {
      this.designName = name;
      return false;
    }
    if (!response.ok) {
      throw new Error(`Fetching the URL (${url}) failed: ${response.status}`);
    }
    const etag = response.headers.get("ETag") || "";
    await db2.put("url", { url: design_url, page_url: url, etag });
    if (!name) {
      const urlParts = new URL(design_url, window.location.origin);
      const pathParts = urlParts.pathname.split("/");
      if (pathParts.length > 0 && (pathParts[pathParts.length - 1].endsWith(".osdpi") || pathParts[pathParts.length - 1].endsWith(".zip"))) {
        name = pathParts[pathParts.length - 1];
      } else {
        throw new Error(`Design files should have .osdpi suffix`);
      }
    }
    const blob = await response.blob();
    return this.readDesignFromBlob(blob, name, etag);
  }
  /** Return the URL (if any) this design was imported from
   * @returns {Promise<string>}
   */
  async getDesignURL() {
    const db2 = await this.dbPromise;
    const name = this.designName;
    const savedRecord = await db2.get("saved", name);
    if (savedRecord && savedRecord.etag && savedRecord.etag != "none") {
      const etag = savedRecord.etag;
      const urlRecord = await db2.getFromIndex("url", "by-etag", etag);
      if (urlRecord) {
        const url = urlRecord.page_url;
        return url;
      }
    }
    return "";
  }
  /**
   * Reload the design from a URL if and only if:
   * 1. It was loaded from a URL
   * 2. It has not been edited
   * 3. The ETag has changed
   */
  async reloadDesignFromOriginalURL() {
    const url = await this.getDesignURL();
    if (url) {
      if (await this.readDesignFromURL(url)) {
        Globals.restart();
      }
    }
  }
  /** Read design from the blob
   * @param {Blob} blob
   * @param {string} filename
   * @param {string} etag
   * @returns {Promise<boolean>}
   */
  async readDesignFromBlob(blob, filename, etag = "") {
    const db2 = await this.dbPromise;
    this.fileName = filename;
    let name = this.fileName;
    if (!etag) {
      name = await this.uniqueName(name);
    } else {
      name = name.replace(/\.(zip|osdpi)$/, "");
    }
    this.designName = name;
    const design = await unPackDesign(blob);
    for (const [key, value] of Object.entries(design)) {
      if (key == "media" && design.media) {
        for (const media of design.media) {
          await this.addMedia(media.content, media.name);
        }
      } else {
        await this.write(key, value);
      }
    }
    await db2.put("saved", { name: this.designName, etag });
    this.notify({ action: "update", name: this.designName });
    return true;
  }
  // do this part async to avoid file picker timeout
  /**
   * Converts the current design data into a Blob object containing a zipped archive.
   * The archive includes layout, actions, content, method, pattern, cues, and associated media files.
   *
   * @async
   * @function convertDesignToBlob
   * @returns {Promise<Blob>} A Promise that resolves with a Blob object representing the zipped design data.
   * @throws {Error} Will throw an error if database operations fail or if zipping encounters an issue.
   */
  async convertDesignToBlob() {
    const db2 = await this.dbPromise;
    const layout = Globals.layout.toObject();
    const actions = Globals.actions.toObject();
    const content = await this.read("content");
    const method = Globals.methods.toObject();
    const pattern = Globals.patterns.toObject();
    const cues = Globals.cues.toObject();
    const zipargs = {
      "layout.json": strToU8(JSON.stringify(layout)),
      "actions.json": strToU8(JSON.stringify(actions)),
      "content.json": strToU8(JSON.stringify(content)),
      "method.json": strToU8(JSON.stringify(method)),
      "pattern.json": strToU8(JSON.stringify(pattern)),
      "cues.json": strToU8(JSON.stringify(cues))
    };
    const mediaKeys = (await db2.getAllKeys("media")).filter(
      (pair) => Object.values(pair).includes(this.designName)
    );
    for (const key of mediaKeys) {
      const record = await db2.get("media", key);
      if (record) {
        const contentBuf = await record.content.arrayBuffer();
        const contentArray = new Uint8Array(contentBuf);
        zipargs[key[1]] = contentArray;
      }
    }
    const zip = zipSync(zipargs);
    const blob = new Blob([zip], { type: "application/octet-stream" });
    return blob;
  }
  /**
   * Saves the current design as a .osdpi or .zip file using the fileSave library.
   * The design is first converted into a Blob object containing a zipped archive,
   * then saved to the user's file system.  Also saves the design name in the "saved" table of the db.
   *
   * @async
   * @function saveDesign
   * @returns {Promise<void>} A Promise that resolves when the design is successfully saved.
   * @throws {Error} Logs an error to the console if the export fails.
   */
  async saveDesign() {
    const db2 = await this.dbPromise;
    const options = {
      fileName: this.fileName || this.designName + ".osdpi",
      extensions: [".osdpi", ".zip"],
      id: "osdpi"
    };
    try {
      await o$1(this.convertDesignToBlob(), options, this.fileHandle);
      await db2.put("saved", { name: this.designName });
    } catch (error) {
      console.error("Export failed");
      console.error(error);
    }
  }
  /** Unload a design from the database
   * @param {string} name - the name of the design to delete
   */
  async unload(name) {
    const db2 = await this.dbPromise;
    const tx = db2.transaction("store5", "readwrite");
    const index = tx.store.index("by-name");
    for await (const cursor2 of index.iterate(name)) {
      cursor2.delete();
    }
    await tx.done;
    const txm = db2.transaction("media", "readwrite");
    const mediaKeys = (await txm.store.getAllKeys()).filter(
      (pair) => Object.values(pair)[0] == name
    );
    for (const key of mediaKeys) {
      await txm.store.delete(key);
    }
    await txm.done;
    await db2.delete("saved", name);
    this.notify({ action: "unload", name });
  }
  /** Return an image from the database
   * @param {string} name
   * @returns {Promise<HTMLImageElement>}
   */
  async getImage(name) {
    const db2 = await this.dbPromise;
    const record = await db2.get("media", [this.designName, name]);
    const img = new Image();
    if (record) {
      img.src = URL.createObjectURL(record.content);
    }
    img.title = record.name;
    return img;
  }
  /** Return an image blob from the database
   * @param {string} name
   * @returns {Promise<Blob>}
   */
  async getImageBlob(name) {
    const db2 = await this.dbPromise;
    const record = await db2.get("media", [this.designName, name]);
    return record.content;
  }
  /** Return an audio file from the database
   * @param {string} name
   * @returns {Promise<HTMLAudioElement>}
   */
  async getAudio(name) {
    const db2 = await this.dbPromise;
    const record = await db2.get("media", [this.designName, name]);
    const audio = new Audio();
    if (record) {
      audio.src = URL.createObjectURL(record.content);
    }
    return audio;
  }
  /** Return an image URL from the database
   * @param {string} name
   * @returns {Promise<string>}
   */
  async getMediaURL(name) {
    const db2 = await this.dbPromise;
    name = name.normalize("NFC");
    const record = await db2.get("media", [this.designName, name]);
    if (record) return URL.createObjectURL(record.content);
    else return "";
  }
  /** Add media to the database
   * @param {Blob} blob
   * @param {string} name
   */
  async addMedia(blob, name) {
    const db2 = await this.dbPromise;
    name = name.normalize("NFC");
    return await db2.put(
      "media",
      {
        name,
        content: blob
      },
      [this.designName, name]
    );
  }
  /** List media entries from a given store
   * @returns {Promise<string[]>}
   * */
  async listMedia() {
    const db2 = await this.dbPromise;
    const keys = (await db2.getAllKeys("media")).filter(
      (key) => key[0] == this.designName
      //only show resources from this design
    );
    const result = [];
    for (const key of keys) {
      result.push(key[1].toString());
    }
    return result;
  }
  /** delete media files
   * @param {string[]} names
   */
  async deleteMedia(...names) {
    const db2 = await this.dbPromise;
    const tx = db2.transaction(["media", "saved"], "readwrite");
    const mst = tx.objectStore("media");
    for await (const cursor3 of mst.iterate()) {
      if (cursor3 && cursor3.key[0] == this.designName && names.includes(cursor3.key[1])) {
        cursor3.delete();
      }
    }
    const cursor2 = await tx.objectStore("saved").openCursor(this.designName);
    if (cursor2) {
      cursor2.delete();
    }
    await tx.done;
  }
  /** Listen for database update
   * @param {(message: UpdateNotification) =>void} callback
   */
  addUpdateListener(callback) {
    this.updateListeners.push(callback);
  }
  /** Notify listeners of database update
   * @param {UpdateNotification} message
   */
  notify(message) {
    for (const listener of this.updateListeners) {
      listener(message);
    }
  }
}
const db = new DB();
function readAsArrayBuffer(blob) {
  return new Promise((resolve2) => {
    const fr = new FileReader();
    fr.onloadend = () => fr.result instanceof ArrayBuffer && resolve2(fr.result);
    fr.readAsArrayBuffer(blob);
  });
}
async function unPackDesign(blob) {
  const zippedBuf = await readAsArrayBuffer(blob);
  const zippedArray = new Uint8Array(zippedBuf);
  const unzipped = unzipSync(zippedArray);
  const result = {};
  const media = [];
  for (const fname in unzipped) {
    const mimetype = mime(fname) || "application/octet-stream";
    if (mimetype == "application/json") {
      const text2 = strFromU8(unzipped[fname]);
      let obj = {};
      try {
        obj = JSON.parse(text2);
        let type = fname.split(".")[0];
        result[type] = obj;
      } catch (e2) {
        console.trace(e2);
      }
    } else if (mimetype.startsWith("image") || mimetype.startsWith("audio") || mimetype.startsWith("video")) {
      const blob2 = new Blob([unzipped[fname]], {
        type: mimetype
      });
      media.push({ name: fname, content: blob2 });
    }
  }
  if (media.length > 0) {
    result.media = media;
  }
  return result;
}
const mimetypes = {
  ".json": "application/json",
  ".aac": "audio/aac",
  ".mp3": "audio/mpeg",
  ".mp4": "audio/mp4",
  ".oga": "audio/ogg",
  ".wav": "audio/wav",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".webp": "image/webp"
};
function mime(fname) {
  const extension = /\.[-a-zA-Z0-9]+$/.exec(fname);
  if (!extension) return false;
  return mimetypes[extension] || false;
}
function updateString(f2) {
  return function(value) {
    return function(old) {
      return f2(old || "", value || "");
    };
  };
}
function updateNumber(f2) {
  return function(value) {
    return function(old) {
      return f2(old || 0, value || 0);
    };
  };
}
const Functions = {
  increment: updateNumber((old, value) => old + value),
  add_word: updateString((old, value) => old + value + " "),
  add_letter: updateString((old, value) => old + value),
  complete: updateString((old, value) => {
    if (old.length == 0 || old.endsWith(" ")) {
      return old + value;
    } else {
      return old.replace(/\S+$/, value);
    }
  }),
  replace_last: updateString((old, value) => old.replace(/\S*\s*$/, value)),
  replace_last_letter: updateString((old, value) => old.slice(0, -1) + value),
  random: (arg) => {
    let args = arg.split(",");
    return args[Math.floor(Math.random() * args.length)];
  },
  max: Math.max,
  min: Math.min,
  if: (c2, t2, f2) => c2 ? t2 : f2,
  abs: (v2) => Math.abs(v2),
  load_design: (url = "") => {
    if (!url) db.reloadDesignFromOriginalURL();
    else db.readDesignFromURL(url);
    return "loaded";
  },
  open_editor: () => {
    Globals.state.update({ editing: !Globals.state.get("editing") });
  }
};
function translate(expression) {
  let exp = expression.replace(/^=/, "");
  exp = exp.replaceAll(
    /=/g,
    (_match, offset, str) => offset > 0 && "=<>!".includes(str[offset - 1]) ? "=" : "=="
  );
  exp = exp.replaceAll(
    /#(\w+)/g,
    (match2, word, offset, str) => offset > 0 && (str[offset - 1] === "'" || str[offset - 1] === '"') ? match2 : "_" + word
  );
  return exp;
}
function access(state2, data2) {
  return function(name) {
    if (!name) return "";
    if (state2 && name.startsWith("$")) {
      return state2.get(name);
    }
    if (data2 && name.startsWith("#")) {
      const r = data2[name.slice(1)];
      if (r == null) return "";
      return r;
    }
    return "";
  };
}
const accessed = /* @__PURE__ */ new Map();
const variableHandler = {
  /** @param {Object} target
   * @param {string} prop
   */
  get(target, prop) {
    let result = void 0;
    if (prop.startsWith("$")) {
      result = target.states[prop];
      accessed.set(prop, prop in target.states);
    } else if (prop.startsWith("_")) {
      let ps = prop.slice(1);
      result = target.data[ps];
      accessed.set(prop, Globals.data.allFields.has("#" + ps));
    } else if (prop in Functions) {
      result = Functions[prop];
    } else {
      console.error("undefined", prop);
    }
    if (result === void 0 || result === null) {
      result = "";
    }
    return result;
  },
  /** The expressions library is testing for own properties for safety.
   * I need to defeat that for the renaming I want to do.
   * @param {Object} target;
   * @param {string} prop;
   */
  getOwnPropertyDescriptor(target, prop) {
    if (prop.startsWith("$")) {
      return Object.getOwnPropertyDescriptor(target.states, prop);
    } else if (prop.startsWith("_")) {
      return { configurable: true, enumerable: true };
    } else {
      return Object.getOwnPropertyDescriptor(Functions, prop);
    }
  }
};
function compileExpression(expression) {
  const te2 = translate(expression);
  try {
    const exp = main.compile(te2);
    return [
      (context = {}) => {
        let states = "states" in context ? { ...Globals.state.values, ...context.states } : Globals.state.values;
        let data2 = context.data ?? {};
        const r = exp(
          new Proxy(
            {
              Functions,
              states,
              data: data2
            },
            variableHandler
          )
        );
        return r;
      },
      void 0
    ];
  } catch (e2) {
    return [void 0, e2];
  }
}
const ColorNames = {
  white: "#ffffff",
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
  yellow: "#ffff00",
  magenta: "#ff00ff",
  cyan: "#00ffff",
  black: "#000000",
  "pinkish white": "#fff6f6",
  "very pale pink": "#ffe2e2",
  "pale pink": "#ffc2c2",
  "light pink": "#ff9e9e",
  "light brilliant red": "#ff6565",
  "luminous vivid red": "#ff0000",
  "pinkish gray": "#e7dada",
  "pale grayish pink": "#e7b8b8",
  pink: "#e78b8b",
  "brilliant red": "#e75151",
  "vivid red": "#e70000",
  "reddish gray": "#a89c9c",
  "grayish red": "#a87d7d",
  "moderate red": "#a84a4a",
  "strong red": "#a80000",
  "reddish brownish gray": "#595353",
  "dark grayish reddish brown": "#594242",
  "reddish brown": "#592727",
  "deep reddish brown": "#590000",
  "reddish brownish black": "#1d1a1a",
  "very reddish brown": "#1d1111",
  "very deep reddish brown": "#1d0000",
  "pale scarlet": "#ffc9c2",
  "very light scarlet": "#ffaa9e",
  "light brilliant scarlet": "#ff7865",
  "luminous vivid scarlet": "#ff2000",
  "light scarlet": "#e7968b",
  "brilliant scarlet": "#e76451",
  "vivid scarlet": "#e71d00",
  "moderate scarlet": "#a8554a",
  "strong scarlet": "#a81500",
  "dark scarlet": "#592d27",
  "deep scarlet": "#590b00",
  "very pale vermilion": "#ffe9e2",
  "pale vermilion": "#ffd1c2",
  "very light vermilion": "#ffb69e",
  "light brilliant vermilion": "#ff8b65",
  "luminous vivid vermilion": "#ff4000",
  "pale, light grayish vermilion": "#e7c4b8",
  "light vermilion": "#e7a28b",
  "brilliant vermilion": "#e77751",
  "vivid vermilion": "#e73a00",
  "grayish vermilion": "#a8887d",
  "moderate vermilion": "#a8614a",
  "strong vermilion": "#a82a00",
  "dark grayish vermilion": "#594842",
  "dark vermilion": "#593427",
  "deep vermilion": "#591600",
  "pale tangelo": "#ffd9c2",
  "very light tangelo": "#ffc29e",
  "light brilliant tangelo": "#ff9f65",
  "luminous vivid tangelo": "#ff6000",
  "light tangelo": "#e7ae8b",
  "brilliant tangelo": "#e78951",
  "vivid tangelo": "#e75700",
  "moderate tangelo": "#a86d4a",
  "strong tangelo": "#a83f00",
  "dark tangelo": "#593a27",
  "deep tangelo": "#592100",
  "very pale orange": "#fff0e2",
  "pale orange": "#ffe0c2",
  "very light orange": "#ffcf9e",
  "light brilliant orange": "#ffb265",
  "luminous vivid orange": "#ff8000",
  "pale, light grayish brown": "#e7d0b8",
  "light orange": "#e7b98b",
  "brilliant orange": "#e79c51",
  "vivid orange": "#e77400",
  "grayish brown": "#a8937d",
  "moderate orange": "#a8794a",
  "strong orange": "#a85400",
  "dark grayish brown": "#594e42",
  brown: "#594027",
  "deep brown": "#592d00",
  "very brown": "#1d1711",
  "very deep brown": "#1d0e00",
  "pale gamboge": "#ffe8c2",
  "very light gamboge": "#ffdb9e",
  "light brilliant gamboge": "#ffc565",
  "luminous vivid gamboge": "#ff9f00",
  "light gamboge": "#e7c58b",
  "brilliant gamboge": "#e7af51",
  "vivid gamboge": "#e79100",
  "moderate gamboge": "#a8854a",
  "strong gamboge": "#a86900",
  "dark gamboge": "#594627",
  "deep gamboge": "#593800",
  "very pale amber": "#fff8e2",
  "pale amber": "#fff0c2",
  "very light amber": "#ffe79e",
  "light brilliant amber": "#ffd865",
  "luminous vivid amber": "#ffbf00",
  "pale, light grayish amber": "#e7dcb8",
  "light amber": "#e7d08b",
  "brilliant amber": "#e7c251",
  "vivid amber": "#e7ae00",
  "grayish amber": "#a89e7d",
  "moderate amber": "#a8914a",
  "strong amber": "#a87e00",
  "dark grayish amber": "#595442",
  "dark amber": "#594d27",
  "deep amber": "#594300",
  "pale gold": "#fff7c2",
  "very light gold": "#fff39e",
  "light brilliant gold": "#ffec65",
  "luminous vivid gold": "#ffdf00",
  "light gold": "#e7dc8b",
  "brilliant gold": "#e7d551",
  "vivid gold": "#e7ca00",
  "moderate gold": "#a89c4a",
  "strong gold": "#a89300",
  "dark gold": "#595327",
  "deep gold": "#594e00",
  "yellowish white": "#fffff6",
  "very pale yellow": "#ffffe2",
  "pale yellow": "#ffffc2",
  "very light yellow": "#ffff9e",
  "light brilliant yellow": "#ffff65",
  "luminous vivid yellow": "#ffff00",
  "light yellowish gray": "#e7e7da",
  "pale, light grayish olive": "#e7e7b8",
  "light yellow": "#e7e78b",
  "brilliant yellow": "#e7e751",
  "vivid yellow": "#e7e700",
  "yellowish gray": "#a8a89c",
  "grayish olive": "#a8a87d",
  "moderate olive": "#a8a84a",
  "strong olive": "#a8a800",
  "dark olivish gray": "#595953",
  "dark grayish olive": "#595942",
  "dark olive": "#595927",
  "deep olive": "#595900",
  "yellowish black": "#1d1d1a",
  "very dark olive": "#1d1d11",
  "very deep olive": "#1d1d00",
  "pale apple green": "#f7ffc2",
  "very light apple green": "#f3ff9e",
  "light brilliant apple green": "#ecff65",
  "luminous vivid apple green": "#dfff00",
  "light apple green": "#dce78b",
  "brilliant apple green": "#d5e751",
  "vivid apple green": "#cae700",
  "moderate apple green": "#9ca84a",
  "strong apple green": "#93a800",
  "dark apple green": "#535927",
  "deep apple green": "#4e5900",
  "very pale lime green": "#f8ffe2",
  "pale lime green": "#f0ffc2",
  "very light lime green": "#e7ff9e",
  "light brilliant lime green": "#d8ff65",
  "luminous vivid lime green": "#bfff00",
  "pale, light grayish lime green": "#dce7b8",
  "light lime green": "#d0e78b",
  "brilliant lime green": "#c2e751",
  "vivid lime green": "#aee700",
  "grayish lime green": "#9ea87d",
  "moderate lime green": "#91a84a",
  "strong lime green": "#7ea800",
  "dark grayish lime green": "#545942",
  "dark lime green": "#4d5927",
  "deep lime green": "#435900",
  "pale spring bud": "#e8ffc2",
  "very light spring bud": "#dbff9e",
  "light brilliant spring bud": "#c5ff65",
  "luminous vivid spring bud": "#9fff00",
  "light spring bud": "#c5e78b",
  "brilliant spring bud": "#afe751",
  "vivid spring bud": "#91e700",
  "moderate spring bud": "#85a84a",
  "strong spring bud": "#69a800",
  "dark spring bud": "#465927",
  "deep spring bud": "#385900",
  "very pale chartreuse green": "#f0ffe2",
  "pale chartreuse green": "#e0ffc2",
  "very light chartreuse green": "#cfff9e",
  "light brilliant chartreuse green": "#b2ff65",
  "luminous vivid chartreuse green": "#80ff00",
  "pale, light grayish chartreuse green": "#d0e7b8",
  "light chartreuse green": "#b9e78b",
  "brilliant chartreuse green": "#9ce751",
  "vivid chartreuse green": "#74e700",
  "grayish chartreuse green": "#93a87d",
  "moderate chartreuse green": "#79a84a",
  "strong chartreuse green": "#54a800",
  "dark grayish chartreuse green": "#4e5942",
  "dark chartreuse green": "#405927",
  "deep chartreuse green": "#2d5900",
  "very dark chartreuse green": "#171d11",
  "very deep chartreuse green": "#0e1d00",
  "pale pistachio": "#d9ffc2",
  "very light pistachio": "#c2ff9e",
  "light brilliant pistachio": "#9fff65",
  "luminous vivid pistachio": "#60ff00",
  "light pistachio": "#aee78b",
  "brilliant pistachio": "#89e751",
  "vivid pistachio": "#57e700",
  "moderate pistachio": "#6da84a",
  "strong pistachio": "#3fa800",
  "dark pistachio": "#3a5927",
  "deep pistachio": "#215900",
  "very pale harlequin": "#e9ffe2",
  "pale harlequin": "#d1ffc2",
  "very light harlequin": "#b6ff9e",
  "light brilliant harlequin": "#8bff65",
  "luminous vivid harlequin": "#40ff00",
  "pale, light grayish harlequin": "#c4e7b8",
  "light harlequin": "#a2e78b",
  "brilliant harlequin": "#77e751",
  "vivid harlequin": "#3ae700",
  "grayish harlequin": "#88a87d",
  "moderate harlequin": "#61a84a",
  "strong harlequin": "#2aa800",
  "dark grayish harlequin": "#485942",
  "dark harlequin": "#345927",
  "deep harlequin": "#165900",
  "pale sap green": "#c9ffc2",
  "very light sap green": "#aaff9e",
  "light brilliant sap green": "#78ff65",
  "luminous vivid sap green": "#20ff00",
  "light sap green": "#96e78b",
  "brilliant sap green": "#64e751",
  "vivid sap green": "#1de700",
  "moderate sap green": "#55a84a",
  "strong sap green": "#15a800",
  "dark sap green": "#2d5927",
  "deep sap green": "#0b5900",
  "greenish white": "#f6fff6",
  "very pale green": "#e2ffe2",
  "pale green": "#c2ffc2",
  "very light green": "#9eff9e",
  "light brilliant green": "#65ff65",
  "luminous vivid green": "#00ff00",
  "light greenish gray": "#dae7da",
  "pale, light grayish green": "#b8e7b8",
  "light green": "#8be78b",
  "brilliant green": "#51e751",
  "vivid green": "#00e700",
  "greenish gray": "#9ca89c",
  "grayish green": "#7da87d",
  "moderate green": "#4aa84a",
  "strong green": "#00a800",
  "dark greenish gray": "#535953",
  "dark grayish green": "#425942",
  "dark green": "#275927",
  "deep green": "#005900",
  "greenish black": "#1a1d1a",
  "very dark green": "#111d11",
  "very deep green": "#001d00",
  "pale emerald green": "#c2ffc9",
  "very light emerald green": "#9effaa",
  "light brilliant emerald green": "#65ff78",
  "luminous vivid emerald green": "#00ff20",
  "light emerald green": "#8be796",
  "brilliant emerald green": "#51e764",
  "vivid emerald green": "#00e71d",
  "moderate emerald green": "#4aa855",
  "strong emerald green": "#00a815",
  "dark emerald green": "#27592d",
  "deep emerald green": "#00590b",
  "very pale malachite green": "#e2ffe9",
  "pale malachite green": "#c2ffd1",
  "very light malachite green": "#9effb6",
  "light brilliant malachite green": "#65ff8b",
  "luminous vivid malachite green": "#00ff40",
  "pale, light grayish malachite green": "#b8e7c4",
  "light malachite green": "#8be7a2",
  "brilliant malachite green": "#51e777",
  "vivid malachite green": "#00e73a",
  "grayish malachite green": "#7da888",
  "moderate malachite green": "#4aa861",
  "strong malachite green": "#00a82a",
  "dark grayish malachite green": "#425948",
  "dark malachite green": "#275934",
  "deep malachite green": "#005916",
  "pale sea green": "#c2ffd9",
  "very light sea green": "#9effc2",
  "light brilliant sea green": "#65ff9f",
  "luminous vivid sea green": "#00ff60",
  "light sea green": "#8be7ae",
  "brilliant sea green": "#51e789",
  "vivid sea green": "#00e757",
  "moderate sea green": "#4aa86d",
  "strong sea green": "#00a83f",
  "dark sea green": "#27593a",
  "deep sea green": "#005921",
  "very pale spring green": "#e2fff0",
  "pale spring green": "#c2ffe0",
  "very light spring green": "#9effcf",
  "light brilliant spring green": "#65ffb2",
  "luminous vivid spring green": "#00ff80",
  "pale, light grayish spring green": "#b8e7d0",
  "light spring green": "#8be7b9",
  "brilliant spring green": "#51e79c",
  "vivid spring green": "#00e774",
  "grayish spring green": "#7da893",
  "moderate spring green": "#4aa879",
  "strong spring green": "#00a854",
  "dark grayish spring green": "#42594e",
  "dark spring green": "#275940",
  "deep spring green": "#00592d",
  "very dark spring green": "#111d17",
  "very deep spring green": "#001d0e",
  "pale aquamarine": "#c2ffe8",
  "very light aquamarine": "#9effdb",
  "light brilliant aquamarine": "#65ffc5",
  "luminous vivid aquamarine": "#00ff9f",
  "light aquamarine": "#8be7c5",
  "brilliant aquamarine": "#51e7af",
  "vivid aquamarine": "#00e791",
  "moderate aquamarine": "#4aa885",
  "strong aquamarine": "#00a869",
  "dark aquamarine": "#275946",
  "deep aquamarine": "#005938",
  "very pale turquoise": "#e2fff8",
  "pale turquoise": "#c2fff0",
  "very light turquoise": "#9effe7",
  "light brilliant turquoise": "#65ffd8",
  "luminous vivid turquoise": "#00ffbf",
  "pale, light grayish turquoise": "#b8e7dc",
  "light turquoise": "#8be7d0",
  "brilliant turquoise": "#51e7c2",
  "vivid turquoise": "#00e7ae",
  "grayish turquoise": "#7da89e",
  "moderate turquoise": "#4aa891",
  "strong turquoise": "#00a87e",
  "dark grayish turquoise": "#425954",
  "dark turquoise": "#27594d",
  "deep turquoise": "#005943",
  "pale opal": "#c2fff7",
  "very light opal": "#9efff3",
  "light brilliant opal": "#65ffec",
  "luminous vivid opal": "#00ffdf",
  "light opal": "#8be7dc",
  "brilliant opal": "#51e7d5",
  "vivid opal": "#00e7ca",
  "moderate opal": "#4aa89c",
  "strong opal": "#00a893",
  "dark opal": "#275953",
  "deep opal": "#00594e",
  "cyanish white": "#f6ffff",
  "very pale cyan": "#e2ffff",
  "pale cyan": "#c2ffff",
  "very light cyan": "#9effff",
  "light brilliant cyan": "#65ffff",
  "luminous vivid cyan": "#00ffff",
  "light cyanish gray": "#dae7e7",
  "pale, light grayish cyan": "#b8e7e7",
  "light cyan": "#8be7e7",
  "brilliant cyan": "#51e7e7",
  "vivid cyan": "#00e7e7",
  "cyanish gray": "#9ca8a8",
  "grayish cyan": "#7da8a8",
  "moderate cyan": "#4aa8a8",
  "strong cyan": "#00a8a8",
  "dark cyanish gray": "#535959",
  "dark grayish cyan": "#425959",
  "dark cyan": "#275959",
  "deep cyan": "#005959",
  "cyanish black": "#1a1d1d",
  "very dark cyan": "#111d1d",
  "very deep cyan": "#001d1d",
  "pale arctic blue": "#c2f7ff",
  "very light arctic blue": "#9ef3ff",
  "light brilliant arctic blue": "#65ecff",
  "luminous vivid arctic blue": "#00dfff",
  "light arctic blue": "#8bdce7",
  "brilliant arctic blue": "#51d5e7",
  "vivid arctic blue": "#00cae7",
  "moderate arctic blue": "#4a9ca8",
  "strong arctic blue": "#0093a8",
  "dark arctic blue": "#275359",
  "deep arctic blue": "#004e59",
  "very pale cerulean": "#e2f8ff",
  "pale cerulean": "#c2f0ff",
  "very light cerulean": "#9ee7ff",
  "light brilliant cerulean": "#65d8ff",
  "luminous vivid cerulean": "#00bfff",
  "pale, light grayish cerulean": "#b8dce7",
  "light cerulean": "#8bd0e7",
  "brilliant cerulean": "#51c2e7",
  "vivid cerulean": "#00aee7",
  "grayish cerulean": "#7d9ea8",
  "moderate cerulean": "#4a91a8",
  "strong cerulean": "#007ea8",
  "dark grayish cerulean": "#425459",
  "dark cerulean": "#274d59",
  "deep cerulean": "#004359",
  "pale cornflower blue": "#c2e8ff",
  "very light cornflower blue": "#9edbff",
  "light brilliant cornflower blue": "#65c5ff",
  "luminous vivid cornflower blue": "#009fff",
  "light cornflower blue": "#8bc5e7",
  "brilliant cornflower blue": "#51afe7",
  "vivid cornflower blue": "#0091e7",
  "moderate cornflower blue": "#4a85a8",
  "strong cornflower blue": "#0069a8",
  "dark cornflower blue": "#274659",
  "deep cornflower blue": "#003859",
  "very pale azure": "#e2f0ff",
  "pale azure": "#c2e0ff",
  "very light azure": "#9ecfff",
  "light brilliant azure": "#65b2ff",
  "luminous vivid azure": "#0080ff",
  "pale, light grayish azure": "#b8d0e7",
  "light azure": "#8bb9e7",
  "brilliant azure": "#519ce7",
  "vivid azure": "#0074e7",
  "grayish azure": "#7d93a8",
  "moderate azure": "#4a79a8",
  "strong azure": "#0054a8",
  "dark grayish azure": "#424e59",
  "dark azure": "#274059",
  "deep azure": "#002d59",
  "very dark azure": "#11171d",
  "very deep azure": "#000e1d",
  "pale cobalt blue": "#c2d9ff",
  "very light cobalt blue": "#9ec2ff",
  "light brilliant cobalt blue": "#659fff",
  "luminous vivid cobalt blue": "#0060ff",
  "light cobalt blue": "#8baee7",
  "brilliant cobalt blue": "#5189e7",
  "vivid cobalt blue": "#0057e7",
  "moderate cobalt blue": "#4a6da8",
  "strong cobalt blue": "#003fa8",
  "dark cobalt blue": "#273a59",
  "deep cobalt blue": "#002159",
  "very pale sapphire blue": "#e2e9ff",
  "pale sapphire blue": "#c2d1ff",
  "very light sapphire blue": "#9eb6ff",
  "light brilliant sapphire blue": "#658bff",
  "luminous vivid sapphire blue": "#0040ff",
  "pale, light grayish sapphire blue": "#b8c4e7",
  "light sapphire blue": "#8ba2e7",
  "brilliant sapphire blue": "#5177e7",
  "vivid sapphire blue": "#003ae7",
  "grayish sapphire blue": "#7d88a8",
  "moderate sapphire blue": "#4a61a8",
  "strong sapphire blue": "#002aa8",
  "dark grayish sapphire blue": "#424859",
  "dark sapphire blue": "#273459",
  "deep sapphire blue": "#001659",
  "pale phthalo blue": "#c2c9ff",
  "very light phthalo blue": "#9eaaff",
  "light brilliant phthalo blue": "#6578ff",
  "luminous vivid phthalo blue": "#0020ff",
  "light phthalo blue": "#8b96e7",
  "brilliant phthalo blue": "#5164e7",
  "vivid phthalo blue": "#001de7",
  "moderate phthalo blue": "#4a55a8",
  "strong phthalo blue": "#0015a8",
  "dark phthalo blue": "#272d59",
  "deep phthalo blue": "#000b59",
  "bluish white": "#f6f6ff",
  "very pale blue": "#e2e2ff",
  "pale blue": "#c2c2ff",
  "very light blue": "#9e9eff",
  "light brilliant blue": "#6565ff",
  "luminous vivid blue": "#0000ff",
  "light bluish gray": "#dadae7",
  "pale, light grayish blue": "#b8b8e7",
  "light blue": "#8b8be7",
  "brilliant blue": "#5151e7",
  "vivid blue": "#0000e7",
  "bluish gray": "#9c9ca8",
  "grayish blue": "#7d7da8",
  "moderate blue": "#4a4aa8",
  "strong blue": "#0000a8",
  "dark bluish gray": "#535359",
  "dark grayish blue": "#424259",
  "dark blue": "#272759",
  "deep blue": "#000059",
  "bluish black": "#1a1a1d",
  "very dark blue": "#11111d",
  "very deep blue": "#00001d",
  "pale persian blue": "#c9c2ff",
  "very light persian blue": "#aa9eff",
  "light brilliant persian blue": "#7865ff",
  "luminous vivid persian blue": "#2000ff",
  "light persian blue": "#968be7",
  "brilliant persian blue": "#6451e7",
  "vivid persian blue": "#1d00e7",
  "moderate persian blue": "#554aa8",
  "strong persian blue": "#1500a8",
  "dark persian blue": "#2d2759",
  "deep persian blue": "#0b0059",
  "very pale indigo": "#e9e2ff",
  "pale indigo": "#d1c2ff",
  "very light indigo": "#b69eff",
  "light brilliant indigo": "#8b65ff",
  "luminous vivid indigo": "#4000ff",
  "pale, light grayish indigo": "#c4b8e7",
  "light indigo": "#a28be7",
  "brilliant indigo": "#7751e7",
  "vivid indigo": "#3a00e7",
  "grayish indigo": "#887da8",
  "moderate indigo": "#614aa8",
  "strong indigo": "#2a00a8",
  "dark grayish indigo": "#484259",
  "dark indigo": "#342759",
  "deep indigo": "#160059",
  "pale blue violet": "#d9c2ff",
  "very light blue violet": "#c29eff",
  "light brilliant blue violet": "#9f65ff",
  "luminous vivid blue violet": "#6000ff",
  "light blue violet": "#ae8be7",
  "brilliant blue violet": "#8951e7",
  "vivid blue violet": "#5700e7",
  "moderate blue violet": "#6d4aa8",
  "strong blue violet": "#3f00a8",
  "dark blue violet": "#3a2759",
  "deep blue violet": "#210059",
  "very pale violet": "#f0e2ff",
  "pale violet": "#e0c2ff",
  "very light violet": "#cf9eff",
  "light brilliant violet": "#b265ff",
  "luminous vivid violet": "#8000ff",
  "pale, light grayish violet": "#d0b8e7",
  "light violet": "#b98be7",
  "brilliant violet": "#9c51e7",
  "vivid violet": "#7400e7",
  "grayish violet": "#937da8",
  "moderate violet": "#794aa8",
  "strong violet": "#5400a8",
  "dark grayish violet": "#4e4259",
  "dark violet": "#402759",
  "deep violet": "#2d0059",
  "very dark violet": "#17111d",
  "very deep violet": "#0e001d",
  "pale purple": "#e8c2ff",
  "very light purple": "#db9eff",
  "light brilliant purple": "#c565ff",
  "luminous vivid purple": "#9f00ff",
  "light purple": "#c58be7",
  "brilliant purple": "#af51e7",
  "vivid purple": "#9100e7",
  "moderate purple": "#854aa8",
  "strong purple": "#6900a8",
  "dark purple": "#462759",
  "deep purple": "#380059",
  "very pale mulberry": "#f8e2ff",
  "pale mulberry": "#f0c2ff",
  "very light mulberry": "#e79eff",
  "light brilliant mulberry": "#d865ff",
  "luminous vivid mulberry": "#bf00ff",
  "pale, light grayish mulberry": "#dcb8e7",
  "light mulberry": "#d08be7",
  "brilliant mulberry": "#c251e7",
  "vivid mulberry": "#ae00e7",
  "grayish mulberry": "#9e7da8",
  "moderate mulberry": "#914aa8",
  "strong mulberry": "#7e00a8",
  "dark grayish mulberry": "#544259",
  "dark mulberry": "#4d2759",
  "deep mulberry": "#430059",
  "pale heliotrope": "#f7c2ff",
  "very light heliotrope": "#f39eff",
  "light brilliant heliotrope": "#ec65ff",
  "luminous vivid heliotrope": "#df00ff",
  "light heliotrope": "#dc8be7",
  "brilliant heliotrope": "#d551e7",
  "vivid heliotrope": "#ca00e7",
  "moderate heliotrope": "#9c4aa8",
  "strong heliotrope": "#9300a8",
  "dark heliotrope": "#532759",
  "deep heliotrope": "#4e0059",
  "magentaish white": "#fff6ff",
  "very pale magenta": "#ffe2ff",
  "pale magenta": "#ffc2ff",
  "very light magenta": "#ff9eff",
  "light brilliant magenta": "#ff65ff",
  "luminous vivid magenta": "#ff00ff",
  "light magentaish gray": "#e7dae7",
  "pale, light grayish magenta": "#e7b8e7",
  "light magenta": "#e78be7",
  "brilliant magenta": "#e751e7",
  "vivid magenta": "#e700e7",
  "magentaish gray": "#a89ca8",
  "grayish magenta": "#a87da8",
  "moderate magenta": "#a84aa8",
  "strong magenta": "#a800a8",
  "dark magentaish gray": "#595359",
  "dark grayish magenta": "#594259",
  "dark magenta": "#592759",
  "deep magenta": "#590059",
  "magentaish black": "#1d1a1d",
  "very dark magenta": "#1d111d",
  "very deep magenta": "#1d001d",
  "pale orchid": "#ffc2f7",
  "very light orchid": "#ff9ef3",
  "light brilliant orchid": "#ff65ec",
  "luminous vivid orchid": "#ff00df",
  "light orchid": "#e78bdc",
  "brilliant orchid": "#e751d5",
  "vivid orchid": "#e700ca",
  "moderate orchid": "#a84a9c",
  "strong orchid": "#a80093",
  "dark orchid": "#592753",
  "deep orchid": "#59004e",
  "very pale fuchsia": "#ffe2f8",
  "pale fuchsia": "#ffc2f0",
  "very light fuchsia": "#ff9ee7",
  "light brilliant fuchsia": "#ff65d8",
  "luminous vivid fuchsia": "#ff00bf",
  "pale, light grayish fuchsia": "#e7b8dc",
  "light fuchsia": "#e78bd0",
  "brilliant fuchsia": "#e751c2",
  "vivid fuchsia": "#e700ae",
  "grayish fuchsia": "#a87d9e",
  "moderate fuchsia": "#a84a91",
  "strong fuchsia": "#a8007e",
  "dark grayish fuchsia": "#594254",
  "dark fuchsia": "#59274d",
  "deep fuchsia": "#590043",
  "pale cerise": "#ffc2e8",
  "very light cerise": "#ff9edb",
  "light brilliant cerise": "#ff65c5",
  "luminous vivid cerise": "#ff009f",
  "light cerise": "#e78bc5",
  "brilliant cerise": "#e751af",
  "vivid cerise": "#e70091",
  "moderate cerise": "#a84a85",
  "strong cerise": "#a80069",
  "dark cerise": "#592746",
  "deep cerise": "#590038",
  "very pale rose": "#ffe2f0",
  "pale rose": "#ffc2e0",
  "very light rose": "#ff9ecf",
  "light brilliant rose": "#ff65b2",
  "luminous vivid rose": "#ff0080",
  "pale, light grayish rose": "#e7b8d0",
  "light rose": "#e78bb9",
  "brilliant rose": "#e7519c",
  "vivid rose": "#e70074",
  "grayish rose": "#a87d93",
  "moderate rose": "#a84a79",
  "strong rose": "#a80054",
  "dark grayish rose": "#59424e",
  "dark rose": "#592740",
  "deep rose": "#59002d",
  "very dark rose": "#1d1117",
  "very deep rose": "#1d000e",
  "pale raspberry": "#ffc2d9",
  "very light raspberry": "#ff9ec2",
  "light brilliant raspberry": "#ff659f",
  "luminous vivid raspberry": "#ff0060",
  "light raspberry": "#e78bae",
  "brilliant raspberry": "#e75189",
  "vivid raspberry": "#e70057",
  "moderate raspberry": "#a84a6d",
  "strong raspberry": "#a8003f",
  "dark raspberry": "#59273a",
  "deep raspberry": "#590021",
  "very pale crimson": "#ffe2e9",
  "pale crimson": "#ffc2d1",
  "very light crimson": "#ff9eb6",
  "light brilliant crimson": "#ff658b",
  "luminous vivid crimson": "#ff0040",
  "pale, light grayish crimson": "#e7b8c4",
  "light crimson": "#e78ba2",
  "brilliant crimson": "#e75177",
  "vivid crimson": "#e7003a",
  "grayish crimson": "#a87d88",
  "moderate crimson": "#a84a61",
  "strong crimson": "#a8002a",
  "dark grayish crimson": "#594248",
  "dark crimson": "#592734",
  "deep crimson": "#590016",
  "pale amaranth": "#ffc2c9",
  "very light amaranth": "#ff9eaa",
  "light brilliant amaranth": "#ff6578",
  "luminous vivid amaranth": "#ff0020",
  "light amaranth": "#e78b96",
  "brilliant amaranth": "#e75164",
  "vivid amaranth": "#e7001d",
  "moderate amaranth": "#a84a55",
  "strong amaranth": "#a80015",
  "dark amaranth": "#59272d",
  "deep amaranth": "#59000b"
};
function isValidColor(strColor) {
  if (strColor.length == 0 || strColor in ColorNames) {
    return true;
  }
  var s2 = new Option().style;
  s2.color = strColor;
  return s2.color !== "";
}
function getColor(name) {
  return ColorNames[name] || name;
}
function normalizeStyle(style2) {
  return Object.fromEntries(
    Object.entries(style2).filter(([_, value]) => value && value.toString().length).map(
      ([key, value]) => key.toLowerCase().indexOf("color") >= 0 ? [key, getColor(
        /** @type {string} */
        value
      )] : [key, value && value.toString()]
    )
  );
}
function styleString(styles) {
  return Object.entries(normalizeStyle(styles)).reduce(
    (acc, [key, value]) => acc + key.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + value + ";",
    ""
  );
}
function colorNamesDataList() {
  return html`<datalist id="ColorNames">
    ${Object.keys(ColorNames).map((name) => html`<option value="${name}" />`)}
  </datalist>`;
}
class Prop {
  label = "";
  /** @type {T} */
  _value;
  /** true if this is a formula without leading = */
  isFormulaByDefault = false;
  /** If the entered value starts with = treat it as an expression and store it here */
  formula = "";
  /** @type {((context?:EvalContext)=>any) | undefined} compiled expression if any */
  compiled = void 0;
  // Each prop gets a unique id based on the id of its container
  id = "";
  /** @type {TreeBase} */
  container;
  /** attach the prop to its containing TreeBase component
   * @param {string} name
   * @param {any} value
   * @param {TreeBase} container
   * */
  initialize(name, value, container) {
    this.id = `${container.id}-${name}`;
    this.container = container;
    if (value != void 0) {
      this.set(value);
    }
    this.label = this.label || name.replace(/(?!^)([A-Z])/g, " $1").replace(/^./, (s2) => s2.toUpperCase());
  }
  /** @type {PropOptions} */
  options = {};
  /**
   * @param {T} value
   * @param {PropOptions} options */
  constructor(value, options = {}) {
    this._value = value;
    this.options = options;
    if (options.label) {
      this.label = options.label;
    }
  }
  validate = debounce(
    (value, input) => {
      input.setCustomValidity("");
      if (this.isFormulaByDefault || value.startsWith("=")) {
        const [compiled, error] = compileExpression(value);
        if (error) {
          let message = error.message.replace(/^\[.*?\]/, "");
          message = message.split("\n")[0];
          input.setCustomValidity(message);
        } else if (compiled && this.options.validate)
          input.setCustomValidity(this.options.validate("" + compiled({})));
      } else if (this.options.validate) {
        input.setCustomValidity(this.options.validate(value));
      }
      input.reportValidity();
    },
    100
  );
  input() {
    const text2 = this.text;
    return this.labeled(
      html`<input
          type="text"
          inputmode=${this.options.inputmode}
          .value=${text2}
          id=${this.id}
          style=${`width: min(${text2.length + 3}ch, 100%)`}
          list=${this.options.datalist}
          title=${this.options.title}
          placeholder=${this.options.placeholder}
          @keydown=${this.onkeydown}
          @input=${this.oninput}
          @change=${this.onchange}
        />${this.showValue()}`
    );
  }
  onkeydown = (event) => {
    const { key, target } = event;
    if (key == "Escape" && target instanceof HTMLInputElement) {
      const text2 = this.text;
      this.validate(text2, target);
      event.preventDefault();
      target.value = text2;
    }
  };
  oninput = (event) => {
    if (event.target instanceof HTMLInputElement) {
      this.validate(event.target.value, event.target);
      event.target.style.width = `${event.target.value.length + 1}ch`;
    }
  };
  onchange = (event) => {
    if (event.target instanceof HTMLInputElement && event.target.checkValidity()) {
      this.set(event.target.value);
      this.update();
    }
  };
  onfocus = (event) => {
    if (this.formula && event.target instanceof HTMLInputElement) {
      const span = event.target.nextElementSibling;
      if (span instanceof HTMLSpanElement) {
        const value = this.value;
        const type = typeof value;
        let text2 = "";
        if (type === "string" || type === "number" || type === "boolean") {
          text2 = "" + value;
        }
        span.innerText = text2;
      }
    }
  };
  showValue() {
    return this.formula ? [html`<span class="propValue"></span>`] : [];
  }
  /** @param {Hole} body */
  labeled(body) {
    return html`
      <label class="labeledInput" ?hiddenLabel=${!!this.options.hiddenLabel}
        ><span class="labelText">${this.label}</span> ${body}</label
      >
    `;
  }
  /** @param {HTMLInputElement} inputElement */
  setValidity(inputElement) {
    if (inputElement instanceof HTMLInputElement) {
      if (this.error) {
        console.log("scv", this.error.message);
        inputElement.setCustomValidity(this.error.message);
        inputElement.reportValidity();
      } else {
        console.log("csv");
        inputElement.setCustomValidity("");
        inputElement.reportValidity();
      }
    } else {
      console.log("not found", inputElement);
    }
  }
  /** @param {any} value
   * @returns {T}
   * */
  cast(value) {
    if (typeof value == "string") {
      value = value.normalize("NFC");
    }
    return value;
  }
  /**
   * @param {any} value
   */
  set(value) {
    this.compiled = void 0;
    this.formula = "";
    if (typeof value == "string" && (this.isFormulaByDefault || value.startsWith("="))) {
      value = value.normalize("NFC");
      let error;
      [this.compiled, error] = compileExpression(value);
      if (error) {
        console.error("set error", this.label, value, error.message);
      } else {
        this.formula = value;
      }
    } else {
      this._value = this.cast(value);
    }
  }
  /**
   * extract the value to save
   * returns {string}
   */
  get text() {
    if (this.formula || this.isFormulaByDefault) return this.formula;
    return "" + this._value;
  }
  /** @returns {T} */
  get value() {
    if (this.compiled) {
      if (!this.formula) {
        this._value = this.options.valueWhenEmpty ?? "";
      } else {
        const v2 = this.compiled();
        this._value = this.cast(v2);
      }
    }
    return this._value;
  }
  /** @param {EvalContext} context - The context
   * @returns {T} */
  valueInContext(context = {}) {
    if (this.compiled) {
      if (!this.formula) {
        this._value = this.options.valueWhenEmpty ?? "";
      } else {
        const v2 = this.compiled(context);
        this._value = this.cast(v2);
      }
    } else if (this.isFormulaByDefault) {
      this._value = this.options.valueWhenEmpty ?? "";
    }
    return this._value;
  }
  update() {
    this.container.update();
  }
  /** @param {Error} [error] */
  setError(error = void 0) {
    this.error = error;
  }
}
function toMap(arrayOrMap) {
  if (arrayOrMap instanceof Function) {
    return arrayOrMap();
  }
  if (Array.isArray(arrayOrMap)) {
    return new Map(arrayOrMap.map((item) => [item, item]));
  }
  return arrayOrMap;
}
class Select extends Prop {
  /**
   * @param {string[] | Map<string, string> | function():Map<string,string>} choices
   * @param {PropOptions} options
   */
  constructor(choices = [], options = {}) {
    super("", options);
    this.choices = choices;
    this._value = options.defaultValue || "";
  }
  /** @param {Map<string,string> | null} choices */
  input(choices = null) {
    if (!choices) {
      choices = toMap(this.choices);
    }
    this._value = this._value || this.options.defaultValue || "";
    return this.labeled(
      html`<select
        id=${this.id}
        ?required=${!this.options.notRequired}
        title=${this.options.title}
        @change=${({ target }) => {
        this._value = this.cast(target.value);
        this.update();
      }}
      >
        <option value="" ?selected=${!choices.has(this._value)}>
          ${this.options.placeholder || "Choose one..."}
        </option>
        ${[...choices.entries()].map(
        ([key, value]) => html`<option value=${key} ?selected=${this._value == key}>
              ${value}
            </option>`
      )}
      </select>`
    );
  }
  /** @param {any} value */
  set(value) {
    this._value = this.cast(value);
  }
}
class Field extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    const addedFields = options.addedFields || [];
    super(
      () => toMap(
        [...Globals.data.allFields, "#ComponentName", ...addedFields].sort()
      ),
      options
    );
  }
}
let Cue$1 = class Cue extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    super(() => Globals.cues.cueMap, options);
  }
};
class Pattern extends Select {
  /**
   * @param {PropOptions} options
   */
  constructor(options = {}) {
    super(() => Globals.patterns.patternMap, options);
  }
}
class TypeSelect extends Select {
  update() {
    if (this.container instanceof TreeBaseSwitchable && this._value) {
      this.container.replace(this._value);
    }
  }
}
let String$1 = class String2 extends Prop {
};
class KeyName extends Prop {
  /**
   * @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
  }
  input() {
    function mapKey(key) {
      if (key == " ") return "Space";
      return key;
    }
    return this.labeled(
      html`<input
        type="text"
        .value=${mapKey(this._value)}
        id=${this.id}
        readonly
        @keydown=${(event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (target.hasAttribute("readonly") && event.key == "Enter") {
          target.removeAttribute("readonly");
          target.select();
        } else if (!target.hasAttribute("readonly")) {
          event.stopPropagation();
          event.preventDefault();
          this._value = this.cast(event.key);
          target.value = mapKey(event.key);
          target.setAttribute("readonly", "");
        }
      }}
        title="Press Enter to change then press a single key to set"
        placeholder=${this.options.placeholder}
      />`
    );
  }
}
class TextArea extends Prop {
  /**
   * @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
    this.validate = this.options.validate || ((_) => "");
  }
  input() {
    return this.labeled(
      html`<textarea
        .value=${this._value}
        id=${this.id}
        ?invalid=${!!this.validate(this._value)}
        @input=${({ target }) => {
        const errorMsg = this.validate(target.value);
        target.setCustomValidity(errorMsg);
      }}
        @change=${({ target }) => {
        if (target.checkValidity()) {
          this._value = this.cast(target.value);
          this.update();
        }
      }}
        title=${this.options.title}
        placeholder=${this.options.placeholder}
      />`
    );
  }
}
class Integer extends Prop {
  /** @param {number} value
   * @param {PropOptions} options
   */
  constructor(value = 0, options = {}) {
    function validate(value2) {
      if (!/^[0-9]+$/.test(value2)) return "Please enter a whole number";
      if (typeof options.min === "number" && parseInt(value2) < options.min) {
        return `Please enter a whole number at least ${options.min}`;
      }
      if (typeof options.max === "number" && parseInt(value2) > options.max) {
        return `Please enter a whole number at most ${options.max}`;
      }
      return "";
    }
    options = {
      validate,
      inputmode: "numeric",
      ...options
    };
    super(value, options);
  }
  /**
   * Convert the input into an integer
   * @param {any} value
   * @returns {number}
   */
  cast(value) {
    return Math.trunc(+value);
  }
}
class Float extends Prop {
  /** @param {number} value
   * @param {PropOptions} options
   */
  constructor(value = 0, options = {}) {
    const validate = (value2) => {
      if (!/^[0-9]*([,.][0-9]*)?$/.test(value2)) return "Please enter a number";
      if (typeof options.min === "number" && parseFloat(value2) < options.min) {
        return `Please enter a number at least ${options.min}`;
      }
      if (typeof options.max === "number" && parseFloat(value2) > options.max) {
        return `Please enter a number at most ${this.options.max}`;
      }
      return "";
    };
    options = {
      validate,
      inputmode: "decimal",
      ...options
    };
    super(value, options);
  }
  /** @param {any} value */
  cast(value) {
    return +value;
  }
}
let Boolean$1 = class Boolean2 extends Prop {
  /** @param {boolean} value
   * @param {PropOptions} options
   */
  constructor(value = false, options = {}) {
    super(value, options);
  }
  /**
   * @param {PropOptions} options
   */
  input(options = {}) {
    options = { ...this.options, ...options };
    return this.labeled(
      html`<input
        type="checkbox"
        ?checked=${this._value}
        id=${this.id}
        @change=${({ target }) => {
        this._value = target.checked;
        this.update();
      }}
        title=${options.title}
      />`
    );
  }
  /** @param {any} value */
  set(value) {
    if (typeof value === "boolean") {
      this._value = value;
    } else if (typeof value === "string") {
      this._value = value === "true";
    }
  }
};
class OneOfGroup extends Prop {
  /** @param {boolean} value
   * @param {PropOptions} options
   */
  constructor(value = false, options = {}) {
    options = { group: "AGroup", ...options };
    super(value, options);
  }
  /**
   * @param {PropOptions} options
   */
  input(options = {}) {
    options = { ...this.options, ...options };
    return this.labeled(
      html`<input
        type="checkbox"
        .checked=${!!this._value}
        id=${this.id}
        name=${options.group}
        @click=${() => {
        this._value = true;
        this.clearPeers();
        this.update();
      }}
        title=${this.options.title}
      />`
    );
  }
  /** @param {any} value */
  set(value) {
    if (typeof value === "boolean") {
      this._value = value;
    } else if (typeof value === "string") {
      this._value = value === "true";
    }
    if (this._value) {
      this.clearPeers();
    }
  }
  /**
   * Clear the value of peer radio buttons with the same name
   */
  clearPeers() {
    const name = this.options.group;
    const peers = this.container?.parent?.children || [];
    for (const peer of peers) {
      const props = peer.props;
      for (const propName in props) {
        const prop = props[propName];
        if (prop instanceof OneOfGroup && prop.options.group == name && prop != this) {
          prop.set(false);
        }
      }
    }
  }
}
class UID extends Prop {
  constructor() {
    super("", {});
    this._value = "id" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}
class Expression extends Prop {
  isFormulaByDefault = true;
  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
    this.formula = value;
  }
}
class Conditional extends Prop {
  isFormulaByDefault = true;
  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(false, options);
    this.formula = value;
  }
  get value() {
    return !!super.value;
  }
  valueInContext(context = {}) {
    return !!super.valueInContext(context);
  }
}
let scratchSheet = null;
function validationSheet() {
  if (!scratchSheet) {
    const style2 = document.createElement("style");
    style2.media = "not all";
    document.head.appendChild(style2);
    scratchSheet = style2.sheet;
  }
  while (scratchSheet.cssRules.length) scratchSheet.deleteRule(0);
  return scratchSheet;
}
class Code extends Prop {
  editedValue = "";
  /** @type {string[]} */
  errors = [];
  /** @type {number[]} */
  lineOffsets = [];
  /** @param {PropOptions} options */
  constructor(value = "", options = {}) {
    options = {
      language: "css",
      ...options
    };
    super(value, options);
  }
  /** @param {HTMLTextAreaElement} target */
  addLineNumbers = (target) => {
    const numberOfLines = target.value.split("\n").length;
    const lineNumbers = (
      /** @type {HTMLTextAreaElement} */
      target.previousElementSibling
    );
    const numbers = [];
    for (let ln2 = 1; ln2 <= numberOfLines; ln2++) {
      numbers.push(ln2);
    }
    lineNumbers.value = numbers.join("\n");
    const rows = Math.max(4, Math.min(10, numberOfLines));
    target.rows = rows;
    lineNumbers.rows = rows;
    lineNumbers.scrollTop = target.scrollTop;
  };
  /** @param {number} offset - where the error happened
   * @param {string} message - the error message
   */
  addError(offset, message) {
    const line = this._value.slice(0, offset).match(/$/gm)?.length || "??";
    this.errors.push(`${line}: ${message}`);
  }
  /** Edit and validate the value
   * */
  editCSS(props = {}, editSelector = (selector = "") => selector) {
    let value = this._value;
    for (const prop in props) {
      value = value.replaceAll("$" + prop, props[prop]);
    }
    this.errors = [];
    const editedRules = [];
    const ruleRE = /([\s\S]*?)({\s*[\s\S]*?}\s*)/dg;
    for (const ruleMatch of value.matchAll(ruleRE)) {
      let selector = ruleMatch[1];
      const indices = ruleMatch.indices;
      if (!indices) continue;
      const selectorOffset = indices[1][0];
      const body = ruleMatch[2];
      const bodyOffset = indices[2][0];
      selector = selector.replace(
        /#(\w+)/g,
        /** @param {string} _
         * @param {string} name */
        (_, name) => `data-${name.replace(
          /[A-Z]/g,
          (m2) => `-${m2.toLowerCase()}`
        )}`
      );
      selector = `#UI ${editSelector(selector)}`;
      const rule = selector + body;
      editedRules.push(rule);
      const styleSheet = validationSheet();
      try {
        let irule = Globals.state && Globals.state.interpolate(rule) || rule;
        const index = styleSheet.insertRule(irule.replace("}", ";gap:0;}"));
        const newRule = styleSheet.cssRules[index].cssText;
        const ruleRE2 = /([\s\S]*?)({\s*[\s\S]*?}\s*)/dg;
        const match2 = ruleRE2.exec(newRule);
        if (match2) {
          const newBody = match2[2];
          const propRE = /[-\w]+:/g;
          const newProperties = newBody.match(propRE);
          for (const propMatch of body.matchAll(propRE)) {
            if (!newProperties || newProperties.indexOf(propMatch[0]) < 0) {
              this.addError(
                bodyOffset + (propMatch.index || 0),
                `property ${propMatch[0]} is invalid`
              );
            }
          }
        } else {
          this.addError(selectorOffset, "Rule is invalid");
        }
      } catch (e2) {
        this.addError(selectorOffset, "Rule is invalid");
      }
    }
    this.editedValue = editedRules.join("");
  }
  input() {
    return this.labeled(
      html`<div class="Code">
        <div class="numbered-textarea">
          <textarea class="line-numbers" readonly name="numbers"></textarea>
          <textarea
            class="text"
            .value=${this._value}
            id=${this.id}
            @change=${({ target }) => {
        this._value = this.cast(target.value);
        this.editCSS();
        this.update();
      }}
            @keyup=${(event) => {
        this.addLineNumbers(event.target);
      }}
            @scroll=${({ target }) => {
        target.previousElementSibling.scrollTop = target.scrollTop;
      }}
            ref=${this.addLineNumbers}
            title=${this.options.title}
            placeholder=${this.options.placeholder}
          ></textarea>
        </div>
        <div class="errors">${this.errors.join("\n")}</div>
      </div>`
    );
  }
  /** @param {string} value */
  set(value) {
    this._value = value;
    this.editCSS();
  }
}
class Color extends Prop {
  /**
   * @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "white", options = {}) {
    options = {
      /** @param {string} value */
      validate: (value2) => {
        if (isValidColor(value2)) {
          const swatch = document.querySelector(`#${this.id}~div`);
          if (swatch instanceof HTMLDivElement) {
            swatch.style.backgroundColor = getColor(value2);
          }
          return "";
        }
        return "invalid color";
      },
      datalist: "ColorNames",
      ...options
    };
    super(value, options);
  }
  showValue() {
    return [
      html`<div
        class="swatch"
        style=${styleString({ backgroundColor: getColor(this.value) })}
      ></div>`
    ];
  }
}
class Voice extends Prop {
  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
  }
  input() {
    return this.labeled(
      html`<select
        is="select-voice"
        .value=${this._value}
        id=${this.id}
        @change=${(event) => {
        this._value = event.target.value;
        this.update();
      }}
      >
        <option value="">Default</option>
      </select>`
    );
  }
}
class ADate extends Prop {
  /** @param {string} value
   * @param {PropOptions} options
   */
  constructor(value = "", options = {}) {
    super(value, options);
  }
  input() {
    return this.labeled(
      html`<input
        type="date"
        .value=${this._value}
        id=${this.id}
        @change=${(event) => {
        this._value = event.target.value;
        this.update();
      }}
      />`
    );
  }
}
const debounce = (callback, wait2) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait2);
  };
};
const namesMap = {
  Action: ["Action", "Actions"],
  ActionCondition: ["Condition", "Actions#Condition"],
  Actions: ["Actions", "Actions"],
  ActionUpdate: ["Update", "Actions#Update"],
  Audio: ["Audio", "Audio"],
  Button: ["Button", "Button"],
  Content: ["Content", "Content"],
  CueCircle: ["Circle", "Cues"],
  CueCss: ["CSS", "Cues#CSS"],
  CueFill: ["Fill", "Cues#Fill"],
  CueList: ["Cues", "Cues"],
  CueOverlay: ["Overlay", "Cues#Overlay"],
  Customize: ["Customize", "Customize"],
  Designer: ["Designer", "Designer"],
  Display: ["Display", "Display"],
  Filter: ["Filter", "Patterns#Filter"],
  Gap: ["Gap", "Gap"],
  Grid: ["Grid", "Grid"],
  GridFilter: ["Filter", "Grid#Filter"],
  GroupBy: ["Group By", "Patterns#Group By"],
  HandlerCondition: ["Condition", "Methods#Condition"],
  HandlerKeyCondition: ["Key Condition", "Methods#Key Condition"],
  HandlerResponse: ["Response", "Methods#Response"],
  HeadMouse: ["Head Mouse", "Head Mouse"],
  KeyHandler: ["Key Handler", "Methods#Key Handler"],
  Layout: ["Layout", "Layout"],
  Logger: ["Logger", "Logger"],
  Method: ["Method", "Methods"],
  MethodChooser: ["Methods", "Methods"],
  ModalDialog: ["Modal Dialog", "Modal Dialog"],
  Option: ["Option", "Radio#Option"],
  OrderBy: ["Order By", "Patterns#Order By"],
  Page: ["Page", "Page"],
  PatternGroup: ["Group", "Patterns"],
  PatternList: ["Patterns", "Patterns"],
  PatternManager: ["Pattern", "Patterns"],
  PatternSelector: ["Selector", "Patterns"],
  PointerHandler: ["Pointer Handler", "Methods#Pointer Handler"],
  Radio: ["Radio", "Radio"],
  ResponderActivate: ["Activate", "Methods#Activate"],
  ResponderCue: ["Cue", "Methods#Cue"],
  ResponderClearCue: ["Clear Cue", "Methods#Clear Cue"],
  ResponderEmit: ["Emit", "Methods#Emit"],
  ResponderNext: ["Next", "Methods#Next"],
  ResponderStartTimer: ["Start Timer", "Methods"],
  SocketHandler: ["Socket Handler", "Methods#Socket Handler"],
  Speech: ["Speech", "Speech"],
  Stack: ["Stack", "Stack"],
  TabControl: ["Tab Control", "Tab Control"],
  TabPanel: ["Tab", "Tab"],
  Timer: ["Timer", "Methods#Timer"],
  TimerHandler: ["Timer Handler", "Methods#Timer Handler"],
  VSD: ["VSD", "VSD"]
};
function friendlyName(className2) {
  return className2 in namesMap ? namesMap[className2][0] : className2;
}
function wikiName(className2) {
  return namesMap[className2][1].replace(" ", "-");
}
class TreeBase {
  /** @type {TreeBase[]} */
  children = [];
  /** @type {TreeBase | undefined } */
  parent = void 0;
  /** @type {string[]} */
  allowedChildren = [];
  allowDelete = true;
  // every component has a unique id
  static treeBaseCounter = 0;
  id = `TreeBase-${TreeBase.treeBaseCounter++}`;
  settingsDetailsOpen = false;
  // map from id to the component
  /** @type {Map<string, TreeBase>} */
  static idMap = /* @__PURE__ */ new Map();
  /** @param {string} id
   * @returns {TreeBase | undefined } */
  static componentFromId(id) {
    const match2 = id.match(/TreeBase-\d+/);
    if (match2) {
      return this.idMap.get(match2[0]);
    }
    return void 0;
  }
  /** Remove this component and its children from the idMap
   * @param {TreeBase} component
   */
  static removeFromIdMap(component) {
    this.idMap.delete(component.id);
    for (const child of component.children) {
      this.removeFromIdMap(child);
    }
  }
  designer = {};
  /** A mapping from the external class name to the class */
  static nameToClass = /* @__PURE__ */ new Map();
  /** A mapping from the class to the external class name */
  static classToName = /* @__PURE__ */ new Map();
  /** @param {typeof TreeBase} cls
   * @param {string} externalName
   * */
  static register(cls, externalName) {
    this.nameToClass.set(externalName, cls);
    this.classToName.set(cls, externalName);
  }
  get className() {
    return TreeBase.classToName.get(this.constructor);
  }
  /**
   * Extract the class fields that are Props and return their values as an Object
   * @returns {Object<string, any>}
   */
  get propsAsObject() {
    return Object.fromEntries(
      Object.entries(this).filter(([_, prop]) => prop instanceof Prop).map(([name, prop]) => [name, prop.value])
    );
  }
  /**
   * Extract the values of the fields that are Props
   * @returns {Object<string, Props.Prop>}
   */
  get props() {
    return Object.fromEntries(
      Object.entries(this).filter(([_, prop]) => prop instanceof Prop)
    );
  }
  /**
   * Prepare a TreeBase tree for external storage by converting to simple objects and arrays
   * @param {Object} [options]
   * @param {string[]} options.omittedProps - class names of props to omit
   * @param {boolean} [options.includeIds] - true to include the ids
   * @returns {Object}
   * */
  toObject(options = { omittedProps: [] }) {
    const props = Object.fromEntries(
      Object.entries(this).filter(
        ([_, prop]) => prop instanceof Prop && !options.omittedProps.includes(prop.constructor.name)
      ).map(([name, prop]) => [name, prop.text])
    );
    const children = this.children.map((child) => child.toObject(options));
    const result = {
      className: this.className,
      props,
      children
    };
    if (options.includeIds) {
      result.id = this.id;
    }
    return result;
  }
  /**
   * An opportunity for the component to initialize itself. This is
   * called in fromObject after the children have been added. If you
   * call create directly you should call init afterward.
   */
  init() {
    for (const child of this.children) {
      const props = child.props;
      for (const instance of Object.values(props)) {
        if (instance instanceof OneOfGroup && instance._value) {
          instance.clearPeers();
          break;
        }
      }
    }
  }
  /**
   *   Create a TreeBase object
   *   @template {TreeBase} TB
   *   @param {string|(new()=>TB)} constructorOrName
   *   @param {TreeBase | null} parent
   *   @param {Object<string,string|number|boolean>} props
   *   @param {string} [id] - set the newly created id
   *   @returns {TB}
   *   */
  static create(constructorOrName, parent = null, props = {}, id = "") {
    const constructor = typeof constructorOrName == "string" ? TreeBase.nameToClass.get(constructorOrName) : constructorOrName;
    const result = new constructor();
    if (id) {
      result.id = id;
    }
    for (const [name, prop] of Object.entries(result.props)) {
      prop.initialize(name, props[name], result);
    }
    if (parent) {
      result.parent = parent;
      parent.children.push(result);
    }
    TreeBase.idMap.set(result.id, result);
    return result;
  }
  /**
   * Instantiate a TreeBase tree from its external representation
   * @param {Object} obj
   * @param {TreeBase | null} parent
   * @param {Object} [options]
   * @param {boolean} [options.useId]
   * @returns {TreeBase} - should be {this} but that isn't supported for some reason
   * */
  static fromObject(obj, parent = null, options = { useId: false }) {
    if (!obj) console.trace("fromObject", obj);
    const className2 = obj.className;
    const constructor = this.nameToClass.get(className2);
    if (!constructor) {
      console.trace("className not found", className2, obj);
      throw new Error("className not found");
    }
    const result = this.create(
      constructor,
      parent,
      obj.props,
      options.useId ? obj.id || "" : ""
    );
    for (const childObj of obj.children) {
      if (childObj instanceof TreeBase) {
        childObj.parent = result;
        result.children.push(childObj);
      } else {
        TreeBase.fromObject(childObj, result, options);
      }
    }
    result.init();
    if (result instanceof this) return result;
    console.error("expected", this);
    console.error("got", result);
    throw new Error(`fromObject failed`);
  }
  /**
   * Signal nodes above that something has been updated
   */
  update() {
    let start2 = this;
    let p2 = start2;
    while (p2) {
      p2.onUpdate(start2);
      p2 = p2.parent;
    }
  }
  /**
   * Called when something below is updated
   * @param {TreeBase} _start
   */
  onUpdate(_start) {
  }
  /**
   * Render the designer interface and return the resulting Hole
   * @returns {Hole}
   */
  settings() {
    const detailsId = this.id + "-details";
    const settingsId = this.id + "-settings";
    let focused = false;
    return html`<div class="settings">
      <details
        class=${this.className}
        id=${detailsId}
        @click=${(event) => {
      if (!focused && event.target instanceof HTMLElement && event.target.parentElement instanceof HTMLDetailsElement && event.target.parentElement.open && event.pointerId >= 0) {
        event.preventDefault();
      }
    }}
        @toggle=${(event) => {
      if (event.target instanceof HTMLDetailsElement)
        this.settingsDetailsOpen = event.target.open;
    }}
      >
        <summary
          id=${settingsId}
          @pointerdown=${(event) => {
      focused = event.target == document.activeElement;
    }}
        >
          ${this.settingsSummary()}
        </summary>
        ${this.settingsDetails()}
      </details>
      ${this.settingsChildren()}
    </div>`;
  }
  /**
   * Render the summary of a components settings
   * @returns {Hole}
   */
  settingsSummary() {
    const name = Object.prototype.hasOwnProperty.call(this, "name") ? this["name"].value : "";
    return html`<h3>${friendlyName(this.className)} ${name}</h3>`;
  }
  /**
   * Render the details of a components settings
   * @returns {Hole[]}
   */
  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    return inputs;
  }
  /**
   * @returns {Hole}
   */
  settingsChildren() {
    return this.orderedChildren();
  }
  /**
   * Render the user interface and return the resulting Hole
   * @returns {Hole}
   */
  template() {
    return html`<div />`;
  }
  /**
   * Render the user interface catching errors and return the resulting Hole
   * @returns {Hole}
   */
  safeTemplate() {
    try {
      return this.template();
    } catch (error) {
      errorHandler(error, ` safeTemplate ${this.className}`);
      let classes = [this.className.toLowerCase()];
      classes.push("error");
      return html`<div class=${classes.join(" ")} id=${this.id}>ERROR</div>`;
    }
  }
  /** @typedef {Object} ComponentAttrs
   * @property {string[]} [classes]
   * @property {Object} [style]
   */
  /**
   * Wrap the body of a component
   *
   * @param {ComponentAttrs} attrs
   * @param {Hole|Hole[]} body
   * @returns {Hole}
   */
  component(attrs, body) {
    attrs = { style: {}, ...attrs };
    let classes = [this.className.toLowerCase()];
    if ("classes" in attrs) {
      classes = classes.concat(attrs.classes);
    }
    if (!Array.isArray(body)) body = [body];
    const props = this.props;
    const data2 = {
      ComponentType: this.className
    };
    const name = "name" in props && props["name"].value || "";
    if (name) {
      data2["ComponentName"] = name;
    }
    return html`<div
      class=${classes.join(" ")}
      id=${this.id}
      style=${styleString(attrs.style)}
      data=${data2}
    >
      ${body}
    </div>`;
  }
  /**
   * Swap two of my children
   * @param {number} i
   * @param {number} j
   */
  swap(i, j) {
    const A = this.children;
    [A[i], A[j]] = [A[j], A[i]];
  }
  /**
   * Move me to given position in my parent
   * @param {number} i
   */
  moveTo(i) {
    const peers = this.parent?.children || [];
    peers.splice(this.index, 1);
    peers.splice(i, 0, this);
  }
  /**
   * Move me up or down by 1 position if possible
   * @param {boolean} up
   */
  moveUpDown(up) {
    const parent = this.parent;
    if (!parent) return;
    const peers = parent.children;
    if (peers.length > 1) {
      const index = this.index;
      const step = up ? -1 : 1;
      if (up && index > 0 || !up && index < peers.length - 1) {
        parent.swap(index, index + step);
      }
    }
  }
  /**
   * Get the index of this component in its parent
   * @returns {number}
   */
  get index() {
    return this.parent && this.parent.children.indexOf(this) || 0;
  }
  /**
   *  * Remove this child from their parent and return the id of the child to receive focus
   *  @returns {string}
   *  */
  remove() {
    if (!this.parent) return "";
    const peers = this.parent.children;
    const index = peers.indexOf(this);
    const parent = this.parent;
    this.parent = void 0;
    peers.splice(index, 1);
    TreeBase.removeFromIdMap(this);
    if (peers.length > index) {
      return peers[index].id;
    } else if (peers.length > 0) {
      return peers[peers.length - 1].id;
    } else {
      return parent.id;
    }
  }
  /**
   * Create HTML LI nodes from the children
   */
  listChildren(children = this.children) {
    return children.map((child) => html`<li>${child.settings()}</li>`);
  }
  /**
   * Create an HTML ordered list from the children
   */
  orderedChildren(children = this.children) {
    return html`<ol>
      ${this.listChildren(children)}
    </ol>`;
  }
  /**
   * Create an HTML unordered list from the children
   * */
  unorderedChildren(children = this.children) {
    return html`<ul>
      ${this.listChildren(children)}
    </ul>`;
  }
  /**
   * Return the nearest parent of the given type
   * @template T
   * @param {new() => T} type
   * @returns {T}
   * */
  nearestParent(type) {
    let p2 = this.parent;
    while (p2) {
      if (p2 instanceof type) {
        return p2;
      }
      p2 = p2.parent;
    }
    throw new Error("No such parent");
  }
  /**
   * Filter children by their type
   * @template T
   * @param {new() => T} type
   * @returns {T[]}
   */
  filterChildren(type) {
    const result = [];
    for (const child of this.children) {
      if (child instanceof type) {
        result.push(child);
      }
    }
    return result;
  }
  /** @param {string[]} classes
   * @returns {string}
   */
  CSSClasses(...classes) {
    return classes.join(" ");
  }
}
class TreeBaseSwitchable extends TreeBase {
  init() {
    super.init();
    for (const prop of Object.values(this.props)) {
      if (prop instanceof TypeSelect) {
        if (!prop.value) {
          prop.set(this.className);
        }
      }
    }
  }
  /** Replace this node with one of a compatible type
   * @param {string} className
   * @param {Object} [props] - used in undo to reset the props
   * */
  replace(className2, props) {
    if (!this.parent) return;
    if (this.className == className2) return;
    let update2 = true;
    if (!props) {
      props = Object.fromEntries(
        Object.entries(this).filter(([_, prop]) => prop instanceof Prop).map(([name, prop]) => [name, prop.value])
      );
    } else {
      update2 = false;
    }
    const replacement = TreeBase.create(className2, null, props);
    replacement.init();
    if (!(replacement instanceof TreeBaseSwitchable)) {
      throw new Error(
        `Invalid TreeBaseSwitchable replacement ${this.className} ${replacement.className}`
      );
    }
    const index = this.parent.children.indexOf(this);
    this.parent.children[index] = replacement;
    replacement.parent = this.parent;
    if (update2) {
      this.update();
    }
  }
}
class Messages extends TreeBase {
  /** @type {string[]} */
  messages = [];
  template() {
    if (this.messages.length) {
      const result = html`<div id="messages">
        ${this.messages.map((message) => html`<p>${message}</p>`)}
      </div> `;
      this.messages = [];
      return result;
    } else {
      return html`<div />`;
    }
  }
  report(message = "") {
    console.log({ message });
    this.messages.push(message);
  }
}
function reportInternalError(msg, trace) {
  const result = document.createElement("div");
  result.id = "ErrorReport";
  function copyToClipboard() {
    const html2 = document.getElementById("ErrorReportBody")?.innerHTML || "";
    const blob = new Blob([html2], { type: "text/html" });
    const data2 = [new ClipboardItem({ "text/html": blob })];
    navigator.clipboard.write(data2);
  }
  function dismiss() {
    document.getElementById("ErrorReport")?.remove();
  }
  result.innerHTML = `<h1>Internal Error</h1>
      <p>
        Your browser has detected an internal error in OS-DPI. It was very
        likely caused by our program bug. We hope you will help us by sending a
        report of the information below. Simply click this button
        <button id="errorCopy">
          Copy report to clipboard
        </button>
        and then paste into an email to
        <a
          href="mailto:gb@cs.unc.edu?subject=OS-DPI Error Report"
          target="email"
          >gb@cs.unc.edu</a
        >.
        <button id="errorDismiss">
          Dismiss this dialog
        </button>
      </p>
      <div id="ErrorReportBody">
        <h2>Error Report</h2>
        <p>${msg}</p>
        <h2>Stack Trace</h2>
        <ul>
          ${trace.map((s2) => `<li>${s2}</li>`).join("")}
        </ul>
      </div>
    </div>`;
  document.body.prepend(result);
  document.getElementById("errorCopy")?.addEventListener("click", copyToClipboard);
  document.getElementById("errorDismiss")?.addEventListener("click", dismiss);
  document.dispatchEvent(new Event("internalerror"));
}
window.onerror = async function(msg, _file, _line, _col, error) {
  console.error("onerror", msg, error);
  if (error instanceof Error) {
    try {
      const frames = await stacktraceExports.fromError(error);
      const trace = frames.map((frame) => `${frame.toString()}`);
      reportInternalError(msg.toString(), trace);
    } catch (e2) {
      const msg2 = `Caught an error trying to report an error.
        The original message was "${msg.toString()}".
        With file=${_file} line=${_line} column=${_col}
        error=${error.toString()}`;
      reportInternalError(msg2, []);
    }
  }
};
function errorHandler(error, extra = "") {
  let stack = [];
  let cause = `${error.name}${extra}`;
  if (error.stack) {
    const errorLines = error.stack.split("\n");
    stack = errorLines.slice(1);
    cause = errorLines[0] + extra;
  }
  reportInternalError(cause, stack);
}
window.onunhandledrejection = function(error) {
  console.error("onunhandlederror", error);
  error.preventDefault();
  reportInternalError(
    error.reason.message,
    error.reason.stack?.split("\n") || ["no stack"]
  );
};
class GridFilter extends TreeBase {
  field = new Field({ hiddenLabel: true });
  operator = new Select(Object.keys(comparators), { hiddenLabel: true });
  value = new Expression("", { hiddenLabel: true });
  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
  /** Format the settings
   * @param {GridFilter[]} filters
   * @return {Hole}
   */
  static FilterSettings(filters2) {
    let table;
    if (filters2.length > 0) {
      table = html`
        <table class="GridFilter">
          <thead>
            <tr>
              <th>#</th>
              <th>Field</th>
              <th>Operator</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${filters2.map(
        (filter2, index) => html`
                <tr id=${filter2.id + "-settings"}>
                  <td>${index + 1}</td>
                  <td>
                    ${filter2.operator.value.startsWith("only") ? "" : filter2.field.input()}
                  </td>
                  <td>${filter2.operator.input()}</td>
                  <td>${filter2.value.input()}</td>
                </tr>
              `
      )}
          </tbody>
        </table>
      `;
    } else {
      table = html`<div />`;
    }
    return html`<fieldset>
      <legend>Filters</legend>
      ${table}
    </fieldset>`;
  }
  /** Convert from Props to values for data module
   * @param {GridFilter[]} filters
   */
  static toContentFilters(filters2) {
    return filters2.map((child) => ({
      field: child.field.value,
      operator: child.operator.value,
      value: child.value.value
    }));
  }
}
TreeBase.register(GridFilter, "GridFilter");
const collator = new Intl.Collator("en", { sensitivity: "base" });
const collatorNumber = new Intl.Collator("en", { numeric: true });
const comparators = {
  equals: (f2, v2) => collator.compare(f2, v2) === 0 || f2 === "*" || v2 === "*",
  "starts with": (f2, v2) => f2.toUpperCase().startsWith(v2.toUpperCase()),
  empty: (f2) => !f2,
  contains: (f2, v2) => f2.toLowerCase().includes(v2.toLowerCase()),
  is_contained_in: (f2, v2) => v2.toLowerCase().includes(f2.toLowerCase()),
  "not empty": (f2) => !!f2,
  "less than": (f2, v2) => collatorNumber.compare(f2, v2) < 0,
  "greater than": (f2, v2) => collatorNumber.compare(f2, v2) > 0,
  "less or equal": (f2, v2) => collatorNumber.compare(f2, v2) <= 0,
  "greater or equal": (f2, v2) => collatorNumber.compare(f2, v2) >= 0,
  "only first": (_f, _v) => true,
  "only last": (_f, _v) => true
};
function match(filter2, row) {
  const field = row[filter2.field.slice(1)] || "";
  let value = filter2.value || "";
  const comparator2 = comparators[filter2.operator];
  if (!comparator2) return true;
  let r = comparator2(field.toString(), value.toString());
  return r;
}
class Data {
  /** @param {Rows} rows - rows coming from the spreadsheet */
  constructor(rows) {
    this.contentRows = [];
    this.dynamicRows = [];
    this.noteRows = [];
    this.groups = ["dynamicRows", "contentRows", "noteRows"];
    this.allFields = /* @__PURE__ */ new Set();
    this.setContent(rows);
  }
  /** @param {Rows} rows - rows coming from the spreadsheet */
  setContent(rows) {
    this.contentRows = Array.isArray(rows) && rows || [];
    this.updateAllFields();
  }
  /**
   * Add rows from the socket interface
   * @param {Rows} rows
   */
  setDynamicRows(rows) {
    if (!Array.isArray(rows)) return;
    this.dynamicRows = rows;
    this.updateAllFields();
  }
  /**
   * Add rows of notes
   * @param {Rows} rows
   */
  setNoteRows(rows) {
    if (!Array.isArray(rows)) return;
    this.noteRows = rows;
    this.updateAllFields();
  }
  get length() {
    let result = 0;
    for (const group of this.groups) {
      result += this[group].length;
    }
    return result;
  }
  updateAllFields() {
    const allFields = /* @__PURE__ */ new Set();
    for (const group of this.groups) {
      for (const row of this[group]) {
        for (const field of Object.keys(row)) {
          allFields.add("#" + field);
        }
      }
    }
    this.allFields = allFields;
    this.clearFields = {};
    for (const field of this.allFields) {
      this.clearFields[field.slice(1)] = null;
    }
  }
  /**
   * Extract rows with the given filters
   *
   * @param {GridFilter[]} filters - each filter must return true
   * @param {boolean} [clearFields] - return null for undefined fields
   * @return {Rows} Rows that pass the filters
   */
  getMatchingRows(filters2, clearFields = true) {
    const boundFilters = filters2.map((filter2) => ({
      field: filter2.field.value,
      operator: filter2.operator.value,
      value: filter2.value.value
    }));
    let result = [...this.dynamicRows, ...this.contentRows, ...this.noteRows];
    for (const filter2 of boundFilters) {
      if (filter2.operator == "only first") {
        const limit = filter2.value;
        if (typeof limit == "number") result = result.slice(0, limit);
      } else if (filter2.operator == "only last") {
        const limit = filter2.value;
        if (typeof limit == "number") result = result.slice(-limit);
      } else {
        result = result.filter((row) => match(filter2, row));
      }
    }
    if (clearFields)
      result = result.map((row) => ({ ...this.clearFields, ...row }));
    return result;
  }
  /**
   * Test if any rows exist after filtering
   *
   * @param {GridFilter[]} filters
   * @param {EvalContext} context
   * @return {Boolean} true if tag combination occurs
   */
  hasMatchingRows(filters2, context) {
    const boundFilters = filters2.map((filter2) => ({
      field: filter2.field.value,
      operator: filter2.operator.value,
      value: filter2.value.valueInContext(context)
    }));
    for (const group of this.groups) {
      for (const row of this[group]) {
        if (boundFilters.every((filter2) => match(filter2, row))) {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Manipulate the Notes rows
   * @param {string[]} args
   * @returns {string} - the id
   */
  Notes(args) {
    function ClipText(text2, length = 100) {
      const nl_index = text2.indexOf("\n");
      if (nl_index > 0 && nl_index < length) length = nl_index;
      return text2.slice(0, length);
    }
    if (args.length % 2 != 0) {
      console.error("number of args must be multiple of 2");
      return "";
    }
    const note = {};
    for (let i = 0; i < args.length; i += 2) {
      const field = args[i + 0];
      if (!field.match(/^#\w+$/)) {
        console.error("bad field", field);
        return "";
      }
      const value = args[i + 1];
      note[field.slice(1)] = value;
    }
    note["sheetName"] = "Notes";
    let ID = note["ID"];
    if (ID) {
      if (!note["label"] && note["text"]) {
        note["label"] = ClipText(note["text"]);
      }
      const index = this.noteRows.findIndex((row) => row.ID == ID);
      if (index >= 0) {
        Object.assign(this.noteRows[index], note);
      } else {
        console.error("note not found");
        return "";
      }
    } else if (note.DELETE) {
      const index = this.noteRows.findIndex((row) => row.ID == note.DELETE);
      if (index >= 0) {
        this.noteRows.splice(index, 1);
        return "";
      } else {
        console.error("delete id not found");
        return "";
      }
    } else {
      ID = (/* @__PURE__ */ new Date()).toISOString();
      note["ID"] = ID;
      if (!note["label"] && note["text"]) {
        note["label"] = ClipText(note["text"]);
      }
      this.noteRows.push(note);
    }
    return ID;
  }
}
const e = Object.assign || ((e2, t2) => (t2 && Object.keys(t2).forEach((o2) => e2[o2] = t2[o2]), e2)), t = (e2, r, s2) => {
  const c2 = typeof s2;
  if (s2 && "object" === c2) if (Array.isArray(s2)) for (const o2 of s2) r = t(e2, r, o2);
  else for (const c3 of Object.keys(s2)) {
    const f2 = s2[c3];
    "function" == typeof f2 ? r[c3] = f2(r[c3], o) : void 0 === f2 ? e2 && !isNaN(c3) ? r.splice(c3, 1) : delete r[c3] : null === f2 || "object" != typeof f2 || Array.isArray(f2) ? r[c3] = f2 : "object" == typeof r[c3] ? r[c3] = f2 === r[c3] ? f2 : o(r[c3], f2) : r[c3] = t(false, {}, f2);
  }
  else "function" === c2 && (r = s2(r, o));
  return r;
}, o = (o2, ...r) => {
  const s2 = Array.isArray(o2);
  return t(s2, s2 ? o2.slice() : e({}, o2), r);
};
let State$1 = class State {
  constructor(persistKey = "") {
    this.persistKey = persistKey;
    this.listeners = /* @__PURE__ */ new Set();
    this.values = {};
    this.updated = /* @__PURE__ */ new Set();
    if (this.persistKey) {
      const persist = window.sessionStorage.getItem(this.persistKey);
      if (persist) {
        this.values = JSON.parse(persist);
      }
    }
  }
  /** unified interface to state
   * @param {string} [name] - possibly dotted path to a value
   * @param {any} defaultValue
   * @returns {any}
   */
  get(name, defaultValue = "") {
    if (name && name.length) {
      return name.split(".").reduce((o2, p2) => o2 ? o2[p2.trim()] : defaultValue, this.values);
    } else {
      return void 0;
    }
  }
  /**
   * update the state with a patch and invoke any listeners
   *
   * @param {Object} patch - the changes to make to the state
   * @return {void}
   */
  update(patch = {}) {
    for (const key in patch) {
      this.updated.add(key);
    }
    this.values = o(this.values, patch);
    for (const callback of this.listeners) {
      callback();
    }
    if (this.persistKey) {
      const persist = JSON.stringify(this.values);
      window.sessionStorage.setItem(this.persistKey, persist);
    }
  }
  /**
   * return a new state with the patch applied
   * @param {Object} patch - changes to apply
   * @return {State} - new independent state
   */
  clone(patch = {}) {
    const result = new State();
    result.values = o(this.values, patch);
    return result;
  }
  /** clear - reset the state
   */
  clear() {
    const userState = Object.keys(this.values).filter(
      (name) => name.startsWith("$")
    );
    const patch = Object.fromEntries(
      userState.map((name) => [name, void 0])
    );
    this.update(patch);
  }
  /** observe - call this function when the state updates
   * @param {Function} callback
   */
  observe(callback) {
    this.listeners.add(callback);
  }
  /** return true if the given state has been upated on this cycle
   * @param {string} stateName
   * @returns boolean
   */
  hasBeenUpdated(stateName) {
    return this.updated.has(stateName);
  }
  /** clear updated for the next cycle
   */
  clearUpdated() {
    this.updated.clear();
  }
  /** define - add a named state to the global system state
   * @param {String} name - name of the state
   * @param {any} defaultValue - value if not already defined
   */
  define(name, defaultValue) {
    if (typeof this.values[name] === "undefined") {
      this.values[name] = defaultValue;
    }
  }
  /** interpolate
   * @param {string} input
   * @returns {string} input with $name replaced by values from the state
   */
  interpolate(input) {
    let result = input.replace(
      /(\$[a-zA-Z0-9_.]+)/g,
      (_, name) => this.get(name)
    );
    result = result.replace(
      /\$\{([a-zA-Z0-9_.]+)}/g,
      (_, name) => this.get("$" + name)
    );
    return result;
  }
};
class StackContainer extends TreeBase {
  direction = new Select(["row", "column"], { defaultValue: "column" });
  background = new Color("");
  allowedChildren = [
    "Stack",
    "Gap",
    "Grid",
    "Display",
    "Radio",
    "TabControl",
    "VSD",
    "Button"
  ];
  /** @returns {Hole} */
  template() {
    function getScale(child) {
      const SCALE_MIN = 0;
      let scale = +child["scale"]?.value;
      if (!scale || scale < SCALE_MIN) {
        scale = SCALE_MIN;
      }
      return scale;
    }
    const scaleSum = this.children.reduce(
      (sum, child) => sum + getScale(child),
      0
    );
    const empty2 = this.children.length && scaleSum ? "" : "empty";
    const direction = this.direction.value;
    const dimension = direction == "row" ? "width" : "height";
    return this.component(
      {
        classes: [this.CSSClasses(direction, empty2)],
        style: {
          backgroundColor: this.background.value
        }
      },
      this.children.map((child) => {
        let size = 100 * getScale(child) / scaleSum;
        if (Number.isNaN(size)) size = 0;
        return html`<div
          style=${styleString({
          [dimension]: `${size}%`
        })}
        >
          ${child.safeTemplate()}
        </div>`;
      })
    );
  }
}
class Stack extends StackContainer {
  scale = new Float(1);
}
TreeBase.register(Stack, "Stack");
class Page extends StackContainer {
  // you can't delete the page
  allowDelete = false;
  constructor() {
    super();
    this.allowedChildren = this.allowedChildren.concat(
      "Speech",
      "Audio",
      "Logger",
      "ModalDialog",
      "Customize",
      "HeadMouse"
    );
  }
}
StackContainer.register(Page, "Page");
function formatSlottedString(msg) {
  if (typeof msg === "string") {
    return msg.split(/(\$\$.*?\$\$)/).map((part) => {
      const m2 = part.match(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/);
      if (m2) {
        return html`<b>${m2.groups?.value || ""}</b>`;
      } else {
        return html`<span>${part}</span>`;
      }
    });
  } else if (typeof msg === "object" && msg.type === "editor") {
    let editor = msg;
    let i = 0;
    return editor.message.split(/(\$\$.*?\$\$)/).map((part) => {
      const m2 = part.match(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/);
      if (m2) {
        if (i === editor.slotIndex) {
          return html`<b>${editor.slots[i++].value}</b>`;
        } else {
          return html`<span
            >${editor.slots[i++].value.replace(/^\*/, "")}</span
          >`;
        }
      }
      return html`<span>${part}</span>`;
    });
  } else {
    return [];
  }
}
function toString(value) {
  value ??= "";
  if (typeof value === "string") {
    value = value.replaceAll(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/g, "$2");
    return value;
  } else if (typeof value === "object" && value.type === "editor") {
    let editor = value;
    let i = 0;
    const parts = editor.message.split(/(\$\$.*?\$\$)/).map((part) => {
      const m2 = part.match(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/);
      if (m2) {
        return editor.slots[i++].value.replace(/^\*/, "");
      }
      return part;
    });
    return parts.join("");
  }
  return value.toString();
}
function hasSlots(message) {
  if (message instanceof Object && message.type === "editor") {
    return message.slots.length > 0;
  } else if (typeof message == "string") return message.indexOf("$$") >= 0;
  return false;
}
function init(message) {
  message = message || "";
  const slots = Array.from(
    message.matchAll(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/g)
  ).map((m2) => m2.groups);
  let result = {
    type: "editor",
    message,
    slots,
    slotIndex: 0,
    slotName: slots[0] && slots[0].name || ""
  };
  return result;
}
function cancel() {
  return {
    type: "editor",
    message: "",
    slots: [],
    slotIndex: 0,
    slotName: ""
  };
}
function update(message) {
  message ??= "";
  return (old) => {
    if (!old || !old.slots) {
      return "";
    }
    const slots = [...old.slots];
    let slotIndex = old.slotIndex;
    if (message.startsWith("*")) {
      slots[slotIndex].value = message;
    } else {
      if (slots[slotIndex].value.startsWith("*")) {
        slots[slotIndex].value = `${slots[slotIndex].value} ${message}`;
      } else {
        slots[slotIndex].value = message;
      }
      slotIndex++;
      if (slotIndex >= slots.length) {
        Globals.actions.queueEvent("okSlot", "press");
      }
    }
    return o(old, {
      slots,
      slotIndex,
      slotName: slots[slotIndex]?.name
    });
  };
}
function nextSlot() {
  return (old) => {
    if (!old || !old.slots) return;
    const slotIndex = old.slotIndex + 1;
    if (slotIndex >= old.slots.length) {
      Globals.actions.queueEvent("okSlot", "press");
    }
    return o(old, { slotIndex, slotName: old.slots[slotIndex]?.name });
  };
}
function duplicate() {
  return (old) => {
    if (!old || !old.slots) return;
    const matches = Array.from(
      old.message.matchAll(/\$\$(?<name>.*?)=(?<value>.*?)\$\$/g)
    );
    const current = matches[old.slotIndex];
    if (current !== void 0 && current.index !== void 0) {
      const message = old.message.slice(0, current.index) + current[0] + " and " + current[0] + old.message.slice(current.index + current[0].length);
      const slots = [
        ...old.slots.slice(0, old.slotIndex + 1),
        { ...old.slots[old.slotIndex] },
        // copy it
        ...old.slots.slice(old.slotIndex + 1)
      ];
      return o(old, {
        message,
        slots
      });
    } else {
      return old;
    }
  };
}
function slotName(message) {
  if (typeof message === "object" && message.type === "editor") {
    return message.slotName;
  }
  return "";
}
{
  Functions["slots"] = {
    init,
    cancel,
    update,
    hasSlots,
    duplicate,
    nextSlot,
    slotName,
    toString
  };
}
function imageOrVideo(src, title, onload = null) {
  const match2 = /(?<src>.*\.(?:mp4|webm))(?<options>.*$)/.exec(src);
  if (match2 && match2.groups) {
    const options = match2.groups.options;
    const vsrc = match2.groups.src;
    return html`<video
      is="video-db"
      dbsrc=${vsrc}
      title=${title}
      ?loop=${options.indexOf("loop") >= 0}
      ?autoplay=${options.indexOf("autoplay") >= 0}
      ?muted=${options.indexOf("muted") >= 0}
      @load=${onload}
    />`;
  } else {
    return html`<img
      is="img-db"
      dbsrc=${src}
      title=${title}
      @load=${onload}
    />`;
  }
}
class Grid extends TreeBase {
  fillItems = new Boolean$1(false);
  rows = new Integer(3, { min: 1 });
  columns = new Integer(3, { min: 1 });
  scale = new Float(1);
  name = new String$1("grid");
  background = new Color("white");
  allowedChildren = ["GridFilter"];
  /** @type {GridFilter[]} */
  children = [];
  page = 1;
  pageBoundaries = { 0: 0 };
  //track starting indices of pages
  /** @param {Row} item */
  gridCell(item) {
    const name = this.name.value;
    let content;
    let msg = formatSlottedString(item.label || "");
    if (item.symbol) {
      content = [
        html`<div>
          <figure>
            ${imageOrVideo(item.symbol, item.label || "")}
            <figcaption>${msg}</figcaption>
          </figure>
        </div>`
      ];
    } else {
      content = msg;
    }
    return html`<button
      tabindex="-1"
      data=${{
      ...item,
      ComponentName: name,
      ComponentType: this.className
    }}
      ?disabled=${!item.label && !item.symbol}
    >
      ${content}
    </button>`;
  }
  emptyCell() {
    return html`<button tabindex="-1" disabled></button>`;
  }
  /**
   * Allow selecting pages in the grid
   *
   * @param {Number} pages
   * @param {Row} info
   */
  pageSelector(pages, info) {
    const { state: state2 } = Globals;
    const background = this.background.value;
    const name = this.name.value;
    return html`<div class="page-control">
      <div class="text">Page ${this.page} of ${pages}</div>
      <div class="back-next">
        <button
          style=${styleString({ backgroundColor: background })}
          .disabled=${this.page == 1}
          data=${{
      ...info,
      ComponentName: name,
      ComponentType: this.className
    }}
          click
          @Activate=${() => {
      this.page = ((this.page - 2) % pages + pages) % pages + 1;
      state2.update();
    }}
          tabindex="-1"
        >
          &#9754;</button
        ><button
          .disabled=${this.page == pages}
          data=${{
      ...info,
      ComponentName: name,
      ComponentType: this.className
    }}
          click
          @Activate=${() => {
      this.page = this.page % pages + 1;
      state2.update();
    }}
          tabindex="-1"
        >
          &#9755;
        </button>
      </div>
    </div>`;
  }
  template() {
    const style2 = { backgroundColor: this.background.value };
    const { data: data2 } = Globals;
    let rows = Math.max(1, this.rows.value);
    let columns = Math.max(1, this.columns.value);
    let fillItems = this.fillItems.value;
    let items = data2.getMatchingRows(this.children);
    let maxPage = 1;
    const result = [];
    if (!fillItems) {
      let maxRow = 0, maxColumn = 0;
      const itemMap = /* @__PURE__ */ new Map();
      const itemKey = (row, column) => row * 1e3 + column;
      for (const item of items) {
        if (!item.row || !item.column) continue;
        maxPage = Math.max(maxPage, item.page || 1);
        if (this.page == (item.page || 1)) {
          maxRow = Math.max(maxRow, item.row);
          maxColumn = Math.max(maxColumn, item.column);
          const key = itemKey(item.row, item.column);
          if (!itemMap.has(key)) itemMap.set(key, item);
        }
      }
      rows = maxRow;
      columns = maxColumn;
      for (let row = 1; row <= rows; row++) {
        for (let column = 1; column <= columns; column++) {
          if (maxPage > 1 && row == rows && column == columns) {
            result.push(this.pageSelector(maxPage, { row, column }));
          } else {
            const key = itemKey(row, column);
            if (itemMap.has(key)) {
              result.push(this.gridCell(itemMap.get(key)));
            } else {
              result.push(this.emptyCell());
            }
          }
        }
      }
    } else {
      let perPage = rows * columns;
      if (items.length > perPage) {
        perPage = perPage - 1;
      }
      maxPage = Math.ceil(items.length / perPage);
      items = items.slice((this.page - 1) * perPage, this.page * perPage);
      for (let i = 0; i < items.length; i++) {
        const row = Math.floor(i / columns) + 1;
        const column = i % columns + 1;
        const item = { ...items[i], row, column };
        result.push(this.gridCell({ ...item, row, column }));
      }
      for (let i = items.length; i < perPage; i++) {
        result.push(this.emptyCell());
      }
      if (maxPage > 1) {
        result.push(this.pageSelector(maxPage, { row: rows, column: columns }));
      }
    }
    if (!result.length) {
      rows = columns = 1;
      result.push(this.emptyCell());
    }
    style2.gridTemplate = `repeat(${rows}, calc(100% / ${rows})) / repeat(${columns}, 1fr)`;
    const body = html`<div style=${styleString(style2)}>${result}</div>`;
    return this.component({}, body);
  }
  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    const filters2 = GridFilter.FilterSettings(this.children);
    return [html`<div>${filters2}${inputs}</div>`];
  }
  settingsChildren() {
    return html`<div />`;
  }
}
TreeBase.register(Grid, "Grid");
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/OS-DPI/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err2) {
    const e2 = new Event("vite:preloadError", {
      cancelable: true
    });
    e2.payload = err2;
    window.dispatchEvent(e2);
    if (!e2.defaultPrevented) {
      throw err2;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
async function readSheetFromBlob(blob) {
  const XLSX = await __vitePreload(() => import("./xlsx.js"), true ? [] : void 0);
  const data2 = await blob.arrayBuffer();
  const workbook = XLSX.read(data2, { codepage: 65001 });
  const dataArray = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet2 = workbook.Sheets[sheetName];
    const ref2 = sheet2["!ref"];
    if (!ref2) continue;
    const range2 = XLSX.utils.decode_range(ref2);
    const names = [];
    const handlers = [];
    const validColumns = [];
    for (let c2 = range2.s.c; c2 <= range2.e.c; c2++) {
      let columnName = sheet2[XLSX.utils.encode_cell({ r: 0, c: c2 })]?.v;
      if (typeof columnName !== "string" || !columnName) {
        continue;
      }
      columnName = columnName.toLowerCase();
      names.push(columnName.trim(" "));
      validColumns.push(c2);
      switch (columnName) {
        case "row":
        case "column":
        case "page":
          handlers.push("number");
          break;
        default:
          handlers.push("string");
          break;
      }
    }
    for (let r = range2.s.r + 1; r <= range2.e.r; r++) {
      const row = { sheetName };
      for (let i = 0; i < validColumns.length; i++) {
        const name = names[i];
        const c2 = validColumns[i];
        let value = sheet2[XLSX.utils.encode_cell({ r, c: c2 })]?.v;
        switch (handlers[i]) {
          case "string":
            if (typeof value === "undefined") {
              value = "";
            }
            if (typeof value !== "string") {
              value = value.toString(10);
            }
            if (value && typeof value === "string") {
              row[name] = value;
            }
            break;
          case "number":
            if (typeof value === "number") {
              row[name] = Math.floor(value);
            } else if (value && typeof value === "string") {
              value = parseInt(value, 10);
              if (isNaN(value)) {
                value = 0;
              }
              row[name] = value;
            }
            break;
        }
      }
      if (Object.keys(row).length > 1) dataArray.push(row);
    }
  }
  return dataArray;
}
async function saveContent(name, rows, type) {
  const XLSX = await __vitePreload(() => import("./xlsx.js"), true ? [] : void 0);
  const sheetNames = new Set(rows.map((row) => row.sheetName || "sheet1"));
  const workbook = XLSX.utils.book_new();
  for (const sheetName of sheetNames) {
    let sheetRows = rows.filter(
      (row) => sheetName == (row.sheetName || "sheet1")
    );
    {
      sheetRows = sheetRows.map((row) => {
        const { sheetName: sheetName2, ...rest } = row;
        return rest;
      });
    }
    const worksheet = XLSX.utils.json_to_sheet(sheetRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }
  XLSX.writeFileXLSX(workbook, `${name}.${type}`);
}
Object.assign(Functions, {
  Notes: (...args) => {
    const result = Globals.data.Notes(args);
    db.write("notes", Globals.data.noteRows);
    return result;
  },
  SaveNotes: () => {
    saveContent("notes", Globals.data.noteRows, "xlsx");
    return "saved";
  },
  /** @param {string} name
   * @param {string} text
   */
  SaveText: (name, text2) => {
    const blob = new Blob([text2], { type: "text/plain" });
    o$1(blob, { fileName: name, extensions: [".txt"], id: "osdpi" });
  },
  add_letter: updateString(add_character),
  ClipText: (text2 = "", length = 100) => {
    const nl_index = text2.indexOf("\n");
    if (nl_index > 0 && nl_index < length) length = nl_index;
    return text2.slice(0, length);
  },
  Caret: updateString(setCaret)
});
function insert(old, index, char) {
  if (index < 0) {
    return old + char;
  } else {
    return old.slice(0, index) + char + old.slice(index);
  }
}
const cursor = "\uFEFF";
function add_character(old, char) {
  let index = old.indexOf(cursor);
  let result = old;
  if (char.length == 1) {
    result = insert(old, index, char);
  } else {
    switch (char.toLowerCase()) {
      case "enter":
      case "return":
        result = insert(old, index, "\n");
        break;
      case "tab":
        result = insert(old, index, " ");
        break;
      case "backspace":
      case "delete":
        if (index < 0) {
          result = old.slice(0, old.length - 1);
        } else {
          result = old.slice(0, index - 1) + cursor + old.slice(index + 1);
        }
        break;
      case "arrowleft":
        if (index < 0) {
          if (old.length > 0) {
            result = old.slice(0, old.length - 1) + cursor + old.slice(old.length - 1);
          } else {
            result = old;
          }
        } else if (index > 0) {
          result = old.slice(0, index - 1) + cursor + old[index - 1] + old.slice(index + 1);
        }
        break;
      case "arrowright":
        if (index == old.length - 1) {
          result = old.slice(0, old.length - 1);
        } else if (index >= 0) {
          result = old.slice(0, index) + old[index + 1] + cursor + old.slice(index + 2);
        }
        break;
      default:
        result = old;
    }
  }
  if (result[result.length - 1] == cursor) {
    result = result.slice(0, result.length - 1);
  }
  return result;
}
function setCaret(old, offset) {
  const index = parseInt(offset);
  const clean = old.replace(cursor, "");
  if (index < 0 || index > clean.length) return clean;
  return clean.slice(0, index) + cursor + clean.slice(index);
}
function formatNote(text2) {
  const index = text2.indexOf(cursor);
  if (index < 0) {
    return [html`<span>${text2}</span>`];
  } else {
    return [
      html`<span
        >${text2.slice(0, index)}<span class="caret"></span>${text2.slice(
        index + 1
      )}</span
      >`
    ];
  }
}
class Display extends TreeBase {
  stateName = new String$1("$Display");
  Name = new String$1("");
  background = new Color("white");
  fontSize = new Float(2);
  scale = new Float(1);
  highlightWords = new Boolean$1(false);
  clearAfterSpeaking = new Boolean$1(false);
  /** @type {HTMLDivElement | null} */
  current = null;
  static functionsInitialized = false;
  template() {
    const { state: state2 } = Globals;
    let value = state2.get(this.stateName.value) || "";
    const content = hasSlots(value) && formatSlottedString(value) || formatNote(value);
    return this.component(
      {
        style: {
          backgroundColor: this.background.value,
          fontSize: this.fontSize.value + "rem"
        }
      },
      // prettier-ignore
      html`<button
        ref=${this}
        @pointerup=${this.click}
        tabindex="-1"
        ?disabled=${!this.Name.value}
        data=${{
        name: this.Name.value,
        ComponentName: this.Name.value,
        ComponentType: this.className
      }}
      >${content}</button>`
    );
  }
  /** Attempt to locate the word the user is touching
   */
  click = () => {
    function getOffsetToSelection(root, s3) {
      const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let offset = 0;
      while (treeWalker.nextNode()) {
        const node = (
          /** @type {Text} */
          treeWalker.currentNode
        );
        if (node == s3.focusNode) {
          return offset + s3.focusOffset;
        }
        offset += node.data.length;
      }
      return -1;
    }
    const s2 = window.getSelection();
    if (!s2) return;
    let element = document.getElementById(this.id);
    if (!element) {
      return;
    }
    element = element.querySelector("button");
    if (!element) {
      return;
    }
    if (!element.contains(s2.anchorNode)) {
      return;
    }
    let word = "";
    if (s2.isCollapsed) {
      s2.modify("move", "forward", "character");
      s2.modify("move", "backward", "word");
      s2.modify("extend", "forward", "word");
      word = s2.toString();
      s2.modify("move", "forward", "character");
    } else {
      word = s2.toString();
    }
    this.current?.setAttribute("data--clicked-word", word);
    this.current?.setAttribute(
      "data--clicked-caret",
      getOffsetToSelection(element, s2).toString()
    );
    s2.empty();
  };
  /**
   * @param {SpeechSynthesisEvent} event
   */
  handleEvent(event) {
    function getNodeAtOffset(root, offset2) {
      const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (treeWalker.nextNode()) {
        const node = (
          /** @type {Text} */
          treeWalker.currentNode
        );
        if (node.parentElement instanceof HTMLSpanElement) {
          const it = node.data;
          if (offset2 > it.length) {
            offset2 -= it.length;
          } else {
            return [node, offset2];
          }
        }
      }
      return [null, -1];
    }
    if (!this.highlightWords.value) {
      return;
    }
    const element = document.getElementById(this.id);
    if (!element) {
      return;
    }
    const span = element.querySelector("button span");
    if (!span) {
      return;
    }
    const [text2, offset] = getNodeAtOffset(element, event.charIndex);
    if (!text2) {
      return;
    }
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    if (event.type == "boundary") {
      try {
        selection.setBaseAndExtent(text2, offset, text2, offset);
        selection.modify("extend", "forward", "word");
      } catch (e2) {
        console.error(e2);
      }
    } else if (event.type == "end") {
      selection.empty();
      if (this.clearAfterSpeaking.value) {
        Globals.state.update({ [this.stateName.value]: "" });
      }
    }
  }
  init() {
    document.addEventListener("boundary", this);
    document.addEventListener("end", this);
  }
}
TreeBase.register(Display, "Display");
let Option$1 = class Option2 extends TreeBase {
  name = new String$1("", { hiddenLabel: true });
  value = new String$1("", { hiddenLabel: true });
};
TreeBase.register(Option$1, "Option");
class Radio extends TreeBase {
  scale = new Float(1);
  label = new String$1("");
  stateName = new String$1("$radio");
  unselected = new Color("lightgray");
  selected = new Color("pink");
  allowedChildren = ["Option", "GridFilter"];
  /** @type {(Option | GridFilter)[]} */
  children = [];
  get options() {
    return this.filterChildren(Option$1);
  }
  /**
   * true if there exist rows with the this.filters and the value
   * @arg {Option} option
   * @returns {boolean}
   */
  valid(option) {
    const { data: data2 } = Globals;
    const filters2 = this.filterChildren(GridFilter);
    return !filters2.length || data2.hasMatchingRows(filters2, {
      states: {
        [this.stateName.value]: option.value.value
      }
    });
  }
  /**
   * handle clicks on the chooser
   * @param {MouseEvent} event
   */
  handleClick({ target }) {
    if (target instanceof HTMLButtonElement) {
      const value = target.value;
      const name = this.stateName.value;
      Globals.state.update({ [name]: value });
    }
  }
  template() {
    const { state: state2 } = Globals;
    const stateName = this.stateName.value;
    const selected = this.selected.value;
    const unselected = this.unselected.value;
    const radioLabel = this.label.value;
    let currentValue = state2.get(stateName);
    const choices = this.options.map((choice, index) => {
      const choiceDisabled = !this.valid(choice);
      const choiceValue = choice.value.value;
      const choiceName = choice.name.value;
      if (stateName && !currentValue && !choiceDisabled && choiceValue) {
        currentValue = choiceValue;
        state2.define(stateName, choiceValue);
      }
      const color = choiceValue == currentValue || !currentValue && index == 0 ? selected : unselected;
      return html`<button
        style=${styleString({ backgroundColor: color })}
        value=${choiceValue}
        ?disabled=${choiceDisabled}
        data=${{
        ComponentType: this.className,
        ComponentName: radioLabel || stateName,
        label: choiceName
      }}
        click
        @Activate=${() => state2.update({ [stateName]: choice.value.value })}
      >
        ${choiceName}
      </button>`;
    });
    return this.component(
      {},
      html`<fieldset class="flex">
        ${radioLabel && [html`<legend>${radioLabel}</legend>`] || []}
        ${choices}
      </fieldset>`
    );
  }
  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    const filters2 = this.filterChildren(GridFilter);
    const editFilters = !filters2.length ? [] : [GridFilter.FilterSettings(filters2)];
    const options = this.filterChildren(Option$1);
    const editOptions = html`<fieldset>
      <legend>Options</legend>
      <table class="RadioOptions">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          ${options.map(
      (option, index) => html`
              <tr>
                <td>${index + 1}</td>
                <td>${option.name.input()}</td>
                <td>${option.value.input()}</td>
              </tr>
            `
    )}
        </tbody>
      </table>
    </fieldset>`;
    return [html`<div>${editFilters}${editOptions}${inputs}</div>`];
  }
  settingsChildren() {
    return html`<div />`;
  }
}
TreeBase.register(Radio, "Radio");
class Gap extends TreeBase {
  scale = new Float(1);
  background = new Color("");
  template() {
    return this.component(
      {
        style: styleString({
          backgroundColor: this.background.value
        })
      },
      html`<div />`
    );
  }
}
TreeBase.register(Gap, "Gap");
const PostRenderFunctions = [];
function callAfterRender(f2) {
  PostRenderFunctions.push(f2);
}
function postRender() {
  while (PostRenderFunctions.length > 0) {
    const PRF = PostRenderFunctions.pop();
    if (PRF) PRF();
  }
}
function safeRender(id, component) {
  const where = document.getElementById(id);
  if (!where) {
    console.error({ id, where });
    return;
  }
  let r;
  {
    try {
      let what = component.safeTemplate();
      r = render(where, what);
    } catch (error) {
      if (error instanceof Error) {
        errorHandler(error, ` rendering ${component.className} ${id}`);
      } else {
        console.error("crash", error);
      }
      return;
    }
  }
  return r;
}
class TabControl extends TreeBase {
  stateName = new String$1("$tabControl");
  background = new Color("");
  scale = new Float(6);
  tabEdge = new Select(["bottom", "top", "left", "right", "none"], {
    defaultValue: "top"
  });
  name = new String$1("tabs");
  allowedChildren = ["TabPanel"];
  /** @type {TabPanel[]} */
  children = [];
  /** @type {TabPanel | undefined} */
  currentPanel = void 0;
  template() {
    const { state: state2 } = Globals;
    const panels = this.children;
    let activeTabName = state2.get(this.stateName.value);
    panels.forEach((panel2, index) => {
      panel2.tabName = state2.interpolate(panel2.name.value);
      panel2.tabLabel = state2.interpolate(panel2.label.value || panel2.name.value);
      if (index == 0 && !activeTabName) {
        activeTabName = panel2.tabName;
        state2.define(this.stateName.value, panel2.tabName);
      }
      panel2.active = activeTabName == panel2.tabName || panels.length === 1;
      if (panel2.active) this.currentPanel = panel2;
    });
    let buttons = [];
    if (this.tabEdge.value != "none") {
      buttons = panels.filter((panel2) => panel2.label.value != "UNLABELED").map((panel2) => {
        const color = panel2.background.value;
        const buttonStyle = {
          backgroundColor: color
        };
        return html`<li>
            <button
              ?active=${panel2.active}
              style=${styleString(buttonStyle)}
              data=${{
          name: this.name.value,
          label: panel2.tabLabel,
          component: this.constructor.name,
          id: panel2.id
        }}
              click
              @Activate=${() => {
          this.switchTab(panel2.tabName);
        }}
              tabindex="-1"
            >
              ${panel2.tabLabel}
            </button>
          </li>`;
      });
    }
    const panel = this.currentPanel ? this.currentPanel.safeTemplate() : html`<div />`;
    return this.component(
      { classes: [this.tabEdge.value] },
      html`
        <ul class="buttons">
          ${buttons}
        </ul>
        <div class="panels flex">${panel}</div>
      `
    );
  }
  /**
   * @param {string} tabName
   */
  switchTab(tabName) {
    Globals.state.update({ [this.stateName.value]: tabName });
  }
}
TreeBase.register(TabControl, "TabControl");
class TabPanel extends Stack {
  name = new String$1("");
  label = new String$1("");
  /** @type {TabControl | undefined } */
  parent = void 0;
  active = false;
  tabName = "";
  tabLabel = "";
  /**
   * Render the details of a components settings
   */
  settingsDetails() {
    const caption = this.active ? "Active" : "Activate";
    let details = super.settingsDetails();
    if (!Array.isArray(details)) details = [details];
    return [
      ...details,
      html`<button
        id=${this.id + "-activate"}
        ?active=${this.active}
        @click=${() => {
        if (this.parent) {
          const parent = this.parent;
          callAfterRender(() => {
            Globals.layout.highlight();
          });
          parent.switchTab(this.name.value);
        }
      }}
      >
        ${caption}
      </button>`
    ];
  }
  /** @param {string[]} classes
   * @returns {string}
   */
  CSSClasses(...classes) {
    if (this.active) {
      classes.push("ActivePanel");
    }
    return super.CSSClasses(...classes);
  }
  highlight() {
  }
}
TreeBase.register(TabPanel, "TabPanel");
class ModalDialog extends StackContainer {
  stateName = new String$1("$modalOpen");
  open = new Boolean$1(false);
  /** @param {string[]} classes */
  CSSClasses(...classes) {
    return super.CSSClasses("open", ...classes);
  }
  template() {
    const state2 = Globals.state;
    const open = !!state2.get(this.stateName.value) || this.open.value ? "open" : "";
    if (open) {
      return super.template();
    } else {
      return html`<div />`;
    }
  }
}
TreeBase.register(ModalDialog, "ModalDialog");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(test, delay2 = 100) {
  while (!test()) await sleep(delay2);
}
async function getActualImageSize(img) {
  let left = 0, top2 = 0, width = 1, height = 1;
  if (img) {
    await waitFor(() => img.complete && img.naturalWidth != 0);
    const vsd = (
      /** @type {HTMLDivElement} */
      img.closest("div.vsd")
    );
    const cw = img.width, ch = img.height, iw = img.naturalWidth, ih = img.naturalHeight, pw = vsd.clientWidth, ph = vsd.clientHeight, iratio = iw / ih, cratio = cw / ch;
    if (iratio > cratio) {
      width = cw;
      height = cw / iratio;
    } else {
      width = ch * iratio;
      height = ch;
    }
    left = (pw - width) / 2;
    top2 = (ph - height) / 2;
  }
  return { left, top: top2, width, height };
}
function px(v2) {
  return `${v2}px`;
}
function pct(v2) {
  return `${v2}%`;
}
class VSD extends TreeBase {
  name = new String$1("vsd");
  scale = new Float(1);
  /** @type {GridFilter[]} */
  children = [];
  allowedChildren = ["GridFilter"];
  /** @type {HTMLDivElement} */
  markers;
  template() {
    const { data: data2, state: state2, actions } = Globals;
    const editing = state2.get("editing");
    const items = (
      /** @type {VRow[]} */
      data2.getMatchingRows(this.children)
    );
    const src = items.find((item) => item.image)?.image || "";
    let dragging = 0;
    const coords = [
      [0, 0],
      // start x and y
      [0, 0]
      // end x and y
    ];
    let clip = "";
    return this.component(
      { classes: ["show"] },
      html`<div>
        ${imageOrVideo(src, "", () => {
        this.sizeMarkers(this.markers);
      })}
        <div
          class="markers"
          ref=${(node) => {
        this.sizeMarkers(node);
      }}
          @pointermove=${editing && ((event) => {
        const rect = this.markers.getBoundingClientRect();
        const div = document.querySelector("#UI span.coords");
        if (!div) return;
        coords[dragging][0] = Math.round(
          100 * (event.pageX - rect.left) / rect.width
        );
        coords[dragging][1] = Math.round(
          100 * (event.pageY - rect.top) / rect.height
        );
        clip = `${coords[0][0]}	${coords[0][1]}`;
        if (dragging) {
          clip = clip + `	${coords[1][0] - coords[0][0]}	${coords[1][1] - coords[0][1]}`;
        }
        div.innerHTML = clip;
      })}
          @pointerdown=${editing && (() => {
        dragging = 1;
      })}
          @pointerup=${editing && (() => {
        dragging = 0;
        navigator.clipboard.writeText(clip);
      })}
        >
          ${items.filter((item) => item.w).map(
        (item) => html`<button
                  style=${styleString({
          left: pct(item.x),
          top: pct(item.y),
          width: pct(item.w),
          height: pct(item.h),
          position: "absolute"
        })}
                  ?invisible=${!!item.invisible}
                  data=${{
          ComponentName: this.name.value,
          ComponentType: this.constructor.name,
          ...item
        }}
                  click
                  @Activate=${actions.handler(this.name.value, item, "press")}
                >
                  <span>${item.label || ""}</span>
                </button>`
      )}
          <span class="coords" style="background-color: white"></span>
        </div>
      </div>`
    );
  }
  /** @param {HTMLDivElement} node */
  async sizeMarkers(node) {
    this.markers = node;
    const img = (
      /** @type {HTMLImageElement} */
      node.previousElementSibling
    );
    const rect = await getActualImageSize(img);
    node.style.position = "absolute";
    node.style.left = px(rect.left);
    node.style.top = px(rect.top);
    node.style.width = px(rect.width);
    node.style.height = px(rect.height);
  }
  settingsDetails() {
    const props = this.props;
    const inputs = Object.values(props).map((prop) => prop.input());
    const filters2 = GridFilter.FilterSettings(this.children);
    return [html`<div>${filters2}${inputs}</div>`];
  }
  settingsChildren() {
    return html`<div />`;
  }
}
TreeBase.register(VSD, "VSD");
class Button extends TreeBase {
  label = new String$1("click me");
  name = new String$1("button");
  background = new Color("");
  scale = new Float(1);
  template() {
    const style2 = styleString({ backgroundColor: this.background.value });
    const name = this.name.value;
    const label = this.label.value;
    return this.component(
      {},
      html`<button
        class="button"
        name=${name}
        style=${style2}
        data=${{
        name,
        label,
        ComponentName: name,
        ComponentType: this.constructor.name
      }}
      >
        ${label}
      </button>`
    );
  }
  getChildren() {
    return [];
  }
}
TreeBase.register(Button, "Button");
class Monitor extends TreeBase {
  template() {
    const { state: state2, actions: rules } = Globals;
    const stateKeys = [
      .../* @__PURE__ */ new Set([...Object.keys(state2.values), ...accessed.keys()])
    ].sort();
    const s2 = html`<table class="state">
      <thead>
        <tr>
          <th>State</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${stateKeys.filter((key) => key.startsWith("$")).map((key) => {
      let value = state2.get(key);
      value = toString(value);
      let clamped = value.slice(0, 30);
      if (value.length > clamped.length) {
        clamped += "...";
      }
      return html`<tr
              ?updated=${state2.hasBeenUpdated(key)}
              ?undefined=${accessed.get(key) === false}
            >
              <td>${key}</td>
              <td>${clamped}</td>
            </tr>`;
    })}
      </tbody>
    </table>`;
    const row = rules.last.data || {};
    const rowAccessedKeys = [...accessed.keys()].filter((key) => key.startsWith("_")).map((key) => key.slice(1));
    const rowKeys = [
      .../* @__PURE__ */ new Set([...Object.keys(row), ...rowAccessedKeys])
    ].sort();
    const f2 = html`<table class="fields">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${rowKeys.map((key) => {
      let value = row[key];
      if (typeof value !== "string") value = String(value || "");
      return html`<tr
            ?undefined=${accessed.get(`_${key}`) === false}
            ?accessed=${accessed.has(`_${key}`)}
          >
            <td>#${key}</td>
            <td>${value || ""}</td>
          </tr>`;
    })}
      </tbody>
    </table>`;
    return html`<button
        @click=${() => {
      state2.clear();
      rules.configure();
    }}
      >
        Clear state
      </button>
      <div>${s2}${f2}</div>`;
  }
}
TreeBase.register(Monitor, "Monitor");
async function speak(message, voiceURI, pitch, rate, volume) {
  if (!message) return;
  const voices2 = await getVoices();
  const voice = voiceURI && voices2.find((voice2) => voice2.voiceURI == voiceURI);
  const utterance = new SpeechSynthesisUtterance(message);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = volume;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
class Speech extends TreeBase {
  stateName = new String$1("$Speak");
  voiceURI = new Voice("", { label: "Voice" });
  pitch = new Float(1);
  rate = new Float(1);
  volume = new Float(1);
  async speak() {
    const { state: state2 } = Globals;
    const voiceURI = this.voiceURI.value;
    const message = toString(state2.get(this.stateName.value)).replace(
      cursor,
      ""
    );
    const voices2 = await getVoices();
    const voice = voiceURI && voices2.find((voice2) => voice2.voiceURI == voiceURI);
    const utterance = new SpeechSynthesisUtterance(message);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.pitch = this.pitch.value;
    utterance.rate = this.rate.value;
    utterance.volume = this.volume.value;
    utterance.addEventListener("boundary", (event) => {
      document.dispatchEvent(
        new SpeechSynthesisEvent("boundary", {
          utterance: event.utterance,
          charIndex: event.charIndex
        })
      );
    });
    utterance.addEventListener("end", (event) => {
      document.dispatchEvent(
        new SpeechSynthesisEvent("end", {
          utterance: event.utterance,
          charIndex: event.charIndex
        })
      );
    });
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
  template() {
    const { state: state2 } = Globals;
    if (state2.hasBeenUpdated(this.stateName.value)) {
      const message = toString(state2.get(this.stateName.value));
      speak(
        message,
        this.voiceURI.value,
        this.pitch.value,
        this.rate.value,
        this.volume.value
      );
    }
    return html`<div />`;
  }
}
TreeBase.register(Speech, "Speech");
let voices = [];
function getVoices() {
  return new Promise(function(resolve2) {
    function f2() {
      voices = voices.length && voices || speechSynthesis.getVoices();
      if (voices.length) resolve2(voices);
      else setTimeout(f2, 100);
    }
    f2();
  });
}
class VoiceSelect extends HTMLSelectElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addVoices();
  }
  async addVoices() {
    const voices2 = await getVoices();
    function compareVoices(a2, b3) {
      return a2.lang.localeCompare(b3.lang) || a2.name.localeCompare(b3.name);
    }
    voices2.sort(compareVoices);
    const current = this.getAttribute("value");
    for (const voice of voices2) {
      const item = document.createElement("option");
      item.value = voice.voiceURI;
      if (voice.voiceURI == current) item.setAttribute("selected", "");
      item.innerText = `${voice.name} ${voice.lang}`;
      this.add(item);
    }
  }
}
customElements.define("select-voice", VoiceSelect, { extends: "select" });
async function playAudio(filename) {
  const sound = await db.getAudio(filename);
  sound.play();
}
let Audio$1 = class Audio2 extends TreeBase {
  stateName = new String$1("$Audio");
  template() {
    const { state: state2 } = Globals;
    if (state2.hasBeenUpdated(this.stateName.value)) {
      const filename = state2.get(this.stateName.value) || "";
      playAudio(filename);
    }
    return html`<div />`;
  }
};
TreeBase.register(Audio$1, "Audio");
async function wait(promise, message = "Please wait") {
  const div = document.createElement("div");
  div.id = "PleaseWait";
  document.body.appendChild(div);
  const timer2 = window.setTimeout(() => {
    render(div, html`<div><p class="message">${message}</p></div>`);
  }, 500);
  try {
    const result = await promise;
    clearTimeout(timer2);
    div.remove();
    return result;
  } catch (e2) {
    console.trace("wait error");
    clearTimeout(timer2);
    return new Promise((resolve2, reject) => {
      render(
        div,
        html`<div>
          <p class="error">${e2.message}</p>
          <button
            @click=${() => {
          div.remove();
          reject(e2.message);
        }}
          >
            OK
          </button>
        </div>`
      );
    });
  }
}
class Logger extends TreeBase {
  // name = new Props.String("Log");
  stateName = new String$1("$Log");
  logUntil = new ADate();
  // I expect a string like #field1 $state1 $state2 #field3
  logThese = new TextArea("", {
    validate: this.validate,
    placeholder: "Enter state and field names to log"
  });
  // I expect a string listing event names to log
  logTheseEvents = new TextArea("", {
    validate: this.validateEventNames,
    placeholder: "Enter names of events to log"
  });
  /**
   * @param {string} s
   * @returns {string}
   */
  validate(s2) {
    return /^(?:[#$]\w+\s*)*$/.test(s2) ? "" : "Invalid input";
  }
  /**
   * Check for strings that look like event names
   *
   * @param {string} s
   * @returns {string}
   */
  validateEventNames(s2) {
    return /^(?:\w+\s*)*$/.test(s2) ? "" : "Invalid input";
  }
  template() {
    const { state: state2, actions } = Globals;
    const stateName = this.stateName.value;
    const logUntil = this.logUntil.value;
    const logThese = this.logThese.value;
    const logging = !!state2.get(stateName) && logUntil && /* @__PURE__ */ new Date() < new Date(logUntil);
    const getValue = access(state2, actions.last.data);
    if (logging) {
      const names = logThese.split(/\s+/);
      const record = {};
      for (const name of names) {
        const value = getValue(name);
        if (value) {
          record[name] = value;
        }
      }
      this.log(record);
    }
    return html`<div
      class="logging-indicator"
      ?logging=${logging}
      title="Logging"
    ></div>`;
  }
  /** Log a record to the database
   * @param {Object} record
   * @returns {void}
   */
  log(record) {
    const DateTime = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
      fractionalSecondDigits: 2,
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    record = { DateTime, ...record };
    db.writeLog(record);
  }
  init() {
    super.init();
    this.onUpdate();
  }
  /** @type {Set<string>} */
  listeners = /* @__PURE__ */ new Set();
  onUpdate() {
    const UI = document.getElementById("UI");
    if (!UI) return;
    for (const eventName of this.listeners) {
      UI.removeEventListener(eventName, this);
    }
    this.listeners.clear();
    for (const match2 of this.logTheseEvents.value.matchAll(/\w+/g)) {
      UI.addEventListener(match2[0], this);
      this.listeners.add(match2[0]);
    }
  }
  typesToInclude = /* @__PURE__ */ new Set(["boolean", "number", "string"]);
  propsToExclude = /* @__PURE__ */ new Set([
    "isTrusted",
    "bubbles",
    "cancelBubble",
    "cancelable",
    "defaultPrevented",
    "eventPhase",
    "returnValue",
    "timeStamp"
  ]);
  /**
   * Make this object a listener
   * @param {Event} e
   */
  handleEvent(e2) {
    const record = {};
    for (const prop in e2) {
      if (/^[A-Z_]+$/.test(prop)) continue;
      const value = e2[prop];
      if (this.propsToExclude.has(prop)) continue;
      if (!this.typesToInclude.has(typeof value)) continue;
      record[prop] = value;
    }
    this.log(record);
  }
}
TreeBase.register(Logger, "Logger");
async function SaveLog() {
  let toSave = await db.readLog();
  if (toSave.length > 0) {
    await wait(saveContent("log", toSave, "xlsx"));
  } else {
    Globals.error.report("No log records to be saved.");
    Globals.state.update();
  }
}
async function ClearLog() {
  await db.clearLog();
}
class ChangeStack {
  /** @type {ExternalRep[]} */
  stack = [];
  /* boundary between undo and redo. Points to the first cell beyond the undos */
  top = 0;
  get canUndo() {
    console.log("canUndo", this.top > 1);
    return this.top > 1;
  }
  get canRedo() {
    return this.top < this.stack.length;
  }
  /** Save a state for possible undo
   * @param {ExternalRep} state
   */
  save(state2) {
    this.stack.splice(this.top);
    this.stack.push(state2);
    this.top = this.stack.length;
  }
  /** Undo
   * @param {TreeBase} current
   */
  undo(current) {
    if (this.canUndo) {
      this.restore(current, this.stack[this.top - 2]);
      this.top--;
    }
  }
  /** Redo
   * @param {TreeBase} current
   */
  redo(current) {
    if (this.canRedo) {
      this.restore(current, this.stack[this.top]);
      this.top++;
    }
  }
  useDiff = false;
  /**
   * restore the state of current to previous
   * @param {TreeBase} current
   * @param {ExternalRep} previous
   * @returns {boolean}
   */
  restore(current, previous) {
    if (!this.useDiff) {
      const next = TreeBase.fromObject(previous);
      current.children = next.children;
      current.children.forEach((child) => child.parent = current);
      next.update();
      return true;
    }
    if (this.equal(current, previous)) {
      return false;
    }
    if (current.className != previous.className) {
      if (current instanceof TreeBaseSwitchable) {
        console.log("change class");
        current.replace(previous.className, previous.props);
      } else {
        throw new Error(
          `Undo: non switchable class changed ${current.className} ${previous.className}`
        );
      }
      return true;
    }
    const pprops = previous.props;
    for (let propName in pprops) {
      if (pprops[propName] && propName in current && current[propName].text != pprops[propName]) {
        current[propName].set(pprops[propName]);
        console.log("change prop");
        return true;
      }
    }
    const cc = current.children;
    const pc = previous.children;
    if (cc.length == pc.length - 1) {
      for (let i = 0; i < pc.length; i++) {
        if (!this.equal(cc[i], pc[i])) {
          console.log(
            "undo delete",
            current.toObject({ omittedProps: [], includeIds: true }),
            pc[i]
          );
          const deleted = TreeBase.fromObject(pc[i], current, { useId: true });
          if (i < pc.length) {
            console.log("move it", i);
            deleted.moveTo(i);
          }
          return true;
        }
      }
      throw new Error("Undo: delete failed");
    } else if (cc.length == pc.length + 1) {
      console.log("undo add", cc[cc.length - 1]);
      cc[cc.length - 1].remove();
      return true;
    } else if (cc.length == pc.length) {
      let diffs = [];
      for (let i = 0; i < cc.length; i++) {
        if (!this.equal(cc[i], pc[i])) diffs.push(i);
      }
      if (diffs.length == 2) {
        console.log("swap", diffs[0], diffs[1]);
        current.swap(diffs[0], diffs[1]);
        return true;
      } else if (diffs.length == 1) {
        return this.restore(cc[diffs[0]], pc[diffs[0]]);
      } else if (diffs.length == 0) {
        return false;
      } else {
        throw new Error(`Undo: too many diffs ${diffs.length}`);
      }
    } else {
      throw new Error(
        `Undo: incompatible number of children ${cc.length} ${pc.length}`
      );
    }
  }
  /** Compare TreeBase and ExternalRep for equality
   * @param {TreeBase} tb - current value
   * @param {ExternalRep} er -- previous value
   * @returns {boolean}
   */
  equal(tb, er) {
    if (!tb || !er) return false;
    if (tb.id != er.id) return false;
    if (tb.className != er.className) return false;
    for (const prop in tb.props) {
      if (prop in er.props) {
        if (er.props[prop] && tb[prop].text != er.props[prop].toString())
          return false;
      }
    }
    if (tb.children.length != er.children.length) return false;
    return tb.children.every((child, i) => this.equal(child, er.children[i]));
  }
}
class Designer extends TreeBase {
  stateName = new String$1("$tabControl");
  background = new String$1("");
  scale = new Float(6);
  name = new String$1("tabs");
  hint = "T";
  allowedChildren = ["DesignerPanel"];
  /** @type {DesignerPanel[]} */
  children = [];
  /** @type {DesignerPanel | undefined} */
  currentPanel = void 0;
  template() {
    const { state: state2 } = Globals;
    const panels = this.children;
    let activeTabName = state2.get(this.stateName.value);
    panels.forEach((panel, index) => {
      panel.tabName = state2.interpolate(panel.name.value);
      panel.tabLabel = state2.interpolate(panel.label.value || panel.name.value);
      if (index == 0 && !activeTabName) {
        activeTabName = panel.tabName;
        state2.define(this.stateName.value, panel.tabName);
      }
      panel.active = activeTabName == panel.tabName || panels.length === 1;
      if (panel.active) {
        this.currentPanel = panel;
      }
    });
    let buttons = [];
    buttons = panels.filter((panel) => panel.label.value != "UNLABELED").map((panel) => {
      return html`<li>
          <button
            ?active=${panel.active}
            data=${{
        name: this.name.value,
        label: panel.tabLabel,
        component: this.constructor.name,
        id: panel.id
      }}
            @click=${() => {
        this.switchTab(panel.tabName);
      }}
            tabindex="-1"
          >
            ${panel.tabLabel}
          </button>
        </li>`;
    });
    return this.component(
      { classes: ["top", "tabcontrol"] },
      html`
        <ul class="buttons" hint="T" @keyup=${this.tabButtonKeyHandler}>
          ${buttons}
        </ul>
        <div
          class="panels flex"
          @keydown=${this.keyHandler}
          @focusin=${this.focusin}
          @click=${this.designerClick}
        >
          ${panels.map((panel) => panel.settings())}
        </div>
        ${colorNamesDataList()}
      `
    );
  }
  /**
   * @param {string} tabName
   */
  switchTab(tabName) {
    callAfterRender(() => this.restoreFocus());
    Globals.state.update({ [this.stateName.value]: tabName });
  }
  /**
   * capture focusin events so we can remember what was focused last
   * @param {FocusEvent} event
   */
  focusin = (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.hasAttribute("aria-selected")) return;
    if (!this.currentPanel) return;
    const panel = document.getElementById(this.currentPanel.id);
    if (!panel) return;
    for (const element of panel.querySelectorAll("[aria-selected]")) {
      element.removeAttribute("aria-selected");
    }
    if (panel.contains(event.target)) {
      const id = event.target.closest("[id]")?.id || "";
      this.currentPanel.lastFocused = id;
      event.target.setAttribute("aria-selected", "true");
    }
    if (this.currentPanel.name.value == "Layout") {
      this.currentPanel.highlight();
    }
  };
  /** @returns {TreeBase | undefined } */
  get selectedComponent() {
    const { designer } = Globals;
    const panel = designer.currentPanel;
    if (!panel?.lastFocused) {
      return void 0;
    }
    const component = TreeBase.componentFromId(panel.lastFocused);
    if (!component) {
      console.log("no component");
      return void 0;
    }
    return component;
  }
  /** @param {string} targetId */
  focusOn(targetId) {
    let elem = document.getElementById(targetId);
    if (!elem) {
      const m2 = targetId.match(/^TreeBase-\d+/);
      if (m2) {
        const prefix2 = m2[0];
        elem = document.querySelector(`[id^=${prefix2}]`);
      }
    }
    if (elem) elem.focus();
  }
  restoreFocus() {
    if (this.currentPanel) {
      if (this.currentPanel.lastFocused) {
        let targetId = this.currentPanel.lastFocused;
        let elem = document.getElementById(targetId);
        if (!elem) {
          const m2 = targetId.match(/^TreeBase-\d+/);
          if (m2) {
            const prefix2 = m2[0];
            elem = document.querySelector(`[id^=${prefix2}]`);
          }
        }
        if (elem) elem.focus();
      } else {
        const panelNode = document.getElementById(this.currentPanel.id);
        if (panelNode) {
          const focusable = (
            /** @type {HTMLElement} */
            panelNode.querySelector(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), summary:not(:disabled)'
            )
          );
          if (focusable) {
            focusable.focus();
          } else {
            panelNode.focus();
          }
        }
      }
    }
  }
  /**
   * @param {KeyboardEvent} event
   */
  keyHandler = (event) => {
    if (!this.currentPanel) return;
    if (event.target instanceof HTMLButtonElement && event.target.matches("#designer .buttons button")) {
      this.tabButtonKeyHandler(event);
    } else {
      const panel = document.getElementById(this.currentPanel.id);
      if (panel && event.target instanceof HTMLElement && panel.contains(event.target)) {
        this.panelKeyHandler(event);
      }
    }
  };
  /**
   * @param {KeyboardEvent} event
   */
  panelKeyHandler(event) {
    if (event.target instanceof HTMLTextAreaElement) return;
    if (event.key == "ArrowDown" || event.key == "ArrowUp") {
      if (event.shiftKey) {
        const component = Globals.designer.selectedComponent;
        if (!component) return;
        component.moveUpDown(event.key == "ArrowUp");
        callAfterRender(() => Globals.designer.restoreFocus());
        this.currentPanel?.update();
        Globals.state.update();
      } else {
        event.preventDefault();
        const components = [
          ...document.querySelectorAll(".DesignerPanel.ActivePanel .settings")
        ];
        const focusedComponent = document.querySelector(
          '.DesignerPanel.ActivePanel .settings:has([aria-selected="true"]):not(:has(.settings [aria-selected="true"]))'
        );
        if (!focusedComponent) return;
        const index = components.indexOf(focusedComponent);
        const nextIndex = Math.min(
          components.length - 1,
          Math.max(0, index + (event.key == "ArrowUp" ? -1 : 1))
        );
        if (nextIndex != index) {
          const focusable = (
            /** @type {HTMLElement} */
            components[nextIndex].querySelector(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), summary:not(:disabled)'
            )
          );
          if (focusable) {
            focusable.focus();
          }
        }
      }
    } else if (event.key == "z") {
      if (event.ctrlKey && event.shiftKey) {
        this.currentPanel?.redo();
      } else if (event.ctrlKey) {
        this.currentPanel?.undo();
      }
    }
  }
  /**
   * @param {KeyboardEvent} event
   */
  tabButtonKeyHandler({ key }) {
    const tabButtons = (
      /** @type {HTMLButtonElement[]} */
      [
        ...document.querySelectorAll("#designer .buttons button")
      ]
    );
    const focused = (
      /** @type {HTMLButtonElement} */
      document.querySelector("#designer .buttons button:focus")
    );
    if (key == "Escape") {
      Globals.designer.restoreFocus();
    } else if (key.startsWith("Arrow")) {
      const index = tabButtons.indexOf(focused);
      const step = key == "ArrowUp" || key == "ArrowLeft" ? -1 : 1;
      let nextIndex = (index + step + tabButtons.length) % tabButtons.length;
      tabButtons[nextIndex].focus();
    } else if (key == "Home") {
      tabButtons[0].focus();
    } else if (key == "End") {
      tabButtons[tabButtons.length - 1].focus();
    } else if (key.length == 1 && (key >= "a" && key <= "z" || key >= "A" && key <= "Z")) {
      const index = tabButtons.indexOf(focused);
      for (let i = 1; i < tabButtons.length; i++) {
        const j = (index + i) % tabButtons.length;
        if (tabButtons[j].innerText.toLowerCase().startsWith(key)) {
          tabButtons[j].focus();
          break;
        }
      }
    }
  }
  /** Tweak the focus behavior in the designer
     * I want clicking on blank space to focus the nearest focusable element
  
     * @param {PointerEvent} event
     */
  designerClick = (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    const panel = document.querySelector("#designer .designer div.panels");
    if (!panel) return;
    if (!panel.contains(event.target)) return;
    if (event.target instanceof HTMLDivElement || event.target instanceof HTMLFieldSetElement || event.target instanceof HTMLTableRowElement || event.target instanceof HTMLTableCellElement || event.target instanceof HTMLDetailsElement) {
      if (event.target.matches('[tabindex="0"]')) return;
      let target = event.target;
      while (target) {
        const focusable = (
          /** @type {HTMLElement} */
          target.querySelector(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), summary:not(:disabled)'
          )
        );
        if (focusable) {
          focusable.focus();
          break;
        }
        target = target.parentElement;
      }
    }
  };
  /**
   * Merge a design in
   * @param {DesignObject} design
   * @returns {Promise<void>}
   */
  async merge(design) {
    for (let key in design) {
      if (key == "media" && design.media) {
        for (const media of design.media) {
          await db.addMedia(media.content, media.name);
        }
      } else if (key == "content") {
        await Globals.content.merge({
          className: "Content",
          props: {},
          children: design[key]
        });
      } else if (key == "method") {
        await Globals["methods"].merge(design["method"]);
      } else if (key == "pattern") {
        await Globals["patterns"].merge(design["pattern"]);
      } else {
        await Globals[key].merge(design[key]);
      }
    }
  }
}
TreeBase.register(Designer, "Designer");
class DesignerPanel extends TreeBase {
  name = new String$1("");
  label = new String$1("");
  /** @type {Designer | undefined } */
  parent = void 0;
  active = false;
  tabName = "";
  tabLabel = "";
  settingsDetailsOpen = false;
  lastFocused = "";
  // where to store in the db
  static tableName = "";
  // default value if it isn't found
  static defaultValue = {};
  /** @returns {string} */
  get staticTableName() {
    return this.constructor.tableName;
  }
  changeStack = new ChangeStack();
  /**
   * Load a panel from the database.
   *
   * I don't know why I have to pass the class as a parameter to get the types
   * to work. Why can't I refer to this in the static method which should be
   * the class.
   *
   * @template {DesignerPanel} T
   * @param {new()=>T} expected
   * @returns {Promise<T>}
   */
  static async load(expected) {
    let obj = await db.read(this.tableName, this.defaultValue);
    obj = this.upgrade(obj);
    const result = this.fromObject(obj);
    if (result instanceof expected) {
      result.configure();
      result.changeStack.save(
        result.toObject({ omittedProps: [], includeIds: true })
      );
      return result;
    }
    return this.create(expected);
  }
  /**
   * Merge an object into the panel contents
   * @param {ExternalRep} _obj
   * @returns {Promise<void>}
   *
   */
  async merge(_obj) {
    console.log("override me");
  }
  /**
   * Render the details of a components settings
   */
  settingsDetails() {
    const caption = this.active ? "Active" : "Activate";
    let details = super.settingsDetails();
    if (!Array.isArray(details)) details = [details];
    return [
      ...details,
      html`<button
        id=${this.id + "-activate"}
        ?active=${this.active}
        @click=${() => {
        if (this.parent) {
          const parent = this.parent;
          callAfterRender(() => {
            Globals.layout.highlight();
          });
          parent.switchTab(this.name.value);
        }
      }}
      >
        ${caption}
      </button>`
    ];
  }
  highlight() {
  }
  /**
   * An opportunity to upgrade the format if needed
   * @param {any} obj
   * @returns {Object}
   */
  static upgrade(obj) {
    return obj;
  }
  configure() {
  }
  async onUpdate() {
    await this.doUpdate(true);
    this.configure();
    Globals.designer.restoreFocus();
  }
  async doUpdate(save = true) {
    const tableName = this.staticTableName;
    if (tableName) {
      const externalRep = this.toObject({ omittedProps: [], includeIds: true });
      await db.write(tableName, externalRep);
      if (save) this.changeStack.save(externalRep);
      Globals.state.update();
    }
  }
  async undo() {
    const tableName = this.staticTableName;
    if (tableName) {
      this.changeStack.undo(this);
      await this.doUpdate(false);
      Globals.designer.restoreFocus();
    }
  }
  async redo() {
    const tableName = this.staticTableName;
    if (tableName) {
      this.changeStack.redo(this);
      await this.doUpdate(false);
      Globals.designer.restoreFocus();
    }
  }
  /** @param {string[]} classes
   * @returns {string}
   */
  CSSClasses(...classes) {
    classes.push("DesignerPanel");
    if (this.active) {
      classes.push("ActivePanel");
    }
    return super.CSSClasses(...classes);
  }
}
class Content extends DesignerPanel {
  name = new String$1("Content");
  lastFocused = this.id;
  /** Delete the media files that are checked */
  async deleteSelected() {
    const toDelete = [
      ...document.querySelectorAll(
        "#ContentMedia input[type=checkbox]:checked"
      )
    ].map((element) => {
      const checkbox = (
        /** @type{HTMLInputElement} */
        element
      );
      checkbox.checked = false;
      return checkbox.name;
    });
    const selectAll = (
      /** @type {HTMLInputElement} */
      document.getElementById("ContentSelectAll")
    );
    if (selectAll) selectAll.checked = false;
    await wait(db.deleteMedia(...toDelete));
    Globals.state.update();
  }
  /** Check or uncheck all the media file checkboxes */
  selectAll({ target }) {
    for (const element of document.querySelectorAll(
      '#ContentMedia input[type="checkbox"]'
    )) {
      const checkbox = (
        /** @type {HTMLInputElement} */
        element
      );
      checkbox.checked = target.checked;
    }
  }
  settings() {
    const data2 = Globals.data;
    return html`<div class=${this.CSSClasses("content")} id=${this.id}>
      <div>
        <h1>Content</h1>
        <p>
          ${data2.length} rows with these fields:
          ${String([...data2.allFields].sort()).replaceAll(",", ", ")}
        </p>
        <h2>Media files</h2>
        <button @click=${this.deleteSelected}>Delete checked</button>
        <label
          ><input
            type="checkbox"
            name="Select all"
            id="ContentSelectAll"
            @input=${this.selectAll}
          />Select All</label
        >
        <div
          ref=${(ol) => {
      db.listMedia().then((names) => {
        const list = names.map(
          (name) => html`<li>
                    <label><input type="checkbox" name=${name} />${name}</label>
                  </li>`
        );
        const body = html`<ol id="ContentMedia" style="column-count: 3">
                ${list}
              </ol> `;
        render(ol, body);
      });
    }}
        ></div>
      </div>
    </div>`;
  }
  /**
   * Merge an object into the panel contents
   * @param {ExternalRep} obj
   * @returns {Promise<void>}
   */
  async merge(obj) {
    console.assert(obj.className == "Content", obj);
    const toMerge = obj.children;
    Globals.data.setContent(Globals.data.contentRows.concat(toMerge));
    db.write("content", Globals.data.contentRows);
    this.onUpdate();
  }
}
TreeBase.register(Content, "Content");
const emptyPage = {
  className: "Page",
  props: {},
  children: [
    {
      className: "Speech",
      props: {},
      children: []
    }
  ]
};
const typeToClassName = {
  audio: "Audio",
  stack: "Stack",
  page: "Page",
  grid: "Grid",
  speech: "Speech",
  button: "Button",
  logger: "Logger",
  gap: "Gap",
  option: "Option",
  radio: "Radio",
  vsd: "VSD",
  "modal dialog": "ModalDialog",
  "tab control": "TabControl",
  "tab panel": "TabPanel",
  display: "Display"
};
class Layout extends DesignerPanel {
  allowDelete = false;
  static tableName = "layout";
  static defaultValue = emptyPage;
  settings() {
    return html`<div
      class=${this.CSSClasses("layout")}
      help="Layout tab"
      id=${this.id}
      @keydown=${(event) => {
      const { key, ctrlKey } = event;
      if ((key == "H" || key == "h") && ctrlKey) {
        event.preventDefault();
        this.highlight();
      }
    }}
    >
      ${this.children[0].settings()}
    </div>`;
  }
  allowedChildren = ["Page"];
  /**
   * An opportunity to upgrade the format if needed
   * @param {any} obj
   * @returns {Object}
   */
  static upgrade(obj) {
    function oldToNew(obj2) {
      if ("type" in obj2) {
        const newObj = {
          children: obj2.children.map(
            (child) => oldToNew(child)
          )
        };
        if ("filters" in obj2.props) {
          for (const filter2 of obj2.props.filters) {
            newObj.children.push({
              className: "GridFilter",
              props: { ...filter2 },
              children: []
            });
          }
        }
        newObj.className = typeToClassName[obj2.type];
        const { filters: filters2, ...props } = obj2.props;
        newObj.props = props;
        obj2 = newObj;
      }
      return obj2;
    }
    obj = oldToNew(obj);
    if (obj.className != "Layout" && obj.className == "Page") {
      obj = {
        className: "Layout",
        props: { name: "Layout" },
        children: [obj]
      };
    }
    return obj;
  }
  /** Allow highlighting the current component in the UI
   */
  highlight() {
    for (const element of document.querySelectorAll("#UI [highlight]")) {
      element.removeAttribute("highlight");
    }
    let selected = document.querySelector("#designer .layout [aria-selected]");
    if (!selected) return;
    selected = selected.closest("[id]");
    if (!selected) return;
    const id = selected.id;
    if (!id) return;
    let component = TreeBase.componentFromId(id);
    if (component) {
      const element = document.getElementById(component.id);
      if (element) {
        element.setAttribute("highlight", "component");
        return;
      }
      component = component.parent;
      while (component) {
        const element2 = document.getElementById(component.id);
        if (element2) {
          element2.setAttribute("highlight", "parent");
          return;
        }
        component = component.parent;
      }
    }
  }
  makeVisible() {
    let component = Globals.designer.selectedComponent;
    if (component) {
      const element = document.getElementById(component.id);
      if (element) {
        return;
      }
      component = component.parent;
      let patch = {};
      while (component) {
        if (component instanceof TabPanel && component.parent && component.parent.currentPanel != component) {
          patch[component.parent.stateName.value] = component.name.value;
        } else if (component instanceof ModalDialog) {
          patch[component.stateName.value] = 1;
        }
        component = component.parent;
      }
      callAfterRender(() => this.highlight());
      Globals.state.update(patch);
    }
  }
  /**
   * Merge an object into the panel contents
   * @param {ExternalRep} obj
   * @returns {Promise<void>}
   */
  async merge(obj) {
    console.assert(obj.className == "Layout", obj);
    const toMerge = obj.children[0].children;
    const page = this.children[0];
    for (let newChild of toMerge) {
      if (newChild.className == "Speech") continue;
      TreeBase.fromObject(newChild, page);
    }
    this.onUpdate();
  }
}
TreeBase.register(Layout, "Layout");
class Actions extends DesignerPanel {
  name = new String$1("Actions");
  scale = new Float(1);
  allowedChildren = ["Action"];
  static tableName = "actions";
  static defaultValue = {
    className: "Actions",
    props: {},
    children: []
  };
  /** @type {Action[]} */
  children = [];
  last = {
    /** @type {Action|Null} */
    rule: null,
    /** @type {Row} */
    data: {},
    /** @type {string} */
    event: "",
    /** @type {string} */
    origin: ""
  };
  allowDelete = false;
  configure() {
    this.applyRules("init", "init", {});
  }
  /** @typedef {Object} eventQueueItem
   * @property {string} origin
   * @property {string} event
   */
  /** @type {eventQueueItem[]} */
  eventQueue = [];
  /** queue an event from within an event handler
   * @param {String} origin
   * @param {String} event
   */
  queueEvent(origin, event) {
    this.eventQueue.push({ origin, event });
  }
  /**
   * Attempt to apply a rule
   *
   * @param {string} origin - name of the originating element
   * @param {string} event - type of event that occurred, i.e.press
   * @param {Object} data - data associated with the event
   */
  applyRules(origin, event, data2) {
    this.last = { origin, event, data: data2, rule: null };
    for (; ; ) {
      for (const rule of this.children) {
        if (origin != rule.origin.value && rule.origin.value != "*") {
          continue;
        }
        const result = rule.conditions.every(
          (restriction) => restriction.Condition.valueInContext({ data: data2 })
        );
        if (result) {
          this.last.rule = rule;
          const patch = Object.fromEntries(
            rule.updates.map((update2) => [
              update2.stateName.value,
              update2.newValue.valueInContext({ data: data2 })
            ])
          );
          Globals.state.update(patch);
          break;
        }
      }
      if (this.eventQueue.length == 0) break;
      const item = this.eventQueue.pop();
      if (item) {
        origin = item.origin;
        event = item.event;
      }
      data2 = {};
    }
  }
  /**
   * Pass event to rules
   *
   * @param {string} origin - name of the originating element
   * @param {Object} data - data associated with the event
   * @param {string} [event] - optional name for the event
   * @return {(event:Event) => void}
   */
  handler(origin, data2, event) {
    return (e2) => {
      let ev = event;
      if (e2 instanceof PointerEvent && e2.altKey) {
        ev = "alt-" + event;
      }
      this.applyRules(origin, ev || e2.type, data2);
    };
  }
  /** @returns {Set<string>} */
  allStates() {
    const result = /* @__PURE__ */ new Set();
    for (const rule of this.children) {
      for (const condition of rule.conditions) {
        for (const [match2] of condition.Condition.text.matchAll(/\$\w+/g)) {
          result.add(match2);
        }
      }
      for (const update2 of rule.updates) {
        result.add(update2.stateName.value);
        for (const [match2] of update2.newValue.text.matchAll(/\$\w+/g)) {
          result.add(match2);
        }
      }
    }
    return result;
  }
  settings() {
    const { actions } = Globals;
    const rule = this.last.rule;
    return html`<div
      class=${this.CSSClasses("actions")}
      help="Actions"
      id=${this.id}
    >
      <table>
        <thead>
          <tr>
            <th rowspan="2" style="width:13%">Origin</th>
            <th rowspan="2" style="width:25%">Conditions</th>
            <th colspan="2" style="width:50%">Updates</th>
          </tr>
          <tr>
            <th style="width:15%">State</th>
            <th style="width:35%">New value</th>
          </tr>
        </thead>
        ${actions.children.map((action) => {
      const updates2 = action.updates;
      const rs = updates2.length;
      const used = action === actions.last.rule;
      function showUpdate(update2) {
        return html`
              <td>${update2.stateName.input()}</td>
              <td class="update">${update2.newValue.input()}</td>
            `;
      }
      return html`<tbody ?highlight=${rule == action} class="settings">
            <tr ?used=${used}>
              <td rowspan=${rs}>${action.origin.input()}</td>
              <td class="conditions" rowspan=${rs}>
                <div class="conditions">
                  ${action.conditions.map(
        (condition) => html`<div class="condition">
                        ${condition.Condition.input()}
                      </div>`
      )}
                </div>
              </td>
              ${!rs ? html`<td></td>
                    <td></td>` : showUpdate(updates2[0])}
            </tr>
            ${updates2.slice(1).map(
        (update2) => html`<tr ?used=${used}>
                  ${showUpdate(update2)}
                </tr>`
      )}
          </tbody>`;
    })}
      </table>
    </div>`;
  }
  /** @param {any} actions */
  static upgrade(actions) {
    if (Array.isArray(actions)) {
      actions = {
        className: "Actions",
        props: {},
        children: actions.map((action) => {
          let { event, origin, conditions, updates: updates2 } = action;
          const children = [];
          for (const condition of conditions) {
            children.push({
              className: "ActionCondition",
              props: { Condition: condition },
              children: []
            });
          }
          for (const [$var, value] of Object.entries(updates2)) {
            children.push({
              className: "ActionUpdate",
              props: { stateName: $var, newValue: value },
              children: []
            });
          }
          if (event == "init") origin = "init";
          return {
            className: "Action",
            props: { origin },
            children
          };
        })
      };
    }
    return actions;
  }
  /**
   * Merge an object into the panel contents
   * @param {ExternalRep} obj
   * @returns {Promise<void>}
   */
  async merge(obj) {
    console.assert(obj.className == "Actions", obj);
    const toMerge = obj.children;
    for (let newChild of toMerge) {
      TreeBase.fromObject(newChild, this);
    }
    this.onUpdate();
  }
}
TreeBase.register(Actions, "Actions");
let Action$1 = class Action extends TreeBase {
  allowedChildren = ["ActionCondition", "ActionUpdate"];
  /** @type {(ActionCondition | ActionUpdate)[]} */
  children = [];
  origin = new String$1("", { hiddenLabel: true });
  get conditions() {
    return this.filterChildren(ActionCondition);
  }
  get updates() {
    return this.filterChildren(ActionUpdate);
  }
  init() {
    super.init();
    if (this.children.length == 0) {
      TreeBase.create(ActionCondition, this, {}).init();
      TreeBase.create(ActionUpdate, this, {}).init();
    }
  }
};
TreeBase.register(Action$1, "Action");
class ActionCondition extends TreeBase {
  Condition = new Conditional("", {
    hiddenLabel: true,
    valueWhenEmpty: true
  });
  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(ActionCondition, "ActionCondition");
class ActionUpdate extends TreeBase {
  stateName = new String$1("", { hiddenLabel: true });
  newValue = new Expression("", { hiddenLabel: true });
  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(ActionUpdate, "ActionUpdate");
function showHints() {
  document.body.classList.add("hints");
}
function clearHints() {
  document.body.classList.remove("hints");
}
function editMode() {
  Globals.state.update({ editing: true });
}
function userMode() {
  Globals.state.update({ editing: false });
  clearHints();
}
function clickToolbar(key) {
  clearHints();
  const hint = document.querySelector(`.toolbar div[hint="${key}" i]`);
  if (hint) {
    const input = (
      /** @type {HTMLInputElement} */
      hint.querySelector("button,input")
    );
    input.focus();
    input.click();
  }
}
function focusUI() {
  clearHints();
  document.getElementById("UI")?.focus();
}
function focusPanel() {
  clearHints();
  Globals.designer.restoreFocus();
}
function focusTabs() {
  clearHints();
  const currentTab = (
    /** @type {HTMLButtonElement} */
    document.querySelector("#designer #tabs .buttons button[active]")
  );
  console.log({ currentTab });
  if (currentTab) {
    currentTab.focus();
    return;
  }
  const tabs = (
    /** @type {HTMLButtonElement[]} */
    [
      ...document.querySelectorAll(".designing #designer #tabs .buttons button")
    ]
  );
  if (!tabs.length) return;
  tabs[0].focus();
}
const State2 = {
  user: "user",
  userA: "userA",
  editing: "editing",
  hints: "hints"
};
let state = void 0;
const transitions = [
  { state: State2.user, key: /alt/i, next: State2.userA },
  { state: State2.userA, key: /d/i, next: State2.editing, call: editMode },
  { state: State2.editing, key: /alt/i, next: State2.hints, call: showHints },
  { state: State2.hints, key: /d/i, next: State2.user, call: userMode },
  { state: State2.hints, key: /[nfeah]/i, next: State2.editing, call: clickToolbar },
  { state: State2.hints, key: /t/i, next: State2.editing, call: focusTabs },
  { state: State2.hints, key: /u/i, next: State2.editing, call: focusUI },
  { state: State2.hints, key: /p/i, next: State2.editing, call: focusPanel },
  { state: State2.hints, key: /shift/i, next: State2.hints },
  { state: State2.hints, key: /.*/i, next: State2.editing, call: clearHints }
];
function HotKeyHandler(event) {
  if (!Globals.state) return;
  if (!state) {
    state = Globals.state.get("editing") ? State2.editing : State2.user;
  }
  const key = event.key;
  if (!key) return;
  for (const T of transitions) {
    if (T.state == state) {
      const match2 = key.match(T.key);
      if (match2 && match2[0].length === key.length) {
        event.preventDefault();
        if (event.repeat) break;
        state = T.next;
        if (T.call) {
          T.call(key);
        }
        break;
      }
    }
  }
}
document.addEventListener("keydown", HotKeyHandler, { capture: true });
window.addEventListener("blur", () => {
  clearHints();
});
class Customize extends TreeBase {
  name = new String$1("Style");
  css = new Code("", { placeholder: "Enter CSS", label: "CSS" });
  /** @type {string[]} */
  allowedChildren = [];
  template() {
    return html`<style>
      ${Globals.state.interpolate(this.css.editedValue)}
    </style>`;
  }
}
TreeBase.register(Customize, "Customize");
class imgFromDb extends HTMLImageElement {
  // watch for changes in dbsrc
  static get observedAttributes() {
    return ["dbsrc", "refresh"];
  }
  /**
   * Handle changes in dbsrc
   * @param {string} name
   * @param {string} _
   * @param {string} newValue */
  attributeChangedCallback(name, _, newValue) {
    if (name === "dbsrc" && newValue) {
      this.updateSrcFromDb(newValue);
    }
  }
  /**
   * Look again at the db which may have changed
   */
  async refresh() {
    const url = this.getAttribute("dbsrc") || "";
    return this.updateSrcFromDb(url);
  }
  /** Update the img src from the db or the provided url
   * @param {string} url
   */
  async updateSrcFromDb(url) {
    if (url && url.indexOf("/") < 0) url = await db.getMediaURL(url);
    if (url) {
      this.src = url;
      this.dispatchEvent(new Event("load", { bubbles: true }));
    }
  }
}
customElements.define("img-db", imgFromDb, { extends: "img" });
class videoFromDb extends HTMLVideoElement {
  // watch for changes in dbsrc
  static get observedAttributes() {
    return ["dbsrc", "refresh"];
  }
  /**
   * Handle changes in dbsrc
   * @param {string} name
   * @param {string} _
   * @param {string} newValue */
  attributeChangedCallback(name, _, newValue) {
    if (name === "dbsrc" && newValue) {
      this.updateSrcFromDb(newValue);
    }
  }
  /**
   * Look again at the db which may have changed
   */
  async refresh() {
    const url = this.getAttribute("dbsrc") || "";
    return this.updateSrcFromDb(url);
  }
  /** Update the img src from the db or the provided url
   * @param {string} url
   */
  async updateSrcFromDb(url) {
    if (url && url.indexOf("/") < 0) url = await db.getMediaURL(url);
    if (url) this.src = url;
  }
}
customElements.define("video-db", videoFromDb, { extends: "video" });
var extendStatics = function(d2, b3) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b5) {
    d3.__proto__ = b5;
  } || function(d3, b5) {
    for (var p2 in b5) if (Object.prototype.hasOwnProperty.call(b5, p2)) d3[p2] = b5[p2];
  };
  return extendStatics(d2, b3);
};
function __extends(d2, b3) {
  if (typeof b3 !== "function" && b3 !== null)
    throw new TypeError("Class extends value " + String(b3) + " is not a constructor or null");
  extendStatics(d2, b3);
  function __() {
    this.constructor = d2;
  }
  d2.prototype = b3 === null ? Object.create(b3) : (__.prototype = b3.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t2) {
    for (var s2, i = 1, n2 = arguments.length; i < n2; i++) {
      s2 = arguments[i];
      for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2)) t2[p2] = s2[p2];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e2) {
        reject(e2);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t2[0] & 1) throw t2[1];
    return t2[1];
  }, trys: [], ops: [] }, f2, y2, t2, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n2) {
    return function(v2) {
      return step([n2, v2]);
    };
  }
  function step(op) {
    if (f2) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done) return t2;
      if (y2 = 0, t2) op = [op[0] & 2, t2.value];
      switch (op[0]) {
        case 0:
        case 1:
          t2 = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y2 = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t2[1]) {
            _.label = t2[1];
            t2 = op;
            break;
          }
          if (t2 && _.label < t2[2]) {
            _.label = t2[2];
            _.ops.push(op);
            break;
          }
          if (t2[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e2) {
      op = [6, e2];
      y2 = 0;
    } finally {
      f2 = t2 = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o2) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o2[s2], i = 0;
  if (m2) return m2.call(o2);
  if (o2 && typeof o2.length === "number") return {
    next: function() {
      if (o2 && i >= o2.length) o2 = void 0;
      return { value: o2 && o2[i++], done: !o2 };
    }
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o2, n2) {
  var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
  if (!m2) return o2;
  var i = m2.call(o2), r, ar = [], e2;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e2 = { error };
  } finally {
    try {
      if (r && !r.done && (m2 = i["return"])) m2.call(i);
    } finally {
      if (e2) throw e2.error;
    }
  }
  return ar;
}
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l2 = from2.length, ar; i < l2; i++) {
    if (ar || !(i in from2)) {
      if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
      ar[i] = from2[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
function __await(v2) {
  return this instanceof __await ? (this.v = v2, this) : new __await(v2);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f2) {
    return function(v2) {
      return Promise.resolve(v2).then(f2, reject);
    };
  }
  function verb(n2, f2) {
    if (g[n2]) {
      i[n2] = function(v2) {
        return new Promise(function(a2, b3) {
          q.push([n2, v2, a2, b3]) > 1 || resume(n2, v2);
        });
      };
      if (f2) i[n2] = f2(i[n2]);
    }
  }
  function resume(n2, v2) {
    try {
      step(g[n2](v2));
    } catch (e2) {
      settle(q[0][3], e2);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f2, v2) {
    if (f2(v2), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o2) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m2 = o2[Symbol.asyncIterator], i;
  return m2 ? m2.call(o2) : (o2 = typeof __values === "function" ? __values(o2) : o2[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n2) {
    i[n2] = o2[n2] && function(v2) {
      return new Promise(function(resolve2, reject) {
        v2 = o2[n2](v2), settle(resolve2, reject, v2.done, v2.value);
      });
    };
  }
  function settle(resolve2, reject, d2, v2) {
    Promise.resolve(v2).then(function(v3) {
      resolve2({ value: v3, done: d2 });
    }, reject);
  }
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e2 = new Error(message);
  return e2.name = "SuppressedError", e2.error = error, e2.suppressed = suppressed, e2;
};
function isFunction(value) {
  return typeof value === "function";
}
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err2, i) {
      return i + 1 + ") " + err2.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a2, e_2, _b2;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a2 = _parentage_1.return)) _a2.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e2) {
          errors = e2 instanceof UnsubscriptionError ? e2.errors : [e2];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err2) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err2 instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err2.errors));
              } else {
                errors.push(err2);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b2 = _finalizers_1.return)) _b2.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a2;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a2 = this._finalizers) !== null && _a2 !== void 0 ? _a2 : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty2 = new Subscription2();
    empty2.closed = true;
    return empty2;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}
var config = {
  Promise: void 0
};
var timeoutProvider = {
  setTimeout: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearTimeout: function(handle) {
    return clearTimeout(handle);
  },
  delegate: void 0
};
function reportUnhandledError(err2) {
  timeoutProvider.setTimeout(function() {
    {
      throw err2;
    }
  });
}
function noop() {
}
function errorContext(cb) {
  {
    cb();
  }
}
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) ;
    else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err2) {
    if (this.isStopped) ;
    else {
      this.isStopped = true;
      this._error(err2);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) ;
    else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err2) {
    try {
      this.destination.error(err2);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err2) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err2);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err2);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err2) {
  throw err2;
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
function identity(x) {
  return x;
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a2 = _this, operator = _a2.operator, source = _a2.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err2) {
      sink.error(err2);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve2, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err2) {
            reject(err2);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve2
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a2;
    return (_a2 = this.source) === null || _a2 === void 0 ? void 0 : _a2.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve2, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err2) {
        return reject(err2);
      }, function() {
        return resolve2(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a2;
  return (_a2 = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a2 !== void 0 ? _a2 : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}
function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init2) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init2(liftedSource, this);
        } catch (err2) {
          this.error(err2);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err2) {
        destination.error(err2);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err2) {
      try {
        onError(err2);
      } catch (err3) {
        destination.error(err3);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a2;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a2 = this.onFinalize) === null || _a2 === void 0 ? void 0 : _a2.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber);
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a2;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b2 = __values(_this.currentObservers), _c = _b2.next(); !_c.done; _c = _b2.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a2 = _b2.return)) _a2.call(_b2);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err2) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err2;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err2);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a2;
      return ((_a2 = this.observers) === null || _a2 === void 0 ? void 0 : _a2.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a2 = this, hasError = _a2.hasError, isStopped = _a2.isStopped, observers = _a2.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a2 = this, hasError = _a2.hasError, thrownError = _a2.thrownError, isStopped = _a2.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a2, _b2;
    (_b2 = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.next) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, value);
  };
  AnonymousSubject2.prototype.error = function(err2) {
    var _a2, _b2;
    (_b2 = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.error) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, err2);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a2, _b2;
    (_b2 = (_a2 = this.destination) === null || _a2 === void 0 ? void 0 : _a2.complete) === null || _b2 === void 0 ? void 0 : _b2.call(_a2);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a2, _b2;
    return (_b2 = (_a2 = this.source) === null || _a2 === void 0 ? void 0 : _a2.subscribe(subscriber)) !== null && _b2 !== void 0 ? _b2 : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);
var dateTimestampProvider = {
  now: function() {
    return (dateTimestampProvider.delegate || Date).now();
  },
  delegate: void 0
};
var ReplaySubject = function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a2 = this, isStopped = _a2.isStopped, _buffer = _a2._buffer, _infiniteTimeWindow = _a2._infiniteTimeWindow, _timestampProvider = _a2._timestampProvider, _windowTime = _a2._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a2 = this, _infiniteTimeWindow = _a2._infiniteTimeWindow, _buffer = _a2._buffer;
    var copy2 = _buffer.slice();
    for (var i = 0; i < copy2.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy2[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a2 = this, _bufferSize = _a2._bufferSize, _timestampProvider = _a2._timestampProvider, _buffer = _a2._buffer, _infiniteTimeWindow = _a2._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now = _timestampProvider.now();
      var last2 = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
        last2 = i;
      }
      last2 && _buffer.splice(0, last2 + 1);
    }
  };
  return ReplaySubject2;
}(Subject);
var Action2 = function(_super) {
  __extends(Action3, _super);
  function Action3(scheduler, work) {
    return _super.call(this) || this;
  }
  Action3.prototype.schedule = function(state2, delay2) {
    return this;
  };
  return Action3;
}(Subscription);
var intervalProvider = {
  setInterval: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearInterval: function(handle) {
    return clearInterval(handle);
  },
  delegate: void 0
};
var AsyncAction = function(_super) {
  __extends(AsyncAction2, _super);
  function AsyncAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }
  AsyncAction2.prototype.schedule = function(state2, delay2) {
    var _a2;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (this.closed) {
      return this;
    }
    this.state = state2;
    var id = this.id;
    var scheduler = this.scheduler;
    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay2);
    }
    this.pending = true;
    this.delay = delay2;
    this.id = (_a2 = this.id) !== null && _a2 !== void 0 ? _a2 : this.requestAsyncId(scheduler, this.id, delay2);
    return this;
  };
  AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
  };
  AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && this.delay === delay2 && this.pending === false) {
      return id;
    }
    if (id != null) {
      intervalProvider.clearInterval(id);
    }
    return void 0;
  };
  AsyncAction2.prototype.execute = function(state2, delay2) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }
    this.pending = false;
    var error = this._execute(state2, delay2);
    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };
  AsyncAction2.prototype._execute = function(state2, _delay) {
    var errored = false;
    var errorValue;
    try {
      this.work(state2);
    } catch (e2) {
      errored = true;
      errorValue = e2 ? e2 : new Error("Scheduled action threw falsy error");
    }
    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };
  AsyncAction2.prototype.unsubscribe = function() {
    if (!this.closed) {
      var _a2 = this, id = _a2.id, scheduler = _a2.scheduler;
      var actions = scheduler.actions;
      this.work = this.state = this.scheduler = null;
      this.pending = false;
      arrRemove(actions, this);
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
      this.delay = null;
      _super.prototype.unsubscribe.call(this);
    }
  };
  return AsyncAction2;
}(Action2);
var Scheduler = function() {
  function Scheduler2(schedulerActionCtor, now) {
    if (now === void 0) {
      now = Scheduler2.now;
    }
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = now;
  }
  Scheduler2.prototype.schedule = function(work, delay2, state2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return new this.schedulerActionCtor(this, work).schedule(state2, delay2);
  };
  Scheduler2.now = dateTimestampProvider.now;
  return Scheduler2;
}();
var AsyncScheduler = function(_super) {
  __extends(AsyncScheduler2, _super);
  function AsyncScheduler2(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }
    var _this = _super.call(this, SchedulerAction, now) || this;
    _this.actions = [];
    _this._active = false;
    return _this;
  }
  AsyncScheduler2.prototype.flush = function(action) {
    var actions = this.actions;
    if (this._active) {
      actions.push(action);
      return;
    }
    var error;
    this._active = true;
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());
    this._active = false;
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsyncScheduler2;
}(Scheduler);
var asyncScheduler = new AsyncScheduler(AsyncAction);
var async = asyncScheduler;
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});
function isScheduler(value) {
  return value && isFunction(value.schedule);
}
function last(arr) {
  return arr[arr.length - 1];
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : void 0;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}
var isArrayLike = function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};
function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}
function isInteropObservable(input) {
  return isFunction(input[observable]);
}
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();
function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a2, value, done;
    return __generator(this, function(_b2) {
      switch (_b2.label) {
        case 0:
          reader = readableStream.getReader();
          _b2.label = 1;
        case 1:
          _b2.trys.push([1, , 9, 10]);
          _b2.label = 2;
        case 2:
          return [4, __await(reader.read())];
        case 3:
          _a2 = _b2.sent(), value = _a2.value, done = _a2.done;
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b2.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b2.sent()];
        case 7:
          _b2.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array2) {
  return new Observable(function(subscriber) {
    for (var i = 0; i < array2.length && !subscriber.closed; i++) {
      subscriber.next(array2[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err2) {
      return subscriber.error(err2);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a2;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a2 = iterable_1.return)) _a2.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process(asyncIterable, subscriber).catch(function(err2) {
      return subscriber.error(err2);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a2;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator(this, function(_b2) {
      switch (_b2.label) {
        case 0:
          _b2.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b2.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b2.sent(), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b2.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b2.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b2.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a2 = asyncIterable_1.return))) return [3, 8];
          return [4, _a2.call(asyncIterable_1)];
        case 7:
          _b2.sent();
          _b2.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}
function executeSchedule(parentSubscription, scheduler, work, delay2, repeat) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  if (repeat === void 0) {
    repeat = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay2));
    } else {
      this.unsubscribe();
    }
  }, delay2);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}
function observeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source, subscriber) {
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay2);
    }, function() {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay2);
    }, function(err2) {
      return executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err2);
      }, delay2);
    }));
  });
}
function subscribeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return operate(function(source, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source.subscribe(subscriber);
    }, delay2));
  });
}
function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
function scheduleArray(input, scheduler) {
  return new Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}
function scheduleIterable(input, scheduler) {
  return new Observable(function(subscriber) {
    var iterator$1;
    executeSchedule(subscriber, scheduler, function() {
      iterator$1 = input[iterator]();
      executeSchedule(subscriber, scheduler, function() {
        var _a2;
        var value;
        var done;
        try {
          _a2 = iterator$1.next(), value = _a2.value, done = _a2.done;
        } catch (err2) {
          subscriber.error(err2);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return();
    };
  });
}
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function(subscriber) {
    executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}
function of() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  return from(args, scheduler);
}
function isValidDate(value) {
  return value instanceof Date && !isNaN(value);
}
function map(project, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}
var isArray = Array.isArray;
function callOrApply(fn, args) {
  return isArray(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
}
function mapOneOrManyArgs(fn) {
  return map(function(args) {
    return callOrApply(fn, args);
  });
}
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
  var buffer = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer.push(value);
  };
  var doInnerSub = function(value) {
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
      {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer.shift();
            if (innerSubScheduler) ;
            else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err2) {
          subscriber.error(err2);
        }
      }
    }));
  };
  source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
  };
}
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction(resultSelector)) {
    return mergeMap(function(a2, i) {
      return map(function(b3, ii) {
        return resultSelector(a2, b3, i, ii);
      })(innerFrom(project(a2, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function(source, subscriber) {
    return mergeInternals(source, subscriber, project, concurrent);
  });
}
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}
var nodeEventEmitterMethods = ["addListener", "removeListener"];
var eventTargetMethods = ["addEventListener", "removeEventListener"];
var jqueryMethods = ["on", "off"];
function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction(options)) {
    resultSelector = options;
    options = void 0;
  }
  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
  }
  var _a2 = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler, options);
    };
  }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a2[0], remove2 = _a2[1];
  if (!add) {
    if (isArrayLike(target)) {
      return mergeMap(function(subTarget) {
        return fromEvent(subTarget, eventName, options);
      })(innerFrom(target));
    }
  }
  if (!add) {
    throw new TypeError("Invalid event target");
  }
  return new Observable(function(subscriber) {
    var handler = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return subscriber.next(1 < args.length ? args : args[0]);
    };
    add(handler);
    return function() {
      return remove2(handler);
    };
  });
}
function toCommonHandlerRegistry(target, eventName) {
  return function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler);
    };
  };
}
function isNodeStyleEventEmitter(target) {
  return isFunction(target.addListener) && isFunction(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
  return isFunction(target.on) && isFunction(target.off);
}
function isEventTarget(target) {
  return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
}
function timer(dueTime, intervalOrScheduler, scheduler) {
  if (dueTime === void 0) {
    dueTime = 0;
  }
  if (scheduler === void 0) {
    scheduler = async;
  }
  var intervalDuration = -1;
  if (intervalOrScheduler != null) {
    if (isScheduler(intervalOrScheduler)) {
      scheduler = intervalOrScheduler;
    } else {
      intervalDuration = intervalOrScheduler;
    }
  }
  return new Observable(function(subscriber) {
    var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
    if (due < 0) {
      due = 0;
    }
    var n2 = 0;
    return scheduler.schedule(function() {
      if (!subscriber.closed) {
        subscriber.next(n2++);
        if (0 <= intervalDuration) {
          this.schedule(void 0, intervalDuration);
        } else {
          subscriber.complete();
        }
      }
    }, due);
  });
}
function merge$1() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}
function filter(predicate, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}
function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
  return function(source, subscriber) {
    var hasState = hasSeed;
    var state2 = seed;
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var i = index++;
      state2 = hasState ? accumulator(state2, value, i) : (hasState = true, value);
      subscriber.next(state2);
    }, emitBeforeComplete));
  };
}
function debounceTime(dueTime, scheduler) {
  if (scheduler === void 0) {
    scheduler = asyncScheduler;
  }
  return operate(function(source, subscriber) {
    var activeTask = null;
    var lastValue = null;
    var lastTime = null;
    var emit = function() {
      if (activeTask) {
        activeTask.unsubscribe();
        activeTask = null;
        var value = lastValue;
        lastValue = null;
        subscriber.next(value);
      }
    };
    function emitWhenIdle() {
      var targetTime = lastTime + dueTime;
      var now = scheduler.now();
      if (now < targetTime) {
        activeTask = this.schedule(void 0, targetTime - now);
        subscriber.add(activeTask);
        return;
      }
      emit();
    }
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      lastValue = value;
      lastTime = scheduler.now();
      if (!activeTask) {
        activeTask = scheduler.schedule(emitWhenIdle, dueTime);
        subscriber.add(activeTask);
      }
    }, function() {
      emit();
      subscriber.complete();
    }, void 0, function() {
      lastValue = activeTask = null;
    }));
  });
}
function take(count) {
  return count <= 0 ? function() {
    return EMPTY;
  } : operate(function(source, subscriber) {
    var seen2 = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      if (++seen2 <= count) {
        subscriber.next(value);
        if (count <= seen2) {
          subscriber.complete();
        }
      }
    }));
  });
}
function mapTo(value) {
  return map(function() {
    return value;
  });
}
function delayWhen(delayDurationSelector, subscriptionDelay) {
  return mergeMap(function(value, index) {
    return innerFrom(delayDurationSelector(value, index)).pipe(take(1), mapTo(value));
  });
}
function delay(due, scheduler) {
  if (scheduler === void 0) {
    scheduler = asyncScheduler;
  }
  var duration = timer(due, scheduler);
  return delayWhen(function() {
    return duration;
  });
}
function distinctUntilChanged(comparator2, keySelector) {
  if (keySelector === void 0) {
    keySelector = identity;
  }
  comparator2 = comparator2 !== null && comparator2 !== void 0 ? comparator2 : defaultCompare;
  return operate(function(source, subscriber) {
    var previousKey;
    var first = true;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var currentKey = keySelector(value);
      if (first || !comparator2(previousKey, currentKey)) {
        first = false;
        previousKey = currentKey;
        subscriber.next(value);
      }
    }));
  });
}
function defaultCompare(a2, b3) {
  return a2 === b3;
}
function distinctUntilKeyChanged(key, compare) {
  return distinctUntilChanged(function(x, y2) {
    return x[key] === y2[key];
  });
}
function groupBy(keySelector, elementOrOptions, duration, connector) {
  return operate(function(source, subscriber) {
    var element;
    if (!elementOrOptions || typeof elementOrOptions === "function") {
      element = elementOrOptions;
    }
    var groups = /* @__PURE__ */ new Map();
    var notify = function(cb) {
      groups.forEach(cb);
      cb(subscriber);
    };
    var handleError = function(err2) {
      return notify(function(consumer) {
        return consumer.error(err2);
      });
    };
    var activeGroups = 0;
    var teardownAttempted = false;
    var groupBySourceSubscriber = new OperatorSubscriber(subscriber, function(value) {
      try {
        var key_1 = keySelector(value);
        var group_1 = groups.get(key_1);
        if (!group_1) {
          groups.set(key_1, group_1 = connector ? connector() : new Subject());
          var grouped = createGroupedObservable(key_1, group_1);
          subscriber.next(grouped);
          if (duration) {
            var durationSubscriber_1 = createOperatorSubscriber(group_1, function() {
              group_1.complete();
              durationSubscriber_1 === null || durationSubscriber_1 === void 0 ? void 0 : durationSubscriber_1.unsubscribe();
            }, void 0, void 0, function() {
              return groups.delete(key_1);
            });
            groupBySourceSubscriber.add(innerFrom(duration(grouped)).subscribe(durationSubscriber_1));
          }
        }
        group_1.next(element ? element(value) : value);
      } catch (err2) {
        handleError(err2);
      }
    }, function() {
      return notify(function(consumer) {
        return consumer.complete();
      });
    }, handleError, function() {
      return groups.clear();
    }, function() {
      teardownAttempted = true;
      return activeGroups === 0;
    });
    source.subscribe(groupBySourceSubscriber);
    function createGroupedObservable(key, groupSubject) {
      var result = new Observable(function(groupSubscriber) {
        activeGroups++;
        var innerSub = groupSubject.subscribe(groupSubscriber);
        return function() {
          innerSub.unsubscribe();
          --activeGroups === 0 && teardownAttempted && groupBySourceSubscriber.unsubscribe();
        };
      });
      result.key = key;
      return result;
    }
  });
}
function merge() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  return operate(function(source, subscriber) {
    mergeAll(concurrent)(from(__spreadArray([source], __read(args)), scheduler)).subscribe(subscriber);
  });
}
function mergeWith() {
  var otherSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherSources[_i] = arguments[_i];
  }
  return merge.apply(void 0, __spreadArray([], __read(otherSources)));
}
function retry(configOrCount) {
  if (configOrCount === void 0) {
    configOrCount = Infinity;
  }
  var config2;
  if (configOrCount && typeof configOrCount === "object") {
    config2 = configOrCount;
  } else {
    config2 = {
      count: configOrCount
    };
  }
  var _a2 = config2.count, count = _a2 === void 0 ? Infinity : _a2, delay2 = config2.delay, _b2 = config2.resetOnSuccess, resetOnSuccess = _b2 === void 0 ? false : _b2;
  return count <= 0 ? identity : operate(function(source, subscriber) {
    var soFar = 0;
    var innerSub;
    var subscribeForRetry = function() {
      var syncUnsub = false;
      innerSub = source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        if (resetOnSuccess) {
          soFar = 0;
        }
        subscriber.next(value);
      }, void 0, function(err2) {
        if (soFar++ < count) {
          var resub_1 = function() {
            if (innerSub) {
              innerSub.unsubscribe();
              innerSub = null;
              subscribeForRetry();
            } else {
              syncUnsub = true;
            }
          };
          if (delay2 != null) {
            var notifier = typeof delay2 === "number" ? timer(delay2) : innerFrom(delay2(err2, soFar));
            var notifierSubscriber_1 = createOperatorSubscriber(subscriber, function() {
              notifierSubscriber_1.unsubscribe();
              resub_1();
            }, function() {
              subscriber.complete();
            });
            notifier.subscribe(notifierSubscriber_1);
          } else {
            resub_1();
          }
        } else {
          subscriber.error(err2);
        }
      }));
      if (syncUnsub) {
        innerSub.unsubscribe();
        innerSub = null;
        subscribeForRetry();
      }
    };
    subscribeForRetry();
  });
}
function scan(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
}
function skipWhile(predicate) {
  return operate(function(source, subscriber) {
    var taking = false;
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return (taking || (taking = !predicate(value, index++))) && subscriber.next(value);
    }));
  });
}
function switchMap(project, resultSelector) {
  return operate(function(source, subscriber) {
    var innerSubscriber = null;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      return isComplete && !innerSubscriber && subscriber.complete();
    };
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      var innerIndex = 0;
      var outerIndex = index++;
      innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
        return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
      }, function() {
        innerSubscriber = null;
        checkComplete();
      }));
    }, function() {
      isComplete = true;
      checkComplete();
    }));
  });
}
function takeUntil(notifier) {
  return operate(function(source, subscriber) {
    innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, function() {
      return subscriber.complete();
    }, noop));
    !subscriber.closed && source.subscribe(subscriber);
  });
}
function tap$1(observerOrNext, error, complete) {
  var tapObserver = isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
  return tapObserver ? operate(function(source, subscriber) {
    var _a2;
    (_a2 = tapObserver.subscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
    var isUnsub = true;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      var _a3;
      (_a3 = tapObserver.next) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver, value);
      subscriber.next(value);
    }, function() {
      var _a3;
      isUnsub = false;
      (_a3 = tapObserver.complete) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver);
      subscriber.complete();
    }, function(err2) {
      var _a3;
      isUnsub = false;
      (_a3 = tapObserver.error) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver, err2);
      subscriber.error(err2);
    }, function() {
      var _a3, _b2;
      if (isUnsub) {
        (_a3 = tapObserver.unsubscribe) === null || _a3 === void 0 ? void 0 : _a3.call(tapObserver);
      }
      (_b2 = tapObserver.finalize) === null || _b2 === void 0 ? void 0 : _b2.call(tapObserver);
    }));
  }) : identity;
}
function throttle(durationSelector, config2) {
  return operate(function(source, subscriber) {
    var _a2 = config2 !== null && config2 !== void 0 ? config2 : {}, _b2 = _a2.leading, leading = _b2 === void 0 ? true : _b2, _c = _a2.trailing, trailing = _c === void 0 ? false : _c;
    var hasValue = false;
    var sendValue = null;
    var throttled = null;
    var isComplete = false;
    var endThrottling = function() {
      throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
      throttled = null;
      if (trailing) {
        send();
        isComplete && subscriber.complete();
      }
    };
    var cleanupThrottling = function() {
      throttled = null;
      isComplete && subscriber.complete();
    };
    var startThrottle = function(value) {
      return throttled = innerFrom(durationSelector(value)).subscribe(createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling));
    };
    var send = function() {
      if (hasValue) {
        hasValue = false;
        var value = sendValue;
        sendValue = null;
        subscriber.next(value);
        !isComplete && startThrottle(value);
      }
    };
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      sendValue = value;
      !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
    }, function() {
      isComplete = true;
      !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
    }));
  });
}
function throttleTime(duration, scheduler, config2) {
  if (scheduler === void 0) {
    scheduler = asyncScheduler;
  }
  var duration$ = timer(duration, scheduler);
  return throttle(function() {
    return duration$;
  }, config2);
}
const defaultMethods = {
  className: "MethodChooser",
  props: {},
  children: [
    {
      className: "Method",
      props: {
        Name: "2 switch",
        Key: "idl6e14meiwzjdcquhgk9",
        KeyDebounce: 0.1,
        PointerEnterDebounce: 0,
        PointerDownDebounce: 0,
        Active: "false",
        Pattern: "DefaultPattern"
      },
      children: [
        {
          className: "KeyHandler",
          props: { Signal: "keyup" },
          children: [
            {
              className: "HandlerKeyCondition",
              props: { Key: " " },
              children: []
            },
            {
              className: "HandlerKeyCondition",
              props: { Key: "ArrowRight" },
              children: []
            },
            {
              className: "ResponderNext",
              props: { Response: "ResponderNext" },
              children: []
            }
          ]
        },
        {
          className: "KeyHandler",
          props: { Signal: "keyup" },
          children: [
            {
              className: "HandlerKeyCondition",
              props: { Key: "Enter" },
              children: []
            },
            {
              className: "HandlerKeyCondition",
              props: { Key: "ArrowLeft" },
              children: []
            },
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: []
            }
          ]
        }
      ]
    },
    {
      className: "Method",
      props: {
        Name: "Pointer dwell",
        Key: "idl6wcdmjjkb48xmbxscn",
        KeyDebounce: 0,
        PointerEnterDebounce: 0.1,
        PointerDownDebounce: 0.1,
        Active: "false",
        Pattern: "idl83jg7qtj9wmyggtxf"
      },
      children: [
        {
          className: "PointerHandler",
          props: { Signal: "pointerover" },
          children: [
            {
              className: "ResponderCue",
              props: { Response: "ResponderCue", Cue: "idl7qm4cs28fh2ogf4ni" },
              children: []
            },
            {
              className: "ResponderStartTimer",
              props: {
                Response: "ResponderStartTimer",
                TimerName: "idl7yrtido633vxa1bb1v"
              },
              children: []
            }
          ]
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerout" },
          children: [
            {
              className: "ResponderClearCue",
              props: { Response: "ResponderClearCue" },
              children: []
            }
          ]
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerdown" },
          children: [
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: []
            }
          ]
        },
        {
          className: "Timer",
          props: {
            Interval: "1.5",
            Name: "dwell",
            Key: "idl7yrtido633vxa1bb1v"
          },
          children: []
        },
        {
          className: "TimerHandler",
          props: { Signal: "timer", TimerName: "idl7yrtido633vxa1bb1v" },
          children: [
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: []
            }
          ]
        }
      ]
    },
    {
      className: "Method",
      props: {
        Name: "Mouse",
        KeyDebounce: 0,
        PointerEnterDebounce: 0,
        PointerDownDebounce: 0,
        Key: "idl84ljjeoebyl94sow87",
        Active: "true",
        Pattern: "idl83jg7qtj9wmyggtxf"
      },
      children: [
        {
          className: "PointerHandler",
          props: { Signal: "pointerup" },
          children: [
            {
              className: "ResponderActivate",
              props: { Response: "ResponderActivate" },
              children: []
            }
          ]
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerover" },
          children: [
            {
              className: "ResponderCue",
              props: { Response: "ResponderCue", Cue: "idl7qm4cs28fh2ogf4ni" },
              children: []
            }
          ]
        },
        {
          className: "PointerHandler",
          props: { Signal: "pointerout" },
          children: [
            {
              className: "ResponderClearCue",
              props: { Response: "ResponderClearCue" },
              children: []
            }
          ]
        }
      ]
    }
  ]
};
function toggleIndicator(toggle2, title) {
  if (toggle2) {
    return html`<span class="indicator" title=${title}>&#9679;</span>`;
  } else {
    return html`<!--empty-->`;
  }
}
const stop$ = new Subject();
class MethodChooser extends DesignerPanel {
  name = new String$1("Methods");
  allowedChildren = ["Method"];
  /** @type {Method[]} */
  children = [];
  allowDelete = false;
  static tableName = "method";
  static defaultValue = defaultMethods;
  configure() {
    this.stop();
    for (const method of this.children) {
      method.configure(stop$);
    }
  }
  stop() {
    stop$.next(1);
  }
  settings() {
    return html`<div class=${this.CSSClasses("MethodChooser")} id=${this.id}>
      ${this.unorderedChildren()}
    </div> `;
  }
  refresh() {
    this.children.filter((child) => child.Active.value).forEach((child) => child.refresh());
  }
  /**
   * Upgrade Methods
   * @param {any} obj
   * @returns {Object}
   */
  static upgrade(obj) {
    if (obj.className != "MethodChooser") return obj;
    for (const method of obj.children) {
      if (method.className != "Method") {
        throw new Error("Invalid Method upgrade");
      }
      if (!("KeyDebounce" in method.props)) {
        let keyDebounce = 0;
        let enterDebounce = 0;
        let downDebounce = 0;
        for (const handler of method.children) {
          if (["PointerHandler", "KeyHandler"].includes(handler.className)) {
            const debounce2 = parseFloat(handler.props.Debounce || "0");
            const signal = handler.props.Signal;
            if (signal.startsWith("key")) {
              keyDebounce = Math.max(keyDebounce, debounce2);
            } else if (["pointerover", "pointerout"].includes(signal)) {
              enterDebounce = Math.max(enterDebounce, debounce2);
            } else if (["pointerdown", "pointerup"].includes(signal)) {
              downDebounce = Math.max(downDebounce, debounce2);
            }
          }
        }
        method.props.KeyDebounce = keyDebounce.toString();
        method.props.PointerEnterDebounce = enterDebounce.toString();
        method.props.PointerDownDebounce = downDebounce.toString();
      }
      if (!("Pattern" in method.props)) {
        let pattern = "DefaultPattern";
        if (method.children.some(
          (handler) => handler.className == "PointerHandler"
        )) {
          pattern = "NullPattern";
        }
        method.props.Pattern = pattern;
      }
    }
    return obj;
  }
  /**
   * Merge an object into the panel contents
   * @param {ExternalRep} obj
   * @returns {Promise<void>}
   */
  async merge(obj) {
    console.assert(obj.className == "MethodChooser", obj);
    const toMerge = obj.children;
    for (let newChild of toMerge) {
      TreeBase.fromObject(newChild, this);
    }
    this.onUpdate();
  }
}
TreeBase.register(MethodChooser, "MethodChooser");
class Method extends TreeBase {
  Name = new String$1("New method");
  Pattern = new Pattern({ defaultValue: "DefaultPattern" });
  KeyDebounce = new Float(0, { label: "Key down/up" });
  PointerEnterDebounce = new Float(0, { label: "Pointer enter/leave" });
  PointerDownDebounce = new Float(0, { label: "Pointer down/up" });
  Key = new UID();
  Active = new Boolean$1(false);
  allowedChildren = [
    "Timer",
    "KeyHandler",
    "PointerHandler",
    "TimerHandler",
    "SocketHandler"
  ];
  open = false;
  // Event streams from the devices
  /** @type {Object<string, RxJs.Observable<EventLike>>} */
  streams = {};
  /** clear the pointerStream on any changes from below
   * @param {TreeBase} _start
   */
  onUpdate(_start) {
    super.onUpdate(_start);
  }
  /** @type {(Handler | Timer)[]} */
  children = [];
  /** Return a Map from Timer Key to the Timer
   * @returns {Map<string, Timer>}
   * */
  get timers() {
    return new Map(
      this.filterChildren(Timer).map((child) => [child.Key.value, child])
    );
  }
  /** Return a Map from Timer Key to its Name */
  get timerNames() {
    return new Map(
      this.filterChildren(Timer).map((timer2) => [
        timer2.Key.value,
        timer2.Name.value
      ])
    );
  }
  /** Return a Timer given its key
   *     @param {string} key
   *  */
  timer(key) {
    return this.filterChildren(Timer).find((timer2) => timer2.Key.value == key);
  }
  /** Cancel all active Timers
   */
  cancelTimers() {
    for (const timer2 of this.timers.values()) {
      timer2.cancel();
    }
  }
  /** Return an array of the Handlers */
  get handlers() {
    return this.filterChildren(Handler);
  }
  settingsSummary() {
    const { Name, Active } = this;
    return html`<h3>
      ${Name.value} ${toggleIndicator(Active.value, "Active")}
    </h3>`;
  }
  settingsDetails() {
    const {
      Name,
      Pattern: Pattern2,
      Active,
      KeyDebounce,
      PointerEnterDebounce,
      PointerDownDebounce
    } = this;
    const timers = [...this.timers.values()];
    const handlerClasses = new Set(
      this.handlers.map((handler) => handler.className)
    );
    const keyDebounce = handlerClasses.has("KeyHandler") ? [KeyDebounce.input()] : [];
    const pointerDebounce = handlerClasses.has("PointerHandler") ? [PointerDownDebounce.input(), PointerEnterDebounce.input()] : [];
    const Debounce = handlerClasses.has("KeyHandler") || handlerClasses.has("PointerHandler") ? [
      html`<fieldset>
              <legend>Debounce</legend>
              ${keyDebounce} ${pointerDebounce}
            </fieldset> `
    ] : [];
    return [
      html`<div>
        ${Name.input()} ${Active.input()} ${Pattern2.input()} ${Debounce}
        ${timers.length > 0 ? [
        html`<fieldset>
                <legend>Timers</legend>
                ${this.unorderedChildren(timers)}
              </fieldset>`
      ] : []}
        <fieldset>
          <legend>Handlers</legend>
          ${this.orderedChildren(this.handlers)}
        </fieldset>
      </div>`
    ];
  }
  settingsChildren() {
    return html`<div />`;
  }
  /** Configure the rxjs pipelines to implement this method */
  /** @param {RxJs.Subject} stop$
   * */
  configure(stop$2) {
    if (this.Active.value) {
      this.streams = {};
      for (const child of this.handlers) {
        child.configure();
      }
      const streams = Object.values(this.streams);
      if (streams.length > 0) {
        const stream$ = merge$1(...streams).pipe(takeUntil(stop$2));
        stream$.subscribe((e2) => {
          for (const handler of this.handlers) {
            if (handler.test(e2)) {
              handler.respond(e2);
              return;
            }
          }
        });
      }
    }
  }
  get pattern() {
    return Globals.patterns.patternFromKey(this.Pattern.value);
  }
  /** Refresh the pattern and other state on redraw */
  refresh() {
    if (this.pattern) this.pattern.refresh();
  }
}
TreeBase.register(Method, "Method");
class Timer extends TreeBase {
  Interval = new Float(0.5, { hiddenLabel: true });
  Name = new String$1("timer", { hiddenLabel: true });
  Key = new UID();
  /** @type {RxJs.Subject<EventLike>} */
  subject$ = new Subject();
  settings() {
    return html`<div>
      ${this.Name.input()} ${this.Interval.input()}
      <style>
        ${`:root { --${this.Key.value}: ${this.Interval.value}s}`}
      </style>
    </div>`;
  }
  /** @param {EventLike} event */
  start(event) {
    const fakeEvent = (
      /** @type {EventLike} */
      {
        type: "timer",
        target: event.target,
        access: event.access
      }
    );
    this.subject$.next(fakeEvent);
  }
  cancel() {
    const event = { type: "cancel", target: null, timeStamp: 0 };
    this.subject$.next(event);
  }
}
TreeBase.register(Timer, "Timer");
class Handler extends TreeBase {
  /** @type {(HandlerCondition | HandlerKeyCondition | HandlerResponse)[]} */
  children = [];
  /** Return the method containing this Handler */
  get method() {
    return (
      /** @type {Method} */
      this.parent
    );
  }
  // overridden in the derived classes
  Signal = new Select();
  get conditions() {
    return this.filterChildren(HandlerCondition);
  }
  get keys() {
    return this.filterChildren(HandlerKeyCondition);
  }
  get responses() {
    return this.filterChildren(HandlerResponse);
  }
  /**
   * Test the conditions for this handler
   * @param {EventLike} event
   * @returns {boolean}
   */
  test(event) {
    return this.Signal.value == event.type && this.conditions.every(
      (condition) => condition.eval({ data: event.access })
    );
  }
  configure() {
    throw new TypeError("Must override configure");
  }
  /** @param {EventLike} event */
  respond(event) {
    const method = this.nearestParent(Method);
    if (!method) return;
    method.cancelTimers();
    for (const response of this.responses) {
      response.respond(event);
    }
  }
}
class HandlerCondition extends TreeBase {
  Condition = new Conditional("", { hiddenLabel: true });
  settings() {
    const { Condition } = this;
    return html`<div class="Condition">${Condition.input()}</div>`;
  }
  /** @param {EvalContext} context */
  eval(context) {
    return this.Condition.valueInContext(context);
  }
  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(HandlerCondition, "HandlerCondition");
class HandlerKeyCondition extends HandlerCondition {
  Key = new KeyName("", {
    placeholder: "Press Enter to edit",
    hiddenLabel: true
  });
  settings() {
    const { Key } = this;
    return html`<div class="Key">${Key.input()}</div>`;
  }
  /** @param {EvalContext} context */
  eval(context) {
    return !!(context.data && context.data.key && this.Key.value == context.data.key);
  }
}
TreeBase.register(HandlerKeyCondition, "HandlerKeyCondition");
const ResponderTypeMap = /* @__PURE__ */ new Map([
  ["HandlerResponse", "none"],
  ["ResponderCue", "cue"],
  ["ResponderActivate", "activate"],
  ["ResponderClearCue", "clear cue"],
  ["ResponderEmit", "emit"],
  ["ResponderNext", "next"],
  ["ResponderStartTimer", "start timer"]
]);
class HandlerResponse extends TreeBaseSwitchable {
  Response = new TypeSelect(ResponderTypeMap, { hiddenLabel: true });
  /** @param {EventLike} event */
  respond(event) {
    console.log("no response for", event);
  }
  settings() {
    return html`<div class="Response">
      ${this.Response.input()} ${this.subTemplate()}
    </div>`;
  }
  subTemplate() {
    return html`<div />`;
  }
  /** move my parent instead of me.
   * @param {boolean} up
   */
  moveUpDown(up) {
    this.parent?.moveUpDown(up);
  }
}
TreeBase.register(HandlerResponse, "HandlerResponse");
const defaultPatterns = {
  className: "PatternList",
  props: {
    direction: "",
    background: "",
    scale: 1,
    name: "Patterns",
    label: ""
  },
  children: [
    {
      className: "PatternManager",
      props: {
        Cycles: "2",
        Cue: "DefaultCue",
        Name: "None",
        Key: "idl83jg7qtj9wmyggtxf",
        Active: false
      },
      children: []
    },
    {
      className: "PatternManager",
      props: {
        Cycles: "2",
        Cue: "DefaultCue",
        Name: "Row Column",
        Key: "idl83jjo4z0ibii6748fx",
        Active: true
      },
      children: [
        {
          className: "PatternSelector",
          props: {},
          children: [
            {
              className: "GroupBy",
              props: {
                GroupBy: "#row",
                Name: "Row #row",
                Cue: "DefaultCue",
                Cycles: "2"
              },
              children: []
            }
          ]
        }
      ]
    },
    {
      className: "PatternManager",
      props: {
        Cycles: 2,
        Cue: "DefaultCue",
        Name: "Column Row",
        Key: "idlh6dwljzc1nwvfrrp9v",
        Active: false
      },
      children: [
        {
          className: "PatternSelector",
          props: {},
          children: [
            {
              className: "GroupBy",
              props: {
                GroupBy: "#column",
                Name: "Column #column",
                Cue: "DefaultCue",
                Cycles: 2
              },
              children: []
            }
          ]
        }
      ]
    },
    {
      className: "PatternManager",
      props: {
        Cycles: "2",
        Cue: "DefaultCue",
        Name: "Controls and Rows",
        Key: "idl83jjo4z0ibii6748fx",
        Active: false
      },
      children: [
        {
          className: "PatternGroup",
          props: { Name: "Controls", Cycles: "2", Cue: "DefaultCue" },
          children: [
            {
              className: "PatternSelector",
              props: {},
              children: [
                {
                  className: "Filter",
                  props: { Filter: "#controls" },
                  children: []
                },
                {
                  className: "OrderBy",
                  props: { OrderBy: "#controls" },
                  children: []
                }
              ]
            }
          ]
        },
        {
          className: "PatternSelector",
          props: {},
          children: [
            {
              className: "Filter",
              props: { Filter: "! #controls" },
              children: []
            },
            {
              className: "GroupBy",
              props: {
                GroupBy: "#ComponentName",
                Name: " Component",
                Cue: "DefaultCue",
                Cycles: "2"
              },
              children: []
            },
            {
              className: "GroupBy",
              props: {
                GroupBy: "#row",
                Name: "Row #row",
                Cue: "DefaultCue",
                Cycles: "2"
              },
              children: []
            }
          ]
        }
      ]
    }
  ]
};
let animationNonce = 0;
function cueTarget(target, defaultValue, isGroup = false) {
  let fields = {};
  if (target instanceof HTMLButtonElement) {
    target.setAttribute("cue", defaultValue);
    const video = target.querySelector("video");
    if (!isGroup && video && !video.hasAttribute("autoplay")) {
      if (video.hasAttribute("muted")) video.muted = true;
      const promise = video.play();
      if (promise !== void 0) {
        promise.then(() => {
        }).catch((error) => {
          console.log("autoplay prevented", error);
        });
      }
    }
    fields = target.dataset;
  } else if (target instanceof Group) {
    target.cue(defaultValue);
    fields = target.access;
  }
  const cue = Globals.cues.keyToCue(defaultValue);
  if (!isGroup && cue) {
    if (cue.SpeechField.value) {
      const message = fields[cue.SpeechField.value.slice(1)];
      speak(
        message,
        cue.voiceURI.value,
        cue.pitch.value,
        cue.rate.value,
        cue.volume.value
      );
    }
    if (cue.AudioField.value) {
      const file = fields[cue.AudioField.value.slice(1)] || "";
      playAudio(file);
    }
  }
}
function clearCues() {
  for (const element of document.querySelectorAll("#UI [cue]")) {
    element.removeAttribute("cue");
    const video = element.querySelector("video");
    if (video && !video.hasAttribute("autoplay")) {
      video.pause();
      video.currentTime = 0;
    }
  }
}
class Group {
  /**
   * @param {Target[]} members
   * @param {Object} props
   */
  constructor(members, props) {
    this.members = members;
    this.access = { GroupName: props.Name, ...props };
  }
  get length() {
    return this.members.length * +this.access.Cycles;
  }
  /** @param {Number} index */
  member(index) {
    if (index < 0 || index >= this.length) {
      return void 0;
    } else {
      return this.members[index % this.members.length];
    }
  }
  /** @param {string} value */
  cue(value = "", top2 = true) {
    if (!value) {
      value = this.access.Cue;
    }
    for (const member of this.members) {
      if (member instanceof HTMLButtonElement)
        cueTarget(member, value, !top2 || this.members.length > 1);
      else if (member instanceof Group) {
        member.cue(value, false);
      }
    }
  }
  /** Test if this group contains a button return the top-level index if so, -1 if not
   * @param {HTMLButtonElement} button
   * @returns {number}
   */
  contains(button) {
    for (let i = 0; i < this.members.length; i++) {
      const member = this.members[i];
      if (member === button || member instanceof Group && member.contains(button) >= 0)
        return i;
    }
    return -1;
  }
}
class PatternBase extends TreeBase {
  /** @type {PatternBase[]} */
  children = [];
  /**
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    return input;
  }
}
class PatternList extends DesignerPanel {
  name = new String$1("Patterns");
  allowDelete = false;
  allowedChildren = ["PatternManager"];
  /** @type {PatternManager[]} */
  children = [];
  static tableName = "pattern";
  static defaultValue = defaultPatterns;
  settings() {
    return html`<div class=${this.CSSClasses("PatternList")} id=${this.id}>
      ${this.unorderedChildren()}
    </div>`;
  }
  /**
   * @returns {PatternManager}
   */
  get activePattern() {
    return this.children.find((child) => child.Active.value) || this.children[0];
  }
  get patternMap() {
    const entries = this.children.map((child) => [
      child.Key.value,
      child.Name.value
    ]);
    entries.unshift(["DefaultPattern", "Default Pattern"]);
    entries.unshift(["NullPattern", "No Pattern"]);
    return new Map(entries);
  }
  /**
   * return the pattern given its key
   * @param {string} key
   */
  patternFromKey(key) {
    let result;
    if (key === "NullPattern") {
      return nullPatternManager;
    }
    result = this.children.find((pattern) => pattern.Key.value == key);
    if (!result) {
      result = this.activePattern;
    }
    return result;
  }
  /**
   * Merge an object into the panel contents
   * @param {ExternalRep} obj
   * @returns {Promise<void>}
   */
  async merge(obj) {
    console.assert(obj.className == "PatternList", obj);
    const toMerge = obj.children;
    for (let newChild of toMerge) {
      TreeBase.fromObject(newChild, this);
    }
    this.onUpdate();
  }
}
TreeBase.register(PatternList, "PatternList");
class PatternManager extends PatternBase {
  allowedChildren = ["PatternSelector", "PatternGroup"];
  /** @type {Group} */
  targets = new Group([], {});
  /**
   * Stack keeps track of the nesting as we walk the tree
   *
   * @type {{ group: Group; cue: string, index: number }[]}
   */
  stack = [];
  /**
   * @type {Boolean} - cue is active when true
   */
  cued = false;
  // props
  Cue = new Cue$1({ defaultValue: "DefaultCue" });
  Name = new String$1("a pattern");
  Key = new UID();
  Active = new OneOfGroup(false, {
    group: "pattern-active",
    label: "Default"
  });
  StartVisible = new Boolean$1(false);
  settingsSummary() {
    const { Name, Active } = this;
    return html`<h3>
      ${Name.value} ${toggleIndicator(Active.value, "Active")}
    </h3>`;
  }
  settingsDetails() {
    const { Cue: Cue3, Name, Active, StartVisible } = this;
    return [
      html`
        <div>
          ${Name.input()} ${Active.input()} ${Cue3.input()}
          ${StartVisible.input()}
          <button
            @click=${() => {
        this.animate();
      }}
          >
            Animate
          </button>
          ${this.orderedChildren()}
        </div>
      `
    ];
  }
  settingsChildren() {
    return html`<div />`;
  }
  /**
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    let members = [];
    for (const child of this.children) {
      const r = child.apply(input);
      if (r.length > 0) {
        if (r instanceof Group) {
          members.push(r);
        } else {
          members = members.concat(r);
        }
      }
    }
    if (members.length > 0) return [new Group(members, this.propsAsObject)];
    else return [];
  }
  /** Collect the nodes from the DOM and process them into targets */
  refresh() {
    const buttons = [];
    for (
      const node of
      /** @type {NodeListOf<HTMLButtonElement>} */
      document.querySelectorAll("#UI button:not(:disabled)")
    ) {
      buttons.push(node);
    }
    let members = [];
    if (this.children.length) {
      for (const child of this.children) {
        const r = child.apply(buttons);
        if (r.length > 0) {
          if (r instanceof Group) {
            members.push(r);
          } else {
            members = members.concat(r);
          }
        }
      }
    } else {
      members = buttons;
    }
    this.targets = new Group(members, { ...this.propsAsObject, Cycles: 1 });
    this.stack = [
      {
        group: this.targets,
        cue: this.Cue.value,
        index: this.StartVisible.value ? 0 : -1
      }
    ];
    this.cue();
    animationNonce += 1;
  }
  /**
   * Current keeps track of the currently active node or group
   *
   * @type {Target | undefined}
   */
  get current() {
    const { group, index } = this.stack[0];
    return group.member(index);
  }
  next() {
    const top2 = this.stack[0];
    if (top2.index < top2.group.length - 1) {
      top2.index++;
    } else if (this.stack.length > 1) {
      this.stack.shift();
    } else if (this.stack.length == 1) {
      top2.index = 0;
    } else ;
    this.cue();
  }
  /** @param {EventLike} event */
  activate(event) {
    const target = event.target;
    if (target) {
      for (; ; ) {
        const top2 = this.stack[0];
        const newIndex = top2.group.members.indexOf(target);
        if (newIndex >= 0) {
          top2.index = newIndex;
          break;
        }
        if (this.stack.length == 1) {
          top2.index = 0;
          break;
        } else {
          this.stack.shift();
        }
      }
    }
    let current = this.current;
    if (!current) return;
    while (current instanceof Group && current.members.length == 1) {
      current = current.members[0];
    }
    if (current instanceof Group) {
      this.stack.unshift({
        group: current,
        cue: current.access.Cue,
        index: event?.groupIndex || 0
      });
    } else if (current instanceof HTMLButtonElement) {
      if (current.hasAttribute("click")) {
        current.dispatchEvent(new Event("Activate"));
      } else {
        const name = current.dataset.ComponentName;
        Globals.actions.applyRules(name || "", "press", { ...current.dataset });
      }
    }
    this.cue();
  }
  clearCue() {
    this.cued = false;
    clearCues();
  }
  cue() {
    this.clearCue();
    const current = this.current;
    if (!current) return;
    this.cued = true;
    cueTarget(current, this.stack[0].cue);
  }
  /** Return the access info for current
   */
  getCurrentAccess() {
    const current = this.current;
    if (!current) return {};
    if (current instanceof HTMLButtonElement) {
      return current.dataset;
    } else if (current instanceof Group) {
      return { ...current.access };
    }
    return {};
  }
  /** Map the event target to a group
   * @param {EventLike} event
   * @returns {EventLike}
   */
  remapEventTarget(event) {
    event = {
      type: event.type,
      target: event.target,
      timeStamp: event.timeStamp
    };
    if (event.target instanceof HTMLButtonElement) {
      event.access = event.target.dataset;
    }
    if (!event.target) return event;
    event.originalTarget = event.target;
    for (let level = 0; level < this.stack.length; level++) {
      const group = this.stack[level].group;
      const members = group.members;
      let index = members.indexOf(event.target);
      if (index >= 0) {
        if (level === 0) {
          return event;
        } else {
          return {
            ...event,
            target: group,
            groupIndex: index,
            access: { ...event.access, ...group.access }
          };
        }
      } else if (event.target instanceof HTMLButtonElement) {
        for (index = 0; index < members.length; index++) {
          const member = members[index];
          if (member instanceof Group) {
            let i = member.contains(event.target);
            if (i >= 0) {
              return {
                ...event,
                target: member,
                groupIndex: i,
                access: { ...event.access, ...member.access }
              };
            }
          }
        }
      }
    }
    return event;
  }
  async animate() {
    function* animateGroup(group, cue) {
      const cycles = +group.access.Cycles;
      const groupTime = 500;
      const buttonTime = Math.max(
        100,
        Math.min(500, 600 / group.members.length)
      );
      for (let cycle = 0; cycle < cycles; cycle++) {
        for (const member of group.members) {
          cueTarget(member, cue);
          yield new Promise(
            (resolve2) => setTimeout(
              resolve2,
              member instanceof Group ? groupTime : buttonTime
            )
          );
          clearCues();
          if (member instanceof Group) {
            yield* animateGroup(member, cue);
          }
        }
      }
    }
    this.clearCue();
    this.refresh();
    let nonce = ++animationNonce;
    for (const promise of animateGroup(this.targets, this.Cue.value)) {
      await promise;
      if (nonce !== animationNonce) return;
    }
  }
}
PatternBase.register(PatternManager, "PatternManager");
const nullPatternManager = TreeBase.create(PatternManager);
class PatternGroup extends PatternBase {
  // props
  Name = new String$1("");
  Cycles = new Integer(2, { min: 1 });
  Cue = new Cue$1({ defaultValue: "DefaultCue" });
  allowedChildren = ["PatternGroup", "PatternSelector"];
  settings() {
    const { Name, Cycles, Cue: Cue3 } = this;
    return html`<fieldset class=${this.className} tabindex="0" id=${this.id}>
      <legend>Group: ${Name.value}</legend>
      ${Name.input()} ${Cycles.input()} ${Cue3.input()} ${this.orderedChildren()}
    </fieldset>`;
  }
  /**
   * Build a group from the output of the selectors applied to the input
   *
   * @param {Target[]} input
   */
  apply(input) {
    let members = [];
    for (const child of this.children) {
      const r = child.apply(input);
      if (r.length > 0) {
        if (r instanceof Group) {
          members.push(r);
        } else {
          members = members.concat(r);
        }
      }
    }
    if (members.length > 0) return [new Group(members, this.propsAsObject)];
    else return [];
  }
}
PatternBase.register(PatternGroup, "PatternGroup");
class PatternSelector extends PatternBase {
  allowedChildren = ["Filter", "GroupBy", "OrderBy"];
  settings() {
    return html`<fieldset class=${this.className} tabindex="0" id=${this.id}>
      <legend>Selector</legend>
      ${this.unorderedChildren()}
    </fieldset>`;
  }
  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    return this.children.reduce(
      (previous, operator) => operator.apply(previous),
      input
    );
  }
}
PatternBase.register(PatternSelector, "PatternSelector");
class Filter extends PatternBase {
  Filter = new Expression();
  settings() {
    const { Filter: Filter2 } = this;
    return html`<div class=${this.className} tabindex="0" id=${this.id}>
      ${Filter2.input()}
    </div>`;
  }
  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    if (input[0] instanceof Group) {
      return input.map(
        (group) => new Group(this.apply(group.members), group.access)
      ).filter((target) => target.length > 0);
    } else {
      return input.filter(
        (button) => this.Filter.valueInContext({ data: button.dataset })
      );
    }
  }
}
PatternBase.register(Filter, "Filter");
const comparator = new Intl.Collator(void 0, {
  numeric: true
});
class OrderBy extends PatternBase {
  OrderBy = new Field();
  settings() {
    const { OrderBy: OrderBy2 } = this;
    return html`<div class=${this.className} tabindex="0" id=${this.id}>
      ${OrderBy2.input()}
    </div>`;
  }
  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    if (input[0] instanceof Group) {
      return input.map(
        (group) => new Group(this.apply(group.members), group.access)
      ).filter((target) => target.length > 0);
    } else {
      const key = this.OrderBy.value.slice(1);
      return [.../** @type {HTMLButtonElement[]} */
      input].sort(
        (a2, b3) => comparator.compare(a2.dataset[key] || "", b3.dataset[key] || "")
      );
    }
  }
}
PatternBase.register(OrderBy, "OrderBy");
class GroupBy extends PatternBase {
  GroupBy = new Field();
  Name = new String$1("");
  Cue = new Cue$1({ defaultValue: "DefaultCue" });
  Cycles = new Integer(2);
  settings() {
    const { GroupBy: GroupBy2, Name, Cue: Cue3, Cycles } = this;
    const fields = toMap([
      .../* @__PURE__ */ new Set([
        ...Globals.data.allFields,
        "#ComponentName",
        "#row",
        "#column"
      ])
    ]);
    return html`<div class=${this.className} tabindex="0" id=${this.id}>
      ${GroupBy2.input(fields)} ${Name.input()} ${Cue3.input()} ${Cycles.input()}
    </div>`;
  }
  /**
   * Select buttons from the input
   *
   * @param {Target[]} input
   * @returns {Target[]}
   */
  apply(input) {
    if (input[0] instanceof Group) {
      return input.map(
        (group) => new Group(this.apply(group.members), group.access)
      ).filter((target) => target.length > 0);
    } else {
      const { GroupBy: GroupBy2, Name, ...props } = this.propsAsObject;
      const key = GroupBy2.slice(1);
      const result = [];
      const groupMap = /* @__PURE__ */ new Map();
      for (
        const button of
        /** @type {HTMLButtonElement[]} */
        input
      ) {
        let k2 = button.dataset[key] || "";
        k2 = k2.toString();
        let group = groupMap.get(k2);
        if (!group) {
          group = new Group([button], {
            GroupName: Name.replace(GroupBy2, k2),
            [key]: k2,
            ...props
          });
          groupMap.set(k2, group);
          result.push(group);
        } else {
          group.members.push(button);
        }
      }
      if (result.length === 1) {
        return result[0].members;
      }
      return result;
    }
  }
}
PatternBase.register(GroupBy, "GroupBy");
class ResponderNext extends HandlerResponse {
  respond() {
    const method = this.nearestParent(Method);
    if (!method) return;
    method.pattern.next();
  }
}
TreeBase.register(ResponderNext, "ResponderNext");
class ResponderActivate extends HandlerResponse {
  /** @param {EventLike} event */
  respond(event) {
    const method = this.nearestParent(Method);
    if (!method) return;
    method.pattern.activate(event);
  }
}
TreeBase.register(ResponderActivate, "ResponderActivate");
class ResponderCue extends HandlerResponse {
  Cue = new Cue$1();
  subTemplate() {
    return this.Cue.input();
  }
  /** @param {EventLike} event */
  respond(event) {
    cueTarget(event.target, this.Cue.value);
  }
}
TreeBase.register(ResponderCue, "ResponderCue");
class ResponderClearCue extends HandlerResponse {
  respond() {
    clearCues();
  }
}
TreeBase.register(ResponderClearCue, "ResponderClearCue");
class ResponderEmit extends HandlerResponse {
  /** @param {EventLike} event */
  respond(event) {
    const method = this.nearestParent(Method);
    if (!method) return;
    Globals.actions.applyRules(method.Name.value, "press", event.access);
  }
}
TreeBase.register(ResponderEmit, "ResponderEmit");
class ResponderStartTimer extends HandlerResponse {
  TimerName = new Select(() => this.nearestParent(Method).timerNames, {
    placeholder: "Choose a timer",
    hiddenLabel: true
  });
  subTemplate() {
    return this.TimerName.input();
  }
  /** @param {EventLike} event */
  respond(event) {
    const timer2 = this.nearestParent(Method)?.timer(this.TimerName.value);
    if (!timer2) return;
    document.documentElement.style.setProperty(
      "--timerInterval",
      `${timer2.Interval.value}s`
    );
    timer2.start(event);
  }
}
TreeBase.register(ResponderStartTimer, "ResponderStartTimer");
const keySignals = /* @__PURE__ */ new Map([
  ["keyup", "Key up"],
  ["keydown", "Key down"]
]);
class KeyHandler extends Handler {
  allowedChildren = [
    "HandlerKeyCondition",
    "HandlerCondition",
    "HandlerResponse"
  ];
  Signal = new Select(keySignals);
  settings() {
    const { conditions, responses, keys } = this;
    const { Signal } = this;
    return html`
      <fieldset class="Handler" tabindex="0" id=${this.id}>
        <legend>Key Handler</legend>
        ${Signal.input()}
        <fieldset class="Keys">
          <legend>Keys</legend>
          ${this.unorderedChildren(keys)}
        </fieldset>
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(
      conditions.filter((c2) => !(c2 instanceof HandlerKeyCondition))
    )}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
      </fieldset>
    `;
  }
  configure() {
    const method = this.method;
    const streamName = "key";
    if (method.streams[streamName]) return;
    const debounceInterval = method.KeyDebounce.value * 1e3;
    const keyDown$ = (
      /** @type RxJs.Observable<KeyboardEvent> */
      fromEvent(document, "keydown")
    );
    const keyUp$ = (
      /** @type RxJs.Observable<KeyboardEvent> */
      fromEvent(document, "keyup")
    );
    function notDesigner({ target }) {
      const designer = document.getElementById("designer");
      return !designer || !designer.contains(target);
    }
    let events$ = (
      /** @type RxJs.Observable<KeyboardEvent> */
      // start with the key down stream
      keyDown$.pipe(
        // merge with the key up stream
        mergeWith(keyUp$),
        // ignore events from the designer
        filter((e2) => notDesigner(e2)),
        // prevent default actions
        tap$1((e2) => e2.preventDefault()),
        // remove any repeats
        filter((e2) => !e2.repeat)
      )
    );
    if (debounceInterval > 0) {
      events$ = events$.pipe(
        // group by the key
        groupBy((e2) => e2.key),
        // process each group and merge the results
        mergeMap(
          (group$) => group$.pipe(
            // debounce flurries of events
            debounceTime(debounceInterval),
            // wait for a key down
            skipWhile((e2) => e2.type != "keydown"),
            // only output when the type changes
            distinctUntilKeyChanged("type")
          )
        )
      );
    }
    const keyEvents$ = events$.pipe(
      map((e2) => {
        let kw = {
          type: e2.type,
          target: null,
          timeStamp: e2.timeStamp,
          access: {
            key: e2.key,
            altKey: e2.altKey,
            ctrlKey: e2.ctrlKey,
            metaKey: e2.metaKey,
            shiftKey: e2.shiftKey,
            eventType: e2.type,
            ...method.pattern.getCurrentAccess()
          }
        };
        return kw;
      })
    );
    method.streams[streamName] = keyEvents$;
  }
  /**
   * Test the conditions for this handler
   * @param {EventLike} event
   * @returns {boolean}
   */
  test(event) {
    const signal = this.Signal.value;
    const keys = this.keys;
    const conditions = this.conditions.filter(
      (condition) => !(condition instanceof HandlerKeyCondition)
    );
    return event.type == signal && (keys.length == 0 || keys.some((key) => key.eval({ data: event.access }))) && conditions.every((condition) => condition.eval({ data: event.access }));
  }
}
TreeBase.register(KeyHandler, "KeyHandler");
const pointerSignals = /* @__PURE__ */ new Map([
  ["pointerdown", "Pointer down"],
  ["pointerup", "Pointer up"],
  ["pointerover", "Pointer enter"],
  ["pointerout", "Pointer leave"]
]);
class PointerHandler extends Handler {
  allowedChildren = ["HandlerCondition", "HandlerResponse"];
  Signal = new Select(pointerSignals);
  settings() {
    const { conditions, responses, Signal } = this;
    return html`
      <fieldset class="Handler" tabindex="0" id="${this.id}">
        <legend>Pointer Handler</legend>
        ${Signal.input()}
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(conditions)}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
      </fieldset>
    `;
  }
  configure() {
    const method = this.method;
    const streamName = "pointer";
    if (method.streams[streamName]) return;
    const pattern = method.pattern;
    if (!pattern) return;
    const inOutThreshold = method.PointerEnterDebounce.value * 1e3;
    const upDownThreshold = method.PointerDownDebounce.value * 1e3;
    function fromPointerEvent(event) {
      return (
        /** @type {RxJs.Observable<PointerEvent>} */
        fromEvent(document, event).pipe(
          // fudge the target to be the button and not any contained thing
          tap$1((e2) => {
            if (!(e2.target instanceof HTMLButtonElement) && e2.target instanceof HTMLElement) {
              const t2 = e2.target.closest("button");
              if (t2) {
                Object.defineProperty(e2, "target", { value: t2 });
              }
            }
          })
        )
      );
    }
    const pointerDown$ = fromPointerEvent("pointerdown").pipe(
      // disable pointer capture
      tap$1(
        (x) => x.target instanceof Element && x.target.hasPointerCapture(x.pointerId) && x.target.releasePointerCapture(x.pointerId)
      ),
      throttleTime(upDownThreshold)
    );
    const pointerUp$ = fromPointerEvent("pointerup").pipe(
      throttleTime(upDownThreshold)
    );
    const None = { type: "none", target: null, timeStamp: 0 };
    function stateMachine({ current, over, timeStamp, accumulators, emittedEvents }, event) {
      if (emittedEvents.length > 0 && over !== None) {
        const newOver = pattern.remapEventTarget({
          ...over,
          target: over.originalTarget || null
        });
        if (newOver.target !== over.target) {
          accumulators.set(newOver.target, accumulators.get(over.target) || 0);
          accumulators.set(over.target, 0);
          over = newOver;
        }
      }
      const dt = event.timeStamp - timeStamp;
      timeStamp = event.timeStamp;
      emittedEvents = [];
      let sum = accumulators.get(over.target) || 0;
      sum += dt;
      accumulators.set(over.target, sum);
      const threshold = inOutThreshold;
      if (sum >= threshold) {
        accumulators.set(over.target, threshold);
        if (over.target != current.target) {
          if (current !== None) {
            emittedEvents.push({ ...current, type: "pointerout" });
          }
          current = over;
          if (current !== None) {
            emittedEvents.push({ ...current, type: "pointerover" });
          }
        } else {
          current = over;
        }
      }
      for (let [target, value] of accumulators) {
        if (target !== over.target) {
          value -= dt;
          if (value <= 0) {
            accumulators.delete(target);
          } else {
            accumulators.set(target, value);
          }
        }
      }
      if (event.type == "pointerover") {
        over = pattern.remapEventTarget(event);
      } else if (event.type == "pointerout") {
        over = None;
      } else if (event.type == "pointerdown" && current !== None) {
        emittedEvents.push({ ...current, type: "pointerdown" });
      } else if (event.type == "pointerup" && current !== None) {
        emittedEvents.push({ ...current, type: "pointerup" });
      }
      return {
        current,
        over,
        timeStamp,
        accumulators,
        emittedEvents
      };
    }
    const pointerStream$ = pointerDown$.pipe(
      // merge the streams
      mergeWith(
        pointerUp$,
        fromPointerEvent("pointerover"),
        fromPointerEvent("pointerout"),
        fromPointerEvent("contextmenu")
      ),
      // keep only events related to buttons within the UI
      filter(
        (e2) => e2.target instanceof HTMLButtonElement && e2.target.closest("div#UI") !== null && !e2.target.disabled
      ),
      // kill contextmenu events
      tap$1((e2) => e2.type === "contextmenu" && e2.preventDefault()),
      // Add the timer events
      mergeWith(
        // I pulled 10ms out of my ear, would 20 or even 50 do?
        timer(10, 10).pipe(map(() => new PointerEvent("tick")))
      ),
      // run the state machine
      scan(stateMachine, {
        // the initial state
        current: None,
        over: None,
        timeStamp: 0,
        accumulators: /* @__PURE__ */ new Map(),
        emittedEvents: []
      }),
      filter((s2) => s2.emittedEvents.length > 0),
      mergeMap(
        (state2) => of(
          ...state2.emittedEvents.map((event) => {
            let w2 = {
              ...event,
              timeStamp: state2.timeStamp,
              access: { ...event.access, eventType: event.type }
            };
            return w2;
          })
        )
      )
    );
    method.streams[streamName] = pointerStream$;
  }
}
TreeBase.register(PointerHandler, "PointerHandler");
var DEFAULT_WEBSOCKET_CONFIG = {
  url: "",
  deserializer: function(e2) {
    return JSON.parse(e2.data);
  },
  serializer: function(value) {
    return JSON.stringify(value);
  }
};
var WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = "WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }";
var WebSocketSubject = function(_super) {
  __extends(WebSocketSubject2, _super);
  function WebSocketSubject2(urlConfigOrSource, destination) {
    var _this = _super.call(this) || this;
    _this._socket = null;
    if (urlConfigOrSource instanceof Observable) {
      _this.destination = destination;
      _this.source = urlConfigOrSource;
    } else {
      var config2 = _this._config = __assign({}, DEFAULT_WEBSOCKET_CONFIG);
      _this._output = new Subject();
      if (typeof urlConfigOrSource === "string") {
        config2.url = urlConfigOrSource;
      } else {
        for (var key in urlConfigOrSource) {
          if (urlConfigOrSource.hasOwnProperty(key)) {
            config2[key] = urlConfigOrSource[key];
          }
        }
      }
      if (!config2.WebSocketCtor && WebSocket) {
        config2.WebSocketCtor = WebSocket;
      } else if (!config2.WebSocketCtor) {
        throw new Error("no WebSocket constructor can be found");
      }
      _this.destination = new ReplaySubject();
    }
    return _this;
  }
  WebSocketSubject2.prototype.lift = function(operator) {
    var sock = new WebSocketSubject2(this._config, this.destination);
    sock.operator = operator;
    sock.source = this;
    return sock;
  };
  WebSocketSubject2.prototype._resetState = function() {
    this._socket = null;
    if (!this.source) {
      this.destination = new ReplaySubject();
    }
    this._output = new Subject();
  };
  WebSocketSubject2.prototype.multiplex = function(subMsg, unsubMsg, messageFilter) {
    var self2 = this;
    return new Observable(function(observer) {
      try {
        self2.next(subMsg());
      } catch (err2) {
        observer.error(err2);
      }
      var subscription = self2.subscribe({
        next: function(x) {
          try {
            if (messageFilter(x)) {
              observer.next(x);
            }
          } catch (err2) {
            observer.error(err2);
          }
        },
        error: function(err2) {
          return observer.error(err2);
        },
        complete: function() {
          return observer.complete();
        }
      });
      return function() {
        try {
          self2.next(unsubMsg());
        } catch (err2) {
          observer.error(err2);
        }
        subscription.unsubscribe();
      };
    });
  };
  WebSocketSubject2.prototype._connectSocket = function() {
    var _this = this;
    var _a2 = this._config, WebSocketCtor = _a2.WebSocketCtor, protocol = _a2.protocol, url = _a2.url, binaryType = _a2.binaryType;
    var observer = this._output;
    var socket = null;
    try {
      socket = protocol ? new WebSocketCtor(url, protocol) : new WebSocketCtor(url);
      this._socket = socket;
      if (binaryType) {
        this._socket.binaryType = binaryType;
      }
    } catch (e2) {
      observer.error(e2);
      return;
    }
    var subscription = new Subscription(function() {
      _this._socket = null;
      if (socket && socket.readyState === 1) {
        socket.close();
      }
    });
    socket.onopen = function(evt) {
      var _socket = _this._socket;
      if (!_socket) {
        socket.close();
        _this._resetState();
        return;
      }
      var openObserver = _this._config.openObserver;
      if (openObserver) {
        openObserver.next(evt);
      }
      var queue = _this.destination;
      _this.destination = Subscriber.create(function(x) {
        if (socket.readyState === 1) {
          try {
            var serializer = _this._config.serializer;
            socket.send(serializer(x));
          } catch (e2) {
            _this.destination.error(e2);
          }
        }
      }, function(err2) {
        var closingObserver = _this._config.closingObserver;
        if (closingObserver) {
          closingObserver.next(void 0);
        }
        if (err2 && err2.code) {
          socket.close(err2.code, err2.reason);
        } else {
          observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
        }
        _this._resetState();
      }, function() {
        var closingObserver = _this._config.closingObserver;
        if (closingObserver) {
          closingObserver.next(void 0);
        }
        socket.close();
        _this._resetState();
      });
      if (queue && queue instanceof ReplaySubject) {
        subscription.add(queue.subscribe(_this.destination));
      }
    };
    socket.onerror = function(e2) {
      _this._resetState();
      observer.error(e2);
    };
    socket.onclose = function(e2) {
      if (socket === _this._socket) {
        _this._resetState();
      }
      var closeObserver = _this._config.closeObserver;
      if (closeObserver) {
        closeObserver.next(e2);
      }
      if (e2.wasClean) {
        observer.complete();
      } else {
        observer.error(e2);
      }
    };
    socket.onmessage = function(e2) {
      try {
        var deserializer = _this._config.deserializer;
        observer.next(deserializer(e2));
      } catch (err2) {
        observer.error(err2);
      }
    };
  };
  WebSocketSubject2.prototype._subscribe = function(subscriber) {
    var _this = this;
    var source = this.source;
    if (source) {
      return source.subscribe(subscriber);
    }
    if (!this._socket) {
      this._connectSocket();
    }
    this._output.subscribe(subscriber);
    subscriber.add(function() {
      var _socket = _this._socket;
      if (_this._output.observers.length === 0) {
        if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
          _socket.close();
        }
        _this._resetState();
      }
    });
    return subscriber;
  };
  WebSocketSubject2.prototype.unsubscribe = function() {
    var _socket = this._socket;
    if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
      _socket.close();
    }
    this._resetState();
    _super.prototype.unsubscribe.call(this);
  };
  return WebSocketSubject2;
}(AnonymousSubject);
function webSocket(urlConfigOrSource) {
  return new WebSocketSubject(urlConfigOrSource);
}
class SocketHandler extends Handler {
  allowedChildren = ["HandlerCondition", "HandlerResponse", "GridFilter"];
  StateName = new String$1("$socket");
  URL = new String$1("ws://localhost:5678/");
  get filters() {
    return this.filterChildren(GridFilter);
  }
  settings() {
    const { conditions, responses, StateName, URL: URL2 } = this;
    return html`
      <fieldset class="Handler">
        <legend>Socket Handler</legend>
        ${StateName.input()} ${URL2.input()}
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(conditions)}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
        ${GridFilter.FilterSettings(this.filters)}
      </fieldset>
    `;
  }
  init() {
    super.init();
    this.Signal.set("socket");
    Globals.state.observe(() => {
      if (Globals.state.hasBeenUpdated(this.StateName.value)) {
        if (!this.socket) {
          console.error("socket is not active");
          return;
        }
        this.sendData();
      }
    });
  }
  /** The websocket wrapper object
   * @type {import("rxjs/webSocket").WebSocketSubject<any> | undefined} */
  socket = void 0;
  /** The stream of events from the websocket
   * @type {RxJs.Observable<EventLike> | undefined} */
  socket$ = void 0;
  configure() {
    const method = this.method;
    const streamName = "socket";
    if (method.streams[streamName]) return;
    this.socket = webSocket({
      url: this.URL.value,
      serializer: (msg) => {
        if (msg instanceof Blob) {
          return msg;
        } else {
          return JSON.stringify(msg);
        }
      },
      binaryType: "blob"
    });
    this.socket$ = this.socket.pipe(
      retry({ count: 10, delay: 5e3 }),
      map((msg) => {
        const event = new Event("socket");
        const wrapped = {
          type: "socket",
          timeStamp: event.timeStamp,
          access: msg,
          target: null
        };
        return wrapped;
      })
      // RxJs.tap((e) => console.log("socket", e)),
    );
    method.streams[streamName] = this.socket$;
  }
  /** @param {EventLike} event */
  respond(event) {
    let dynamicRows = [];
    const fields = [];
    for (const [key, value] of Object.entries(event.access || {})) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
        dynamicRows = dynamicRows.concat(value);
      } else if (key == "FetchImageFromDB") {
        this.sendImage(value);
      } else {
        fields.push([key, value]);
      }
    }
    event.access = Object.fromEntries(fields);
    if (dynamicRows.length > 0) {
      Globals.data.setDynamicRows(dynamicRows);
    }
    super.respond(event);
  }
  sendData() {
    if (!this.socket) return;
    const name = this.method.Name.value;
    const message = {
      method: name,
      stateName: this.StateName.value,
      URL: this.URL.value,
      state: Globals.state.values
    };
    const filters2 = this.filters;
    if (filters2.length > 0) {
      const content = Globals.data.getMatchingRows(
        filters2,
        false
        // do not pass NULL for the undefined fields
      );
      message["content"] = content;
    }
    this.socket.next(message);
  }
  /** @param {string} name */
  async sendImage(name) {
    if (!this.socket) return;
    const imgBlob = await db.getImageBlob(name);
    this.socket.next(imgBlob);
  }
}
TreeBase.register(SocketHandler, "SocketHandler");
const timerSignals = /* @__PURE__ */ new Map([
  ["transitionend", "Transition end"],
  ["animationend", "Animation end"],
  ["timer", "Timer complete"]
]);
class TimerHandler extends Handler {
  allowedChildren = ["HandlerCondition", "HandlerResponse"];
  Signal = new Select(timerSignals);
  TimerName = new Select([], { hiddenLabel: true });
  settings() {
    const { conditions, responses, Signal } = this;
    const timerNames = this.nearestParent(Method)?.timerNames;
    return html`
      <fieldset class="Handler" tabindex="0" id=${this.id}>
        <legend>Timer Handler</legend>
        ${Signal.input()} ${this.TimerName.input(timerNames)}
        <fieldset class="Conditions">
          <legend>Conditions</legend>
          ${this.unorderedChildren(conditions)}
        </fieldset>
        <fieldset class="Responses">
          <legend>Responses</legend>
          ${this.unorderedChildren(responses)}
        </fieldset>
      </fieldset>
    `;
  }
  configure() {
    const method = this.method;
    const timerName = this.TimerName.value;
    const streamName = `timer-${timerName}`;
    if (method.streams[streamName]) return;
    const timer2 = method.timer(timerName);
    if (!timer2) return;
    const delayTime = 1e3 * timer2.Interval.value;
    method.streams[streamName] = timer2.subject$.pipe(
      switchMap(
        (event) => event.type == "cancel" ? EMPTY : of(event).pipe(delay(delayTime))
      )
    );
  }
}
TreeBase.register(TimerHandler, "TimerHandler");
const defaultCues = {
  className: "CueList",
  props: {
    direction: "",
    background: "",
    scale: 1,
    name: "Cues",
    label: ""
  },
  children: [
    {
      className: "CueOverlay",
      props: {
        Name: "red overlay",
        Key: "idl7w16hghqop9hcgn95",
        CueType: "CueOverlay",
        Default: "true",
        Color: "red",
        Opacity: "0.2"
      },
      children: []
    },
    {
      className: "CueFill",
      props: {
        Name: "fill",
        Key: "idl7ysqw4agxg63qvx4j5",
        CueType: "CueFill",
        Default: "false",
        Color: "#7BAFD4",
        Opacity: "0.3",
        Direction: "top",
        Repeat: "false"
      },
      children: []
    },
    {
      className: "CueCircle",
      props: {
        Name: "circle",
        Key: "idl7ythslqew02w4pom29",
        CueType: "CueCircle",
        Default: "false",
        Color: "#7BAFD4",
        Opacity: "0.7"
      },
      children: []
    },
    {
      className: "CueCss",
      props: {
        Name: "yellow overlay using CSS",
        Key: "idl7qm4cs28fh2ogf4ni",
        CueType: "CueCss",
        Default: "false",
        Code: `button[cue="$Key"] {
  position: relative;
  border-color: yellow;
}
button[cue="$Key"]:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: yellow;
  opacity: 0.3;
  z-index: 10;
}`
      },
      children: []
    }
  ]
};
class CueList extends DesignerPanel {
  name = new String$1("Cues");
  static tableName = "cues";
  static defaultValue = defaultCues;
  allowedChildren = ["CueCss", "CueFill", "CueOverlay", "CueCircle"];
  /** @type {Cue[]} */
  children = [];
  allowDelete = false;
  settings() {
    return html`<div class=${this.CSSClasses("CueList")} id=${this.id}>
      ${this.unorderedChildren()}
    </div>`;
  }
  template() {
    const result = this.children.map(
      (child) => html`<style>
          ${child.css}
        </style>`
    );
    if (this.children.length > 0) {
      const defaultCue = this.defaultCue;
      const defaultCSS = defaultCue.css.replaceAll(
        defaultCue.Key.value,
        "DefaultCue"
      );
      result.push(
        html`<style>
          ${defaultCSS}
        </style>`
      );
    }
    return html`${result}`;
  }
  get cueMap() {
    const entries = this.children.map((child) => [
      child.Key.value,
      child.Name.value
    ]);
    entries.unshift(["DefaultCue", "Default Cue"]);
    return new Map(entries);
  }
  get defaultCue() {
    return this.children.find((cue) => cue.Default.value) || this.children[0];
  }
  /** @param {string} cue */
  cueName(cue) {
    return this.cueMap.get(cue);
  }
  /** @param {string} key
   * @returns {Cue | undefined}
   */
  keyToCue(key) {
    return this.children.find((child) => child.Key.value == key);
  }
  /** @param {Object} obj */
  static upgrade(obj) {
    if (obj.className == "CueList") {
      for (const child of obj.children) {
        if (child.className == "CueCss" && typeof child.props.Code === "string") {
          child.props.Code = child.props.Code.replaceAll("{{Key}}", "$Key");
        }
      }
    }
    return obj;
  }
  /**
   * Merge an object into the panel contents
   * @param {ExternalRep} obj
   * @returns {Promise<void>}
   */
  async merge(obj) {
    console.assert(obj.className == "CueList", obj);
    const toMerge = obj.children;
    for (let newChild of toMerge) {
      TreeBase.fromObject(newChild, this);
    }
    this.onUpdate();
  }
}
TreeBase.register(CueList, "CueList");
const CueTypes = /* @__PURE__ */ new Map([
  ["Cue", "none"],
  ["CueOverlay", "overlay"],
  ["CueFill", "fill"],
  ["CueCss", "css"],
  ["CueCircle", "circle"]
]);
class Cue2 extends TreeBaseSwitchable {
  Name = new String$1("a cue");
  Key = new UID();
  CueType = new TypeSelect(CueTypes);
  Default = new OneOfGroup(false, { group: "DefaultCue" });
  SpeechField = new Field({
    placeholder: "None selected",
    notRequired: true,
    addedFields: ["#GroupName"]
  });
  voiceURI = new Voice("", { label: "Voice" });
  pitch = new Float(1);
  rate = new Float(1);
  volume = new Float(1);
  AudioField = new Field({
    placeholder: "None selected",
    notRequired: true
  });
  settingsSummary() {
    return html`<h3>
      ${this.Name.value} ${toggleIndicator(this.Default.value, "Default cue")}
    </h3>`;
  }
  settingsDetails() {
    return [
      html`<div class="Cue">
        ${this.Name.input()} ${this.Default.input()} ${this.CueType.input()}
        ${this.subTemplate()} ${this.audibleTemplate()}
      </div>`
    ];
  }
  /** @returns {Hole[]} */
  subTemplate() {
    return [];
  }
  /** @returns {Hole[]} */
  audibleTemplate() {
    return [
      html`${this.SpeechField.input()} ${this.voiceURI.input()}
      ${this.volume.input()} ${this.rate.input()} ${this.pitch.input()}
      ${this.AudioField.input()}`
    ];
  }
  get css() {
    return "";
  }
}
TreeBase.register(Cue2, "Cue");
class CueCss extends Cue2 {
  Code = new Code("", {
    placeholder: "Enter CSS for this cue",
    hiddenLabel: true
  });
  subTemplate() {
    return [this.Code.input()];
  }
  get css() {
    return Globals.state.interpolate(this.Code.editedValue);
  }
  onUpdate() {
    this.Code.editCSS(this.propsAsObject);
  }
  init() {
    super.init();
    this.onUpdate();
  }
}
TreeBase.register(CueCss, "CueCss");
class CueOverlay extends Cue2 {
  Color = new Color("yellow");
  Opacity = new Float(0.3);
  subTemplate() {
    return [
      this.Color.input(),
      this.Opacity.input(),
      html`<details>
        <summary>generated CSS</summary>
        <pre><code>${this.css.replaceAll(this.Key.value, "$Key")}</code></pre>
      </details>`
    ];
  }
  get css() {
    return `
#UI button[cue="${this.Key.value}"] {
        position: relative;
        border-color: ${getColor(this.Color.value)};
      }
#UI button[cue="${this.Key.value}"]:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${getColor(this.Color.value)};
        opacity: ${this.Opacity.value};
        z-index: 10;
      }
    `;
  }
}
TreeBase.register(CueOverlay, "CueOverlay");
const fillDirections = /* @__PURE__ */ new Map([
  ["top", "up"],
  ["bottom", "down"],
  ["right", "left to right"],
  ["left", "right to left"]
]);
class CueFill extends Cue2 {
  Color = new Color("blue");
  Opacity = new Float(0.3);
  Direction = new Select(fillDirections);
  Repeat = new Boolean$1(false);
  subTemplate() {
    return [
      this.Color.input(),
      this.Opacity.input(),
      this.Direction.input(),
      this.Repeat.input(),
      html`<details>
        <summary>generated CSS</summary>
        <pre><code>${this.css.replaceAll(this.Key.value, "$Key")}</code></pre>
      </details>`
    ];
  }
  get css() {
    return `
      button[cue="${this.Key.value}"] {
        position: relative;
        border-color: ${getColor(this.Color.value)};
      }
      button[cue="${this.Key.value}"]:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        background-color: ${getColor(this.Color.value)};
        opacity: ${this.Opacity.value};
        z-index: 10;
        animation-name: ${this.Key.value};
        animation-duration: var(--timerInterval);
        animation-timing-function: linear;
        animation-iteration-count: ${this.Repeat.value ? "infinite" : 1};
      }
      @keyframes ${this.Key.value} {
        0% { ${this.Direction.value}: 100%; }
      100% { ${this.Direction.value}: 0%; }
      }
    `;
  }
}
TreeBase.register(CueFill, "CueFill");
class CueCircle extends Cue2 {
  Color = new Color("lightblue");
  Opacity = new Float(0.3);
  subTemplate() {
    return [
      this.Color.input(),
      this.Opacity.input(),
      html`<details>
        <summary>generated CSS</summary>
        <pre><code>${this.css.replaceAll(this.Key.value, "$Key")}</code></pre>
      </details>`
    ];
  }
  get css() {
    return `
@property --percent-${this.Key.value} {
  syntax: "<percentage>";
  initial-value: 100%;
  inherits: false;
}
button[cue="${this.Key.value}"] {
  position: relative;
  border-color: ${getColor(this.Color.value)};
}
button[cue="${this.Key.value}"]:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  -webkit-mask-image: radial-gradient(
    transparent,
    transparent 50%,
    #000 51%,
    #000 0
  );
  mask: radial-gradient(transparent, transparent 50%, #000 51%, #000 0);

  background-image: conic-gradient(
    from 0,
      ${getColor(this.Color.value)},
      ${getColor(this.Color.value)} var(--percent-${this.Key.value}),
    transparent var(--percent-${this.Key.value})
  );
  opacity: ${this.Opacity.value};

  animation-name: conic-gradient-${this.Key.value};
  animation-duration: var(--timerInterval);
  animation-timing-function: linear;

  z-index: 0;
}

@keyframes conic-gradient-${this.Key.value} {
  0% {
    --percent-${this.Key.value}: 0%;
  }

  100% {
    --percent-${this.Key.value}: 100%;
  }
}
    `;
  }
}
TreeBase.register(CueCircle, "CueCircle");
const TrackyMouse = {
  dependenciesRoot: "./tracky-mouse"
};
TrackyMouse.loadDependencies = function() {
  TrackyMouse.dependenciesRoot = TrackyMouse.dependenciesRoot.replace(
    /\/+$/,
    ""
  );
  const loadScript = (src) => {
    return new Promise((resolve2, reject) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = resolve2;
      script.onerror = reject;
      script.src = src;
      document.head.append(script);
    });
  };
  const scriptFiles = [
    `${TrackyMouse.dependenciesRoot}/lib/clmtrackr.js`,
    `${TrackyMouse.dependenciesRoot}/lib/facemesh/facemesh.js`,
    `${TrackyMouse.dependenciesRoot}/lib/stats.js`,
    `${TrackyMouse.dependenciesRoot}/lib/tf.js`
  ];
  return Promise.all(scriptFiles.map(loadScript));
};
TrackyMouse.init = function(div) {
  var uiContainer = div || document.createElement("div");
  uiContainer.classList.add("tracky-mouse-ui");
  uiContainer.innerHTML = `
		<div class="tracky-mouse-controls">
        <button id="tracky-mouse-close">Close</button>
			<br>
			<label><span class="label-text">Horizontal Sensitivity</span> <input type="range" min="0" max="100" value="25" id="sensitivity-x"></label>
			<label><span class="label-text">Vertical Sensitivity</span> <input type="range" min="0" max="100" value="50" id="sensitivity-y"></label>
			<!-- <label><span class="label-text">Smoothing</span> <input type="range" min="0" max="100" value="50" id="smoothing"></label> -->
			<label><span class="label-text">Acceleration</span> <input type="range" min="0" max="100" value="50" id="acceleration"></label>
			<!-- <label><span class="label-text">Easy Stop (min distance to move)</span> <input type="range" min="0" max="100" value="50" id="min-distance"></label> -->
			<br>
			<label><span class="label-text"><input type="checkbox" checked id="mirror"> Mirror</label>
			<br>
		</div>
		<canvas class="tracky-mouse-canvas" id="tracky-mouse-canvas"></canvas>
	`;
  if (!div) {
    document.body.appendChild(uiContainer);
  }
  var mirrorCheckbox = uiContainer.querySelector("#mirror");
  var sensitivityXSlider = uiContainer.querySelector("#sensitivity-x");
  var sensitivityYSlider = uiContainer.querySelector("#sensitivity-y");
  var accelerationSlider = uiContainer.querySelector("#acceleration");
  var closeButton = uiContainer.querySelector("#tracky-mouse-close");
  closeButton.addEventListener("click", () => {
    console.log("click");
    TrackyMouse.showUI(false);
  });
  var canvas = uiContainer.querySelector("#tracky-mouse-canvas");
  var ctx = canvas.getContext("2d");
  var pointerEl = document.createElement("div");
  pointerEl.className = "tracky-mouse-pointer";
  document.body.appendChild(pointerEl);
  var cameraVideo = document.createElement("video");
  cameraVideo.setAttribute("playsinline", "");
  var defaultWidth = 640;
  var defaultHeight = 480;
  var maxPoints = 1e3;
  var mouseX = 0;
  var mouseY = 0;
  var prevMovementX = 0;
  var prevMovementY = 0;
  var cameraFramesSinceFacemeshUpdate = [];
  var sensitivityX;
  var sensitivityY;
  var acceleration;
  var face;
  var faceScore = 0;
  var faceScoreThreshold = 0.5;
  var pointsBasedOnFaceScore = 0;
  var paused = false;
  var mouseNeedsInitPos = true;
  var mirror;
  var useClmTracking = false;
  var showClmTracking = useClmTracking;
  var useFacemesh = true;
  var facemeshOptions = {
    maxContinuousChecks: 5,
    detectionConfidence: 0.9,
    maxFaces: 1,
    iouThreshold: 0.3,
    scoreThreshold: 0.75
  };
  var fallbackTimeoutID;
  var facemeshLoaded = false;
  var facemeshFirstEstimation = true;
  var facemeshEstimating = false;
  var facemeshRejectNext = 0;
  var facemeshPrediction;
  var facemeshEstimateFaces;
  var faceInViewConfidenceThreshold = 0.7;
  var pointsBasedOnFaceInViewConfidence = 0;
  var mainOops;
  var workerSyncedOops;
  let currentCameraImageData;
  let facemeshWorker;
  const initFacemeshWorker = () => {
    if (facemeshWorker) {
      facemeshWorker.terminate();
    }
    facemeshEstimating = false;
    facemeshFirstEstimation = true;
    facemeshLoaded = false;
    facemeshWorker = new Worker(
      `${TrackyMouse.dependenciesRoot}/facemesh.worker.js`
    );
    facemeshWorker.addEventListener(
      "message",
      (e2) => {
        if (e2.data.type === "LOADED") {
          facemeshLoaded = true;
          facemeshEstimateFaces = () => {
            const imageData = currentCameraImageData;
            if (!imageData) {
              return;
            }
            facemeshWorker.postMessage({ type: "ESTIMATE_FACES", imageData });
            return new Promise((resolve2, reject) => {
              facemeshWorker.addEventListener(
                "message",
                (e3) => {
                  if (e3.data.type === "ESTIMATED_FACES") {
                    resolve2(e3.data.predictions);
                  }
                },
                { once: true }
              );
            });
          };
        }
      },
      { once: true }
    );
    facemeshWorker.postMessage({ type: "LOAD", options: facemeshOptions });
  };
  {
    initFacemeshWorker();
  }
  sensitivityXSlider.onchange = () => {
    sensitivityX = sensitivityXSlider.value / 1e3;
  };
  sensitivityYSlider.onchange = () => {
    sensitivityY = sensitivityYSlider.value / 1e3;
  };
  accelerationSlider.onchange = () => {
    acceleration = accelerationSlider.value / 100;
  };
  mirrorCheckbox.onchange = () => {
    mirror = mirrorCheckbox.checked;
  };
  mirrorCheckbox.onchange();
  sensitivityXSlider.onchange();
  sensitivityYSlider.onchange();
  accelerationSlider.onchange();
  var clmTracker = new clm.tracker({ useWebGL: false });
  clmTracker.init();
  var clmTrackingStarted = false;
  const reset = () => {
    clmTrackingStarted = false;
    cameraFramesSinceFacemeshUpdate.length = 0;
    if (facemeshPrediction) {
      facemeshRejectNext = facemeshOptions.maxContinuousChecks;
    }
    facemeshPrediction = null;
    useClmTracking = true;
    showClmTracking = true;
    pointsBasedOnFaceScore = 0;
    faceScore = 0;
  };
  TrackyMouse.useCamera = () => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: defaultWidth,
        height: defaultHeight,
        facingMode: "user"
      }
    }).then(
      (stream) => {
        reset();
        try {
          if ("srcObject" in cameraVideo) {
            cameraVideo.srcObject = stream;
          } else {
            cameraVideo.src = window.URL.createObjectURL(stream);
          }
        } catch (err2) {
          cameraVideo.src = stream;
        }
      },
      (error) => {
        console.log(error);
      }
    );
    paused = false;
  };
  TrackyMouse.pauseCamera = () => {
    cameraVideo.srcObject && cameraVideo.srcObject.getTracks().forEach((track) => track.stop());
    paused = true;
  };
  TrackyMouse.showUI = (show) => {
    document.querySelector("div.tracky-mouse-ui").classList.toggle("show", show);
  };
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    console.log("getUserMedia not supported in this browser");
  }
  cameraVideo.addEventListener("loadedmetadata", () => {
    cameraVideo.play();
    cameraVideo.width = cameraVideo.videoWidth;
    cameraVideo.height = cameraVideo.videoHeight;
    canvas.width = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    debugFramesCanvas.width = cameraVideo.videoWidth;
    debugFramesCanvas.height = cameraVideo.videoHeight;
    debugPointsCanvas.width = cameraVideo.videoWidth;
    debugPointsCanvas.height = cameraVideo.videoHeight;
    mainOops = new OOPS();
    {
      workerSyncedOops = new OOPS();
    }
  });
  cameraVideo.addEventListener("play", () => {
    clmTracker.reset();
    clmTracker.initFaceDetector(cameraVideo);
    clmTrackingStarted = true;
  });
  canvas.width = defaultWidth;
  canvas.height = defaultHeight;
  cameraVideo.width = defaultWidth;
  cameraVideo.height = defaultHeight;
  const debugFramesCanvas = document.createElement("canvas");
  debugFramesCanvas.width = canvas.width;
  debugFramesCanvas.height = canvas.height;
  debugFramesCanvas.getContext("2d");
  const debugPointsCanvas = document.createElement("canvas");
  debugPointsCanvas.width = canvas.width;
  debugPointsCanvas.height = canvas.height;
  const debugPointsCtx = debugPointsCanvas.getContext("2d");
  const pruningGridSize = 5;
  const minDistanceToAddPoint = pruningGridSize * 1.5;
  class OOPS {
    constructor() {
      this.curPyramid = new jsfeat.pyramid_t(3);
      this.prevPyramid = new jsfeat.pyramid_t(3);
      this.curPyramid.allocate(
        cameraVideo.videoWidth,
        cameraVideo.videoHeight,
        jsfeat.U8C1_t
      );
      this.prevPyramid.allocate(
        cameraVideo.videoWidth,
        cameraVideo.videoHeight,
        jsfeat.U8C1_t
      );
      this.pointCount = 0;
      this.pointStatus = new Uint8Array(maxPoints);
      this.prevXY = new Float32Array(maxPoints * 2);
      this.curXY = new Float32Array(maxPoints * 2);
    }
    addPoint(x, y2) {
      if (this.pointCount < maxPoints) {
        var pointIndex = this.pointCount * 2;
        this.curXY[pointIndex] = x;
        this.curXY[pointIndex + 1] = y2;
        this.prevXY[pointIndex] = x;
        this.prevXY[pointIndex + 1] = y2;
        this.pointCount++;
      }
    }
    filterPoints(condition) {
      var outputPointIndex = 0;
      for (var inputPointIndex = 0; inputPointIndex < this.pointCount; inputPointIndex++) {
        if (condition(inputPointIndex)) {
          if (outputPointIndex < inputPointIndex) {
            var inputOffset = inputPointIndex * 2;
            var outputOffset = outputPointIndex * 2;
            this.curXY[outputOffset] = this.curXY[inputOffset];
            this.curXY[outputOffset + 1] = this.curXY[inputOffset + 1];
            this.prevXY[outputOffset] = this.prevXY[inputOffset];
            this.prevXY[outputOffset + 1] = this.prevXY[inputOffset + 1];
          }
          outputPointIndex++;
        } else {
          debugPointsCtx.fillStyle = "red";
          var inputOffset = inputPointIndex * 2;
          circle(
            debugPointsCtx,
            this.curXY[inputOffset],
            this.curXY[inputOffset + 1],
            5
          );
          debugPointsCtx.fillText(
            condition.toString(),
            5 + this.curXY[inputOffset],
            this.curXY[inputOffset + 1]
          );
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();
          ctx.moveTo(this.prevXY[inputOffset], this.prevXY[inputOffset + 1]);
          ctx.lineTo(this.curXY[inputOffset], this.curXY[inputOffset + 1]);
          ctx.stroke();
        }
      }
      this.pointCount = outputPointIndex;
    }
    prunePoints() {
      this.filterPoints((pointIndex) => this.pointStatus[pointIndex] == 1);
      const grid = {};
      for (let pointIndex = 0; pointIndex < this.pointCount; pointIndex++) {
        const pointOffset = pointIndex * 2;
        grid[`${~~(this.curXY[pointOffset] / pruningGridSize)},${~~(this.curXY[pointOffset + 1] / pruningGridSize)}`] = pointIndex;
      }
      const indexesToKeep = Object.values(grid);
      this.filterPoints((pointIndex) => indexesToKeep.includes(pointIndex));
    }
    update(imageData) {
      [this.prevXY, this.curXY] = [this.curXY, this.prevXY];
      [this.prevPyramid, this.curPyramid] = [this.curPyramid, this.prevPyramid];
      var winSize = 20;
      var maxIterations = 30;
      var epsilon = 0.01;
      var minEigen = 1e-3;
      jsfeat.imgproc.grayscale(
        imageData.data,
        imageData.width,
        imageData.height,
        this.curPyramid.data[0]
      );
      this.curPyramid.build(this.curPyramid.data[0], true);
      jsfeat.optical_flow_lk.track(
        this.prevPyramid,
        this.curPyramid,
        this.prevXY,
        this.curXY,
        this.pointCount,
        winSize,
        maxIterations,
        this.pointStatus,
        epsilon,
        minEigen
      );
      this.prunePoints();
    }
    draw(ctx2) {
      for (var i = 0; i < this.pointCount; i++) {
        var pointOffset = i * 2;
        circle(ctx2, this.curXY[pointOffset], this.curXY[pointOffset + 1], 3);
        ctx2.strokeStyle = ctx2.fillStyle;
        ctx2.beginPath();
        ctx2.moveTo(this.prevXY[pointOffset], this.prevXY[pointOffset + 1]);
        ctx2.lineTo(this.curXY[pointOffset], this.curXY[pointOffset + 1]);
        ctx2.stroke();
      }
    }
    getMovement() {
      var movementX = 0;
      var movementY = 0;
      var numMovements = 0;
      for (var i = 0; i < this.pointCount; i++) {
        var pointOffset = i * 2;
        movementX += this.curXY[pointOffset] - this.prevXY[pointOffset];
        movementY += this.curXY[pointOffset + 1] - this.prevXY[pointOffset + 1];
        numMovements += 1;
      }
      if (numMovements > 0) {
        movementX /= numMovements;
        movementY /= numMovements;
      }
      return [movementX, movementY];
    }
  }
  canvas.addEventListener("click", (event) => {
    if (!mainOops) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    if (mirror) {
      mainOops.addPoint(
        (rect.right - event.clientX) / rect.width * canvas.width,
        (event.clientY - rect.top) / rect.height * canvas.height
      );
    } else {
      mainOops.addPoint(
        (event.clientX - rect.left) / rect.width * canvas.width,
        (event.clientY - rect.top) / rect.height * canvas.height
      );
    }
  });
  function maybeAddPoint(oops, x, y2) {
    for (var pointIndex = 0; pointIndex < oops.pointCount; pointIndex++) {
      var pointOffset = pointIndex * 2;
      if (Math.abs(x - oops.curXY[pointOffset]) <= minDistanceToAddPoint || Math.abs(y2 - oops.curXY[pointOffset + 1]) <= minDistanceToAddPoint) {
        return;
      }
    }
    oops.addPoint(x, y2);
  }
  function animate() {
    requestAnimationFrame(animate);
    if (!paused)
      draw(!paused || document.visibilityState === "visible");
  }
  function draw(update2 = true) {
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    currentCameraImageData = imageData;
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
    }
    if (!mainOops) {
      return;
    }
    if (update2) {
      if (clmTrackingStarted) {
        if (useClmTracking || showClmTracking) {
          try {
            clmTracker.track(cameraVideo);
          } catch (error) {
            console.warn("Error in clmTracker.track()", error);
            if (clmTracker.getCurrentParameters().includes(NaN)) {
              console.warn("NaNs creeped in.");
            }
          }
          face = clmTracker.getCurrentPosition();
          faceScore = clmTracker.getScore();
          Math.pow(clmTracker.getConvergence(), 0.5);
        }
        if (facemeshLoaded && !facemeshEstimating) {
          facemeshEstimating = true;
          cameraFramesSinceFacemeshUpdate = [];
          clearTimeout(fallbackTimeoutID);
          fallbackTimeoutID = setTimeout(
            () => {
              if (!useClmTracking) {
                reset();
                clmTracker.init();
                clmTracker.reset();
                clmTracker.initFaceDetector(cameraVideo);
                clmTrackingStarted = true;
                console.warn("Falling back to clmtracker");
              }
              fallbackTimeoutID = setInterval(() => {
                try {
                  document.createElement("canvas").getContext("webgl2");
                  clearInterval(fallbackTimeoutID);
                  setTimeout(() => {
                    console.warn("Re-initializing facemesh worker");
                    initFacemeshWorker();
                    facemeshRejectNext = 1;
                  }, 1e3);
                } catch (e2) {
                }
              }, 500);
            },
            facemeshFirstEstimation ? 2e4 : 2e3
          );
          facemeshEstimateFaces().then(
            (predictions) => {
              facemeshEstimating = false;
              facemeshFirstEstimation = false;
              facemeshRejectNext -= 1;
              if (facemeshRejectNext > 0) {
                return;
              }
              facemeshPrediction = predictions[0];
              useClmTracking = false;
              showClmTracking = false;
              clearTimeout(fallbackTimeoutID);
              if (!facemeshPrediction) {
                return;
              }
              workerSyncedOops.filterPoints(() => false);
              const { annotations } = facemeshPrediction;
              workerSyncedOops.addPoint(
                annotations.noseLeftCorner[0][0],
                annotations.noseLeftCorner[0][1]
              );
              workerSyncedOops.addPoint(
                annotations.noseRightCorner[0][0],
                annotations.noseRightCorner[0][1]
              );
              workerSyncedOops.addPoint(
                annotations.midwayBetweenEyes[0][0],
                annotations.midwayBetweenEyes[0][1]
              );
              for (var pointIndex = 0; pointIndex < workerSyncedOops.pointCount; pointIndex++) {
                const pointOffset = pointIndex * 2;
                maybeAddPoint(
                  mainOops,
                  workerSyncedOops.curXY[pointOffset],
                  workerSyncedOops.curXY[pointOffset + 1]
                );
              }
              pointsBasedOnFaceInViewConfidence = facemeshPrediction.faceInViewConfidence;
              mainOops.filterPoints((pointIndex2) => {
                var pointOffset = pointIndex2 * 2;
                var distance2 = Math.hypot(
                  (annotations.noseTip[0][0] - mainOops.curXY[pointOffset]) * 1.4,
                  annotations.noseTip[0][1] - mainOops.curXY[pointOffset + 1]
                );
                var headSize = Math.hypot(
                  annotations.leftCheek[0][0] - annotations.rightCheek[0][0],
                  annotations.leftCheek[0][1] - annotations.rightCheek[0][1]
                );
                if (distance2 > headSize) {
                  return false;
                }
                distance2 = Math.min(
                  Math.hypot(
                    annotations.leftEyeLower0[0][0] - mainOops.curXY[pointOffset],
                    annotations.leftEyeLower0[0][1] - mainOops.curXY[pointOffset + 1]
                  ),
                  Math.hypot(
                    annotations.rightEyeLower0[0][0] - mainOops.curXY[pointOffset],
                    annotations.rightEyeLower0[0][1] - mainOops.curXY[pointOffset + 1]
                  )
                );
                if (distance2 < headSize * 0.42) {
                  return false;
                }
                return true;
              });
            },
            () => {
              facemeshEstimating = false;
              facemeshFirstEstimation = false;
            }
          );
        }
      }
      mainOops.update(imageData);
    }
    if (facemeshPrediction) {
      ctx.fillStyle = "red";
      const bad = facemeshPrediction.faceInViewConfidence < faceInViewConfidenceThreshold;
      ctx.fillStyle = bad ? "rgb(255,255,0)" : "rgb(130,255,50)";
      if (!bad || mainOops.pointCount < 3 || facemeshPrediction.faceInViewConfidence > pointsBasedOnFaceInViewConfidence + 0.05) {
        if (bad) {
          ctx.fillStyle = "rgba(255,0,255)";
        }
        if (update2 && useFacemesh) {
          facemeshPrediction.scaledMesh.forEach((point) => {
            point[0] += prevMovementX;
            point[1] += prevMovementY;
          });
        }
        facemeshPrediction.scaledMesh.forEach(([x, y2, z]) => {
          ctx.fillRect(x, y2, 1, 1);
        });
      } else {
        if (update2 && useFacemesh) {
          pointsBasedOnFaceInViewConfidence -= 1e-3;
        }
      }
    }
    if (face) {
      const bad = faceScore < faceScoreThreshold;
      ctx.strokeStyle = bad ? "rgb(255,255,0)" : "rgb(130,255,50)";
      if (!bad || mainOops.pointCount < 2 || faceScore > pointsBasedOnFaceScore + 0.05) {
        if (bad) {
          ctx.strokeStyle = "rgba(255,0,255)";
        }
        if (update2 && useClmTracking) {
          pointsBasedOnFaceScore = faceScore;
          maybeAddPoint(mainOops, face[42][0], face[42][1]);
          maybeAddPoint(mainOops, face[43][0], face[43][1]);
          mainOops.filterPoints((pointIndex) => {
            var pointOffset = pointIndex * 2;
            var distance2 = Math.hypot(
              (face[62][0] - mainOops.curXY[pointOffset]) * 1.4,
              face[62][1] - mainOops.curXY[pointOffset + 1]
            );
            var headSize = Math.hypot(
              face[23][0] - face[28][0],
              face[23][1] - face[28][1]
            );
            if (distance2 > headSize) {
              return false;
            }
            return true;
          });
        }
      } else {
        if (update2 && useClmTracking) {
          pointsBasedOnFaceScore -= 1e-3;
        }
      }
      if (showClmTracking) {
        clmTracker.draw(canvas, void 0, void 0, true);
      }
    }
    ctx.fillStyle = "lime";
    mainOops.draw(ctx);
    debugPointsCtx.fillStyle = "green";
    mainOops.draw(debugPointsCtx);
    if (update2) {
      var [movementX, movementY] = mainOops.getMovement();
      var accelerate = (delta, distance2) => delta / 1 * Math.abs(delta * 5) ** acceleration;
      var distance = Math.hypot(movementX, movementY);
      var deltaX = accelerate(movementX * sensitivityX, distance);
      var deltaY = accelerate(movementY * sensitivityY, distance);
      if (!isFinite(deltaX) || !isFinite(deltaY)) {
        return;
      }
      if (!paused) {
        const screenWidth = window.moveMouse ? screen.width : innerWidth;
        const screenHeight = window.moveMouse ? screen.height : innerHeight;
        mouseX -= deltaX * screenWidth;
        mouseY += deltaY * screenHeight;
        mouseX = Math.min(Math.max(0, mouseX), screenWidth);
        mouseY = Math.min(Math.max(0, mouseY), screenHeight);
        if (mouseNeedsInitPos) {
          mouseX = screenWidth / 2;
          mouseY = screenHeight / 2;
          mouseNeedsInitPos = false;
        }
        if (window.moveMouse) {
          window.moveMouse(~~mouseX, ~~mouseY);
          pointerEl.style.display = "none";
        } else {
          pointerEl.style.display = "";
          pointerEl.style.left = `${mouseX}px`;
          pointerEl.style.top = `${mouseY}px`;
        }
        if (TrackyMouse.onPointerMove) {
          TrackyMouse.onPointerMove(mouseX, mouseY);
        }
      }
      prevMovementX = movementX;
      prevMovementY = movementY;
    }
    ctx.restore();
  }
  function circle(ctx2, x, y2, r) {
    ctx2.beginPath();
    ctx2.arc(x, y2, r, 0, Math.PI * 2);
    ctx2.fill();
  }
  animate();
  if (window.moveMouse) {
    useCamera();
  }
  const handleShortcut = (shortcutType) => {
    if (shortcutType === "toggle-tracking") {
      paused = !paused;
      mouseNeedsInitPos = true;
      if (paused) {
        pointerEl.style.display = "none";
      }
    }
  };
  if (typeof onShortcut !== "undefined") {
    onShortcut(handleShortcut);
  } else {
    addEventListener("keydown", (event) => {
      if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && event.key === "F9") {
        handleShortcut("toggle-tracking");
      }
    });
  }
};
class HeadMouse extends TreeBase {
  stateName = new String$1("$HeadMouse");
  /** @type {Promise} */
  promise;
  template() {
    const stateName = this.stateName.value;
    const { state: state2 } = Globals;
    const updated = state2.hasBeenUpdated(stateName);
    this.promise.then(() => {
      if (updated) {
        const status = state2.get(stateName, "off");
        if (status == "on" || status == "setup") {
          document.body.classList.toggle("HeadMouse", true);
          TrackyMouse.useCamera();
          TrackyMouse.showUI(status == "setup");
        } else if (status == "off") {
          document.body.classList.toggle("HeadMouse", false);
          TrackyMouse.pauseCamera();
          TrackyMouse.showUI(false);
        }
      }
    });
    return html`<div />`;
  }
  init() {
    super.init();
    TrackyMouse.dependenciesRoot = "./tracky-mouse";
    this.promise = TrackyMouse.loadDependencies();
    this.promise.then(() => {
      TrackyMouse.init();
      const getEventOptions = ({ x, y: y2 }) => {
        return {
          view: window,
          // needed so the browser can calculate offsetX/Y from the clientX/Y
          clientX: x,
          clientY: y2,
          pointerId: 1234567890,
          // a special value so other code can detect these simulated events
          pointerType: "mouse",
          isPrimary: true
        };
      };
      let last_el_over;
      TrackyMouse.onPointerMove = (x, y2) => {
        const target = document.elementFromPoint(x, y2) || document.body;
        if (target !== last_el_over) {
          if (last_el_over) {
            const event3 = new PointerEvent(
              "pointerout",
              Object.assign(getEventOptions({ x, y: y2 }), {
                button: 0,
                buttons: 1,
                bubbles: true,
                cancelable: false
              })
            );
            last_el_over.dispatchEvent(event3);
          }
          const event2 = new PointerEvent(
            "pointerover",
            Object.assign(getEventOptions({ x, y: y2 }), {
              button: 0,
              buttons: 1,
              bubbles: true,
              cancelable: false
            })
          );
          target.dispatchEvent(event2);
          last_el_over = target;
        }
        const event = new PointerEvent(
          "pointermove",
          Object.assign(getEventOptions({ x, y: y2 }), {
            button: 0,
            buttons: 1,
            bubbles: true,
            cancelable: true
          })
        );
        target.dispatchEvent(event);
      };
    });
  }
}
TreeBase.register(HeadMouse, "HeadMouse");
class MenuItem {
  /**
   * @param {Object} obj - argument object
   * @param {string} obj.label
   * @param {Function | null} [ obj.callback ]
   * @param {boolean} [obj.disable]
   * @param {any[]} [ obj.args ]
   * @param {string} [ obj.title ]
   * @param {string} [ obj.divider ]
   */
  constructor({
    label,
    callback = null,
    args = [],
    title = "",
    divider = "",
    disable = false
  }) {
    this.label = label;
    this.callback = callback;
    this.disable = !!disable;
    this.args = args;
    this.title = title;
    this.divider = divider;
  }
  apply() {
    if (this.callback && !this.disable) this.callback(...this.args);
  }
}
class Menu {
  // a unique id for each menu
  static _menuCount = 0;
  id = `menu_${Menu._menuCount++}`;
  // these are for aria references
  contentId = this.id + "_content";
  buttonId = this.id + "_button";
  expanded = false;
  // true when the menu is shown
  /** @type {MenuItem[]} */
  items = [];
  // cached items returned from the contentCallback
  /** @type {HTMLElement} - reference to the outer div */
  current;
  /**
   * @param {string} label - label on the menu button
   * @param {function(...any): MenuItem[]} contentCallback - returns the menu items to display
   * @param {any[]} callbackArgs - type
   */
  constructor(label, contentCallback, ...callbackArgs) {
    this.label = label;
    this.contentCallback = contentCallback;
    this.callbackArgs = callbackArgs;
  }
  render() {
    if (this.expanded) {
      this.items = this.contentCallback(...this.callbackArgs);
      if (this.items.length == 0) {
        this.items = [new MenuItem({ label: "None" })];
      }
    } else {
      this.items = [];
    }
    return html`<div
      class="Menu"
      id=${this.id}
      @focusout=${this.focusHandler}
      ref=${this}
    >
      <button
        id=${this.buttonId}
        aria-expanded=${this.expanded}
        aria-controls=${this.contentId}
        aria-haspopup="true"
        @click=${this.toggleExpanded}
        @keyup=${this.buttonKeyHandler}
      >
        ${this.label}
      </button>
      <ul
        ?hidden=${!this.expanded}
        role="menu"
        id=${this.contentId}
        aria-labelledby=${this.buttonId}
        @keyup=${this.menuKeyHandler}
      >
        ${this.items.map((item, index) => {
      return html`<li role="menuitem" divider=${item.divider}>
            <button
              index=${index}
              aria-disabled=${!item.callback || item.disable}
              title=${item.title}
              @click=${() => {
        if (item.callback) {
          this.toggleExpanded();
          item.apply();
        }
      }}
            >
              ${item.label}
            </button>
          </li>`;
    })}
      </ul>
    </div>`;
  }
  /** @returns {HTMLButtonElement | null} */
  get focusedItem() {
    return this.current.querySelector("li > button:focus");
  }
  /** @param {number} index */
  setFocus(index) {
    if (!this.items.length) return;
    index = (index + this.items.length) % this.items.length;
    const item = (
      /** @type {HTMLElement} */
      this.current.querySelector(`button[index="${index}"]`)
    );
    if (item) item.focus();
  }
  /* Close the menu when it loses focus */
  focusHandler = ({ relatedTarget }) => {
    if (!relatedTarget) {
      callAfterRender(() => {
        const button = document.getElementById(this.buttonId);
        if (button) button.focus();
      });
      if (this.expanded) this.toggleExpanded();
      return;
    }
    const menu = document.getElementById(this.id);
    if (menu && !menu.contains(relatedTarget) && this.expanded) {
      this.toggleExpanded();
    }
  };
  /* Toggle the menu state */
  toggleExpanded = (event = null, last2 = false) => {
    {
      this.expanded = !this.expanded;
      const mouseClick = event && event["detail"] !== 0;
      if (this.expanded && (!event || !mouseClick)) {
        callAfterRender(() => {
          if (last2) {
            this.setFocus(-1);
          } else {
            this.setFocus(0);
          }
        });
      } else if (!this.expanded && mouseClick) {
        callAfterRender(() => Globals.designer.restoreFocus());
      }
      Globals.state.update();
    }
  };
  /** handle the keyboard when inside the menu
   *
   * @param {KeyboardEvent} event
   * */
  menuKeyHandler = ({ key }) => {
    if (key == "Escape" && this.expanded) {
      this.toggleExpanded();
    } else if (key == "ArrowUp" || key == "ArrowDown") {
      const focused = this.focusedItem;
      const index = +(focused?.getAttribute("index") || 0);
      const step = key == "ArrowUp" ? -1 : 1;
      this.setFocus(index + step);
    } else if (key == "Home") {
      this.setFocus(0);
    } else if (key == "End") {
      this.setFocus(-1);
    } else if (key.length == 1 && (key >= "a" && key <= "z" || key >= "A" && key <= "Z")) {
      const focused = this.focusedItem;
      const index = +(focused?.getAttribute("index") || 0);
      for (let i = 1; i < this.items.length; i++) {
        if (this.items[(index + i) % this.items.length].label.toLowerCase().startsWith(key)) {
          this.setFocus(i + index);
          break;
        }
      }
    }
  };
  /**
   * Handle the keyboard when on the menu button
   *
   * @param {KeyboardEvent} event */
  buttonKeyHandler = (event) => {
    if (event.key == "ArrowDown" || event.key == " ") {
      event.preventDefault();
      this.toggleExpanded();
    } else if (event.key == "ArrowUp") {
      event.preventDefault();
      this.toggleExpanded(null, true);
    }
  };
}
function claimTab() {
  return window.open("", "_blank");
}
function showInTab(tab2, url) {
  if (tab2 && !tab2.closed) tab2.location.replace(url);
  else window.location.assign(url);
}
function openTab(url) {
  if (!window.open(url, "_blank")) window.location.assign(url);
}
let registration;
function workerCheckForUpdate() {
  if (registration) {
    registration.update();
  }
}
function signalUpdateAvailable() {
  document.body.classList.add("update-available");
}
if (navigator.serviceWorker) {
  window.addEventListener("load", async () => {
    registration = await navigator.serviceWorker.register("service-worker.js", {
      scope: "/OS-DPI/"
    });
    if (registration.waiting) {
      signalUpdateAvailable();
    }
    registration.addEventListener("updatefound", () => {
      if (registration.installing) {
        registration.installing.addEventListener("statechange", () => {
          if (registration.waiting) {
            if (navigator.serviceWorker.controller) {
              signalUpdateAvailable();
            } else {
              console.log("Service Worker initialized for the first time");
            }
          }
        });
      }
    });
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  });
}
function workerUpdateButton() {
  return html`<button
    id="update-available-button"
    @click=${() => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage("SKIP_WAITING");
    }
  }}
    title="Click to update the app"
  >
    Update
  </button>`;
}
const panelNames = ["Layout", "Actions", "Cues", "Patterns", "Methods"];
const MenuItemBlacklist = [
  "Audio",
  "Head Mouse",
  "Logger",
  "Speech",
  "Socket Handler",
  "Copy",
  "Cut",
  "Paste",
  "Paste Into"
];
class SeededRandom {
  /** @param {number} seed */
  constructor(seed) {
    this.seed = seed;
  }
  // splittwist32
  random() {
    this.seed |= 0;
    this.seed = this.seed + 2654435769 | 0;
    var t2 = this.seed ^ this.seed >>> 16;
    t2 = Math.imul(t2, 569420461);
    t2 = t2 ^ t2 >>> 15;
    t2 = Math.imul(t2, 1935289751);
    return ((t2 = t2 ^ t2 >>> 15) >>> 0) / 4294967296;
  }
  string() {
    const n2 = 4 + Math.floor(this.random() * 4);
    return this.random().toString(36).slice(2, n2);
  }
  integer() {
    return Math.floor(this.random() * 10).toString();
  }
  float() {
    return (this.random() * 10).toString();
  }
  /** Choose one from an array
   * @template T
   * @param {T[]} items
   * @returns {T}
   */
  choose(items) {
    return items[Math.floor(this.random() * items.length)];
  }
}
const actualSeed = Date.now() | 0;
const random = new SeededRandom(actualSeed);
let updates = 0;
function* monkeyTest() {
  console.log("Random seed:", random.seed.toString(16));
  let steps = 100;
  for (let step = 0; step < steps; step++) {
    const panelName = random.choose(panelNames);
    Globals.designer.switchTab(panelName);
    yield true;
    const panel = Globals.designer.currentPanel;
    if (panel) {
      const components = listChildren(panel);
      const component = random.choose(components);
      if (component) {
        panel.lastFocused = component.id;
        Globals.designer.restoreFocus();
      } else {
        panel.lastFocused = "";
      }
      const { child } = getPanelMenuItems("add");
      let menuItems = [
        ...child,
        ...getEditMenuItems(),
        ...getPropertyEdits(component)
      ];
      menuItems = menuItems.filter((item) => {
        return MenuItemBlacklist.indexOf(item.label) < 0;
      });
      menuItems = menuItems.filter((item) => item.callback && !item.disable);
      console.assert(
        !menuItems.find((item) => item.label == "Page"),
        "Should not add Page"
      );
      const menuItem = random.choose(menuItems);
      if (menuItem && menuItem.callback) {
        menuItem.callback();
        updates++;
        yield true;
      }
    }
    const UI = document.getElementById("UI");
    let overflow = false;
    if (UI && (UI.scrollWidth > UI.clientWidth || UI.scrollHeight > UI.clientHeight)) {
      if (!overflow) {
        console.error(
          `UI overflow on step ${step} scroll w=${UI.scrollWidth} h=${UI.scrollHeight} client w=${UI.clientWidth} h=${UI.clientHeight}`
        );
        overflow = true;
      }
    } else {
      overflow = false;
    }
  }
  let undos = 0;
  for (const panel of Globals.designer.children) {
    const panelName = panel.name.value;
    if (panelNames.indexOf(panelName) >= 0) {
      Globals.designer.switchTab(panelName);
      yield true;
      while (panel.changeStack.canUndo) {
        undos++;
        panel.undo();
        yield true;
      }
    }
  }
  console.log(
    `Test complete: ${steps} steps ${updates} updates ${undos} undos`
  );
  yield false;
}
function monkey() {
  document.addEventListener("internalerror", () => test.return());
  const test = monkeyTest();
  const stopHandler = ({ key, ctrlKey }) => key == "q" && ctrlKey && test.return();
  document.addEventListener("keyup", stopHandler);
  let wait2 = 0;
  document.addEventListener("rendercomplete", () => wait2 = 0);
  const timer2 = setInterval(() => {
    if (wait2 <= 0) {
      wait2 = 5;
      if (!test.next().value) {
        clearTimeout(timer2);
        document.removeEventListener("keyup", stopHandler);
      }
    } else {
      wait2--;
    }
  }, 20);
}
if (location.host.match(/^localhost.*$|^bs-local.*$/)) {
  document.addEventListener(
    "keyup",
    ({ key, ctrlKey }) => key == "m" && ctrlKey && monkey()
  );
}
function getPropertyEdits(component) {
  if (!component) return [];
  const props = component.props;
  const items = [];
  let callback = void 0;
  for (const name in props) {
    const prop = props[name];
    if (prop instanceof String$1) {
      callback = () => typeInto(prop, random.string());
    } else if (prop instanceof Integer) {
      callback = () => typeInto(prop, random.integer());
    } else if (prop instanceof Float) {
      callback = () => typeInto(prop, random.float());
    } else if (prop instanceof Select) {
      callback = () => {
        const element = document.getElementById(prop.id);
        if (element instanceof HTMLSelectElement) {
          const options = element.options;
          const option = random.choose([...options]);
          if (option instanceof HTMLOptionElement) {
            element.value = option.value;
            element.dispatchEvent(new Event("change"));
          }
        }
      };
    } else if (prop instanceof Color) {
      callback = () => {
        const element = document.getElementById(prop.id);
        if (element instanceof HTMLInputElement) {
          const list = document.getElementById("ColorNames");
          if (list instanceof HTMLDataListElement) {
            const color = random.choose([...list.options]);
            if (color instanceof HTMLOptionElement) {
              element.value = color.value;
              element.dispatchEvent(new Event("change"));
            }
          }
        }
      };
    } else if (prop instanceof Boolean$1 || prop instanceof OneOfGroup) {
      callback = () => {
        const element = document.getElementById(prop.id);
        if (element instanceof HTMLInputElement && element.type == "checkbox") {
          element.checked = !element.checked;
          element.dispatchEvent(new Event("change"));
        }
      };
    } else if (prop instanceof Conditional) {
      callback = () => typeInto(prop, random.choose(["true", "false"]));
    } else if (prop instanceof Expression) {
      callback = () => typeInto(prop, random.choose(["1+1", "2*0"]));
    } else {
      continue;
    }
    const item = new MenuItem({
      label: `Change ${component.className}.${prop.label}`,
      callback,
      disable: !component.allowDelete
    });
    items.push(item);
  }
  return items;
}
function typeInto(prop, value) {
  const input = document.getElementById(prop.id);
  if (input instanceof HTMLInputElement) {
    input.focus();
    input.value = value;
    input.dispatchEvent(new Event("change"));
  }
}
function listChildren(component) {
  const result = [];
  function walk(node) {
    for (const child of node.children) {
      result.push(child);
      walk(child);
    }
  }
  walk(component);
  return result;
}
var define_ORIGIN_REPO_default = { owner: "Physics-Morris", repo: "OS-DPI" };
function servingRepo() {
  if (typeof location === "undefined") return null;
  const host = location.hostname.match(/^(.+)\.github\.io$/);
  if (!host) return null;
  const owner = host[1];
  const first = location.pathname.split("/").filter(Boolean)[0];
  return { owner, repo: first || `${owner}.github.io` };
}
function builtFromRepo() {
  return typeof define_ORIGIN_REPO_default === "undefined" ? null : define_ORIGIN_REPO_default;
}
const DEFAULTS = {
  owner: "UNC-Project-Open-AAC",
  repo: "OS-DPI"
};
const GALLERY = {
  ...DEFAULTS,
  ...builtFromRepo() || {},
  ...servingRepo() || {},
  // Not in the URL: Pages may serve a different branch than holds the sources.
  branch: "main",
  // Repo path where contributed boards live (used in PR upload links).
  repoDir: "src/public/gallery",
  // Served path under BASE_URL.
  publicPath: "gallery"
};
function galleryIndexURL() {
  return `${"/OS-DPI/"}${GALLERY.publicPath}/index.json`;
}
function loadURL(item, edit = false) {
  const board = item.board || `${GALLERY.publicPath}/${item.slug}/board.osdpi`;
  return `${"/OS-DPI/"}?fetch=${board}${edit ? "&edit" : ""}#${item.slug}`;
}
function uploadURL(slug) {
  const { owner, repo, branch, repoDir } = GALLERY;
  return `https://github.com/${owner}/${repo}/upload/${branch}/${repoDir}/${slug}?quick_pull=1`;
}
function slugify(title) {
  return (title || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
const DIALOG_ID = "ShareDialog";
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a2 = document.createElement("a");
  a2.href = url;
  a2.download = filename;
  document.body.appendChild(a2);
  a2.click();
  a2.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2e3);
}
class ShareDialog {
  template() {
    return html`<dialog id=${DIALOG_ID} class="share-dialog"></dialog>`;
  }
  /** @returns {HTMLDialogElement} */
  get dialog() {
    return (
      /** @type {HTMLDialogElement} */
      document.getElementById(DIALOG_ID)
    );
  }
  open() {
    this.renderForm();
    this.dialog.showModal();
  }
  renderForm() {
    const dialog = this.dialog;
    render(
      dialog,
      html`<form class="share-form" @submit=${(e2) => this.onSubmit(e2)}>
        <h1>Share to gallery</h1>
        <p class="share-hint">
          Contribute this board to the example gallery as a GitHub pull request.
        </p>
        <label
          >Title
          <input name="title" type="text" required .value=${db.designName} />
        </label>
        <label
          >Description
          <textarea
            name="description"
            rows="2"
            placeholder="What is this board for?"
          ></textarea>
        </label>
        <label
          >Tags (comma separated)
          <input name="tags" type="text" placeholder="grid, beginner" />
        </label>
        <label
          >Your name
          <input name="author" type="text" placeholder="Optional" />
        </label>
        <div class="share-actions">
          <button type="submit" class="share-btn share-btn--primary">
            Prepare files &amp; open GitHub
          </button>
          <button
            type="button"
            class="share-btn"
            @click=${() => dialog.close()}
          >
            Cancel
          </button>
        </div>
      </form>`
    );
  }
  /** @param {SubmitEvent} event */
  async onSubmit(event) {
    event.preventDefault();
    const data2 = new FormData(
      /** @type {HTMLFormElement} */
      event.target
    );
    const title = String(data2.get("title") || "").trim();
    if (!title) return;
    const slug = slugify(title) || slugify(db.designName) || "my-board";
    const meta = {
      title,
      description: String(data2.get("description") || "").trim(),
      tags: String(data2.get("tags") || "").split(",").map((t2) => t2.trim()).filter(Boolean),
      author: String(data2.get("author") || "").trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    };
    const board = await db.convertDesignToBlob();
    const metaBlob = new Blob([JSON.stringify(meta, null, 2) + "\n"], {
      type: "application/json"
    });
    downloadBlob(board, "board.osdpi");
    setTimeout(() => downloadBlob(metaBlob, "meta.json"), 400);
    window.open(uploadURL(slug), "_blank", "noopener=true");
    this.renderInstructions(slug, meta);
  }
  renderInstructions(slug, meta) {
    const dialog = this.dialog;
    const metaText = JSON.stringify(meta, null, 2);
    const folder = `${GALLERY.repoDir}/${slug}`;
    render(
      dialog,
      html`<div class="share-form share-instructions">
        <h1>Almost there</h1>
        <p class="share-hint">
          Two files were downloaded and a GitHub page opened for a new folder
          <code>${folder}</code>.
        </p>
        <ol>
          <li>
            On the GitHub page, drag in <strong>both</strong> downloaded files,
            keeping their names: <code>board.osdpi</code> and
            <code>meta.json</code>. An entry without both is skipped.
          </li>
          <li>
            If GitHub offers a choice, pick
            <strong
              >Create a new branch for this commit and start a pull
              request</strong
            >. It only offers this if you can write to the repo, and the other
            option commits straight to <code>${GALLERY.branch}</code>.
          </li>
          <li>
            Click <strong>Propose changes</strong>, then confirm to open your
            pull request.
          </li>
        </ol>
        <p class="share-hint">
          If a download was blocked, copy <code>meta.json</code>:
        </p>
        <textarea class="share-meta" readonly rows="7">${metaText}</textarea>
        <div class="share-actions">
          <button
            type="button"
            class="share-btn"
            @click=${() => navigator.clipboard.writeText(metaText)}
          >
            Copy meta.json
          </button>
          <button
            type="button"
            class="share-btn"
            @click=${() => window.open(uploadURL(slug), "_blank", "noopener=true")}
          >
            Reopen GitHub page
          </button>
          <button
            type="button"
            class="share-btn share-btn--primary"
            @click=${() => dialog.close()}
          >
            Done
          </button>
        </div>
      </div>`
    );
  }
}
function getComponentMenuItems(component, which = "all", wrapper) {
  const result = [];
  if (which == "add" || which == "all") {
    for (const className2 of component.allowedChildren.sort()) {
      result.push(
        new MenuItem({
          label: `${friendlyName(className2)}`,
          callback: wrapper(() => {
            const result2 = TreeBase.create(className2, component);
            result2.init();
            return result2.id;
          })
        })
      );
    }
  }
  if (which == "delete" || which == "all") {
    result.push(
      new MenuItem({
        label: `Delete`,
        title: `Delete ${friendlyName(component.className)}`,
        callback: wrapper(() => {
          const nextId = component.remove();
          return nextId;
        }),
        disable: !component.allowDelete
      })
    );
  }
  if (which == "move" || which == "all") {
    const parent = component.parent;
    if (parent) {
      const index = component.index;
      if (index > 0) {
        result.push(
          new MenuItem({
            label: `Move up`,
            title: `Move up ${friendlyName(component.className)}`,
            callback: wrapper(() => {
              component.moveUpDown(true);
              return component.id;
            }),
            disable: !component.allowDelete
          })
        );
      }
      if (index < parent.children.length - 1) {
        result.push(
          new MenuItem({
            label: `Move down`,
            title: `Move down ${friendlyName(component.className)}`,
            callback: wrapper(() => {
              component.moveUpDown(false);
              return component.id;
            }),
            disable: !component.allowDelete
          })
        );
      }
    }
  }
  return result;
}
function getPanelMenuItems(type) {
  const { designer } = Globals;
  const panel = designer.currentPanel;
  if (!panel) {
    console.log("no panel");
    return { child: [], parent: [] };
  }
  const component = TreeBase.componentFromId(panel.lastFocused) || panel.children[0] || panel;
  if (!component) {
    console.log("no component");
    return { child: [], parent: [] };
  }
  if (component === panel) type = "add";
  function itemCallback(arg) {
    return () => {
      let nextId = arg();
      if (!panel) return;
      if (panel.lastFocused.startsWith(nextId)) {
        nextId = panel.lastFocused;
      }
      if (nextId.match(/^TreeBase-\d+$/)) {
        nextId = nextId + "-settings";
      }
      panel.lastFocused = nextId;
      callAfterRender(() => panel.parent?.restoreFocus());
      panel.update();
    };
  }
  let menuItems = getComponentMenuItems(component, type, itemCallback);
  let parent = component.parent;
  let parentItems = /* @__PURE__ */ new Map();
  for (let i = 0; i < 3; i++) {
    if (type !== "add" || !parent || parent instanceof Designer || parent instanceof Layout || component instanceof Stack && parent instanceof Stack || component instanceof PatternGroup && parent instanceof PatternGroup) {
      break;
    }
    for (const item of getComponentMenuItems(parent, type, itemCallback)) {
      if (!parentItems.has(item.label)) {
        parentItems.set(item.label, item);
      }
    }
    if (parentItems.size > 10) break;
    parent = parent.parent;
  }
  return { child: menuItems, parent: [...parentItems.values()] };
}
function getFileMenuItems(bar) {
  return [
    new MenuItem({
      label: "Import File",
      callback: async () => {
        const local_db = new DB();
        n({
          mimeTypes: ["application/octet-stream"],
          extensions: [".osdpi", ".zip"],
          description: "OS-DPI designs",
          id: "os-dpi"
        }).then((file) => wait(local_db.readDesignFromFile(file))).then(() => {
          openTab(`#${local_db.designName}`);
        }).catch((e2) => console.log(e2));
      }
    }),
    new MenuItem({
      label: "Import URL",
      callback: () => bar.importURLDialog.open()
    }),
    new MenuItem({
      label: "Export",
      callback: () => {
        db.saveDesign();
      }
    }),
    new MenuItem({
      label: "Share to Gallery",
      title: "Contribute this board to the example gallery",
      callback: () => bar.shareDialog.open()
    }),
    new MenuItem({
      label: "New",
      callback: async () => {
        const tab2 = claimTab();
        showInTab(tab2, `#${await db.uniqueName("new")}`);
      }
    }),
    new MenuItem({
      label: "Open",
      callback: () => {
        bar.designListDialog.open();
      }
    }),
    new MenuItem({
      label: "Gallery",
      title: "Browse the example gallery",
      callback: () => {
        openTab("#gallery");
      }
    }),
    new MenuItem({
      label: "Unload",
      callback: async () => {
        const saved = await db.saved();
        if (saved.indexOf(db.designName) < 0) {
          try {
            await db.saveDesign();
          } catch (e2) {
            if (e2 instanceof DOMException) {
              console.log("canceled save");
            } else {
              throw e2;
            }
          }
        }
        await db.unload(db.designName);
        window.close();
      }
    }),
    new MenuItem({
      label: "Unload...",
      callback: () => {
        bar.designListDialog.unload();
      }
    }),
    new MenuItem({
      label: "Refetch design",
      callback: async () => {
        await db.reloadDesignFromOriginalURL();
        console.log("refetched");
      }
    }),
    new MenuItem({
      label: "Load Plugin",
      callback: async () => {
        const file = await n({
          mimeTypes: ["application/octet-stream"],
          extensions: [".osdpi", ".zip"],
          description: "OS-DPI designs",
          id: "os-dpi"
        });
        const design = await wait(unPackDesign(file));
        await Globals.designer.merge(design);
      }
    }),
    new MenuItem({
      label: "Load Sheet",
      title: "Load a spreadsheet of content",
      divider: "Content",
      callback: async () => {
        try {
          const blob = await n({
            extensions: [".csv", ".tsv", ".ods", ".xls", ".xlsx"],
            description: "Spreadsheets",
            id: "os-dpi"
          });
          if (blob) {
            sheet.handle = blob.handle;
            const result = await wait(readSheetFromBlob(blob));
            await db.write("content", result);
            Globals.data.setContent(result);
            Globals.state.update();
          }
        } catch (e2) {
          sheet.handle = void 0;
        }
      }
    }),
    new MenuItem({
      label: "Reload sheet",
      title: "Reload a spreadsheet of content",
      callback: sheet.handle && // only offer reload if we have the handle
      (async () => {
        if (!sheet.handle) return;
        let blob;
        blob = await sheet.handle.getFile();
        if (blob) {
          const result = await wait(readSheetFromBlob(blob));
          await db.write("content", result);
          Globals.data.setContent(result);
          Globals.state.update();
        } else {
          console.log("no file to reload");
        }
      })
    }),
    new MenuItem({
      label: "Save sheet",
      title: "Save the content as a spreadsheet",
      callback: () => {
        wait(
          saveContent(db.designName, Globals.data.contentRows, "xlsx")
        );
      }
    }),
    new MenuItem({
      label: "Load media",
      title: "Load audio or images into the design",
      callback: async () => {
        try {
          const files = await n({
            description: "Media files",
            mimeTypes: ["image/*", "audio/*", "video/mp4", "video/webm"],
            multiple: true
          });
          for (const file of files) {
            await db.addMedia(file, file.name);
            if (file.type.startsWith("image/")) {
              for (const img of document.querySelectorAll(
                `img[dbsrc="${file.name}"]`
              )) {
                img.refresh();
              }
            }
            if (file.type.startsWith("video/")) {
              for (const img of document.querySelectorAll(
                `video[dbsrc="${file.name}"]`
              )) {
                img.refresh();
              }
            }
          }
        } catch {
        }
        Globals.state.update();
      }
    }),
    new MenuItem({
      label: "Save logs",
      title: "Save any logs as spreadsheets",
      divider: "Logs",
      callback: async () => {
        SaveLog();
      }
    }),
    new MenuItem({
      label: "Clear logs",
      title: "Clear any stored logs",
      callback: async () => {
        ClearLog();
      }
    }),
    new MenuItem({
      label: "Close editor",
      title: "Return to User mode",
      divider: "Editor",
      callback: () => {
        Globals.state.update({ editing: false });
      }
    })
  ];
}
async function copyComponent(cut = false) {
  const component = Globals.designer.selectedComponent;
  if (component) {
    const parent = component.parent;
    if (!(component instanceof Page) && !(parent instanceof Designer)) {
      const json = JSON.stringify(
        // don't include UID or OneOfGroup props in the copy
        component.toObject({ omittedProps: ["UID", "OneOfGroup"] })
      );
      await navigator.clipboard.writeText(json);
      if (cut) {
        component.remove();
        Globals.designer.currentPanel?.onUpdate();
      }
    }
  }
}
function getEditMenuItems() {
  const { designer } = Globals;
  const panel = designer.currentPanel;
  const component = Globals.designer.selectedComponent;
  const canEdit = component && component.allowDelete;
  let items = [
    new MenuItem({
      label: "Undo",
      callback: panel?.changeStack.canUndo ? () => panel?.undo() : void 0,
      disable: !panel?.changeStack.canUndo
    }),
    new MenuItem({
      label: "Redo",
      callback: panel?.changeStack.canRedo ? () => panel?.redo() : void 0,
      disable: !panel?.changeStack.canRedo
    }),
    new MenuItem({
      label: "Copy",
      callback: copyComponent,
      disable: !canEdit
    }),
    new MenuItem({
      label: "Cut",
      callback: async () => {
        copyComponent(true);
      },
      disable: !canEdit
    }),
    new MenuItem({
      label: "Paste",
      callback: async () => {
        const json = await navigator.clipboard.readText();
        try {
          var obj = JSON.parse(json);
        } catch (e2) {
          Globals.error.report("Invalid input to Paste");
          Globals.error.report(json);
          Globals.state.update();
          return;
        }
        const className2 = obj.className;
        if (!className2) return;
        const designer2 = Globals.designer;
        const panel2 = designer2.currentPanel;
        if (!panel2) return;
        const anchor = designer2.selectedComponent;
        if (!anchor) return;
        let current = anchor;
        while (current) {
          if (current.allowedChildren.indexOf(className2) >= 0) {
            const result = TreeBase.fromObject(obj, current);
            if (anchor.parent === result.parent && result.index != anchor.index + 1) {
              result.moveTo(anchor.index + 1);
            }
            callAfterRender(() => designer2.focusOn(result.id));
            panel2.onUpdate();
            return;
          }
          current = current.parent;
        }
      },
      disable: !canEdit
    }),
    new MenuItem({
      label: "Paste Into",
      callback: async () => {
        const json = await navigator.clipboard.readText();
        try {
          var obj = JSON.parse(json);
        } catch (e2) {
          Globals.error.report("Invalid input to Paste Into");
          Globals.error.report(json);
          Globals.state.update();
          return;
        }
        const className2 = obj.className;
        if (!className2) return;
        const current = Globals.designer.selectedComponent;
        if (current && current.allowedChildren.indexOf(className2) >= 0) {
          TreeBase.fromObject(obj, current);
          Globals.designer.currentPanel?.onUpdate();
        }
      },
      disable: !canEdit
    })
  ];
  const deleteItems = getPanelMenuItems("delete");
  const moveItems = getPanelMenuItems("move");
  items = items.concat(moveItems.child, deleteItems.child);
  const parentItems = moveItems.parent.concat(deleteItems.parent);
  if (parentItems.length > 0) {
    parentItems[0].divider = "Parents";
    items = items.concat(parentItems);
  }
  return items;
}
function openHelpURL(name) {
  const wiki = "https://github.com/unc-project-open-aac/os-dpi/wiki";
  const url = `${wiki}/${name}`;
  window.open(url, "help");
}
function getHelpMenuItems() {
  const items = [];
  const names = /* @__PURE__ */ new Set();
  let component = Globals.designer.selectedComponent || Globals.designer.currentPanel;
  while (component && component.parent) {
    const className2 = component.className;
    const menuName = friendlyName(className2);
    if (!names.has(menuName)) {
      items.push(
        new MenuItem({
          label: menuName,
          callback: openHelpURL,
          args: [wikiName(className2)]
        })
      );
      names.add(menuName);
    }
    component = component.parent;
  }
  items.push(
    new MenuItem({
      label: "About OS-DPI",
      callback: openHelpURL,
      args: ["About-Project-Open"]
    })
  );
  if (location.host.match(/^localhost.*$|^bs-local.*$/)) {
    items.push(
      new MenuItem({
        label: "Test",
        callback: monkey
      })
    );
  }
  return items;
}
function hinted(thing, hint) {
  return html`<div hint=${hint}>${thing}</div>`;
}
const sheet = {
  /** @type {FileSystemFileHandle | undefined } */
  handle: void 0
};
class DesignListDialog {
  /** Show imported designs so they can be reopened */
  async open() {
    const names = await db.names();
    const dialog = (
      /** @type {HTMLDialogElement} */
      document.getElementById("OpenDialog")
    );
    const list = html`<div @click=${() => dialog.close()}>
      <h1>Open one of your designs</h1>
      <ul>
        ${names.map(
      (name) => html`<li>
              <a href=${"#" + name} target="_blank">${name}</a>
            </li>`
    )}
      </ul>
      <button>Cancel</button>
    </div>`;
    if (dialog) {
      render(dialog, list);
    }
    dialog.showModal();
  }
  /** Show imported designs so they can be unloaded */
  async unload() {
    const names = await db.names();
    const saved = await db.saved();
    const dialog = (
      /** @type {HTMLDialogElement} */
      document.getElementById("OpenDialog")
    );
    async function unloadChecked() {
      const checkboxes = (
        /** @type {HTMLInputElement[]} */
        [
          ...dialog.querySelectorAll('input[type="checkbox"]')
        ]
      );
      for (const checkbox of checkboxes) {
        if (checkbox.checked) {
          await db.unload(checkbox.name);
        }
      }
      dialog.close();
    }
    const list = html`<div>
      <h1>Check the designs you want to unload</h1>
      <ul>
        ${names.map((name) => {
      let label;
      if (saved.includes(name)) {
        label = html`<span>${name}</span>`;
      } else {
        label = html`<b>${name}</b> <b class="warning">Not saved</b>`;
      }
      return html`<li>
            <label><input type="checkbox" name=${name} /> ${label}</label>
          </li>`;
    })}
      </ul>
      <button @click=${unloadChecked}>Unload</button>
      <button @click=${() => dialog.close()}>Cancel</button>
    </div>`;
    if (dialog) {
      render(dialog, list);
    }
    dialog.showModal();
  }
  template() {
    return html`<dialog id="OpenDialog"></dialog>`;
  }
}
class ImportURLDialog {
  /** @type { HTMLDialogElement} */
  current;
  template() {
    return html` <dialog id="ImportURL" ref=${this}>
      <h1>Import from a URL</h1>
      <input
        type="url"
        placeholder="Enter the URL to import"
        name="DesignURL"
      />
      <button
        @click=${() => {
      const input = this.current.querySelector("input");
      if (input instanceof HTMLInputElement && !input.validationMessage && input.value) {
        const local_db = new DB();
        wait(local_db.readDesignFromURL(input.value)).then(
          () => {
            openTab(`#${local_db.designName}`);
          },
          () => console.log("rejected")
        );
        this.current.close();
      }
    }}
      >
        Import
      </button>
      <button @click=${() => this.current.close()}>Cancel</button>
    </dialog>`;
  }
  async open() {
    const url = await db.getDesignURL();
    const input = this.current.querySelector("input");
    if (input instanceof HTMLInputElement) input.value = url;
    this.current.showModal();
  }
}
class ToolBar extends TreeBase {
  constructor() {
    super();
    this.fileMenu = new Menu("File", getFileMenuItems, this);
    this.editMenu = new Menu("Edit", getEditMenuItems);
    this.addMenu = new Menu(
      "Add",
      () => {
        const { child, parent } = getPanelMenuItems("add");
        if (parent.length > 0) {
          parent[0].divider = "Parent" + (parent.length > 1 ? "s" : "");
        }
        return child.concat(parent);
      },
      "add"
    );
    this.helpMenu = new Menu("Help", getHelpMenuItems, this);
    this.designListDialog = new DesignListDialog();
    this.importURLDialog = new ImportURLDialog();
    this.shareDialog = new ShareDialog();
  }
  template() {
    return html`
      <div class="toolbar brand">
        <ul>
          <li>
            <label for="designName">Name: </label>
            ${hinted(
      html`<input
                id="designName"
                type="text"
                .value=${db.designName}
                .size=${Math.max(db.designName.length, 12)}
                @change=${(event) => db.renameDesign(event.target.value).then(() => window.location.hash = db.designName)}
              />`,
      "N"
    )}
          </li>
          <li>
            ${// @ts-ignore
    hinted(this.fileMenu.render(), "F")}
          </li>
          <li>
            ${// @ts-ignore
    hinted(this.editMenu.render(), "E")}
          </li>
          <li>
            ${// @ts-ignore
    hinted(this.addMenu.render(), "A")}
          </li>
          <li>
            ${// @ts-ignore
    hinted(this.helpMenu.render(), "H")}
          </li>
          <li>${workerUpdateButton()}</li>
        </ul>
        ${this.designListDialog.template()} ${this.importURLDialog.template()}
        ${this.shareDialog.template()}
      </div>
    `;
  }
}
TreeBase.register(ToolBar, "ToolBar");
const EVENTS = ["pointerup", "touchend", "keydown"];
let primed = false;
function prime() {
  if (primed) return;
  primed = true;
  try {
    const u2 = new SpeechSynthesisUtterance(".");
    u2.volume = 0;
    speechSynthesis.speak(u2);
  } catch (e2) {
  }
  try {
    const a2 = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
    );
    a2.play().catch(() => {
    });
  } catch (e2) {
  }
  for (const ev of EVENTS) window.removeEventListener(ev, prime, true);
}
function installIOSMediaUnlock() {
  for (const ev of EVENTS) {
    window.addEventListener(ev, prime, { capture: true, passive: true });
  }
}
const HOLD_MS = 3e3;
const SVG_NS = "http://www.w3.org/2000/svg";
const RING = `<svg xmlns="${SVG_NS}" class="fsx-ring" viewBox="0 0 48 48" aria-hidden="true">
  <circle class="fsx-ring-track" cx="24" cy="24" r="21" pathLength="100" />
  <circle class="fsx-ring-progress" cx="24" cy="24" r="21" pathLength="100" />
</svg>`;
const EXPAND_ICON = `<svg xmlns="${SVG_NS}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
  <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
</svg>`;
const COMPRESS_ICON = `<svg xmlns="${SVG_NS}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
  <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
</svg>`;
function svgFrom(markup) {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  return document.importNode(doc.documentElement, true);
}
const isIOS = typeof navigator !== "undefined" && (/iP(ad|hone|od)/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const inFullscreen = () => !!document.fullscreenElement;
const inEditor = () => !!(Globals.state && Globals.state.get("editing"));
async function requestFullscreen() {
  if (isIOS) return;
  try {
    await document.documentElement.requestFullscreen?.();
  } catch {
  }
}
async function dropFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {
  }
}
function setEditing(on) {
  if (Globals.state) Globals.state.update({ editing: on });
}
function tap() {
  if (inFullscreen()) return;
  setEditing(false);
  requestFullscreen();
}
async function hold() {
  await dropFullscreen();
  setEditing(true);
}
function installFullscreenExit() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fsx-btn";
  btn.setAttribute("aria-label", "Full screen. Hold to return to the editor.");
  btn.title = "Tap for full screen • hold to edit";
  const expand = document.createElement("span");
  expand.className = "fsx-icon fsx-icon-expand";
  expand.appendChild(svgFrom(EXPAND_ICON));
  const compress = document.createElement("span");
  compress.className = "fsx-icon fsx-icon-compress";
  compress.appendChild(svgFrom(COMPRESS_ICON));
  btn.append(svgFrom(RING), expand, compress);
  let timer2 = null;
  let fired = false;
  function stopHold() {
    if (timer2 != null) clearTimeout(timer2);
    timer2 = null;
    btn.classList.remove("fsx-holding");
  }
  btn.addEventListener("pointerdown", (event) => {
    if (event.button > 0) return;
    fired = false;
    if (inEditor()) return;
    btn.classList.add("fsx-holding");
    try {
      btn.setPointerCapture(event.pointerId);
    } catch {
    }
    timer2 = setTimeout(() => {
      fired = true;
      stopHold();
      hold();
    }, HOLD_MS);
  });
  btn.addEventListener("pointerup", () => {
    const wasHold = fired;
    stopHold();
    if (!wasHold) tap();
  });
  btn.addEventListener("pointercancel", stopHold);
  btn.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      tap();
    }
  });
  btn.classList.toggle("fsx-active", inFullscreen());
  if (isIOS) document.body.classList.add("fsx-ios");
  document.addEventListener("fullscreenchange", () => {
    btn.classList.toggle("fsx-active", inFullscreen());
    if (!inFullscreen()) setEditing(true);
  });
  document.body.appendChild(btn);
}
const CONTRIBUTE_DOCS_URL = `https://github.com/${GALLERY.owner}/${GALLERY.repo}/tree/${GALLERY.branch}/${GALLERY.repoDir}`;
let mount = null;
let allItems = [];
let activeTab = "official";
let activeTag = null;
function designURL(name) {
  return `${"/OS-DPI/"}#${name}`;
}
function openDesign(name) {
  openTab(designURL(name));
}
async function newDesign(event) {
  event.preventDefault();
  const tab2 = claimTab();
  try {
    showInTab(tab2, designURL(await db.uniqueName("new")));
  } catch (e2) {
    if (tab2 && !tab2.closed) tab2.close();
    throw e2;
  }
}
async function importDesign(event) {
  event.preventDefault();
  const local = new DB();
  try {
    const file = await n({
      mimeTypes: ["application/octet-stream"],
      extensions: [".osdpi", ".zip"],
      description: "OS-DPI designs",
      id: "os-dpi"
    });
    await wait(local.readDesignFromFile(file));
    openDesign(local.designName);
  } catch (e2) {
    console.log(e2);
  }
}
async function fetchIndex() {
  try {
    const res = await fetch(galleryIndexURL(), { cache: "no-cache" });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data2 = await res.json();
    const list = Array.isArray(data2) ? data2 : data2.examples || [];
    return list.filter((it) => it && it.slug);
  } catch (e2) {
    console.error("gallery: failed to load index", e2);
    return null;
  }
}
function tagChip(t2) {
  const active = t2 === activeTag;
  return html`<button
    class=${"gallery-tag" + (active ? " gallery-tag--active" : "")}
    @click=${() => {
    activeTag = active ? null : t2;
    rerender();
  }}
  >
    #${t2}
  </button>`;
}
function card(item) {
  return html`<article class="gallery-card">
    <h2 class="gallery-card-title">${item.title}</h2>
    ${item.description ? html`<p class="gallery-card-desc">${item.description}</p>` : null}
    ${item.tags && item.tags.length ? html`<div class="gallery-tags">${item.tags.map(tagChip)}</div>` : null}
    ${item.author ? html`<p class="gallery-card-author">by ${item.author}</p>` : null}
    <div class="gallery-card-actions">
      <a
        class="gallery-btn gallery-btn--primary"
        href=${loadURL(item, false)}
        target="_blank"
        rel="noopener"
      >
        Try it
      </a>
      <a
        class="gallery-btn gallery-btn--ghost"
        href=${loadURL(item, true)}
        target="_blank"
        rel="noopener"
        title="Open in the editor"
      >
        Open in editor
      </a>
    </div>
  </article>`;
}
function contributeCard() {
  return html`<article class="gallery-card gallery-card--cta">
    <span class="gallery-cta-title">Sharing is optional</span>
    <span class="gallery-cta-sub">
      If you build a simulation you think others would find useful, File &rarr;
      Share to Gallery will offer it here. Nothing you make is shared unless you
      choose to.
    </span>
    <button class="gallery-link" @click=${openHowSharingWorks}>
      How sharing works
    </button>
  </article>`;
}
const HOW_DIALOG_ID = "GalleryHowDialog";
function openHowSharingWorks() {
  const dialog = (
    /** @type {HTMLDialogElement} */
    document.getElementById(HOW_DIALOG_ID)
  );
  if (!dialog) return;
  render(
    dialog,
    html`<div class="share-form share-instructions">
      <h1>How sharing works</h1>
      <p class="share-hint">
        The gallery is a folder in the project's GitHub repository, so adding a
        simulation means proposing a change to it. There is no server behind
        this, and nothing is uploaded in the background.
      </p>
      <ol>
        <li>
          <strong>You choose to share.</strong> In a simulation, use File &rarr;
          Share to Gallery and describe it. Your work stays in your browser
          until you do this.
        </li>
        <li>
          <strong>Two files are prepared.</strong> Your simulation as
          <code>board.osdpi</code>, and a <code>meta.json</code> holding the
          title, description, tags, and your name. Both are needed, and both
          keep those names.
        </li>
        <li>
          <strong>GitHub opens.</strong> Drop the two files in and propose the
          change. This creates a pull request, which is a request to add your
          folder, not a change to the site yet. A free GitHub account is
          required.
        </li>
        <li>
          <strong>Someone reviews it.</strong> A maintainer looks at the
          simulation and merges it. Your entry then appears under Community,
          with your name, the next time the site is built.
        </li>
      </ol>
      <div class="share-actions">
        <a
          class="share-btn"
          href=${CONTRIBUTE_DOCS_URL}
          target="_blank"
          rel="noopener"
        >
          Browse the gallery folder
        </a>
        <button
          type="button"
          class="share-btn share-btn--primary"
          @click=${() => dialog.close()}
        >
          Close
        </button>
      </div>
    </div>`
  );
  dialog.showModal();
}
function header() {
  return html`<header class="gallery-header">
    <div class="gallery-header-bar"></div>
    <div class="gallery-header-text">
      <h1 class="gallery-title">Example gallery</h1>
      <p class="gallery-subtitle">
        Browse AAC simulations and open one in OS-DPI with a click.
      </p>
    </div>
  </header>`;
}
function ownWork() {
  return html`<div class="gallery-own">
    <button class="gallery-btn gallery-btn--primary" @click=${newDesign}>
      New simulation
    </button>
    <button class="gallery-btn" @click=${importDesign}>Import a file</button>
  </div>`;
}
function tab(id, label, count) {
  const active = activeTab === id;
  return html`<button
    role="tab"
    aria-selected=${active}
    class=${"gallery-tab" + (active ? " gallery-tab--active" : "")}
    @click=${() => {
    activeTab = id;
    activeTag = null;
    rerender();
  }}
  >
    ${label} <span class="gallery-tab-count">${count}</span>
  </button>`;
}
function tagBar(items) {
  const tags = [...new Set(items.flatMap((it) => it.tags || []))].sort();
  if (!tags.length) return null;
  return html`<div class="gallery-tagbar">
    <button
      class=${"gallery-tag" + (activeTag === null ? " gallery-tag--active" : "")}
      @click=${() => {
    activeTag = null;
    rerender();
  }}
    >
      All
    </button>
    ${tags.map(tagChip)}
  </div>`;
}
function view() {
  const official = allItems.filter((it) => it.official);
  const community = allItems.filter((it) => !it.official);
  const isCommunity = activeTab === "community";
  const tabItems = isCommunity ? community : official;
  const list = activeTag ? tabItems.filter((it) => (it.tags || []).includes(activeTag)) : tabItems;
  return html`<div class="gallery">
    ${header()} ${ownWork()}
    <div class="gallery-tabbar">
      <div class="gallery-tabs" role="tablist">
        ${tab("official", "OS-DPI", official.length)}
        ${tab("community", "Community", community.length)}
      </div>
    </div>
    ${tagBar(tabItems)}
    ${isCommunity && !community.length ? html`<p class="gallery-note">
            Nothing shared here yet, so this tab is empty for now.
          </p>` : null}
    <div class="gallery-grid">
      ${list.map(card)} ${isCommunity ? contributeCard() : null}
    </div>
    <dialog id=${HOW_DIALOG_ID} class="share-dialog"></dialog>
  </div>`;
}
function errorView() {
  return html`<div class="gallery">
    ${header()}
    <div class="gallery-empty">
      <p>Could not load the gallery.</p>
      <button
        class="gallery-btn gallery-btn--primary"
        @click=${() => showGallery()}
      >
        Retry
      </button>
    </div>
  </div>`;
}
function rerender() {
  if (mount) render(mount, view());
}
async function showGallery(id = "gallery") {
  mount = document.getElementById(id);
  if (!mount) return;
  document.body.classList.add("gallery-mode");
  const items = await fetchIndex();
  if (items === null) {
    render(mount, errorView());
    return;
  }
  allItems = items;
  activeTab = items.some((it) => it.official) ? "official" : "community";
  rerender();
}
const pageLoaded = new Promise((resolve2) => {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    resolve2(true);
  });
});
async function start() {
  let editing = true;
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const fetch2 = params.get("fetch");
    console.log({ fetch: fetch2 });
    if (fetch2) {
      await wait(
        db.readDesignFromURL(fetch2, window.location.hash.slice(1))
      );
      editing = params.get("edit") !== null;
      window.history.replaceState(
        {},
        document.title,
        window.location.origin + window.location.pathname + "#" + db.designName
      );
    }
  }
  const hash = window.location.hash.slice(1);
  if (!hash || hash === "gallery") {
    if (Globals.methods) Globals.methods.stop();
    await pageLoaded;
    await showGallery();
    return;
  }
  document.body.classList.remove("gallery-mode");
  const name = hash;
  db.setDesignName(name);
  const dataArray = await db.read("content", []);
  const noteArray = await db.read("notes", []);
  await pageLoaded;
  Globals.data = new Data(dataArray);
  Globals.data.setNoteRows(noteArray);
  const layout = await Layout.load(Layout);
  Globals.layout = layout;
  Globals.state = new State$1(`UIState`);
  Globals.actions = await Actions.load(Actions);
  Globals.content = /** @type {Content} */
  Content.fromObject({
    className: "Content",
    props: {},
    children: []
  });
  Globals.cues = await CueList.load(CueList);
  Globals.patterns = await PatternList.load(PatternList);
  Globals.methods = await MethodChooser.load(MethodChooser);
  Globals.restart = async () => {
    Globals.methods.stop();
    start();
  };
  Globals.error = new Messages();
  function debounce2(f2) {
    let timeout = null;
    return () => {
      if (timeout) window.cancelAnimationFrame(timeout);
      timeout = window.requestAnimationFrame(f2);
    };
  }
  Globals.state.define("editing", editing);
  Globals.designer = /** @type {Designer} */
  Designer.fromObject({
    className: "Designer",
    props: { tabEdge: "top", stateName: "designerTab" },
    children: [
      layout,
      Globals.actions,
      Globals.content,
      Globals.cues,
      Globals.patterns,
      Globals.methods
    ]
  });
  const toolbar = ToolBar.create("ToolBar", null);
  toolbar.init();
  const monitor = Monitor.create("Monitor", null);
  monitor.init();
  function renderUI() {
    if (location.host.startsWith("localhost")) {
      const startTime = performance.now();
      const timer2 = document.getElementById("timer");
      if (timer2) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            timer2.innerText = `${(performance.now() - startTime).toFixed(0)}ms`;
          });
        });
      }
    }
    const editing2 = Globals.state.get("editing");
    document.body.classList.toggle("designing", editing2);
    safeRender("cues", Globals.cues);
    safeRender("UI", Globals.layout.children[0]);
    if (editing2) {
      safeRender("toolbar", toolbar);
      safeRender("tabs", Globals.designer);
      safeRender("monitor", monitor);
      safeRender("errors", Globals.error);
    }
    postRender();
    Globals.methods.refresh();
    accessed.clear();
    Globals.state.clearUpdated();
    workerCheckForUpdate();
    document.dispatchEvent(new Event("rendercomplete"));
  }
  Globals.state.observe(debounce2(renderUI));
  callAfterRender(() => Globals.designer.restoreFocus());
  renderUI();
}
const channel = (
  /** @type {BroadcastChannel} */
  /** @type {any} */
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("os-dpi") : { onmessage: null, postMessage() {
  }, close() {
  } }
);
channel.onmessage = (event) => {
  const message = (
    /** @type {UpdateNotification} */
    event.data
  );
  if (db.designName == message.name) {
    if (message.action == "update") {
      start();
    } else if (message.action == "rename" && message.newName) {
      window.location.hash = message.newName;
    } else if (message.action == "unload") {
      window.close();
      if (!window.closed) {
        window.location.hash = "new";
      }
    }
  }
};
db.addUpdateListener((message) => {
  channel.postMessage(message);
});
window.addEventListener("hashchange", () => {
  sessionStorage.clear();
  start();
});
window.addEventListener("resize", () => {
  if (!Globals.state) return;
  Globals.state.update();
});
installIOSMediaUnlock();
installFullscreenExit();
start();
//# sourceMappingURL=index.js.map
