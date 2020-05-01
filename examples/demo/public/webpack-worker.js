/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "../../node_modules/babel-loader/lib/index.js!../../blogsearch/lib/sqlite/worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../blogsearch/lib/sqlite/sqlite3-emscripten.js":
/*!**********************************************************!*\
  !*** /build/blogsearch/lib/sqlite/sqlite3-emscripten.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Module = function () {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;

  return function (Module) {
    Module = Module || {};
    var Module = typeof Module !== "undefined" ? Module : {};
    var moduleOverrides = {};
    var key;

    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }

    var arguments_ = [];
    var thisProgram = "./this.program";

    var quit_ = function (status, toThrow) {
      throw toThrow;
    };

    var ENVIRONMENT_IS_WEB = false;
    var ENVIRONMENT_IS_WORKER = true;
    var scriptDirectory = "";

    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }

      return scriptDirectory + path;
    }

    var read_, readAsync, readBinary, setWindowTitle;

    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }

      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }

      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }

      {
        read_ = function shell_read(url) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };

        if (ENVIRONMENT_IS_WORKER) {
          readBinary = function readBinary(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }

        readAsync = function readAsync(url, onload, onerror) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";

          xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
              onload(xhr.response);
              return;
            }

            onerror();
          };

          xhr.onerror = onerror;
          xhr.send(null);
        };
      }

      setWindowTitle = function (title) {
        document.title = title;
      };
    } else {}

    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);

    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }

    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];

    function dynamicAlloc(size) {
      var ret = HEAP32[DYNAMICTOP_PTR >> 2];
      var end = ret + size + 15 & -16;

      if (end > _emscripten_get_heap_size()) {
        abort();
      }

      HEAP32[DYNAMICTOP_PTR >> 2] = end;
      return ret;
    }

    function getNativeTypeSize(type) {
      switch (type) {
        case "i1":
        case "i8":
          return 1;

        case "i16":
          return 2;

        case "i32":
          return 4;

        case "i64":
          return 8;

        case "float":
          return 4;

        case "double":
          return 8;

        default:
          {
            if (type[type.length - 1] === "*") {
              return 4;
            } else if (type[0] === "i") {
              var bits = Number(type.substr(1));
              assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
              return bits / 8;
            } else {
              return 0;
            }
          }
      }
    }

    function convertJsFunctionToWasm(func, sig) {
      if (typeof WebAssembly.Function === "function") {
        var typeNames = {
          "i": "i32",
          "j": "i64",
          "f": "f32",
          "d": "f64"
        };
        var type = {
          parameters: [],
          results: sig[0] == "v" ? [] : [typeNames[sig[0]]]
        };

        for (var i = 1; i < sig.length; ++i) {
          type.parameters.push(typeNames[sig[i]]);
        }

        return new WebAssembly.Function(type, func);
      }

      var typeSection = [1, 0, 1, 96];
      var sigRet = sig.slice(0, 1);
      var sigParam = sig.slice(1);
      var typeCodes = {
        "i": 127,
        "j": 126,
        "f": 125,
        "d": 124
      };
      typeSection.push(sigParam.length);

      for (var i = 0; i < sigParam.length; ++i) {
        typeSection.push(typeCodes[sigParam[i]]);
      }

      if (sigRet == "v") {
        typeSection.push(0);
      } else {
        typeSection = typeSection.concat([1, typeCodes[sigRet]]);
      }

      typeSection[1] = typeSection.length - 2;
      var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(typeSection, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
      var module = new WebAssembly.Module(bytes);
      var instance = new WebAssembly.Instance(module, {
        "e": {
          "f": func
        }
      });
      var wrappedFunc = instance.exports["f"];
      return wrappedFunc;
    }

    var freeTableIndexes = [];

    function addFunctionWasm(func, sig) {
      var table = wasmTable;
      var ret;

      if (freeTableIndexes.length) {
        ret = freeTableIndexes.pop();
      } else {
        ret = table.length;

        try {
          table.grow(1);
        } catch (err) {
          if (!(err instanceof RangeError)) {
            throw err;
          }

          throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
        }
      }

      try {
        table.set(ret, func);
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err;
        }

        assert(typeof sig !== "undefined", "Missing signature argument to addFunction");
        var wrapped = convertJsFunctionToWasm(func, sig);
        table.set(ret, wrapped);
      }

      return ret;
    }

    function removeFunctionWasm(index) {
      freeTableIndexes.push(index);
    }

    function addFunction(func, sig) {
      return addFunctionWasm(func, sig);
    }

    function removeFunction(index) {
      removeFunctionWasm(index);
    }

    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime;
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];

    if (typeof WebAssembly !== "object") {
      err("no native wasm support detected");
    }

    function setValue(ptr, value, type, noSafe) {
      type = type || "i8";
      if (type.charAt(type.length - 1) === "*") type = "i32";

      switch (type) {
        case "i1":
          HEAP8[ptr >> 0] = value;
          break;

        case "i8":
          HEAP8[ptr >> 0] = value;
          break;

        case "i16":
          HEAP16[ptr >> 1] = value;
          break;

        case "i32":
          HEAP32[ptr >> 2] = value;
          break;

        case "i64":
          tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
          break;

        case "float":
          HEAPF32[ptr >> 2] = value;
          break;

        case "double":
          HEAPF64[ptr >> 3] = value;
          break;

        default:
          abort("invalid type for setValue: " + type);
      }
    }

    function getValue(ptr, type, noSafe) {
      type = type || "i8";
      if (type.charAt(type.length - 1) === "*") type = "i32";

      switch (type) {
        case "i1":
          return HEAP8[ptr >> 0];

        case "i8":
          return HEAP8[ptr >> 0];

        case "i16":
          return HEAP16[ptr >> 1];

        case "i32":
          return HEAP32[ptr >> 2];

        case "i64":
          return HEAP32[ptr >> 2];

        case "float":
          return HEAPF32[ptr >> 2];

        case "double":
          return HEAPF64[ptr >> 3];

        default:
          abort("invalid type for getValue: " + type);
      }

      return null;
    }

    var wasmMemory;
    var wasmTable = new WebAssembly.Table({
      "initial": 328,
      "maximum": 328 + 64,
      "element": "anyfunc"
    });
    var ABORT = false;
    var EXITSTATUS = 0;

    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text);
      }
    }

    function getCFunc(ident) {
      var func = Module["_" + ident];
      assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
      return func;
    }

    function ccall(ident, returnType, argTypes, args, opts) {
      var toC = {
        "string": function (str) {
          var ret = 0;

          if (str !== null && str !== undefined && str !== 0) {
            var len = (str.length << 2) + 1;
            ret = stackAlloc(len);
            stringToUTF8(str, ret, len);
          }

          return ret;
        },
        "array": function (arr) {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };

      function convertReturnValue(ret) {
        if (returnType === "string") return UTF8ToString(ret);
        if (returnType === "boolean") return Boolean(ret);
        return ret;
      }

      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;

      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];

          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }

      var ret = func.apply(null, cArgs);
      ret = convertReturnValue(ret);
      if (stack !== 0) stackRestore(stack);
      return ret;
    }

    function cwrap(ident, returnType, argTypes, opts) {
      argTypes = argTypes || [];
      var numericArgs = argTypes.every(function (type) {
        return type === "number";
      });
      var numericRet = returnType !== "string";

      if (numericRet && numericArgs && !opts) {
        return getCFunc(ident);
      }

      return function () {
        return ccall(ident, returnType, argTypes, arguments, opts);
      };
    }

    var ALLOC_NORMAL = 0;
    var ALLOC_NONE = 3;

    function allocate(slab, types, allocator, ptr) {
      var zeroinit, size;

      if (typeof slab === "number") {
        zeroinit = true;
        size = slab;
      } else {
        zeroinit = false;
        size = slab.length;
      }

      var singleType = typeof types === "string" ? types : null;
      var ret;

      if (allocator == ALLOC_NONE) {
        ret = ptr;
      } else {
        ret = [_malloc, stackAlloc, dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length));
      }

      if (zeroinit) {
        var stop;
        ptr = ret;
        assert((ret & 3) == 0);
        stop = ret + (size & ~3);

        for (; ptr < stop; ptr += 4) {
          HEAP32[ptr >> 2] = 0;
        }

        stop = ret + size;

        while (ptr < stop) {
          HEAP8[ptr++ >> 0] = 0;
        }

        return ret;
      }

      if (singleType === "i8") {
        if (slab.subarray || slab.slice) {
          HEAPU8.set(slab, ret);
        } else {
          HEAPU8.set(new Uint8Array(slab), ret);
        }

        return ret;
      }

      var i = 0,
          type,
          typeSize,
          previousType;

      while (i < size) {
        var curr = slab[i];
        type = singleType || types[i];

        if (type === 0) {
          i++;
          continue;
        }

        if (type == "i64") type = "i32";
        setValue(ret + i, curr, type);

        if (previousType !== type) {
          typeSize = getNativeTypeSize(type);
          previousType = type;
        }

        i += typeSize;
      }

      return ret;
    }

    var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

    function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;

      while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;

      if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
      } else {
        var str = "";

        while (idx < endPtr) {
          var u0 = u8Array[idx++];

          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }

          var u1 = u8Array[idx++] & 63;

          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }

          var u2 = u8Array[idx++] & 63;

          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63;
          }

          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
      }

      return str;
    }

    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }

    function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;

      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);

        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = 65536 + ((u & 1023) << 10) | u1 & 1023;
        }

        if (u <= 127) {
          if (outIdx >= endIdx) break;
          outU8Array[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          outU8Array[outIdx++] = 192 | u >> 6;
          outU8Array[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          outU8Array[outIdx++] = 224 | u >> 12;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx) break;
          outU8Array[outIdx++] = 240 | u >> 18;
          outU8Array[outIdx++] = 128 | u >> 12 & 63;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        }
      }

      outU8Array[outIdx] = 0;
      return outIdx - startIdx;
    }

    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }

    function lengthBytesUTF8(str) {
      var len = 0;

      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127) ++len;else if (u <= 2047) len += 2;else if (u <= 65535) len += 3;else len += 4;
      }

      return len;
    }

    var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

    function allocateUTF8OnStack(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }

    function writeArrayToMemory(array, buffer) {
      HEAP8.set(array, buffer);
    }

    function writeAsciiToMemory(str, buffer, dontAddNull) {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i);
      }

      if (!dontAddNull) HEAP8[buffer >> 0] = 0;
    }

    var WASM_PAGE_SIZE = 65536;

    function alignUp(x, multiple) {
      if (x % multiple > 0) {
        x += multiple - x % multiple;
      }

      return x;
    }

    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }

    var DYNAMIC_BASE = 5293984,
        DYNAMICTOP_PTR = 50944;
    var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;

    if (Module["wasmMemory"]) {
      wasmMemory = Module["wasmMemory"];
    } else {
      wasmMemory = new WebAssembly.Memory({
        "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
      });
    }

    if (wasmMemory) {
      buffer = wasmMemory.buffer;
    }

    INITIAL_INITIAL_MEMORY = buffer.byteLength;
    updateGlobalBufferAndViews(buffer);
    HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();

        if (typeof callback == "function") {
          callback();
          continue;
        }

        var func = callback.func;

        if (typeof func === "number") {
          if (callback.arg === undefined) {
            Module["dynCall_v"](func);
          } else {
            Module["dynCall_vi"](func, callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }

    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATMAIN__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;

    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];

        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }

      callRuntimeCallbacks(__ATPRERUN__);
    }

    function initRuntime() {
      runtimeInitialized = true;
      if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
      TTY.init();
      callRuntimeCallbacks(__ATINIT__);
    }

    function preMain() {
      FS.ignorePermissions = false;
      callRuntimeCallbacks(__ATMAIN__);
    }

    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];

        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }

      callRuntimeCallbacks(__ATPOSTRUN__);
    }

    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }

    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }

    var Math_abs = Math.abs;
    var Math_ceil = Math.ceil;
    var Math_floor = Math.floor;
    var Math_min = Math.min;
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;

    function getUniqueRunDependency(id) {
      return id;
    }

    function addRunDependency(id) {
      runDependencies++;

      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }

    function removeRunDependency(id) {
      runDependencies--;

      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }

      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }

        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }

    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};

    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }

      what += "";
      out(what);
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
      throw new WebAssembly.RuntimeError(what);
    }

    var dataURIPrefix = "data:application/octet-stream;base64,";

    function isDataURI(filename) {
      return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0;
    }

    var wasmBinaryFile = "blogsearch.wasm";

    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }

    function getBinary() {
      try {
        if (wasmBinary) {
          return new Uint8Array(wasmBinary);
        }

        if (readBinary) {
          return readBinary(wasmBinaryFile);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err) {
        abort(err);
      }
    }

    function getBinaryPromise() {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
        return fetch(wasmBinaryFile, {
          credentials: "same-origin"
        }).then(function (response) {
          if (!response["ok"]) {
            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
          }

          return response["arrayBuffer"]();
        }).catch(function () {
          return getBinary();
        });
      }

      return new Promise(function (resolve, reject) {
        resolve(getBinary());
      });
    }

    function createWasm() {
      var info = {
        "a": asmLibraryArg
      };

      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        removeRunDependency("wasm-instantiate");
      }

      addRunDependency("wasm-instantiate");

      function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"]);
      }

      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function (binary) {
          return WebAssembly.instantiate(binary, info);
        }).then(receiver, function (reason) {
          err("failed to asynchronously prepare wasm: " + reason);
          abort(reason);
        });
      }

      function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
          fetch(wasmBinaryFile, {
            credentials: "same-origin"
          }).then(function (response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then(receiveInstantiatedSource, function (reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              instantiateArrayBuffer(receiveInstantiatedSource);
            });
          });
        } else {
          return instantiateArrayBuffer(receiveInstantiatedSource);
        }
      }

      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }

      instantiateAsync();
      return {};
    }

    var tempDouble;
    var tempI64;

    __ATINIT__.push({
      func: function () {
        ___wasm_call_ctors();
      }
    });

    function demangle(func) {
      return func;
    }

    function demangleAll(text) {
      var regex = /\b_Z[\w\d_]+/g;
      return text.replace(regex, function (x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]";
      });
    }

    function jsStackTrace() {
      var err = new Error();

      if (!err.stack) {
        try {
          throw new Error();
        } catch (e) {
          err = e;
        }

        if (!err.stack) {
          return "(no stack trace available)";
        }
      }

      return err.stack.toString();
    }

    function stackTrace() {
      var js = jsStackTrace();
      if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
      return demangleAll(js);
    }

    var PATH = {
      splitPath: function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
      normalizeArray: function (parts, allowAboveRoot) {
        var up = 0;

        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];

          if (last === ".") {
            parts.splice(i, 1);
          } else if (last === "..") {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }

        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift("..");
          }
        }

        return parts;
      },
      normalize: function (path) {
        var isAbsolute = path.charAt(0) === "/",
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(function (p) {
          return !!p;
        }), !isAbsolute).join("/");

        if (!path && !isAbsolute) {
          path = ".";
        }

        if (path && trailingSlash) {
          path += "/";
        }

        return (isAbsolute ? "/" : "") + path;
      },
      dirname: function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];

        if (!root && !dir) {
          return ".";
        }

        if (dir) {
          dir = dir.substr(0, dir.length - 1);
        }

        return root + dir;
      },
      basename: function (path) {
        if (path === "/") return "/";
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1);
      },
      extname: function (path) {
        return PATH.splitPath(path)[3];
      },
      join: function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"));
      },
      join2: function (l, r) {
        return PATH.normalize(l + "/" + r);
      }
    };

    function ___setErrNo(value) {
      if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
      return value;
    }

    var PATH_FS = {
      resolve: function () {
        var resolvedPath = "",
            resolvedAbsolute = false;

        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? arguments[i] : FS.cwd();

          if (typeof path !== "string") {
            throw new TypeError("Arguments to path.resolve must be strings");
          } else if (!path) {
            return "";
          }

          resolvedPath = path + "/" + resolvedPath;
          resolvedAbsolute = path.charAt(0) === "/";
        }

        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function (p) {
          return !!p;
        }), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
      },
      relative: function (from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);

        function trim(arr) {
          var start = 0;

          for (; start < arr.length; start++) {
            if (arr[start] !== "") break;
          }

          var end = arr.length - 1;

          for (; end >= 0; end--) {
            if (arr[end] !== "") break;
          }

          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }

        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;

        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }

        var outputParts = [];

        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push("..");
        }

        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/");
      }
    };
    var TTY = {
      ttys: [],
      init: function () {},
      shutdown: function () {},
      register: function (dev, ops) {
        TTY.ttys[dev] = {
          input: [],
          output: [],
          ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops);
      },
      stream_ops: {
        open: function (stream) {
          var tty = TTY.ttys[stream.node.rdev];

          if (!tty) {
            throw new FS.ErrnoError(43);
          }

          stream.tty = tty;
          stream.seekable = false;
        },
        close: function (stream) {
          stream.tty.ops.flush(stream.tty);
        },
        flush: function (stream) {
          stream.tty.ops.flush(stream.tty);
        },
        read: function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }

          var bytesRead = 0;

          for (var i = 0; i < length; i++) {
            var result;

            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }

            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }

            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset + i] = result;
          }

          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }

          return bytesRead;
        },
        write: function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }

          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }

          if (length) {
            stream.node.timestamp = Date.now();
          }

          return i;
        }
      },
      default_tty_ops: {
        get_char: function (tty) {
          if (!tty.input.length) {
            var result = null;

            if (typeof window != "undefined" && typeof window.prompt == "function") {
              result = window.prompt("Input: ");

              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();

              if (result !== null) {
                result += "\n";
              }
            }

            if (!result) {
              return null;
            }

            tty.input = intArrayFromString(result, true);
          }

          return tty.input.shift();
        },
        put_char: function (tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        flush: function (tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }
      },
      default_tty1_ops: {
        put_char: function (tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        flush: function (tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }
      }
    };
    var MEMFS = {
      ops_table: null,
      mount: function (mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0);
      },
      createNode: function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          throw new FS.ErrnoError(63);
        }

        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }

        var node = FS.createNode(parent, name, mode, dev);

        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0;
          node.contents = null;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }

        node.timestamp = Date.now();

        if (parent) {
          parent.contents[name] = node;
        }

        return node;
      },
      getFileDataAsRegularArray: function (node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];

          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);

          return arr;
        }

        return node.contents;
      },
      getFileDataAsTypedArray: function (node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents);
      },
      expandFileStorage: function (node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
        return;
      },
      resizeFileStorage: function (node, newSize) {
        if (node.usedBytes == newSize) return;

        if (newSize == 0) {
          node.contents = null;
          node.usedBytes = 0;
          return;
        }

        if (!node.contents || node.contents.subarray) {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);

          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
          }

          node.usedBytes = newSize;
          return;
        }

        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },
      node_ops: {
        getattr: function (node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;

          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }

          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
        setattr: function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }

          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }

          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
        lookup: function (parent, name) {
          throw FS.genericErrors[44];
        },
        mknod: function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
        rename: function (old_node, new_dir, new_name) {
          if (FS.isDir(old_node.mode)) {
            var new_node;

            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {}

            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }

          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },
        unlink: function (parent, name) {
          delete parent.contents[name];
        },
        rmdir: function (parent, name) {
          var node = FS.lookupNode(parent, name);

          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }

          delete parent.contents[name];
        },
        readdir: function (node) {
          var entries = [".", ".."];

          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }

            entries.push(key);
          }

          return entries;
        },
        symlink: function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        },
        readlink: function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }

          return node.link;
        }
      },
      stream_ops: {
        read: function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);

          if (size > 8 && contents.subarray) {
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }

          return size;
        },
        write: function (stream, buffer, offset, length, position, canOwn) {
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }

          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();

          if (buffer.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) {
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }

          MEMFS.expandFileStorage(node, position + length);
          if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position);else {
            for (var i = 0; i < length; i++) {
              node.contents[position + i] = buffer[offset + i];
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
        llseek: function (stream, offset, whence) {
          var position = offset;

          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }

          if (position < 0) {
            throw new FS.ErrnoError(28);
          }

          return position;
        },
        allocate: function (stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },
        mmap: function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }

          var ptr;
          var allocated;
          var contents = stream.node.contents;

          if (!(flags & 2) && contents.buffer === buffer.buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }

            allocated = true;
            var fromHeap = buffer.buffer == HEAP8.buffer;
            ptr = _malloc(length);

            if (!ptr) {
              throw new FS.ErrnoError(48);
            }

            (fromHeap ? HEAP8 : buffer).set(contents, ptr);
          }

          return {
            ptr: ptr,
            allocated: allocated
          };
        },
        msync: function (stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }

          if (mmapFlags & 2) {
            return 0;
          }

          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          return 0;
        }
      }
    };
    var FS = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: "/",
      initialized: false,
      ignorePermissions: true,
      trackingDelegate: {},
      tracking: {
        openFlags: {
          READ: 1,
          WRITE: 2
        }
      },
      ErrnoError: null,
      genericErrors: {},
      filesystems: null,
      syncFSRequests: 0,
      handleFSError: function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
        return ___setErrNo(e.errno);
      },
      lookupPath: function (path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};
        if (!path) return {
          path: "",
          node: null
        };
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };

        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }

        if (opts.recurse_count > 8) {
          throw new FS.ErrnoError(32);
        }

        var parts = PATH.normalizeArray(path.split("/").filter(function (p) {
          return !!p;
        }), false);
        var current = FS.root;
        var current_path = "/";

        for (var i = 0; i < parts.length; i++) {
          var islast = i === parts.length - 1;

          if (islast && opts.parent) {
            break;
          }

          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);

          if (FS.isMountpoint(current)) {
            if (!islast || islast && opts.follow_mount) {
              current = current.mounted.root;
            }
          }

          if (!islast || opts.follow) {
            var count = 0;

            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, {
                recurse_count: opts.recurse_count
              });
              current = lookup.node;

              if (count++ > 40) {
                throw new FS.ErrnoError(32);
              }
            }
          }
        }

        return {
          path: current_path,
          node: current
        };
      },
      getPath: function (node) {
        var path;

        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
          }

          path = path ? node.name + "/" + path : node.name;
          node = node.parent;
        }
      },
      hashName: function (parentid, name) {
        var hash = 0;

        for (var i = 0; i < name.length; i++) {
          hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
        }

        return (parentid + hash >>> 0) % FS.nameTable.length;
      },
      hashAddNode: function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
      hashRemoveNode: function (node) {
        var hash = FS.hashName(node.parent.id, node.name);

        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];

          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }

            current = current.name_next;
          }
        }
      },
      lookupNode: function (parent, name) {
        var errCode = FS.mayLookup(parent);

        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }

        var hash = FS.hashName(parent.id, name);

        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;

          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }

        return FS.lookup(parent, name);
      },
      createNode: function (parent, name, mode, rdev) {
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
      },
      destroyNode: function (node) {
        FS.hashRemoveNode(node);
      },
      isRoot: function (node) {
        return node === node.parent;
      },
      isMountpoint: function (node) {
        return !!node.mounted;
      },
      isFile: function (mode) {
        return (mode & 61440) === 32768;
      },
      isDir: function (mode) {
        return (mode & 61440) === 16384;
      },
      isLink: function (mode) {
        return (mode & 61440) === 40960;
      },
      isChrdev: function (mode) {
        return (mode & 61440) === 8192;
      },
      isBlkdev: function (mode) {
        return (mode & 61440) === 24576;
      },
      isFIFO: function (mode) {
        return (mode & 61440) === 4096;
      },
      isSocket: function (mode) {
        return (mode & 49152) === 49152;
      },
      flagModes: {
        "r": 0,
        "rs": 1052672,
        "r+": 2,
        "w": 577,
        "wx": 705,
        "xw": 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        "a": 1089,
        "ax": 1217,
        "xa": 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218
      },
      modeStringToFlags: function (str) {
        var flags = FS.flagModes[str];

        if (typeof flags === "undefined") {
          throw new Error("Unknown file open mode: " + str);
        }

        return flags;
      },
      flagsToPermissionString: function (flag) {
        var perms = ["r", "w", "rw"][flag & 3];

        if (flag & 512) {
          perms += "w";
        }

        return perms;
      },
      nodePermissions: function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }

        if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
          return 2;
        } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
          return 2;
        } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
          return 2;
        }

        return 0;
      },
      mayLookup: function (dir) {
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
      mayCreate: function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {}

        return FS.nodePermissions(dir, "wx");
      },
      mayDelete: function (dir, name, isdir) {
        var node;

        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }

        var errCode = FS.nodePermissions(dir, "wx");

        if (errCode) {
          return errCode;
        }

        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }

          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }

        return 0;
      },
      mayOpen: function (node, flags) {
        if (!node) {
          return 44;
        }

        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
            return 31;
          }
        }

        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
      MAX_OPEN_FDS: 4096,
      nextfd: function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;

        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }

        throw new FS.ErrnoError(33);
      },
      getStream: function (fd) {
        return FS.streams[fd];
      },
      createStream: function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function () {};

          FS.FSStream.prototype = {
            object: {
              get: function () {
                return this.node;
              },
              set: function (val) {
                this.node = val;
              }
            },
            isRead: {
              get: function () {
                return (this.flags & 2097155) !== 1;
              }
            },
            isWrite: {
              get: function () {
                return (this.flags & 2097155) !== 0;
              }
            },
            isAppend: {
              get: function () {
                return this.flags & 1024;
              }
            }
          };
        }

        var newStream = new FS.FSStream();

        for (var p in stream) {
          newStream[p] = stream[p];
        }

        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
      closeStream: function (fd) {
        FS.streams[fd] = null;
      },
      chrdev_stream_ops: {
        open: function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;

          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },
        llseek: function () {
          throw new FS.ErrnoError(70);
        }
      },
      major: function (dev) {
        return dev >> 8;
      },
      minor: function (dev) {
        return dev & 255;
      },
      makedev: function (ma, mi) {
        return ma << 8 | mi;
      },
      registerDevice: function (dev, ops) {
        FS.devices[dev] = {
          stream_ops: ops
        };
      },
      getDevice: function (dev) {
        return FS.devices[dev];
      },
      getMounts: function (mount) {
        var mounts = [];
        var check = [mount];

        while (check.length) {
          var m = check.pop();
          mounts.push(m);
          check.push.apply(check, m.mounts);
        }

        return mounts;
      },
      syncfs: function (populate, callback) {
        if (typeof populate === "function") {
          callback = populate;
          populate = false;
        }

        FS.syncFSRequests++;

        if (FS.syncFSRequests > 1) {
          err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
        }

        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(errCode) {
          FS.syncFSRequests--;
          return callback(errCode);
        }

        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }

            return;
          }

          if (++completed >= mounts.length) {
            doCallback(null);
          }
        }

        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }

          mount.type.syncfs(mount, populate, done);
        });
      },
      mount: function (type, opts, mountpoint) {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;

        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
          });
          mountpoint = lookup.path;
          node = lookup.node;

          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }

          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }

        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;

        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          node.mounted = mount;

          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }

        return mountRoot;
      },
      unmount: function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, {
          follow_mount: false
        });

        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }

        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];

          while (current) {
            var next = current.name_next;

            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }

            current = next;
          }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1);
      },
      lookup: function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
      mknod: function (path, mode, dev) {
        var lookup = FS.lookupPath(path, {
          parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);

        if (!name || name === "." || name === "..") {
          throw new FS.ErrnoError(28);
        }

        var errCode = FS.mayCreate(parent, name);

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }

        return parent.node_ops.mknod(parent, name, mode, dev);
      },
      create: function (path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
      mkdir: function (path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
      mkdirTree: function (path, mode) {
        var dirs = path.split("/");
        var d = "";

        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += "/" + dirs[i];

          try {
            FS.mkdir(d, mode);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
        }
      },
      mkdev: function (path, mode, dev) {
        if (typeof dev === "undefined") {
          dev = mode;
          mode = 438;
        }

        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
      symlink: function (oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }

        var lookup = FS.lookupPath(newpath, {
          parent: true
        });
        var parent = lookup.node;

        if (!parent) {
          throw new FS.ErrnoError(44);
        }

        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }

        return parent.node_ops.symlink(parent, newname, oldpath);
      },
      rename: function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;

        try {
          lookup = FS.lookupPath(old_path, {
            parent: true
          });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, {
            parent: true
          });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(10);
        }

        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);

        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }

        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);

        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(28);
        }

        relative = PATH_FS.relative(new_path, old_dirname);

        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(55);
        }

        var new_node;

        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}

        if (old_node === new_node) {
          return;
        }

        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }

        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
          throw new FS.ErrnoError(10);
        }

        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, "w");

          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }

        try {
          if (FS.trackingDelegate["willMovePath"]) {
            FS.trackingDelegate["willMovePath"](old_path, new_path);
          }
        } catch (e) {
          err("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
        }

        FS.hashRemoveNode(old_node);

        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          FS.hashAddNode(old_node);
        }

        try {
          if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path);
        } catch (e) {
          err("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
        }
      },
      rmdir: function (path) {
        var lookup = FS.lookupPath(path, {
          parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }

        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }

        try {
          if (FS.trackingDelegate["willDeletePath"]) {
            FS.trackingDelegate["willDeletePath"](path);
          }
        } catch (e) {
          err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
        }

        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);

        try {
          if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
        } catch (e) {
          err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
        }
      },
      readdir: function (path) {
        var lookup = FS.lookupPath(path, {
          follow: true
        });
        var node = lookup.node;

        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }

        return node.node_ops.readdir(node);
      },
      unlink: function (path) {
        var lookup = FS.lookupPath(path, {
          parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }

        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }

        try {
          if (FS.trackingDelegate["willDeletePath"]) {
            FS.trackingDelegate["willDeletePath"](path);
          }
        } catch (e) {
          err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
        }

        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);

        try {
          if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
        } catch (e) {
          err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
        }
      },
      readlink: function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;

        if (!link) {
          throw new FS.ErrnoError(44);
        }

        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }

        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },
      stat: function (path, dontFollow) {
        var lookup = FS.lookupPath(path, {
          follow: !dontFollow
        });
        var node = lookup.node;

        if (!node) {
          throw new FS.ErrnoError(44);
        }

        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }

        return node.node_ops.getattr(node);
      },
      lstat: function (path) {
        return FS.stat(path, true);
      },
      chmod: function (path, mode, dontFollow) {
        var node;

        if (typeof path === "string") {
          var lookup = FS.lookupPath(path, {
            follow: !dontFollow
          });
          node = lookup.node;
        } else {
          node = path;
        }

        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }

        node.node_ops.setattr(node, {
          mode: mode & 4095 | node.mode & ~4095,
          timestamp: Date.now()
        });
      },
      lchmod: function (path, mode) {
        FS.chmod(path, mode, true);
      },
      fchmod: function (fd, mode) {
        var stream = FS.getStream(fd);

        if (!stream) {
          throw new FS.ErrnoError(8);
        }

        FS.chmod(stream.node, mode);
      },
      chown: function (path, uid, gid, dontFollow) {
        var node;

        if (typeof path === "string") {
          var lookup = FS.lookupPath(path, {
            follow: !dontFollow
          });
          node = lookup.node;
        } else {
          node = path;
        }

        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }

        node.node_ops.setattr(node, {
          timestamp: Date.now()
        });
      },
      lchown: function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
      fchown: function (fd, uid, gid) {
        var stream = FS.getStream(fd);

        if (!stream) {
          throw new FS.ErrnoError(8);
        }

        FS.chown(stream.node, uid, gid);
      },
      truncate: function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }

        var node;

        if (typeof path === "string") {
          var lookup = FS.lookupPath(path, {
            follow: true
          });
          node = lookup.node;
        } else {
          node = path;
        }

        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }

        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }

        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }

        var errCode = FS.nodePermissions(node, "w");

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },
      ftruncate: function (fd, len) {
        var stream = FS.getStream(fd);

        if (!stream) {
          throw new FS.ErrnoError(8);
        }

        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }

        FS.truncate(stream.node, len);
      },
      utime: function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, {
          follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },
      open: function (path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }

        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;

        if (flags & 64) {
          mode = mode & 4095 | 32768;
        } else {
          mode = 0;
        }

        var node;

        if (typeof path === "object") {
          node = path;
        } else {
          path = PATH.normalize(path);

          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {}
        }

        var created = false;

        if (flags & 64) {
          if (node) {
            if (flags & 128) {
              throw new FS.ErrnoError(20);
            }
          } else {
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }

        if (!node) {
          throw new FS.ErrnoError(44);
        }

        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }

        if (flags & 65536 && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }

        if (!created) {
          var errCode = FS.mayOpen(node, flags);

          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }

        if (flags & 512) {
          FS.truncate(node, 0);
        }

        flags &= ~(128 | 512);
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          ungotten: [],
          error: false
        }, fd_start, fd_end);

        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }

        if (Module["logReadFiles"] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};

          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            err("FS.trackingDelegate error on read file: " + path);
          }
        }

        try {
          if (FS.trackingDelegate["onOpenFile"]) {
            var trackingFlags = 0;

            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }

            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }

            FS.trackingDelegate["onOpenFile"](path, trackingFlags);
          }
        } catch (e) {
          err("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message);
        }

        return stream;
      },
      close: function (stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }

        if (stream.getdents) stream.getdents = null;

        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }

        stream.fd = null;
      },
      isClosed: function (stream) {
        return stream.fd === null;
      },
      llseek: function (stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }

        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }

        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }

        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
      read: function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }

        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }

        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }

        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }

        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }

        var seeking = typeof position !== "undefined";

        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }

        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
      write: function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }

        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }

        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }

        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }

        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }

        if (stream.flags & 1024) {
          FS.llseek(stream, 0, 2);
        }

        var seeking = typeof position !== "undefined";

        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }

        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;

        try {
          if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path);
        } catch (e) {
          err("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message);
        }

        return bytesWritten;
      },
      allocate: function (stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }

        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }

        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }

        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }

        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }

        stream.stream_ops.allocate(stream, offset, length);
      },
      mmap: function (stream, buffer, offset, length, position, prot, flags) {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }

        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }

        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }

        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },
      msync: function (stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }

        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
      munmap: function (stream) {
        return 0;
      },
      ioctl: function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }

        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
      readFile: function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "r";
        opts.encoding = opts.encoding || "binary";

        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }

        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);

        if (opts.encoding === "utf8") {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === "binary") {
          ret = buf;
        }

        FS.close(stream);
        return ret;
      },
      writeFile: function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "w";
        var stream = FS.open(path, opts.flags, opts.mode);

        if (typeof data === "string") {
          var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error("Unsupported data type");
        }

        FS.close(stream);
      },
      cwd: function () {
        return FS.currentPath;
      },
      chdir: function (path) {
        var lookup = FS.lookupPath(path, {
          follow: true
        });

        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }

        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }

        var errCode = FS.nodePermissions(lookup.node, "x");

        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }

        FS.currentPath = lookup.path;
      },
      createDefaultDirectories: function () {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user");
      },
      createDefaultDevices: function () {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
          read: function () {
            return 0;
          },
          write: function (stream, buffer, offset, length, pos) {
            return length;
          }
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device;

        if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
          var randomBuffer = new Uint8Array(1);

          random_device = function () {
            crypto.getRandomValues(randomBuffer);
            return randomBuffer[0];
          };
        } else {}

        if (!random_device) {
          random_device = function () {
            abort("random_device");
          };
        }

        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories: function () {
        FS.mkdir("/proc");
        FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
          mount: function () {
            var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
            node.node_ops = {
              lookup: function (parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                var ret = {
                  parent: null,
                  mount: {
                    mountpoint: "fake"
                  },
                  node_ops: {
                    readlink: function () {
                      return stream.path;
                    }
                  }
                };
                ret.parent = ret;
                return ret;
              }
            };
            return node;
          }
        }, {}, "/proc/self/fd");
      },
      createStandardStreams: function () {
        if (Module["stdin"]) {
          FS.createDevice("/dev", "stdin", Module["stdin"]);
        } else {
          FS.symlink("/dev/tty", "/dev/stdin");
        }

        if (Module["stdout"]) {
          FS.createDevice("/dev", "stdout", null, Module["stdout"]);
        } else {
          FS.symlink("/dev/tty", "/dev/stdout");
        }

        if (Module["stderr"]) {
          FS.createDevice("/dev", "stderr", null, Module["stderr"]);
        } else {
          FS.symlink("/dev/tty1", "/dev/stderr");
        }

        var stdin = FS.open("/dev/stdin", "r");
        var stdout = FS.open("/dev/stdout", "w");
        var stderr = FS.open("/dev/stderr", "w");
      },
      ensureErrnoError: function () {
        if (FS.ErrnoError) return;

        FS.ErrnoError = function ErrnoError(errno, node) {
          this.node = node;

          this.setErrno = function (errno) {
            this.errno = errno;
          };

          this.setErrno(errno);
          this.message = "FS error";
        };

        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach(function (code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = "<generic error, no stack>";
        });
      },
      staticInit: function () {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
          "MEMFS": MEMFS
        };
      },
      init: function (input, output, error) {
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams();
      },
      quit: function () {
        FS.init.initialized = false;
        var fflush = Module["_fflush"];
        if (fflush) fflush(0);

        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];

          if (!stream) {
            continue;
          }

          FS.close(stream);
        }
      },
      getMode: function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },
      joinPath: function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == "/") path = path.substr(1);
        return path;
      },
      absolutePath: function (relative, base) {
        return PATH_FS.resolve(base, relative);
      },
      standardizePath: function (path) {
        return PATH.normalize(path);
      },
      findObject: function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);

        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);

          return null;
        }
      },
      analyzePath: function (path, dontResolveLastLink) {
        try {
          var lookup = FS.lookupPath(path, {
            follow: !dontResolveLastLink
          });
          path = lookup.path;
        } catch (e) {}

        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null
        };

        try {
          var lookup = FS.lookupPath(path, {
            parent: true
          });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, {
            follow: !dontResolveLastLink
          });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === "/";
        } catch (e) {
          ret.error = e.errno;
        }

        return ret;
      },
      createFolder: function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },
      createPath: function (parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();

        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);

          try {
            FS.mkdir(current);
          } catch (e) {}

          parent = current;
        }

        return current;
      },
      createFile: function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
      createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);

        if (data) {
          if (typeof data === "string") {
            var arr = new Array(data.length);

            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);

            data = arr;
          }

          FS.chmod(node, mode | 146);
          var stream = FS.open(node, "w");
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }

        return node;
      },
      createDevice: function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
          open: function (stream) {
            stream.seekable = false;
          },
          close: function (stream) {
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function (stream, buffer, offset, length, pos) {
            var bytesRead = 0;

            for (var i = 0; i < length; i++) {
              var result;

              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }

              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }

              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset + i] = result;
            }

            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }

            return bytesRead;
          },
          write: function (stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }

            if (length) {
              stream.node.timestamp = Date.now();
            }

            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
      createLink: function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },
      forceLoadFile: function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;

        if (typeof XMLHttpRequest !== "undefined") {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          try {
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error("Cannot load without read() or XMLHttpRequest.");
        }

        if (!success) ___setErrNo(29);
        return success;
      },
      createLazyFile: function (parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = [];
        }

        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length - 1 || idx < 0) {
            return undefined;
          }

          var chunkOffset = idx % this.chunkSize;
          var chunkNum = idx / this.chunkSize | 0;
          return this.getter(chunkNum)[chunkOffset];
        };

        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };

        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          var xhr = new XMLHttpRequest();
          xhr.open("HEAD", url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
          var chunkSize = 1024 * 1024;
          if (!hasByteServing) chunkSize = datalength;

          var doXHR = function (from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
            if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";

            if (xhr.overrideMimeType) {
              xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }

            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);

            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || "", true);
            }
          };

          var lazyArray = this;
          lazyArray.setDataGetter(function (chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum + 1) * chunkSize - 1;
            end = Math.min(end, datalength - 1);

            if (typeof lazyArray.chunks[chunkNum] === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }

            if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });

          if (usesGzip || !datalength) {
            chunkSize = datalength = 1;
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }

          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };

        if (typeof XMLHttpRequest !== "undefined") {
          if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }

                return this._length;
              }
            },
            chunkSize: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }

                return this._chunkSize;
              }
            }
          });
          var properties = {
            isDevice: false,
            contents: lazyArray
          };
        } else {
          var properties = {
            isDevice: false,
            url: url
          };
        }

        var node = FS.createFile(parent, name, properties, canRead, canWrite);

        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }

        Object.defineProperties(node, {
          usedBytes: {
            get: function () {
              return this.contents.length;
            }
          }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function (key) {
          var fn = node.stream_ops[key];

          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(29);
            }

            return fn.apply(null, arguments);
          };
        });

        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(29);
          }

          var contents = stream.node.contents;
          if (position >= contents.length) return 0;
          var size = Math.min(contents.length - position, length);

          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents.get(position + i);
            }
          }

          return size;
        };

        node.stream_ops = stream_ops;
        return node;
      },
      createPreloadedFile: function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init();
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency("cp " + fullname);

        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();

            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }

            if (onload) onload();
            removeRunDependency(dep);
          }

          var handled = false;
          Module["preloadPlugins"].forEach(function (plugin) {
            if (handled) return;

            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, function () {
                if (onerror) onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }

        addRunDependency(dep);

        if (typeof url == "string") {
          Browser.asyncLoad(url, function (byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },
      indexedDB: function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },
      DB_NAME: function () {
        return "EM_FS_" + window.location.pathname;
      },
      DB_VERSION: 20,
      DB_STORE_NAME: "FILE_DATA",
      saveFilesToDB: function (paths, onload, onerror) {
        onload = onload || function () {};

        onerror = onerror || function () {};

        var indexedDB = FS.indexedDB();

        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }

        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          out("creating db");
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };

        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0,
              fail = 0,
              total = paths.length;

          function finish() {
            if (fail == 0) onload();else onerror();
          }

          paths.forEach(function (path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);

            putRequest.onsuccess = function putRequest_onsuccess() {
              ok++;
              if (ok + fail == total) finish();
            };

            putRequest.onerror = function putRequest_onerror() {
              fail++;
              if (ok + fail == total) finish();
            };
          });
          transaction.onerror = onerror;
        };

        openRequest.onerror = onerror;
      },
      loadFilesFromDB: function (paths, onload, onerror) {
        onload = onload || function () {};

        onerror = onerror || function () {};

        var indexedDB = FS.indexedDB();

        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }

        openRequest.onupgradeneeded = onerror;

        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;

          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
          } catch (e) {
            onerror(e);
            return;
          }

          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0,
              fail = 0,
              total = paths.length;

          function finish() {
            if (fail == 0) onload();else onerror();
          }

          paths.forEach(function (path) {
            var getRequest = files.get(path);

            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }

              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };

            getRequest.onerror = function getRequest_onerror() {
              fail++;
              if (ok + fail == total) finish();
            };
          });
          transaction.onerror = onerror;
        };

        openRequest.onerror = onerror;
      }
    };
    var SYSCALLS = {
      mappings: {},
      DEFAULT_POLLMASK: 5,
      umask: 511,
      calculateAt: function (dirfd, path) {
        if (path[0] !== "/") {
          var dir;

          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(8);
            dir = dirstream.path;
          }

          path = PATH.join2(dir, path);
        }

        return path;
      },
      doStat: function (func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            return -54;
          }

          throw e;
        }

        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = 0;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAP32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        HEAP32[buf + 32 >> 2] = 0;
        tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
        HEAP32[buf + 48 >> 2] = 4096;
        HEAP32[buf + 52 >> 2] = stat.blocks;
        HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
        HEAP32[buf + 60 >> 2] = 0;
        HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
        HEAP32[buf + 68 >> 2] = 0;
        HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
        HEAP32[buf + 76 >> 2] = 0;
        tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
        return 0;
      },
      doMsync: function (addr, stream, len, flags, offset) {
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
      doMkdir: function (path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0;
      },
      doMknod: function (path, mode, dev) {
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;

          default:
            return -28;
        }

        FS.mknod(path, mode, dev);
        return 0;
      },
      doReadlink: function (path, buf, bufsize) {
        if (bufsize <= 0) return -28;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len;
      },
      doAccess: function (path, amode) {
        if (amode & ~7) {
          return -28;
        }

        var node;
        var lookup = FS.lookupPath(path, {
          follow: true
        });
        node = lookup.node;

        if (!node) {
          return -44;
        }

        var perms = "";
        if (amode & 4) perms += "r";
        if (amode & 2) perms += "w";
        if (amode & 1) perms += "x";

        if (perms && FS.nodePermissions(node, perms)) {
          return -2;
        }

        return 0;
      },
      doDup: function (path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
      },
      doReadv: function (stream, iov, iovcnt, offset) {
        var ret = 0;

        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[iov + i * 8 >> 2];
          var len = HEAP32[iov + (i * 8 + 4) >> 2];
          var curr = FS.read(stream, HEAP8, ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break;
        }

        return ret;
      },
      doWritev: function (stream, iov, iovcnt, offset) {
        var ret = 0;

        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[iov + i * 8 >> 2];
          var len = HEAP32[iov + (i * 8 + 4) >> 2];
          var curr = FS.write(stream, HEAP8, ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
        }

        return ret;
      },
      varargs: undefined,
      get: function () {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret;
      },
      getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
      getStreamFromFD: function (fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      },
      get64: function (low, high) {
        return low;
      }
    };

    function ___syscall10(path) {
      try {
        path = SYSCALLS.getStr(path);
        FS.unlink(path);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall15(path, mode) {
      try {
        path = SYSCALLS.getStr(path);
        FS.chmod(path, mode);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall183(buf, size) {
      try {
        if (size === 0) return -28;
        var cwd = FS.cwd();
        var cwdLengthInBytes = lengthBytesUTF8(cwd);
        if (size < cwdLengthInBytes + 1) return -68;
        stringToUTF8(cwd, buf, size);
        return buf;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall194(fd, zero, low, high) {
      try {
        var length = SYSCALLS.get64(low, high);
        FS.ftruncate(fd, length);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall195(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.stat, path, buf);
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall196(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.lstat, path, buf);
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall197(fd, buf) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return SYSCALLS.doStat(FS.stat, stream.path, buf);
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall20() {
      return 42;
    }

    function ___syscall202() {
      return 0;
    }

    function ___syscall201() {
      return ___syscall202();
    }

    function ___syscall207(fd, owner, group) {
      try {
        FS.fchown(fd, owner, group);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall212(path, owner, group) {
      try {
        path = SYSCALLS.getStr(path);
        FS.chown(path, owner, group);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall221(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs;

      try {
        var stream = SYSCALLS.getStreamFromFD(fd);

        switch (cmd) {
          case 0:
            {
              var arg = SYSCALLS.get();

              if (arg < 0) {
                return -28;
              }

              var newStream;
              newStream = FS.open(stream.path, stream.flags, 0, arg);
              return newStream.fd;
            }

          case 1:
          case 2:
            return 0;

          case 3:
            return stream.flags;

          case 4:
            {
              var arg = SYSCALLS.get();
              stream.flags |= arg;
              return 0;
            }

          case 12:
            {
              var arg = SYSCALLS.get();
              var offset = 0;
              HEAP16[arg + offset >> 1] = 2;
              return 0;
            }

          case 13:
          case 14:
            return 0;

          case 16:
          case 8:
            return -28;

          case 9:
            ___setErrNo(28);

            return -1;

          default:
            {
              return -28;
            }
        }
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall3(fd, buf, count) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return FS.read(stream, HEAP8, buf, count);
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall33(path, amode) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doAccess(path, amode);
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall39(path, mode) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doMkdir(path, mode);
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall40(path) {
      try {
        path = SYSCALLS.getStr(path);
        FS.rmdir(path);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall5(path, flags, varargs) {
      SYSCALLS.varargs = varargs;

      try {
        var pathname = SYSCALLS.getStr(path);
        var mode = SYSCALLS.get();
        var stream = FS.open(pathname, flags, mode);
        return stream.fd;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall85(path, buf, bufsize) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doReadlink(path, buf, bufsize);
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function ___syscall94(fd, mode) {
      try {
        FS.fchmod(fd, mode);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno;
      }
    }

    function _emscripten_get_heap_size() {
      return HEAPU8.length;
    }

    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {}
    }

    function _emscripten_resize_heap(requestedSize) {
      var oldSize = _emscripten_get_heap_size();

      var PAGE_MULTIPLE = 65536;
      var maxHeapSize = 2147483648 - PAGE_MULTIPLE;

      if (requestedSize > maxHeapSize) {
        return false;
      }

      var minHeapSize = 16777216;

      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), PAGE_MULTIPLE));
        var replacement = emscripten_realloc_buffer(newSize);

        if (replacement) {
          return true;
        }
      }

      return false;
    }

    var ENV = {};

    function __getExecutableName() {
      return thisProgram || "./this.program";
    }

    function _emscripten_get_environ() {
      if (!_emscripten_get_environ.strings) {
        var env = {
          "USER": "web_user",
          "LOGNAME": "web_user",
          "PATH": "/",
          "PWD": "/",
          "HOME": "/home/web_user",
          "LANG": (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
          "_": __getExecutableName()
        };

        for (var x in ENV) {
          env[x] = ENV[x];
        }

        var strings = [];

        for (var x in env) {
          strings.push(x + "=" + env[x]);
        }

        _emscripten_get_environ.strings = strings;
      }

      return _emscripten_get_environ.strings;
    }

    function _environ_get(__environ, environ_buf) {
      var strings = _emscripten_get_environ();

      var bufSize = 0;
      strings.forEach(function (string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[__environ + i * 4 >> 2] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

    function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = _emscripten_get_environ();

      HEAP32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach(function (string) {
        bufSize += string.length + 1;
      });
      HEAP32[penviron_buf_size >> 2] = bufSize;
      return 0;
    }

    function _fd_close(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno;
      }
    }

    function _fd_fdstat_get(fd, pbuf) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
        HEAP8[pbuf >> 0] = type;
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno;
      }
    }

    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var HIGH_OFFSET = 4294967296;
        var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
        var DOUBLE_LIMIT = 9007199254740992;

        if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
          return -61;
        }

        FS.llseek(stream, offset, whence);
        tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno;
      }
    }

    function _fd_sync(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);

        if (stream.stream_ops && stream.stream_ops.fsync) {
          return -stream.stream_ops.fsync(stream);
        }

        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno;
      }
    }

    function _fd_write(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doWritev(stream, iov, iovcnt);
        HEAP32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno;
      }
    }

    function _gettimeofday(ptr) {
      var now = Date.now();
      HEAP32[ptr >> 2] = now / 1e3 | 0;
      HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
      return 0;
    }

    var ___tm_current = 50960;

    var ___tm_timezone = (stringToUTF8("GMT", 51008, 4), 51008);

    function _gmtime_r(time, tmPtr) {
      var date = new Date(HEAP32[time >> 2] * 1e3);
      HEAP32[tmPtr >> 2] = date.getUTCSeconds();
      HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
      HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
      HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
      HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
      HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
      HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
      HEAP32[tmPtr + 36 >> 2] = 0;
      HEAP32[tmPtr + 32 >> 2] = 0;
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
      HEAP32[tmPtr + 28 >> 2] = yday;
      HEAP32[tmPtr + 40 >> 2] = ___tm_timezone;
      return tmPtr;
    }

    function _gmtime(time) {
      return _gmtime_r(time, ___tm_current);
    }

    var _emscripten_get_now;

    _emscripten_get_now = function () {
      return performance.now();
    };

    function _usleep(useconds) {
      var start = _emscripten_get_now();

      while (_emscripten_get_now() - start < useconds / 1e3) {}
    }

    Module["_usleep"] = _usleep;

    function _nanosleep(rqtp, rmtp) {
      if (rqtp === 0) {
        ___setErrNo(28);

        return -1;
      }

      var seconds = HEAP32[rqtp >> 2];
      var nanoseconds = HEAP32[rqtp + 4 >> 2];

      if (nanoseconds < 0 || nanoseconds > 999999999 || seconds < 0) {
        ___setErrNo(28);

        return -1;
      }

      if (rmtp !== 0) {
        HEAP32[rmtp >> 2] = 0;
        HEAP32[rmtp + 4 >> 2] = 0;
      }

      return _usleep(seconds * 1e6 + nanoseconds / 1e3);
    }

    function _sqlite3AlterBeginAddColumn() {
      err("missing function: sqlite3AlterBeginAddColumn");
      abort(-1);
    }

    function _sqlite3AlterFinishAddColumn() {
      err("missing function: sqlite3AlterFinishAddColumn");
      abort(-1);
    }

    function _sqlite3AlterRenameColumn() {
      err("missing function: sqlite3AlterRenameColumn");
      abort(-1);
    }

    function _sqlite3AlterRenameTable() {
      err("missing function: sqlite3AlterRenameTable");
      abort(-1);
    }

    function _sqlite3Analyze() {
      err("missing function: sqlite3Analyze");
      abort(-1);
    }

    function _sqlite3Attach() {
      err("missing function: sqlite3Attach");
      abort(-1);
    }

    function _sqlite3CreateView() {
      err("missing function: sqlite3CreateView");
      abort(-1);
    }

    function _sqlite3Detach() {
      err("missing function: sqlite3Detach");
      abort(-1);
    }

    function _sqlite3Reindex() {
      err("missing function: sqlite3Reindex");
      abort(-1);
    }

    function _sqlite3RenameTokenRemap() {
      err("missing function: sqlite3RenameTokenRemap");
      abort(-1);
    }

    function _sqlite3Vacuum() {
      err("missing function: sqlite3Vacuum");
      abort(-1);
    }

    function __isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    function __arraySum(array, index) {
      var sum = 0;

      for (var i = 0; i <= index; sum += array[i++]) {}

      return sum;
    }

    var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function __addDays(date, days) {
      var newDate = new Date(date.getTime());

      while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());

        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];

        if (days > daysInCurrentMonth - newDate.getDate()) {
          days -= daysInCurrentMonth - newDate.getDate() + 1;
          newDate.setDate(1);

          if (currentMonth < 11) {
            newDate.setMonth(currentMonth + 1);
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
        } else {
          newDate.setDate(newDate.getDate() + days);
          return newDate;
        }
      }

      return newDate;
    }

    function _strftime(s, maxsize, format, tm) {
      var tm_zone = HEAP32[tm + 40 >> 2];
      var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[tm + 4 >> 2],
        tm_hour: HEAP32[tm + 8 >> 2],
        tm_mday: HEAP32[tm + 12 >> 2],
        tm_mon: HEAP32[tm + 16 >> 2],
        tm_year: HEAP32[tm + 20 >> 2],
        tm_wday: HEAP32[tm + 24 >> 2],
        tm_yday: HEAP32[tm + 28 >> 2],
        tm_isdst: HEAP32[tm + 32 >> 2],
        tm_gmtoff: HEAP32[tm + 36 >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
      };
      var pattern = UTF8ToString(format);
      var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
      };

      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
      }

      var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      function leadingSomething(value, digits, character) {
        var str = typeof value === "number" ? value.toString() : value || "";

        while (str.length < digits) {
          str = character[0] + str;
        }

        return str;
      }

      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0");
      }

      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : value > 0 ? 1 : 0;
        }

        var compare;

        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
            compare = sgn(date1.getDate() - date2.getDate());
          }
        }

        return compare;
      }

      function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
          case 0:
            return new Date(janFourth.getFullYear() - 1, 11, 29);

          case 1:
            return janFourth;

          case 2:
            return new Date(janFourth.getFullYear(), 0, 3);

          case 3:
            return new Date(janFourth.getFullYear(), 0, 2);

          case 4:
            return new Date(janFourth.getFullYear(), 0, 1);

          case 5:
            return new Date(janFourth.getFullYear() - 1, 11, 31);

          case 6:
            return new Date(janFourth.getFullYear() - 1, 11, 30);
        }
      }

      function getWeekBasedYear(date) {
        var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);

        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);

        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
          if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
            return thisDate.getFullYear() + 1;
          } else {
            return thisDate.getFullYear();
          }
        } else {
          return thisDate.getFullYear() - 1;
        }
      }

      var EXPANSION_RULES_2 = {
        "%a": function (date) {
          return WEEKDAYS[date.tm_wday].substring(0, 3);
        },
        "%A": function (date) {
          return WEEKDAYS[date.tm_wday];
        },
        "%b": function (date) {
          return MONTHS[date.tm_mon].substring(0, 3);
        },
        "%B": function (date) {
          return MONTHS[date.tm_mon];
        },
        "%C": function (date) {
          var year = date.tm_year + 1900;
          return leadingNulls(year / 100 | 0, 2);
        },
        "%d": function (date) {
          return leadingNulls(date.tm_mday, 2);
        },
        "%e": function (date) {
          return leadingSomething(date.tm_mday, 2, " ");
        },
        "%g": function (date) {
          return getWeekBasedYear(date).toString().substring(2);
        },
        "%G": function (date) {
          return getWeekBasedYear(date);
        },
        "%H": function (date) {
          return leadingNulls(date.tm_hour, 2);
        },
        "%I": function (date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        "%j": function (date) {
          return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
        },
        "%m": function (date) {
          return leadingNulls(date.tm_mon + 1, 2);
        },
        "%M": function (date) {
          return leadingNulls(date.tm_min, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return "AM";
          } else {
            return "PM";
          }
        },
        "%S": function (date) {
          return leadingNulls(date.tm_sec, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (date) {
          return date.tm_wday || 7;
        },
        "%U": function (date) {
          var janFirst = new Date(date.tm_year + 1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
          var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);

          if (compareByDay(firstSunday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
            var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
            var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
            return leadingNulls(Math.ceil(days / 7), 2);
          }

          return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
        },
        "%V": function (date) {
          var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);

          var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);

          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            return "53";
          }

          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            return "01";
          }

          var daysDifference;

          if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
            daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
          } else {
            daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
          }

          return leadingNulls(Math.ceil(daysDifference / 7), 2);
        },
        "%w": function (date) {
          return date.tm_wday;
        },
        "%W": function (date) {
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
          var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);

          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
            var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
            var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
            return leadingNulls(Math.ceil(days / 7), 2);
          }

          return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
        },
        "%y": function (date) {
          return (date.tm_year + 1900).toString().substring(2);
        },
        "%Y": function (date) {
          return date.tm_year + 1900;
        },
        "%z": function (date) {
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          off = off / 60 * 100 + off % 60;
          return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
        },
        "%Z": function (date) {
          return date.tm_zone;
        },
        "%%": function () {
          return "%";
        }
      };

      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
        }
      }

      var bytes = intArrayFromString(pattern, false);

      if (bytes.length > maxsize) {
        return 0;
      }

      writeArrayToMemory(bytes, s);
      return bytes.length - 1;
    }

    function _time(ptr) {
      var ret = Date.now() / 1e3 | 0;

      if (ptr) {
        HEAP32[ptr >> 2] = ret;
      }

      return ret;
    }

    function _utimes(path, times) {
      var time;

      if (times) {
        var offset = 8 + 0;
        time = HEAP32[times + offset >> 2] * 1e3;
        offset = 8 + 4;
        time += HEAP32[times + offset >> 2] / 1e3;
      } else {
        time = Date.now();
      }

      path = UTF8ToString(path);

      try {
        FS.utime(path, time, time);
        return 0;
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }

    var FSNode = function (parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }

      this.parent = parent;
      this.mount = parent.mount;
      this.mounted = null;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.node_ops = {};
      this.stream_ops = {};
      this.rdev = rdev;
    };

    var readMode = 292 | 73;
    var writeMode = 146;
    Object.defineProperties(FSNode.prototype, {
      read: {
        get: function () {
          return (this.mode & readMode) === readMode;
        },
        set: function (val) {
          val ? this.mode |= readMode : this.mode &= ~readMode;
        }
      },
      write: {
        get: function () {
          return (this.mode & writeMode) === writeMode;
        },
        set: function (val) {
          val ? this.mode |= writeMode : this.mode &= ~writeMode;
        }
      },
      isFolder: {
        get: function () {
          return FS.isDir(this.mode);
        }
      },
      isDevice: {
        get: function () {
          return FS.isChrdev(this.mode);
        }
      }
    });
    FS.FSNode = FSNode;
    FS.staticInit();

    function intArrayFromString(stringy, dontAddNull, length) {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    }

    var asmLibraryArg = {
      "r": ___syscall10,
      "H": ___syscall15,
      "x": ___syscall183,
      "z": ___syscall194,
      "f": ___syscall195,
      "F": ___syscall196,
      "G": ___syscall197,
      "b": ___syscall20,
      "w": ___syscall201,
      "C": ___syscall207,
      "B": ___syscall212,
      "a": ___syscall221,
      "v": ___syscall3,
      "D": ___syscall33,
      "E": ___syscall39,
      "t": ___syscall40,
      "K": ___syscall5,
      "u": ___syscall85,
      "J": ___syscall94,
      "l": _emscripten_memcpy_big,
      "m": _emscripten_resize_heap,
      "o": _environ_get,
      "p": _environ_sizes_get,
      "g": _fd_close,
      "n": _fd_fdstat_get,
      "k": _fd_seek,
      "A": _fd_sync,
      "q": _fd_write,
      "R": _gettimeofday,
      "M": _gmtime,
      "memory": wasmMemory,
      "s": _nanosleep,
      "P": _sqlite3AlterBeginAddColumn,
      "Q": _sqlite3AlterFinishAddColumn,
      "O": _sqlite3AlterRenameColumn,
      "h": _sqlite3AlterRenameTable,
      "c": _sqlite3Analyze,
      "j": _sqlite3Attach,
      "y": _sqlite3CreateView,
      "i": _sqlite3Detach,
      "d": _sqlite3Reindex,
      "N": _sqlite3RenameTokenRemap,
      "e": _sqlite3Vacuum,
      "L": _strftime,
      "table": wasmTable,
      "S": _time,
      "I": _utimes
    };
    var asm = createWasm();
    Module["asm"] = asm;

    var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function () {
      return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["T"]).apply(null, arguments);
    };

    var _sqlite3_free = Module["_sqlite3_free"] = function () {
      return (_sqlite3_free = Module["_sqlite3_free"] = Module["asm"]["U"]).apply(null, arguments);
    };

    var _sqlite3_value_double = Module["_sqlite3_value_double"] = function () {
      return (_sqlite3_value_double = Module["_sqlite3_value_double"] = Module["asm"]["V"]).apply(null, arguments);
    };

    var _sqlite3_value_text = Module["_sqlite3_value_text"] = function () {
      return (_sqlite3_value_text = Module["_sqlite3_value_text"] = Module["asm"]["W"]).apply(null, arguments);
    };

    var ___errno_location = Module["___errno_location"] = function () {
      return (___errno_location = Module["___errno_location"] = Module["asm"]["X"]).apply(null, arguments);
    };

    var _sqlite3_finalize = Module["_sqlite3_finalize"] = function () {
      return (_sqlite3_finalize = Module["_sqlite3_finalize"] = Module["asm"]["Y"]).apply(null, arguments);
    };

    var _sqlite3_reset = Module["_sqlite3_reset"] = function () {
      return (_sqlite3_reset = Module["_sqlite3_reset"] = Module["asm"]["Z"]).apply(null, arguments);
    };

    var _sqlite3_clear_bindings = Module["_sqlite3_clear_bindings"] = function () {
      return (_sqlite3_clear_bindings = Module["_sqlite3_clear_bindings"] = Module["asm"]["_"]).apply(null, arguments);
    };

    var _sqlite3_value_blob = Module["_sqlite3_value_blob"] = function () {
      return (_sqlite3_value_blob = Module["_sqlite3_value_blob"] = Module["asm"]["$"]).apply(null, arguments);
    };

    var _sqlite3_value_bytes = Module["_sqlite3_value_bytes"] = function () {
      return (_sqlite3_value_bytes = Module["_sqlite3_value_bytes"] = Module["asm"]["aa"]).apply(null, arguments);
    };

    var _sqlite3_value_int = Module["_sqlite3_value_int"] = function () {
      return (_sqlite3_value_int = Module["_sqlite3_value_int"] = Module["asm"]["ba"]).apply(null, arguments);
    };

    var _sqlite3_value_type = Module["_sqlite3_value_type"] = function () {
      return (_sqlite3_value_type = Module["_sqlite3_value_type"] = Module["asm"]["ca"]).apply(null, arguments);
    };

    var _sqlite3_result_blob = Module["_sqlite3_result_blob"] = function () {
      return (_sqlite3_result_blob = Module["_sqlite3_result_blob"] = Module["asm"]["da"]).apply(null, arguments);
    };

    var _sqlite3_result_double = Module["_sqlite3_result_double"] = function () {
      return (_sqlite3_result_double = Module["_sqlite3_result_double"] = Module["asm"]["ea"]).apply(null, arguments);
    };

    var _sqlite3_result_error = Module["_sqlite3_result_error"] = function () {
      return (_sqlite3_result_error = Module["_sqlite3_result_error"] = Module["asm"]["fa"]).apply(null, arguments);
    };

    var _sqlite3_result_int = Module["_sqlite3_result_int"] = function () {
      return (_sqlite3_result_int = Module["_sqlite3_result_int"] = Module["asm"]["ga"]).apply(null, arguments);
    };

    var _sqlite3_result_int64 = Module["_sqlite3_result_int64"] = function () {
      return (_sqlite3_result_int64 = Module["_sqlite3_result_int64"] = Module["asm"]["ha"]).apply(null, arguments);
    };

    var _sqlite3_result_null = Module["_sqlite3_result_null"] = function () {
      return (_sqlite3_result_null = Module["_sqlite3_result_null"] = Module["asm"]["ia"]).apply(null, arguments);
    };

    var _sqlite3_result_text = Module["_sqlite3_result_text"] = function () {
      return (_sqlite3_result_text = Module["_sqlite3_result_text"] = Module["asm"]["ja"]).apply(null, arguments);
    };

    var _sqlite3_step = Module["_sqlite3_step"] = function () {
      return (_sqlite3_step = Module["_sqlite3_step"] = Module["asm"]["ka"]).apply(null, arguments);
    };

    var _sqlite3_data_count = Module["_sqlite3_data_count"] = function () {
      return (_sqlite3_data_count = Module["_sqlite3_data_count"] = Module["asm"]["la"]).apply(null, arguments);
    };

    var _sqlite3_column_blob = Module["_sqlite3_column_blob"] = function () {
      return (_sqlite3_column_blob = Module["_sqlite3_column_blob"] = Module["asm"]["ma"]).apply(null, arguments);
    };

    var _sqlite3_column_bytes = Module["_sqlite3_column_bytes"] = function () {
      return (_sqlite3_column_bytes = Module["_sqlite3_column_bytes"] = Module["asm"]["na"]).apply(null, arguments);
    };

    var _sqlite3_column_double = Module["_sqlite3_column_double"] = function () {
      return (_sqlite3_column_double = Module["_sqlite3_column_double"] = Module["asm"]["oa"]).apply(null, arguments);
    };

    var _sqlite3_column_text = Module["_sqlite3_column_text"] = function () {
      return (_sqlite3_column_text = Module["_sqlite3_column_text"] = Module["asm"]["pa"]).apply(null, arguments);
    };

    var _sqlite3_column_type = Module["_sqlite3_column_type"] = function () {
      return (_sqlite3_column_type = Module["_sqlite3_column_type"] = Module["asm"]["qa"]).apply(null, arguments);
    };

    var _sqlite3_column_name = Module["_sqlite3_column_name"] = function () {
      return (_sqlite3_column_name = Module["_sqlite3_column_name"] = Module["asm"]["ra"]).apply(null, arguments);
    };

    var _sqlite3_bind_blob = Module["_sqlite3_bind_blob"] = function () {
      return (_sqlite3_bind_blob = Module["_sqlite3_bind_blob"] = Module["asm"]["sa"]).apply(null, arguments);
    };

    var _sqlite3_bind_double = Module["_sqlite3_bind_double"] = function () {
      return (_sqlite3_bind_double = Module["_sqlite3_bind_double"] = Module["asm"]["ta"]).apply(null, arguments);
    };

    var _sqlite3_bind_int = Module["_sqlite3_bind_int"] = function () {
      return (_sqlite3_bind_int = Module["_sqlite3_bind_int"] = Module["asm"]["ua"]).apply(null, arguments);
    };

    var _sqlite3_bind_text = Module["_sqlite3_bind_text"] = function () {
      return (_sqlite3_bind_text = Module["_sqlite3_bind_text"] = Module["asm"]["va"]).apply(null, arguments);
    };

    var _sqlite3_bind_parameter_index = Module["_sqlite3_bind_parameter_index"] = function () {
      return (_sqlite3_bind_parameter_index = Module["_sqlite3_bind_parameter_index"] = Module["asm"]["wa"]).apply(null, arguments);
    };

    var _sqlite3_errmsg = Module["_sqlite3_errmsg"] = function () {
      return (_sqlite3_errmsg = Module["_sqlite3_errmsg"] = Module["asm"]["xa"]).apply(null, arguments);
    };

    var _sqlite3_exec = Module["_sqlite3_exec"] = function () {
      return (_sqlite3_exec = Module["_sqlite3_exec"] = Module["asm"]["ya"]).apply(null, arguments);
    };

    var _sqlite3_prepare_v2 = Module["_sqlite3_prepare_v2"] = function () {
      return (_sqlite3_prepare_v2 = Module["_sqlite3_prepare_v2"] = Module["asm"]["za"]).apply(null, arguments);
    };

    var _sqlite3_changes = Module["_sqlite3_changes"] = function () {
      return (_sqlite3_changes = Module["_sqlite3_changes"] = Module["asm"]["Aa"]).apply(null, arguments);
    };

    var _sqlite3_close_v2 = Module["_sqlite3_close_v2"] = function () {
      return (_sqlite3_close_v2 = Module["_sqlite3_close_v2"] = Module["asm"]["Ba"]).apply(null, arguments);
    };

    var _sqlite3_create_function_v2 = Module["_sqlite3_create_function_v2"] = function () {
      return (_sqlite3_create_function_v2 = Module["_sqlite3_create_function_v2"] = Module["asm"]["Ca"]).apply(null, arguments);
    };

    var _sqlite3_open = Module["_sqlite3_open"] = function () {
      return (_sqlite3_open = Module["_sqlite3_open"] = Module["asm"]["Da"]).apply(null, arguments);
    };

    var _malloc = Module["_malloc"] = function () {
      return (_malloc = Module["_malloc"] = Module["asm"]["Ea"]).apply(null, arguments);
    };

    var _free = Module["_free"] = function () {
      return (_free = Module["_free"] = Module["asm"]["Fa"]).apply(null, arguments);
    };

    var stackSave = Module["stackSave"] = function () {
      return (stackSave = Module["stackSave"] = Module["asm"]["Ga"]).apply(null, arguments);
    };

    var stackAlloc = Module["stackAlloc"] = function () {
      return (stackAlloc = Module["stackAlloc"] = Module["asm"]["Ha"]).apply(null, arguments);
    };

    var stackRestore = Module["stackRestore"] = function () {
      return (stackRestore = Module["stackRestore"] = Module["asm"]["Ia"]).apply(null, arguments);
    };

    var dynCall_vi = Module["dynCall_vi"] = function () {
      return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["Ja"]).apply(null, arguments);
    };

    Module["asm"] = asm;
    Module["intArrayFromString"] = intArrayFromString;
    Module["cwrap"] = cwrap;
    Module["setValue"] = setValue;
    Module["getValue"] = getValue;
    Module["allocate"] = allocate;
    Module["UTF8ToString"] = UTF8ToString;
    Module["addFunction"] = addFunction;
    Module["removeFunction"] = removeFunction;
    Module["FS"] = FS;
    Module["stackSave"] = stackSave;
    Module["stackRestore"] = stackRestore;
    Module["stackAlloc"] = stackAlloc;
    Module["allocateUTF8OnStack"] = allocateUTF8OnStack;
    Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
    var calledRun;

    Module["then"] = function (func) {
      if (calledRun) {
        func(Module);
      } else {
        var old = Module["onRuntimeInitialized"];

        Module["onRuntimeInitialized"] = function () {
          if (old) old();
          func(Module);
        };
      }

      return Module;
    };

    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };

    function run(args) {
      args = args || arguments_;

      if (runDependencies > 0) {
        return;
      }

      preRun();
      if (runDependencies > 0) return;

      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }

      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }

    Module["run"] = run;

    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];

      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }

    noExitRuntime = true;
    run();
    Module["NULL"] = 0;

    Module["onRuntimeInitialized"] = function () {
      Module["tempInt32"] = stackAlloc(4);
      Module["sqlite3_open"] = cwrap("sqlite3_open", "number", ["string", "number"]);
      Module["sqlite3_close_v2"] = cwrap("sqlite3_close_v2", "number", ["number"]);
      Module["sqlite3_exec"] = cwrap("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]);
      Module["sqlite3_free"] = cwrap("sqlite3_free", null, ["number"]);
      Module["sqlite3_changes"] = cwrap("sqlite3_changes", "number", ["number"]);
      Module["sqlite3_prepare_v2"] = cwrap("sqlite3_prepare_v2", "number", ["number", "string", "number", "number", "number"]);
      Module["sqlite3_prepare_v2_sqlptr"] = cwrap("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]);
      Module["sqlite3_bind_text"] = cwrap("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]);
      Module["sqlite3_bind_blob"] = cwrap("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]);
      Module["sqlite3_bind_double"] = cwrap("sqlite3_bind_double", "number", ["number", "number", "number"]);
      Module["sqlite3_bind_int"] = cwrap("sqlite3_bind_int", "number", ["number", "number", "number"]);
      Module["sqlite3_bind_parameter_index"] = cwrap("sqlite3_bind_parameter_index", "number", ["number", "string"]);
      Module["sqlite3_step"] = cwrap("sqlite3_step", "number", ["number"]);
      Module["sqlite3_errmsg"] = cwrap("sqlite3_errmsg", "string", ["number"]);
      Module["sqlite3_data_count"] = cwrap("sqlite3_data_count", "number", ["number"]);
      Module["sqlite3_column_double"] = cwrap("sqlite3_column_double", "number", ["number", "number"]);
      Module["sqlite3_column_text"] = cwrap("sqlite3_column_text", "string", ["number", "number"]);
      Module["sqlite3_column_blob"] = cwrap("sqlite3_column_blob", "number", ["number", "number"]);
      Module["sqlite3_column_bytes"] = cwrap("sqlite3_column_bytes", "number", ["number", "number"]);
      Module["sqlite3_column_type"] = cwrap("sqlite3_column_type", "number", ["number", "number"]);
      Module["sqlite3_column_name"] = cwrap("sqlite3_column_name", "string", ["number", "number"]);
      Module["sqlite3_reset"] = cwrap("sqlite3_reset", "number", ["number"]);
      Module["sqlite3_clear_bindings"] = cwrap("sqlite3_clear_bindings", "number", ["number"]);
      Module["sqlite3_finalize"] = cwrap("sqlite3_finalize", "number", ["number"]);
      Module["sqlite3_create_function_v2"] = cwrap("sqlite3_create_function_v2", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number"]);
      Module["sqlite3_value_type"] = cwrap("sqlite3_value_type", "number", ["number"]);
      Module["sqlite3_value_bytes"] = cwrap("sqlite3_value_bytes", "number", ["number"]);
      Module["sqlite3_value_text"] = cwrap("sqlite3_value_text", "string", ["number"]);
      Module["sqlite3_value_int"] = cwrap("sqlite3_value_int", "number", ["number"]);
      Module["sqlite3_value_blob"] = cwrap("sqlite3_value_blob", "number", ["number"]);
      Module["sqlite3_value_double"] = cwrap("sqlite3_value_double", "number", ["number"]);
      Module["sqlite3_result_double"] = cwrap("sqlite3_result_double", null, ["number", "number"]);
      Module["sqlite3_result_null"] = cwrap("sqlite3_result_null", null, ["number"]);
      Module["sqlite3_result_text"] = cwrap("sqlite3_result_text", null, ["number", "string", "number", "number"]);
      Module["sqlite3_result_blob"] = cwrap("sqlite3_result_blob", null, ["number", "number", "number", "number"]);
      Module["sqlite3_result_int"] = cwrap("sqlite3_result_int", null, ["number", "number"]);
      Module["sqlite3_result_int64"] = cwrap("sqlite3_result_int64", null, ["number", "number"]);
      Module["sqlite3_result_error"] = cwrap("sqlite3_result_error", null, ["number", "string", "number"]);
    };

    return Module;
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Module);

/***/ }),

