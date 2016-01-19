(function (window, undefined) {
    var readyList, rootjQuery, core_strundefined = typeof undefined, document = window.document, location = window.location, _jQuery = window.jQuery, _$ = window.$, class2type = {}, core_deletedIds = [], core_version = '1.9.1', core_concat = core_deletedIds.concat, core_push = core_deletedIds.push, core_slice = core_deletedIds.slice, core_indexOf = core_deletedIds.indexOf, core_toString = class2type.toString, core_hasOwn = class2type.hasOwnProperty, core_trim = core_version.trim, jQuery = function (selector, context) {
            return new jQuery.fn.init(selector, context, rootjQuery);
        }, core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, core_rnotwhite = /\S+/g, rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        }, completed = function (event) {
            if (document.addEventListener || event.type === 'load' || document.readyState === 'complete') {
                detach();
                jQuery.ready();
            }
        }, detach = function () {
            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', completed, false);
                window.removeEventListener('load', completed, false);
            } else {
                document.detachEvent('onreadystatechange', completed);
                window.detachEvent('onload', completed);
            }
        };
    jQuery.fn = jQuery.prototype = {
        jquery: core_version,
        constructor: jQuery,
        init: function (selector, context, rootjQuery) {
            var match, elem;
            if (!selector) {
                return this;
            }
            if (typeof selector === 'string') {
                if (selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
                    match = [
                        null,
                        selector,
                        null
                    ];
                } else {
                    match = rquickExpr.exec(selector);
                }
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        context = context instanceof jQuery ? context[0] : context;
                        jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            for (match in context) {
                                if (jQuery.isFunction(this[match])) {
                                    this[match](context[match]);
                                } else {
                                    this.attr(match, context[match]);
                                }
                            }
                        }
                        return this;
                    } else {
                        elem = document.getElementById(match[2]);
                        if (elem && elem.parentNode) {
                            if (elem.id !== match[2]) {
                                return rootjQuery.find(selector);
                            }
                            this.length = 1;
                            this[0] = elem;
                        }
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }
                } else if (!context || context.jquery) {
                    return (context || rootjQuery).find(selector);
                } else {
                    return this.constructor(context).find(selector);
                }
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) {
                return rootjQuery.ready(selector);
            }
            if (selector.selector !== undefined) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
            return jQuery.makeArray(selector, this);
        },
        selector: '',
        length: 0,
        size: function () {
            return this.length;
        },
        toArray: function () {
            return core_slice.call(this);
        },
        get: function (num) {
            return num == null ? this.toArray() : num < 0 ? this[this.length + num] : this[num];
        },
        pushStack: function (elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            ret.context = this.context;
            return ret;
        },
        each: function (callback, args) {
            return jQuery.each(this, callback, args);
        },
        ready: function (fn) {
            jQuery.ready.promise().done(fn);
            return this;
        },
        slice: function () {
            return this.pushStack(core_slice.apply(this, arguments));
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        eq: function (i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        end: function () {
            return this.prevObject || this.constructor(null);
        },
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.extend = jQuery.fn.extend = function () {
        var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if (typeof target !== 'object' && !jQuery.isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    jQuery.extend({
        noConflict: function (deep) {
            if (window.$ === jQuery) {
                window.$ = _$;
            }
            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }
            return jQuery;
        },
        isReady: false,
        readyWait: 1,
        holdReady: function (hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        },
        ready: function (wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }
            if (!document.body) {
                return setTimeout(jQuery.ready);
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }
            readyList.resolveWith(document, [jQuery]);
            if (jQuery.fn.trigger) {
                jQuery(document).trigger('ready').off('ready');
            }
        },
        isFunction: function (obj) {
            return jQuery.type(obj) === 'function';
        },
        isArray: Array.isArray || function (obj) {
            return jQuery.type(obj) === 'array';
        },
        isWindow: function (obj) {
            return obj != null && obj == obj.window;
        },
        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        type: function (obj) {
            if (obj == null) {
                return String(obj);
            }
            return typeof obj === 'object' || typeof obj === 'function' ? class2type[core_toString.call(obj)] || 'object' : typeof obj;
        },
        isPlainObject: function (obj) {
            if (!obj || jQuery.type(obj) !== 'object' || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }
            try {
                if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            var key;
            for (key in obj) {
            }
            return key === undefined || core_hasOwn.call(obj, key);
        },
        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        error: function (msg) {
            throw new Error(msg);
        },
        parseHTML: function (data, context, keepScripts) {
            if (!data || typeof data !== 'string') {
                return null;
            }
            if (typeof context === 'boolean') {
                keepScripts = context;
                context = false;
            }
            context = context || document;
            var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
            if (parsed) {
                return [context.createElement(parsed[1])];
            }
            parsed = jQuery.buildFragment([data], context, scripts);
            if (scripts) {
                jQuery(scripts).remove();
            }
            return jQuery.merge([], parsed.childNodes);
        },
        parseJSON: function (data) {
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }
            if (data === null) {
                return data;
            }
            if (typeof data === 'string') {
                data = jQuery.trim(data);
                if (data) {
                    if (rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) {
                        return new Function('return ' + data)();
                    }
                }
            }
            jQuery.error('Invalid JSON: ' + data);
        },
        parseXML: function (data) {
            var xml, tmp;
            if (!data || typeof data !== 'string') {
                return null;
            }
            try {
                if (window.DOMParser) {
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, 'text/xml');
                } else {
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = 'false';
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length) {
                jQuery.error('Invalid XML: ' + data);
            }
            return xml;
        },
        noop: function () {
        },
        globalEval: function (data) {
            if (data && jQuery.trim(data)) {
                (window.execScript || function (data) {
                    window['eval'].call(window, data);
                })(data);
            }
        },
        camelCase: function (string) {
            return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
        },
        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        each: function (obj, callback, args) {
            var value, i = 0, length = obj.length, isArray = isArraylike(obj);
            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                }
            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },
        trim: core_trim && !core_trim.call('\uFEFF\xA0') ? function (text) {
            return text == null ? '' : core_trim.call(text);
        } : function (text) {
            return text == null ? '' : (text + '').replace(rtrim, '');
        },
        makeArray: function (arr, results) {
            var ret = results || [];
            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr);
                } else {
                    core_push.call(ret, arr);
                }
            }
            return ret;
        },
        inArray: function (elem, arr, i) {
            var len;
            if (arr) {
                if (core_indexOf) {
                    return core_indexOf.call(arr, elem, i);
                }
                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
                for (; i < len; i++) {
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }
            return -1;
        },
        merge: function (first, second) {
            var l = second.length, i = first.length, j = 0;
            if (typeof l === 'number') {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        },
        grep: function (elems, callback, inv) {
            var retVal, ret = [], i = 0, length = elems.length;
            inv = !!inv;
            for (; i < length; i++) {
                retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
            }
            return ret;
        },
        map: function (elems, callback, arg) {
            var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }
            }
            return core_concat.apply([], ret);
        },
        guid: 1,
        proxy: function (fn, context) {
            var args, proxy, tmp;
            if (typeof context === 'string') {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }
            args = core_slice.call(arguments, 2);
            proxy = function () {
                return fn.apply(context || this, args.concat(core_slice.call(arguments)));
            };
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            return proxy;
        },
        access: function (elems, fn, key, value, chainable, emptyGet, raw) {
            var i = 0, length = elems.length, bulk = key == null;
            if (jQuery.type(key) === 'object') {
                chainable = true;
                for (i in key) {
                    jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
                }
            } else if (value !== undefined) {
                chainable = true;
                if (!jQuery.isFunction(value)) {
                    raw = true;
                }
                if (bulk) {
                    if (raw) {
                        fn.call(elems, value);
                        fn = null;
                    } else {
                        bulk = fn;
                        fn = function (elem, key, value) {
                            return bulk.call(jQuery(elem), value);
                        };
                    }
                }
                if (fn) {
                    for (; i < length; i++) {
                        fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                    }
                }
            }
            return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
        },
        now: function () {
            return new Date().getTime();
        }
    });
    jQuery.ready.promise = function (obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();
            if (document.readyState === 'complete') {
                setTimeout(jQuery.ready);
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', completed, false);
                window.addEventListener('load', completed, false);
            } else {
                document.attachEvent('onreadystatechange', completed);
                window.attachEvent('onload', completed);
                var top = false;
                try {
                    top = window.frameElement == null && document.documentElement;
                } catch (e) {
                }
                if (top && top.doScroll) {
                    (function doScrollCheck() {
                        if (!jQuery.isReady) {
                            try {
                                top.doScroll('left');
                            } catch (e) {
                                return setTimeout(doScrollCheck, 50);
                            }
                            detach();
                            jQuery.ready();
                        }
                    }());
                }
            }
        }
        return readyList.promise(obj);
    };
    jQuery.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
    });
    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        if (jQuery.isWindow(obj)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }
        return type === 'array' || type !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj);
    }
    rootjQuery = jQuery(document);
    var optionsCache = {};
    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.match(core_rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
    }
    jQuery.Callbacks = function (options) {
        options = typeof options === 'string' ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, firingLength, firingIndex, firingStart, list = [], stack = !options.once && [], fire = function (data) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for (; list && firingIndex < firingLength; firingIndex++) {
                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        memory = false;
                        break;
                    }
                }
                firing = false;
                if (list) {
                    if (stack) {
                        if (stack.length) {
                            fire(stack.shift());
                        }
                    } else if (memory) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            }, self = {
                add: function () {
                    if (list) {
                        var start = list.length;
                        (function add(args) {
                            jQuery.each(args, function (_, arg) {
                                var type = jQuery.type(arg);
                                if (type === 'function') {
                                    if (!options.unique || !self.has(arg)) {
                                        list.push(arg);
                                    }
                                } else if (arg && arg.length && type !== 'string') {
                                    add(arg);
                                }
                            });
                        }(arguments));
                        if (firing) {
                            firingLength = list.length;
                        } else if (memory) {
                            firingStart = start;
                            fire(memory);
                        }
                    }
                    return this;
                },
                remove: function () {
                    if (list) {
                        jQuery.each(arguments, function (_, arg) {
                            var index;
                            while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1);
                                if (firing) {
                                    if (index <= firingLength) {
                                        firingLength--;
                                    }
                                    if (index <= firingIndex) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                has: function (fn) {
                    return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
                },
                empty: function () {
                    list = [];
                    return this;
                },
                disable: function () {
                    list = stack = memory = undefined;
                    return this;
                },
                disabled: function () {
                    return !list;
                },
                lock: function () {
                    stack = undefined;
                    if (!memory) {
                        self.disable();
                    }
                    return this;
                },
                locked: function () {
                    return !stack;
                },
                fireWith: function (context, args) {
                    args = args || [];
                    args = [
                        context,
                        args.slice ? args.slice() : args
                    ];
                    if (list && (!fired || stack)) {
                        if (firing) {
                            stack.push(args);
                        } else {
                            fire(args);
                        }
                    }
                    return this;
                },
                fire: function () {
                    self.fireWith(this, arguments);
                    return this;
                },
                fired: function () {
                    return !!fired;
                }
            };
        return self;
    };
    jQuery.extend({
        Deferred: function (func) {
            var tuples = [
                    [
                        'resolve',
                        'done',
                        jQuery.Callbacks('once memory'),
                        'resolved'
                    ],
                    [
                        'reject',
                        'fail',
                        jQuery.Callbacks('once memory'),
                        'rejected'
                    ],
                    [
                        'notify',
                        'progress',
                        jQuery.Callbacks('memory')
                    ]
                ], state = 'pending', promise = {
                    state: function () {
                        return state;
                    },
                    always: function () {
                        deferred.done(arguments).fail(arguments);
                        return this;
                    },
                    then: function () {
                        var fns = arguments;
                        return jQuery.Deferred(function (newDefer) {
                            jQuery.each(tuples, function (i, tuple) {
                                var action = tuple[0], fn = jQuery.isFunction(fns[i]) && fns[i];
                                deferred[tuple[1]](function () {
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {
                                        returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                                    } else {
                                        newDefer[action + 'With'](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    },
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                    }
                }, deferred = {};
            promise.pipe = promise.then;
            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                promise[tuple[1]] = list.add;
                if (stateString) {
                    list.add(function () {
                        state = stateString;
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }
                deferred[tuple[0]] = function () {
                    deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + 'With'] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
                func.call(deferred, deferred);
            }
            return deferred;
        },
        when: function (subordinate) {
            var i = 0, resolveValues = core_slice.call(arguments), length = resolveValues.length, remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = remaining === 1 ? subordinate : jQuery.Deferred(), updateFunc = function (i, contexts, values) {
                    return function (value) {
                        contexts[i] = this;
                        values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;
                        if (values === progressValues) {
                            deferred.notifyWith(contexts, values);
                        } else if (!--remaining) {
                            deferred.resolveWith(contexts, values);
                        }
                    };
                }, progressValues, progressContexts, resolveContexts;
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }
            return deferred.promise();
        }
    });
    jQuery.support = function () {
        var support, all, a, input, select, fragment, opt, eventName, isSupported, i, div = document.createElement('div');
        div.setAttribute('className', 't');
        div.innerHTML = '  <link/><table></table><a href=\'/a\'>a</a><input type=\'checkbox\'/>';
        all = div.getElementsByTagName('*');
        a = div.getElementsByTagName('a')[0];
        if (!all || !a || !all.length) {
            return {};
        }
        select = document.createElement('select');
        opt = select.appendChild(document.createElement('option'));
        input = div.getElementsByTagName('input')[0];
        a.style.cssText = 'top:1px;float:left;opacity:.5';
        support = {
            getSetAttribute: div.className !== 't',
            leadingWhitespace: div.firstChild.nodeType === 3,
            tbody: !div.getElementsByTagName('tbody').length,
            htmlSerialize: !!div.getElementsByTagName('link').length,
            style: /top/.test(a.getAttribute('style')),
            hrefNormalized: a.getAttribute('href') === '/a',
            opacity: /^0.5/.test(a.style.opacity),
            cssFloat: !!a.style.cssFloat,
            checkOn: !!input.value,
            optSelected: opt.selected,
            enctype: !!document.createElement('form').enctype,
            html5Clone: document.createElement('nav').cloneNode(true).outerHTML !== '<:nav></:nav>',
            boxModel: document.compatMode === 'CSS1Compat',
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true,
            boxSizingReliable: true,
            pixelPosition: false
        };
        input.checked = true;
        support.noCloneChecked = input.cloneNode(true).checked;
        select.disabled = true;
        support.optDisabled = !opt.disabled;
        try {
            delete div.test;
        } catch (e) {
            support.deleteExpando = false;
        }
        input = document.createElement('input');
        input.setAttribute('value', '');
        support.input = input.getAttribute('value') === '';
        input.value = 't';
        input.setAttribute('type', 'radio');
        support.radioValue = input.value === 't';
        input.setAttribute('checked', 't');
        input.setAttribute('name', 't');
        fragment = document.createDocumentFragment();
        fragment.appendChild(input);
        support.appendChecked = input.checked;
        support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
        if (div.attachEvent) {
            div.attachEvent('onclick', function () {
                support.noCloneEvent = false;
            });
            div.cloneNode(true).click();
        }
        for (i in {
                submit: true,
                change: true,
                focusin: true
            }) {
            div.setAttribute(eventName = 'on' + i, 't');
            support[i + 'Bubbles'] = eventName in window || div.attributes[eventName].expando === false;
        }
        div.style.backgroundClip = 'content-box';
        div.cloneNode(true).style.backgroundClip = '';
        support.clearCloneStyle = div.style.backgroundClip === 'content-box';
        jQuery(function () {
            var container, marginDiv, tds, divReset = 'padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;', body = document.getElementsByTagName('body')[0];
            if (!body) {
                return;
            }
            container = document.createElement('div');
            container.style.cssText = 'border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px';
            body.appendChild(container).appendChild(div);
            div.innerHTML = '<table><tr><td></td><td>t</td></tr></table>';
            tds = div.getElementsByTagName('td');
            tds[0].style.cssText = 'padding:0;margin:0;border:0;display:none';
            isSupported = tds[0].offsetHeight === 0;
            tds[0].style.display = '';
            tds[1].style.display = 'none';
            support.reliableHiddenOffsets = isSupported && tds[0].offsetHeight === 0;
            div.innerHTML = '';
            div.style.cssText = 'box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;';
            support.boxSizing = div.offsetWidth === 4;
            support.doesNotIncludeMarginInBodyOffset = body.offsetTop !== 1;
            if (window.getComputedStyle) {
                support.pixelPosition = (window.getComputedStyle(div, null) || {}).top !== '1%';
                support.boxSizingReliable = (window.getComputedStyle(div, null) || { width: '4px' }).width === '4px';
                marginDiv = div.appendChild(document.createElement('div'));
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = '0';
                div.style.width = '1px';
                support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight);
            }
            if (typeof div.style.zoom !== core_strundefined) {
                div.innerHTML = '';
                div.style.cssText = divReset + 'width:1px;padding:1px;display:inline;zoom:1';
                support.inlineBlockNeedsLayout = div.offsetWidth === 3;
                div.style.display = 'block';
                div.innerHTML = '<div></div>';
                div.firstChild.style.width = '5px';
                support.shrinkWrapBlocks = div.offsetWidth !== 3;
                if (support.inlineBlockNeedsLayout) {
                    body.style.zoom = 1;
                }
            }
            body.removeChild(container);
            container = div = tds = marginDiv = null;
        });
        all = select = fragment = opt = a = input = null;
        return support;
    }();
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;
    function internalData(elem, name, data, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }
        var thisCache, ret, internalKey = jQuery.expando, getByName = typeof name === 'string', isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
        if ((!id || !cache[id] || !pvt && !cache[id].data) && getByName && data === undefined) {
            return;
        }
        if (!id) {
            if (isNode) {
                elem[internalKey] = id = core_deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }
        if (!cache[id]) {
            cache[id] = {};
            if (!isNode) {
                cache[id].toJSON = jQuery.noop;
            }
        }
        if (typeof name === 'object' || typeof name === 'function') {
            if (pvt) {
                cache[id] = jQuery.extend(cache[id], name);
            } else {
                cache[id].data = jQuery.extend(cache[id].data, name);
            }
        }
        thisCache = cache[id];
        if (!pvt) {
            if (!thisCache.data) {
                thisCache.data = {};
            }
            thisCache = thisCache.data;
        }
        if (data !== undefined) {
            thisCache[jQuery.camelCase(name)] = data;
        }
        if (getByName) {
            ret = thisCache[name];
            if (ret == null) {
                ret = thisCache[jQuery.camelCase(name)];
            }
        } else {
            ret = thisCache;
        }
        return ret;
    }
    function internalRemoveData(elem, name, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }
        var i, l, thisCache, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
        if (!cache[id]) {
            return;
        }
        if (name) {
            thisCache = pvt ? cache[id] : cache[id].data;
            if (thisCache) {
                if (!jQuery.isArray(name)) {
                    if (name in thisCache) {
                        name = [name];
                    } else {
                        name = jQuery.camelCase(name);
                        if (name in thisCache) {
                            name = [name];
                        } else {
                            name = name.split(' ');
                        }
                    }
                } else {
                    name = name.concat(jQuery.map(name, jQuery.camelCase));
                }
                for (i = 0, l = name.length; i < l; i++) {
                    delete thisCache[name[i]];
                }
                if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
                    return;
                }
            }
        }
        if (!pvt) {
            delete cache[id].data;
            if (!isEmptyDataObject(cache[id])) {
                return;
            }
        }
        if (isNode) {
            jQuery.cleanData([elem], true);
        } else if (jQuery.support.deleteExpando || cache != cache.window) {
            delete cache[id];
        } else {
            cache[id] = null;
        }
    }
    jQuery.extend({
        cache: {},
        expando: 'jQuery' + (core_version + Math.random()).replace(/\D/g, ''),
        noData: {
            embed: true,
            object: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
            applet: true
        },
        hasData: function (elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },
        data: function (elem, name, data) {
            return internalData(elem, name, data);
        },
        removeData: function (elem, name) {
            return internalRemoveData(elem, name);
        },
        _data: function (elem, name, data) {
            return internalData(elem, name, data, true);
        },
        _removeData: function (elem, name) {
            return internalRemoveData(elem, name, true);
        },
        acceptData: function (elem) {
            if (elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9) {
                return false;
            }
            var noData = elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()];
            return !noData || noData !== true && elem.getAttribute('classid') === noData;
        }
    });
    jQuery.fn.extend({
        data: function (key, value) {
            var attrs, name, elem = this[0], i = 0, data = null;
            if (key === undefined) {
                if (this.length) {
                    data = jQuery.data(elem);
                    if (elem.nodeType === 1 && !jQuery._data(elem, 'parsedAttrs')) {
                        attrs = elem.attributes;
                        for (; i < attrs.length; i++) {
                            name = attrs[i].name;
                            if (!name.indexOf('data-')) {
                                name = jQuery.camelCase(name.slice(5));
                                dataAttr(elem, name, data[name]);
                            }
                        }
                        jQuery._data(elem, 'parsedAttrs', true);
                    }
                }
                return data;
            }
            if (typeof key === 'object') {
                return this.each(function () {
                    jQuery.data(this, key);
                });
            }
            return jQuery.access(this, function (value) {
                if (value === undefined) {
                    return elem ? dataAttr(elem, key, jQuery.data(elem, key)) : null;
                }
                this.each(function () {
                    jQuery.data(this, key, value);
                });
            }, null, value, arguments.length > 1, null, true);
        },
        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        }
    });
    function dataAttr(elem, key, data) {
        if (data === undefined && elem.nodeType === 1) {
            var name = 'data-' + key.replace(rmultiDash, '-$1').toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === 'string') {
                try {
                    data = data === 'true' ? true : data === 'false' ? false : data === 'null' ? null : +data + '' === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                } catch (e) {
                }
                jQuery.data(elem, key, data);
            } else {
                data = undefined;
            }
        }
        return data;
    }
    function isEmptyDataObject(obj) {
        var name;
        for (name in obj) {
            if (name === 'data' && jQuery.isEmptyObject(obj[name])) {
                continue;
            }
            if (name !== 'toJSON') {
                return false;
            }
        }
        return true;
    }
    jQuery.extend({
        queue: function (elem, type, data) {
            var queue;
            if (elem) {
                type = (type || 'fx') + 'queue';
                queue = jQuery._data(elem, type);
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },
        dequeue: function (elem, type) {
            type = type || 'fx';
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function () {
                    jQuery.dequeue(elem, type);
                };
            if (fn === 'inprogress') {
                fn = queue.shift();
                startLength--;
            }
            hooks.cur = fn;
            if (fn) {
                if (type === 'fx') {
                    queue.unshift('inprogress');
                }
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },
        _queueHooks: function (elem, type) {
            var key = type + 'queueHooks';
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks('once memory').add(function () {
                    jQuery._removeData(elem, type + 'queue');
                    jQuery._removeData(elem, key);
                })
            });
        }
    });
    jQuery.fn.extend({
        queue: function (type, data) {
            var setter = 2;
            if (typeof type !== 'string') {
                data = type;
                type = 'fx';
                setter--;
            }
            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }
            return data === undefined ? this : this.each(function () {
                var queue = jQuery.queue(this, type, data);
                jQuery._queueHooks(this, type);
                if (type === 'fx' && queue[0] !== 'inprogress') {
                    jQuery.dequeue(this, type);
                }
            });
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },
        delay: function (time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || 'fx';
            return this.queue(type, function (next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function () {
                    clearTimeout(timeout);
                };
            });
        },
        clearQueue: function (type) {
            return this.queue(type || 'fx', []);
        },
        promise: function (type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function () {
                    if (!--count) {
                        defer.resolveWith(elements, [elements]);
                    }
                };
            if (typeof type !== 'string') {
                obj = type;
                type = undefined;
            }
            type = type || 'fx';
            while (i--) {
                tmp = jQuery._data(elements[i], type + 'queueHooks');
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var nodeHook, boolHook, rclass = /[\t\r\n]/g, rreturn = /\r/g, rfocusable = /^(?:input|select|textarea|button|object)$/i, rclickable = /^(?:a|area)$/i, rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i, ruseDefault = /^(?:checked|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute, getSetInput = jQuery.support.input;
    jQuery.fn.extend({
        attr: function (name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function (name) {
            return this.each(function () {
                jQuery.removeAttr(this, name);
            });
        },
        prop: function (name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function (name) {
            name = jQuery.propFix[name] || name;
            return this.each(function () {
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) {
                }
            });
        },
        addClass: function (value) {
            var classes, elem, cur, clazz, j, i = 0, len = this.length, proceed = typeof value === 'string' && value;
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || '').match(core_rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ? (' ' + elem.className + ' ').replace(rclass, ' ') : ' ');
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {
                            if (cur.indexOf(' ' + clazz + ' ') < 0) {
                                cur += clazz + ' ';
                            }
                        }
                        elem.className = jQuery.trim(cur);
                    }
                }
            }
            return this;
        },
        removeClass: function (value) {
            var classes, elem, cur, clazz, j, i = 0, len = this.length, proceed = arguments.length === 0 || typeof value === 'string' && value;
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || '').match(core_rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ? (' ' + elem.className + ' ').replace(rclass, ' ') : '');
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {
                            while (cur.indexOf(' ' + clazz + ' ') >= 0) {
                                cur = cur.replace(' ' + clazz + ' ', ' ');
                            }
                        }
                        elem.className = value ? jQuery.trim(cur) : '';
                    }
                }
            }
            return this;
        },
        toggleClass: function (value, stateVal) {
            var type = typeof value, isBool = typeof stateVal === 'boolean';
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }
            return this.each(function () {
                if (type === 'string') {
                    var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.match(core_rnotwhite) || [];
                    while (className = classNames[i++]) {
                        state = isBool ? state : !self.hasClass(className);
                        self[state ? 'addClass' : 'removeClass'](className);
                    }
                } else if (type === core_strundefined || type === 'boolean') {
                    if (this.className) {
                        jQuery._data(this, '__className__', this.className);
                    }
                    this.className = this.className || value === false ? '' : jQuery._data(this, '__className__') || '';
                }
            });
        },
        hasClass: function (selector) {
            var className = ' ' + selector + ' ', i = 0, l = this.length;
            for (; i < l; i++) {
                if (this[i].nodeType === 1 && (' ' + this[i].className + ' ').replace(rclass, ' ').indexOf(className) >= 0) {
                    return true;
                }
            }
            return false;
        },
        val: function (value) {
            var ret, hooks, isFunction, elem = this[0];
            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                    if (hooks && 'get' in hooks && (ret = hooks.get(elem, 'value')) !== undefined) {
                        return ret;
                    }
                    ret = elem.value;
                    return typeof ret === 'string' ? ret.replace(rreturn, '') : ret == null ? '' : ret;
                }
                return;
            }
            isFunction = jQuery.isFunction(value);
            return this.each(function (i) {
                var val, self = jQuery(this);
                if (this.nodeType !== 1) {
                    return;
                }
                if (isFunction) {
                    val = value.call(this, i, self.val());
                } else {
                    val = value;
                }
                if (val == null) {
                    val = '';
                } else if (typeof val === 'number') {
                    val += '';
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? '' : value + '';
                    });
                }
                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                if (!hooks || !('set' in hooks) || hooks.set(this, val, 'value') === undefined) {
                    this.value = val;
                }
            });
        }
    });
    jQuery.extend({
        valHooks: {
            option: {
                get: function (elem) {
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function (elem) {
                    var value, option, options = elem.options, index = elem.selectedIndex, one = elem.type === 'select-one' || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;
                    for (; i < max; i++) {
                        option = options[i];
                        if ((option.selected || i === index) && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute('disabled') === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, 'optgroup'))) {
                            value = jQuery(option).val();
                            if (one) {
                                return value;
                            }
                            values.push(value);
                        }
                    }
                    return values;
                },
                set: function (elem, value) {
                    var values = jQuery.makeArray(value);
                    jQuery(elem).find('option').each(function () {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    });
                    if (!values.length) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },
        attr: function (elem, name, value) {
            var hooks, notxml, ret, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            if (typeof elem.getAttribute === core_strundefined) {
                return jQuery.prop(elem, name, value);
            }
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
            }
            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                } else if (hooks && notxml && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, value + '');
                    return value;
                }
            } else if (hooks && notxml && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            } else {
                if (typeof elem.getAttribute !== core_strundefined) {
                    ret = elem.getAttribute(name);
                }
                return ret == null ? undefined : ret;
            }
        },
        removeAttr: function (elem, value) {
            var name, propName, i = 0, attrNames = value && value.match(core_rnotwhite);
            if (attrNames && elem.nodeType === 1) {
                while (name = attrNames[i++]) {
                    propName = jQuery.propFix[name] || name;
                    if (rboolean.test(name)) {
                        if (!getSetAttribute && ruseDefault.test(name)) {
                            elem[jQuery.camelCase('default-' + name)] = elem[propName] = false;
                        } else {
                            elem[propName] = false;
                        }
                    } else {
                        jQuery.attr(elem, name, '');
                    }
                    elem.removeAttribute(getSetAttribute ? name : propName);
                }
            }
        },
        attrHooks: {
            type: {
                set: function (elem, value) {
                    if (!jQuery.support.radioValue && value === 'radio' && jQuery.nodeName(elem, 'input')) {
                        var val = elem.value;
                        elem.setAttribute('type', value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },
        propFix: {
            tabindex: 'tabIndex',
            readonly: 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            maxlength: 'maxLength',
            cellspacing: 'cellSpacing',
            cellpadding: 'cellPadding',
            rowspan: 'rowSpan',
            colspan: 'colSpan',
            usemap: 'useMap',
            frameborder: 'frameBorder',
            contenteditable: 'contentEditable'
        },
        prop: function (elem, name, value) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }
            if (value !== undefined) {
                if (hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    return elem[name] = value;
                }
            } else {
                if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
                    return ret;
                } else {
                    return elem[name];
                }
            }
        },
        propHooks: {
            tabIndex: {
                get: function (elem) {
                    var attributeNode = elem.getAttributeNode('tabindex');
                    return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
                }
            }
        }
    });
    boolHook = {
        get: function (elem, name) {
            var prop = jQuery.prop(elem, name), attr = typeof prop === 'boolean' && elem.getAttribute(name), detail = typeof prop === 'boolean' ? getSetInput && getSetAttribute ? attr != null : ruseDefault.test(name) ? elem[jQuery.camelCase('default-' + name)] : !!attr : elem.getAttributeNode(name);
            return detail && detail.value !== false ? name.toLowerCase() : undefined;
        },
        set: function (elem, value, name) {
            if (value === false) {
                jQuery.removeAttr(elem, name);
            } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);
            } else {
                elem[jQuery.camelCase('default-' + name)] = elem[name] = true;
            }
            return name;
        }
    };
    if (!getSetInput || !getSetAttribute) {
        jQuery.attrHooks.value = {
            get: function (elem, name) {
                var ret = elem.getAttributeNode(name);
                return jQuery.nodeName(elem, 'input') ? elem.defaultValue : ret && ret.specified ? ret.value : undefined;
            },
            set: function (elem, value, name) {
                if (jQuery.nodeName(elem, 'input')) {
                    elem.defaultValue = value;
                } else {
                    return nodeHook && nodeHook.set(elem, value, name);
                }
            }
        };
    }
    if (!getSetAttribute) {
        nodeHook = jQuery.valHooks.button = {
            get: function (elem, name) {
                var ret = elem.getAttributeNode(name);
                return ret && (name === 'id' || name === 'name' || name === 'coords' ? ret.value !== '' : ret.specified) ? ret.value : undefined;
            },
            set: function (elem, value, name) {
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name));
                }
                ret.value = value += '';
                return name === 'value' || value === elem.getAttribute(name) ? value : undefined;
            }
        };
        jQuery.attrHooks.contenteditable = {
            get: nodeHook.get,
            set: function (elem, value, name) {
                nodeHook.set(elem, value === '' ? false : value, name);
            }
        };
        jQuery.each([
            'width',
            'height'
        ], function (i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                set: function (elem, value) {
                    if (value === '') {
                        elem.setAttribute(name, 'auto');
                        return value;
                    }
                }
            });
        });
    }
    if (!jQuery.support.hrefNormalized) {
        jQuery.each([
            'href',
            'src',
            'width',
            'height'
        ], function (i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
                get: function (elem) {
                    var ret = elem.getAttribute(name, 2);
                    return ret == null ? undefined : ret;
                }
            });
        });
        jQuery.each([
            'href',
            'src'
        ], function (i, name) {
            jQuery.propHooks[name] = {
                get: function (elem) {
                    return elem.getAttribute(name, 4);
                }
            };
        });
    }
    if (!jQuery.support.style) {
        jQuery.attrHooks.style = {
            get: function (elem) {
                return elem.style.cssText || undefined;
            },
            set: function (elem, value) {
                return elem.style.cssText = value + '';
            }
        };
    }
    if (!jQuery.support.optSelected) {
        jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
            get: function (elem) {
                var parent = elem.parentNode;
                if (parent) {
                    parent.selectedIndex;
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        });
    }
    if (!jQuery.support.enctype) {
        jQuery.propFix.enctype = 'encoding';
    }
    if (!jQuery.support.checkOn) {
        jQuery.each([
            'radio',
            'checkbox'
        ], function () {
            jQuery.valHooks[this] = {
                get: function (elem) {
                    return elem.getAttribute('value') === null ? 'on' : elem.value;
                }
            };
        });
    }
    jQuery.each([
        'radio',
        'checkbox'
    ], function () {
        jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
            set: function (elem, value) {
                if (jQuery.isArray(value)) {
                    return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
                }
            }
        });
    });
    var rformElems = /^(?:input|select|textarea)$/i, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    function returnTrue() {
        return true;
    }
    function returnFalse() {
        return false;
    }
    jQuery.event = {
        global: {},
        add: function (elem, types, handler, data, selector) {
            var tmp, events, t, handleObjIn, special, eventHandle, handleObj, handlers, type, namespaces, origType, elemData = jQuery._data(elem);
            if (!elemData) {
                return;
            }
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }
            if (!(events = elemData.events)) {
                events = elemData.events = {};
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function (e) {
                    return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
                };
                eventHandle.elem = elem;
            }
            types = (types || '').match(core_rnotwhite) || [''];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || '').split('.').sort();
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                special = jQuery.event.special[type] || {};
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join('.')
                }, handleObjIn);
                if (!(handlers = events[type])) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);
                        } else if (elem.attachEvent) {
                            elem.attachEvent('on' + type, eventHandle);
                        }
                    }
                }
                if (special.add) {
                    special.add.call(elem, handleObj);
                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }
                jQuery.event.global[type] = true;
            }
            elem = null;
        },
        remove: function (elem, types, handler, selector, mappedTypes) {
            var j, handleObj, tmp, origCount, t, events, special, handlers, type, namespaces, origType, elemData = jQuery.hasData(elem) && jQuery._data(elem);
            if (!elemData || !(events = elemData.events)) {
                return;
            }
            types = (types || '').match(core_rnotwhite) || [''];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || '').split('.').sort();
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                handlers = events[type] || [];
                tmp = tmp[2] && new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)');
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];
                    if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === '**' && handleObj.selector)) {
                        handlers.splice(j, 1);
                        if (handleObj.selector) {
                            handlers.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }
                if (origCount && !handlers.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }
                    delete events[type];
                }
            }
            if (jQuery.isEmptyObject(events)) {
                delete elemData.handle;
                jQuery._removeData(elem, 'events');
            }
        },
        trigger: function (event, data, elem, onlyHandlers) {
            var handle, ontype, cur, bubbleType, special, tmp, i, eventPath = [elem || document], type = core_hasOwn.call(event, 'type') ? event.type : event, namespaces = core_hasOwn.call(event, 'namespace') ? event.namespace.split('.') : [];
            cur = tmp = elem = elem || document;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }
            if (type.indexOf('.') >= 0) {
                namespaces = type.split('.');
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(':') < 0 && 'on' + type;
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === 'object' && event);
            event.isTrigger = true;
            event.namespace = namespaces.join('.');
            event.namespace_re = event.namespace ? new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.|)') + '(\\.|$)') : null;
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }
            data = data == null ? [event] : jQuery.makeArray(data, [event]);
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                bubbleType = special.delegateType || type;
                if (!rfocusMorph.test(bubbleType + type)) {
                    cur = cur.parentNode;
                }
                for (; cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }
                if (tmp === (elem.ownerDocument || document)) {
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
                event.type = i > 1 ? bubbleType : special.bindType || type;
                handle = (jQuery._data(cur, 'events') || {})[event.type] && jQuery._data(cur, 'handle');
                if (handle) {
                    handle.apply(cur, data);
                }
                handle = ontype && cur[ontype];
                if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
                    event.preventDefault();
                }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) && !(type === 'click' && jQuery.nodeName(elem, 'a')) && jQuery.acceptData(elem)) {
                    if (ontype && elem[type] && !jQuery.isWindow(elem)) {
                        tmp = elem[ontype];
                        if (tmp) {
                            elem[ontype] = null;
                        }
                        jQuery.event.triggered = type;
                        try {
                            elem[type]();
                        } catch (e) {
                        }
                        jQuery.event.triggered = undefined;
                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }
            return event.result;
        },
        dispatch: function (event) {
            event = jQuery.event.fix(event);
            var i, ret, handleObj, matched, j, handlerQueue = [], args = core_slice.call(arguments), handlers = (jQuery._data(this, 'events') || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
            args[0] = event;
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem;
                j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                    if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
                        event.handleObj = handleObj;
                        event.data = handleObj.data;
                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                        if (ret !== undefined) {
                            if ((event.result = ret) === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }
            return event.result;
        },
        handlers: function (event, handlers) {
            var sel, handleObj, matches, i, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && cur.nodeType && (!event.button || event.type !== 'click')) {
                for (; cur != this; cur = cur.parentNode || this) {
                    if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== 'click')) {
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];
                            sel = handleObj.selector + ' ';
                            if (matches[sel] === undefined) {
                                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [cur]).length;
                            }
                            if (matches[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({
                                elem: cur,
                                handlers: matches
                            });
                        }
                    }
                }
            }
            if (delegateCount < handlers.length) {
                handlerQueue.push({
                    elem: this,
                    handlers: handlers.slice(delegateCount)
                });
            }
            return handlerQueue;
        },
        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            if (!fixHook) {
                this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
            event = new jQuery.Event(originalEvent);
            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }
            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            event.metaKey = !!event.metaKey;
            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        props: 'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(' '),
        fixHooks: {},
        keyHooks: {
            props: 'char charCode key keyCode'.split(' '),
            filter: function (event, original) {
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }
                return event;
            }
        },
        mouseHooks: {
            props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '),
            filter: function (event, original) {
                var body, eventDoc, doc, button = original.button, fromElement = original.fromElement;
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;
                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }
                if (!event.which && button !== undefined) {
                    event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
                }
                return event;
            }
        },
        special: {
            load: { noBubble: true },
            click: {
                trigger: function () {
                    if (jQuery.nodeName(this, 'input') && this.type === 'checkbox' && this.click) {
                        this.click();
                        return false;
                    }
                }
            },
            focus: {
                trigger: function () {
                    if (this !== document.activeElement && this.focus) {
                        try {
                            this.focus();
                            return false;
                        } catch (e) {
                        }
                    }
                },
                delegateType: 'focusin'
            },
            blur: {
                trigger: function () {
                    if (this === document.activeElement && this.blur) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: 'focusout'
            },
            beforeunload: {
                postDispatch: function (event) {
                    if (event.result !== undefined) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },
        simulate: function (type, elem, event, bubble) {
            var e = jQuery.extend(new jQuery.Event(), event, {
                    type: type,
                    isSimulated: true,
                    originalEvent: {}
                });
            if (bubble) {
                jQuery.event.trigger(e, null, elem);
            } else {
                jQuery.event.dispatch.call(elem, e);
            }
            if (e.isDefaultPrevented()) {
                event.preventDefault();
            }
        }
    };
    jQuery.removeEvent = document.removeEventListener ? function (elem, type, handle) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
        }
    } : function (elem, type, handle) {
        var name = 'on' + type;
        if (elem.detachEvent) {
            if (typeof elem[name] === core_strundefined) {
                elem[name] = null;
            }
            elem.detachEvent(name, handle);
        }
    };
    jQuery.Event = function (src, props) {
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse;
        } else {
            this.type = src;
        }
        if (props) {
            jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || jQuery.now();
        this[jQuery.expando] = true;
    };
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (!e) {
                return;
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (!e) {
                return;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        }
    };
    jQuery.each({
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function (event) {
                var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
                if (!related || related !== target && !jQuery.contains(target, related)) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });
    if (!jQuery.support.submitBubbles) {
        jQuery.event.special.submit = {
            setup: function () {
                if (jQuery.nodeName(this, 'form')) {
                    return false;
                }
                jQuery.event.add(this, 'click._submit keypress._submit', function (e) {
                    var elem = e.target, form = jQuery.nodeName(elem, 'input') || jQuery.nodeName(elem, 'button') ? elem.form : undefined;
                    if (form && !jQuery._data(form, 'submitBubbles')) {
                        jQuery.event.add(form, 'submit._submit', function (event) {
                            event._submit_bubble = true;
                        });
                        jQuery._data(form, 'submitBubbles', true);
                    }
                });
            },
            postDispatch: function (event) {
                if (event._submit_bubble) {
                    delete event._submit_bubble;
                    if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate('submit', this.parentNode, event, true);
                    }
                }
            },
            teardown: function () {
                if (jQuery.nodeName(this, 'form')) {
                    return false;
                }
                jQuery.event.remove(this, '._submit');
            }
        };
    }
    if (!jQuery.support.changeBubbles) {
        jQuery.event.special.change = {
            setup: function () {
                if (rformElems.test(this.nodeName)) {
                    if (this.type === 'checkbox' || this.type === 'radio') {
                        jQuery.event.add(this, 'propertychange._change', function (event) {
                            if (event.originalEvent.propertyName === 'checked') {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add(this, 'click._change', function (event) {
                            if (this._just_changed && !event.isTrigger) {
                                this._just_changed = false;
                            }
                            jQuery.event.simulate('change', this, event, true);
                        });
                    }
                    return false;
                }
                jQuery.event.add(this, 'beforeactivate._change', function (e) {
                    var elem = e.target;
                    if (rformElems.test(elem.nodeName) && !jQuery._data(elem, 'changeBubbles')) {
                        jQuery.event.add(elem, 'change._change', function (event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                jQuery.event.simulate('change', this.parentNode, event, true);
                            }
                        });
                        jQuery._data(elem, 'changeBubbles', true);
                    }
                });
            },
            handle: function (event) {
                var elem = event.target;
                if (this !== elem || event.isSimulated || event.isTrigger || elem.type !== 'radio' && elem.type !== 'checkbox') {
                    return event.handleObj.handler.apply(this, arguments);
                }
            },
            teardown: function () {
                jQuery.event.remove(this, '._change');
                return !rformElems.test(this.nodeName);
            }
        };
    }
    if (!jQuery.support.focusinBubbles) {
        jQuery.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function (orig, fix) {
            var attaches = 0, handler = function (event) {
                    jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
                };
            jQuery.event.special[fix] = {
                setup: function () {
                    if (attaches++ === 0) {
                        document.addEventListener(orig, handler, true);
                    }
                },
                teardown: function () {
                    if (--attaches === 0) {
                        document.removeEventListener(orig, handler, true);
                    }
                }
            };
        });
    }
    jQuery.fn.extend({
        on: function (types, selector, data, fn, one) {
            var type, origFn;
            if (typeof types === 'object') {
                if (typeof selector !== 'string') {
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }
            if (data == null && fn == null) {
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === 'string') {
                    fn = data;
                    data = undefined;
                } else {
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }
            if (one === 1) {
                origFn = fn;
                fn = function (event) {
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function () {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function (types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function (types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + '.' + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
                return this;
            }
            if (typeof types === 'object') {
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === 'function') {
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function () {
                jQuery.event.remove(this, types, fn, selector);
            });
        },
        bind: function (types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
            return this.off(types, null, fn);
        },
        delegate: function (selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, '**') : this.off(types, selector || '**', fn);
        },
        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function (type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });
    (function (window, undefined) {
        var i, cachedruns, Expr, getText, isXML, compile, hasDuplicate, outermostContext, setDocument, document, docElem, documentIsXML, rbuggyQSA, rbuggyMatches, matches, contains, sortOrder, expando = 'sizzle' + -new Date(), preferredDoc = window.document, support = {}, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), strundefined = typeof undefined, MAX_NEGATIVE = 1 << 31, arr = [], pop = arr.pop, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function (elem) {
                var i = 0, len = this.length;
                for (; i < len; i++) {
                    if (this[i] === elem) {
                        return i;
                    }
                }
                return -1;
            }, whitespace = '[\\x20\\t\\r\\n\\f]', characterEncoding = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+', identifier = characterEncoding.replace('w', 'w#'), operators = '([*^$|!~]?=)', attributes = '\\[' + whitespace + '*(' + characterEncoding + ')' + whitespace + '*(?:' + operators + whitespace + '*(?:([\'"])((?:\\\\.|[^\\\\])*?)\\3|(' + identifier + ')|)|)' + whitespace + '*\\]', pseudos = ':(' + characterEncoding + ')(?:\\((([\'"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|' + attributes.replace(3, 8) + ')*)|.*)\\)|)', rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g'), rcomma = new RegExp('^' + whitespace + '*,' + whitespace + '*'), rcombinators = new RegExp('^' + whitespace + '*([\\x20\\t\\r\\n\\f>+~])' + whitespace + '*'), rpseudo = new RegExp(pseudos), ridentifier = new RegExp('^' + identifier + '$'), matchExpr = {
                ID: new RegExp('^#(' + characterEncoding + ')'),
                CLASS: new RegExp('^\\.(' + characterEncoding + ')'),
                NAME: new RegExp('^\\[name=[\'"]?(' + characterEncoding + ')[\'"]?\\]'),
                TAG: new RegExp('^(' + characterEncoding.replace('w', 'w*') + ')'),
                ATTR: new RegExp('^' + attributes),
                PSEUDO: new RegExp('^' + pseudos),
                CHILD: new RegExp('^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' + whitespace + '*(even|odd|(([+-]|)(\\d*)n|)' + whitespace + '*(?:([+-]|)' + whitespace + '*(\\d+)|))' + whitespace + '*\\)|)', 'i'),
                needsContext: new RegExp('^' + whitespace + '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' + whitespace + '*((?:-\\d)?\\d*)' + whitespace + '*\\)|)(?=[^-]|$)', 'i')
            }, rsibling = /[\x20\t\r\n\f]*[+~]/, rnative = /^[^{]+\{\s*\[native code/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rescape = /'|\\/g, rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g, funescape = function (_, escaped) {
                var high = '0x' + escaped - 65536;
                return high !== high ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
            };
        try {
            slice.call(preferredDoc.documentElement.childNodes, 0)[0].nodeType;
        } catch (e) {
            slice = function (i) {
                var elem, results = [];
                while (elem = this[i++]) {
                    results.push(elem);
                }
                return results;
            };
        }
        function isNative(fn) {
            return rnative.test(fn + '');
        }
        function createCache() {
            var cache, keys = [];
            return cache = function (key, value) {
                if (keys.push(key += ' ') > Expr.cacheLength) {
                    delete cache[keys.shift()];
                }
                return cache[key] = value;
            };
        }
        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }
        function assert(fn) {
            var div = document.createElement('div');
            try {
                return fn(div);
            } catch (e) {
                return false;
            } finally {
                div = null;
            }
        }
        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
            if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                setDocument(context);
            }
            context = context || document;
            results = results || [];
            if (!selector || typeof selector !== 'string') {
                return results;
            }
            if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                return [];
            }
            if (!documentIsXML && !seed) {
                if (match = rquickExpr.exec(selector)) {
                    if (m = match[1]) {
                        if (nodeType === 9) {
                            elem = context.getElementById(m);
                            if (elem && elem.parentNode) {
                                if (elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        }
                    } else if (match[2]) {
                        push.apply(results, slice.call(context.getElementsByTagName(selector), 0));
                        return results;
                    } else if ((m = match[3]) && support.getByClassName && context.getElementsByClassName) {
                        push.apply(results, slice.call(context.getElementsByClassName(m), 0));
                        return results;
                    }
                }
                if (support.qsa && !rbuggyQSA.test(selector)) {
                    old = true;
                    nid = expando;
                    newContext = context;
                    newSelector = nodeType === 9 && selector;
                    if (nodeType === 1 && context.nodeName.toLowerCase() !== 'object') {
                        groups = tokenize(selector);
                        if (old = context.getAttribute('id')) {
                            nid = old.replace(rescape, '\\$&');
                        } else {
                            context.setAttribute('id', nid);
                        }
                        nid = '[id=\'' + nid + '\'] ';
                        i = groups.length;
                        while (i--) {
                            groups[i] = nid + toSelector(groups[i]);
                        }
                        newContext = rsibling.test(selector) && context.parentNode || context;
                        newSelector = groups.join(',');
                    }
                    if (newSelector) {
                        try {
                            push.apply(results, slice.call(newContext.querySelectorAll(newSelector), 0));
                            return results;
                        } catch (qsaError) {
                        } finally {
                            if (!old) {
                                context.removeAttribute('id');
                            }
                        }
                    }
                }
            }
            return select(selector.replace(rtrim, '$1'), context, results, seed);
        }
        isXML = Sizzle.isXML = function (elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== 'HTML' : false;
        };
        setDocument = Sizzle.setDocument = function (node) {
            var doc = node ? node.ownerDocument || node : preferredDoc;
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }
            document = doc;
            docElem = doc.documentElement;
            documentIsXML = isXML(doc);
            support.tagNameNoComments = assert(function (div) {
                div.appendChild(doc.createComment(''));
                return !div.getElementsByTagName('*').length;
            });
            support.attributes = assert(function (div) {
                div.innerHTML = '<select></select>';
                var type = typeof div.lastChild.getAttribute('multiple');
                return type !== 'boolean' && type !== 'string';
            });
            support.getByClassName = assert(function (div) {
                div.innerHTML = '<div class=\'hidden e\'></div><div class=\'hidden\'></div>';
                if (!div.getElementsByClassName || !div.getElementsByClassName('e').length) {
                    return false;
                }
                div.lastChild.className = 'e';
                return div.getElementsByClassName('e').length === 2;
            });
            support.getByName = assert(function (div) {
                div.id = expando + 0;
                div.innerHTML = '<a name=\'' + expando + '\'></a><div name=\'' + expando + '\'></div>';
                docElem.insertBefore(div, docElem.firstChild);
                var pass = doc.getElementsByName && doc.getElementsByName(expando).length === 2 + doc.getElementsByName(expando + 0).length;
                support.getIdNotName = !doc.getElementById(expando);
                docElem.removeChild(div);
                return pass;
            });
            Expr.attrHandle = assert(function (div) {
                div.innerHTML = '<a href=\'#\'></a>';
                return div.firstChild && typeof div.firstChild.getAttribute !== strundefined && div.firstChild.getAttribute('href') === '#';
            }) ? {} : {
                href: function (elem) {
                    return elem.getAttribute('href', 2);
                },
                type: function (elem) {
                    return elem.getAttribute('type');
                }
            };
            if (support.getIdNotName) {
                Expr.find['ID'] = function (id, context) {
                    if (typeof context.getElementById !== strundefined && !documentIsXML) {
                        var m = context.getElementById(id);
                        return m && m.parentNode ? [m] : [];
                    }
                };
                Expr.filter['ID'] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        return elem.getAttribute('id') === attrId;
                    };
                };
            } else {
                Expr.find['ID'] = function (id, context) {
                    if (typeof context.getElementById !== strundefined && !documentIsXML) {
                        var m = context.getElementById(id);
                        return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode('id').value === id ? [m] : undefined : [];
                    }
                };
                Expr.filter['ID'] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode('id');
                        return node && node.value === attrId;
                    };
                };
            }
            Expr.find['TAG'] = support.tagNameNoComments ? function (tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) {
                    return context.getElementsByTagName(tag);
                }
            } : function (tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                if (tag === '*') {
                    while (elem = results[i++]) {
                        if (elem.nodeType === 1) {
                            tmp.push(elem);
                        }
                    }
                    return tmp;
                }
                return results;
            };
            Expr.find['NAME'] = support.getByName && function (tag, context) {
                if (typeof context.getElementsByName !== strundefined) {
                    return context.getElementsByName(name);
                }
            };
            Expr.find['CLASS'] = support.getByClassName && function (className, context) {
                if (typeof context.getElementsByClassName !== strundefined && !documentIsXML) {
                    return context.getElementsByClassName(className);
                }
            };
            rbuggyMatches = [];
            rbuggyQSA = [':focus'];
            if (support.qsa = isNative(doc.querySelectorAll)) {
                assert(function (div) {
                    div.innerHTML = '<select><option selected=\'\'></option></select>';
                    if (!div.querySelectorAll('[selected]').length) {
                        rbuggyQSA.push('\\[' + whitespace + '*(?:checked|disabled|ismap|multiple|readonly|selected|value)');
                    }
                    if (!div.querySelectorAll(':checked').length) {
                        rbuggyQSA.push(':checked');
                    }
                });
                assert(function (div) {
                    div.innerHTML = '<input type=\'hidden\' i=\'\'/>';
                    if (div.querySelectorAll('[i^=\'\']').length) {
                        rbuggyQSA.push('[*^$]=' + whitespace + '*(?:""|\'\')');
                    }
                    if (!div.querySelectorAll(':enabled').length) {
                        rbuggyQSA.push(':enabled', ':disabled');
                    }
                    div.querySelectorAll('*,:x');
                    rbuggyQSA.push(',.*:');
                });
            }
            if (support.matchesSelector = isNative(matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
                assert(function (div) {
                    support.disconnectedMatch = matches.call(div, 'div');
                    matches.call(div, '[s!=\'\']:x');
                    rbuggyMatches.push('!=', pseudos);
                });
            }
            rbuggyQSA = new RegExp(rbuggyQSA.join('|'));
            rbuggyMatches = new RegExp(rbuggyMatches.join('|'));
            contains = isNative(docElem.contains) || docElem.compareDocumentPosition ? function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            } : function (a, b) {
                if (b) {
                    while (b = b.parentNode) {
                        if (b === a) {
                            return true;
                        }
                    }
                }
                return false;
            };
            sortOrder = docElem.compareDocumentPosition ? function (a, b) {
                var compare;
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }
                if (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b)) {
                    if (compare & 1 || a.parentNode && a.parentNode.nodeType === 11) {
                        if (a === doc || contains(preferredDoc, a)) {
                            return -1;
                        }
                        if (b === doc || contains(preferredDoc, b)) {
                            return 1;
                        }
                        return 0;
                    }
                    return compare & 4 ? -1 : 1;
                }
                return a.compareDocumentPosition ? -1 : 1;
            } : function (a, b) {
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                } else if (!aup || !bup) {
                    return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : 0;
                } else if (aup === bup) {
                    return siblingCheck(a, b);
                }
                cur = a;
                while (cur = cur.parentNode) {
                    ap.unshift(cur);
                }
                cur = b;
                while (cur = cur.parentNode) {
                    bp.unshift(cur);
                }
                while (ap[i] === bp[i]) {
                    i++;
                }
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            };
            hasDuplicate = false;
            [
                0,
                0
            ].sort(sortOrder);
            support.detectDuplicates = hasDuplicate;
            return document;
        };
        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };
        Sizzle.matchesSelector = function (elem, expr) {
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            expr = expr.replace(rattributeQuotes, '=\'$1\']');
            if (support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr)) {
                try {
                    var ret = matches.call(elem, expr);
                    if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) {
                }
            }
            return Sizzle(expr, document, null, [elem]).length > 0;
        };
        Sizzle.contains = function (context, elem) {
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };
        Sizzle.attr = function (elem, name) {
            var val;
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            if (!documentIsXML) {
                name = name.toLowerCase();
            }
            if (val = Expr.attrHandle[name]) {
                return val(elem);
            }
            if (documentIsXML || support.attributes) {
                return elem.getAttribute(name);
            }
            return ((val = elem.getAttributeNode(name)) || elem.getAttribute(name)) && elem[name] === true ? name : val && val.specified ? val.value : null;
        };
        Sizzle.error = function (msg) {
            throw new Error('Syntax error, unrecognized expression: ' + msg);
        };
        Sizzle.uniqueSort = function (results) {
            var elem, duplicates = [], i = 1, j = 0;
            hasDuplicate = !support.detectDuplicates;
            results.sort(sortOrder);
            if (hasDuplicate) {
                for (; elem = results[i]; i++) {
                    if (elem === results[i - 1]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }
            return results;
        };
        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
            if (diff) {
                return diff;
            }
            if (cur) {
                while (cur = cur.nextSibling) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }
            return a ? 1 : -1;
        }
        function createInputPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === 'input' && elem.type === type;
            };
        }
        function createButtonPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === 'input' || name === 'button') && elem.type === type;
            };
        }
        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
                argument = +argument;
                return markFunction(function (seed, matches) {
                    var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
                    while (i--) {
                        if (seed[j = matchIndexes[i]]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }
        getText = Sizzle.getText = function (elem) {
            var node, ret = '', i = 0, nodeType = elem.nodeType;
            if (!nodeType) {
                for (; node = elem[i]; i++) {
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof elem.textContent === 'string') {
                    return elem.textContent;
                } else {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += getText(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            return ret;
        };
        Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            find: {},
            relative: {
                '>': {
                    dir: 'parentNode',
                    first: true
                },
                ' ': { dir: 'parentNode' },
                '+': {
                    dir: 'previousSibling',
                    first: true
                },
                '~': { dir: 'previousSibling' }
            },
            preFilter: {
                ATTR: function (match) {
                    match[1] = match[1].replace(runescape, funescape);
                    match[3] = (match[4] || match[5] || '').replace(runescape, funescape);
                    if (match[2] === '~=') {
                        match[3] = ' ' + match[3] + ' ';
                    }
                    return match.slice(0, 4);
                },
                CHILD: function (match) {
                    match[1] = match[1].toLowerCase();
                    if (match[1].slice(0, 3) === 'nth') {
                        if (!match[3]) {
                            Sizzle.error(match[0]);
                        }
                        match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === 'even' || match[3] === 'odd'));
                        match[5] = +(match[7] + match[8] || match[3] === 'odd');
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }
                    return match;
                },
                PSEUDO: function (match) {
                    var excess, unquoted = !match[5] && match[2];
                    if (matchExpr['CHILD'].test(match[0])) {
                        return null;
                    }
                    if (match[4]) {
                        match[2] = match[4];
                    } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(')', unquoted.length - excess) - unquoted.length)) {
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }
                    return match.slice(0, 3);
                }
            },
            filter: {
                TAG: function (nodeName) {
                    if (nodeName === '*') {
                        return function () {
                            return true;
                        };
                    }
                    nodeName = nodeName.replace(runescape, funescape).toLowerCase();
                    return function (elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },
                CLASS: function (className) {
                    var pattern = classCache[className + ' '];
                    return pattern || (pattern = new RegExp('(^|' + whitespace + ')' + className + '(' + whitespace + '|$)')) && classCache(className, function (elem) {
                        return pattern.test(elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute('class') || '');
                    });
                },
                ATTR: function (name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);
                        if (result == null) {
                            return operator === '!=';
                        }
                        if (!operator) {
                            return true;
                        }
                        result += '';
                        return operator === '=' ? result === check : operator === '!=' ? result !== check : operator === '^=' ? check && result.indexOf(check) === 0 : operator === '*=' ? check && result.indexOf(check) > -1 : operator === '$=' ? check && result.slice(-check.length) === check : operator === '~=' ? (' ' + result + ' ').indexOf(check) > -1 : operator === '|=' ? result === check || result.slice(0, check.length + 1) === check + '-' : false;
                    };
                },
                CHILD: function (type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== 'nth', forward = type.slice(-4) !== 'last', ofType = what === 'of-type';
                    return first === 1 && last === 0 ? function (elem) {
                        return !!elem.parentNode;
                    } : function (elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? 'nextSibling' : 'previousSibling', parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while (node = node[dir]) {
                                        if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                            return false;
                                        }
                                    }
                                    start = dir = type === 'only' && !start && 'nextSibling';
                                }
                                return true;
                            }
                            start = [forward ? parent.firstChild : parent.lastChild];
                            if (forward && useCache) {
                                outerCache = parent[expando] || (parent[expando] = {});
                                cache = outerCache[type] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = cache[0] === dirruns && cache[2];
                                node = nodeIndex && parent.childNodes[nodeIndex];
                                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                                    if (node.nodeType === 1 && ++diff && node === elem) {
                                        outerCache[type] = [
                                            dirruns,
                                            nodeIndex,
                                            diff
                                        ];
                                        break;
                                    }
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                                diff = cache[1];
                            } else {
                                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                                    if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                                        if (useCache) {
                                            (node[expando] || (node[expando] = {}))[type] = [
                                                dirruns,
                                                diff
                                            ];
                                        }
                                        if (node === elem) {
                                            break;
                                        }
                                    }
                                }
                            }
                            diff -= last;
                            return diff === first || diff % first === 0 && diff / first >= 0;
                        }
                    };
                },
                PSEUDO: function (pseudo, argument) {
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error('unsupported pseudo: ' + pseudo);
                    if (fn[expando]) {
                        return fn(argument);
                    }
                    if (fn.length > 1) {
                        args = [
                            pseudo,
                            pseudo,
                            '',
                            argument
                        ];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
                            var idx, matched = fn(seed, argument), i = matched.length;
                            while (i--) {
                                idx = indexOf.call(seed, matched[i]);
                                seed[idx] = !(matches[idx] = matched[i]);
                            }
                        }) : function (elem) {
                            return fn(elem, 0, args);
                        };
                    }
                    return fn;
                }
            },
            pseudos: {
                not: markFunction(function (selector) {
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, '$1'));
                    return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
                        var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
                        while (i--) {
                            if (elem = unmatched[i]) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) : function (elem, context, xml) {
                        input[0] = elem;
                        matcher(input, null, xml, results);
                        return !results.pop();
                    };
                }),
                has: markFunction(function (selector) {
                    return function (elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),
                contains: markFunction(function (text) {
                    return function (elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),
                lang: markFunction(function (lang) {
                    if (!ridentifier.test(lang || '')) {
                        Sizzle.error('unsupported lang: ' + lang);
                    }
                    lang = lang.replace(runescape, funescape).toLowerCase();
                    return function (elem) {
                        var elemLang;
                        do {
                            if (elemLang = documentIsXML ? elem.getAttribute('xml:lang') || elem.getAttribute('lang') : elem.lang) {
                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + '-') === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }),
                target: function (elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },
                root: function (elem) {
                    return elem === docElem;
                },
                focus: function (elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                enabled: function (elem) {
                    return elem.disabled === false;
                },
                disabled: function (elem) {
                    return elem.disabled === true;
                },
                checked: function (elem) {
                    var nodeName = elem.nodeName.toLowerCase();
                    return nodeName === 'input' && !!elem.checked || nodeName === 'option' && !!elem.selected;
                },
                selected: function (elem) {
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }
                    return elem.selected === true;
                },
                empty: function (elem) {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        if (elem.nodeName > '@' || elem.nodeType === 3 || elem.nodeType === 4) {
                            return false;
                        }
                    }
                    return true;
                },
                parent: function (elem) {
                    return !Expr.pseudos['empty'](elem);
                },
                header: function (elem) {
                    return rheader.test(elem.nodeName);
                },
                input: function (elem) {
                    return rinputs.test(elem.nodeName);
                },
                button: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === 'input' && elem.type === 'button' || name === 'button';
                },
                text: function (elem) {
                    var attr;
                    return elem.nodeName.toLowerCase() === 'input' && elem.type === 'text' && ((attr = elem.getAttribute('type')) == null || attr.toLowerCase() === elem.type);
                },
                first: createPositionalPseudo(function () {
                    return [0];
                }),
                last: createPositionalPseudo(function (matchIndexes, length) {
                    return [length - 1];
                }),
                eq: createPositionalPseudo(function (matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }),
                even: createPositionalPseudo(function (matchIndexes, length) {
                    var i = 0;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                odd: createPositionalPseudo(function (matchIndexes, length) {
                    var i = 1;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                lt: createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; --i >= 0;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                gt: createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; ++i < length;) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };
        for (i in {
                radio: true,
                checkbox: true,
                file: true,
                password: true,
                image: true
            }) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in {
                submit: true,
                reset: true
            }) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }
        function tokenize(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + ' '];
            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push(tokens = []);
                }
                matched = false;
                if (match = rcombinators.exec(soFar)) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: match[0].replace(rtrim, ' ')
                    });
                    soFar = soFar.slice(matched.length);
                }
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match
                        });
                        soFar = soFar.slice(matched.length);
                    }
                }
                if (!matched) {
                    break;
                }
            }
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        }
        function toSelector(tokens) {
            var i = 0, len = tokens.length, selector = '';
            for (; i < len; i++) {
                selector += tokens[i].value;
            }
            return selector;
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && dir === 'parentNode', doneName = done++;
            return combinator.first ? function (elem, context, xml) {
                while (elem = elem[dir]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
            } : function (elem, context, xml) {
                var data, cache, outerCache, dirkey = dirruns + ' ' + doneName;
                if (xml) {
                    while (elem = elem[dir]) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            if (matcher(elem, context, xml)) {
                                return true;
                            }
                        }
                    }
                } else {
                    while (elem = elem[dir]) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            outerCache = elem[expando] || (elem[expando] = {});
                            if ((cache = outerCache[dir]) && cache[0] === dirkey) {
                                if ((data = cache[1]) === true || data === cachedruns) {
                                    return data === true;
                                }
                            } else {
                                cache = outerCache[dir] = [dirkey];
                                cache[1] = matcher(elem, context, xml) || cachedruns;
                                if (cache[1] === true) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
        }
        function elementMatcher(matchers) {
            return matchers.length > 1 ? function (elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } : matchers[0];
        }
        function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
            for (; i < len; i++) {
                if (elem = unmatched[i]) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }
            return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
                var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || '*', context.nodeType ? [context] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);
                    i = temp.length;
                    while (i--) {
                        if (elem = temp[i]) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }
                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if (elem = matcherOut[i]) {
                                    temp.push(matcherIn[i] = elem);
                                }
                            }
                            postFinder(null, matcherOut = [], temp, xml);
                        }
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }
                } else {
                    matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }
        function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[' '], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function (elem) {
                    return elem === checkContext;
                }, implicitRelative, true), matchAnyContext = addCombinator(function (elem) {
                    return indexOf.call(checkContext, elem) > -1;
                }, implicitRelative, true), matchers = [function (elem, context, xml) {
                        return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
                    }];
            for (; i < len; i++) {
                if (matcher = Expr.relative[tokens[i].type]) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                    if (matcher[expando]) {
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1)).replace(rtrim, '$1'), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                    }
                    matchers.push(matcher);
                }
            }
            return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var matcherCachedRuns = 0, bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function (seed, context, xml, results, expandContext) {
                    var elem, j, matcher, setMatched = [], matchedCount = 0, i = '0', unmatched = seed && [], outermost = expandContext != null, contextBackup = outermostContext, elems = seed || byElement && Expr.find['TAG']('*', expandContext && context.parentNode || context), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1;
                    if (outermost) {
                        outermostContext = context !== document && context;
                        cachedruns = matcherCachedRuns;
                    }
                    for (; (elem = elems[i]) != null; i++) {
                        if (byElement && elem) {
                            j = 0;
                            while (matcher = elementMatchers[j++]) {
                                if (matcher(elem, context, xml)) {
                                    results.push(elem);
                                    break;
                                }
                            }
                            if (outermost) {
                                dirruns = dirrunsUnique;
                                cachedruns = ++matcherCachedRuns;
                            }
                        }
                        if (bySet) {
                            if (elem = !matcher && elem) {
                                matchedCount--;
                            }
                            if (seed) {
                                unmatched.push(elem);
                            }
                        }
                    }
                    matchedCount += i;
                    if (bySet && i !== matchedCount) {
                        j = 0;
                        while (matcher = setMatchers[j++]) {
                            matcher(unmatched, setMatched, context, xml);
                        }
                        if (seed) {
                            if (matchedCount > 0) {
                                while (i--) {
                                    if (!(unmatched[i] || setMatched[i])) {
                                        setMatched[i] = pop.call(results);
                                    }
                                }
                            }
                            setMatched = condense(setMatched);
                        }
                        push.apply(results, setMatched);
                        if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                            Sizzle.uniqueSort(results);
                        }
                    }
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }
                    return unmatched;
                };
            return bySet ? markFunction(superMatcher) : superMatcher;
        }
        compile = Sizzle.compile = function (selector, group) {
            var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + ' '];
            if (!cached) {
                if (!group) {
                    group = tokenize(selector);
                }
                i = group.length;
                while (i--) {
                    cached = matcherFromTokens(group[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
            }
            return cached;
        };
        function multipleContexts(selector, contexts, results) {
            var i = 0, len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }
        function select(selector, context, results, seed) {
            var i, tokens, token, type, find, match = tokenize(selector);
            if (!seed) {
                if (match.length === 1) {
                    tokens = match[0] = match[0].slice(0);
                    if (tokens.length > 2 && (token = tokens[0]).type === 'ID' && context.nodeType === 9 && !documentIsXML && Expr.relative[tokens[1].type]) {
                        context = Expr.find['ID'](token.matches[0].replace(runescape, funescape), context)[0];
                        if (!context) {
                            return results;
                        }
                        selector = selector.slice(tokens.shift().value.length);
                    }
                    i = matchExpr['needsContext'].test(selector) ? 0 : tokens.length;
                    while (i--) {
                        token = tokens[i];
                        if (Expr.relative[type = token.type]) {
                            break;
                        }
                        if (find = Expr.find[type]) {
                            if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && context.parentNode || context)) {
                                tokens.splice(i, 1);
                                selector = seed.length && toSelector(tokens);
                                if (!selector) {
                                    push.apply(results, slice.call(seed, 0));
                                    return results;
                                }
                                break;
                            }
                        }
                    }
                }
            }
            compile(selector, match)(seed, context, documentIsXML, results, rsibling.test(selector));
            return results;
        }
        Expr.pseudos['nth'] = Expr.pseudos['eq'];
        function setFilters() {
        }
        Expr.filters = setFilters.prototype = Expr.pseudos;
        Expr.setFilters = new setFilters();
        setDocument();
        Sizzle.attr = jQuery.attr;
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[':'] = jQuery.expr.pseudos;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;
    }(window));
    var runtil = /Until$/, rparentsprev = /^(?:parents|prev(?:Until|All))/, isSimple = /^.[^:#\[\.,]*$/, rneedsContext = jQuery.expr.match.needsContext, guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };
    jQuery.fn.extend({
        find: function (selector) {
            var i, ret, self, len = this.length;
            if (typeof selector !== 'string') {
                self = this;
                return this.pushStack(jQuery(selector).filter(function () {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }
            ret = [];
            for (i = 0; i < len; i++) {
                jQuery.find(selector, this[i], ret);
            }
            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = (this.selector ? this.selector + ' ' : '') + selector;
            return ret;
        },
        has: function (target) {
            var i, targets = jQuery(target, this), len = targets.length;
            return this.filter(function () {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },
        not: function (selector) {
            return this.pushStack(winnow(this, selector, false));
        },
        filter: function (selector) {
            return this.pushStack(winnow(this, selector, true));
        },
        is: function (selector) {
            return !!selector && (typeof selector === 'string' ? rneedsContext.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0);
        },
        closest: function (selectors, context) {
            var cur, i = 0, l = this.length, ret = [], pos = rneedsContext.test(selectors) || typeof selectors !== 'string' ? jQuery(selectors, context || this.context) : 0;
            for (; i < l; i++) {
                cur = this[i];
                while (cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11) {
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                        ret.push(cur);
                        break;
                    }
                    cur = cur.parentNode;
                }
            }
            return this.pushStack(ret.length > 1 ? jQuery.unique(ret) : ret);
        },
        index: function (elem) {
            if (!elem) {
                return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === 'string') {
                return jQuery.inArray(this[0], jQuery(elem));
            }
            return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
        },
        add: function (selector, context) {
            var set = typeof selector === 'string' ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector), all = jQuery.merge(this.get(), set);
            return this.pushStack(jQuery.unique(all));
        },
        addBack: function (selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
        }
    });
    jQuery.fn.andSelf = jQuery.fn.addBack;
    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);
        return cur;
    }
    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return jQuery.dir(elem, 'parentNode');
        },
        parentsUntil: function (elem, i, until) {
            return jQuery.dir(elem, 'parentNode', until);
        },
        next: function (elem) {
            return sibling(elem, 'nextSibling');
        },
        prev: function (elem) {
            return sibling(elem, 'previousSibling');
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, 'nextSibling');
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, 'previousSibling');
        },
        nextUntil: function (elem, i, until) {
            return jQuery.dir(elem, 'nextSibling', until);
        },
        prevUntil: function (elem, i, until) {
            return jQuery.dir(elem, 'previousSibling', until);
        },
        siblings: function (elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, 'iframe') ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var ret = jQuery.map(this, fn, until);
            if (!runtil.test(name)) {
                selector = until;
            }
            if (selector && typeof selector === 'string') {
                ret = jQuery.filter(selector, ret);
            }
            ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;
            if (this.length > 1 && rparentsprev.test(name)) {
                ret = ret.reverse();
            }
            return this.pushStack(ret);
        };
    });
    jQuery.extend({
        filter: function (expr, elems, not) {
            if (not) {
                expr = ':not(' + expr + ')';
            }
            return elems.length === 1 ? jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] : jQuery.find.matches(expr, elems);
        },
        dir: function (elem, dir, until) {
            var matched = [], cur = elem[dir];
            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },
        sibling: function (n, elem) {
            var r = [];
            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }
            return r;
        }
    });
    function winnow(elements, qualifier, keep) {
        qualifier = qualifier || 0;
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                var retVal = !!qualifier.call(elem, i, elem);
                return retVal === keep;
            });
        } else if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem) {
                return elem === qualifier === keep;
            });
        } else if (typeof qualifier === 'string') {
            var filtered = jQuery.grep(elements, function (elem) {
                    return elem.nodeType === 1;
                });
            if (isSimple.test(qualifier)) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter(qualifier, filtered);
            }
        }
        return jQuery.grep(elements, function (elem) {
            return jQuery.inArray(elem, qualifier) >= 0 === keep;
        });
    }
    function createSafeFragment(document) {
        var list = nodeNames.split('|'), safeFrag = document.createDocumentFragment();
        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(list.pop());
            }
        }
        return safeFrag;
    }
    var nodeNames = 'abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|' + 'header|hgroup|mark|meter|nav|output|progress|section|summary|time|video', rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rnoshimcache = new RegExp('<(?:' + nodeNames + ')[\\s/>]', 'i'), rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, manipulation_rcheckableType = /^(?:checkbox|radio)$/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wrapMap = {
            option: [
                1,
                '<select multiple=\'multiple\'>',
                '</select>'
            ],
            legend: [
                1,
                '<fieldset>',
                '</fieldset>'
            ],
            area: [
                1,
                '<map>',
                '</map>'
            ],
            param: [
                1,
                '<object>',
                '</object>'
            ],
            thead: [
                1,
                '<table>',
                '</table>'
            ],
            tr: [
                2,
                '<table><tbody>',
                '</tbody></table>'
            ],
            col: [
                2,
                '<table><tbody></tbody><colgroup>',
                '</colgroup></table>'
            ],
            td: [
                3,
                '<table><tbody><tr>',
                '</tr></tbody></table>'
            ],
            _default: jQuery.support.htmlSerialize ? [
                0,
                '',
                ''
            ] : [
                1,
                'X<div>',
                '</div>'
            ]
        }, safeFragment = createSafeFragment(document), fragmentDiv = safeFragment.appendChild(document.createElement('div'));
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    jQuery.fn.extend({
        text: function (value) {
            return jQuery.access(this, function (value) {
                return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },
        wrapAll: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }
                wrap.map(function () {
                    var elem = this;
                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }
                    return elem;
                }).append(this);
            }
            return this;
        },
        wrapInner: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }
            return this.each(function () {
                var self = jQuery(this), contents = self.contents();
                if (contents.length) {
                    contents.wrapAll(html);
                } else {
                    self.append(html);
                }
            });
        },
        wrap: function (html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function (i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },
        unwrap: function () {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, 'body')) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        },
        append: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    this.appendChild(elem);
                }
            });
        },
        prepend: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    this.insertBefore(elem, this.firstChild);
                }
            });
        },
        before: function () {
            return this.domManip(arguments, false, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },
        after: function () {
            return this.domManip(arguments, false, function (elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },
        remove: function (selector, keepData) {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
                if (!selector || jQuery.filter(selector, [elem]).length > 0) {
                    if (!keepData && elem.nodeType === 1) {
                        jQuery.cleanData(getAll(elem));
                    }
                    if (elem.parentNode) {
                        if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
                            setGlobalEval(getAll(elem, 'script'));
                        }
                        elem.parentNode.removeChild(elem);
                    }
                }
            }
            return this;
        },
        empty: function () {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
                if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                }
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
                if (elem.options && jQuery.nodeName(elem, 'select')) {
                    elem.options.length = 0;
                }
            }
            return this;
        },
        clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function () {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function (value) {
            return jQuery.access(this, function (value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (value === undefined) {
                    return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, '') : undefined;
                }
                if (typeof value === 'string' && !rnoInnerhtml.test(value) && (jQuery.support.htmlSerialize || !rnoshimcache.test(value)) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || [
                        '',
                        ''
                    ])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, '<$1></$2>');
                    try {
                        for (; i < l; i++) {
                            elem = this[i] || {};
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(getAll(elem, false));
                                elem.innerHTML = value;
                            }
                        }
                        elem = 0;
                    } catch (e) {
                    }
                }
                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },
        replaceWith: function (value) {
            var isFunc = jQuery.isFunction(value);
            if (!isFunc && typeof value !== 'string') {
                value = jQuery(value).not(this).detach();
            }
            return this.domManip([value], true, function (elem) {
                var next = this.nextSibling, parent = this.parentNode;
                if (parent) {
                    jQuery(this).remove();
                    parent.insertBefore(elem, next);
                }
            });
        },
        detach: function (selector) {
            return this.remove(selector, true);
        },
        domManip: function (args, table, callback) {
            args = core_concat.apply([], args);
            var first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
            if (isFunction || !(l <= 1 || typeof value !== 'string' || jQuery.support.checkClone || !rchecked.test(value))) {
                return this.each(function (index) {
                    var self = set.eq(index);
                    if (isFunction) {
                        args[0] = value.call(this, index, table ? self.html() : undefined);
                    }
                    self.domManip(args, table, callback);
                });
            }
            if (l) {
                fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
                first = fragment.firstChild;
                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }
                if (first) {
                    table = table && jQuery.nodeName(first, 'tr');
                    scripts = jQuery.map(getAll(fragment, 'script'), disableScript);
                    hasScripts = scripts.length;
                    for (; i < l; i++) {
                        node = fragment;
                        if (i !== iNoClone) {
                            node = jQuery.clone(node, true, true);
                            if (hasScripts) {
                                jQuery.merge(scripts, getAll(node, 'script'));
                            }
                        }
                        callback.call(table && jQuery.nodeName(this[i], 'table') ? findOrAppend(this[i], 'tbody') : this[i], node, i);
                    }
                    if (hasScripts) {
                        doc = scripts[scripts.length - 1].ownerDocument;
                        jQuery.map(scripts, restoreScript);
                        for (i = 0; i < hasScripts; i++) {
                            node = scripts[i];
                            if (rscriptType.test(node.type || '') && !jQuery._data(node, 'globalEval') && jQuery.contains(doc, node)) {
                                if (node.src) {
                                    jQuery.ajax({
                                        url: node.src,
                                        type: 'GET',
                                        dataType: 'script',
                                        async: false,
                                        global: false,
                                        'throws': true
                                    });
                                } else {
                                    jQuery.globalEval((node.text || node.textContent || node.innerHTML || '').replace(rcleanScript, ''));
                                }
                            }
                        }
                    }
                    fragment = first = null;
                }
            }
            return this;
        }
    });
    function findOrAppend(elem, tag) {
        return elem.getElementsByTagName(tag)[0] || elem.appendChild(elem.ownerDocument.createElement(tag));
    }
    function disableScript(elem) {
        var attr = elem.getAttributeNode('type');
        elem.type = (attr && attr.specified) + '/' + elem.type;
        return elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        if (match) {
            elem.type = match[1];
        } else {
            elem.removeAttribute('type');
        }
        return elem;
    }
    function setGlobalEval(elems, refElements) {
        var elem, i = 0;
        for (; (elem = elems[i]) != null; i++) {
            jQuery._data(elem, 'globalEval', !refElements || jQuery._data(refElements[i], 'globalEval'));
        }
    }
    function cloneCopyEvent(src, dest) {
        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }
        var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
        if (events) {
            delete curData.handle;
            curData.events = {};
            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }
        if (curData.data) {
            curData.data = jQuery.extend({}, curData.data);
        }
    }
    function fixCloneNodeIssues(src, dest) {
        var nodeName, e, data;
        if (dest.nodeType !== 1) {
            return;
        }
        nodeName = dest.nodeName.toLowerCase();
        if (!jQuery.support.noCloneEvent && dest[jQuery.expando]) {
            data = jQuery._data(dest);
            for (e in data.events) {
                jQuery.removeEvent(dest, e, data.handle);
            }
            dest.removeAttribute(jQuery.expando);
        }
        if (nodeName === 'script' && dest.text !== src.text) {
            disableScript(dest).text = src.text;
            restoreScript(dest);
        } else if (nodeName === 'object') {
            if (dest.parentNode) {
                dest.outerHTML = src.outerHTML;
            }
            if (jQuery.support.html5Clone && src.innerHTML && !jQuery.trim(dest.innerHTML)) {
                dest.innerHTML = src.innerHTML;
            }
        } else if (nodeName === 'input' && manipulation_rcheckableType.test(src.type)) {
            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
                dest.value = src.value;
            }
        } else if (nodeName === 'option') {
            dest.defaultSelected = dest.selected = src.defaultSelected;
        } else if (nodeName === 'input' || nodeName === 'textarea') {
            dest.defaultValue = src.defaultValue;
        }
    }
    jQuery.each({
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after',
        replaceAll: 'replaceWith'
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems, i = 0, ret = [], insert = jQuery(selector), last = insert.length - 1;
            for (; i <= last; i++) {
                elems = i === last ? this : this.clone(true);
                jQuery(insert[i])[original](elems);
                core_push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
        };
    });
    function getAll(context, tag) {
        var elems, elem, i = 0, found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName(tag || '*') : typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll(tag || '*') : undefined;
        if (!found) {
            for (found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++) {
                if (!tag || jQuery.nodeName(elem, tag)) {
                    found.push(elem);
                } else {
                    jQuery.merge(found, getAll(elem, tag));
                }
            }
        }
        return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([context], found) : found;
    }
    function fixDefaultChecked(elem) {
        if (manipulation_rcheckableType.test(elem.type)) {
            elem.defaultChecked = elem.checked;
        }
    }
    jQuery.extend({
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var destElements, node, clone, i, srcElements, inPage = jQuery.contains(elem.ownerDocument, elem);
            if (jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test('<' + elem.nodeName + '>')) {
                clone = elem.cloneNode(true);
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }
            if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                destElements = getAll(clone);
                srcElements = getAll(elem);
                for (i = 0; (node = srcElements[i]) != null; ++i) {
                    if (destElements[i]) {
                        fixCloneNodeIssues(node, destElements[i]);
                    }
                }
            }
            if (dataAndEvents) {
                if (deepDataAndEvents) {
                    srcElements = srcElements || getAll(elem);
                    destElements = destElements || getAll(clone);
                    for (i = 0; (node = srcElements[i]) != null; i++) {
                        cloneCopyEvent(node, destElements[i]);
                    }
                } else {
                    cloneCopyEvent(elem, clone);
                }
            }
            destElements = getAll(clone, 'script');
            if (destElements.length > 0) {
                setGlobalEval(destElements, !inPage && getAll(elem, 'script'));
            }
            destElements = srcElements = node = null;
            return clone;
        },
        buildFragment: function (elems, context, scripts, selection) {
            var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, safe = createSafeFragment(context), nodes = [], i = 0;
            for (; i < l; i++) {
                elem = elems[i];
                if (elem || elem === 0) {
                    if (jQuery.type(elem) === 'object') {
                        jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
                    } else if (!rhtml.test(elem)) {
                        nodes.push(context.createTextNode(elem));
                    } else {
                        tmp = tmp || safe.appendChild(context.createElement('div'));
                        tag = (rtagName.exec(elem) || [
                            '',
                            ''
                        ])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, '<$1></$2>') + wrap[2];
                        j = wrap[0];
                        while (j--) {
                            tmp = tmp.lastChild;
                        }
                        if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
                        }
                        if (!jQuery.support.tbody) {
                            elem = tag === 'table' && !rtbody.test(elem) ? tmp.firstChild : wrap[1] === '<table>' && !rtbody.test(elem) ? tmp : 0;
                            j = elem && elem.childNodes.length;
                            while (j--) {
                                if (jQuery.nodeName(tbody = elem.childNodes[j], 'tbody') && !tbody.childNodes.length) {
                                    elem.removeChild(tbody);
                                }
                            }
                        }
                        jQuery.merge(nodes, tmp.childNodes);
                        tmp.textContent = '';
                        while (tmp.firstChild) {
                            tmp.removeChild(tmp.firstChild);
                        }
                        tmp = safe.lastChild;
                    }
                }
            }
            if (tmp) {
                safe.removeChild(tmp);
            }
            if (!jQuery.support.appendChecked) {
                jQuery.grep(getAll(nodes, 'input'), fixDefaultChecked);
            }
            i = 0;
            while (elem = nodes[i++]) {
                if (selection && jQuery.inArray(elem, selection) !== -1) {
                    continue;
                }
                contains = jQuery.contains(elem.ownerDocument, elem);
                tmp = getAll(safe.appendChild(elem), 'script');
                if (contains) {
                    setGlobalEval(tmp);
                }
                if (scripts) {
                    j = 0;
                    while (elem = tmp[j++]) {
                        if (rscriptType.test(elem.type || '')) {
                            scripts.push(elem);
                        }
                    }
                }
            }
            tmp = null;
            return safe;
        },
        cleanData: function (elems, acceptData) {
            var elem, type, id, data, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = jQuery.support.deleteExpando, special = jQuery.event.special;
            for (; (elem = elems[i]) != null; i++) {
                if (acceptData || jQuery.acceptData(elem)) {
                    id = elem[internalKey];
                    data = id && cache[id];
                    if (data) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }
                        if (cache[id]) {
                            delete cache[id];
                            if (deleteExpando) {
                                delete elem[internalKey];
                            } else if (typeof elem.removeAttribute !== core_strundefined) {
                                elem.removeAttribute(internalKey);
                            } else {
                                elem[internalKey] = null;
                            }
                            core_deletedIds.push(id);
                        }
                    }
                }
            }
        }
    });
    var iframe, getStyles, curCSS, ralpha = /alpha\([^)]*\)/i, ropacity = /opacity\s*=\s*([^)]*)/, rposition = /^(top|right|bottom|left)$/, rdisplayswap = /^(none|table(?!-c[ea]).+)/, rmargin = /^margin/, rnumsplit = new RegExp('^(' + core_pnum + ')(.*)$', 'i'), rnumnonpx = new RegExp('^(' + core_pnum + ')(?!px)[a-z%]+$', 'i'), rrelNum = new RegExp('^([+-])=(' + core_pnum + ')', 'i'), elemdisplay = { BODY: 'block' }, cssShow = {
            position: 'absolute',
            visibility: 'hidden',
            display: 'block'
        }, cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        }, cssExpand = [
            'Top',
            'Right',
            'Bottom',
            'Left'
        ], cssPrefixes = [
            'Webkit',
            'O',
            'Moz',
            'ms'
        ];
    function vendorPropName(style, name) {
        if (name in style) {
            return name;
        }
        var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length;
        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }
        return origName;
    }
    function isHidden(elem, el) {
        elem = el || elem;
        return jQuery.css(elem, 'display') === 'none' || !jQuery.contains(elem.ownerDocument, elem);
    }
    function showHide(elements, show) {
        var display, elem, hidden, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            values[index] = jQuery._data(elem, 'olddisplay');
            display = elem.style.display;
            if (show) {
                if (!values[index] && display === 'none') {
                    elem.style.display = '';
                }
                if (elem.style.display === '' && isHidden(elem)) {
                    values[index] = jQuery._data(elem, 'olddisplay', css_defaultDisplay(elem.nodeName));
                }
            } else {
                if (!values[index]) {
                    hidden = isHidden(elem);
                    if (display && display !== 'none' || !hidden) {
                        jQuery._data(elem, 'olddisplay', hidden ? display : jQuery.css(elem, 'display'));
                    }
                }
            }
        }
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === 'none' || elem.style.display === '') {
                elem.style.display = show ? values[index] || '' : 'none';
            }
        }
        return elements;
    }
    jQuery.fn.extend({
        css: function (name, value) {
            return jQuery.access(this, function (elem, name, value) {
                var len, styles, map = {}, i = 0;
                if (jQuery.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;
                    for (; i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }
                    return map;
                }
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function () {
            return showHide(this, true);
        },
        hide: function () {
            return showHide(this);
        },
        toggle: function (state) {
            var bool = typeof state === 'boolean';
            return this.each(function () {
                if (bool ? state : isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });
    jQuery.extend({
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, 'opacity');
                        return ret === '' ? '1' : ret;
                    }
                }
            }
        },
        cssNumber: {
            columnCount: true,
            fillOpacity: true,
            fontWeight: true,
            lineHeight: true,
            opacity: true,
            orphans: true,
            widows: true,
            zIndex: true,
            zoom: true
        },
        cssProps: { 'float': jQuery.support.cssFloat ? 'cssFloat' : 'styleFloat' },
        style: function (elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }
            var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value !== undefined) {
                type = typeof value;
                if (type === 'string' && (ret = rrelNum.exec(value))) {
                    value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                    type = 'number';
                }
                if (value == null || type === 'number' && isNaN(value)) {
                    return;
                }
                if (type === 'number' && !jQuery.cssNumber[origName]) {
                    value += 'px';
                }
                if (!jQuery.support.clearCloneStyle && value === '' && name.indexOf('background') === 0) {
                    style[name] = 'inherit';
                }
                if (!hooks || !('set' in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    try {
                        style[name] = value;
                    } catch (e) {
                    }
                }
            } else {
                if (hooks && 'get' in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }
                return style[name];
            }
        },
        css: function (elem, name, extra, styles) {
            var num, val, hooks, origName = jQuery.camelCase(name);
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (hooks && 'get' in hooks) {
                val = hooks.get(elem, true, extra);
            }
            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }
            if (val === 'normal' && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }
            if (extra === '' || extra) {
                num = parseFloat(val);
                return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
            }
            return val;
        },
        swap: function (elem, options, callback, args) {
            var ret, name, old = {};
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            ret = callback.apply(elem, args || []);
            for (name in options) {
                elem.style[name] = old[name];
            }
            return ret;
        }
    });
    if (window.getComputedStyle) {
        getStyles = function (elem) {
            return window.getComputedStyle(elem, null);
        };
        curCSS = function (elem, name, _computed) {
            var width, minWidth, maxWidth, computed = _computed || getStyles(elem), ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined, style = elem.style;
            if (computed) {
                if (ret === '' && !jQuery.contains(elem.ownerDocument, elem)) {
                    ret = jQuery.style(elem, name);
                }
                if (rnumnonpx.test(ret) && rmargin.test(name)) {
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }
            return ret;
        };
    } else if (document.documentElement.currentStyle) {
        getStyles = function (elem) {
            return elem.currentStyle;
        };
        curCSS = function (elem, name, _computed) {
            var left, rs, rsLeft, computed = _computed || getStyles(elem), ret = computed ? computed[name] : undefined, style = elem.style;
            if (ret == null && style && style[name]) {
                ret = style[name];
            }
            if (rnumnonpx.test(ret) && !rposition.test(name)) {
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;
                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === 'fontSize' ? '1em' : ret;
                ret = style.pixelLeft + 'px';
                style.left = left;
                if (rsLeft) {
                    rs.left = rsLeft;
                }
            }
            return ret === '' ? 'auto' : ret;
        };
    }
    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || 'px') : value;
    }
    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? 'border' : 'content') ? 4 : name === 'width' ? 1 : 0, val = 0;
        for (; i < 4; i += 2) {
            if (extra === 'margin') {
                val += jQuery.css(elem, extra + cssExpand[i], true, styles);
            }
            if (isBorderBox) {
                if (extra === 'content') {
                    val -= jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
                }
                if (extra !== 'margin') {
                    val -= jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
                }
            } else {
                val += jQuery.css(elem, 'padding' + cssExpand[i], true, styles);
                if (extra !== 'padding') {
                    val += jQuery.css(elem, 'border' + cssExpand[i] + 'Width', true, styles);
                }
            }
        }
        return val;
    }
    function getWidthOrHeight(elem, name, extra) {
        var valueIsBorderBox = true, val = name === 'width' ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, 'boxSizing', false, styles) === 'border-box';
        if (val <= 0 || val == null) {
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }
            if (rnumnonpx.test(val)) {
                return val;
            }
            valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable || val === elem.style[name]);
            val = parseFloat(val) || 0;
        }
        return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? 'border' : 'content'), valueIsBorderBox, styles) + 'px';
    }
    function css_defaultDisplay(nodeName) {
        var doc = document, display = elemdisplay[nodeName];
        if (!display) {
            display = actualDisplay(nodeName, doc);
            if (display === 'none' || !display) {
                iframe = (iframe || jQuery('<iframe frameborder=\'0\' width=\'0\' height=\'0\'/>').css('cssText', 'display:block !important')).appendTo(doc.documentElement);
                doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;
                doc.write('<!doctype html><html><body>');
                doc.close();
                display = actualDisplay(nodeName, doc);
                iframe.detach();
            }
            elemdisplay[nodeName] = display;
        }
        return display;
    }
    function actualDisplay(name, doc) {
        var elem = jQuery(doc.createElement(name)).appendTo(doc.body), display = jQuery.css(elem[0], 'display');
        elem.remove();
        return display;
    }
    jQuery.each([
        'height',
        'width'
    ], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                if (computed) {
                    return elem.offsetWidth === 0 && rdisplayswap.test(jQuery.css(elem, 'display')) ? jQuery.swap(elem, cssShow, function () {
                        return getWidthOrHeight(elem, name, extra);
                    }) : getWidthOrHeight(elem, name, extra);
                }
            },
            set: function (elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, jQuery.support.boxSizing && jQuery.css(elem, 'boxSizing', false, styles) === 'border-box', styles) : 0);
            }
        };
    });
    if (!jQuery.support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function (elem, computed) {
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || '') ? 0.01 * parseFloat(RegExp.$1) + '' : computed ? '1' : '';
            },
            set: function (elem, value) {
                var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? 'alpha(opacity=' + value * 100 + ')' : '', filter = currentStyle && currentStyle.filter || style.filter || '';
                style.zoom = 1;
                if ((value >= 1 || value === '') && jQuery.trim(filter.replace(ralpha, '')) === '' && style.removeAttribute) {
                    style.removeAttribute('filter');
                    if (value === '' || currentStyle && !currentStyle.filter) {
                        return;
                    }
                }
                style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity;
            }
        };
    }
    jQuery(function () {
        if (!jQuery.support.reliableMarginRight) {
            jQuery.cssHooks.marginRight = {
                get: function (elem, computed) {
                    if (computed) {
                        return jQuery.swap(elem, { display: 'inline-block' }, curCSS, [
                            elem,
                            'marginRight'
                        ]);
                    }
                }
            };
        }
        if (!jQuery.support.pixelPosition && jQuery.fn.position) {
            jQuery.each([
                'top',
                'left'
            ], function (i, prop) {
                jQuery.cssHooks[prop] = {
                    get: function (elem, computed) {
                        if (computed) {
                            computed = curCSS(elem, prop);
                            return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + 'px' : computed;
                        }
                    }
                };
            });
        }
    });
    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.hidden = function (elem) {
            return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 || !jQuery.support.reliableHiddenOffsets && (elem.style && elem.style.display || jQuery.css(elem, 'display')) === 'none';
        };
        jQuery.expr.filters.visible = function (elem) {
            return !jQuery.expr.filters.hidden(elem);
        };
    }
    jQuery.each({
        margin: '',
        padding: '',
        border: 'Width'
    }, function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
                var i = 0, expanded = {}, parts = typeof value === 'string' ? value.split(' ') : [value];
                for (; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                }
                return expanded;
            }
        };
        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    jQuery.fn.extend({
        serialize: function () {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function () {
            return this.map(function () {
                var elements = jQuery.prop(this, 'elements');
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function () {
                var type = this.type;
                return this.name && !jQuery(this).is(':disabled') && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !manipulation_rcheckableType.test(type));
            }).map(function (i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, '\r\n')
                    };
                }) : {
                    name: elem.name,
                    value: val.replace(rCRLF, '\r\n')
                };
            }).get();
        }
    });
    jQuery.param = function (a, traditional) {
        var prefix, s = [], add = function (key, value) {
                value = jQuery.isFunction(value) ? value() : value == null ? '' : value;
                s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
            };
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }
        if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
            jQuery.each(a, function () {
                add(this.name, this.value);
            });
        } else {
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }
        return s.join('&').replace(r20, '+');
    };
    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) {
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add);
                }
            });
        } else if (!traditional && jQuery.type(obj) === 'object') {
            for (name in obj) {
                buildParams(prefix + '[' + name + ']', obj[name], traditional, add);
            }
        } else {
            add(prefix, obj);
        }
    }
    jQuery.each(('blur focus focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select submit keydown keypress keyup error contextmenu').split(' '), function (i, name) {
        jQuery.fn[name] = function (data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    });
    jQuery.fn.hover = function (fnOver, fnOut) {
        return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    };
    var ajaxLocParts, ajaxLocation, ajax_nonce = jQuery.now(), ajax_rquery = /\?/, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, _load = jQuery.fn.load, prefilters = {}, transports = {}, allTypes = '*/'.concat('*');
    try {
        ajaxLocation = location.href;
    } catch (e) {
        ajaxLocation = document.createElement('a');
        ajaxLocation.href = '';
        ajaxLocation = ajaxLocation.href;
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
    function addToPrefiltersOrTransports(structure) {
        return function (dataTypeExpression, func) {
            if (typeof dataTypeExpression !== 'string') {
                func = dataTypeExpression;
                dataTypeExpression = '*';
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(core_rnotwhite) || [];
            if (jQuery.isFunction(func)) {
                while (dataType = dataTypes[i++]) {
                    if (dataType[0] === '+') {
                        dataType = dataType.slice(1) || '*';
                        (structure[dataType] = structure[dataType] || []).unshift(func);
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === 'string' && !seekingTransport && !inspected[dataTypeOrTransport]) {
                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected['*'] && inspect('*');
    }
    function ajaxExtend(target, src) {
        var deep, key, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }
        return target;
    }
    jQuery.fn.load = function (url, params, callback) {
        if (typeof url !== 'string' && _load) {
            return _load.apply(this, arguments);
        }
        var selector, response, type, self = this, off = url.indexOf(' ');
        if (off >= 0) {
            selector = url.slice(off, url.length);
            url = url.slice(0, off);
        }
        if (jQuery.isFunction(params)) {
            callback = params;
            params = undefined;
        } else if (params && typeof params === 'object') {
            type = 'POST';
        }
        if (self.length > 0) {
            jQuery.ajax({
                url: url,
                type: type,
                dataType: 'html',
                data: params
            }).done(function (responseText) {
                response = arguments;
                self.html(selector ? jQuery('<div>').append(jQuery.parseHTML(responseText)).find(selector) : responseText);
            }).complete(callback && function (jqXHR, status) {
                self.each(callback, response || [
                    jqXHR.responseText,
                    status,
                    jqXHR
                ]);
            });
        }
        return this;
    };
    jQuery.each([
        'ajaxStart',
        'ajaxStop',
        'ajaxComplete',
        'ajaxError',
        'ajaxSuccess',
        'ajaxSend'
    ], function (i, type) {
        jQuery.fn[type] = function (fn) {
            return this.on(type, fn);
        };
    });
    jQuery.each([
        'get',
        'post'
    ], function (i, method) {
        jQuery[method] = function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });
    jQuery.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ajaxLocation,
            type: 'GET',
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            processData: true,
            async: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            accepts: {
                '*': allTypes,
                text: 'text/plain',
                html: 'text/html',
                xml: 'application/xml, text/xml',
                json: 'application/json, text/javascript'
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: 'responseXML',
                text: 'responseText'
            },
            converters: {
                '* text': window.String,
                'text html': true,
                'text json': jQuery.parseJSON,
                'text xml': jQuery.parseXML
            },
            flatOptions: {
                url: true,
                context: true
            }
        },
        ajaxSetup: function (target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function (url, options) {
            if (typeof url === 'object') {
                options = url;
                url = undefined;
            }
            options = options || {};
            var parts, i, cacheURL, responseHeadersString, timeoutTimer, fireGlobals, transport, responseHeaders, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks('once memory'), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, strAbort = 'canceled', jqXHR = {
                    readyState: 0,
                    getResponseHeader: function (key) {
                        var match;
                        if (state === 2) {
                            if (!responseHeaders) {
                                responseHeaders = {};
                                while (match = rheaders.exec(responseHeadersString)) {
                                    responseHeaders[match[1].toLowerCase()] = match[2];
                                }
                            }
                            match = responseHeaders[key.toLowerCase()];
                        }
                        return match == null ? null : match;
                    },
                    getAllResponseHeaders: function () {
                        return state === 2 ? responseHeadersString : null;
                    },
                    setRequestHeader: function (name, value) {
                        var lname = name.toLowerCase();
                        if (!state) {
                            name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                            requestHeaders[name] = value;
                        }
                        return this;
                    },
                    overrideMimeType: function (type) {
                        if (!state) {
                            s.mimeType = type;
                        }
                        return this;
                    },
                    statusCode: function (map) {
                        var code;
                        if (map) {
                            if (state < 2) {
                                for (code in map) {
                                    statusCode[code] = [
                                        statusCode[code],
                                        map[code]
                                    ];
                                }
                            } else {
                                jqXHR.always(map[jqXHR.status]);
                            }
                        }
                        return this;
                    },
                    abort: function (statusText) {
                        var finalText = statusText || strAbort;
                        if (transport) {
                            transport.abort(finalText);
                        }
                        done(0, finalText);
                        return this;
                    }
                };
            deferred.promise(jqXHR).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            s.url = ((url || s.url || ajaxLocation) + '').replace(rhash, '').replace(rprotocol, ajaxLocParts[1] + '//');
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = jQuery.trim(s.dataType || '*').toLowerCase().match(core_rnotwhite) || [''];
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === 'http:' ? 80 : 443)) != (ajaxLocParts[3] || (ajaxLocParts[1] === 'http:' ? 80 : 443))));
            }
            if (s.data && s.processData && typeof s.data !== 'string') {
                s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (state === 2) {
                return jqXHR;
            }
            fireGlobals = s.global;
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger('ajaxStart');
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url;
            if (!s.hasContent) {
                if (s.data) {
                    cacheURL = s.url += (ajax_rquery.test(cacheURL) ? '&' : '?') + s.data;
                    delete s.data;
                }
                if (s.cache === false) {
                    s.url = rts.test(cacheURL) ? cacheURL.replace(rts, '$1_=' + ajax_nonce++) : cacheURL + (ajax_rquery.test(cacheURL) ? '&' : '?') + '_=' + ajax_nonce++;
                }
            }
            if (s.ifModified) {
                if (jQuery.lastModified[cacheURL]) {
                    jqXHR.setRequestHeader('If-Modified-Since', jQuery.lastModified[cacheURL]);
                }
                if (jQuery.etag[cacheURL]) {
                    jqXHR.setRequestHeader('If-None-Match', jQuery.etag[cacheURL]);
                }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader('Content-Type', s.contentType);
            }
            jqXHR.setRequestHeader('Accept', s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== '*' ? ', ' + allTypes + '; q=0.01' : '') : s.accepts['*']);
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                return jqXHR.abort();
            }
            strAbort = 'abort';
            for (i in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) {
                jqXHR[i](s[i]);
            }
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
                done(-1, 'No Transport');
            } else {
                jqXHR.readyState = 1;
                if (fireGlobals) {
                    globalEventContext.trigger('ajaxSend', [
                        jqXHR,
                        s
                    ]);
                }
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function () {
                        jqXHR.abort('timeout');
                    }, s.timeout);
                }
                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    if (state < 2) {
                        done(-1, e);
                    } else {
                        throw e;
                    }
                }
            }
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                if (state === 2) {
                    return;
                }
                state = 2;
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }
                transport = undefined;
                responseHeadersString = headers || '';
                jqXHR.readyState = status > 0 ? 4 : 0;
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }
                if (status >= 200 && status < 300 || status === 304) {
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader('Last-Modified');
                        if (modified) {
                            jQuery.lastModified[cacheURL] = modified;
                        }
                        modified = jqXHR.getResponseHeader('etag');
                        if (modified) {
                            jQuery.etag[cacheURL] = modified;
                        }
                    }
                    if (status === 204) {
                        isSuccess = true;
                        statusText = 'nocontent';
                    } else if (status === 304) {
                        isSuccess = true;
                        statusText = 'notmodified';
                    } else {
                        isSuccess = ajaxConvert(s, response);
                        statusText = isSuccess.state;
                        success = isSuccess.data;
                        error = isSuccess.error;
                        isSuccess = !error;
                    }
                } else {
                    error = statusText;
                    if (status || !statusText) {
                        statusText = 'error';
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + '';
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [
                        success,
                        statusText,
                        jqXHR
                    ]);
                } else {
                    deferred.rejectWith(callbackContext, [
                        jqXHR,
                        statusText,
                        error
                    ]);
                }
                jqXHR.statusCode(statusCode);
                statusCode = undefined;
                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? 'ajaxSuccess' : 'ajaxError', [
                        jqXHR,
                        s,
                        isSuccess ? success : error
                    ]);
                }
                completeDeferred.fireWith(callbackContext, [
                    jqXHR,
                    statusText
                ]);
                if (fireGlobals) {
                    globalEventContext.trigger('ajaxComplete', [
                        jqXHR,
                        s
                    ]);
                    if (!--jQuery.active) {
                        jQuery.event.trigger('ajaxStop');
                    }
                }
            }
            return jqXHR;
        },
        getScript: function (url, callback) {
            return jQuery.get(url, undefined, callback, 'script');
        },
        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, 'json');
        }
    });
    function ajaxHandleResponses(s, jqXHR, responses) {
        var firstDataType, ct, finalDataType, type, contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;
        for (type in responseFields) {
            if (type in responses) {
                jqXHR[responseFields[type]] = responses[type];
            }
        }
        while (dataTypes[0] === '*') {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader('Content-Type');
            }
        }
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + ' ' + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }
    function ajaxConvert(s, response) {
        var conv2, current, conv, tmp, converters = {}, i = 0, dataTypes = s.dataTypes.slice(), prev = dataTypes[0];
        if (s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
        }
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }
        for (; current = dataTypes[++i];) {
            if (current !== '*') {
                if (prev !== '*' && prev !== current) {
                    conv = converters[prev + ' ' + current] || converters['* ' + current];
                    if (!conv) {
                        for (conv2 in converters) {
                            tmp = conv2.split(' ');
                            if (tmp[1] === current) {
                                conv = converters[prev + ' ' + tmp[0]] || converters['* ' + tmp[0]];
                                if (conv) {
                                    if (conv === true) {
                                        conv = converters[conv2];
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.splice(i--, 0, current);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (conv !== true) {
                        if (conv && s['throws']) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return {
                                    state: 'parsererror',
                                    error: conv ? e : 'No conversion from ' + prev + ' to ' + current
                                };
                            }
                        }
                    }
                }
                prev = current;
            }
        }
        return {
            state: 'success',
            data: response
        };
    }
    jQuery.ajaxSetup({
        accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
        contents: { script: /(?:java|ecma)script/ },
        converters: {
            'text script': function (text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });
    jQuery.ajaxPrefilter('script', function (s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = 'GET';
            s.global = false;
        }
    });
    jQuery.ajaxTransport('script', function (s) {
        if (s.crossDomain) {
            var script, head = document.head || jQuery('head')[0] || document.documentElement;
            return {
                send: function (_, callback) {
                    script = document.createElement('script');
                    script.async = true;
                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }
                    script.src = s.url;
                    script.onload = script.onreadystatechange = function (_, isAbort) {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                            script.onload = script.onreadystatechange = null;
                            if (script.parentNode) {
                                script.parentNode.removeChild(script);
                            }
                            script = null;
                            if (!isAbort) {
                                callback(200, 'success');
                            }
                        }
                    };
                    head.insertBefore(script, head.firstChild);
                },
                abort: function () {
                    if (script) {
                        script.onload(undefined, true);
                    }
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    jQuery.ajaxSetup({
        jsonp: 'callback',
        jsonpCallback: function () {
            var callback = oldCallbacks.pop() || jQuery.expando + '_' + ajax_nonce++;
            this[callback] = true;
            return callback;
        }
    });
    jQuery.ajaxPrefilter('json jsonp', function (s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? 'url' : typeof s.data === 'string' && !(s.contentType || '').indexOf('application/x-www-form-urlencoded') && rjsonp.test(s.data) && 'data');
        if (jsonProp || s.dataTypes[0] === 'jsonp') {
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
                s[jsonProp] = s[jsonProp].replace(rjsonp, '$1' + callbackName);
            } else if (s.jsonp !== false) {
                s.url += (ajax_rquery.test(s.url) ? '&' : '?') + s.jsonp + '=' + callbackName;
            }
            s.converters['script json'] = function () {
                if (!responseContainer) {
                    jQuery.error(callbackName + ' was not called');
                }
                return responseContainer[0];
            };
            s.dataTypes[0] = 'json';
            overwritten = window[callbackName];
            window[callbackName] = function () {
                responseContainer = arguments;
            };
            jqXHR.always(function () {
                window[callbackName] = overwritten;
                if (s[callbackName]) {
                    s.jsonpCallback = originalSettings.jsonpCallback;
                    oldCallbacks.push(callbackName);
                }
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }
                responseContainer = overwritten = undefined;
            });
            return 'script';
        }
    });
    var xhrCallbacks, xhrSupported, xhrId = 0, xhrOnUnloadAbort = window.ActiveXObject && function () {
            var key;
            for (key in xhrCallbacks) {
                xhrCallbacks[key](undefined, true);
            }
        };
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {
        }
    }
    function createActiveXHR() {
        try {
            return new window.ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
        }
    }
    jQuery.ajaxSettings.xhr = window.ActiveXObject ? function () {
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } : createStandardXHR;
    xhrSupported = jQuery.ajaxSettings.xhr();
    jQuery.support.cors = !!xhrSupported && 'withCredentials' in xhrSupported;
    xhrSupported = jQuery.support.ajax = !!xhrSupported;
    if (xhrSupported) {
        jQuery.ajaxTransport(function (s) {
            if (!s.crossDomain || jQuery.support.cors) {
                var callback;
                return {
                    send: function (headers, complete) {
                        var handle, i, xhr = s.xhr();
                        if (s.username) {
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        } else {
                            xhr.open(s.type, s.url, s.async);
                        }
                        if (s.xhrFields) {
                            for (i in s.xhrFields) {
                                xhr[i] = s.xhrFields[i];
                            }
                        }
                        if (s.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(s.mimeType);
                        }
                        if (!s.crossDomain && !headers['X-Requested-With']) {
                            headers['X-Requested-With'] = 'XMLHttpRequest';
                        }
                        try {
                            for (i in headers) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        } catch (err) {
                        }
                        xhr.send(s.hasContent && s.data || null);
                        callback = function (_, isAbort) {
                            var status, responseHeaders, statusText, responses;
                            try {
                                if (callback && (isAbort || xhr.readyState === 4)) {
                                    callback = undefined;
                                    if (handle) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if (xhrOnUnloadAbort) {
                                            delete xhrCallbacks[handle];
                                        }
                                    }
                                    if (isAbort) {
                                        if (xhr.readyState !== 4) {
                                            xhr.abort();
                                        }
                                    } else {
                                        responses = {};
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        if (typeof xhr.responseText === 'string') {
                                            responses.text = xhr.responseText;
                                        }
                                        try {
                                            statusText = xhr.statusText;
                                        } catch (e) {
                                            statusText = '';
                                        }
                                        if (!status && s.isLocal && !s.crossDomain) {
                                            status = responses.text ? 200 : 404;
                                        } else if (status === 1223) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch (firefoxAccessException) {
                                if (!isAbort) {
                                    complete(-1, firefoxAccessException);
                                }
                            }
                            if (responses) {
                                complete(status, statusText, responses, responseHeaders);
                            }
                        };
                        if (!s.async) {
                            callback();
                        } else if (xhr.readyState === 4) {
                            setTimeout(callback);
                        } else {
                            handle = ++xhrId;
                            if (xhrOnUnloadAbort) {
                                if (!xhrCallbacks) {
                                    xhrCallbacks = {};
                                    jQuery(window).unload(xhrOnUnloadAbort);
                                }
                                xhrCallbacks[handle] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },
                    abort: function () {
                        if (callback) {
                            callback(undefined, true);
                        }
                    }
                };
            }
        });
    }
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp('^(?:([+-])=|)(' + core_pnum + ')([a-z%]*)$', 'i'), rrun = /queueHooks$/, animationPrefilters = [defaultPrefilter], tweeners = {
            '*': [function (prop, value) {
                    var end, unit, tween = this.createTween(prop, value), parts = rfxnum.exec(value), target = tween.cur(), start = +target || 0, scale = 1, maxIterations = 20;
                    if (parts) {
                        end = +parts[2];
                        unit = parts[3] || (jQuery.cssNumber[prop] ? '' : 'px');
                        if (unit !== 'px' && start) {
                            start = jQuery.css(tween.elem, prop, true) || end || 1;
                            do {
                                scale = scale || '.5';
                                start = start / scale;
                                jQuery.style(tween.elem, prop, start + unit);
                            } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
                        }
                        tween.unit = unit;
                        tween.start = start;
                        tween.end = parts[1] ? start + (parts[1] + 1) * end : end;
                    }
                    return tween;
                }]
        };
    function createFxNow() {
        setTimeout(function () {
            fxNow = undefined;
        });
        return fxNow = jQuery.now();
    }
    function createTweens(animation, props) {
        jQuery.each(props, function (prop, value) {
            var collection = (tweeners[prop] || []).concat(tweeners['*']), index = 0, length = collection.length;
            for (; index < length; index++) {
                if (collection[index].call(animation, prop, value)) {
                    return;
                }
            }
        });
    }
    function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function () {
                delete tick.elem;
            }), tick = function () {
                if (stopped) {
                    return false;
                }
                var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length;
                for (; index < length; index++) {
                    animation.tweens[index].run(percent);
                }
                deferred.notifyWith(elem, [
                    animation,
                    percent,
                    remaining
                ]);
                if (percent < 1 && length) {
                    return remaining;
                } else {
                    deferred.resolveWith(elem, [animation]);
                    return false;
                }
            }, animation = deferred.promise({
                elem: elem,
                props: jQuery.extend({}, properties),
                opts: jQuery.extend(true, { specialEasing: {} }, options),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function (prop, end) {
                    var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                    animation.tweens.push(tween);
                    return tween;
                },
                stop: function (gotoEnd) {
                    var index = 0, length = gotoEnd ? animation.tweens.length : 0;
                    if (stopped) {
                        return this;
                    }
                    stopped = true;
                    for (; index < length; index++) {
                        animation.tweens[index].run(1);
                    }
                    if (gotoEnd) {
                        deferred.resolveWith(elem, [
                            animation,
                            gotoEnd
                        ]);
                    } else {
                        deferred.rejectWith(elem, [
                            animation,
                            gotoEnd
                        ]);
                    }
                    return this;
                }
            }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                return result;
            }
        }
        createTweens(animation, props);
        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }
        jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        }));
        return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }
    function propFilter(props, specialEasing) {
        var value, name, index, easing, hooks;
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }
            if (index !== name) {
                props[name] = value;
                delete props[index];
            }
            hooks = jQuery.cssHooks[name];
            if (hooks && 'expand' in hooks) {
                value = hooks.expand(value);
                delete props[name];
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }
    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function (props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = ['*'];
            } else {
                props = props.split(' ');
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
                prop = props[index];
                tweeners[prop] = tweeners[prop] || [];
                tweeners[prop].unshift(callback);
            }
        },
        prefilter: function (callback, prepend) {
            if (prepend) {
                animationPrefilters.unshift(callback);
            } else {
                animationPrefilters.push(callback);
            }
        }
    });
    function defaultPrefilter(elem, props, opts) {
        var prop, index, length, value, dataShow, toggle, tween, hooks, oldfire, anim = this, style = elem.style, orig = {}, handled = [], hidden = elem.nodeType && isHidden(elem);
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, 'fx');
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function () {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;
            anim.always(function () {
                anim.always(function () {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, 'fx').length) {
                        hooks.empty.fire();
                    }
                });
            });
        }
        if (elem.nodeType === 1 && ('height' in props || 'width' in props)) {
            opts.overflow = [
                style.overflow,
                style.overflowX,
                style.overflowY
            ];
            if (jQuery.css(elem, 'display') === 'inline' && jQuery.css(elem, 'float') === 'none') {
                if (!jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay(elem.nodeName) === 'inline') {
                    style.display = 'inline-block';
                } else {
                    style.zoom = 1;
                }
            }
        }
        if (opts.overflow) {
            style.overflow = 'hidden';
            if (!jQuery.support.shrinkWrapBlocks) {
                anim.always(function () {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
        }
        for (index in props) {
            value = props[index];
            if (rfxtypes.exec(value)) {
                delete props[index];
                toggle = toggle || value === 'toggle';
                if (value === (hidden ? 'hide' : 'show')) {
                    continue;
                }
                handled.push(index);
            }
        }
        length = handled.length;
        if (length) {
            dataShow = jQuery._data(elem, 'fxshow') || jQuery._data(elem, 'fxshow', {});
            if ('hidden' in dataShow) {
                hidden = dataShow.hidden;
            }
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function () {
                    jQuery(elem).hide();
                });
            }
            anim.done(function () {
                var prop;
                jQuery._removeData(elem, 'fxshow');
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (index = 0; index < length; index++) {
                prop = handled[index];
                tween = anim.createTween(prop, hidden ? dataShow[prop] : 0);
                orig[prop] = dataShow[prop] || jQuery.style(elem, prop);
                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === 'width' || prop === 'height' ? 1 : 0;
                    }
                }
            }
        }
    }
    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;
    Tween.prototype = {
        constructor: Tween,
        init: function (elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || 'swing';
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? '' : 'px');
        },
        cur: function () {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function (percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };
    Tween.prototype.init.prototype = Tween.prototype;
    Tween.propHooks = {
        _default: {
            get: function (tween) {
                var result;
                if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                    return tween.elem[tween.prop];
                }
                result = jQuery.css(tween.elem, tween.prop, '');
                return !result || result === 'auto' ? 0 : result;
            },
            set: function (tween) {
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function (tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };
    jQuery.each([
        'toggle',
        'show',
        'hide'
    ], function (i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function (speed, easing, callback) {
            return speed == null || typeof speed === 'boolean' ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
    });
    jQuery.fn.extend({
        fadeTo: function (speed, to, easing, callback) {
            return this.filter(isHidden).css('opacity', 0).show().end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function (prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function () {
                    var anim = Animation(this, jQuery.extend({}, prop), optall);
                    doAnimation.finish = function () {
                        anim.stop(true);
                    };
                    if (empty || jQuery._data(this, 'finish')) {
                        anim.stop(true);
                    }
                };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function (type, clearQueue, gotoEnd) {
            var stopQueue = function (hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };
            if (typeof type !== 'string') {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || 'fx', []);
            }
            return this.each(function () {
                var dequeue = true, index = type != null && type + 'queueHooks', timers = jQuery.timers, data = jQuery._data(this);
                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }
                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        },
        finish: function (type) {
            if (type !== false) {
                type = type || 'fx';
            }
            return this.each(function () {
                var index, data = jQuery._data(this), queue = data[type + 'queue'], hooks = data[type + 'queueHooks'], timers = jQuery.timers, length = queue ? queue.length : 0;
                data.finish = true;
                jQuery.queue(this, type, []);
                if (hooks && hooks.cur && hooks.cur.finish) {
                    hooks.cur.finish.call(this);
                }
                for (index = timers.length; index--;) {
                    if (timers[index].elem === this && timers[index].queue === type) {
                        timers[index].anim.stop(true);
                        timers.splice(index, 1);
                    }
                }
                for (index = 0; index < length; index++) {
                    if (queue[index] && queue[index].finish) {
                        queue[index].finish.call(this);
                    }
                }
                delete data.finish;
            });
        }
    });
    function genFx(type, includeWidth) {
        var which, attrs = { height: type }, i = 0;
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs['margin' + which] = attrs['padding' + which] = type;
        }
        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }
        return attrs;
    }
    jQuery.each({
        slideDown: genFx('show'),
        slideUp: genFx('hide'),
        slideToggle: genFx('toggle'),
        fadeIn: { opacity: 'show' },
        fadeOut: { opacity: 'hide' },
        fadeToggle: { opacity: 'toggle' }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });
    jQuery.speed = function (speed, easing, fn) {
        var opt = speed && typeof speed === 'object' ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };
        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === 'number' ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
        if (opt.queue == null || opt.queue === true) {
            opt.queue = 'fx';
        }
        opt.old = opt.complete;
        opt.complete = function () {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }
            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };
        return opt;
    };
    jQuery.easing = {
        linear: function (p) {
            return p;
        },
        swing: function (p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
        }
    };
    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function () {
        var timer, timers = jQuery.timers, i = 0;
        fxNow = jQuery.now();
        for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }
        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };
    jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer)) {
            jQuery.fx.start();
        }
    };
    jQuery.fx.interval = 13;
    jQuery.fx.start = function () {
        if (!timerId) {
            timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };
    jQuery.fx.stop = function () {
        clearInterval(timerId);
        timerId = null;
    };
    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    jQuery.fx.step = {};
    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.animated = function (elem) {
            return jQuery.grep(jQuery.timers, function (fn) {
                return elem === fn.elem;
            }).length;
        };
    }
    jQuery.fn.offset = function (options) {
        if (arguments.length) {
            return options === undefined ? this : this.each(function (i) {
                jQuery.offset.setOffset(this, options, i);
            });
        }
        var docElem, win, box = {
                top: 0,
                left: 0
            }, elem = this[0], doc = elem && elem.ownerDocument;
        if (!doc) {
            return;
        }
        docElem = doc.documentElement;
        if (!jQuery.contains(docElem, elem)) {
            return box;
        }
        if (typeof elem.getBoundingClientRect !== core_strundefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
            left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
        };
    };
    jQuery.offset = {
        setOffset: function (elem, options, i) {
            var position = jQuery.css(elem, 'position');
            if (position === 'static') {
                elem.style.position = 'relative';
            }
            var curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, 'top'), curCSSLeft = jQuery.css(elem, 'left'), calculatePosition = (position === 'absolute' || position === 'fixed') && jQuery.inArray('auto', [
                    curCSSTop,
                    curCSSLeft
                ]) > -1, props = {}, curPosition = {}, curTop, curLeft;
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }
            if (options.top != null) {
                props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
                props.left = options.left - curOffset.left + curLeft;
            }
            if ('using' in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };
    jQuery.fn.extend({
        position: function () {
            if (!this[0]) {
                return;
            }
            var offsetParent, offset, parentOffset = {
                    top: 0,
                    left: 0
                }, elem = this[0];
            if (jQuery.css(elem, 'position') === 'fixed') {
                offset = elem.getBoundingClientRect();
            } else {
                offsetParent = this.offsetParent();
                offset = this.offset();
                if (!jQuery.nodeName(offsetParent[0], 'html')) {
                    parentOffset = offsetParent.offset();
                }
                parentOffset.top += jQuery.css(offsetParent[0], 'borderTopWidth', true);
                parentOffset.left += jQuery.css(offsetParent[0], 'borderLeftWidth', true);
            }
            return {
                top: offset.top - parentOffset.top - jQuery.css(elem, 'marginTop', true),
                left: offset.left - parentOffset.left - jQuery.css(elem, 'marginLeft', true)
            };
        },
        offsetParent: function () {
            return this.map(function () {
                var offsetParent = this.offsetParent || document.documentElement;
                while (offsetParent && !jQuery.nodeName(offsetParent, 'html') && jQuery.css(offsetParent, 'position') === 'static') {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document.documentElement;
            });
        }
    });
    jQuery.each({
        scrollLeft: 'pageXOffset',
        scrollTop: 'pageYOffset'
    }, function (method, prop) {
        var top = /Y/.test(prop);
        jQuery.fn[method] = function (val) {
            return jQuery.access(this, function (elem, method, val) {
                var win = getWindow(elem);
                if (val === undefined) {
                    return win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method];
                }
                if (win) {
                    win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());
                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length, null);
        };
    });
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
    }
    jQuery.each({
        Height: 'height',
        Width: 'width'
    }, function (name, type) {
        jQuery.each({
            padding: 'inner' + name,
            content: type,
            '': 'outer' + name
        }, function (defaultExtra, funcName) {
            jQuery.fn[funcName] = function (margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== 'boolean'), extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');
                return jQuery.access(this, function (elem, type, value) {
                    var doc;
                    if (jQuery.isWindow(elem)) {
                        return elem.document.documentElement['client' + name];
                    }
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;
                        return Math.max(elem.body['scroll' + name], doc['scroll' + name], elem.body['offset' + name], doc['offset' + name], doc['client' + name]);
                    }
                    return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });
    if (typeof define === 'function' && define.amd) {
        define('jquery/jquery.min', [], function () {
            return jQuery;
        });
    }
}(window));

define('jquery', ['jquery/jquery.min'], function ( main ) { return main; });

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('common/extra/jplayer/jquery.jplayer', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        if (root.jQuery) {
            factory(root.jQuery);
        } else {
            factory(root.Zepto);
        }
    }
}(this, function ($, undefined) {
    $.fn.jPlayer = function (options) {
        var name = 'jPlayer';
        var isMethodCall = typeof options === 'string', args = Array.prototype.slice.call(arguments, 1), returnValue = this;
        options = !isMethodCall && args.length ? $.extend.apply(null, [
            true,
            options
        ].concat(args)) : options;
        if (isMethodCall && options.charAt(0) === '_') {
            return returnValue;
        }
        if (isMethodCall) {
            this.each(function () {
                var instance = $(this).data(name), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : instance;
                if (methodValue !== instance && methodValue !== undefined) {
                    returnValue = methodValue;
                    return false;
                }
            });
        } else {
            this.each(function () {
                var instance = $(this).data(name);
                if (instance) {
                    instance.option(options || {});
                } else {
                    $(this).data(name, new $.jPlayer(options, this));
                }
            });
        }
        return returnValue;
    };
    $.jPlayer = function (options, element) {
        if (arguments.length) {
            this.element = $(element);
            this.options = $.extend(true, {}, this.options, options);
            var self = this;
            this.element.bind('remove.jPlayer', function () {
                self.destroy();
            });
            this._init();
        }
    };
    if (typeof $.fn.stop !== 'function') {
        $.fn.stop = function () {
        };
    }
    $.jPlayer.emulateMethods = 'load play pause';
    $.jPlayer.emulateStatus = 'src readyState networkState currentTime duration paused ended playbackRate';
    $.jPlayer.emulateOptions = 'muted volume';
    $.jPlayer.reservedEvent = 'ready flashreset resize repeat error warning';
    $.jPlayer.event = {};
    $.each([
        'ready',
        'setmedia',
        'flashreset',
        'resize',
        'repeat',
        'click',
        'error',
        'warning',
        'loadstart',
        'progress',
        'suspend',
        'abort',
        'emptied',
        'stalled',
        'play',
        'pause',
        'loadedmetadata',
        'loadeddata',
        'waiting',
        'playing',
        'canplay',
        'canplaythrough',
        'seeking',
        'seeked',
        'timeupdate',
        'ended',
        'ratechange',
        'durationchange',
        'volumechange'
    ], function () {
        $.jPlayer.event[this] = 'jPlayer_' + this;
    });
    $.jPlayer.htmlEvent = [
        'loadstart',
        'abort',
        'emptied',
        'stalled',
        'loadedmetadata',
        'canplay',
        'canplaythrough'
    ];
    $.jPlayer.pause = function () {
        $.jPlayer.prototype.destroyRemoved();
        $.each($.jPlayer.prototype.instances, function (i, element) {
            if (element.data('jPlayer').status.srcSet) {
                element.jPlayer('pause');
            }
        });
    };
    $.jPlayer.timeFormat = {
        showHour: false,
        showMin: true,
        showSec: true,
        padHour: false,
        padMin: true,
        padSec: true,
        sepHour: ':',
        sepMin: ':',
        sepSec: ''
    };
    var ConvertTime = function () {
        this.init();
    };
    ConvertTime.prototype = {
        init: function () {
            this.options = { timeFormat: $.jPlayer.timeFormat };
        },
        time: function (s) {
            s = s && typeof s === 'number' ? s : 0;
            var myTime = new Date(s * 1000), hour = myTime.getUTCHours(), min = this.options.timeFormat.showHour ? myTime.getUTCMinutes() : myTime.getUTCMinutes() + hour * 60, sec = this.options.timeFormat.showMin ? myTime.getUTCSeconds() : myTime.getUTCSeconds() + min * 60, strHour = this.options.timeFormat.padHour && hour < 10 ? '0' + hour : hour, strMin = this.options.timeFormat.padMin && min < 10 ? '0' + min : min, strSec = this.options.timeFormat.padSec && sec < 10 ? '0' + sec : sec, strTime = '';
            strTime += this.options.timeFormat.showHour ? strHour + this.options.timeFormat.sepHour : '';
            strTime += this.options.timeFormat.showMin ? strMin + this.options.timeFormat.sepMin : '';
            strTime += this.options.timeFormat.showSec ? strSec + this.options.timeFormat.sepSec : '';
            return strTime;
        }
    };
    var myConvertTime = new ConvertTime();
    $.jPlayer.convertTime = function (s) {
        return myConvertTime.time(s);
    };
    $.jPlayer.uaBrowser = function (userAgent) {
        var ua = userAgent.toLowerCase();
        var rwebkit = /(webkit)[ \/]([\w.]+)/;
        var ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
        var rmsie = /(msie) ([\w.]+)/;
        var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
        var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf('compatible') < 0 && rmozilla.exec(ua) || [];
        return {
            browser: match[1] || '',
            version: match[2] || '0'
        };
    };
    $.jPlayer.uaPlatform = function (userAgent) {
        var ua = userAgent.toLowerCase();
        var rplatform = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/;
        var rtablet = /(ipad|playbook)/;
        var randroid = /(android)/;
        var rmobile = /(mobile)/;
        var platform = rplatform.exec(ua) || [];
        var tablet = rtablet.exec(ua) || !rmobile.exec(ua) && randroid.exec(ua) || [];
        if (platform[1]) {
            platform[1] = platform[1].replace(/\s/g, '_');
        }
        return {
            platform: platform[1] || '',
            tablet: tablet[1] || ''
        };
    };
    $.jPlayer.browser = {};
    $.jPlayer.platform = {};
    var browserMatch = $.jPlayer.uaBrowser(navigator.userAgent);
    if (browserMatch.browser) {
        $.jPlayer.browser[browserMatch.browser] = true;
        $.jPlayer.browser.version = browserMatch.version;
    }
    var platformMatch = $.jPlayer.uaPlatform(navigator.userAgent);
    if (platformMatch.platform) {
        $.jPlayer.platform[platformMatch.platform] = true;
        $.jPlayer.platform.mobile = !platformMatch.tablet;
        $.jPlayer.platform.tablet = !!platformMatch.tablet;
    }
    $.jPlayer.getDocMode = function () {
        var docMode;
        if ($.jPlayer.browser.msie) {
            if (document.documentMode) {
                docMode = document.documentMode;
            } else {
                docMode = 5;
                if (document.compatMode) {
                    if (document.compatMode === 'CSS1Compat') {
                        docMode = 7;
                    }
                }
            }
        }
        return docMode;
    };
    $.jPlayer.browser.documentMode = $.jPlayer.getDocMode();
    $.jPlayer.nativeFeatures = {
        init: function () {
            var d = document, v = d.createElement('video'), spec = {
                    w3c: [
                        'fullscreenEnabled',
                        'fullscreenElement',
                        'requestFullscreen',
                        'exitFullscreen',
                        'fullscreenchange',
                        'fullscreenerror'
                    ],
                    moz: [
                        'mozFullScreenEnabled',
                        'mozFullScreenElement',
                        'mozRequestFullScreen',
                        'mozCancelFullScreen',
                        'mozfullscreenchange',
                        'mozfullscreenerror'
                    ],
                    webkit: [
                        '',
                        'webkitCurrentFullScreenElement',
                        'webkitRequestFullScreen',
                        'webkitCancelFullScreen',
                        'webkitfullscreenchange',
                        ''
                    ],
                    webkitVideo: [
                        'webkitSupportsFullscreen',
                        'webkitDisplayingFullscreen',
                        'webkitEnterFullscreen',
                        'webkitExitFullscreen',
                        '',
                        ''
                    ],
                    ms: [
                        '',
                        'msFullscreenElement',
                        'msRequestFullscreen',
                        'msExitFullscreen',
                        'MSFullscreenChange',
                        'MSFullscreenError'
                    ]
                }, specOrder = [
                    'w3c',
                    'moz',
                    'webkit',
                    'webkitVideo',
                    'ms'
                ], fs, i, il;
            this.fullscreen = fs = {
                support: {
                    w3c: !!d[spec.w3c[0]],
                    moz: !!d[spec.moz[0]],
                    webkit: typeof d[spec.webkit[3]] === 'function',
                    webkitVideo: typeof v[spec.webkitVideo[2]] === 'function',
                    ms: typeof v[spec.ms[2]] === 'function'
                },
                used: {}
            };
            for (i = 0, il = specOrder.length; i < il; i++) {
                var n = specOrder[i];
                if (fs.support[n]) {
                    fs.spec = n;
                    fs.used[n] = true;
                    break;
                }
            }
            if (fs.spec) {
                var s = spec[fs.spec];
                fs.api = {
                    fullscreenEnabled: true,
                    fullscreenElement: function (elem) {
                        elem = elem ? elem : d;
                        return elem[s[1]];
                    },
                    requestFullscreen: function (elem) {
                        return elem[s[2]]();
                    },
                    exitFullscreen: function (elem) {
                        elem = elem ? elem : d;
                        return elem[s[3]]();
                    }
                };
                fs.event = {
                    fullscreenchange: s[4],
                    fullscreenerror: s[5]
                };
            } else {
                fs.api = {
                    fullscreenEnabled: false,
                    fullscreenElement: function () {
                        return null;
                    },
                    requestFullscreen: function () {
                    },
                    exitFullscreen: function () {
                    }
                };
                fs.event = {};
            }
        }
    };
    $.jPlayer.nativeFeatures.init();
    $.jPlayer.focus = null;
    $.jPlayer.keyIgnoreElementNames = 'A INPUT TEXTAREA SELECT BUTTON';
    var keyBindings = function (event) {
        var f = $.jPlayer.focus, ignoreKey;
        if (f) {
            $.each($.jPlayer.keyIgnoreElementNames.split(/\s+/g), function (i, name) {
                if (event.target.nodeName.toUpperCase() === name.toUpperCase()) {
                    ignoreKey = true;
                    return false;
                }
            });
            if (!ignoreKey) {
                $.each(f.options.keyBindings, function (action, binding) {
                    if (binding && $.isFunction(binding.fn) && (typeof binding.key === 'number' && event.which === binding.key || typeof binding.key === 'string' && event.key === binding.key)) {
                        event.preventDefault();
                        binding.fn(f);
                        return false;
                    }
                });
            }
        }
    };
    $.jPlayer.keys = function (en) {
        var event = 'keydown.jPlayer';
        $(document.documentElement).unbind(event);
        if (en) {
            $(document.documentElement).bind(event, keyBindings);
        }
    };
    $.jPlayer.keys(true);
    $.jPlayer.prototype = {
        count: 0,
        version: {
            script: '2.9.2',
            needFlash: '2.9.0',
            flash: 'unknown'
        },
        options: {
            swfPath: 'js',
            solution: 'html, flash',
            supplied: 'mp3',
            auroraFormats: 'wav',
            preload: 'metadata',
            volume: 0.8,
            muted: false,
            remainingDuration: false,
            toggleDuration: false,
            captureDuration: true,
            playbackRate: 1,
            defaultPlaybackRate: 1,
            minPlaybackRate: 0.5,
            maxPlaybackRate: 4,
            wmode: 'opaque',
            backgroundColor: '#000000',
            cssSelectorAncestor: '#jp_container_1',
            cssSelector: {
                videoPlay: '.jp-video-play',
                play: '.jp-play',
                pause: '.jp-pause',
                stop: '.jp-stop',
                seekBar: '.jp-seek-bar',
                playBar: '.jp-play-bar',
                playBall: '.jp-play-ball',
                mute: '.jp-mute',
                unmute: '.jp-unmute',
                volumeBar: '.jp-volume-bar',
                volumeBarValue: '.jp-volume-bar-value',
                volumeMax: '.jp-volume-max',
                playbackRateBar: '.jp-playback-rate-bar',
                playbackRateBarValue: '.jp-playback-rate-bar-value',
                currentTime: '.jp-current-time',
                duration: '.jp-duration',
                title: '.jp-title',
                fullScreen: '.jp-full-screen',
                restoreScreen: '.jp-restore-screen',
                repeat: '.jp-repeat',
                repeatOff: '.jp-repeat-off',
                gui: '.jp-gui',
                noSolution: '.jp-no-solution'
            },
            stateClass: {
                playing: 'jp-state-playing',
                seeking: 'jp-state-seeking',
                muted: 'jp-state-muted',
                looped: 'jp-state-looped',
                fullScreen: 'jp-state-full-screen',
                noVolume: 'jp-state-no-volume'
            },
            useStateClassSkin: false,
            autoBlur: true,
            smoothPlayBar: false,
            fullScreen: false,
            fullWindow: false,
            autohide: {
                restored: false,
                full: true,
                fadeIn: 200,
                fadeOut: 600,
                hold: 1000
            },
            loop: false,
            repeat: function (event) {
                if (event.jPlayer.options.loop) {
                    $(this).unbind('.jPlayerRepeat').bind($.jPlayer.event.ended + '.jPlayer.jPlayerRepeat', function () {
                        $(this).jPlayer('play');
                    });
                } else {
                    $(this).unbind('.jPlayerRepeat');
                }
            },
            nativeVideoControls: {},
            noFullWindow: {
                msie: /msie [0-6]\./,
                ipad: /ipad.*?os [0-4]\./,
                iphone: /iphone/,
                ipod: /ipod/,
                android_pad: /android [0-3]\.(?!.*?mobile)/,
                android_phone: /(?=.*android)(?!.*chrome)(?=.*mobile)/,
                blackberry: /blackberry/,
                windows_ce: /windows ce/,
                iemobile: /iemobile/,
                webos: /webos/
            },
            noVolume: {
                ipad: /ipad/,
                iphone: /iphone/,
                ipod: /ipod/,
                android_pad: /android(?!.*?mobile)/,
                android_phone: /android.*?mobile/,
                blackberry: /blackberry/,
                windows_ce: /windows ce/,
                iemobile: /iemobile/,
                webos: /webos/,
                playbook: /playbook/
            },
            timeFormat: {},
            keyEnabled: false,
            audioFullScreen: false,
            keyBindings: {
                play: {
                    key: 80,
                    fn: function (f) {
                        if (f.status.paused) {
                            f.play();
                        } else {
                            f.pause();
                        }
                    }
                },
                fullScreen: {
                    key: 70,
                    fn: function (f) {
                        if (f.status.video || f.options.audioFullScreen) {
                            f._setOption('fullScreen', !f.options.fullScreen);
                        }
                    }
                },
                muted: {
                    key: 77,
                    fn: function (f) {
                        f._muted(!f.options.muted);
                    }
                },
                volumeUp: {
                    key: 190,
                    fn: function (f) {
                        f.volume(f.options.volume + 0.1);
                    }
                },
                volumeDown: {
                    key: 188,
                    fn: function (f) {
                        f.volume(f.options.volume - 0.1);
                    }
                },
                loop: {
                    key: 76,
                    fn: function (f) {
                        f._loop(!f.options.loop);
                    }
                }
            },
            verticalVolume: false,
            verticalPlaybackRate: false,
            globalVolume: false,
            idPrefix: 'jp',
            noConflict: 'jQuery',
            emulateHtml: false,
            consoleAlerts: true,
            errorAlerts: false,
            warningAlerts: false
        },
        optionsAudio: {
            size: {
                width: '0px',
                height: '0px',
                cssClass: ''
            },
            sizeFull: {
                width: '0px',
                height: '0px',
                cssClass: ''
            }
        },
        optionsVideo: {
            size: {
                width: '480px',
                height: '270px',
                cssClass: 'jp-video-270p'
            },
            sizeFull: {
                width: '100%',
                height: '100%',
                cssClass: 'jp-video-full'
            }
        },
        instances: {},
        status: {
            src: '',
            media: {},
            paused: true,
            format: {},
            formatType: '',
            waitForPlay: true,
            waitForLoad: true,
            srcSet: false,
            video: false,
            seekPercent: 0,
            currentPercentRelative: 0,
            currentPercentAbsolute: 0,
            currentTime: 0,
            duration: 0,
            remaining: 0,
            videoWidth: 0,
            videoHeight: 0,
            readyState: 0,
            networkState: 0,
            playbackRate: 1,
            ended: 0
        },
        internal: { ready: false },
        solution: {
            html: true,
            aurora: true,
            flash: true
        },
        format: {
            amr: {
                codec: 'audio/amr-wb amr',
                flashCanPlay: true,
                media: 'audio'
            },
            mp3: {
                codec: 'audio/mpeg',
                flashCanPlay: true,
                media: 'audio'
            },
            m4a: {
                codec: 'audio/mp4; codecs="mp4a.40.2"',
                flashCanPlay: true,
                media: 'audio'
            },
            m3u8a: {
                codec: 'application/vnd.apple.mpegurl; codecs="mp4a.40.2"',
                flashCanPlay: false,
                media: 'audio'
            },
            m3ua: {
                codec: 'audio/mpegurl',
                flashCanPlay: false,
                media: 'audio'
            },
            oga: {
                codec: 'audio/ogg; codecs="vorbis, opus"',
                flashCanPlay: false,
                media: 'audio'
            },
            flac: {
                codec: 'audio/x-flac',
                flashCanPlay: false,
                media: 'audio'
            },
            wav: {
                codec: 'audio/wav; codecs="1"',
                flashCanPlay: false,
                media: 'audio'
            },
            webma: {
                codec: 'audio/webm; codecs="vorbis"',
                flashCanPlay: false,
                media: 'audio'
            },
            fla: {
                codec: 'audio/x-flv',
                flashCanPlay: true,
                media: 'audio'
            },
            rtmpa: {
                codec: 'audio/rtmp; codecs="rtmp"',
                flashCanPlay: true,
                media: 'audio'
            },
            m4v: {
                codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                flashCanPlay: true,
                media: 'video'
            },
            m3u8v: {
                codec: 'application/vnd.apple.mpegurl; codecs="avc1.42E01E, mp4a.40.2"',
                flashCanPlay: false,
                media: 'video'
            },
            m3uv: {
                codec: 'audio/mpegurl',
                flashCanPlay: false,
                media: 'video'
            },
            ogv: {
                codec: 'video/ogg; codecs="theora, vorbis"',
                flashCanPlay: false,
                media: 'video'
            },
            webmv: {
                codec: 'video/webm; codecs="vorbis, vp8"',
                flashCanPlay: false,
                media: 'video'
            },
            flv: {
                codec: 'video/x-flv',
                flashCanPlay: true,
                media: 'video'
            },
            rtmpv: {
                codec: 'video/rtmp; codecs="rtmp"',
                flashCanPlay: true,
                media: 'video'
            }
        },
        _init: function () {
            var self = this;
            this.element.empty();
            this.status = $.extend({}, this.status);
            this.internal = $.extend({}, this.internal);
            this.options.timeFormat = $.extend({}, $.jPlayer.timeFormat, this.options.timeFormat);
            this.internal.cmdsIgnored = $.jPlayer.platform.ipad || $.jPlayer.platform.iphone || $.jPlayer.platform.ipod;
            this.internal.domNode = this.element.get(0);
            if (this.options.keyEnabled && !$.jPlayer.focus) {
                $.jPlayer.focus = this;
            }
            this.androidFix = {
                setMedia: false,
                play: false,
                pause: false,
                time: NaN
            };
            if ($.jPlayer.platform.android) {
                this.options.preload = this.options.preload !== 'auto' ? 'metadata' : 'auto';
            }
            this.formats = [];
            this.solutions = [];
            this.require = {};
            this.htmlElement = {};
            this.html = {};
            this.html.audio = {};
            this.html.video = {};
            this.aurora = {};
            this.aurora.formats = [];
            this.aurora.properties = [];
            this.flash = {};
            this.css = {};
            this.css.cs = {};
            this.css.jq = {};
            this.ancestorJq = [];
            this.options.volume = this._limitValue(this.options.volume, 0, 1);
            $.each(this.options.supplied.toLowerCase().split(','), function (index1, value1) {
                var format = value1.replace(/^\s+|\s+$/g, '');
                if (self.format[format]) {
                    var dupFound = false;
                    $.each(self.formats, function (index2, value2) {
                        if (format === value2) {
                            dupFound = true;
                            return false;
                        }
                    });
                    if (!dupFound) {
                        self.formats.push(format);
                    }
                }
            });
            $.each(this.options.solution.toLowerCase().split(','), function (index1, value1) {
                var solution = value1.replace(/^\s+|\s+$/g, '');
                if (self.solution[solution]) {
                    var dupFound = false;
                    $.each(self.solutions, function (index2, value2) {
                        if (solution === value2) {
                            dupFound = true;
                            return false;
                        }
                    });
                    if (!dupFound) {
                        self.solutions.push(solution);
                    }
                }
            });
            $.each(this.options.auroraFormats.toLowerCase().split(','), function (index1, value1) {
                var format = value1.replace(/^\s+|\s+$/g, '');
                if (self.format[format]) {
                    var dupFound = false;
                    $.each(self.aurora.formats, function (index2, value2) {
                        if (format === value2) {
                            dupFound = true;
                            return false;
                        }
                    });
                    if (!dupFound) {
                        self.aurora.formats.push(format);
                    }
                }
            });
            this.internal.instance = 'jp_' + this.count;
            this.instances[this.internal.instance] = this.element;
            if (!this.element.attr('id')) {
                this.element.attr('id', this.options.idPrefix + '_jplayer_' + this.count);
            }
            this.internal.self = $.extend({}, {
                id: this.element.attr('id'),
                jq: this.element
            });
            this.internal.audio = $.extend({}, {
                id: this.options.idPrefix + '_audio_' + this.count,
                jq: undefined
            });
            this.internal.video = $.extend({}, {
                id: this.options.idPrefix + '_video_' + this.count,
                jq: undefined
            });
            this.internal.flash = $.extend({}, {
                id: this.options.idPrefix + '_flash_' + this.count,
                jq: undefined,
                swf: this.options.swfPath + (this.options.swfPath.toLowerCase().slice(-4) !== '.swf' ? (this.options.swfPath && this.options.swfPath.slice(-1) !== '/' ? '/' : '') + 'jquery.jplayer.swf' : '')
            });
            this.internal.poster = $.extend({}, {
                id: this.options.idPrefix + '_poster_' + this.count,
                jq: undefined
            });
            $.each($.jPlayer.event, function (eventName, eventType) {
                if (self.options[eventName] !== undefined) {
                    self.element.bind(eventType + '.jPlayer', self.options[eventName]);
                    self.options[eventName] = undefined;
                }
            });
            this.require.audio = false;
            this.require.video = false;
            $.each(this.formats, function (priority, format) {
                self.require[self.format[format].media] = true;
            });
            if (this.require.video) {
                this.options = $.extend(true, {}, this.optionsVideo, this.options);
            } else {
                this.options = $.extend(true, {}, this.optionsAudio, this.options);
            }
            this._setSize();
            this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
            this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
            this.status.noVolume = this._uaBlocklist(this.options.noVolume);
            if ($.jPlayer.nativeFeatures.fullscreen.api.fullscreenEnabled) {
                this._fullscreenAddEventListeners();
            }
            this._restrictNativeVideoControls();
            this.htmlElement.poster = document.createElement('img');
            this.htmlElement.poster.id = this.internal.poster.id;
            this.htmlElement.poster.onload = function () {
                if (!self.status.video || self.status.waitForPlay) {
                    self.internal.poster.jq.show();
                }
            };
            this.element.append(this.htmlElement.poster);
            this.internal.poster.jq = $('#' + this.internal.poster.id);
            this.internal.poster.jq.css({
                'width': this.status.width,
                'height': this.status.height
            });
            this.internal.poster.jq.hide();
            this.internal.poster.jq.bind('click.jPlayer', function () {
                self._trigger($.jPlayer.event.click);
            });
            this.html.audio.available = false;
            if (this.require.audio) {
                this.htmlElement.audio = document.createElement('audio');
                this.htmlElement.audio.id = this.internal.audio.id;
                this.html.audio.available = !!this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio);
            }
            this.html.video.available = false;
            if (this.require.video) {
                this.htmlElement.video = document.createElement('video');
                this.htmlElement.video.id = this.internal.video.id;
                this.html.video.available = !!this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video);
            }
            this.flash.available = this._checkForFlash(10.1);
            this.html.canPlay = {};
            this.aurora.canPlay = {};
            this.flash.canPlay = {};
            $.each(this.formats, function (priority, format) {
                self.html.canPlay[format] = self.html[self.format[format].media].available && '' !== self.htmlElement[self.format[format].media].canPlayType(self.format[format].codec);
                self.aurora.canPlay[format] = $.inArray(format, self.aurora.formats) > -1;
                self.flash.canPlay[format] = self.format[format].flashCanPlay && self.flash.available;
            });
            this.html.desired = false;
            this.aurora.desired = false;
            this.flash.desired = false;
            $.each(this.solutions, function (solutionPriority, solution) {
                if (solutionPriority === 0) {
                    self[solution].desired = true;
                } else {
                    var audioCanPlay = false;
                    var videoCanPlay = false;
                    $.each(self.formats, function (formatPriority, format) {
                        if (self[self.solutions[0]].canPlay[format]) {
                            if (self.format[format].media === 'video') {
                                videoCanPlay = true;
                            } else {
                                audioCanPlay = true;
                            }
                        }
                    });
                    self[solution].desired = self.require.audio && !audioCanPlay || self.require.video && !videoCanPlay;
                }
            });
            this.html.support = {};
            this.aurora.support = {};
            this.flash.support = {};
            $.each(this.formats, function (priority, format) {
                self.html.support[format] = self.html.canPlay[format] && self.html.desired;
                self.aurora.support[format] = self.aurora.canPlay[format] && self.aurora.desired;
                self.flash.support[format] = self.flash.canPlay[format] && self.flash.desired;
            });
            this.html.used = false;
            this.aurora.used = false;
            this.flash.used = false;
            $.each(this.solutions, function (solutionPriority, solution) {
                $.each(self.formats, function (formatPriority, format) {
                    if (self[solution].support[format]) {
                        self[solution].used = true;
                        return false;
                    }
                });
            });
            this._resetActive();
            this._resetGate();
            this._cssSelectorAncestor(this.options.cssSelectorAncestor);
            if (!(this.html.used || this.aurora.used || this.flash.used)) {
                this._error({
                    type: $.jPlayer.error.NO_SOLUTION,
                    context: '{solution:\'' + this.options.solution + '\', supplied:\'' + this.options.supplied + '\'}',
                    message: $.jPlayer.errorMsg.NO_SOLUTION,
                    hint: $.jPlayer.errorHint.NO_SOLUTION
                });
                if (this.css.jq.noSolution.length) {
                    this.css.jq.noSolution.show();
                }
            } else {
                if (this.css.jq.noSolution.length) {
                    this.css.jq.noSolution.hide();
                }
            }
            if (this.flash.used) {
                var htmlObj, flashVars = 'jQuery=' + encodeURI(this.options.noConflict) + '&id=' + encodeURI(this.internal.self.id) + '&vol=' + this.options.volume + '&muted=' + this.options.muted;
                if ($.jPlayer.browser.msie && (Number($.jPlayer.browser.version) < 9 || $.jPlayer.browser.documentMode < 9)) {
                    var objStr = '<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0" tabindex="-1"></object>';
                    var paramStr = [
                            '<param name="movie" value="' + this.internal.flash.swf + '" />',
                            '<param name="FlashVars" value="' + flashVars + '" />',
                            '<param name="allowScriptAccess" value="always" />',
                            '<param name="bgcolor" value="' + this.options.backgroundColor + '" />',
                            '<param name="wmode" value="' + this.options.wmode + '" />'
                        ];
                    htmlObj = document.createElement(objStr);
                    for (var i = 0; i < paramStr.length; i++) {
                        htmlObj.appendChild(document.createElement(paramStr[i]));
                    }
                } else {
                    var createParam = function (el, n, v) {
                        var p = document.createElement('param');
                        p.setAttribute('name', n);
                        p.setAttribute('value', v);
                        el.appendChild(p);
                    };
                    htmlObj = document.createElement('object');
                    htmlObj.setAttribute('id', this.internal.flash.id);
                    htmlObj.setAttribute('name', this.internal.flash.id);
                    htmlObj.setAttribute('data', this.internal.flash.swf);
                    htmlObj.setAttribute('type', 'application/x-shockwave-flash');
                    htmlObj.setAttribute('width', '1');
                    htmlObj.setAttribute('height', '1');
                    htmlObj.setAttribute('tabindex', '-1');
                    createParam(htmlObj, 'flashvars', flashVars);
                    createParam(htmlObj, 'allowscriptaccess', 'always');
                    createParam(htmlObj, 'bgcolor', this.options.backgroundColor);
                    createParam(htmlObj, 'wmode', this.options.wmode);
                }
                this.element.append(htmlObj);
                this.internal.flash.jq = $(htmlObj);
            }
            if (this.html.used && !this.flash.used) {
                this.status.playbackRateEnabled = this._testPlaybackRate('audio');
            } else {
                this.status.playbackRateEnabled = false;
            }
            this._updatePlaybackRate();
            if (this.html.used) {
                if (this.html.audio.available) {
                    this._addHtmlEventListeners(this.htmlElement.audio, this.html.audio);
                    this.element.append(this.htmlElement.audio);
                    this.internal.audio.jq = $('#' + this.internal.audio.id);
                }
                if (this.html.video.available) {
                    this._addHtmlEventListeners(this.htmlElement.video, this.html.video);
                    this.element.append(this.htmlElement.video);
                    this.internal.video.jq = $('#' + this.internal.video.id);
                    if (this.status.nativeVideoControls) {
                        this.internal.video.jq.css({
                            'width': this.status.width,
                            'height': this.status.height
                        });
                    } else {
                        this.internal.video.jq.css({
                            'width': '0px',
                            'height': '0px'
                        });
                    }
                    this.internal.video.jq.bind('click.jPlayer', function () {
                        self._trigger($.jPlayer.event.click);
                    });
                }
            }
            if (this.aurora.used) {
            }
            if (this.options.emulateHtml) {
                this._emulateHtmlBridge();
            }
            if ((this.html.used || this.aurora.used) && !this.flash.used) {
                setTimeout(function () {
                    self.internal.ready = true;
                    self.version.flash = 'n/a';
                    self._trigger($.jPlayer.event.repeat);
                    self._trigger($.jPlayer.event.ready);
                }, 100);
            }
            this._updateNativeVideoControls();
            if (this.css.jq.videoPlay.length) {
                this.css.jq.videoPlay.hide();
            }
            $.jPlayer.prototype.count++;
        },
        destroy: function () {
            this.clearMedia();
            this._removeUiClass();
            if (this.css.jq.currentTime.length) {
                this.css.jq.currentTime.text('');
            }
            if (this.css.jq.duration.length) {
                this.css.jq.duration.text('');
            }
            $.each(this.css.jq, function (fn, jq) {
                if (jq.length) {
                    jq.unbind('.jPlayer');
                }
            });
            this.internal.poster.jq.unbind('.jPlayer');
            if (this.internal.video.jq) {
                this.internal.video.jq.unbind('.jPlayer');
            }
            this._fullscreenRemoveEventListeners();
            if (this === $.jPlayer.focus) {
                $.jPlayer.focus = null;
            }
            if (this.options.emulateHtml) {
                this._destroyHtmlBridge();
            }
            this.element.removeData('jPlayer');
            this.element.unbind('.jPlayer');
            this.element.empty();
            delete this.instances[this.internal.instance];
        },
        destroyRemoved: function () {
            var self = this;
            $.each(this.instances, function (i, element) {
                if (self.element !== element) {
                    if (!element.data('jPlayer')) {
                        element.jPlayer('destroy');
                        delete self.instances[i];
                    }
                }
            });
        },
        enable: function () {
        },
        disable: function () {
        },
        _testCanPlayType: function (elem) {
            try {
                elem.canPlayType(this.format.mp3.codec);
                return true;
            } catch (err) {
                return false;
            }
        },
        _testPlaybackRate: function (type) {
            var el, rate = 0.5;
            type = typeof type === 'string' ? type : 'audio';
            el = document.createElement(type);
            try {
                if ('playbackRate' in el) {
                    el.playbackRate = rate;
                    return el.playbackRate === rate;
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        },
        _uaBlocklist: function (list) {
            var ua = navigator.userAgent.toLowerCase(), block = false;
            $.each(list, function (p, re) {
                if (re && re.test(ua)) {
                    block = true;
                    return false;
                }
            });
            return block;
        },
        _restrictNativeVideoControls: function () {
            if (this.require.audio) {
                if (this.status.nativeVideoControls) {
                    this.status.nativeVideoControls = false;
                    this.status.noFullWindow = true;
                }
            }
        },
        _updateNativeVideoControls: function () {
            if (this.html.video.available && this.html.used) {
                this.htmlElement.video.controls = this.status.nativeVideoControls;
                this._updateAutohide();
                if (this.status.nativeVideoControls && this.require.video) {
                    this.internal.poster.jq.hide();
                    this.internal.video.jq.css({
                        'width': this.status.width,
                        'height': this.status.height
                    });
                } else if (this.status.waitForPlay && this.status.video) {
                    this.internal.poster.jq.show();
                    this.internal.video.jq.css({
                        'width': '0px',
                        'height': '0px'
                    });
                }
            }
        },
        _addHtmlEventListeners: function (mediaElement, entity) {
            var self = this;
            mediaElement.preload = this.options.preload;
            mediaElement.muted = this.options.muted;
            mediaElement.volume = this.options.volume;
            if (this.status.playbackRateEnabled) {
                mediaElement.defaultPlaybackRate = this.options.defaultPlaybackRate;
                mediaElement.playbackRate = this.options.playbackRate;
            }
            mediaElement.addEventListener('progress', function () {
                if (entity.gate) {
                    if (self.internal.cmdsIgnored && this.readyState > 0) {
                        self.internal.cmdsIgnored = false;
                    }
                    self._getHtmlStatus(mediaElement);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.progress);
                }
            }, false);
            mediaElement.addEventListener('loadeddata', function () {
                if (entity.gate) {
                    self.androidFix.setMedia = false;
                    if (self.androidFix.play) {
                        self.androidFix.play = false;
                        self.play(self.androidFix.time);
                    }
                    if (self.androidFix.pause) {
                        self.androidFix.pause = false;
                        self.pause(self.androidFix.time);
                    }
                    self._trigger($.jPlayer.event.loadeddata);
                }
            }, false);
            mediaElement.addEventListener('timeupdate', function () {
                if (entity.gate) {
                    self._getHtmlStatus(mediaElement);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.timeupdate);
                }
            }, false);
            mediaElement.addEventListener('durationchange', function () {
                if (entity.gate) {
                    self._getHtmlStatus(mediaElement);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.durationchange);
                }
            }, false);
            mediaElement.addEventListener('play', function () {
                if (entity.gate) {
                    self._updateButtons(true);
                    self._html_checkWaitForPlay();
                    self._trigger($.jPlayer.event.play);
                }
            }, false);
            mediaElement.addEventListener('playing', function () {
                if (entity.gate) {
                    self._updateButtons(true);
                    self._seeked();
                    self._trigger($.jPlayer.event.playing);
                }
            }, false);
            mediaElement.addEventListener('pause', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._trigger($.jPlayer.event.pause);
                }
            }, false);
            mediaElement.addEventListener('waiting', function () {
                if (entity.gate) {
                    self._seeking();
                    self._trigger($.jPlayer.event.waiting);
                }
            }, false);
            mediaElement.addEventListener('seeking', function () {
                if (entity.gate) {
                    self._seeking();
                    self._trigger($.jPlayer.event.seeking);
                }
            }, false);
            mediaElement.addEventListener('seeked', function () {
                if (entity.gate) {
                    self._seeked();
                    self._trigger($.jPlayer.event.seeked);
                }
            }, false);
            mediaElement.addEventListener('volumechange', function () {
                if (entity.gate) {
                    self.options.volume = mediaElement.volume;
                    self.options.muted = mediaElement.muted;
                    self._updateMute();
                    self._updateVolume();
                    self._trigger($.jPlayer.event.volumechange);
                }
            }, false);
            mediaElement.addEventListener('ratechange', function () {
                if (entity.gate) {
                    self.options.defaultPlaybackRate = mediaElement.defaultPlaybackRate;
                    self.options.playbackRate = mediaElement.playbackRate;
                    self._updatePlaybackRate();
                    self._trigger($.jPlayer.event.ratechange);
                }
            }, false);
            mediaElement.addEventListener('suspend', function () {
                if (entity.gate) {
                    self._seeked();
                    self._trigger($.jPlayer.event.suspend);
                }
            }, false);
            mediaElement.addEventListener('ended', function () {
                if (entity.gate) {
                    if (!$.jPlayer.browser.webkit) {
                        self.htmlElement.media.currentTime = 0;
                    }
                    self.htmlElement.media.pause();
                    self._updateButtons(false);
                    self._getHtmlStatus(mediaElement, true);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.ended);
                }
            }, false);
            mediaElement.addEventListener('error', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._seeked();
                    if (self.status.srcSet) {
                        clearTimeout(self.internal.htmlDlyCmdId);
                        self.status.waitForLoad = true;
                        self.status.waitForPlay = true;
                        if (self.status.video && !self.status.nativeVideoControls) {
                            self.internal.video.jq.css({
                                'width': '0px',
                                'height': '0px'
                            });
                        }
                        if (self._validString(self.status.media.poster) && !self.status.nativeVideoControls) {
                            self.internal.poster.jq.show();
                        }
                        if (self.css.jq.videoPlay.length) {
                            self.css.jq.videoPlay.show();
                        }
                        self._error({
                            type: $.jPlayer.error.URL,
                            context: self.status.src,
                            message: $.jPlayer.errorMsg.URL,
                            hint: $.jPlayer.errorHint.URL
                        });
                    }
                }
            }, false);
            $.each($.jPlayer.htmlEvent, function (i, eventType) {
                mediaElement.addEventListener(this, function () {
                    if (entity.gate) {
                        self._trigger($.jPlayer.event[eventType]);
                    }
                }, false);
            });
        },
        _addAuroraEventListeners: function (player, entity) {
            var self = this;
            player.volume = this.options.volume * 100;
            player.on('progress', function () {
                if (entity.gate) {
                    if (self.internal.cmdsIgnored && this.readyState > 0) {
                        self.internal.cmdsIgnored = false;
                    }
                    self._getAuroraStatus(player);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.progress);
                    if (player.duration > 0) {
                        self._trigger($.jPlayer.event.timeupdate);
                    }
                }
            }, false);
            player.on('ready', function () {
                if (entity.gate) {
                    self._trigger($.jPlayer.event.loadeddata);
                }
            }, false);
            player.on('duration', function () {
                if (entity.gate) {
                    self._getAuroraStatus(player);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.durationchange);
                }
            }, false);
            player.on('end', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._getAuroraStatus(player, true);
                    self._updateInterface();
                    self._trigger($.jPlayer.event.ended);
                }
            }, false);
            player.on('error', function () {
                if (entity.gate) {
                    self._updateButtons(false);
                    self._seeked();
                    if (self.status.srcSet) {
                        self.status.waitForLoad = true;
                        self.status.waitForPlay = true;
                        if (self.status.video && !self.status.nativeVideoControls) {
                            self.internal.video.jq.css({
                                'width': '0px',
                                'height': '0px'
                            });
                        }
                        if (self._validString(self.status.media.poster) && !self.status.nativeVideoControls) {
                            self.internal.poster.jq.show();
                        }
                        if (self.css.jq.videoPlay.length) {
                            self.css.jq.videoPlay.show();
                        }
                        self._error({
                            type: $.jPlayer.error.URL,
                            context: self.status.src,
                            message: $.jPlayer.errorMsg.URL,
                            hint: $.jPlayer.errorHint.URL
                        });
                    }
                }
            }, false);
        },
        _getHtmlStatus: function (media, override) {
            var ct = 0, cpa = 0, sp = 0, cpr = 0;
            if (isFinite(media.duration)) {
                this.status.duration = media.duration;
            }
            ct = media.currentTime;
            cpa = this.status.duration > 0 ? 100 * ct / this.status.duration : 0;
            if (typeof media.seekable === 'object' && media.seekable.length > 0) {
                sp = this.status.duration > 0 ? 100 * media.seekable.end(media.seekable.length - 1) / this.status.duration : 100;
                cpr = this.status.duration > 0 ? 100 * media.currentTime / media.seekable.end(media.seekable.length - 1) : 0;
                sp = 100;
                cpr = this.status.duration > 0 ? 100 * media.currentTime / this.status.duration : 0;
            } else {
                sp = 100;
                cpr = cpa;
            }
            if (override) {
                ct = 0;
                cpr = 0;
                cpa = 0;
            }
            this.status.seekPercent = sp;
            this.status.currentPercentRelative = cpr;
            this.status.currentPercentAbsolute = cpa;
            this.status.currentTime = ct;
            this.status.remaining = this.status.duration - this.status.currentTime;
            this.status.videoWidth = media.videoWidth;
            this.status.videoHeight = media.videoHeight;
            this.status.readyState = media.readyState;
            this.status.networkState = media.networkState;
            this.status.playbackRate = media.playbackRate;
            this.status.ended = media.ended;
        },
        _getAuroraStatus: function (player, override) {
            var ct = 0, cpa = 0, sp = 0, cpr = 0;
            this.status.duration = player.duration / 1000;
            ct = player.currentTime / 1000;
            cpa = this.status.duration > 0 ? 100 * ct / this.status.duration : 0;
            if (player.buffered > 0) {
                sp = this.status.duration > 0 ? player.buffered * this.status.duration / this.status.duration : 100;
                cpr = this.status.duration > 0 ? ct / (player.buffered * this.status.duration) : 0;
            } else {
                sp = 100;
                cpr = cpa;
            }
            if (override) {
                ct = 0;
                cpr = 0;
                cpa = 0;
            }
            this.status.seekPercent = sp;
            this.status.currentPercentRelative = cpr;
            this.status.currentPercentAbsolute = cpa;
            this.status.currentTime = ct;
            this.status.remaining = this.status.duration - this.status.currentTime;
            this.status.readyState = 4;
            this.status.networkState = 0;
            this.status.playbackRate = 1;
            this.status.ended = false;
        },
        _resetStatus: function () {
            this.status = $.extend({}, this.status, $.jPlayer.prototype.status);
        },
        _trigger: function (eventType, error, warning) {
            var event = $.Event(eventType);
            event.jPlayer = {};
            event.jPlayer.version = $.extend({}, this.version);
            event.jPlayer.options = $.extend(true, {}, this.options);
            event.jPlayer.status = $.extend(true, {}, this.status);
            event.jPlayer.html = $.extend(true, {}, this.html);
            event.jPlayer.aurora = $.extend(true, {}, this.aurora);
            event.jPlayer.flash = $.extend(true, {}, this.flash);
            if (error) {
                event.jPlayer.error = $.extend({}, error);
            }
            if (warning) {
                event.jPlayer.warning = $.extend({}, warning);
            }
            this.element.trigger(event);
        },
        jPlayerFlashEvent: function (eventType, status) {
            if (eventType === $.jPlayer.event.ready) {
                if (!this.internal.ready) {
                    this.internal.ready = true;
                    this.internal.flash.jq.css({
                        'width': '0px',
                        'height': '0px'
                    });
                    this.version.flash = status.version;
                    if (this.version.needFlash !== this.version.flash) {
                        this._error({
                            type: $.jPlayer.error.VERSION,
                            context: this.version.flash,
                            message: $.jPlayer.errorMsg.VERSION + this.version.flash,
                            hint: $.jPlayer.errorHint.VERSION
                        });
                    }
                    this._trigger($.jPlayer.event.repeat);
                    this._trigger(eventType);
                } else {
                    if (this.flash.gate) {
                        if (this.status.srcSet) {
                            var currentTime = this.status.currentTime, paused = this.status.paused;
                            this.setMedia(this.status.media);
                            this.volumeWorker(this.options.volume);
                            if (currentTime > 0) {
                                if (paused) {
                                    this.pause(currentTime);
                                } else {
                                    this.play(currentTime);
                                }
                            }
                        }
                        this._trigger($.jPlayer.event.flashreset);
                    }
                }
            }
            if (this.flash.gate) {
                switch (eventType) {
                case $.jPlayer.event.progress:
                    this._getFlashStatus(status);
                    this._updateInterface();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.timeupdate:
                    this._getFlashStatus(status);
                    this._updateInterface();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.play:
                    this._seeked();
                    this._updateButtons(true);
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.pause:
                    this._updateButtons(false);
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.ended:
                    this._updateButtons(false);
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.click:
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.error:
                    this.status.waitForLoad = true;
                    this.status.waitForPlay = true;
                    if (this.status.video) {
                        this.internal.flash.jq.css({
                            'width': '0px',
                            'height': '0px'
                        });
                    }
                    if (this._validString(this.status.media.poster)) {
                        this.internal.poster.jq.show();
                    }
                    if (this.css.jq.videoPlay.length && this.status.video) {
                        this.css.jq.videoPlay.show();
                    }
                    if (this.status.video) {
                        this._flash_setVideo(this.status.media);
                    } else {
                        this._flash_setAudio(this.status.media);
                    }
                    this._updateButtons(false);
                    this._error({
                        type: $.jPlayer.error.URL,
                        context: status.src,
                        message: $.jPlayer.errorMsg.URL,
                        hint: $.jPlayer.errorHint.URL
                    });
                    break;
                case $.jPlayer.event.seeking:
                    this._seeking();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.seeked:
                    this._seeked();
                    this._trigger(eventType);
                    break;
                case $.jPlayer.event.ready:
                    break;
                default:
                    this._trigger(eventType);
                }
            }
            return false;
        },
        _getFlashStatus: function (status) {
            this.status.seekPercent = status.seekPercent;
            this.status.currentPercentRelative = status.currentPercentRelative;
            this.status.currentPercentAbsolute = status.currentPercentAbsolute;
            this.status.currentTime = status.currentTime;
            this.status.duration = status.duration;
            this.status.remaining = status.duration - status.currentTime;
            this.status.videoWidth = status.videoWidth;
            this.status.videoHeight = status.videoHeight;
            this.status.readyState = 4;
            this.status.networkState = 0;
            this.status.playbackRate = 1;
            this.status.ended = false;
        },
        _updateButtons: function (playing) {
            if (playing === undefined) {
                playing = !this.status.paused;
            } else {
                this.status.paused = !playing;
            }
            if (playing) {
                this.addStateClass('playing');
            } else {
                this.removeStateClass('playing');
            }
            if (!this.status.noFullWindow && this.options.fullWindow) {
                this.addStateClass('fullScreen');
            } else {
                this.removeStateClass('fullScreen');
            }
            if (this.options.loop) {
                this.addStateClass('looped');
            } else {
                this.removeStateClass('looped');
            }
            if (this.css.jq.play.length && this.css.jq.pause.length) {
                if (playing) {
                    this.css.jq.play.hide();
                    this.css.jq.pause.show();
                } else {
                    this.css.jq.play.show();
                    this.css.jq.pause.hide();
                }
            }
            if (this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length) {
                if (this.status.noFullWindow) {
                    this.css.jq.fullScreen.hide();
                    this.css.jq.restoreScreen.hide();
                } else if (this.options.fullWindow) {
                    this.css.jq.fullScreen.hide();
                    this.css.jq.restoreScreen.show();
                } else {
                    this.css.jq.fullScreen.show();
                    this.css.jq.restoreScreen.hide();
                }
            }
            if (this.css.jq.repeat.length && this.css.jq.repeatOff.length) {
                if (this.options.loop) {
                    this.css.jq.repeat.hide();
                    this.css.jq.repeatOff.show();
                } else {
                    this.css.jq.repeat.show();
                    this.css.jq.repeatOff.hide();
                }
            }
        },
        _updateInterface: function () {
            if (this.css.jq.seekBar.length) {
                this.css.jq.seekBar.width(this.status.seekPercent + '%');
            }
            if (this.css.jq.playBar.length) {
                if (this.options.smoothPlayBar) {
                    this.css.jq.playBar.stop().animate({ width: this.status.currentPercentAbsolute + '%' }, 250, 'linear');
                    this.css.jq.playBall.stop().animate({ left: this.status.currentPercentAbsolute + '%' }, 250, 'linear');
                } else {
                    this.css.jq.playBar.width(this.status.currentPercentRelative + '%');
                    this.css.jq.playBall.scrollLeft(this.status.currentPercentRelative + '%');
                }
            }
            var currentTimeText = '';
            if (this.css.jq.currentTime.length) {
                currentTimeText = this._convertTime(this.status.currentTime);
                if (currentTimeText !== this.css.jq.currentTime.text()) {
                    this.css.jq.currentTime.text(this._convertTime(this.status.currentTime));
                }
            }
            var durationText = '', duration = this.status.duration, remaining = this.status.remaining;
            if (this.css.jq.duration.length) {
                if (typeof this.status.media.duration === 'string') {
                    durationText = this.status.media.duration;
                } else {
                    if (typeof this.status.media.duration === 'number') {
                        duration = this.status.media.duration;
                        remaining = duration - this.status.currentTime;
                    }
                    if (this.options.remainingDuration) {
                        durationText = (remaining > 0 ? '-' : '') + this._convertTime(remaining);
                    } else {
                        durationText = this._convertTime(duration);
                    }
                }
                if (durationText !== this.css.jq.duration.text()) {
                    this.css.jq.duration.text(durationText);
                }
            }
        },
        _convertTime: ConvertTime.prototype.time,
        _seeking: function () {
            if (this.css.jq.seekBar.length) {
                this.css.jq.seekBar.addClass('jp-seeking-bg');
            }
            this.addStateClass('seeking');
        },
        _seeked: function () {
            if (this.css.jq.seekBar.length) {
                this.css.jq.seekBar.removeClass('jp-seeking-bg');
            }
            this.removeStateClass('seeking');
        },
        _resetGate: function () {
            this.html.audio.gate = false;
            this.html.video.gate = false;
            this.aurora.gate = false;
            this.flash.gate = false;
        },
        _resetActive: function () {
            this.html.active = false;
            this.aurora.active = false;
            this.flash.active = false;
        },
        _escapeHtml: function (s) {
            return s.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
        },
        _qualifyURL: function (url) {
            var el = document.createElement('div');
            el.innerHTML = '<a href="' + this._escapeHtml(url) + '">x</a>';
            return el.firstChild.href;
        },
        _absoluteMediaUrls: function (media) {
            var self = this;
            $.each(media, function (type, url) {
                if (url && self.format[type] && url.substr(0, 5) !== 'data:') {
                    media[type] = self._qualifyURL(url);
                }
            });
            return media;
        },
        addStateClass: function (state) {
            if (this.ancestorJq.length) {
                this.ancestorJq.addClass(this.options.stateClass[state]);
            }
        },
        removeStateClass: function (state) {
            if (this.ancestorJq.length) {
                this.ancestorJq.removeClass(this.options.stateClass[state]);
            }
        },
        setMedia: function (media) {
            var self = this, supported = false, posterChanged = this.status.media.poster !== media.poster;
            this._resetMedia();
            this._resetGate();
            this._resetActive();
            this.androidFix.setMedia = false;
            this.androidFix.play = false;
            this.androidFix.pause = false;
            media = this._absoluteMediaUrls(media);
            $.each(this.formats, function (formatPriority, format) {
                var isVideo = self.format[format].media === 'video';
                $.each(self.solutions, function (solutionPriority, solution) {
                    if (self[solution].support[format] && self._validString(media[format])) {
                        var isHtml = solution === 'html';
                        var isAurora = solution === 'aurora';
                        if (isVideo) {
                            if (isHtml) {
                                self.html.video.gate = true;
                                self._html_setVideo(media);
                                self.html.active = true;
                            } else {
                                self.flash.gate = true;
                                self._flash_setVideo(media);
                                self.flash.active = true;
                            }
                            if (self.css.jq.videoPlay.length) {
                                self.css.jq.videoPlay.show();
                            }
                            self.status.video = true;
                        } else {
                            if (isHtml) {
                                self.html.audio.gate = true;
                                self._html_setAudio(media);
                                self.html.active = true;
                                if ($.jPlayer.platform.android) {
                                    self.androidFix.setMedia = true;
                                }
                            } else if (isAurora) {
                                self.aurora.gate = true;
                                self._aurora_setAudio(media);
                                self.aurora.active = true;
                            } else {
                                self.flash.gate = true;
                                self._flash_setAudio(media);
                                self.flash.active = true;
                            }
                            if (self.css.jq.videoPlay.length) {
                                self.css.jq.videoPlay.hide();
                            }
                            self.status.video = false;
                        }
                        supported = true;
                        return false;
                    }
                });
                if (supported) {
                    return false;
                }
            });
            if (supported) {
                if (!(this.status.nativeVideoControls && this.html.video.gate)) {
                    if (this._validString(media.poster)) {
                        if (posterChanged) {
                            this.htmlElement.poster.src = media.poster;
                        } else {
                            this.internal.poster.jq.show();
                        }
                    }
                }
                if (typeof media.title === 'string') {
                    if (this.css.jq.title.length) {
                        this.css.jq.title.html(media.title);
                    }
                    if (this.htmlElement.audio) {
                        this.htmlElement.audio.setAttribute('title', media.title);
                    }
                    if (this.htmlElement.video) {
                        this.htmlElement.video.setAttribute('title', media.title);
                    }
                }
                this.status.srcSet = true;
                this.status.media = $.extend({}, media);
                this._updateButtons(false);
                this._updateInterface();
                this._trigger($.jPlayer.event.setmedia);
            } else {
                this._error({
                    type: $.jPlayer.error.NO_SUPPORT,
                    context: '{supplied:\'' + this.options.supplied + '\'}',
                    message: $.jPlayer.errorMsg.NO_SUPPORT,
                    hint: $.jPlayer.errorHint.NO_SUPPORT
                });
            }
        },
        _resetMedia: function () {
            this._resetStatus();
            this._updateButtons(false);
            this._updateInterface();
            this._seeked();
            this.internal.poster.jq.hide();
            clearTimeout(this.internal.htmlDlyCmdId);
            if (this.html.active) {
                this._html_resetMedia();
            } else if (this.aurora.active) {
                this._aurora_resetMedia();
            } else if (this.flash.active) {
                this._flash_resetMedia();
            }
        },
        clearMedia: function () {
            this._resetMedia();
            if (this.html.active) {
                this._html_clearMedia();
            } else if (this.aurora.active) {
                this._aurora_clearMedia();
            } else if (this.flash.active) {
                this._flash_clearMedia();
            }
            this._resetGate();
            this._resetActive();
        },
        load: function () {
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_load();
                } else if (this.aurora.active) {
                    this._aurora_load();
                } else if (this.flash.active) {
                    this._flash_load();
                }
            } else {
                this._urlNotSetError('load');
            }
        },
        focus: function () {
            if (this.options.keyEnabled) {
                $.jPlayer.focus = this;
            }
        },
        play: function (time) {
            var guiAction = typeof time === 'object';
            if (guiAction && this.options.useStateClassSkin && !this.status.paused) {
                this.pause(time);
            } else {
                time = typeof time === 'number' ? time : NaN;
                if (this.status.srcSet) {
                    this.focus();
                    if (this.html.active) {
                        this._html_play(time);
                    } else if (this.aurora.active) {
                        this._aurora_play(time);
                    } else if (this.flash.active) {
                        this._flash_play(time);
                    }
                } else {
                    this._urlNotSetError('play');
                }
            }
        },
        videoPlay: function () {
            this.play();
        },
        pause: function (time) {
            time = typeof time === 'number' ? time : NaN;
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_pause(time);
                } else if (this.aurora.active) {
                    this._aurora_pause(time);
                } else if (this.flash.active) {
                    this._flash_pause(time);
                }
            } else {
                this._urlNotSetError('pause');
            }
        },
        tellOthers: function (command, conditions) {
            var self = this, hasConditions = typeof conditions === 'function', args = Array.prototype.slice.call(arguments);
            if (typeof command !== 'string') {
                return;
            }
            if (hasConditions) {
                args.splice(1, 1);
            }
            $.jPlayer.prototype.destroyRemoved();
            $.each(this.instances, function () {
                if (self.element !== this) {
                    if (!hasConditions || conditions.call(this.data('jPlayer'), self)) {
                        this.jPlayer.apply(this, args);
                    }
                }
            });
        },
        pauseOthers: function (time) {
            this.tellOthers('pause', function () {
                return this.status.srcSet;
            }, time);
        },
        stop: function () {
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_pause(0);
                } else if (this.aurora.active) {
                    this._aurora_pause(0);
                } else if (this.flash.active) {
                    this._flash_pause(0);
                }
            } else {
                this._urlNotSetError('stop');
            }
        },
        playHead: function (p) {
            p = this._limitValue(p, 0, 100);
            if (this.status.srcSet) {
                if (this.html.active) {
                    this._html_playHead(p);
                } else if (this.aurora.active) {
                    this._aurora_playHead(p);
                } else if (this.flash.active) {
                    this._flash_playHead(p);
                }
            } else {
                this._urlNotSetError('playHead');
            }
        },
        _muted: function (muted) {
            this.mutedWorker(muted);
            if (this.options.globalVolume) {
                this.tellOthers('mutedWorker', function () {
                    return this.options.globalVolume;
                }, muted);
            }
        },
        mutedWorker: function (muted) {
            this.options.muted = muted;
            if (this.html.used) {
                this._html_setProperty('muted', muted);
            }
            if (this.aurora.used) {
                this._aurora_mute(muted);
            }
            if (this.flash.used) {
                this._flash_mute(muted);
            }
            if (!this.html.video.gate && !this.html.audio.gate) {
                this._updateMute(muted);
                this._updateVolume(this.options.volume);
                this._trigger($.jPlayer.event.volumechange);
            }
        },
        mute: function (mute) {
            var guiAction = typeof mute === 'object';
            if (guiAction && this.options.useStateClassSkin && this.options.muted) {
                this._muted(false);
            } else {
                mute = mute === undefined ? true : !!mute;
                this._muted(mute);
            }
        },
        unmute: function (unmute) {
            unmute = unmute === undefined ? true : !!unmute;
            this._muted(!unmute);
        },
        _updateMute: function (mute) {
            if (mute === undefined) {
                mute = this.options.muted;
            }
            if (mute) {
                this.addStateClass('muted');
            } else {
                this.removeStateClass('muted');
            }
            if (this.css.jq.mute.length && this.css.jq.unmute.length) {
                if (this.status.noVolume) {
                    this.css.jq.mute.hide();
                    this.css.jq.unmute.hide();
                } else if (mute) {
                    this.css.jq.mute.hide();
                    this.css.jq.unmute.show();
                } else {
                    this.css.jq.mute.show();
                    this.css.jq.unmute.hide();
                }
            }
        },
        volume: function (v) {
            this.volumeWorker(v);
            if (this.options.globalVolume) {
                this.tellOthers('volumeWorker', function () {
                    return this.options.globalVolume;
                }, v);
            }
        },
        volumeWorker: function (v) {
            v = this._limitValue(v, 0, 1);
            this.options.volume = v;
            if (this.html.used) {
                this._html_setProperty('volume', v);
            }
            if (this.aurora.used) {
                this._aurora_volume(v);
            }
            if (this.flash.used) {
                this._flash_volume(v);
            }
            if (!this.html.video.gate && !this.html.audio.gate) {
                this._updateVolume(v);
                this._trigger($.jPlayer.event.volumechange);
            }
        },
        volumeBar: function (e) {
            if (this.css.jq.volumeBar.length) {
                var $bar = $(e.currentTarget), offset = $bar.offset(), x = e.pageX - offset.left, w = $bar.width(), y = $bar.height() - e.pageY + offset.top, h = $bar.height();
                if (this.options.verticalVolume) {
                    this.volume(y / h);
                } else {
                    this.volume(x / w);
                }
            }
            if (this.options.muted) {
                this._muted(false);
            }
        },
        _updateVolume: function (v) {
            if (v === undefined) {
                v = this.options.volume;
            }
            v = this.options.muted ? 0 : v;
            if (this.status.noVolume) {
                this.addStateClass('noVolume');
                if (this.css.jq.volumeBar.length) {
                    this.css.jq.volumeBar.hide();
                }
                if (this.css.jq.volumeBarValue.length) {
                    this.css.jq.volumeBarValue.hide();
                }
                if (this.css.jq.volumeMax.length) {
                    this.css.jq.volumeMax.hide();
                }
            } else {
                this.removeStateClass('noVolume');
                if (this.css.jq.volumeBar.length) {
                    this.css.jq.volumeBar.show();
                }
                if (this.css.jq.volumeBarValue.length) {
                    this.css.jq.volumeBarValue.show();
                    this.css.jq.volumeBarValue[this.options.verticalVolume ? 'height' : 'width'](v * 100 + '%');
                }
                if (this.css.jq.volumeMax.length) {
                    this.css.jq.volumeMax.show();
                }
            }
        },
        volumeMax: function () {
            this.volume(1);
            if (this.options.muted) {
                this._muted(false);
            }
        },
        _cssSelectorAncestor: function (ancestor) {
            var self = this;
            this.options.cssSelectorAncestor = ancestor;
            this._removeUiClass();
            this.ancestorJq = ancestor ? $(ancestor) : [];
            if (ancestor && this.ancestorJq.length !== 1) {
                this._warning({
                    type: $.jPlayer.warning.CSS_SELECTOR_COUNT,
                    context: ancestor,
                    message: $.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + ' found for cssSelectorAncestor.',
                    hint: $.jPlayer.warningHint.CSS_SELECTOR_COUNT
                });
            }
            this._addUiClass();
            $.each(this.options.cssSelector, function (fn, cssSel) {
                self._cssSelector(fn, cssSel);
            });
            this._updateInterface();
            this._updateButtons();
            this._updateAutohide();
            this._updateVolume();
            this._updateMute();
        },
        _cssSelector: function (fn, cssSel) {
            var self = this;
            if (typeof cssSel === 'string') {
                if ($.jPlayer.prototype.options.cssSelector[fn]) {
                    if (this.css.jq[fn] && this.css.jq[fn].length) {
                        this.css.jq[fn].unbind('.jPlayer');
                    }
                    this.options.cssSelector[fn] = cssSel;
                    this.css.cs[fn] = this.options.cssSelectorAncestor + ' ' + cssSel;
                    if (cssSel) {
                        this.css.jq[fn] = $(this.css.cs[fn]);
                    } else {
                        this.css.jq[fn] = [];
                    }
                    if (this.css.jq[fn].length && this[fn]) {
                        var handler = function (e) {
                            e.preventDefault();
                            self[fn](e);
                            if (self.options.autoBlur) {
                                $(this).blur();
                            } else {
                                $(this).focus();
                            }
                        };
                        this.css.jq[fn].bind('click.jPlayer', handler);
                    }
                    if (cssSel && this.css.jq[fn].length !== 1) {
                        this._warning({
                            type: $.jPlayer.warning.CSS_SELECTOR_COUNT,
                            context: this.css.cs[fn],
                            message: $.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[fn].length + ' found for ' + fn + ' method.',
                            hint: $.jPlayer.warningHint.CSS_SELECTOR_COUNT
                        });
                    }
                } else {
                    this._warning({
                        type: $.jPlayer.warning.CSS_SELECTOR_METHOD,
                        context: fn,
                        message: $.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
                        hint: $.jPlayer.warningHint.CSS_SELECTOR_METHOD
                    });
                }
            } else {
                this._warning({
                    type: $.jPlayer.warning.CSS_SELECTOR_STRING,
                    context: cssSel,
                    message: $.jPlayer.warningMsg.CSS_SELECTOR_STRING,
                    hint: $.jPlayer.warningHint.CSS_SELECTOR_STRING
                });
            }
        },
        duration: function (e) {
            if (this.options.toggleDuration) {
                if (this.options.captureDuration) {
                    e.stopPropagation();
                }
                this._setOption('remainingDuration', !this.options.remainingDuration);
            }
        },
        seekBar: function (e) {
            if (this.css.jq.seekBar.length) {
                var $bar = $(e.currentTarget), offset = $bar.offset(), x = e.pageX - offset.left, w = $bar.width(), p = 100 * x / w;
                this.playHead(p);
            }
        },
        playbackRate: function (pbr) {
            this._setOption('playbackRate', pbr);
        },
        playbackRateBar: function (e) {
            if (this.css.jq.playbackRateBar.length) {
                var $bar = $(e.currentTarget), offset = $bar.offset(), x = e.pageX - offset.left, w = $bar.width(), y = $bar.height() - e.pageY + offset.top, h = $bar.height(), ratio, pbr;
                if (this.options.verticalPlaybackRate) {
                    ratio = y / h;
                } else {
                    ratio = x / w;
                }
                pbr = ratio * (this.options.maxPlaybackRate - this.options.minPlaybackRate) + this.options.minPlaybackRate;
                this.playbackRate(pbr);
            }
        },
        _updatePlaybackRate: function () {
            var pbr = this.options.playbackRate, ratio = (pbr - this.options.minPlaybackRate) / (this.options.maxPlaybackRate - this.options.minPlaybackRate);
            if (this.status.playbackRateEnabled) {
                if (this.css.jq.playbackRateBar.length) {
                    this.css.jq.playbackRateBar.show();
                }
                if (this.css.jq.playbackRateBarValue.length) {
                    this.css.jq.playbackRateBarValue.show();
                    this.css.jq.playbackRateBarValue[this.options.verticalPlaybackRate ? 'height' : 'width'](ratio * 100 + '%');
                }
            } else {
                if (this.css.jq.playbackRateBar.length) {
                    this.css.jq.playbackRateBar.hide();
                }
                if (this.css.jq.playbackRateBarValue.length) {
                    this.css.jq.playbackRateBarValue.hide();
                }
            }
        },
        repeat: function (event) {
            var guiAction = typeof event === 'object';
            if (guiAction && this.options.useStateClassSkin && this.options.loop) {
                this._loop(false);
            } else {
                this._loop(true);
            }
        },
        repeatOff: function () {
            this._loop(false);
        },
        _loop: function (loop) {
            if (this.options.loop !== loop) {
                this.options.loop = loop;
                this._updateButtons();
                this._trigger($.jPlayer.event.repeat);
            }
        },
        option: function (key, value) {
            var options = key;
            if (arguments.length === 0) {
                return $.extend(true, {}, this.options);
            }
            if (typeof key === 'string') {
                var keys = key.split('.');
                if (value === undefined) {
                    var opt = $.extend(true, {}, this.options);
                    for (var i = 0; i < keys.length; i++) {
                        if (opt[keys[i]] !== undefined) {
                            opt = opt[keys[i]];
                        } else {
                            this._warning({
                                type: $.jPlayer.warning.OPTION_KEY,
                                context: key,
                                message: $.jPlayer.warningMsg.OPTION_KEY,
                                hint: $.jPlayer.warningHint.OPTION_KEY
                            });
                            return undefined;
                        }
                    }
                    return opt;
                }
                options = {};
                var opts = options;
                for (var j = 0; j < keys.length; j++) {
                    if (j < keys.length - 1) {
                        opts[keys[j]] = {};
                        opts = opts[keys[j]];
                    } else {
                        opts[keys[j]] = value;
                    }
                }
            }
            this._setOptions(options);
            return this;
        },
        _setOptions: function (options) {
            var self = this;
            $.each(options, function (key, value) {
                self._setOption(key, value);
            });
            return this;
        },
        _setOption: function (key, value) {
            var self = this;
            switch (key) {
            case 'volume':
                this.volume(value);
                break;
            case 'muted':
                this._muted(value);
                break;
            case 'globalVolume':
                this.options[key] = value;
                break;
            case 'cssSelectorAncestor':
                this._cssSelectorAncestor(value);
                break;
            case 'cssSelector':
                $.each(value, function (fn, cssSel) {
                    self._cssSelector(fn, cssSel);
                });
                break;
            case 'playbackRate':
                this.options[key] = value = this._limitValue(value, this.options.minPlaybackRate, this.options.maxPlaybackRate);
                if (this.html.used) {
                    this._html_setProperty('playbackRate', value);
                }
                this._updatePlaybackRate();
                break;
            case 'defaultPlaybackRate':
                this.options[key] = value = this._limitValue(value, this.options.minPlaybackRate, this.options.maxPlaybackRate);
                if (this.html.used) {
                    this._html_setProperty('defaultPlaybackRate', value);
                }
                this._updatePlaybackRate();
                break;
            case 'minPlaybackRate':
                this.options[key] = value = this._limitValue(value, 0.1, this.options.maxPlaybackRate - 0.1);
                this._updatePlaybackRate();
                break;
            case 'maxPlaybackRate':
                this.options[key] = value = this._limitValue(value, this.options.minPlaybackRate + 0.1, 16);
                this._updatePlaybackRate();
                break;
            case 'fullScreen':
                if (this.options[key] !== value) {
                    var wkv = $.jPlayer.nativeFeatures.fullscreen.used.webkitVideo;
                    if (!wkv || wkv && !this.status.waitForPlay) {
                        if (!wkv) {
                            this.options[key] = value;
                        }
                        if (value) {
                            this._requestFullscreen();
                        } else {
                            this._exitFullscreen();
                        }
                        if (!wkv) {
                            this._setOption('fullWindow', value);
                        }
                    }
                }
                break;
            case 'fullWindow':
                if (this.options[key] !== value) {
                    this._removeUiClass();
                    this.options[key] = value;
                    this._refreshSize();
                }
                break;
            case 'size':
                if (!this.options.fullWindow && this.options[key].cssClass !== value.cssClass) {
                    this._removeUiClass();
                }
                this.options[key] = $.extend({}, this.options[key], value);
                this._refreshSize();
                break;
            case 'sizeFull':
                if (this.options.fullWindow && this.options[key].cssClass !== value.cssClass) {
                    this._removeUiClass();
                }
                this.options[key] = $.extend({}, this.options[key], value);
                this._refreshSize();
                break;
            case 'autohide':
                this.options[key] = $.extend({}, this.options[key], value);
                this._updateAutohide();
                break;
            case 'loop':
                this._loop(value);
                break;
            case 'remainingDuration':
                this.options[key] = value;
                this._updateInterface();
                break;
            case 'toggleDuration':
                this.options[key] = value;
                break;
            case 'nativeVideoControls':
                this.options[key] = $.extend({}, this.options[key], value);
                this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
                this._restrictNativeVideoControls();
                this._updateNativeVideoControls();
                break;
            case 'noFullWindow':
                this.options[key] = $.extend({}, this.options[key], value);
                this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
                this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
                this._restrictNativeVideoControls();
                this._updateButtons();
                break;
            case 'noVolume':
                this.options[key] = $.extend({}, this.options[key], value);
                this.status.noVolume = this._uaBlocklist(this.options.noVolume);
                this._updateVolume();
                this._updateMute();
                break;
            case 'emulateHtml':
                if (this.options[key] !== value) {
                    this.options[key] = value;
                    if (value) {
                        this._emulateHtmlBridge();
                    } else {
                        this._destroyHtmlBridge();
                    }
                }
                break;
            case 'timeFormat':
                this.options[key] = $.extend({}, this.options[key], value);
                break;
            case 'keyEnabled':
                this.options[key] = value;
                if (!value && this === $.jPlayer.focus) {
                    $.jPlayer.focus = null;
                }
                break;
            case 'keyBindings':
                this.options[key] = $.extend(true, {}, this.options[key], value);
                break;
            case 'audioFullScreen':
                this.options[key] = value;
                break;
            case 'autoBlur':
                this.options[key] = value;
                break;
            }
            return this;
        },
        _refreshSize: function () {
            this._setSize();
            this._addUiClass();
            this._updateSize();
            this._updateButtons();
            this._updateAutohide();
            this._trigger($.jPlayer.event.resize);
        },
        _setSize: function () {
            if (this.options.fullWindow) {
                this.status.width = this.options.sizeFull.width;
                this.status.height = this.options.sizeFull.height;
                this.status.cssClass = this.options.sizeFull.cssClass;
            } else {
                this.status.width = this.options.size.width;
                this.status.height = this.options.size.height;
                this.status.cssClass = this.options.size.cssClass;
            }
            this.element.css({
                'width': this.status.width,
                'height': this.status.height
            });
        },
        _addUiClass: function () {
            if (this.ancestorJq.length) {
                this.ancestorJq.addClass(this.status.cssClass);
            }
        },
        _removeUiClass: function () {
            if (this.ancestorJq.length) {
                this.ancestorJq.removeClass(this.status.cssClass);
            }
        },
        _updateSize: function () {
            this.internal.poster.jq.css({
                'width': this.status.width,
                'height': this.status.height
            });
            if (!this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used && this.status.nativeVideoControls) {
                this.internal.video.jq.css({
                    'width': this.status.width,
                    'height': this.status.height
                });
            } else if (!this.status.waitForPlay && this.flash.active && this.status.video) {
                this.internal.flash.jq.css({
                    'width': this.status.width,
                    'height': this.status.height
                });
            }
        },
        _updateAutohide: function () {
            var self = this, event = 'mousemove.jPlayer', namespace = '.jPlayerAutohide', eventType = event + namespace, handler = function (event) {
                    var moved = false, deltaX, deltaY;
                    if (typeof self.internal.mouse !== 'undefined') {
                        deltaX = self.internal.mouse.x - event.pageX;
                        deltaY = self.internal.mouse.y - event.pageY;
                        moved = Math.floor(deltaX) > 0 || Math.floor(deltaY) > 0;
                    } else {
                        moved = true;
                    }
                    self.internal.mouse = {
                        x: event.pageX,
                        y: event.pageY
                    };
                    if (moved) {
                        self.css.jq.gui.fadeIn(self.options.autohide.fadeIn, function () {
                            clearTimeout(self.internal.autohideId);
                            self.internal.autohideId = setTimeout(function () {
                                self.css.jq.gui.fadeOut(self.options.autohide.fadeOut);
                            }, self.options.autohide.hold);
                        });
                    }
                };
            if (this.css.jq.gui.length) {
                this.css.jq.gui.stop(true, true);
                clearTimeout(this.internal.autohideId);
                delete this.internal.mouse;
                this.element.unbind(namespace);
                this.css.jq.gui.unbind(namespace);
                if (!this.status.nativeVideoControls) {
                    if (this.options.fullWindow && this.options.autohide.full || !this.options.fullWindow && this.options.autohide.restored) {
                        this.element.bind(eventType, handler);
                        this.css.jq.gui.bind(eventType, handler);
                        this.css.jq.gui.hide();
                    } else {
                        this.css.jq.gui.show();
                    }
                } else {
                    this.css.jq.gui.hide();
                }
            }
        },
        fullScreen: function (event) {
            var guiAction = typeof event === 'object';
            if (guiAction && this.options.useStateClassSkin && this.options.fullScreen) {
                this._setOption('fullScreen', false);
            } else {
                this._setOption('fullScreen', true);
            }
        },
        restoreScreen: function () {
            this._setOption('fullScreen', false);
        },
        _fullscreenAddEventListeners: function () {
            var self = this, fs = $.jPlayer.nativeFeatures.fullscreen;
            if (fs.api.fullscreenEnabled) {
                if (fs.event.fullscreenchange) {
                    if (typeof this.internal.fullscreenchangeHandler !== 'function') {
                        this.internal.fullscreenchangeHandler = function () {
                            self._fullscreenchange();
                        };
                    }
                    document.addEventListener(fs.event.fullscreenchange, this.internal.fullscreenchangeHandler, false);
                }
            }
        },
        _fullscreenRemoveEventListeners: function () {
            var fs = $.jPlayer.nativeFeatures.fullscreen;
            if (this.internal.fullscreenchangeHandler) {
                document.removeEventListener(fs.event.fullscreenchange, this.internal.fullscreenchangeHandler, false);
            }
        },
        _fullscreenchange: function () {
            if (this.options.fullScreen && !$.jPlayer.nativeFeatures.fullscreen.api.fullscreenElement()) {
                this._setOption('fullScreen', false);
            }
        },
        _requestFullscreen: function () {
            var e = this.ancestorJq.length ? this.ancestorJq[0] : this.element[0], fs = $.jPlayer.nativeFeatures.fullscreen;
            if (fs.used.webkitVideo) {
                e = this.htmlElement.video;
            }
            if (fs.api.fullscreenEnabled) {
                fs.api.requestFullscreen(e);
            }
        },
        _exitFullscreen: function () {
            var fs = $.jPlayer.nativeFeatures.fullscreen, e;
            if (fs.used.webkitVideo) {
                e = this.htmlElement.video;
            }
            if (fs.api.fullscreenEnabled) {
                fs.api.exitFullscreen(e);
            }
        },
        _html_initMedia: function (media) {
            var $media = $(this.htmlElement.media).empty();
            $.each(media.track || [], function (i, v) {
                var track = document.createElement('track');
                track.setAttribute('kind', v.kind ? v.kind : '');
                track.setAttribute('src', v.src ? v.src : '');
                track.setAttribute('srclang', v.srclang ? v.srclang : '');
                track.setAttribute('label', v.label ? v.label : '');
                if (v.def) {
                    track.setAttribute('default', v.def);
                }
                $media.append(track);
            });
            this.htmlElement.media.src = this.status.src;
            if (this.options.preload !== 'none') {
                this._html_load();
            }
            this._trigger($.jPlayer.event.timeupdate);
        },
        _html_setFormat: function (media) {
            var self = this;
            $.each(this.formats, function (priority, format) {
                if (self.html.support[format] && media[format]) {
                    self.status.src = media[format];
                    self.status.format[format] = true;
                    self.status.formatType = format;
                    return false;
                }
            });
        },
        _html_setAudio: function (media) {
            this._html_setFormat(media);
            this.htmlElement.media = this.htmlElement.audio;
            this._html_initMedia(media);
        },
        _html_setVideo: function (media) {
            this._html_setFormat(media);
            if (this.status.nativeVideoControls) {
                this.htmlElement.video.poster = this._validString(media.poster) ? media.poster : '';
            }
            this.htmlElement.media = this.htmlElement.video;
            this._html_initMedia(media);
        },
        _html_resetMedia: function () {
            if (this.htmlElement.media) {
                if (this.htmlElement.media.id === this.internal.video.id && !this.status.nativeVideoControls) {
                    this.internal.video.jq.css({
                        'width': '0px',
                        'height': '0px'
                    });
                }
                this.htmlElement.media.pause();
            }
        },
        _html_clearMedia: function () {
            if (this.htmlElement.media) {
                this.htmlElement.media.src = 'about:blank';
                this.htmlElement.media.load();
            }
        },
        _html_load: function () {
            if (this.status.waitForLoad) {
                this.status.waitForLoad = false;
                this.htmlElement.media.load();
            }
            clearTimeout(this.internal.htmlDlyCmdId);
        },
        _html_play: function (time) {
            var self = this, media = this.htmlElement.media;
            this.androidFix.pause = false;
            this._html_load();
            if (this.androidFix.setMedia) {
                this.androidFix.play = true;
                this.androidFix.time = time;
            } else if (!isNaN(time)) {
                if (this.internal.cmdsIgnored) {
                    media.play();
                }
                try {
                    if (!media.seekable || typeof media.seekable === 'object' && media.seekable.length > 0) {
                        media.currentTime = time;
                        media.play();
                    } else {
                        throw 1;
                    }
                } catch (err) {
                    this.internal.htmlDlyCmdId = setTimeout(function () {
                        self.play(time);
                    }, 250);
                    return;
                }
            } else {
                media.play();
            }
            this._html_checkWaitForPlay();
        },
        _html_pause: function (time) {
            var self = this, media = this.htmlElement.media;
            this.androidFix.play = false;
            if (time > 0) {
                this._html_load();
            } else {
                clearTimeout(this.internal.htmlDlyCmdId);
            }
            media.pause();
            if (this.androidFix.setMedia) {
                this.androidFix.pause = true;
                this.androidFix.time = time;
            } else if (!isNaN(time)) {
                try {
                    if (!media.seekable || typeof media.seekable === 'object' && media.seekable.length > 0) {
                        media.currentTime = time;
                    } else {
                        throw 1;
                    }
                } catch (err) {
                    this.internal.htmlDlyCmdId = setTimeout(function () {
                        self.pause(time);
                    }, 250);
                    return;
                }
            }
            if (time > 0) {
                this._html_checkWaitForPlay();
            }
        },
        _html_playHead: function (percent) {
            var self = this, media = this.htmlElement.media;
            this._html_load();
            try {
                if (typeof media.seekable === 'object' && media.seekable.length > 0) {
                    media.currentTime = percent * media.seekable.end(media.seekable.length - 1) / 100;
                } else if (media.duration > 0 && !isNaN(media.duration)) {
                    media.currentTime = percent * media.duration / 100;
                } else {
                    throw 'e';
                }
            } catch (err) {
                this.internal.htmlDlyCmdId = setTimeout(function () {
                    self.playHead(percent);
                }, 250);
                return;
            }
            if (!this.status.waitForLoad) {
                this._html_checkWaitForPlay();
            }
        },
        _html_checkWaitForPlay: function () {
            if (this.status.waitForPlay) {
                this.status.waitForPlay = false;
                if (this.css.jq.videoPlay.length) {
                    this.css.jq.videoPlay.hide();
                }
                if (this.status.video) {
                    this.internal.poster.jq.hide();
                    this.internal.video.jq.css({
                        'width': this.status.width,
                        'height': this.status.height
                    });
                }
            }
        },
        _html_setProperty: function (property, value) {
            if (this.html.audio.available) {
                this.htmlElement.audio[property] = value;
            }
            if (this.html.video.available) {
                this.htmlElement.video[property] = value;
            }
        },
        _aurora_setAudio: function (media) {
            var self = this;
            $.each(this.formats, function (priority, format) {
                if (self.aurora.support[format] && media[format]) {
                    self.status.src = media[format];
                    self.status.format[format] = true;
                    self.status.formatType = format;
                    return false;
                }
            });
            this.aurora.player = new AV.Player.fromURL(this.status.src);
            this._addAuroraEventListeners(this.aurora.player, this.aurora);
            if (this.options.preload === 'auto') {
                this._aurora_load();
                this.status.waitForLoad = false;
            }
        },
        _aurora_resetMedia: function () {
            if (this.aurora.player) {
                this.aurora.player.stop();
            }
        },
        _aurora_clearMedia: function () {
        },
        _aurora_load: function () {
            if (this.status.waitForLoad) {
                this.status.waitForLoad = false;
                this.aurora.player.preload();
            }
        },
        _aurora_play: function (time) {
            if (!this.status.waitForLoad) {
                if (!isNaN(time)) {
                    this.aurora.player.seek(time);
                }
            }
            if (!this.aurora.player.playing) {
                this.aurora.player.play();
            }
            this.status.waitForLoad = false;
            this._aurora_checkWaitForPlay();
            this._updateButtons(true);
            this._trigger($.jPlayer.event.play);
        },
        _aurora_pause: function (time) {
            if (!isNaN(time)) {
                this.aurora.player.seek(time * 1000);
            }
            this.aurora.player.pause();
            if (time > 0) {
                this._aurora_checkWaitForPlay();
            }
            this._updateButtons(false);
            this._trigger($.jPlayer.event.pause);
        },
        _aurora_playHead: function (percent) {
            if (this.aurora.player.duration > 0) {
                this.aurora.player.seek(percent * this.aurora.player.duration / 100);
            }
            if (!this.status.waitForLoad) {
                this._aurora_checkWaitForPlay();
            }
        },
        _aurora_checkWaitForPlay: function () {
            if (this.status.waitForPlay) {
                this.status.waitForPlay = false;
            }
        },
        _aurora_volume: function (v) {
            this.aurora.player.volume = v * 100;
        },
        _aurora_mute: function (m) {
            if (m) {
                this.aurora.properties.lastvolume = this.aurora.player.volume;
                this.aurora.player.volume = 0;
            } else {
                this.aurora.player.volume = this.aurora.properties.lastvolume;
            }
            this.aurora.properties.muted = m;
        },
        _flash_setAudio: function (media) {
            var self = this;
            try {
                $.each(this.formats, function (priority, format) {
                    if (self.flash.support[format] && media[format]) {
                        switch (format) {
                        case 'm4a':
                        case 'fla':
                            self._getMovie().fl_setAudio_m4a(media[format]);
                            break;
                        case 'mp3':
                            self._getMovie().fl_setAudio_mp3(media[format]);
                            break;
                        case 'rtmpa':
                            self._getMovie().fl_setAudio_rtmp(media[format]);
                            break;
                        }
                        self.status.src = media[format];
                        self.status.format[format] = true;
                        self.status.formatType = format;
                        return false;
                    }
                });
                if (this.options.preload === 'auto') {
                    this._flash_load();
                    this.status.waitForLoad = false;
                }
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_setVideo: function (media) {
            var self = this;
            try {
                $.each(this.formats, function (priority, format) {
                    if (self.flash.support[format] && media[format]) {
                        switch (format) {
                        case 'm4v':
                        case 'flv':
                            self._getMovie().fl_setVideo_m4v(media[format]);
                            break;
                        case 'rtmpv':
                            self._getMovie().fl_setVideo_rtmp(media[format]);
                            break;
                        }
                        self.status.src = media[format];
                        self.status.format[format] = true;
                        self.status.formatType = format;
                        return false;
                    }
                });
                if (this.options.preload === 'auto') {
                    this._flash_load();
                    this.status.waitForLoad = false;
                }
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_resetMedia: function () {
            this.internal.flash.jq.css({
                'width': '0px',
                'height': '0px'
            });
            this._flash_pause(NaN);
        },
        _flash_clearMedia: function () {
            try {
                this._getMovie().fl_clearMedia();
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_load: function () {
            try {
                this._getMovie().fl_load();
            } catch (err) {
                this._flashError(err);
            }
            this.status.waitForLoad = false;
        },
        _flash_play: function (time) {
            try {
                this._getMovie().fl_play(time);
            } catch (err) {
                this._flashError(err);
            }
            this.status.waitForLoad = false;
            this._flash_checkWaitForPlay();
        },
        _flash_pause: function (time) {
            try {
                this._getMovie().fl_pause(time);
            } catch (err) {
                this._flashError(err);
            }
            if (time > 0) {
                this.status.waitForLoad = false;
                this._flash_checkWaitForPlay();
            }
        },
        _flash_playHead: function (p) {
            try {
                this._getMovie().fl_play_head(p);
            } catch (err) {
                this._flashError(err);
            }
            if (!this.status.waitForLoad) {
                this._flash_checkWaitForPlay();
            }
        },
        _flash_checkWaitForPlay: function () {
            if (this.status.waitForPlay) {
                this.status.waitForPlay = false;
                if (this.css.jq.videoPlay.length) {
                    this.css.jq.videoPlay.hide();
                }
                if (this.status.video) {
                    this.internal.poster.jq.hide();
                    this.internal.flash.jq.css({
                        'width': this.status.width,
                        'height': this.status.height
                    });
                }
            }
        },
        _flash_volume: function (v) {
            try {
                this._getMovie().fl_volume(v);
            } catch (err) {
                this._flashError(err);
            }
        },
        _flash_mute: function (m) {
            try {
                this._getMovie().fl_mute(m);
            } catch (err) {
                this._flashError(err);
            }
        },
        _getMovie: function () {
            return document[this.internal.flash.id];
        },
        _getFlashPluginVersion: function () {
            var version = 0, flash;
            if (window.ActiveXObject) {
                try {
                    flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (flash) {
                        var v = flash.GetVariable('$version');
                        if (v) {
                            v = v.split(' ')[1].split(',');
                            version = parseInt(v[0], 10) + '.' + parseInt(v[1], 10);
                        }
                    }
                } catch (e) {
                }
            } else if (navigator.plugins && navigator.mimeTypes.length > 0) {
                flash = navigator.plugins['Shockwave Flash'];
                if (flash) {
                    version = navigator.plugins['Shockwave Flash'].description.replace(/.*\s(\d+\.\d+).*/, '$1');
                }
            }
            return version * 1;
        },
        _checkForFlash: function (version) {
            var flashOk = false;
            if (this._getFlashPluginVersion() >= version) {
                flashOk = true;
            }
            return flashOk;
        },
        _validString: function (url) {
            return url && typeof url === 'string';
        },
        _limitValue: function (value, min, max) {
            return value < min ? min : value > max ? max : value;
        },
        _urlNotSetError: function (context) {
            this._error({
                type: $.jPlayer.error.URL_NOT_SET,
                context: context,
                message: $.jPlayer.errorMsg.URL_NOT_SET,
                hint: $.jPlayer.errorHint.URL_NOT_SET
            });
        },
        _flashError: function (error) {
            var errorType;
            if (!this.internal.ready) {
                errorType = 'FLASH';
            } else {
                errorType = 'FLASH_DISABLED';
            }
            this._error({
                type: $.jPlayer.error[errorType],
                context: this.internal.flash.swf,
                message: $.jPlayer.errorMsg[errorType] + error.message,
                hint: $.jPlayer.errorHint[errorType]
            });
            this.internal.flash.jq.css({
                'width': '1px',
                'height': '1px'
            });
        },
        _error: function (error) {
            this._trigger($.jPlayer.event.error, error);
            if (this.options.errorAlerts) {
                this._alert('Error!' + (error.message ? '\n' + error.message : '') + (error.hint ? '\n' + error.hint : '') + '\nContext: ' + error.context);
            }
        },
        _warning: function (warning) {
            this._trigger($.jPlayer.event.warning, undefined, warning);
            if (this.options.warningAlerts) {
                this._alert('Warning!' + (warning.message ? '\n' + warning.message : '') + (warning.hint ? '\n' + warning.hint : '') + '\nContext: ' + warning.context);
            }
        },
        _alert: function (message) {
            var msg = 'jPlayer ' + this.version.script + ' : id=\'' + this.internal.self.id + '\' : ' + message;
            if (!this.options.consoleAlerts) {
                alert(msg);
            } else if (window.console && window.console.log) {
                window.console.log(msg);
            }
        },
        _emulateHtmlBridge: function () {
            var self = this;
            $.each($.jPlayer.emulateMethods.split(/\s+/g), function (i, name) {
                self.internal.domNode[name] = function (arg) {
                    self[name](arg);
                };
            });
            $.each($.jPlayer.event, function (eventName, eventType) {
                var nativeEvent = true;
                $.each($.jPlayer.reservedEvent.split(/\s+/g), function (i, name) {
                    if (name === eventName) {
                        nativeEvent = false;
                        return false;
                    }
                });
                if (nativeEvent) {
                    self.element.bind(eventType + '.jPlayer.jPlayerHtml', function () {
                        self._emulateHtmlUpdate();
                        var domEvent = document.createEvent('Event');
                        domEvent.initEvent(eventName, false, true);
                        self.internal.domNode.dispatchEvent(domEvent);
                    });
                }
            });
        },
        _emulateHtmlUpdate: function () {
            var self = this;
            $.each($.jPlayer.emulateStatus.split(/\s+/g), function (i, name) {
                self.internal.domNode[name] = self.status[name];
            });
            $.each($.jPlayer.emulateOptions.split(/\s+/g), function (i, name) {
                self.internal.domNode[name] = self.options[name];
            });
        },
        _destroyHtmlBridge: function () {
            var self = this;
            this.element.unbind('.jPlayerHtml');
            var emulated = $.jPlayer.emulateMethods + ' ' + $.jPlayer.emulateStatus + ' ' + $.jPlayer.emulateOptions;
            $.each(emulated.split(/\s+/g), function (i, name) {
                delete self.internal.domNode[name];
            });
        }
    };
    $.jPlayer.error = {
        FLASH: 'e_flash',
        FLASH_DISABLED: 'e_flash_disabled',
        NO_SOLUTION: 'e_no_solution',
        NO_SUPPORT: 'e_no_support',
        URL: 'e_url',
        URL_NOT_SET: 'e_url_not_set',
        VERSION: 'e_version'
    };
    $.jPlayer.errorMsg = {
        FLASH: 'jPlayer\'s Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ',
        FLASH_DISABLED: 'jPlayer\'s Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ',
        NO_SOLUTION: 'No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.',
        NO_SUPPORT: 'It is not possible to play any media format provided in setMedia() on this browser using your current options.',
        URL: 'Media URL could not be loaded.',
        URL_NOT_SET: 'Attempt to issue media playback commands, while no media url is set.',
        VERSION: 'jPlayer ' + $.jPlayer.prototype.version.script + ' needs Jplayer.swf version ' + $.jPlayer.prototype.version.needFlash + ' but found '
    };
    $.jPlayer.errorHint = {
        FLASH: 'Check your swfPath option and that Jplayer.swf is there.',
        FLASH_DISABLED: 'Check that you have not display:none; the jPlayer entity or any ancestor.',
        NO_SOLUTION: 'Review the jPlayer options: support and supplied.',
        NO_SUPPORT: 'Video or audio formats defined in the supplied option are missing.',
        URL: 'Check media URL is valid.',
        URL_NOT_SET: 'Use setMedia() to set the media URL.',
        VERSION: 'Update jPlayer files.'
    };
    $.jPlayer.warning = {
        CSS_SELECTOR_COUNT: 'e_css_selector_count',
        CSS_SELECTOR_METHOD: 'e_css_selector_method',
        CSS_SELECTOR_STRING: 'e_css_selector_string',
        OPTION_KEY: 'e_option_key'
    };
    $.jPlayer.warningMsg = {
        CSS_SELECTOR_COUNT: 'The number of css selectors found did not equal one: ',
        CSS_SELECTOR_METHOD: 'The methodName given in jPlayer(\'cssSelector\') is not a valid jPlayer method.',
        CSS_SELECTOR_STRING: 'The methodCssSelector given in jPlayer(\'cssSelector\') is not a String or is empty.',
        OPTION_KEY: 'The option requested in jPlayer(\'option\') is undefined.'
    };
    $.jPlayer.warningHint = {
        CSS_SELECTOR_COUNT: 'Check your css selector and the ancestor.',
        CSS_SELECTOR_METHOD: 'Check your method name.',
        CSS_SELECTOR_STRING: 'Check your css selector is a string.',
        OPTION_KEY: 'Check your option name.'
    };
}));

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('common/extra/jplayer/jplayer.playlist', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        if (root.jQuery) {
            factory(root.jQuery);
        } else {
            factory(root.Zepto);
        }
    }
}(this, function ($, undefined) {
    jPlayerPlaylist = function (cssSelector, playlist, options) {
        var self = this;
        this.current = 0;
        this.loop = false;
        this.shuffled = false;
        this.removing = false;
        this.cssSelector = $.extend({}, this._cssSelector, cssSelector);
        this.options = $.extend(true, {
            keyBindings: {
                next: {
                    key: 221,
                    fn: function () {
                        self.next();
                    }
                },
                previous: {
                    key: 219,
                    fn: function () {
                        self.previous();
                    }
                },
                shuffle: {
                    key: 83,
                    fn: function () {
                        self.shuffle();
                    }
                }
            },
            stateClass: { shuffled: 'jp-state-shuffled' }
        }, this._options, options);
        this.playlist = [];
        this.original = [];
        this._initPlaylist(playlist);
        this.cssSelector.details = this.cssSelector.cssSelectorAncestor + ' .jp-details';
        this.cssSelector.playlist = this.cssSelector.cssSelectorAncestor + ' .jp-playlist';
        this.cssSelector.next = this.cssSelector.cssSelectorAncestor + ' .jp-next';
        this.cssSelector.previous = this.cssSelector.cssSelectorAncestor + ' .jp-previous';
        this.cssSelector.shuffle = this.cssSelector.cssSelectorAncestor + ' .jp-shuffle';
        this.cssSelector.shuffleOff = this.cssSelector.cssSelectorAncestor + ' .jp-shuffle-off';
        this.options.cssSelectorAncestor = this.cssSelector.cssSelectorAncestor;
        this.options.repeat = function (event) {
            self.loop = event.jPlayer.options.loop;
        };
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.ready, function () {
            self._init();
        });
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.ended, function () {
            self.next();
        });
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.play, function () {
            $(this).jPlayer('pauseOthers');
        });
        $(this.cssSelector.jPlayer).bind($.jPlayer.event.resize, function (event) {
            if (event.jPlayer.options.fullScreen) {
                $(self.cssSelector.details).show();
            } else {
                $(self.cssSelector.details).hide();
            }
        });
        $(this.cssSelector.previous).click(function (e) {
            e.preventDefault();
            self.previous();
            self.blur(this);
        });
        $(this.cssSelector.next).click(function (e) {
            e.preventDefault();
            self.next();
            self.blur(this);
        });
        $(this.cssSelector.shuffle).click(function (e) {
            e.preventDefault();
            if (self.shuffled && $(self.cssSelector.jPlayer).jPlayer('option', 'useStateClassSkin')) {
                self.shuffle(false);
            } else {
                self.shuffle(true);
            }
            self.blur(this);
        });
        $(this.cssSelector.shuffleOff).click(function (e) {
            e.preventDefault();
            self.shuffle(false);
            self.blur(this);
        }).hide();
        if (!this.options.fullScreen) {
            $(this.cssSelector.details).hide();
        }
        $(this.cssSelector.playlist + ' ul').empty();
        this._createItemHandlers();
        $(this.cssSelector.jPlayer).jPlayer(this.options);
    };
    jPlayerPlaylist.prototype = {
        _cssSelector: {
            jPlayer: '#jquery_jplayer_1',
            cssSelectorAncestor: '#jp_container_1'
        },
        _options: {
            playlistOptions: {
                autoPlay: false,
                loopOnPrevious: false,
                shuffleOnLoop: true,
                enableRemoveControls: false,
                displayTime: 'slow',
                addTime: 'fast',
                removeTime: 'fast',
                shuffleTime: 'slow',
                itemClass: 'jp-playlist-item',
                freeGroupClass: 'jp-free-media',
                freeItemClass: 'jp-playlist-item-free',
                removeItemClass: 'jp-playlist-item-remove'
            }
        },
        option: function (option, value) {
            if (value === undefined) {
                return this.options.playlistOptions[option];
            }
            this.options.playlistOptions[option] = value;
            switch (option) {
            case 'enableRemoveControls':
                this._updateControls();
                break;
            case 'itemClass':
            case 'freeGroupClass':
            case 'freeItemClass':
            case 'removeItemClass':
                this._refresh(true);
                this._createItemHandlers();
                break;
            }
            return this;
        },
        _init: function () {
            var self = this;
            this._refresh(function () {
                if (self.options.playlistOptions.autoPlay) {
                    self.play(self.current);
                } else {
                    self.select(self.current);
                }
            });
        },
        _initPlaylist: function (playlist) {
            this.current = 0;
            this.shuffled = false;
            this.removing = false;
            this.original = $.extend(true, [], playlist);
            this._originalPlaylist();
        },
        _originalPlaylist: function () {
            var self = this;
            this.playlist = [];
            $.each(this.original, function (i) {
                self.playlist[i] = self.original[i];
            });
        },
        _refresh: function (instant) {
            var self = this;
            if (instant && !$.isFunction(instant)) {
                $(this.cssSelector.playlist + ' ul').empty();
                $.each(this.playlist, function (i) {
                    $(self.cssSelector.playlist + ' ul').append(self._createListItem(self.playlist[i]));
                });
                this._updateControls();
            } else {
                var displayTime = $(this.cssSelector.playlist + ' ul').children().length ? this.options.playlistOptions.displayTime : 0;
                $(this.cssSelector.playlist + ' ul').slideUp(displayTime, function () {
                    var $this = $(this);
                    $(this).empty();
                    $.each(self.playlist, function (i) {
                        $this.append(self._createListItem(self.playlist[i]));
                    });
                    self._updateControls();
                    if ($.isFunction(instant)) {
                        instant();
                    }
                    if (self.playlist.length) {
                        $(this).slideDown(self.options.playlistOptions.displayTime);
                    } else {
                        $(this).show();
                    }
                });
            }
        },
        _createListItem: function (media) {
            var self = this;
            var listItem = '<li><div>';
            listItem += '<a href=\'javascript:;\' class=\'' + this.options.playlistOptions.removeItemClass + '\'>&times;</a>';
            if (media.free) {
                var first = true;
                listItem += '<span class=\'' + this.options.playlistOptions.freeGroupClass + '\'>(';
                $.each(media, function (property, value) {
                    if ($.jPlayer.prototype.format[property]) {
                        if (first) {
                            first = false;
                        } else {
                            listItem += ' | ';
                        }
                        listItem += '<a class=\'' + self.options.playlistOptions.freeItemClass + '\' href=\'' + value + '\' tabindex=\'-1\'>' + property + '</a>';
                    }
                });
                listItem += ')</span>';
            }
            listItem += '<a href=\'javascript:;\' class=\'' + this.options.playlistOptions.itemClass + '\' tabindex=\'0\'>' + media.title + (media.artist ? ' <span class=\'jp-artist\'>by ' + media.artist + '</span>' : '') + '</a>';
            listItem += '</div></li>';
            return listItem;
        },
        _createItemHandlers: function () {
            var self = this;
            $(this.cssSelector.playlist).off('click', 'a.' + this.options.playlistOptions.itemClass).on('click', 'a.' + this.options.playlistOptions.itemClass, function (e) {
                e.preventDefault();
                var index = $(this).parent().parent().index();
                if (self.current !== index) {
                    self.play(index);
                } else {
                    $(self.cssSelector.jPlayer).jPlayer('play');
                }
                self.blur(this);
            });
            $(this.cssSelector.playlist).off('click', 'a.' + this.options.playlistOptions.freeItemClass).on('click', 'a.' + this.options.playlistOptions.freeItemClass, function (e) {
                e.preventDefault();
                $(this).parent().parent().find('.' + self.options.playlistOptions.itemClass).click();
                self.blur(this);
            });
            $(this.cssSelector.playlist).off('click', 'a.' + this.options.playlistOptions.removeItemClass).on('click', 'a.' + this.options.playlistOptions.removeItemClass, function (e) {
                e.preventDefault();
                var index = $(this).parent().parent().index();
                self.remove(index);
                self.blur(this);
            });
        },
        _updateControls: function () {
            if (this.options.playlistOptions.enableRemoveControls) {
                $(this.cssSelector.playlist + ' .' + this.options.playlistOptions.removeItemClass).show();
            } else {
                $(this.cssSelector.playlist + ' .' + this.options.playlistOptions.removeItemClass).hide();
            }
            if (this.shuffled) {
                $(this.cssSelector.jPlayer).jPlayer('addStateClass', 'shuffled');
            } else {
                $(this.cssSelector.jPlayer).jPlayer('removeStateClass', 'shuffled');
            }
            if ($(this.cssSelector.shuffle).length && $(this.cssSelector.shuffleOff).length) {
                if (this.shuffled) {
                    $(this.cssSelector.shuffleOff).show();
                    $(this.cssSelector.shuffle).hide();
                } else {
                    $(this.cssSelector.shuffleOff).hide();
                    $(this.cssSelector.shuffle).show();
                }
            }
        },
        _highlight: function (index) {
            if (this.playlist.length && index !== undefined) {
                $(this.cssSelector.playlist + ' .jp-playlist-current').removeClass('jp-playlist-current');
                $(this.cssSelector.playlist + ' li:nth-child(' + (index + 1) + ')').addClass('jp-playlist-current').find('.jp-playlist-item').addClass('jp-playlist-current');
            }
        },
        setPlaylist: function (playlist) {
            this._initPlaylist(playlist);
            this._init();
        },
        add: function (media, playNow) {
            $(this.cssSelector.playlist + ' ul').append(this._createListItem(media)).find('li:last-child').hide().slideDown(this.options.playlistOptions.addTime);
            this._updateControls();
            this.original.push(media);
            this.playlist.push(media);
            if (playNow) {
                this.play(this.playlist.length - 1);
            } else {
                if (this.original.length === 1) {
                    this.select(0);
                }
            }
        },
        remove: function (index) {
            var self = this;
            if (index === undefined) {
                this._initPlaylist([]);
                this._refresh(function () {
                    $(self.cssSelector.jPlayer).jPlayer('clearMedia');
                });
                return true;
            } else {
                if (this.removing) {
                    return false;
                } else {
                    index = index < 0 ? self.original.length + index : index;
                    if (0 <= index && index < this.playlist.length) {
                        this.removing = true;
                        $(this.cssSelector.playlist + ' li:nth-child(' + (index + 1) + ')').slideUp(this.options.playlistOptions.removeTime, function () {
                            $(this).remove();
                            if (self.shuffled) {
                                var item = self.playlist[index];
                                $.each(self.original, function (i) {
                                    if (self.original[i] === item) {
                                        self.original.splice(i, 1);
                                        return false;
                                    }
                                });
                                self.playlist.splice(index, 1);
                            } else {
                                self.original.splice(index, 1);
                                self.playlist.splice(index, 1);
                            }
                            if (self.original.length) {
                                if (index === self.current) {
                                    self.current = index < self.original.length ? self.current : self.original.length - 1;
                                    self.select(self.current);
                                } else if (index < self.current) {
                                    self.current--;
                                }
                            } else {
                                $(self.cssSelector.jPlayer).jPlayer('clearMedia');
                                self.current = 0;
                                self.shuffled = false;
                                self._updateControls();
                            }
                            self.removing = false;
                        });
                    }
                    return true;
                }
            }
        },
        select: function (index) {
            index = index < 0 ? this.original.length + index : index;
            if (0 <= index && index < this.playlist.length) {
                this.current = index;
                this._highlight(index);
                $(this.cssSelector.jPlayer).jPlayer('setMedia', this.playlist[this.current]);
            } else {
                this.current = 0;
            }
        },
        play: function (index) {
            index = index < 0 ? this.original.length + index : index;
            if (0 <= index && index < this.playlist.length) {
                if (this.playlist.length) {
                    this.select(index);
                    $(this.cssSelector.jPlayer).jPlayer('play');
                }
            } else if (index === undefined) {
                $(this.cssSelector.jPlayer).jPlayer('play');
            }
        },
        pause: function () {
            $(this.cssSelector.jPlayer).jPlayer('pause');
        },
        next: function () {
            var index = this.current + 1 < this.playlist.length ? this.current + 1 : 0;
            if (this.loop) {
                if (index === 0 && this.shuffled && this.options.playlistOptions.shuffleOnLoop && this.playlist.length > 1) {
                    this.shuffle(true, true);
                } else {
                    this.play(index);
                }
            } else {
                if (index > 0) {
                    this.play(index);
                }
            }
        },
        previous: function () {
            var index = this.current - 1 >= 0 ? this.current - 1 : this.playlist.length - 1;
            if (this.loop && this.options.playlistOptions.loopOnPrevious || index < this.playlist.length - 1) {
                this.play(index);
            }
        },
        shuffle: function (shuffled, playNow) {
            var self = this;
            if (shuffled === undefined) {
                shuffled = !this.shuffled;
            }
            if (shuffled || shuffled !== this.shuffled) {
                $(this.cssSelector.playlist + ' ul').slideUp(this.options.playlistOptions.shuffleTime, function () {
                    self.shuffled = shuffled;
                    if (shuffled) {
                        self.playlist.sort(function () {
                            return 0.5 - Math.random();
                        });
                    } else {
                        self._originalPlaylist();
                    }
                    self._refresh(true);
                    if (playNow || !$(self.cssSelector.jPlayer).data('jPlayer').status.paused) {
                        self.play(0);
                    } else {
                        self.select(0);
                    }
                    $(this).slideDown(self.options.playlistOptions.shuffleTime);
                });
            }
        },
        blur: function (that) {
            if ($(this.cssSelector.jPlayer).jPlayer('option', 'autoBlur')) {
                $(that).blur();
            }
        }
    };
}));