/***/ "../../blogsearch/lib/sqlite/sqlite3-types.js":
/*!*****************************************************!*\
  !*** /build/blogsearch/lib/sqlite/sqlite3-types.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ReturnCode;

(function (ReturnCode) {
  ReturnCode[ReturnCode["OK"] = 0] = "OK";
  ReturnCode[ReturnCode["ERROR"] = 1] = "ERROR";
  ReturnCode[ReturnCode["INTERNAL"] = 2] = "INTERNAL";
  ReturnCode[ReturnCode["PERM"] = 3] = "PERM";
  ReturnCode[ReturnCode["ABORT"] = 4] = "ABORT";
  ReturnCode[ReturnCode["BUSY"] = 5] = "BUSY";
  ReturnCode[ReturnCode["LOCKED"] = 6] = "LOCKED";
  ReturnCode[ReturnCode["NOMEM"] = 7] = "NOMEM";
  ReturnCode[ReturnCode["READONLY"] = 8] = "READONLY";
  ReturnCode[ReturnCode["INTERRUPT"] = 9] = "INTERRUPT";
  ReturnCode[ReturnCode["IOERR"] = 10] = "IOERR";
  ReturnCode[ReturnCode["CORRUPT"] = 11] = "CORRUPT";
  ReturnCode[ReturnCode["NOTFOUND"] = 12] = "NOTFOUND";
  ReturnCode[ReturnCode["FULL"] = 13] = "FULL";
  ReturnCode[ReturnCode["CANTOPEN"] = 14] = "CANTOPEN";
  ReturnCode[ReturnCode["PROTOCOL"] = 15] = "PROTOCOL";
  ReturnCode[ReturnCode["EMPTY"] = 16] = "EMPTY";
  ReturnCode[ReturnCode["SCHEMA"] = 17] = "SCHEMA";
  ReturnCode[ReturnCode["TOOBIG"] = 18] = "TOOBIG";
  ReturnCode[ReturnCode["CONSTRAINT"] = 19] = "CONSTRAINT";
  ReturnCode[ReturnCode["MISMATCH"] = 20] = "MISMATCH";
  ReturnCode[ReturnCode["MISUSE"] = 21] = "MISUSE";
  ReturnCode[ReturnCode["NOLFS"] = 22] = "NOLFS";
  ReturnCode[ReturnCode["AUTH"] = 23] = "AUTH";
  ReturnCode[ReturnCode["FORMAT"] = 24] = "FORMAT";
  ReturnCode[ReturnCode["RANGE"] = 25] = "RANGE";
  ReturnCode[ReturnCode["NOTADB"] = 26] = "NOTADB";
  ReturnCode[ReturnCode["NOTICE"] = 27] = "NOTICE";
  ReturnCode[ReturnCode["WARNING"] = 28] = "WARNING";
  ReturnCode[ReturnCode["ROW"] = 100] = "ROW";
  ReturnCode[ReturnCode["DONE"] = 101] = "DONE";
  ReturnCode[ReturnCode["INTEGER"] = 1] = "INTEGER";
  ReturnCode[ReturnCode["FLOAT"] = 2] = "FLOAT";
  ReturnCode[ReturnCode["TEXT"] = 3] = "TEXT";
  ReturnCode[ReturnCode["BLOB"] = 4] = "BLOB";
  ReturnCode[ReturnCode["NULL"] = 5] = "NULL";
  ReturnCode[ReturnCode["UTF8"] = 1] = "UTF8";
})(ReturnCode = exports.ReturnCode || (exports.ReturnCode = {}));

/***/ }),

/***/ "../../blogsearch/lib/sqlite/sqlite3.js":
/*!***********************************************!*\
  !*** /build/blogsearch/lib/sqlite/sqlite3.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const sqlite3_types_1 = __webpack_require__(/*! ./sqlite3-types */ "../../blogsearch/lib/sqlite/sqlite3-types.js");

class Statement {
  constructor(stmt, db) {
    this.wasm = db.wasm;
    this.stmt = stmt;
    this.db = db;
    this.pos = 1;
    this.allocatedmem = [];
  }

  bind(values) {
    const bindFromArray = values => {
      values.forEach((value, i) => {
        this.bindValue(value, i + 1);
      });
    };

    const bindFromObject = valuesObj => {
      for (const [name, value] of Object.entries(valuesObj)) {
        const num = this.wasm.sqlite3_bind_parameter_index(this.stmt, name);

        if (num !== 0) {
          this.bindValue(value, num);
        }
      }
    };

    if (!this.stmt) {
      throw new Error('Statement closed');
    }

    this.reset();

    if (Array.isArray(values)) {
      bindFromArray(values);
    } else {
      bindFromObject(values);
    }

    return;
  }

  bindValue(val, pos = this.pos++) {
    const bindString = (str, pos = this.pos++) => {
      const bytes = this.wasm.intArrayFromString(str);
      const strPtr = this.wasm.allocate(bytes, 'i8', this.wasm.ALLOC_NORMAL);
      this.allocatedmem.push(strPtr);
      this.db.handleError(this.wasm.sqlite3_bind_text(this.stmt, pos, strPtr, bytes.length - 1, 0));
    };

    const bindBlob = (array, pos = this.pos++) => {
      const blobPtr = this.wasm.allocate(array, 'i8', this.wasm.ALLOC_NORMAL);
      this.allocatedmem.push(blobPtr);
      this.db.handleError(this.wasm.sqlite3_bind_blob(this.stmt, pos, blobPtr, array.length, 0));
    };

    const bindNumber = (num, pos = this.pos++) => {
      const bindfunc = num === (num | 0) ? this.wasm.sqlite3_bind_int : this.wasm.sqlite3_bind_double;
      this.db.handleError(bindfunc(this.stmt, pos, num));
    };

    const bindNull = (pos = this.pos++) => {
      this.db.handleError(this.wasm.sqlite3_bind_blob(this.stmt, pos, 0, 0, 0));
    };

    switch (typeof val) {
      case 'string':
        bindString(val, pos);
        break;

      case 'number':
      case 'boolean':
        bindNumber(val + 0, pos);
        break;

      case 'object':
        if (val === null) {
          bindNull(pos);
        } else if (Array.isArray(val)) {
          bindBlob(val, pos);
        } else {
          throw new Error(`Wrong API use : tried to bind a value of an unknown type (${val}).`);
        }

        break;

      default:
        throw new Error(`Wrong API use : tried to bind a value of an unknown type (${val}).`);
    }

    return;
  }