define('m/sight/map', [
    'require',
    'jquery',
    'common/extra/jplayer/jquery.jplayer',
    'common/extra/jplayer/jplayer.playlist'
], function (require) {
    var $ = require('jquery');
    require('common/extra/jplayer/jquery.jplayer');
    require('common/extra/jplayer/jplayer.playlist');
    var features = [];
    var infoWindow;
    function init(acenter, alist) {
        center = acenter;
        list = alist;
        bindEvents.init();
    }
    var bindEvents = {
            init: function () {
                this.initMap();
                this.initPlayer();
            },
            initMap: function () {
                map = new AMap.Map('mapBox', {
                    view: new AMap.View2D({
                        zoom: 14,
                        rotation: 0
                    }),
                    resizeEnable: true,
                    lang: 'zh_cn',
                    level: 10
                });
                map.setCenter(center);
                map.setDefaultCursor('default');
                new AMap.TileLayer.Traffic({
                    map: map,
                    zIndex: 2
                });
                this.loadFeatures();
                map.setFitView();
                map.plugin([
                    'AMap.ToolBar',
                    'AMap.Scale'
                ], function () {
                    map.addControl(new AMap.ToolBar());
                    map.addControl(new AMap.Scale());
                });
            },
            initFeatures: function () {
                for (var i = 0; i < list.length; i++) {
                    var item = {
                            type: 'Marker',
                            name: list[i].name,
                            desc: list[i].content,
                            color: 'red',
                            icon: 'cir',
                            offset: {
                                x: -9,
                                y: -31
                            },
                            lnglat: {
                                lng: list[i].x,
                                lat: list[i].y
                            },
                            title: list[i].name,
                            mp3: '/audio/' + list[i].audio
                        };
                    features.push(item);
                }
                ;
            },
            loadFeatures: function () {
                this.initFeatures();
                for (var feature, data, i = 0, len = features.length, j, jl, path; i < len; i++) {
                    data = features[i];
                    switch (data.type) {
                    case 'Marker':
                        feature = new AMap.Marker({
                            position: new AMap.LngLat(data.lnglat.lng, data.lnglat.lat),
                            zIndex: 100,
                            extData: data,
                            offset: new AMap.Pixel(data.offset.x, data.offset.y),
                            title: data.name,
                            content: '<div class="icon icon-' + data.icon + ' icon-' + data.icon + '-' + data.color + '"></div><div class="icon-name">' + data.name + '</div><div class="voice"></div>'
                        });
                        feature.setMap(map);
                        break;
                    case 'Polyline':
                        for (j = 0, jl = data.lnglat.length, path = []; j < jl; j++) {
                            path.push(new AMap.LngLat(data.lnglat[j].lng, data.lnglat[j].lat));
                        }
                        feature = new AMap.Polyline({
                            map: map,
                            path: path,
                            extData: data,
                            zIndex: 2,
                            strokeWeight: data.strokeWeight,
                            strokeColor: data.strokeColor,
                            strokeOpacity: data.strokeOpacity
                        });
                        break;
                    case 'Polygon':
                        for (j = 0, jl = data.lnglat.length, path = []; j < jl; j++) {
                            path.push(new AMap.LngLat(data.lnglat[j].lng, data.lnglat[j].lat));
                        }
                        feature = new AMap.Polygon({
                            map: map,
                            path: path,
                            extData: data,
                            zIndex: 1,
                            strokeWeight: data.strokeWeight,
                            strokeColor: data.strokeColor,
                            strokeOpacity: data.strokeOpacity,
                            fillColor: data.fillColor,
                            fillOpacity: data.fillOpacity
                        });
                        break;
                    default:
                        feature = null;
                    }
                    if (feature) {
                        AMap.event.addListener(feature, 'click', this.mapFeatureClick);
                    }
                }
            },
            mapFeatureClick: function (e) {
                if (!infoWindow) {
                    infoWindow = new AMap.InfoWindow({ autoMove: true });
                }
                var extData = e.target.getExtData();
                $('.jp-title').html(extData.name);
                infoWindow.setContent('<h5>' + extData.name + '</h5><div>' + extData.desc + '</div>');
                infoWindow.open(map, e.lnglat);
            },
            initPlayer: function () {
                var myPlaylist = new jPlayerPlaylist({
                        jPlayer: '#jPlayerBox',
                        cssSelectorAncestor: '#jp_container_1'
                    }, features, {
                        playlistOptions: { enableRemoveControls: true },
                        swfPath: '../common/extra/jplayer',
                        supplied: 'mp3',
                        useStateClassSkin: true,
                        autoBlur: false,
                        smoothPlayBar: true,
                        keyEnabled: true,
                        audioFullScreen: true
                    });
            }
        };
    return { init: init };
});