  step() {
    if (!this.stmt) {
      throw new Error('Statement closed');
    }

    this.pos = 1;
    const ret = this.wasm.sqlite3_step(this.stmt);

    switch (ret) {
      case sqlite3_types_1.ReturnCode.ROW:
        return true;

      case sqlite3_types_1.ReturnCode.DONE:
        return false;

      default:
        this.db.handleError(ret);
        return false;
    }
  }

  get(params) {
    const getNumber = (pos = this.pos++) => {
      return this.wasm.sqlite3_column_double(this.stmt, pos);
    };

    const getString = (pos = this.pos++) => {
      return this.wasm.sqlite3_column_text(this.stmt, pos);
    };

    const getBlob = (pos = this.pos++) => {
      const ptr = this.wasm.sqlite3_column_blob(this.stmt, pos);
      const size = this.wasm.sqlite3_column_bytes(this.stmt, pos);
      return this.wasm.HEAPU8.subarray(ptr, ptr + size);
    };

    if (typeof params !== 'undefined') {
      this.bind(params);
      this.step();
    }

    const results = [];
    const colSize = this.wasm.sqlite3_data_count(this.stmt);

    for (let col = 0; col < colSize; col++) {
      switch (this.wasm.sqlite3_column_type(this.stmt, col)) {
        case sqlite3_types_1.ReturnCode.INTEGER:
        case sqlite3_types_1.ReturnCode.FLOAT:
          results.push(getNumber(col));
          break;

        case sqlite3_types_1.ReturnCode.TEXT:
          results.push(getString(col));
          break;

        case sqlite3_types_1.ReturnCode.BLOB:
          results.push(getBlob(col));
          break;

        default:
          results.push(null);
          break;
      }
    }

    return results;
  }

  getColumnNames() {
    const results = [];
    const colSize = this.wasm.sqlite3_data_count(this.stmt);

    for (let col = 0; col < colSize; col++) {
      results.push(this.wasm.sqlite3_column_name(this.stmt, col));
    }

    return results;
  }

  getAsObject(params) {
    const values = this.get(params);
    const names = this.getColumnNames();
    const rowObject = {};
    names.forEach((name, i) => {
      rowObject[name] = values[i];
    });
    return rowObject;
  }

  run(values) {
    if (typeof values !== 'undefined') {
      this.bind(values);
    }

    this.step();
    return this.reset();
  }

  reset() {
    this.freemem();
    return this.wasm.sqlite3_clear_bindings(this.stmt) === sqlite3_types_1.ReturnCode.OK && this.wasm.sqlite3_reset(this.stmt) === sqlite3_types_1.ReturnCode.OK;
  }

  freemem() {
    let mem;

    while (mem = this.allocatedmem.pop()) {
      this.wasm._free(mem);
    }

    return null;
  }

  free() {
    this.freemem();
    const res = this.wasm.sqlite3_finalize(this.stmt) === sqlite3_types_1.ReturnCode.OK;
    delete this.db.statements[this.stmt];
    this.stmt = this.wasm.NULL;
    return res;
  }

}

class Database {
  constructor(wasm, data) {
    this.wasm = wasm;
    this.filename = `dbfile_${0xffffffff * Math.random() >>> 0}`;

    if (typeof data !== 'undefined') {
      this.wasm.FS.createDataFile('/', this.filename, data, true, true);
    }

    this.handleError(this.wasm.sqlite3_open(`${this.filename}`, this.wasm.tempInt32));
    this.dbPtr = this.wasm.getValue(this.wasm.tempInt32, '*');
    this.statements = {};
    this.functions = {};
  }

  run(sql, params) {
    if (!this.dbPtr) {
      throw new Error('Database closed');
    }

    if (params) {
      const stmt = this.prepare(sql, params);

      try {
        stmt.step();
      } finally {
        stmt.free();
      }
    } else {
      this.handleError(this.wasm.sqlite3_exec(this.dbPtr, sql, 0, 0, this.wasm.tempInt32));
    }

    return this;
  }

  exec(sql) {
    if (!this.dbPtr) {
      throw new Error('Database closed');
    }

    const stack = this.wasm.stackSave();

    try {
      let nextSqlPtr = this.wasm.allocateUTF8OnStack(sql);
      const pzTail = this.wasm.stackAlloc(4);
      const results = [];

      while (this.wasm.getValue(nextSqlPtr, 'i8') !== this.wasm.NULL) {
        this.wasm.setValue(this.wasm.tempInt32, 0, '*');
        this.wasm.setValue(pzTail, 0, '*');
        this.handleError(this.wasm.sqlite3_prepare_v2_sqlptr(this.dbPtr, nextSqlPtr, -1, this.wasm.tempInt32, pzTail));
        const stmtPtr = this.wasm.getValue(this.wasm.tempInt32, '*');
        nextSqlPtr = this.wasm.getValue(pzTail, '*');

        if (stmtPtr === this.wasm.NULL) {
          break;
        }

        const stmt = new Statement(stmtPtr, this);

        try {
          let inserted = false;

          while (stmt.step()) {
            if (!inserted) {
              inserted = true;
              results.push({
                columns: stmt.getColumnNames(),
                values: []
              });
            }

            results[results.length - 1].values.push(stmt.get());
          }
        } finally {
          stmt.free();
        }
      }

      return results;
    } finally {
      this.wasm.stackRestore(stack);
    }
  }

  each(sql, ...args) {
    let stmt;
    let doneCallback;
    let rowCallback;

    if (typeof args[0] === 'function') {
      stmt = this.prepare(sql);
      rowCallback = args[0];
      doneCallback = args[1];
    } else {
      stmt = this.prepare(sql, args[0]);
      rowCallback = args[1];
      doneCallback = args[2];
    }

    if (typeof rowCallback !== 'function') {
      throw new Error('No callback passed');
    }

    try {
      while (stmt.step()) {
        rowCallback(stmt.getAsObject());
      }
    } finally {
      stmt.free();
    }

    if (typeof doneCallback === 'function') {
      return doneCallback();
    } else {
      return this;
    }
  }

  prepare(sql, params) {
    this.wasm.setValue(this.wasm.tempInt32, 0, '*');
    this.handleError(this.wasm.sqlite3_prepare_v2(this.dbPtr, sql, -1, this.wasm.tempInt32, this.wasm.NULL));
    const stmtPtr = this.wasm.getValue(this.wasm.tempInt32, '*');

    if (stmtPtr === this.wasm.NULL) {
      throw new Error('Nothing to prepare. Check your SQL statement.');
    }

    const stmt = new Statement(stmtPtr, this);

    if (typeof params !== 'undefined') {
      stmt.bind(params);
    }

    this.statements[stmtPtr] = stmt;
    return stmt;
  }

  _close() {
    for (const [, stmt] of Object.entries(this.statements)) {
      stmt.free();
    }

    this.statements = {};

    for (const [, func] of Object.entries(this.functions)) {
      this.wasm.removeFunction(func);
    }

    this.functions = {};
    this.handleError(this.wasm.sqlite3_close_v2(this.dbPtr));
  }

  export() {
    this._close();

    const binaryDb = this.wasm.FS.readFile(this.filename, {
      encoding: 'binary'
    });
    this.handleError(this.wasm.sqlite3_open(this.filename, this.wasm.tempInt32));
    this.dbPtr = this.wasm.getValue(this.wasm.tempInt32, '*');
    return binaryDb;
  }

  close() {
    this._close();

    this.wasm.FS.unlink(`/${this.filename}`);
    this.filename = '';
    this.dbPtr = this.wasm.NULL;
  }

  handleError(returnCode) {
    if (returnCode === sqlite3_types_1.ReturnCode.OK) {
      return true;
    } else {
      throw new Error(this.wasm.sqlite3_errmsg(this.dbPtr));
    }
  }

  getRowsModified() {
    return this.wasm.sqlite3_changes(this.dbPtr);
  }

  createFunction(name, func) {
    const wrappedFunc = (sqlite3ContextPtr, argc, argvPtr) => {
      const args = [];

      for (let i = 0; i < argc; i++) {
        const valuePtr = this.wasm.getValue(argvPtr + 4 * i, '*');
        const valueType = this.wasm.sqlite3_value_type(valuePtr);

        const dataFunc = (() => {
          switch (false) {
            case valueType !== 1:
              return this.wasm.sqlite3_value_double;

            case valueType !== 2:
              return this.wasm.sqlite3_value_double;

            case valueType !== 3:
              return this.wasm.sqlite3_value_text;

            case valueType !== 4:
              return function (ptr) {
                const size = this.wasm.sqlite3_value_bytes(ptr);
                const blobPtr = this.wasm.sqlite3_value_blob(ptr);
                const blobArg = new Uint8Array(size);

                for (let j = 0; j < size; j++) {
                  blobArg[j] = this.wasm.HEAP8[blobPtr + j];
                }

                return blobArg;
              };

            default:
              return function (_) {
                return null;
              };
          }
        })();

        args.push(dataFunc(valuePtr));
      }

      let result;

      try {
        result = func(...args);
      } catch (error) {
        this.wasm.sqlite3_result_error(sqlite3ContextPtr, error, -1);
        return;
      }

      switch (typeof result) {
        case 'boolean':
          this.wasm.sqlite3_result_int(sqlite3ContextPtr, result ? 1 : 0);
          break;

        case 'number':
          this.wasm.sqlite3_result_double(sqlite3ContextPtr, result);
          break;

        case 'string':
          this.wasm.sqlite3_result_text(sqlite3ContextPtr, result, -1, -1);
          break;

        case 'object':
          if (result === null) {
            this.wasm.sqlite3_result_null(sqlite3ContextPtr);
          } else if (Array.isArray(result)) {
            const blobPtr = this.wasm.allocate(result, 'i8', this.wasm.ALLOC_NORMAL);
            this.wasm.sqlite3_result_blob(sqlite3ContextPtr, blobPtr, result.length, -1);

            this.wasm._free(blobPtr);
          } else {
            this.wasm.sqlite3_result_error(sqlite3ContextPtr, `Wrong API use : tried to return a value of an unknown type (${result}).`, -1);
          }

          break;

        default:
          this.wasm.sqlite3_result_null(sqlite3ContextPtr);
      }
    };

    if (name in this.functions) {
      this.wasm.removeFunction(this.functions[name]);
      delete this.functions[name];
    }

    const funcPtr = this.wasm.addFunction(wrappedFunc, 'viii');
    this.functions[name] = funcPtr;
    this.handleError(this.wasm.sqlite3_create_function_v2(this.dbPtr, name, func.length, sqlite3_types_1.ReturnCode.UTF8, 0, funcPtr, 0, 0, 0));
    return this;
  }

}

exports.Database = Database;

/***/ }),

/***/ "../../node_modules/babel-loader/lib/index.js!../../blogsearch/lib/sqlite/worker.js":
/*!***********************************************************************************!*\
  !*** /build/node_modules/babel-loader/lib!/build/blogsearch/lib/sqlite/worker.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");

function initWorker() {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    const sqlite3Wasm = (yield Promise.resolve().then(() => tslib_1.__importStar(__webpack_require__(/*! ./sqlite3-emscripten */ "../../blogsearch/lib/sqlite/sqlite3-emscripten.js")))).default;
    const sqlit3API = yield Promise.resolve().then(() => tslib_1.__importStar(__webpack_require__(/*! ./sqlite3 */ "../../blogsearch/lib/sqlite/sqlite3.js")));
    const loadWasm = wasmLoader(sqlite3Wasm);
    let db;

    onmessage = function (e) {
      var _a;

      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const {
          data
        } = e;

        switch (data.command) {
          case 'open':
            {
              if (db) {
                db.close();
              }

              const dbBuffer = fetch(((_a = self.location) === null || _a === void 0 ? void 0 : _a.href.startsWith('blob:')) ? correctScriptDir() + data.dbPath : data.dbPath).then(r => r.arrayBuffer());
              const wasm = yield loadWasm(data.wasmPath);
              db = new sqlit3API.Database(wasm, new Uint8Array((yield dbBuffer)));
              postMessage({
                respondTo: 'open',
                success: true
              });
              break;
            }

          case 'exec':
            {
              if (!db) {
                throw new Error('exec: DB is not initialized.');
              }

              if (!data.sql) {
                throw new Error('exec: Missing query string');
              }

              postMessage({
                respondTo: 'exec',
                results: db.exec(data.sql)
              });
              break;
            }

          case 'each':
            {
              if (!db) {
                throw new Error('exec: DB is not initialized.');
              }

              if (!data.sql) {
                throw new Error('exec: Missing query string');
              }

              db.each(data.sql, data.params, row => postMessage({
                respondTo: 'each',
                row,
                end: false
              }), () => postMessage({
                respondTo: 'each',
                row: {},
                end: true
              }));
              break;
            }

          case 'export':
            {
              if (!db) {
                throw new Error('exec: DB is not initialized.');
              }

              const buffer = db.export();
              postMessage({
                respondTo: 'export',
                buffer
              }, [buffer]);
              break;
            }

          case 'close':
            {
              if (!db) {
                throw new Error('close: DB is not opened yet.');
              }

              db.close();
              postMessage({
                respondTo: 'close',
                success: true
              });
              break;
            }

          default:
            {
              throw new Error(`Invalid command: ${data}`);
            }
        }
      });
    };
  });
}

exports.default = initWorker;

function wasmLoader(wasmModule) {
  let loadedModule = null;
  return function (wasmPath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve, reject) => {
        if (loadedModule) {
          resolve(loadedModule);
        }

        const moduleOverrides = {};

        moduleOverrides['onAbort'] = function (what) {
          reject(what);
        };

        if (typeof wasmPath === 'string' && wasmPath) {
          moduleOverrides['locateFile'] = function (path, scriptDirectory) {
            const dir = correctScriptDir(scriptDirectory);
            return path.match(/.wasm/) ? wasmPath.startsWith('http://') || wasmPath.startsWith('https://') ? wasmPath : dir + wasmPath : dir + path;
          };
        }

        try {
          wasmModule(moduleOverrides).then(wasmModule => {
            delete wasmModule['then'];
            loadedModule = wasmModule;
            resolve(wasmModule);
          });
        } catch (e) {
          reject(new Error(`Loading SQLite .wasm module failed: ${e}`));
        }
      });
    });
  };
}

function correctScriptDir(dir) {
  var _a, _b;

  return ((_b = dir || ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href)) !== null && _b !== void 0 ? _b : '').replace(/^(blob:)/, '').replace(/\/[^\/]+$/, '/');
}

;

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  initWorker().catch(e => {
    throw new Error(`Worker Error: Failed to load the worker: ${e}`);
  });
}

/***/ }),

/***/ "../../node_modules/tslib/tslib.es6.js":
/*!**********************************************!*\
  !*** /build/node_modules/tslib/tslib.es6.js ***!
  \**********************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ })

/******/ });
//# sourceMappingURL=webpack-worker.js.map