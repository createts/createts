(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["createts"] = factory();
	else
		root["createts"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Ticker.ts":
/*!***********************!*\
  !*** ./src/Ticker.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = __webpack_require__(/*! ./base/Event */ "./src/base/Event.ts");
var Runtime_1 = __webpack_require__(/*! ./runtime/Runtime */ "./src/runtime/Runtime.ts");
var TickerEvent = (function (_super) {
    __extends(TickerEvent, _super);
    function TickerEvent(type, now, delay) {
        var _this = _super.call(this, type) || this;
        _this.now = now;
        _this.delay = delay;
        return _this;
    }
    return TickerEvent;
}(Event_1.Event));
exports.TickerEvent = TickerEvent;
var Ticker = (function (_super) {
    __extends(Ticker, _super);
    function Ticker(fps) {
        if (fps === void 0) { fps = 60; }
        var _this = _super.call(this) || this;
        _this.duration = 1000 / 60;
        _this.stopped = true;
        if (fps <= 0) {
            console.warn('invalid fps:' + fps + ', reset to 60');
            fps = 60;
        }
        _this.setFps(fps);
        _this.lastTickTime = 0;
        _this.start();
        return _this;
    }
    Ticker.prototype.setFps = function (fps) {
        this.duration = 1000 / fps;
    };
    Ticker.prototype.start = function () {
        if (this.stopped) {
            this.stopped = false;
            Runtime_1.Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
            var now = Date.now();
            this.dispatchEvent(new TickerEvent('start', now, now - this.lastTickTime));
        }
    };
    Ticker.prototype.stop = function () {
        this.stopped = true;
        var now = Date.now();
        this.dispatchEvent(new TickerEvent('stop', now, now - this.lastTickTime));
    };
    Ticker.prototype.onAnimationFrame = function (time) {
        if (this.stopped) {
            return;
        }
        if (time - this.lastTickTime >= this.duration) {
            this.dispatchEvent(new TickerEvent('tick', time, this.lastTickTime === 0 ? 0 : time - this.lastTickTime));
            this.lastTickTime = time;
        }
        Runtime_1.Runtime.get().requestAnimationFrame(this.onAnimationFrame.bind(this));
    };
    return Ticker;
}(Event_1.EventDispatcher));
exports.Ticker = Ticker;


/***/ }),

/***/ "./src/animation/AlgorithmFactory.ts":
/*!*******************************************!*\
  !*** ./src/animation/AlgorithmFactory.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Linear = (function () {
    function Linear() {
    }
    Linear.prototype.calculate = function (percent) {
        return percent;
    };
    return Linear;
}());
exports.Linear = Linear;
var PowIn = (function () {
    function PowIn(pow) {
        this.pow = pow;
    }
    PowIn.prototype.calculate = function (percent) {
        return Math.pow(percent, this.pow);
    };
    return PowIn;
}());
exports.PowIn = PowIn;
var PowOut = (function () {
    function PowOut(pow) {
        this.pow = pow;
    }
    PowOut.prototype.calculate = function (percent) {
        return 1 - Math.pow(1 - percent, this.pow);
    };
    return PowOut;
}());
exports.PowOut = PowOut;
var PowInOut = (function () {
    function PowInOut(pow) {
        this.pow = pow;
    }
    PowInOut.prototype.calculate = function (percent) {
        percent *= 2;
        if (percent < 1) {
            return 0.5 * Math.pow(percent, this.pow);
        }
        else {
            return 1 - 0.5 * Math.abs(Math.pow(2 - percent, this.pow));
        }
    };
    return PowInOut;
}());
exports.PowInOut = PowInOut;
var SineIn = (function () {
    function SineIn() {
    }
    SineIn.prototype.calculate = function (percent) {
        return 1 - Math.cos((percent * Math.PI) / 2);
    };
    return SineIn;
}());
exports.SineIn = SineIn;
var SineOut = (function () {
    function SineOut() {
    }
    SineOut.prototype.calculate = function (percent) {
        return Math.sin((percent * Math.PI) / 2);
    };
    return SineOut;
}());
exports.SineOut = SineOut;
var SineInOut = (function () {
    function SineInOut() {
    }
    SineInOut.prototype.calculate = function (percent) {
        return -0.5 * (Math.cos(Math.PI * percent) - 1);
    };
    return SineInOut;
}());
exports.SineInOut = SineInOut;
var BackIn = (function () {
    function BackIn(amount) {
        this.amount = amount;
    }
    BackIn.prototype.calculate = function (percent) {
        return percent * percent * ((this.amount + 1) * percent - this.amount);
    };
    return BackIn;
}());
exports.BackIn = BackIn;
var BackOut = (function () {
    function BackOut(amount) {
        this.amount = amount;
    }
    BackOut.prototype.calculate = function (percent) {
        return --percent * percent * ((this.amount + 1) * percent + this.amount) + 1;
    };
    return BackOut;
}());
exports.BackOut = BackOut;
var BackInOut = (function () {
    function BackInOut(amount) {
        this.amount = amount;
    }
    BackInOut.prototype.calculate = function (percent) {
        percent *= 2;
        if (percent < 1) {
            return 0.5 * (percent * percent * ((this.amount + 1) * percent - this.amount));
        }
        else {
            return 0.5 * ((percent -= 2) * percent * ((this.amount + 1) * percent + this.amount) + 2);
        }
    };
    return BackInOut;
}());
exports.BackInOut = BackInOut;
var CircIn = (function () {
    function CircIn() {
    }
    CircIn.prototype.calculate = function (percent) {
        return -(Math.sqrt(1 - percent * percent) - 1);
    };
    return CircIn;
}());
exports.CircIn = CircIn;
var CircOut = (function () {
    function CircOut() {
    }
    CircOut.prototype.calculate = function (percent) {
        return Math.sqrt(1 - --percent * percent);
    };
    return CircOut;
}());
exports.CircOut = CircOut;
var CircInOut = (function () {
    function CircInOut() {
    }
    CircInOut.prototype.calculate = function (percent) {
        percent *= 2;
        if (percent < 1) {
            return -0.5 * (Math.sqrt(1 - percent * percent) - 1);
        }
        else {
            return 0.5 * (Math.sqrt(1 - (percent -= 2) * percent) + 1);
        }
    };
    return CircInOut;
}());
exports.CircInOut = CircInOut;
var Bounce = (function () {
    function Bounce() {
    }
    Bounce.prototype.calculateOut = function (percent) {
        if (percent < 1 / 2.75) {
            return 7.5625 * percent * percent;
        }
        else if (percent < 2 / 2.75) {
            return 7.5625 * (percent -= 1.5 / 2.75) * percent + 0.75;
        }
        else if (percent < 2.5 / 2.75) {
            return 7.5625 * (percent -= 2.25 / 2.75) * percent + 0.9375;
        }
        else {
            return 7.5625 * (percent -= 2.625 / 2.75) * percent + 0.984375;
        }
    };
    return Bounce;
}());
var BounceOut = (function (_super) {
    __extends(BounceOut, _super);
    function BounceOut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BounceOut.prototype.calculate = function (percent) {
        return _super.prototype.calculateOut.call(this, percent);
    };
    return BounceOut;
}(Bounce));
exports.BounceOut = BounceOut;
var BounceIn = (function (_super) {
    __extends(BounceIn, _super);
    function BounceIn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BounceIn.prototype.calculate = function (percent) {
        return 1 - _super.prototype.calculateOut.call(this, 1 - percent);
    };
    return BounceIn;
}(Bounce));
exports.BounceIn = BounceIn;
var BounceInOut = (function (_super) {
    __extends(BounceInOut, _super);
    function BounceInOut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BounceInOut.prototype.calculate = function (percent) {
        if (percent < 0.5) {
            return _super.prototype.calculate.call(this, percent * 2) * 0.5;
        }
        else {
            return _super.prototype.calculateOut.call(this, percent * 2 - 1) * 0.5 + 0.5;
        }
    };
    return BounceInOut;
}(BounceIn));
exports.BounceInOut = BounceInOut;
var PI2 = Math.PI * 2;
var ElasticIn = (function () {
    function ElasticIn(amplitude, period) {
        this.amplitude = amplitude;
        this.period = period;
        this.s = (this.period / PI2) * Math.asin(1 / this.amplitude);
    }
    ElasticIn.prototype.calculate = function (percent) {
        if (percent === 0 || percent === 1) {
            return percent;
        }
        return -(this.amplitude *
            Math.pow(2, 10 * (percent -= 1)) *
            Math.sin(((percent - this.s) * PI2) / this.period));
    };
    return ElasticIn;
}());
exports.ElasticIn = ElasticIn;
var ElasticOut = (function () {
    function ElasticOut(amplitude, period) {
        this.amplitude = amplitude;
        this.period = period;
        this.s = (this.period / PI2) * Math.asin(1 / this.amplitude);
    }
    ElasticOut.prototype.calculate = function (percent) {
        if (percent === 0 || percent === 1) {
            return percent;
        }
        return (this.amplitude *
            Math.pow(2, -10 * percent) *
            Math.sin(((percent - this.s) * PI2) / this.period) +
            1);
    };
    return ElasticOut;
}());
exports.ElasticOut = ElasticOut;
var ElasticInOut = (function () {
    function ElasticInOut(amplitude, period) {
        this.amplitude = amplitude;
        this.period = period;
        this.s = (this.period / PI2) * Math.asin(1 / this.amplitude);
    }
    ElasticInOut.prototype.calculate = function (percent) {
        percent *= 2;
        if (percent < 1) {
            return (-0.5 *
                (this.amplitude *
                    Math.pow(2, 10 * (percent -= 1)) *
                    Math.sin(((percent - this.s) * PI2) / this.period)));
        }
        else {
            return (this.amplitude *
                Math.pow(2, -10 * (percent -= 1)) *
                Math.sin(((percent - this.s) * PI2) / this.period) *
                0.5 +
                1);
        }
    };
    return ElasticInOut;
}());
exports.ElasticInOut = ElasticInOut;
var AlgorithmFactory = (function () {
    function AlgorithmFactory() {
    }
    AlgorithmFactory.register = function (name, algorithm) {
        this.algorithms.set(name, algorithm);
    };
    AlgorithmFactory.registerAll = function (data) {
        for (var name_1 in data) {
            this.algorithms.set(name_1, data[name_1]);
        }
    };
    AlgorithmFactory.get = function (name) {
        return this.algorithms.get(name);
    };
    AlgorithmFactory.algorithms = new Map();
    return AlgorithmFactory;
}());
exports.AlgorithmFactory = AlgorithmFactory;
AlgorithmFactory.registerAll({
    linear: new Linear(),
    quadIn: new PowIn(2),
    quadOut: new PowOut(2),
    quadInOut: new PowInOut(2),
    cubicIn: new PowIn(3),
    cubicOut: new PowOut(3),
    cubicInOut: new PowInOut(3),
    quartIn: new PowIn(4),
    quartOut: new PowOut(4),
    quartInOut: new PowInOut(4),
    quintIn: new PowIn(5),
    quintOut: new PowOut(5),
    quintInOut: new PowInOut(5),
    sineIn: new SineIn(),
    sineOut: new SineOut(),
    sineInOut: new SineInOut(),
    backIn: new BackIn(1.7),
    backOut: new BackOut(1.7),
    backInOut: new BackInOut(1.7),
    circIn: new CircIn(),
    circOut: new CircOut(),
    circInOut: new CircInOut(),
    bounceIn: new BounceIn(),
    bounceOut: new BounceOut(),
    bounceInOut: new BounceInOut(),
    elasticIn: new ElasticIn(1, 0.3),
    elasticOut: new ElasticOut(1, 0.3),
    elasticInOut: new ElasticInOut(1, 0.3)
});


/***/ }),

/***/ "./src/animation/Animation.ts":
/*!************************************!*\
  !*** ./src/animation/Animation.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = __webpack_require__(/*! ../base/Event */ "./src/base/Event.ts");
var XObject_1 = __webpack_require__(/*! ../components/XObject */ "./src/components/XObject.ts");
var ContainerUtils_1 = __webpack_require__(/*! ../utils/ContainerUtils */ "./src/utils/ContainerUtils.ts");
var AlgorithmFactory_1 = __webpack_require__(/*! ./AlgorithmFactory */ "./src/animation/AlgorithmFactory.ts");
var AnimationValueType;
(function (AnimationValueType) {
    AnimationValueType[AnimationValueType["NUMBER"] = 1] = "NUMBER";
    AnimationValueType[AnimationValueType["ANIMATABLE"] = 2] = "ANIMATABLE";
})(AnimationValueType = exports.AnimationValueType || (exports.AnimationValueType = {}));
var AnimateEventType;
(function (AnimateEventType) {
    AnimateEventType["UPDATE"] = "update";
    AnimateEventType["COMPLETE"] = "complete";
})(AnimateEventType = exports.AnimateEventType || (exports.AnimateEventType = {}));
var AnimateEvent = (function (_super) {
    __extends(AnimateEvent, _super);
    function AnimateEvent(type, step, progress, value) {
        var _this = _super.call(this, type, false, true) || this;
        _this.step = step;
        _this.progress = progress;
        _this.value = value;
        return _this;
    }
    AnimateEvent.prototype.toString = function () {
        return '[AnimateEvent (type=' + this.type + ')]';
    };
    return AnimateEvent;
}(Event_1.Event));
exports.AnimateEvent = AnimateEvent;
function isIAnimatable(obj) {
    return obj && obj.isAnimatable && obj.isAnimatable();
}
exports.isIAnimatable = isIAnimatable;
function isNumber(obj) {
    return typeof obj === 'number';
}
var AnimationStep = (function () {
    function AnimationStep(target, duration) {
        this.endTime = 0;
        this.target = target;
        this.duration = duration;
    }
    AnimationStep.prototype.onStart = function () {
        return;
    };
    AnimationStep.prototype.onUpdate = function (percent) {
        return undefined;
    };
    AnimationStep.prototype.onEnd = function () {
        return;
    };
    return AnimationStep;
}());
exports.AnimationStep = AnimationStep;
var WaitStep = (function (_super) {
    __extends(WaitStep, _super);
    function WaitStep() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WaitStep;
}(AnimationStep));
var ToStep = (function (_super) {
    __extends(ToStep, _super);
    function ToStep(target, value, algorithm, duration) {
        var _this = _super.call(this, target, duration) || this;
        if (typeof algorithm === 'string') {
            var algo = AlgorithmFactory_1.AlgorithmFactory.get(algorithm);
            if (!algo) {
                throw new Error('unknown algorithm:' + algorithm);
            }
            _this.algorithm = algo;
        }
        else {
            _this.algorithm = algorithm;
        }
        _this.values = value;
        return _this;
    }
    ToStep.prototype.onStart = function () {
        this.computed = {};
        if (isNumber(this.target)) {
            this.computed.value = {
                type: AnimationValueType.NUMBER,
                from: this.target,
                to: this.values
            };
        }
        else if (isIAnimatable(this.target)) {
            var target = this.target;
            this.computed.value = {
                type: AnimationValueType.ANIMATABLE,
                from: target,
                to: target.convertFrom(this.values)
            };
        }
        else {
            var values = this.values;
            for (var key in values) {
                var dest = values[key];
                var src = this.target[key];
                if (isIAnimatable(dest)) {
                    var to = dest;
                    this.computed[key] = {
                        type: AnimationValueType.ANIMATABLE,
                        from: to.convertFrom(src),
                        to: to
                    };
                }
                else if (isIAnimatable(src)) {
                    var from = src;
                    this.computed[key] = {
                        type: AnimationValueType.ANIMATABLE,
                        from: from,
                        to: from.convertFrom(dest)
                    };
                }
                else if (typeof dest === 'number') {
                    var from = src;
                    if (isNaN(from)) {
                        from = parseFloat(src + '');
                        if (isNaN(from)) {
                            from = 0;
                        }
                    }
                    this.computed[key] = {
                        type: AnimationValueType.NUMBER,
                        from: from,
                        to: dest
                    };
                }
            }
        }
    };
    ToStep.prototype.onUpdate = function (percent) {
        if (ContainerUtils_1.ContainerUtils.isEmpty(this.computed)) {
            return undefined;
        }
        if (isNumber(this.target)) {
            var from = this.computed.value.from;
            var to = this.computed.value.to;
            this.computed.value.current = from + (to - from) * this.algorithm.calculate(percent);
            return this.computed.value.current;
        }
        else if (isIAnimatable(this.target)) {
            var from = this.computed.value.from;
            var to = this.computed.value.to;
            this.computed.value.current = from.update(to, this.algorithm.calculate(percent));
            return this.computed.value.current;
        }
        else {
            var result = {};
            var updated = false;
            for (var name_1 in this.computed) {
                var attr = this.computed[name_1];
                switch (attr.type) {
                    case AnimationValueType.NUMBER:
                        {
                            var from = attr.from;
                            var to = attr.to;
                            attr.current = from + (to - from) * this.algorithm.calculate(percent);
                        }
                        break;
                    case AnimationValueType.ANIMATABLE:
                        {
                            var from = attr.from;
                            var to = attr.to;
                            attr.current = from.update(to, this.algorithm.calculate(percent));
                        }
                        break;
                }
                this.target[name_1] = attr.current;
                result[name_1] = attr.current;
                updated = true;
            }
            return updated ? result : undefined;
        }
    };
    return ToStep;
}(AnimationStep));
var CssStep = (function (_super) {
    __extends(CssStep, _super);
    function CssStep(target, values, algorithm, duration) {
        var _this = _super.call(this, target, duration) || this;
        if (typeof algorithm === 'string') {
            var algo = AlgorithmFactory_1.AlgorithmFactory.get(algorithm);
            if (!algo) {
                throw new Error('unknown algorithm:' + algorithm);
            }
            _this.algorithm = algo;
        }
        else {
            _this.algorithm = algorithm;
        }
        _this.values = values;
        return _this;
    }
    CssStep.prototype.onStart = function () {
        this.computed = this.target.style.getSnapshotForAnimation(this.target, this.values);
    };
    CssStep.prototype.onUpdate = function (percent) {
        if (ContainerUtils_1.ContainerUtils.isEmpty(this.computed)) {
            return undefined;
        }
        var result = {};
        var updated = false;
        var target = this.target;
        for (var name_2 in this.computed) {
            var attr = this.computed[name_2];
            switch (attr.type) {
                case AnimationValueType.NUMBER:
                    {
                        var from = attr.from;
                        var to = attr.to;
                        attr.current = from + (to - from) * this.algorithm.calculate(percent);
                    }
                    break;
                case AnimationValueType.ANIMATABLE:
                    {
                        var from = attr.from;
                        var to = attr.to;
                        attr.current = from.update(to, this.algorithm.calculate(percent));
                    }
                    break;
            }
            result[name_2] = attr.current;
            updated = true;
        }
        if (updated) {
            target.style.applyAnimationResult(result);
            target.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, target));
            return result;
        }
        else {
            return undefined;
        }
    };
    return CssStep;
}(AnimationStep));
var CallStep = (function (_super) {
    __extends(CallStep, _super);
    function CallStep(target, call) {
        var _this = _super.call(this, target, 0) || this;
        _this.call = call;
        return _this;
    }
    CallStep.prototype.onEnd = function () {
        this.call(this.target);
    };
    return CallStep;
}(AnimationStep));
var AnimationState;
(function (AnimationState) {
    AnimationState[AnimationState["RUNNING"] = 1] = "RUNNING";
    AnimationState[AnimationState["PAUSED"] = 2] = "PAUSED";
    AnimationState[AnimationState["COMPLETED"] = 3] = "COMPLETED";
    AnimationState[AnimationState["CANCELLED"] = 4] = "CANCELLED";
})(AnimationState = exports.AnimationState || (exports.AnimationState = {}));
var Animation = (function (_super) {
    __extends(Animation, _super);
    function Animation(target, loop) {
        var _this = _super.call(this) || this;
        _this.playTimes = 1;
        _this.state = AnimationState.RUNNING;
        _this.steps = [];
        _this.roundStartTime = 0;
        _this.duration = 0;
        _this.currentStepIndex = 0;
        _this.currentStepProgress = 0;
        _this.target = target;
        _this.playTimes = loop ? 0 : 1;
        _this.roundStartTime = _this.beginTime = Date.now();
        _this.currentStepIndex = 0;
        _this.state = AnimationState.RUNNING;
        return _this;
    }
    Animation.prototype.toPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.addEventListener(AnimateEventType.COMPLETE, function (event) {
                resolve(event);
            });
        });
    };
    Animation.prototype.pause = function () {
        if (this.state === AnimationState.RUNNING) {
            this.state = AnimationState.PAUSED;
            this.pauseTime = Date.now();
            return true;
        }
        else {
            return false;
        }
    };
    Animation.prototype.resume = function () {
        if (this.state === AnimationState.PAUSED) {
            var duration = Date.now() - this.pauseTime;
            this.roundStartTime += duration;
            this.beginTime += duration;
            this.state = AnimationState.RUNNING;
            return true;
        }
        else {
            return false;
        }
    };
    Animation.prototype.loop = function (loop) {
        this.playTimes = loop ? 0 : 1;
        return this;
    };
    Animation.prototype.times = function (times) {
        this.playTimes = times;
        return this;
    };
    Animation.prototype.to = function (props, duration, algorithm) {
        if (algorithm === void 0) { algorithm = 'linear'; }
        this.addStep(new ToStep(this.target, props, algorithm, duration));
        return this;
    };
    Animation.prototype.css = function (props, duration, algorithm) {
        if (algorithm === void 0) { algorithm = 'linear'; }
        this.addStep(new CssStep(this.target, props, algorithm, duration));
        return this;
    };
    Animation.prototype.call = function (call) {
        return this.addStep(new CallStep(this.target, call));
    };
    Animation.prototype.wait = function (duration) {
        return this.addStep(new WaitStep(this.target, duration));
    };
    Animation.prototype.onInterval = function () {
        if (this.duration <= 0) {
            return false;
        }
        var now = Date.now();
        if (now < this.roundStartTime) {
            return false;
        }
        var passed = now - this.roundStartTime;
        var currentStep = this.steps[this.currentStepIndex];
        if (passed >= this.duration) {
            this.doUpdateInternal(1);
            currentStep.onEnd();
            for (++this.currentStepIndex; this.currentStepIndex < this.steps.length; ++this.currentStepIndex) {
                var step = this.steps[this.currentStepIndex];
                step.onStart();
                this.doUpdateInternal(1);
                step.onEnd();
            }
            var newRound = true;
            if (this.playTimes > 0) {
                newRound = this.playTimes * this.duration > now - this.beginTime;
            }
            if (!newRound) {
                this.currentStepIndex = this.steps.length - 1;
                this.state = AnimationState.COMPLETED;
                this.dispatchEvent(new AnimateEvent(AnimateEventType.COMPLETE, this.currentStepIndex, this.currentStepProgress));
            }
            else {
                passed = passed % this.duration;
                this.roundStartTime = now - passed;
                this.currentStepIndex = 0;
                while (true) {
                    var step = this.steps[this.currentStepIndex];
                    step.onStart();
                    if (step.endTime > passed) {
                        var progress = 1 - (step.endTime - passed) / step.duration;
                        this.doUpdateInternal(progress);
                        break;
                    }
                    else {
                        this.doUpdateInternal(1);
                        step.onEnd();
                        ++this.currentStepIndex;
                    }
                }
            }
        }
        else {
            if (currentStep.endTime > passed) {
                var progress = 1 - (currentStep.endTime - passed) / currentStep.duration;
                this.doUpdateInternal(progress);
            }
            else {
                this.doUpdateInternal(1);
                currentStep.onEnd();
                ++this.currentStepIndex;
                while (true) {
                    var step = this.steps[this.currentStepIndex];
                    step.onStart();
                    if (step.endTime > passed && step.duration > 0) {
                        var progress = 1 - (step.endTime - passed) / step.duration;
                        this.doUpdateInternal(progress);
                        break;
                    }
                    else {
                        this.doUpdateInternal(1);
                        step.onEnd();
                        ++this.currentStepIndex;
                    }
                }
            }
        }
        return true;
    };
    Animation.prototype.cancel = function () {
        this.state = AnimationState.CANCELLED;
        this.dispatchEvent(new AnimateEvent(AnimateEventType.COMPLETE, this.currentStepIndex, this.currentStepProgress));
    };
    Animation.prototype.doUpdateInternal = function (progress) {
        this.currentStepProgress = progress;
        var result = this.steps[this.currentStepIndex].onUpdate(progress);
        if (result) {
            this.dispatchEvent(new AnimateEvent(AnimateEventType.UPDATE, this.currentStepIndex, this.currentStepProgress, result));
        }
    };
    Animation.prototype.addStep = function (step) {
        this.steps.push(step);
        this.duration += step.duration;
        step.endTime = this.duration;
        if (this.steps.length === 1) {
            step.onStart();
        }
        return this;
    };
    return Animation;
}(Event_1.EventDispatcher));
exports.Animation = Animation;


/***/ }),

/***/ "./src/animation/AnimationFactory.ts":
/*!*******************************************!*\
  !*** ./src/animation/AnimationFactory.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = __webpack_require__(/*! ../base/Event */ "./src/base/Event.ts");
var Animation_1 = __webpack_require__(/*! ./Animation */ "./src/animation/Animation.ts");
var AnimationFactory = (function (_super) {
    __extends(AnimationFactory, _super);
    function AnimationFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animations = [];
        return _this;
    }
    AnimationFactory.prototype.create = function (target, override) {
        if (override || typeof target !== 'number') {
            this.removeByTarget(target);
        }
        var animation = new Animation_1.Animation(target);
        this.animations.push(animation);
        return animation;
    };
    AnimationFactory.prototype.removeByTarget = function (target) {
        for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
            var animation = _a[_i];
            if (animation.target === target && animation.state === Animation_1.AnimationState.RUNNING) {
                animation.cancel();
            }
        }
    };
    AnimationFactory.prototype.clear = function () {
        for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
            var animation = _a[_i];
            animation.cancel();
        }
    };
    AnimationFactory.prototype.onInterval = function () {
        var size = this.animations.length;
        if (size === 0) {
            return false;
        }
        var updated = false;
        for (var i = 0; i < size; ++i) {
            if (this.animations[i].onInterval()) {
                updated = true;
            }
        }
        if (updated) {
            this.dispatchEvent(new Event_1.Event('update', false, true));
        }
        for (var i = this.animations.length - 1; i >= 0; --i) {
            var animation = this.animations[i];
            if (animation.state === Animation_1.AnimationState.COMPLETED ||
                animation.state === Animation_1.AnimationState.CANCELLED) {
                this.animations.splice(i, 1);
            }
        }
        return updated;
    };
    return AnimationFactory;
}(Event_1.EventDispatcher));
exports.AnimationFactory = AnimationFactory;


/***/ }),

/***/ "./src/animation/index.ts":
/*!********************************!*\
  !*** ./src/animation/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./AlgorithmFactory */ "./src/animation/AlgorithmFactory.ts"));
__export(__webpack_require__(/*! ./Animation */ "./src/animation/Animation.ts"));
__export(__webpack_require__(/*! ./AnimationFactory */ "./src/animation/AnimationFactory.ts"));


/***/ }),

/***/ "./src/base/BaseValue.ts":
/*!*******************************!*\
  !*** ./src/base/BaseValue.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BaseValueUnit;
(function (BaseValueUnit) {
    BaseValueUnit[BaseValueUnit["PX"] = 1] = "PX";
    BaseValueUnit[BaseValueUnit["PERCENTAGE"] = 2] = "PERCENTAGE";
})(BaseValueUnit = exports.BaseValueUnit || (exports.BaseValueUnit = {}));
var BaseValue = (function () {
    function BaseValue(value, unit) {
        if (unit === void 0) { unit = BaseValueUnit.PX; }
        this.numberValue = 0;
        this.unit = unit;
        this.numberValue = value;
    }
    BaseValue.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        if (typeof value === 'string') {
            var num = parseFloat(value);
            if (isNaN(num)) {
                if (!silent) {
                    console.warn('invalid value:' + value);
                }
                return undefined;
            }
            if (value.endsWith('%')) {
                return new BaseValue(num, BaseValueUnit.PERCENTAGE);
            }
            else {
                return new BaseValue(num, BaseValueUnit.PX);
            }
        }
        else {
            return new BaseValue(value, BaseValueUnit.PX);
        }
    };
    BaseValue.prototype.getValue = function (base) {
        switch (this.unit) {
            case BaseValueUnit.PERCENTAGE:
                return (this.numberValue * base) / 100;
            case BaseValueUnit.PX:
                return this.numberValue;
        }
    };
    BaseValue.prototype.toAbsolute = function (base) {
        switch (this.unit) {
            case BaseValueUnit.PERCENTAGE:
                return new BaseValue((this.numberValue * base) / 100, BaseValueUnit.PX);
            case BaseValueUnit.PX:
                return this;
        }
    };
    BaseValue.prototype.toPercentage = function (base) {
        switch (this.unit) {
            case BaseValueUnit.PX:
                return new BaseValue((this.numberValue / base) * 100, BaseValueUnit.PERCENTAGE);
            case BaseValueUnit.PERCENTAGE:
                return this;
        }
    };
    BaseValue.prototype.toString = function () {
        switch (this.unit) {
            case BaseValueUnit.PERCENTAGE:
                return this.numberValue + '%';
            case BaseValueUnit.PX:
                return this.numberValue + '';
        }
    };
    BaseValue.prototype.equals = function (that) {
        return this.numberValue === that.numberValue && this.unit === this.unit;
    };
    BaseValue.prototype.clone = function () {
        return new BaseValue(this.numberValue, this.unit);
    };
    BaseValue.prototype.update = function (target, progress) {
        return new BaseValue(this.numberValue + (target.numberValue - this.numberValue) * progress, target.unit);
    };
    BaseValue.prototype.convertFrom = function (src) {
        var result = BaseValue.of(src);
        if (result === undefined) {
            return new BaseValue(0);
        }
        else {
            return result;
        }
    };
    BaseValue.prototype.isAnimatable = function () {
        return true;
    };
    BaseValue.ZERO = BaseValue.of('0');
    return BaseValue;
}());
exports.BaseValue = BaseValue;


/***/ }),

/***/ "./src/base/Color.ts":
/*!***************************!*\
  !*** ./src/base/Color.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FunctionParser_1 = __webpack_require__(/*! ../parser/FunctionParser */ "./src/parser/FunctionParser.ts");
var REG_VALUE = /^([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)%?$/;
var REG_HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
var Color = (function () {
    function Color(r, g, b, a) {
        if (a === void 0) { a = 1; }
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;
        this.r = Math.min(255, Math.max(0, r));
        this.g = Math.min(255, Math.max(0, g));
        this.b = Math.min(255, Math.max(0, b));
        this.a = Math.min(1, Math.max(0, a));
    }
    Color.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        if (REG_HEX.test(value)) {
            return this.fromHex(value, silent);
        }
        var colorName = value.toUpperCase();
        if (this[colorName]) {
            return this[colorName];
        }
        var func = FunctionParser_1.FunctionParser.parse(value, silent);
        if (!func) {
            if (!silent) {
                console.warn('invalid color value:' + value);
            }
            return undefined;
        }
        var funcName = func.name.toLowerCase();
        if (funcName === 'rgb' && func.arguments.length === 3) {
            var r = this.parseColorValue(func.arguments[0], 255);
            var g = this.parseColorValue(func.arguments[1], 255);
            var b = this.parseColorValue(func.arguments[2], 255);
            if (r === undefined || g === undefined || b === undefined) {
                console.warn('invalid color value:' + value);
                return undefined;
            }
            return new Color(r, g, b, 1);
        }
        else if (funcName === 'rgba' && func.arguments.length === 4) {
            var r = this.parseColorValue(func.arguments[0], 255);
            var g = this.parseColorValue(func.arguments[1], 255);
            var b = this.parseColorValue(func.arguments[2], 255);
            var a = this.parseColorValue(func.arguments[3], 1);
            if (r === undefined || g === undefined || b === undefined || a === undefined) {
                console.warn('invalid color value:' + value);
                return undefined;
            }
            return new Color(r, g, b, a);
        }
        if (!silent) {
            console.warn('invalid color value:' + value);
        }
        return undefined;
    };
    Color.random = function (includeAlpha) {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, includeAlpha ? Math.random() * 1 : 1);
    };
    Color.parseColorValue = function (value, base) {
        if (!REG_VALUE.test(value)) {
            return undefined;
        }
        if (value.endsWith('%')) {
            return (parseFloat(value) * base) / 100;
        }
        else {
            return parseFloat(value);
        }
    };
    Color.fromHex = function (hex, silent) {
        if (hex.length === 4) {
            return new Color(parseInt(hex[1], 16) * 16 + parseInt(hex[1], 16), parseInt(hex[2], 16) * 16 + parseInt(hex[2], 16), parseInt(hex[3], 16) * 16 + parseInt(hex[3], 16), 1);
        }
        else if (hex.length === 5) {
            return new Color(parseInt(hex[1], 16) * 16 + parseInt(hex[1], 16), parseInt(hex[2], 16) * 16 + parseInt(hex[2], 16), parseInt(hex[3], 16) * 16 + parseInt(hex[3], 16), (parseInt(hex[4], 16) * 16 + parseInt(hex[4], 16)) / 255);
        }
        else if (hex.length === 7) {
            return new Color(parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3, 5), 16), parseInt(hex.substring(5, 7), 16), 1);
        }
        else if (hex.length === 9) {
            return new Color(parseInt(hex.substring(1, 3), 16), parseInt(hex.substring(3, 5), 16), parseInt(hex.substring(5, 7), 16), parseInt(hex.substring(7, 9), 16) / 255);
        }
        if (!silent) {
            console.warn('invalid color value:' + hex);
        }
        return undefined;
    };
    Color.prototype.equals = function (that) {
        return this.r === that.r && this.g === that.g && this.b === that.b && this.a === that.a;
    };
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b, this.a);
    };
    Color.prototype.toString = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    Color.prototype.update = function (target, progress) {
        return new Color(this.r + (target.r - this.r) * progress, this.g + (target.g - this.g) * progress, this.b + (target.b - this.b) * progress, this.a + (target.a - this.a) * progress);
    };
    Color.prototype.convertFrom = function (src) {
        var result = Color.of(src + '');
        if (result === undefined) {
            return Color.BLACK;
        }
        else {
            return result;
        }
    };
    Color.prototype.isAnimatable = function () {
        return true;
    };
    Color.TRANSPARENT = Color.of('#0000');
    Color.ALICEBLUE = Color.of('#F0F8FF');
    Color.ANTIQUEWHITE = Color.of('#FAEBD7');
    Color.AQUA = Color.of('#00FFFF');
    Color.AQUAMARINE = Color.of('#7FFFD4');
    Color.AZURE = Color.of('#F0FFFF');
    Color.BEIGE = Color.of('#F5F5DC');
    Color.BISQUE = Color.of('#FFE4C4');
    Color.BLACK = Color.of('#000000');
    Color.BLANCHEDALMOND = Color.of('#FFEBCD');
    Color.BLUE = Color.of('#0000FF');
    Color.BLUEVIOLET = Color.of('#8A2BE2');
    Color.BROWN = Color.of('#A52A2A');
    Color.BURLYWOOD = Color.of('#DEB887');
    Color.CADETBLUE = Color.of('#5F9EA0');
    Color.CHARTREUSE = Color.of('#7FFF00');
    Color.CHOCOLATE = Color.of('#D2691E');
    Color.CORAL = Color.of('#FF7F50');
    Color.CORNFLOWERBLUE = Color.of('#6495ED');
    Color.CORNSILK = Color.of('#FFF8DC');
    Color.CRIMSON = Color.of('#DC143C');
    Color.CYAN = Color.of('#00FFFF');
    Color.DARKBLUE = Color.of('#00008B');
    Color.DARKCYAN = Color.of('#008B8B');
    Color.DARKGOLDENROD = Color.of('#B8860B');
    Color.DARKGRAY = Color.of('#A9A9A9');
    Color.DARKGREY = Color.of('#A9A9A9');
    Color.DARKGREEN = Color.of('#006400');
    Color.DARKKHAKI = Color.of('#BDB76B');
    Color.DARKMAGENTA = Color.of('#8B008B');
    Color.DARKOLIVEGREEN = Color.of('#556B2F');
    Color.DARKORANGE = Color.of('#FF8C00');
    Color.DARKORCHID = Color.of('#9932CC');
    Color.DARKRED = Color.of('#8B0000');
    Color.DARKSALMON = Color.of('#E9967A');
    Color.DARKSEAGREEN = Color.of('#8FBC8F');
    Color.DARKSLATEBLUE = Color.of('#483D8B');
    Color.DARKSLATEGRAY = Color.of('#2F4F4F');
    Color.DARKSLATEGREY = Color.of('#2F4F4F');
    Color.DARKTURQUOISE = Color.of('#00CED1');
    Color.DARKVIOLET = Color.of('#9400D3');
    Color.DEEPPINK = Color.of('#FF1493');
    Color.DEEPSKYBLUE = Color.of('#00BFFF');
    Color.DIMGRAY = Color.of('#696969');
    Color.DIMGREY = Color.of('#696969');
    Color.DODGERBLUE = Color.of('#1E90FF');
    Color.FIREBRICK = Color.of('#B22222');
    Color.FLORALWHITE = Color.of('#FFFAF0');
    Color.FORESTGREEN = Color.of('#228B22');
    Color.FUCHSIA = Color.of('#FF00FF');
    Color.GAINSBORO = Color.of('#DCDCDC');
    Color.GHOSTWHITE = Color.of('#F8F8FF');
    Color.GOLD = Color.of('#FFD700');
    Color.GOLDENROD = Color.of('#DAA520');
    Color.GRAY = Color.of('#808080');
    Color.GREY = Color.of('#808080');
    Color.GREEN = Color.of('#008000');
    Color.GREENYELLOW = Color.of('#ADFF2F');
    Color.HONEYDEW = Color.of('#F0FFF0');
    Color.HOTPINK = Color.of('#FF69B4');
    Color.INDIANRED = Color.of('#CD5C5C');
    Color.INDIGO = Color.of('#4B0082');
    Color.IVORY = Color.of('#FFFFF0');
    Color.KHAKI = Color.of('#F0E68C');
    Color.LAVENDER = Color.of('#E6E6FA');
    Color.LAVENDERBLUSH = Color.of('#FFF0F5');
    Color.LAWNGREEN = Color.of('#7CFC00');
    Color.LEMONCHIFFON = Color.of('#FFFACD');
    Color.LIGHTBLUE = Color.of('#ADD8E6');
    Color.LIGHTCORAL = Color.of('#F08080');
    Color.LIGHTCYAN = Color.of('#E0FFFF');
    Color.LIGHTGOLDENRODYELLOW = Color.of('#FAFAD2');
    Color.LIGHTGRAY = Color.of('#D3D3D3');
    Color.LIGHTGREY = Color.of('#D3D3D3');
    Color.LIGHTGREEN = Color.of('#90EE90');
    Color.LIGHTPINK = Color.of('#FFB6C1');
    Color.LIGHTSALMON = Color.of('#FFA07A');
    Color.LIGHTSEAGREEN = Color.of('#20B2AA');
    Color.LIGHTSKYBLUE = Color.of('#87CEFA');
    Color.LIGHTSLATEGRAY = Color.of('#778899');
    Color.LIGHTSLATEGREY = Color.of('#778899');
    Color.LIGHTSTEELBLUE = Color.of('#B0C4DE');
    Color.LIGHTYELLOW = Color.of('#FFFFE0');
    Color.LIME = Color.of('#00FF00');
    Color.LIMEGREEN = Color.of('#32CD32');
    Color.LINEN = Color.of('#FAF0E6');
    Color.MAGENTA = Color.of('#FF00FF');
    Color.MAROON = Color.of('#800000');
    Color.MEDIUMAQUAMARINE = Color.of('#66CDAA');
    Color.MEDIUMBLUE = Color.of('#0000CD');
    Color.MEDIUMORCHID = Color.of('#BA55D3');
    Color.MEDIUMPURPLE = Color.of('#9370DB');
    Color.MEDIUMSEAGREEN = Color.of('#3CB371');
    Color.MEDIUMSLATEBLUE = Color.of('#7B68EE');
    Color.MEDIUMSPRINGGREEN = Color.of('#00FA9A');
    Color.MEDIUMTURQUOISE = Color.of('#48D1CC');
    Color.MEDIUMVIOLETRED = Color.of('#C71585');
    Color.MIDNIGHTBLUE = Color.of('#191970');
    Color.MINTCREAM = Color.of('#F5FFFA');
    Color.MISTYROSE = Color.of('#FFE4E1');
    Color.MOCCASIN = Color.of('#FFE4B5');
    Color.NAVAJOWHITE = Color.of('#FFDEAD');
    Color.NAVY = Color.of('#000080');
    Color.OLDLACE = Color.of('#FDF5E6');
    Color.OLIVE = Color.of('#808000');
    Color.OLIVEDRAB = Color.of('#6B8E23');
    Color.ORANGE = Color.of('#FFA500');
    Color.ORANGERED = Color.of('#FF4500');
    Color.ORCHID = Color.of('#DA70D6');
    Color.PALEGOLDENROD = Color.of('#EEE8AA');
    Color.PALEGREEN = Color.of('#98FB98');
    Color.PALETURQUOISE = Color.of('#AFEEEE');
    Color.PALEVIOLETRED = Color.of('#DB7093');
    Color.PAPAYAWHIP = Color.of('#FFEFD5');
    Color.PEACHPUFF = Color.of('#FFDAB9');
    Color.PERU = Color.of('#CD853F');
    Color.PINK = Color.of('#FFC0CB');
    Color.PLUM = Color.of('#DDA0DD');
    Color.POWDERBLUE = Color.of('#B0E0E6');
    Color.PURPLE = Color.of('#800080');
    Color.REBECCAPURPLE = Color.of('#663399');
    Color.RED = Color.of('#FF0000');
    Color.ROSYBROWN = Color.of('#BC8F8F');
    Color.ROYALBLUE = Color.of('#4169E1');
    Color.SADDLEBROWN = Color.of('#8B4513');
    Color.SALMON = Color.of('#FA8072');
    Color.SANDYBROWN = Color.of('#F4A460');
    Color.SEAGREEN = Color.of('#2E8B57');
    Color.SEASHELL = Color.of('#FFF5EE');
    Color.SIENNA = Color.of('#A0522D');
    Color.SILVER = Color.of('#C0C0C0');
    Color.SKYBLUE = Color.of('#87CEEB');
    Color.SLATEBLUE = Color.of('#6A5ACD');
    Color.SLATEGRAY = Color.of('#708090');
    Color.SLATEGREY = Color.of('#708090');
    Color.SNOW = Color.of('#FFFAFA');
    Color.SPRINGGREEN = Color.of('#00FF7F');
    Color.STEELBLUE = Color.of('#4682B4');
    Color.TAN = Color.of('#D2B48C');
    Color.TEAL = Color.of('#008080');
    Color.THISTLE = Color.of('#D8BFD8');
    Color.TOMATO = Color.of('#FF6347');
    Color.TURQUOISE = Color.of('#40E0D0');
    Color.VIOLET = Color.of('#EE82EE');
    Color.WHEAT = Color.of('#F5DEB3');
    Color.WHITE = Color.of('#FFFFFF');
    Color.WHITESMOKE = Color.of('#F5F5F5');
    Color.YELLOW = Color.of('#FFFF00');
    Color.YELLOWGREEN = Color.of('#9ACD32');
    Color.NONE = Color.of('#FFFF00');
    return Color;
}());
exports.Color = Color;


/***/ }),

/***/ "./src/base/Event.ts":
/*!***************************!*\
  !*** ./src/base/Event.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Event = (function () {
    function Event(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = true; }
        if (cancelable === void 0) { cancelable = true; }
        this.defaultPrevented = false;
        this.propagationStopped = false;
        this.immediatePropagationStopped = false;
        this.bubbles = false;
        this.cancelable = false;
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.timeStamp = Date.now();
    }
    Event.prototype.preventDefault = function () {
        this.defaultPrevented = this.cancelable && true;
    };
    Event.prototype.stopPropagation = function () {
        this.propagationStopped = true;
    };
    Event.prototype.stopImmediatePropagation = function () {
        this.immediatePropagationStopped = this.propagationStopped = true;
    };
    Event.prototype.toString = function () {
        return '[Event (type=' + this.type + ')]';
    };
    return Event;
}());
exports.Event = Event;
var EventDispatcher = (function () {
    function EventDispatcher() {
        this.listeners = {};
    }
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        var types = typeof type === 'string' ? [type] : type;
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var t = types_1[_i];
            var listeners = this.listeners[t];
            if (listeners) {
                this.removeEventListener(t, listener);
            }
            listeners = this.listeners[t];
            if (!listeners) {
                this.listeners[t] = [listener];
            }
            else {
                listeners.push(listener);
            }
        }
        return this;
    };
    EventDispatcher.prototype.on = function (type, listener) {
        return this.addEventListener(type, listener);
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        var types = typeof type === 'string' ? [type] : type;
        for (var _i = 0, types_2 = types; _i < types_2.length; _i++) {
            var t = types_2[_i];
            var arr = this.listeners[t];
            if (!arr) {
                return;
            }
            for (var i = 0, l = arr.length; i < l; i++) {
                if (arr[i] === listener) {
                    if (l === 1) {
                        delete this.listeners[t];
                    }
                    else {
                        arr.splice(i, 1);
                    }
                    break;
                }
            }
        }
        return this;
    };
    EventDispatcher.prototype.off = function (type, listener) {
        this.removeEventListener(type, listener);
    };
    EventDispatcher.prototype.removeAllEventListeners = function (type) {
        if (!type) {
            this.listeners = {};
        }
        else if (this.listeners) {
            delete this.listeners[type];
        }
    };
    EventDispatcher.prototype.hasEventListener = function (type) {
        return !!this.listeners[type];
    };
    EventDispatcher.prototype.willTrigger = function (type) {
        return this.hasEventListener(type);
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        var listeners = this.listeners[event.type];
        if (listeners) {
            listeners = listeners.slice();
            for (var i = 0; i < listeners.length && !event.immediatePropagationStopped; i++) {
                listeners[i](event);
            }
        }
        return !event.defaultPrevented;
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;


/***/ }),

/***/ "./src/base/Matrix2D.ts":
/*!******************************!*\
  !*** ./src/base/Matrix2D.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Point_1 = __webpack_require__(/*! ./Point */ "./src/base/Point.ts");
var DEG_TO_RAD = Math.PI / 180;
var Matrix2D = (function () {
    function Matrix2D(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 1; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
        this.setValues(a, b, c, d, tx, ty);
    }
    Matrix2D.prototype.setValues = function (a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 1; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    };
    Matrix2D.prototype.append = function (a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
            this.a = a1 * a + c1 * b;
            this.b = b1 * a + d1 * b;
            this.c = a1 * c + c1 * d;
            this.d = b1 * c + d1 * d;
        }
        this.tx = a1 * tx + c1 * ty + this.tx;
        this.ty = b1 * tx + d1 * ty + this.ty;
        return this;
    };
    Matrix2D.prototype.prepend = function (a, b, c, d, tx, ty) {
        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;
        this.a = a * a1 + c * this.b;
        this.b = b * a1 + d * this.b;
        this.c = a * c1 + c * this.d;
        this.d = b * c1 + d * this.d;
        this.tx = a * tx1 + c * this.ty + tx;
        this.ty = b * tx1 + d * this.ty + ty;
        return this;
    };
    Matrix2D.prototype.appendMatrix = function (matrix) {
        return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    Matrix2D.prototype.prependMatrix = function (matrix) {
        return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    Matrix2D.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, transformX, transformY) {
        var cos;
        var sin;
        if (rotation % 360) {
            var r = rotation * DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        }
        else {
            cos = 1;
            sin = 0;
        }
        if (skewX || skewY) {
            skewX *= DEG_TO_RAD;
            skewY *= DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        }
        else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        if (transformX || transformY) {
            this.tx -= transformX * this.a + transformY * this.c;
            this.ty -= transformX * this.b + transformY * this.d;
        }
        return this;
    };
    Matrix2D.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, transformX, transformY) {
        var cos;
        var sin;
        if (rotation % 360) {
            var r = rotation * DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        }
        else {
            cos = 1;
            sin = 0;
        }
        if (transformX || transformY) {
            this.tx -= transformX;
            this.ty -= transformY;
        }
        if (skewX || skewY) {
            skewX *= DEG_TO_RAD;
            skewY *= DEG_TO_RAD;
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        }
        else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        return this;
    };
    Matrix2D.prototype.rotate = function (angle) {
        angle = angle * DEG_TO_RAD;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a;
        var b1 = this.b;
        this.a = a1 * cos + this.c * sin;
        this.b = b1 * cos + this.d * sin;
        this.c = -a1 * sin + this.c * cos;
        this.d = -b1 * sin + this.d * cos;
        return this;
    };
    Matrix2D.prototype.skew = function (skewX, skewY) {
        skewX = skewX * DEG_TO_RAD;
        skewY = skewY * DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this;
    };
    Matrix2D.prototype.scale = function (x, y) {
        this.a *= x;
        this.b *= x;
        this.c *= y;
        this.d *= y;
        return this;
    };
    Matrix2D.prototype.translate = function (x, y) {
        this.tx += this.a * x + this.c * y;
        this.ty += this.b * x + this.d * y;
        return this;
    };
    Matrix2D.prototype.identity = function () {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    };
    Matrix2D.prototype.invert = function () {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this;
    };
    Matrix2D.prototype.isIdentity = function () {
        return (this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1);
    };
    Matrix2D.prototype.equals = function (matrix) {
        return (this.tx === matrix.tx &&
            this.ty === matrix.ty &&
            this.a === matrix.a &&
            this.b === matrix.b &&
            this.c === matrix.c &&
            this.d === matrix.d);
    };
    Matrix2D.prototype.transformPoint = function (x, y) {
        var pt = new Point_1.Point(0, 0);
        pt.x = x * this.a + y * this.c + this.tx;
        pt.y = x * this.b + y * this.d + this.ty;
        return pt;
    };
    Matrix2D.prototype.copy = function (matrix) {
        return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    Matrix2D.prototype.clone = function () {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };
    Matrix2D.prototype.toString = function () {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
    };
    return Matrix2D;
}());
exports.Matrix2D = Matrix2D;


/***/ }),

/***/ "./src/base/Point.ts":
/*!***************************!*\
  !*** ./src/base/Point.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.equals = function (that) {
        return this.x === that.x && this.y === this.y;
    };
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    return Point;
}());
exports.Point = Point;


/***/ }),

/***/ "./src/base/Rect.ts":
/*!**************************!*\
  !*** ./src/base/Rect.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var REG_RECT = /^\s*[0-9]+\s+[0-9]+\s+[0-9]+\s+[0-9]+\s*$/;
var Rect = (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rect.of = function (value) {
        if (!REG_RECT.test(value)) {
            return undefined;
        }
        var pieces = value.split(/\s+/);
        var x = parseFloat(pieces[0]);
        if (isNaN(x)) {
            return undefined;
        }
        var y = parseFloat(pieces[1]);
        if (isNaN(y)) {
            return undefined;
        }
        var width = parseFloat(pieces[2]);
        if (isNaN(width)) {
            return undefined;
        }
        var height = parseFloat(pieces[3]);
        if (isNaN(height)) {
            return undefined;
        }
        return new Rect(x, y, width, height);
    };
    Rect.prototype.in = function (x, y) {
        return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
    };
    Rect.prototype.equals = function (that) {
        return (this.x === that.x &&
            this.y === this.y &&
            this.width === that.width &&
            this.height === that.height);
    };
    Rect.prototype.clone = function () {
        return new Rect(this.x, this.y, this.width, this.height);
    };
    return Rect;
}());
exports.Rect = Rect;


/***/ }),

/***/ "./src/base/RoundRect.ts":
/*!*******************************!*\
  !*** ./src/base/RoundRect.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Rect_1 = __webpack_require__(/*! ../base/Rect */ "./src/base/Rect.ts");
var RoundRect = (function () {
    function RoundRect(x1, y1, x2, y2) {
        if (x1 === void 0) { x1 = 0; }
        if (y1 === void 0) { y1 = 0; }
        if (x2 === void 0) { x2 = 0; }
        if (y2 === void 0) { y2 = 0; }
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.leftTopRadiusX = 0;
        this.leftTopRadiusY = 0;
        this.rightTopRadiusX = 0;
        this.rightTopRadiusY = 0;
        this.rightBottomRadiusX = 0;
        this.rightBottomRadiusY = 0;
        this.leftBottomRadiusX = 0;
        this.leftBottomRadiusY = 0;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    RoundRect.prototype.toRect = function () {
        return new Rect_1.Rect(this.x1, this.y1, this.x2 - this.x1 + 1, this.y2 - this.y1 + 1);
    };
    RoundRect.prototype.applySize = function (width, height) {
        this.x2 = this.x1 + width - 1;
        this.y2 = this.y1 + height - 1;
        return this;
    };
    RoundRect.prototype.applyRadius = function (borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius) {
        var width = this.x2 - this.x1 + 1;
        var height = this.y2 - this.y1 + 1;
        if (borderTopLeftRadius) {
            this.leftTopRadiusX = borderTopLeftRadius.value1.getValue(width);
            this.leftTopRadiusY = borderTopLeftRadius.value2.getValue(height);
        }
        if (borderTopRightRadius) {
            this.rightTopRadiusX = borderTopRightRadius.value1.getValue(width);
            this.rightTopRadiusY = borderTopRightRadius.value2.getValue(height);
        }
        if (borderBottomLeftRadius) {
            this.leftBottomRadiusX = borderBottomLeftRadius.value1.getValue(width);
            this.leftBottomRadiusY = borderBottomLeftRadius.value2.getValue(height);
        }
        if (borderBottomRightRadius) {
            this.rightBottomRadiusX = borderBottomRightRadius.value1.getValue(width);
            this.rightBottomRadiusY = borderBottomRightRadius.value2.getValue(height);
        }
        if (this.leftTopRadiusX + this.rightTopRadiusX > width) {
            var scale = width / (this.leftTopRadiusX + this.rightTopRadiusX);
            this.leftTopRadiusX *= scale;
            this.rightTopRadiusX *= scale;
        }
        if (this.leftBottomRadiusX + this.rightBottomRadiusX > width) {
            var scale = width / (this.leftBottomRadiusX + this.rightBottomRadiusX);
            this.leftBottomRadiusX *= scale;
            this.rightBottomRadiusX *= scale;
        }
        if (this.leftTopRadiusY + this.leftBottomRadiusY > height) {
            var scale = height / (this.leftTopRadiusY + this.leftBottomRadiusY);
            this.leftTopRadiusY *= scale;
            this.leftBottomRadiusY *= scale;
        }
        if (this.rightTopRadiusY + this.rightBottomRadiusY > height) {
            var scale = height / (this.rightTopRadiusY + this.rightBottomRadiusY);
            this.rightTopRadiusY *= scale;
            this.rightBottomRadiusY *= scale;
        }
        return this;
    };
    RoundRect.prototype.applyBorder = function (top, right, bottom, left) {
        if (top === 0 && right === 0 && bottom === 0 && left === 0) {
            return this;
        }
        var rect = new RoundRect();
        rect.x1 = this.x1 + left;
        rect.y1 = this.y1 + top;
        rect.x2 = this.x2 - right;
        rect.y2 = this.y2 - bottom;
        rect.leftTopRadiusX = Math.max(0, this.leftTopRadiusX - left);
        rect.leftTopRadiusY = Math.max(0, this.leftTopRadiusY - top);
        if (rect.leftTopRadiusX === 0 || rect.leftTopRadiusY === 0) {
            rect.leftTopRadiusX = rect.leftTopRadiusY = 0;
        }
        rect.rightTopRadiusX = Math.max(0, this.rightTopRadiusX - right);
        rect.rightTopRadiusY = Math.max(0, this.rightTopRadiusY - top);
        if (rect.rightTopRadiusX === 0 || rect.rightTopRadiusY === 0) {
            rect.rightTopRadiusX = rect.rightTopRadiusY = 0;
        }
        rect.rightBottomRadiusX = Math.max(0, this.rightBottomRadiusX - right);
        rect.rightBottomRadiusY = Math.max(0, this.rightBottomRadiusY - bottom);
        if (rect.rightBottomRadiusX === 0 || rect.rightBottomRadiusY === 0) {
            rect.rightBottomRadiusX = rect.rightBottomRadiusY = 0;
        }
        rect.leftBottomRadiusX = Math.max(0, this.leftBottomRadiusX - left);
        rect.leftBottomRadiusY = Math.max(0, this.leftBottomRadiusY - bottom);
        if (rect.leftBottomRadiusX === 0 || rect.leftBottomRadiusY === 0) {
            rect.leftBottomRadiusX = rect.leftBottomRadiusY = 0;
        }
        return rect;
    };
    RoundRect.prototype.makePath = function (ctx, newPath, clockwise) {
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2 + 1;
        var y2 = this.y2 + 1;
        if (clockwise) {
            if (newPath) {
                ctx.moveTo(x1, y1 + this.leftTopRadiusY);
            }
            else {
                ctx.lineTo(x1, y1 + this.leftTopRadiusY);
            }
            this.arcTo(x1, y1 + this.leftTopRadiusY, x1 + this.leftTopRadiusX, y1, clockwise, ctx);
            this.arcTo(x2 - this.rightTopRadiusX, y1, x2, y1 + this.rightTopRadiusY, clockwise, ctx);
            this.arcTo(x2, y2 - this.rightBottomRadiusY, x2 - this.rightBottomRadiusX, y2, clockwise, ctx);
            this.arcTo(x1 + this.leftBottomRadiusX, y2, x1, y2 - this.leftBottomRadiusY, clockwise, ctx);
            if (this.leftTopRadiusX !== 0 && this.leftTopRadiusY !== 0) {
                ctx.lineTo(x1, y1 + this.leftTopRadiusY);
            }
            else {
                ctx.lineTo(x1, y1);
            }
        }
        else {
            if (newPath) {
                ctx.moveTo(x1, y1 + this.leftTopRadiusY);
            }
            else {
                ctx.lineTo(x1, y1 + this.leftTopRadiusY);
            }
            this.arcTo(x1, y2 - this.leftBottomRadiusY, x1 + this.leftBottomRadiusX, y2, clockwise, ctx);
            this.arcTo(x2 - this.rightBottomRadiusX, y2, x2, y2 - this.rightBottomRadiusY, clockwise, ctx);
            this.arcTo(x2, y1 + this.rightTopRadiusY, x2 - this.rightTopRadiusX, y1, clockwise, ctx);
            this.arcTo(x1 + this.leftTopRadiusX, y1, x1, y1 + this.leftTopRadiusY, clockwise, ctx);
        }
    };
    RoundRect.prototype.clip = function (ctx) {
        ctx.beginPath();
        this.makePath(ctx, true, true);
        ctx.closePath();
        ctx.clip();
        return this;
    };
    RoundRect.prototype.arcTo = function (x1, y1, x2, y2, clockwise, ctx) {
        ctx.lineTo(x1, y1);
        var dx = Math.abs(x1 - x2);
        var dy = Math.abs(y1 - y2);
        var min = 0.000001;
        if (dx < min && dy < min) {
            return;
        }
        else if (dx < min || dy < min) {
            ctx.lineTo(x2, y2);
        }
        else {
            var startAngle = void 0;
            var cx = void 0;
            var cy = void 0;
            if (clockwise) {
                if (x1 < x2 && y1 < y2) {
                    startAngle = -Math.PI / 2;
                    cx = x1;
                    cy = y2;
                }
                else if (x1 > x2 && y1 < y2) {
                    startAngle = 0;
                    cx = x2;
                    cy = y1;
                }
                else if (x1 > x2 && y1 > y2) {
                    startAngle = Math.PI / 2;
                    cx = x1;
                    cy = y2;
                }
                else {
                    startAngle = Math.PI;
                    cx = x2;
                    cy = y1;
                }
            }
            else {
                if (x1 < x2 && y1 < y2) {
                    startAngle = Math.PI;
                    cx = x2;
                    cy = y1;
                }
                else if (x1 > x2 && y1 < y2) {
                    startAngle = -Math.PI / 2;
                    cx = x1;
                    cy = y2;
                }
                else if (x1 > x2 && y1 > y2) {
                    startAngle = 0;
                    cx = x2;
                    cy = y1;
                }
                else {
                    startAngle = Math.PI / 2;
                    cx = x1;
                    cy = y2;
                }
            }
            ctx.ellipse(cx, cy, dx, dy, 0, startAngle, startAngle + (clockwise ? Math.PI / 2 : -Math.PI / 2), !clockwise);
        }
    };
    return RoundRect;
}());
exports.RoundRect = RoundRect;


/***/ }),

/***/ "./src/base/index.ts":
/*!***************************!*\
  !*** ./src/base/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./BaseValue */ "./src/base/BaseValue.ts"));
__export(__webpack_require__(/*! ./Color */ "./src/base/Color.ts"));
__export(__webpack_require__(/*! ./Event */ "./src/base/Event.ts"));
__export(__webpack_require__(/*! ./Matrix2D */ "./src/base/Matrix2D.ts"));
__export(__webpack_require__(/*! ./Point */ "./src/base/Point.ts"));
__export(__webpack_require__(/*! ./Rect */ "./src/base/Rect.ts"));
__export(__webpack_require__(/*! ./RoundRect */ "./src/base/RoundRect.ts"));


/***/ }),

/***/ "./src/components/Apng.ts":
/*!********************************!*\
  !*** ./src/components/Apng.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlParser_1 = __webpack_require__(/*! ../parser/HtmlParser */ "./src/parser/HtmlParser.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ../resource/ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var Sprite_1 = __webpack_require__(/*! ./Sprite */ "./src/components/Sprite.ts");
var Apng = (function (_super) {
    __extends(Apng, _super);
    function Apng(options) {
        var _this = _super.call(this, options) || this;
        if (options && options.attributes) {
            if (options.attributes.src) {
                ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(options.attributes.src, ResourceRegistry_1.ResourceType.APNG)
                    .then(function (opt) {
                    _this.setSpriteSheet(opt).play();
                })
                    .catch(function (e) {
                    console.warn('failed to load:' + options.attributes.src, e);
                });
            }
        }
        return _this;
    }
    return Apng;
}(Sprite_1.Sprite));
exports.Apng = Apng;
HtmlParser_1.HtmlParser.registerTag('apng', Apng);


/***/ }),

/***/ "./src/components/BitmapText.ts":
/*!**************************************!*\
  !*** ./src/components/BitmapText.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rect_1 = __webpack_require__(/*! ../base/Rect */ "./src/base/Rect.ts");
var HtmlParser_1 = __webpack_require__(/*! ../parser/HtmlParser */ "./src/parser/HtmlParser.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ../resource/ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var Style_1 = __webpack_require__(/*! ../style/Style */ "./src/style/Style.ts");
var DrawUtils_1 = __webpack_require__(/*! ../utils/DrawUtils */ "./src/utils/DrawUtils.ts");
var XObject_1 = __webpack_require__(/*! ./XObject */ "./src/components/XObject.ts");
var BitmapText = (function (_super) {
    __extends(BitmapText, _super);
    function BitmapText(options) {
        var _this = _super.call(this, options) || this;
        _this.text = '';
        if (options) {
            _this.text = options.text || '';
            if (options.attributes && options.attributes.src) {
                ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(options.attributes.src, ResourceRegistry_1.ResourceType.JSON).then(function (json) {
                    _this.setBitmapTextSheet(json);
                });
            }
        }
        return _this;
    }
    BitmapText.prototype.setBitmapTextSheet = function (bitmapTextSheet) {
        var _this = this;
        this.bitmapTextSheet = bitmapTextSheet;
        if (this.bitmapTextSheet) {
            if (this.bitmapTextSheet.url) {
                ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(this.bitmapTextSheet.url, ResourceRegistry_1.ResourceType.IMAGE).then(function () {
                    _this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, _this));
                });
            }
            for (var text in this.bitmapTextSheet.texts) {
                var frame = this.bitmapTextSheet.texts[text];
                if (frame.url) {
                    ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(frame.url, ResourceRegistry_1.ResourceType.IMAGE).then(function () {
                        _this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, _this));
                    });
                }
            }
        }
    };
    BitmapText.prototype.setText = function (text) {
        if (this.text !== text) {
            this.text = text;
            this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
        }
    };
    BitmapText.prototype.getText = function () {
        return this.text;
    };
    BitmapText.prototype.drawContent = function (ctx) {
        if (this.text === '' ||
            !this.bitmapTextSheet ||
            this.rect.width <= 0 ||
            this.rect.height <= 0) {
            return;
        }
        var contentRect = this.getContentRect();
        var lines = this.text.split('\n');
        ctx.save();
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var height = this.bitmapTextSheet.height || 0;
            var w = 0;
            for (var _a = 0, line_1 = line; _a < line_1.length; _a++) {
                var ch = line_1[_a];
                var text = this.bitmapTextSheet.texts[ch];
                if (text) {
                    var size = DrawUtils_1.DrawUtils.getFrameSize(text, this.bitmapTextSheet);
                    w += size.width + (this.bitmapTextSheet.gapX || 0);
                }
            }
            var x = contentRect.x;
            switch (this.style.textAlign) {
                case Style_1.TextAlign.CENTER:
                    x += Math.max(0, (contentRect.width - w) / 2);
                    break;
                case Style_1.TextAlign.RIGHT:
                    x += contentRect.width - w;
            }
            var y = contentRect.y;
            for (var _b = 0, line_2 = line; _b < line_2.length; _b++) {
                var ch = line_2[_b];
                var text = this.bitmapTextSheet.texts[ch];
                if (text) {
                    var size = DrawUtils_1.DrawUtils.getFrameSize(text, this.bitmapTextSheet);
                    var rect = new Rect_1.Rect(x, y, size.width, size.height);
                    DrawUtils_1.DrawUtils.drawFrame(ctx, rect, text, this.bitmapTextSheet);
                    x += rect.width + (this.bitmapTextSheet.gapX || 0);
                    height = Math.max(height, size.height);
                }
            }
            y += height + (this.bitmapTextSheet.gapY || 0);
        }
        ctx.restore();
        return true;
    };
    BitmapText.prototype.layout = function () {
        _super.prototype.layout.call(this);
        if (this.bitmapTextSheet) {
            var lines = this.text.split('\n');
            var contentRect = this.getContentRect();
            var maxWidth = 0;
            var maxHeight = 0;
            for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
                var line = lines_2[_i];
                var width = 0;
                var height = this.bitmapTextSheet.height || 0;
                for (var _a = 0, line_3 = line; _a < line_3.length; _a++) {
                    var ch = line_3[_a];
                    var text = this.bitmapTextSheet.texts[ch];
                    var size = DrawUtils_1.DrawUtils.getFrameSize(text, this.bitmapTextSheet);
                    if (width > 0 && !isNaN(this.bitmapTextSheet.gapX))
                        width += this.bitmapTextSheet.gapX;
                    width += size.width;
                    height = Math.max(height, size.height);
                }
                if (maxHeight > 0 && !isNaN(this.bitmapTextSheet.gapY)) {
                    maxHeight += this.bitmapTextSheet.gapY;
                }
                maxHeight += height;
                maxWidth = Math.max(maxWidth, width);
            }
            if (maxWidth > contentRect.width) {
                this.rect.width += maxWidth - contentRect.width;
            }
            if (maxHeight > contentRect.height) {
                this.rect.height += maxHeight - contentRect.height;
            }
        }
    };
    return BitmapText;
}(XObject_1.XObject));
exports.BitmapText = BitmapText;
HtmlParser_1.HtmlParser.registerTag('bitmaptext', BitmapText);


/***/ }),

/***/ "./src/components/Container.ts":
/*!*************************************!*\
  !*** ./src/components/Container.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlParser_1 = __webpack_require__(/*! ../parser/HtmlParser */ "./src/parser/HtmlParser.ts");
var Style_1 = __webpack_require__(/*! ../style/Style */ "./src/style/Style.ts");
var LayoutUtils_1 = __webpack_require__(/*! ../utils/LayoutUtils */ "./src/utils/LayoutUtils.ts");
var XObject_1 = __webpack_require__(/*! ./XObject */ "./src/components/XObject.ts");
var Container = (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    Container.prototype.findById = function (id) {
        if (this.id === id) {
            return this;
        }
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.id === id) {
                return child;
            }
            if (child instanceof Container) {
                var find = child.findById(id);
                if (find) {
                    return find;
                }
            }
        }
        return undefined;
    };
    Container.prototype.drawContent = function (ctx) {
        var list = this.children.slice();
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var child = list_1[_i];
            if (!child.isVisible()) {
                continue;
            }
            ctx.save();
            child.updateContext(ctx);
            child.draw(ctx);
            ctx.restore();
        }
    };
    Container.prototype.addChild = function (child) {
        var parent = child.parent;
        if (parent === this) {
            if (this.children.length > 0 && this.children[this.children.length - 1] === child) {
                return this;
            }
            var idx = this.children.indexOf(child);
            this.children.splice(idx, 1);
            this.children.push(child);
            child.dispatchEvent(new XObject_1.XObjectEvent('moved', false, true, child));
            this.dispatchEvent(new XObject_1.XObjectEvent('update', false, true, this));
            return this;
        }
        else {
            if (parent) {
                parent.removeChild(child);
            }
            child.parent = this;
            this.children.push(child);
            child.dispatchEvent(new XObject_1.XObjectEvent('added', false, true, child));
            this.dispatchEvent(new XObject_1.XObjectEvent('update', false, true, this));
            return this;
        }
    };
    Container.prototype.addChildren = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
            var child = children_1[_a];
            this.addChild(child);
        }
        return this;
    };
    Container.prototype.addChildAt = function (child, index) {
        var parent = child.parent;
        if (parent === this) {
            if (this.children[index] === child) {
                return this;
            }
            var current = this.children.indexOf(child);
            if (current > index) {
                this.children.splice(current, 1);
                this.children.splice(index, 0, child);
            }
            else {
                this.children.splice(index, 0, child);
                this.children.splice(current, 1);
            }
            child.dispatchEvent(new XObject_1.XObjectEvent('moved', false, true, child));
            this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
            return this;
        }
        else {
            if (parent) {
                parent.removeChild(child);
            }
            child.parent = this;
            this.children.splice(index, 0, child);
            child.dispatchEvent(new XObject_1.XObjectEvent('added', false, true, child));
            this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
            return this;
        }
    };
    Container.prototype.removeChild = function (child) {
        var idx = this.children.indexOf(child);
        if (idx < 0) {
            return undefined;
        }
        else {
            this.children.splice(idx, 1);
            child.parent = undefined;
            child.dispatchEvent(new XObject_1.XObjectEvent('removed', false, true, child));
            this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
            return child;
        }
    };
    Container.prototype.removeChildAt = function (index) {
        if (index < 0 || index >= this.children.length) {
            return null;
        }
        var child = this.children[index];
        this.children.splice(index, 1);
        child.dispatchEvent(new XObject_1.XObjectEvent('removed', false, true, child));
        this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
        return child;
    };
    Container.prototype.removeAllChildren = function () {
        if (this.children.length === 0) {
            return this;
        }
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.dispatchEvent(new XObject_1.XObjectEvent('removed', false, true, child));
        }
        this.children.length = 0;
        this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
        return this;
    };
    Container.prototype.getChildAt = function (index) {
        return this.children[index];
    };
    Container.prototype.sortChildren = function (sortFunction) {
        this.children.sort(sortFunction);
        this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
        return this;
    };
    Container.prototype.getChildIndex = function (child) {
        return this.children.indexOf(child);
    };
    Container.prototype.swapChildrenAt = function (index1, index2) {
        if (index1 < 0 || index1 >= this.children.length) {
            throw new Error('invalid index:' + index1);
        }
        if (index2 < 0 || index2 >= this.children.length) {
            throw new Error('invalid index:' + index2);
        }
        if (index1 === index2) {
            return this;
        }
        var o1 = this.children[index1];
        var o2 = this.children[index2];
        this.children[index1] = o2;
        this.children[index2] = o1;
        o1.dispatchEvent(new XObject_1.XObjectEvent('moved', false, true, o1));
        o2.dispatchEvent(new XObject_1.XObjectEvent('moved', false, true, o2));
        this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
        return this;
    };
    Container.prototype.swapChildren = function (child1, child2) {
        return this.swapChildrenAt(this.getChildIndex(child1), this.getChildIndex(child2));
    };
    Container.prototype.layout = function () {
        this.calculateSize();
        this.layoutChildren();
    };
    Container.prototype.layoutChildren = function () {
        var absolutes = [];
        var relatives = [];
        var contentRect = this.getContentRect();
        var contentWidth = contentRect.width;
        var contentHeight = contentRect.height;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (!child.isVisible()) {
                continue;
            }
            child.layout();
            if (child.style.position === Style_1.Position.ABSOLUTE || child.style.position === Style_1.Position.FIXED) {
                absolutes.push(child);
            }
            else {
                relatives.push(child);
                contentWidth = Math.max(contentWidth, child.getOuterWidth());
                contentHeight = Math.max(contentHeight, child.getOuterHeight());
            }
        }
        var lineHeight = this.getLineHeight();
        var lines = [];
        var line = {
            width: 0,
            height: lineHeight,
            children: []
        };
        for (var _b = 0, relatives_1 = relatives; _b < relatives_1.length; _b++) {
            var child = relatives_1[_b];
            if ((line.children.length > 0 && child.style.display === Style_1.Display.BLOCK) ||
                line.width + child.getOuterWidth() > contentWidth) {
                lines.push(line);
                line = {
                    width: 0,
                    height: lineHeight,
                    children: []
                };
            }
            line.children.push(child);
            line.width += child.getOuterWidth();
            line.height = Math.max(child.getOuterHeight(), line.height);
        }
        if (line.children.length > 0) {
            lines.push(line);
        }
        var x = contentRect.x;
        var y = contentRect.y;
        for (var _c = 0, lines_1 = lines; _c < lines_1.length; _c++) {
            var l = lines_1[_c];
            switch (this.style.textAlign) {
                case Style_1.TextAlign.RIGHT:
                    x = contentRect.x + contentWidth - l.width;
                    break;
                case Style_1.TextAlign.CENTER:
                    x = contentRect.x + (contentWidth - l.width) / 2;
                    break;
                default:
                    x = contentRect.x;
            }
            for (var _d = 0, _e = l.children; _d < _e.length; _d++) {
                var child = _e[_d];
                child.rect.x =
                    x + (child.style.marginLeft ? child.style.marginLeft.getValue(this.rect.width) : 0);
                x += child.getOuterWidth();
                switch (child.style.verticalAlign) {
                    case Style_1.VerticalAlign.BOTTOM:
                        child.rect.y =
                            y +
                                l.height -
                                (child.style.marginBottom ? child.style.marginBottom.getValue(this.rect.height) : 0) -
                                child.getHeight();
                        break;
                    case Style_1.VerticalAlign.MIDDLE:
                        child.rect.y =
                            y +
                                (l.height - child.getOuterHeight()) / 2 +
                                (child.style.marginTop ? child.style.marginTop.getValue(this.rect.height) : 0);
                        break;
                    default:
                        child.rect.y =
                            y + (child.style.marginTop ? child.style.marginTop.getValue(this.rect.height) : 0);
                }
            }
            y += l.height;
        }
        contentHeight = Math.max(contentHeight, y - contentRect.y);
        if (!this.style.width && contentWidth > contentRect.width) {
            this.rect.width += contentWidth - contentRect.width;
        }
        if (!this.style.height && contentHeight > contentRect.height) {
            this.rect.height += contentHeight - contentRect.height;
        }
        if (this.parent) {
            var parentWidth = this.parent.getContentWidth();
            var parentHeight = this.parent.getContentWidth();
            if (this.style.minWidth) {
                var minWidth = this.style.minWidth.getValue(parentWidth);
                var cw = this.getContentWidth();
                if (this.style.boxSizing === Style_1.BoxSizing.BORDER_BOX) {
                    minWidth -= this.rect.width - cw;
                }
                if (cw < minWidth) {
                    this.rect.width += minWidth - cw;
                }
            }
            if (this.style.maxWidth) {
                var maxWidth = this.style.maxWidth.getValue(parentWidth);
                var cw = this.getContentWidth();
                if (this.style.boxSizing === Style_1.BoxSizing.BORDER_BOX) {
                    maxWidth -= this.rect.width - cw;
                }
                if (cw > maxWidth) {
                    this.rect.width -= cw - maxWidth;
                }
            }
            if (this.style.minHeight) {
                var minHeight = this.style.minHeight.getValue(parentHeight);
                var ch = this.getContentHeight();
                if (this.style.boxSizing === Style_1.BoxSizing.BORDER_BOX) {
                    minHeight -= this.rect.height - ch;
                }
                if (ch < minHeight) {
                    this.rect.width += minHeight - ch;
                }
            }
            if (this.style.maxHeight) {
                var maxHeight = this.style.maxHeight.getValue(parentHeight);
                var ch = this.getContentHeight();
                if (this.style.boxSizing === Style_1.BoxSizing.BORDER_BOX) {
                    maxHeight -= this.rect.height - ch;
                }
                if (ch > maxHeight) {
                    this.rect.width -= maxHeight - ch;
                }
            }
        }
        for (var _f = 0, absolutes_1 = absolutes; _f < absolutes_1.length; _f++) {
            var child = absolutes_1[_f];
            LayoutUtils_1.LayoutUtils.updatePositionForAbsoluteElement(child, this.rect.width, this.rect.height);
        }
    };
    Container.prototype.getObjectUnderPoint = function (x, y, eventEnabled) {
        if (!this.isVisible()) {
            return undefined;
        }
        if (eventEnabled) {
            switch (this.style.pointerEvents) {
                case Style_1.PointerEvents.NONE:
                    return undefined;
                case Style_1.PointerEvents.BLOCK:
                    return this.hitTest(x, y) ? this : undefined;
            }
            var children = this.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (!child.isVisible()) {
                    continue;
                }
                var pt = this.localToLocal(x, y, child);
                if (child instanceof Container) {
                    var result = child.getObjectUnderPoint(pt.x, pt.y, eventEnabled);
                    if (result) {
                        return result;
                    }
                }
                else {
                    if (child.style.pointerEvents !== Style_1.PointerEvents.NONE &&
                        child.style.pointerEvents !== Style_1.PointerEvents.CROSS &&
                        child.hitTest(pt.x, pt.y)) {
                        return child;
                    }
                }
            }
            if (this.style.pointerEvents !== Style_1.PointerEvents.CROSS && this.hitTest(x, y)) {
                return this;
            }
            return undefined;
        }
        else {
            var children = this.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (!child.isVisible()) {
                    continue;
                }
                var pt = this.localToLocal(x, y, child);
                if (child instanceof Container) {
                    var result = child.getObjectUnderPoint(pt.x, pt.y, eventEnabled);
                    if (result) {
                        return result;
                    }
                }
                else if (child.hitTest(pt.x, pt.y)) {
                    return child;
                }
                if (this.hitTest(x, y)) {
                    return this;
                }
                return undefined;
            }
        }
    };
    Container.prototype.load = function (html, clear) {
        if (clear === void 0) { clear = true; }
        if (clear) {
            this.removeAllChildren();
        }
        this.addChildren.apply(this, new HtmlParser_1.HtmlParser().parse(html));
        return this;
    };
    Container.prototype.toString = function () {
        return "[Container (id=" + this.id + ")]";
    };
    return Container;
}(XObject_1.IContainer));
exports.Container = Container;
HtmlParser_1.HtmlParser.registerTag('container', Container);
HtmlParser_1.HtmlParser.registerTag('div', Container);


/***/ }),

/***/ "./src/components/Img.ts":
/*!*******************************!*\
  !*** ./src/components/Img.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rect_1 = __webpack_require__(/*! ../base/Rect */ "./src/base/Rect.ts");
var HtmlParser_1 = __webpack_require__(/*! ../parser/HtmlParser */ "./src/parser/HtmlParser.ts");
var ImageClip_1 = __webpack_require__(/*! ../resource/ImageClip */ "./src/resource/ImageClip.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ../resource/ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var XObject_1 = __webpack_require__(/*! ./XObject */ "./src/components/XObject.ts");
var Img = (function (_super) {
    __extends(Img, _super);
    function Img(options) {
        var _this = _super.call(this, options) || this;
        if (options && options.attributes) {
            if (options.attributes.src) {
                _this.setSrc(options.attributes.src);
            }
            if (options.attributes.sourcerect) {
                _this.setSourceRect(Rect_1.Rect.of(options.attributes.sourcerect));
            }
        }
        if (!_this.imageClip) {
            _this.imageClip = ImageClip_1.ImageClip.of('');
        }
        return _this;
    }
    Img.prototype.setSrc = function (src) {
        var _this = this;
        this.imageClip = ImageClip_1.ImageClip.of(src);
        ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(this.imageClip.getSrc(), ResourceRegistry_1.ResourceType.IMAGE).then(function (image) {
            _this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, _this));
        });
        return this;
    };
    Img.prototype.setImage = function (image) {
        this.imageClip.setImage(image);
        return this;
    };
    Img.prototype.setSourceRect = function (sourceRect) {
        this.imageClip.setRect(sourceRect);
        return this;
    };
    Img.prototype.calculateSize = function () {
        _super.prototype.calculateSize.call(this);
        if (!this.style.width) {
            this.rect.width = this.imageClip.getWidth();
        }
        if (!this.style.height) {
            this.rect.height = this.imageClip.getHeight();
        }
    };
    Img.prototype.drawContent = function (ctx) {
        this.imageClip.draw(ctx, this.getContentRect());
    };
    return Img;
}(XObject_1.XObject));
exports.Img = Img;
HtmlParser_1.HtmlParser.registerTag('img', Img);
HtmlParser_1.HtmlParser.registerTag('image', Img);


/***/ }),

/***/ "./src/components/Scrollable.ts":
/*!**************************************!*\
  !*** ./src/components/Scrollable.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rect_1 = __webpack_require__(/*! ../base/Rect */ "./src/base/Rect.ts");
var HtmlParser_1 = __webpack_require__(/*! ../parser/HtmlParser */ "./src/parser/HtmlParser.ts");
var Container_1 = __webpack_require__(/*! ./Container */ "./src/components/Container.ts");
var XObject_1 = __webpack_require__(/*! ./XObject */ "./src/components/XObject.ts");
var Scrollable = (function (_super) {
    __extends(Scrollable, _super);
    function Scrollable(opt) {
        var _this = _super.call(this, opt) || this;
        _this.viewRect = new Rect_1.Rect(0, 0, 0, 0);
        _this.verticalSnappingSize = 0;
        _this.horizontalSnappingSize = 200;
        _this.on('pressmove', function (e) {
            _this.scroll(e.touchItem.getDelta());
            e.stage.updateOnce();
        });
        _this.on('mousewheel', function (e) {
            var delta = e.touchItem.getDelta();
            delta.x = -delta.x;
            delta.y = -delta.y;
            _this.scroll(delta, false);
            e.stage.updateOnce();
        });
        _this.on('pressup', function (e) {
            if (e.stage.getPressedTouchItems(_this).length === 0) {
                _this.onRelease(e.stage);
                e.stage.updateOnce();
            }
        });
        return _this;
    }
    Scrollable.prototype.getDefaultStyle = function () {
        return {
            overflow: 'hidden'
        };
    };
    Scrollable.prototype.fixPosition = function (val, min, max) {
        if (val > max) {
            return max;
        }
        else if (val < min) {
            return min;
        }
        else {
            return val;
        }
    };
    Scrollable.prototype.scroll = function (delta, enableSnapping) {
        if (enableSnapping === void 0) { enableSnapping = true; }
        this.viewRect.x = this.fixPosition(this.viewRect.x + delta.x, Math.min(0, this.getContentWidth() - this.viewRect.width) -
            (enableSnapping ? this.horizontalSnappingSize : 0), enableSnapping ? this.horizontalSnappingSize : 0);
        this.viewRect.y = this.fixPosition(this.viewRect.y + delta.y, Math.min(0, this.getContentHeight() - this.viewRect.height) -
            (enableSnapping ? this.verticalSnappingSize : 0), enableSnapping ? this.verticalSnappingSize : 0);
    };
    Scrollable.prototype.onRelease = function (stage) {
        var _this = this;
        var back = {
            x: this.fixPosition(this.viewRect.x, Math.min(0, this.getContentWidth() - this.viewRect.width), 0),
            y: this.fixPosition(this.viewRect.y, Math.min(0, this.getContentHeight() - this.viewRect.height), 0)
        };
        if (back.x === this.viewRect.x && back.y === this.viewRect.y) {
            return;
        }
        stage
            .animate({ x: this.viewRect.x, y: this.viewRect.y }, true)
            .to(back, 200, 'quadIn')
            .on('update', function (e) {
            if (back.x !== undefined) {
                _this.viewRect.x = e.value.x;
            }
            if (back.y !== undefined) {
                _this.viewRect.y = e.value.y;
            }
            _this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, _this));
        });
    };
    Scrollable.prototype.layoutChildren = function () {
        _super.prototype.layoutChildren.call(this);
        this.viewRect.width = 0;
        this.viewRect.height = 0;
        var paddingRect = this.getPaddingRect();
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.viewRect.width = Math.max(this.viewRect.width, child.rect.x + child.getOuterWidth() - paddingRect.x);
            this.viewRect.height = Math.max(this.viewRect.height, child.rect.y + child.getOuterHeight() - paddingRect.y);
            child.rect.x += this.viewRect.x;
            child.rect.y += this.viewRect.y;
        }
    };
    return Scrollable;
}(Container_1.Container));
exports.Scrollable = Scrollable;
HtmlParser_1.HtmlParser.registerTag('scrollable', Scrollable);


/***/ }),

/***/ "./src/components/Sprite.ts":
/*!**********************************!*\
  !*** ./src/components/Sprite.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Animation_1 = __webpack_require__(/*! ../animation/Animation */ "./src/animation/Animation.ts");
var HtmlParser_1 = __webpack_require__(/*! ../parser/HtmlParser */ "./src/parser/HtmlParser.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ../resource/ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var DrawUtils_1 = __webpack_require__(/*! ../utils/DrawUtils */ "./src/utils/DrawUtils.ts");
var Stage_1 = __webpack_require__(/*! ./Stage */ "./src/components/Stage.ts");
var XObject_1 = __webpack_require__(/*! ./XObject */ "./src/components/XObject.ts");
var SpriteAnimationStep = (function (_super) {
    __extends(SpriteAnimationStep, _super);
    function SpriteAnimationStep(sprite) {
        var _this = _super.call(this, sprite, (sprite.spriteSheet.frames.length * 1000) / sprite.spriteSheet.fps) || this;
        _this.sprite = sprite;
        return _this;
    }
    SpriteAnimationStep.prototype.onUpdate = function (percent) {
        if (!this.sprite.spriteSheet || this.sprite.spriteSheet.frames.length === 0) {
            return undefined;
        }
        var index = Math.min(this.sprite.spriteSheet.frames.length - 1, Math.floor(this.sprite.spriteSheet.frames.length * percent));
        if (index === this.sprite.currentFrame) {
            return undefined;
        }
        else {
            this.sprite.currentFrame = index;
            this.sprite.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this.sprite));
            return {
                currentFrame: index
            };
        }
    };
    return SpriteAnimationStep;
}(Animation_1.AnimationStep));
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(options) {
        var _this = _super.call(this, options) || this;
        _this.currentFrame = 0;
        if (options) {
            if (options.attributes && options.attributes.src) {
                ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(options.attributes.src, ResourceRegistry_1.ResourceType.JSON).then(function (json) {
                    _this.setSpriteSheet(json);
                    _this.dispatchEvent(new XObject_1.XObjectEvent('load', false, true, _this));
                });
            }
        }
        return _this;
    }
    Sprite.prototype.setSpriteSheet = function (spriteSheet) {
        var _this = this;
        this.spriteSheet = spriteSheet;
        if (this.spriteSheet) {
            if (this.spriteSheet.url) {
                ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(this.spriteSheet.url, ResourceRegistry_1.ResourceType.IMAGE);
            }
            for (var _i = 0, _a = this.spriteSheet.frames; _i < _a.length; _i++) {
                var frame = _a[_i];
                if (frame.url) {
                    ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(frame.url, ResourceRegistry_1.ResourceType.IMAGE).then(function () {
                        _this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, _this));
                    });
                }
            }
        }
        this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
        return this;
    };
    Sprite.prototype.getStage = function () {
        var element = this;
        while (element) {
            if (element instanceof Stage_1.Stage) {
                return element;
            }
            element = element.parent;
        }
        return undefined;
    };
    Sprite.prototype.play = function (times) {
        var _this = this;
        if (times === void 0) { times = -1; }
        if (this.animation) {
            this.animation.cancel();
            this.animation = undefined;
        }
        var stage = this.getStage();
        if (stage) {
            this.animation = stage
                .animate(this)
                .addStep(new SpriteAnimationStep(this))
                .times(times);
            this.animation.addEventListener('complete', function () {
                return _this.dispatchEvent(new XObject_1.XObjectEvent('stop', false, true, _this));
            });
            this.dispatchEvent(new XObject_1.XObjectEvent('play', false, true, this));
        }
        return this;
    };
    Sprite.prototype.pause = function () {
        if (this.animation && this.animation.pause()) {
            this.dispatchEvent(new XObject_1.XObjectEvent('pause', false, true, this));
        }
        return this;
    };
    Sprite.prototype.resume = function () {
        if (this.animation && this.animation.resume()) {
            this.dispatchEvent(new XObject_1.XObjectEvent('resume', false, true, this));
        }
        return this;
    };
    Sprite.prototype.stop = function () {
        if (this.animation) {
            this.animation.cancel();
            this.animation = undefined;
        }
        return this;
    };
    Sprite.prototype.times = function (times) {
        return this.play(times);
    };
    Sprite.prototype.setCurrentFrame = function (currentFrame) {
        this.currentFrame = currentFrame;
        return this;
    };
    Sprite.prototype.toNextFrame = function () {
        this.currentFrame = (this.currentFrame + 1) % this.spriteSheet.frames.length;
        return this;
    };
    Sprite.prototype.toPreviousFrame = function () {
        this.currentFrame =
            (this.currentFrame - 1 + this.spriteSheet.frames.length) % this.spriteSheet.frames.length;
        return this;
    };
    Sprite.prototype.drawContent = function (ctx) {
        if (!this.spriteSheet || this.spriteSheet.frames.length === 0) {
            return;
        }
        var frame = this.spriteSheet.frames[this.currentFrame];
        DrawUtils_1.DrawUtils.drawFrame(ctx, this.getContentRect(), frame, this.spriteSheet);
    };
    return Sprite;
}(XObject_1.XObject));
exports.Sprite = Sprite;
HtmlParser_1.HtmlParser.registerTag('sprite', Sprite);


/***/ }),

/***/ "./src/components/Stage.ts":
/*!*********************************!*\
  !*** ./src/components/Stage.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationFactory_1 = __webpack_require__(/*! ../animation/AnimationFactory */ "./src/animation/AnimationFactory.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ../resource/ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var Runtime_1 = __webpack_require__(/*! ../runtime/Runtime */ "./src/runtime/Runtime.ts");
var Ticker_1 = __webpack_require__(/*! ../Ticker */ "./src/Ticker.ts");
var LatestList_1 = __webpack_require__(/*! ../utils/LatestList */ "./src/utils/LatestList.ts");
var LayoutUtils_1 = __webpack_require__(/*! ../utils/LayoutUtils */ "./src/utils/LayoutUtils.ts");
var Container_1 = __webpack_require__(/*! ./Container */ "./src/components/Container.ts");
var TouchItem_1 = __webpack_require__(/*! ./TouchItem */ "./src/components/TouchItem.ts");
var XObject_1 = __webpack_require__(/*! ./XObject */ "./src/components/XObject.ts");
var StageLayoutPolicy;
(function (StageLayoutPolicy) {
    StageLayoutPolicy["NEVER"] = "never";
    StageLayoutPolicy["ALWAYS"] = "always";
})(StageLayoutPolicy = exports.StageLayoutPolicy || (exports.StageLayoutPolicy = {}));
var StageUpdatePolicy;
(function (StageUpdatePolicy) {
    StageUpdatePolicy["NEVER"] = "never";
    StageUpdatePolicy["AUTO"] = "auto";
    StageUpdatePolicy["ALWAYS"] = "always";
})(StageUpdatePolicy = exports.StageUpdatePolicy || (exports.StageUpdatePolicy = {}));
var TouchedObjectSet = (function () {
    function TouchedObjectSet() {
        this.touchItems = [];
    }
    TouchedObjectSet.prototype.contains = function (identifier) {
        for (var _i = 0, _a = this.touchItems; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.identifier === identifier) {
                return true;
            }
        }
        return false;
    };
    TouchedObjectSet.prototype.get = function (identifier) {
        for (var _i = 0, _a = this.touchItems; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.identifier === identifier) {
                return item;
            }
        }
        return undefined;
    };
    TouchedObjectSet.prototype.add = function (touch) {
        this.touchItems.push(touch);
    };
    TouchedObjectSet.prototype.remove = function (identifier) {
        for (var i = 0; i < this.touchItems.length; ++i) {
            if (this.touchItems[i].identifier === identifier) {
                this.touchItems.splice(i, 1);
                return;
            }
        }
    };
    TouchedObjectSet.prototype.getTouches = function (object) {
        var result = [];
        for (var _i = 0, _a = this.touchItems; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.srcElement === object || item.srcElement.isChildOf(object)) {
                result.push(item);
            }
        }
        return result;
    };
    return TouchedObjectSet;
}());
var Stage = (function (_super) {
    __extends(Stage, _super);
    function Stage(canvas, option) {
        if (option === void 0) { option = {}; }
        var _this = _super.call(this) || this;
        _this.option = {
            fps: 60,
            layoutPolicy: StageLayoutPolicy.ALWAYS,
            updatePolicy: StageUpdatePolicy.AUTO,
            autoClear: true
        };
        _this.touchItems = new TouchedObjectSet();
        _this.started = false;
        _this.needUpdate = false;
        _this.eventHandlerInstalled = false;
        _this.eventEnabled = true;
        for (var k in option) {
            _this.option[k] = option[k];
        }
        _this.canvas = canvas;
        _this.css({
            width: '100%',
            height: '100%',
            left: 0,
            top: 0
        });
        if (option.style) {
            _this.css(option.style);
        }
        if (option.recordRenderLatencies) {
            _this.latestRenderLatencies = new LatestList_1.LatestList();
        }
        if (!option.noEventHandler) {
            _this.installEventHandlers();
        }
        _this.ticker = new Ticker_1.Ticker(_this.option.fps);
        _this.animationFactory = new AnimationFactory_1.AnimationFactory();
        _this.resourceRegistry = new ResourceRegistry_1.ResourceRegistry();
        return _this;
    }
    Stage.prototype.updateOnce = function () {
        this.needUpdate = true;
    };
    Stage.prototype.start = function () {
        var _this = this;
        if (!this.started) {
            this.started = true;
            this.layout();
            this.needUpdate = true;
            this.ticker.addEventListener('tick', function (_) {
                _this.animationFactory.onInterval();
                if (_this.option.updatePolicy !== StageUpdatePolicy.NEVER &&
                    (_this.needUpdate || _this.option.updatePolicy === StageUpdatePolicy.ALWAYS)) {
                    _this.update();
                    _this.needUpdate = false;
                }
            });
            ResourceRegistry_1.ResourceRegistry.DefaultInstance.addEventListener('load', function (e) {
                _this.updateOnce();
            });
            this.on('update', function () {
                _this.updateOnce();
            });
        }
    };
    Stage.prototype.installEventHandlers = function () {
        if (!this.eventHandlerInstalled) {
            this.eventHandlerInstalled = true;
            Runtime_1.Runtime.get().enableEvents(this);
        }
    };
    Stage.prototype.enableEvents = function () {
        this.eventEnabled = true;
        return this;
    };
    Stage.prototype.disableEvents = function () {
        this.eventEnabled = false;
        return this;
    };
    Stage.prototype.getPressedTouchItems = function (child) {
        if (!child)
            child = this;
        var touches = this.touchItems.getTouches(child);
        var result = [];
        for (var _i = 0, touches_1 = touches; _i < touches_1.length; _i++) {
            var touch = touches_1[_i];
            if (!touch.pressed)
                continue;
            result.push(touch.clone());
        }
        return result;
    };
    Stage.prototype.handleMouseOrTouchEvent = function (type, touches, e) {
        if (!this.eventEnabled || !this.isVisible()) {
            return;
        }
        switch (type) {
            case 'mousedown':
            case 'touchstart':
                this.handleTouchStartEvent(touches, e);
                break;
            case 'mouseup':
                this.onTouchMove(touches, e);
                this.handleTouchEndEvent([], e);
                break;
            case 'touchend':
            case 'touchcancel':
                this.handleTouchEndEvent(touches, e);
                break;
            case 'mousemove':
            case 'touchmove':
            case 'mouseleave':
                this.onTouchMove(touches, e);
                break;
        }
    };
    Stage.prototype.handleMouseWheelEvent = function (stageX, stageY, deltaX, deltaY, e) {
        var pt = this.globalToLocal(stageX, stageY);
        var element = this.getObjectUnderPoint(pt.x, pt.y, true);
        if (element) {
            var touch = new TouchItem_1.TouchItem(0, element, stageX, stageY, Date.now());
            touch.deltaX = deltaX;
            touch.deltaY = deltaY;
            this.dispatchTouchEvent(element, 'mousewheel', touch, true, true, e);
        }
    };
    Stage.of = function (element) {
        while (element.parent) {
            element = element.parent;
        }
        return element instanceof Stage ? element : undefined;
    };
    Stage.prototype.update = function () {
        if (!this.canvas || !this.isVisible()) {
            return;
        }
        var startTime = Date.now();
        var ctx = this.canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        if (this.option.layoutPolicy === StageLayoutPolicy.ALWAYS) {
            this.layout();
        }
        if (this.option.autoClear) {
            ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
        }
        ctx.save();
        this.updateContext(ctx);
        this.draw(ctx, false);
        ctx.restore();
        if (this.latestRenderLatencies) {
            this.latestRenderLatencies.add(Date.now() - startTime);
        }
    };
    Stage.prototype.calculateSize = function () {
        if (!this.canvas || !this.isVisible()) {
            return;
        }
        var canvasWidth = this.canvas.width || this.canvas.clientWidth;
        var canvasHeight = this.canvas.height || this.canvas.clientHeight;
        LayoutUtils_1.LayoutUtils.updateSize(this, canvasWidth, canvasHeight);
        LayoutUtils_1.LayoutUtils.updatePositionForAbsoluteElement(this, canvasWidth, canvasHeight);
    };
    Stage.prototype.toString = function () {
        return "[Stage (id=" + this.id + ")]";
    };
    Stage.prototype.dispatchTouchEvent = function (element, type, currentTouch, bubble, cancellable, e) {
        var event = new XObject_1.XObjectEvent(type, bubble, cancellable, element, currentTouch);
        event.stage = this;
        event.nativeEvent = e;
        element.dispatchEvent(event);
    };
    Stage.prototype.onTouchMove = function (touches, e) {
        var movedTouches = [];
        var newTouches = [];
        for (var _i = 0, touches_2 = touches; _i < touches_2.length; _i++) {
            var touch = touches_2[_i];
            var item = this.touchItems.get(touch.identifier);
            if (item) {
                if (item.stageX !== touch.stageX || item.stageY !== touch.stageY) {
                    item.onUpdate(touch);
                    movedTouches.push(item);
                }
            }
            else {
                newTouches.push(touch);
            }
        }
        for (var _a = 0, movedTouches_1 = movedTouches; _a < movedTouches_1.length; _a++) {
            var touch = movedTouches_1[_a];
            var pt = this.globalToLocal(touch.stageX, touch.stageY);
            var element = this.getObjectUnderPoint(pt.x, pt.y, true);
            if (element) {
                this.dispatchTouchEvent(element, 'move', touch, true, true, e);
            }
            if (touch.pressed) {
                this.dispatchTouchEvent(touch.srcElement, 'pressmove', touch, true, true, e);
            }
            if (element) {
                if (touch.currentTarget !== element) {
                    var enterElement = element;
                    var leaveElement = touch.currentTarget;
                    touch.currentTarget = element;
                    while (leaveElement) {
                        if (enterElement.isChildOf(leaveElement) || enterElement === leaveElement) {
                            break;
                        }
                        this.dispatchTouchEvent(leaveElement, 'leave', touch, false, true, e);
                        leaveElement = leaveElement.parent;
                    }
                    while (enterElement && enterElement !== leaveElement) {
                        this.dispatchTouchEvent(enterElement, 'enter', touch, false, true, e);
                        enterElement = enterElement.parent;
                    }
                }
            }
            else if (touch.currentTarget) {
                this.dispatchTouchEvent(touch.currentTarget, 'leave', touch, false, true, e);
                touch.currentTarget = undefined;
            }
        }
        for (var _b = 0, newTouches_1 = newTouches; _b < newTouches_1.length; _b++) {
            var touch = newTouches_1[_b];
            var pt = this.globalToLocal(touch.stageX, touch.stageY);
            var element = this.getObjectUnderPoint(pt.x, pt.y, true);
            if (!element) {
                continue;
            }
            var newMove = touch.switchSourceElement(element);
            newMove.pressed = false;
            newMove.currentTarget = element;
            this.touchItems.add(newMove);
            this.dispatchTouchEvent(element, 'move', newMove, true, true, e);
            this.dispatchTouchEvent(element, 'enter', newMove, false, true, e);
        }
    };
    Stage.prototype.handleTouchStartEvent = function (touches, e) {
        var newTouches = new TouchedObjectSet();
        for (var _i = 0, touches_3 = touches; _i < touches_3.length; _i++) {
            var touch = touches_3[_i];
            var existing = this.touchItems.get(touch.identifier);
            if (!existing || !existing.pressed) {
                if (existing) {
                    this.touchItems.remove(existing.identifier);
                }
                var element = this.getObjectUnderPoint(touch.stageX, touch.stageY, true);
                if (element) {
                    var item = touch.switchSourceElement(element);
                    item.currentTarget = element;
                    item.pressed = true;
                    newTouches.add(item);
                    this.touchItems.add(item);
                }
            }
        }
        for (var _a = 0, _b = newTouches.touchItems; _a < _b.length; _a++) {
            var item = _b[_a];
            this.dispatchTouchEvent(item.srcElement, 'touchdown', item, true, true, e);
        }
        this.onTouchMove(touches, e);
    };
    Stage.prototype.handleTouchEndEvent = function (touches, e) {
        this.onTouchMove(touches, e);
        var endedTouches = new TouchedObjectSet();
        for (var _i = 0, _a = this.touchItems.touchItems; _i < _a.length; _i++) {
            var item = _a[_i];
            var exists = false;
            for (var _b = 0, touches_4 = touches; _b < touches_4.length; _b++) {
                var touch = touches_4[_b];
                if (touch.identifier === item.identifier) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                endedTouches.add(item);
            }
        }
        for (var _c = 0, _d = endedTouches.touchItems; _c < _d.length; _c++) {
            var item = _d[_c];
            this.touchItems.remove(item.identifier);
        }
        for (var _e = 0, _f = endedTouches.touchItems; _e < _f.length; _e++) {
            var item = _f[_e];
            if (!item.pressed) {
                continue;
            }
            var element = this.getObjectUnderPoint(item.stageX, item.stageY, true);
            if (element) {
                this.dispatchTouchEvent(element, 'touchup', item, true, true, e);
            }
            this.dispatchTouchEvent(item.srcElement, 'pressup', item, true, true, e);
            if (element === item.srcElement || item.srcElement.isChildOf(element)) {
                this.dispatchTouchEvent(element, 'click', item, true, true, e);
            }
        }
    };
    return Stage;
}(Container_1.Container));
exports.Stage = Stage;


/***/ }),

/***/ "./src/components/Text.ts":
/*!********************************!*\
  !*** ./src/components/Text.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlParser_1 = __webpack_require__(/*! ../parser/HtmlParser */ "./src/parser/HtmlParser.ts");
var Style_1 = __webpack_require__(/*! ../style/Style */ "./src/style/Style.ts");
var XObject_1 = __webpack_require__(/*! ./XObject */ "./src/components/XObject.ts");
var Text = (function (_super) {
    __extends(Text, _super);
    function Text(options) {
        var _this = _super.call(this, options) || this;
        _this.text = '';
        _this.text = (options && options.text) || '';
        return _this;
    }
    Text.prototype.getDefaultStyle = function () {
        return {
            color: 'black',
            fontSize: 26
        };
    };
    Text.prototype.setText = function (text) {
        if (this.text !== text) {
            this.text = text;
            this.dispatchEvent(new XObject_1.XObjectEvent('update', true, true, this));
        }
    };
    Text.prototype.getText = function () {
        return this.text;
    };
    Text.prototype.drawContent = function (ctx) {
        if (this.text === '' || !this.style.font) {
            return;
        }
        var rect = this.getContentRect();
        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.textAlign = this.style.textAlign;
        ctx.fillStyle = this.style.color.toString();
        ctx.font = this.style.font.toString();
        var hasBorder = this.style.textBorder && this.style.textBorder.isEnable();
        if (hasBorder) {
            ctx.strokeStyle = this.style.textBorder.color.toString();
            ctx.lineWidth = this.style.textBorder.width;
        }
        if (this.style.textShadow && this.style.textShadow.isEnable()) {
            ctx.shadowBlur = this.style.textShadow.blur;
            ctx.shadowColor = this.style.textShadow.color.toString();
            ctx.shadowOffsetX = this.style.textShadow.offsetX;
            ctx.shadowOffsetY = this.style.textShadow.offsetY;
        }
        var x;
        if (this.style.textAlign === Style_1.TextAlign.RIGHT) {
            x = rect.x + rect.width;
        }
        else if (this.style.textAlign === Style_1.TextAlign.CENTER) {
            x = rect.x + rect.width / 2;
        }
        else {
            x = rect.x;
        }
        var y = rect.y;
        var lines = this.text.split('\n');
        var lineHeight = this.getLineHeight();
        y += lineHeight / 2;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.trim() !== '') {
                if (hasBorder) {
                    if (this.style.textBorderPosition === Style_1.TextBorderPosition.OUTER) {
                        ctx.strokeText(line, x, y);
                        ctx.fillText(line, x, y);
                    }
                    else {
                        ctx.fillText(line, x, y);
                        ctx.strokeText(line, x, y);
                    }
                }
                else {
                    ctx.fillText(line, x, y);
                }
            }
            y += lineHeight;
        }
        ctx.restore();
        return true;
    };
    Text.prototype.layout = function () {
        _super.prototype.layout.call(this);
        if (this.style.font) {
            var lines = this.text.split('\n');
            var contentRect = this.getContentRect();
            var textWidth = 0;
            for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
                var line = lines_2[_i];
                textWidth = Math.max(textWidth, this.style.font.measureTextWidth(line));
            }
            if (textWidth > contentRect.width) {
                this.rect.width += textWidth - contentRect.width;
            }
            var textHeight = this.getLineHeight() * lines.length;
            if (textHeight > contentRect.height) {
                this.rect.height += textHeight - contentRect.height;
            }
        }
    };
    return Text;
}(XObject_1.XObject));
exports.Text = Text;
HtmlParser_1.HtmlParser.registerTag('text', Text);


/***/ }),

/***/ "./src/components/TouchItem.ts":
/*!*************************************!*\
  !*** ./src/components/TouchItem.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TRACK_DURATION = 100;
var VelocityTracker = (function () {
    function VelocityTracker() {
        this.positions = [];
    }
    VelocityTracker.prototype.trim = function (now) {
        while (this.positions.length > 0 && this.positions[0].timestamp < now - TRACK_DURATION) {
            this.positions.shift();
        }
    };
    VelocityTracker.prototype.add = function (x, y, timestamp) {
        this.trim(timestamp);
        this.positions.push({ x: x, y: y, timestamp: timestamp });
        var direction = 0;
        var speed = 0;
        if (this.positions.length > 1) {
            var first = this.positions[0];
            var duration = timestamp - first.timestamp;
            if (duration > 0) {
                var moves = Math.sqrt(Math.pow(x - first.x, 2) + Math.pow(y - first.y, 2));
                if (moves > 0) {
                    speed = moves / duration;
                    direction = (Math.asin((first.y - y) / moves) / Math.PI) * 180;
                    if (x < first.x) {
                        direction = 180 - direction;
                    }
                    else if (direction < 0) {
                        direction = 360 + direction;
                    }
                }
            }
        }
        return { speed: speed, direction: direction };
    };
    return VelocityTracker;
}());
var TouchItem = (function () {
    function TouchItem(identifier, srcElement, stageX, stageY, timestamp) {
        this.pressed = false;
        this.x = 0;
        this.y = 0;
        this.identifier = identifier;
        this.srcElement = srcElement;
        this.srcStageX = this.stageX = stageX;
        this.srcStageY = this.stageY = stageY;
        this.srcTimestamp = this.timestamp = timestamp;
        this.speed = this.direction = 0;
    }
    TouchItem.prototype.getDelta = function () {
        if (this.deltaX !== undefined && this.deltaY !== undefined) {
            return { x: this.deltaX, y: this.deltaY };
        }
        if (!this.velocityTracker || this.velocityTracker.positions.length <= 1) {
            return { x: 0, y: 0 };
        }
        else {
            var size = this.velocityTracker.positions.length;
            return {
                x: this.velocityTracker.positions[size - 1].x - this.velocityTracker.positions[size - 2].x,
                y: this.velocityTracker.positions[size - 1].y - this.velocityTracker.positions[size - 2].y
            };
        }
    };
    TouchItem.prototype.switchSourceElement = function (srcElement) {
        var cloned = new TouchItem(this.identifier, srcElement, this.srcStageX, this.srcStageY, this.srcTimestamp);
        cloned.x = this.x;
        cloned.y = this.y;
        cloned.currentTarget = this.currentTarget;
        cloned.pressed = this.pressed;
        cloned.speed = this.speed;
        cloned.direction = this.direction;
        return cloned;
    };
    TouchItem.prototype.onUpdate = function (item) {
        if (!this.velocityTracker) {
            this.velocityTracker = new VelocityTracker();
            this.velocityTracker.add(this.stageX, this.stageY, this.timestamp);
        }
        var velocity = this.velocityTracker.add(item.stageX, item.stageY, item.timestamp);
        this.speed = velocity.speed;
        this.direction = velocity.direction;
        this.stageX = item.stageX;
        this.stageY = item.stageY;
        this.timestamp = item.srcTimestamp;
    };
    TouchItem.prototype.clone = function () {
        return this.switchSourceElement(this.srcElement);
    };
    return TouchItem;
}());
exports.TouchItem = TouchItem;


/***/ }),

/***/ "./src/components/XObject.ts":
/*!***********************************!*\
  !*** ./src/components/XObject.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = __webpack_require__(/*! ../base/Event */ "./src/base/Event.ts");
var Matrix2D_1 = __webpack_require__(/*! ../base/Matrix2D */ "./src/base/Matrix2D.ts");
var Rect_1 = __webpack_require__(/*! ../base/Rect */ "./src/base/Rect.ts");
var Runtime_1 = __webpack_require__(/*! ../runtime/Runtime */ "./src/runtime/Runtime.ts");
var Style_1 = __webpack_require__(/*! ../style/Style */ "./src/style/Style.ts");
var DrawUtils_1 = __webpack_require__(/*! ../utils/DrawUtils */ "./src/utils/DrawUtils.ts");
var LayoutUtils_1 = __webpack_require__(/*! ../utils/LayoutUtils */ "./src/utils/LayoutUtils.ts");
var XObjectEvent = (function (_super) {
    __extends(XObjectEvent, _super);
    function XObjectEvent(type, bubbles, cancelable, srcElement, touchItem, currentTarget) {
        if (bubbles === void 0) { bubbles = true; }
        if (cancelable === void 0) { cancelable = true; }
        var _this = _super.call(this, type, bubbles, cancelable) || this;
        _this.nativeEvent = null;
        _this.srcElement = srcElement;
        _this.touchItem = touchItem;
        _this.currentTarget = currentTarget;
        if (touchItem) {
            _this.identifier = touchItem.identifier;
            _this.stageX = touchItem.stageX;
            _this.stageY = touchItem.stageY;
        }
        return _this;
    }
    XObjectEvent.prototype.toString = function () {
        return '[XObjectEvent (type=' + this.type + ')]';
    };
    return XObjectEvent;
}(Event_1.Event));
exports.XObjectEvent = XObjectEvent;
var CacheState;
(function (CacheState) {
    CacheState[CacheState["DISABLED"] = 1] = "DISABLED";
    CacheState[CacheState["CACHED"] = 2] = "CACHED";
    CacheState[CacheState["INVALIDATE"] = 3] = "INVALIDATE";
})(CacheState || (CacheState = {}));
var XObject = (function (_super) {
    __extends(XObject, _super);
    function XObject(opt) {
        var _this = _super.call(this) || this;
        _this.id = undefined;
        _this.rect = new Rect_1.Rect(0, 0, 0, 0);
        _this.cacheState = CacheState.DISABLED;
        _this.style = new Style_1.Style();
        var defaultStyle = _this.getDefaultStyle();
        if (defaultStyle) {
            _this.style.apply(defaultStyle);
        }
        if (opt) {
            if (opt.attributes.style) {
                _this.style.apply(Style_1.Style.parse(opt.attributes.style));
            }
            if (opt.attributes.id) {
                _this.id = opt.attributes.id;
            }
        }
        return _this;
    }
    XObject.prototype.getDefaultStyle = function () {
        return undefined;
    };
    XObject.prototype.remove = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    XObject.prototype.dispatchEvent = function (event) {
        if (!event.bubbles || !this.parent) {
            this.doDispatchEvent(event);
        }
        else {
            var element = this;
            var queue = [element];
            while (element.parent) {
                queue.push(element.parent);
                element = element.parent;
            }
            for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
                var ele = queue_1[_i];
                event.currentTarget = ele;
                if (event.propagationStopped) {
                    break;
                }
                ele.doDispatchEvent(event);
            }
        }
        return !event.defaultPrevented;
    };
    XObject.prototype.isVisible = function () {
        return !!(this.style.visibility !== Style_1.Visibility.HIDDEN &&
            this.style.display !== Style_1.Display.NONE &&
            this.style.alpha > 0 &&
            this.style.scaleX > 0 &&
            this.style.scaleY > 0);
    };
    XObject.prototype.getCacheCanvas = function () {
        return this.cacheCanvas;
    };
    XObject.prototype.isCached = function () {
        return this.cacheState !== CacheState.DISABLED;
    };
    XObject.prototype.cache = function () {
        if (this.cacheState !== CacheState.CACHED) {
            this.cacheState = CacheState.INVALIDATE;
        }
    };
    XObject.prototype.uncache = function () {
        this.cacheState = CacheState.DISABLED;
        delete this.cacheCanvas;
    };
    XObject.prototype.getAnimationFactory = function () {
        var element = this;
        while (element) {
            if (element.animationFactory) {
                return element.animationFactory;
            }
            element = element.parent;
        }
        return undefined;
    };
    XObject.prototype.animate = function (child, override) {
        if (override === void 0) { override = true; }
        if (typeof child === 'boolean') {
            return this.getAnimationFactory().create(this, child);
        }
        else {
            var target = child === undefined ? this : child;
            return this.getAnimationFactory().create(target, override);
        }
    };
    XObject.prototype.stopAnimation = function (element) {
        if (element === void 0) { element = this; }
        this.getAnimationFactory().removeByTarget(element);
    };
    XObject.prototype.invalidateCache = function () {
        if (this.cacheState === CacheState.DISABLED) {
            console.warn('Cache does not enabled for ' + this.toString());
            return;
        }
        this.cacheState = CacheState.INVALIDATE;
    };
    XObject.prototype.draw = function (ctx, ignoreCache) {
        if (ignoreCache === void 0) { ignoreCache = false; }
        ctx.filter = this.style.filter || 'none';
        if (!ignoreCache && this.cacheState !== CacheState.DISABLED) {
            if (!this.cacheCanvas) {
                this.cacheCanvas = Runtime_1.Runtime.get().newCanvas();
            }
            if (this.cacheState !== CacheState.CACHED) {
                this.cacheCanvas.width = this.rect.width;
                this.cacheCanvas.height = this.rect.height;
                var cacheCtx = this.cacheCanvas.getContext('2d');
                if (cacheCtx) {
                    DrawUtils_1.DrawUtils.drawElement(this, cacheCtx);
                }
                this.cacheState = CacheState.CACHED;
            }
            ctx.drawImage(this.cacheCanvas, 0, 0, this.rect.width, this.rect.height);
        }
        else {
            DrawUtils_1.DrawUtils.drawElement(this, ctx);
        }
    };
    XObject.prototype.drawBackground = function (ctx, outerRect, innerRect) {
        if (this.style.background) {
            this.style.background.draw(this, ctx, outerRect, innerRect);
        }
    };
    XObject.prototype.drawContent = function (ctx) {
        return;
    };
    XObject.prototype.updateContext = function (ctx) {
        var mtx = this.getMatrix();
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        ctx.globalAlpha *= this.style.alpha;
    };
    XObject.prototype.localToGlobal = function (x, y) {
        return this.getConcatenatedMatrix().transformPoint(x, y);
    };
    XObject.prototype.globalToLocal = function (x, y) {
        return this.getConcatenatedMatrix().invert().transformPoint(x, y);
    };
    XObject.prototype.localToLocal = function (x, y, target) {
        var pt = this.localToGlobal(x, y);
        return target.globalToLocal(pt.x, pt.y);
    };
    XObject.prototype.getMatrix = function (matrix) {
        var mtx = (matrix && matrix.identity()) || new Matrix2D_1.Matrix2D();
        var cx = this.style.perspectiveOriginX.getValue(this.rect.width);
        var cy = this.style.perspectiveOriginY.getValue(this.rect.height);
        return mtx.appendTransform(this.rect.x + cx + this.style.transformX.getValue(this.rect.width), this.rect.y + cy + this.style.transformY.getValue(this.rect.height), this.style.scaleX, this.style.scaleY, this.style.rotation, this.style.skewX, this.style.skewY, cx, cy);
    };
    XObject.prototype.getConcatenatedMatrix = function (matrix) {
        var mtx = this.getMatrix(matrix);
        var o = this.parent;
        while (o) {
            mtx.prependMatrix(o.getMatrix());
            o = o.parent;
        }
        return mtx;
    };
    XObject.prototype.hitTest = function (x, y) {
        return x >= 0 && x < this.rect.width && y >= 0 && y < this.rect.height;
    };
    XObject.prototype.layout = function () {
        this.calculateSize();
    };
    XObject.prototype.calculateSize = function () {
        if (!this.parent) {
            return;
        }
        LayoutUtils_1.LayoutUtils.updateSize(this, this.parent.getContentWidth(), this.parent.getContentHeight());
    };
    XObject.prototype.css = function (style) {
        this.style.apply(style);
        this.dispatchEvent(new XObjectEvent('update', true, true, this));
        return this;
    };
    XObject.prototype.getLineHeight = function () {
        if (this.style.font) {
            if (this.style.lineHeight) {
                return this.style.lineHeight.getValue(this.style.font.size);
            }
            else if (this.style.font.lineHeight) {
                return this.style.font.lineHeight.getValue(this.style.font.size);
            }
            else {
                return this.style.font.size;
            }
        }
        else {
            if (this.style.lineHeight) {
                return this.style.lineHeight.getValue(0);
            }
            else {
                return 0;
            }
        }
    };
    XObject.prototype.getWidth = function () {
        return this.rect.width;
    };
    XObject.prototype.getHeight = function () {
        return this.rect.height;
    };
    XObject.prototype.getPaddingWidth = function () {
        return (this.rect.width -
            (this.style.borderLeft ? this.style.borderLeft.width : 0) -
            (this.style.borderRight ? this.style.borderRight.width : 0));
    };
    XObject.prototype.getPaddingHeight = function () {
        return (this.rect.height -
            (this.style.borderTop ? this.style.borderTop.width : 0) -
            (this.style.borderBottom ? this.style.borderBottom.width : 0));
    };
    XObject.prototype.getPaddingRect = function () {
        var rect = new Rect_1.Rect(0, 0, this.rect.width, this.rect.height);
        if (this.style.borderLeft) {
            rect.x += this.style.borderLeft.width;
            rect.width -= this.style.borderLeft.width;
        }
        if (this.style.borderRight) {
            rect.width -= this.style.borderRight.width;
        }
        if (this.style.borderTop) {
            rect.y += this.style.borderTop.width;
            rect.height -= this.style.borderTop.width;
        }
        if (this.style.borderBottom) {
            rect.height -= this.style.borderBottom.width;
        }
        return rect;
    };
    XObject.prototype.getContentWidth = function () {
        return (this.rect.width -
            (this.style.paddingLeft ? this.style.paddingLeft.getValue(this.rect.width) : 0) -
            (this.style.paddingRight ? this.style.paddingRight.getValue(this.rect.width) : 0) -
            (this.style.borderLeft ? this.style.borderLeft.width : 0) -
            (this.style.borderRight ? this.style.borderRight.width : 0));
    };
    XObject.prototype.getContentHeight = function () {
        return (this.rect.height -
            (this.style.paddingTop ? this.style.paddingTop.getValue(this.rect.height) : 0) -
            (this.style.paddingBottom ? this.style.paddingBottom.getValue(this.rect.height) : 0) -
            (this.style.borderTop ? this.style.borderTop.width : 0) -
            (this.style.borderBottom ? this.style.borderBottom.width : 0));
    };
    XObject.prototype.getContentRect = function () {
        var rect = new Rect_1.Rect(0, 0, this.rect.width, this.rect.height);
        if (this.style.paddingLeft) {
            var left = this.style.paddingLeft.getValue(this.rect.width);
            rect.x += left;
            rect.width -= left;
        }
        if (this.style.paddingRight) {
            rect.width -= this.style.paddingRight.getValue(this.rect.width);
        }
        if (this.style.paddingTop) {
            var top_1 = this.style.paddingTop.getValue(this.rect.height);
            rect.y += top_1;
            rect.height -= top_1;
        }
        if (this.style.paddingBottom) {
            rect.height -= this.style.paddingBottom.getValue(this.rect.height);
        }
        if (this.style.borderLeft) {
            rect.x += this.style.borderLeft.width;
            rect.width -= this.style.borderLeft.width;
        }
        if (this.style.borderRight) {
            rect.width -= this.style.borderRight.width;
        }
        if (this.style.borderTop) {
            rect.y += this.style.borderTop.width;
            rect.height -= this.style.borderTop.width;
        }
        if (this.style.borderBottom) {
            rect.height -= this.style.borderBottom.width;
        }
        return rect;
    };
    XObject.prototype.getOuterWidth = function () {
        var parentWidth = this.parent ? this.parent.getWidth() : 0;
        return (this.rect.width +
            (this.style.marginLeft ? this.style.marginLeft.getValue(parentWidth) : 0) +
            (this.style.marginRight ? this.style.marginRight.getValue(parentWidth) : 0));
    };
    XObject.prototype.getOuterHeight = function () {
        var parentHeight = this.parent ? this.parent.getHeight() : 0;
        return (this.rect.height +
            (this.style.marginTop ? this.style.marginTop.getValue(parentHeight) : 0) +
            (this.style.marginBottom ? this.style.marginBottom.getValue(parentHeight) : 0));
    };
    XObject.prototype.isChildOf = function (element) {
        var parent = this.parent;
        while (parent) {
            if (parent === element) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    };
    XObject.prototype.toString = function () {
        return "[XObject (id=" + this.id + ")]";
    };
    XObject.prototype.doDispatchEvent = function (event) {
        event.currentTarget = this;
        if (event.stage && event.touchItem && this.willTrigger(event.type)) {
            var pt = event.stage.localToLocal(event.touchItem.stageX, event.touchItem.stageY, this);
            event.x = pt.x;
            event.y = pt.y;
            event.touchItem.x = pt.x;
            event.touchItem.y = pt.y;
        }
        _super.prototype.dispatchEvent.call(this, event);
    };
    return XObject;
}(Event_1.EventDispatcher));
exports.XObject = XObject;
var IContainer = (function (_super) {
    __extends(IContainer, _super);
    function IContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return IContainer;
}(XObject));
exports.IContainer = IContainer;


/***/ }),

/***/ "./src/components/index.ts":
/*!*********************************!*\
  !*** ./src/components/index.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./Apng */ "./src/components/Apng.ts"));
__export(__webpack_require__(/*! ./BitmapText */ "./src/components/BitmapText.ts"));
__export(__webpack_require__(/*! ./Container */ "./src/components/Container.ts"));
__export(__webpack_require__(/*! ./Img */ "./src/components/Img.ts"));
__export(__webpack_require__(/*! ./Scrollable */ "./src/components/Scrollable.ts"));
__export(__webpack_require__(/*! ./Sprite */ "./src/components/Sprite.ts"));
__export(__webpack_require__(/*! ./Stage */ "./src/components/Stage.ts"));
__export(__webpack_require__(/*! ./Text */ "./src/components/Text.ts"));
__export(__webpack_require__(/*! ./TouchItem */ "./src/components/TouchItem.ts"));
__export(__webpack_require__(/*! ./XObject */ "./src/components/XObject.ts"));


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./animation */ "./src/animation/index.ts"));
__export(__webpack_require__(/*! ./base */ "./src/base/index.ts"));
__export(__webpack_require__(/*! ./components */ "./src/components/index.ts"));
__export(__webpack_require__(/*! ./parser */ "./src/parser/index.ts"));
__export(__webpack_require__(/*! ./resource */ "./src/resource/index.ts"));
__export(__webpack_require__(/*! ./runtime */ "./src/runtime/index.ts"));
__export(__webpack_require__(/*! ./style */ "./src/style/index.ts"));
__export(__webpack_require__(/*! ./utils */ "./src/utils/index.ts"));
var Ticker_1 = __webpack_require__(/*! ./Ticker */ "./src/Ticker.ts");
exports.Ticker = Ticker_1.Ticker;


/***/ }),

/***/ "./src/parser/ApngParser.ts":
/*!**********************************!*\
  !*** ./src/parser/ApngParser.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Runtime_1 = __webpack_require__(/*! ../runtime/Runtime */ "./src/runtime/Runtime.ts");
var Base64_1 = __webpack_require__(/*! ../utils/Base64 */ "./src/utils/Base64.ts");
var CRC32_1 = __webpack_require__(/*! ../utils/CRC32 */ "./src/utils/CRC32.ts");
var ApngData = (function () {
    function ApngData() {
        this.duration = 0;
        this.numPlays = 0;
        this.frames = [];
    }
    return ApngData;
}());
exports.ApngData = ApngData;
var ApngFrame = (function () {
    function ApngFrame() {
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.delay = 0;
        this.disposeOp = 0;
        this.blendOp = 0;
        this.dataParts = [];
    }
    return ApngFrame;
}());
exports.ApngFrame = ApngFrame;
var PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
function toUint32(data) {
    return ((data.charCodeAt(0) << 24) |
        (data.charCodeAt(1) << 16) |
        (data.charCodeAt(2) << 8) |
        data.charCodeAt(3));
}
function toDWordArray(x) {
    return [(x >>> 24) & 0xff, (x >>> 16) & 0xff, (x >>> 8) & 0xff, x & 0xff];
}
var IHDR = toUint32('IHDR');
var acTL = toUint32('acTL');
var IDAT = toUint32('IDAT');
var fcTL = toUint32('fcTL');
var fdAT = toUint32('fdAT');
var IEND = toUint32('IEND');
var ApngParser = (function () {
    function ApngParser() {
    }
    ApngParser.parse = function (buffer, silent) {
        if (silent === void 0) { silent = false; }
        var bytes = new Uint8Array(buffer);
        for (var i = 0; i < PNG_SIGNATURE.length; ++i) {
            if (PNG_SIGNATURE[i] !== bytes[i]) {
                if (!silent) {
                    console.warn('not a png file');
                }
                return undefined;
            }
        }
        var chunks = this.toChunks(bytes);
        var preDataParts = [];
        var postDataParts = [];
        var headerDataBytes = null;
        var frame = null;
        var apng = new ApngData();
        var dataView = new DataView(bytes.buffer);
        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
            var chunk = chunks_1[_i];
            switch (chunk.type) {
                case IHDR:
                    headerDataBytes = bytes.subarray(chunk.start + 8, chunk.end - 4);
                    apng.width = dataView.getUint32(chunk.start + 8);
                    apng.height = dataView.getUint32(chunk.start + 8 + 4);
                    break;
                case acTL:
                    apng.numPlays = dataView.getUint32(chunk.start + 8);
                    break;
                case fcTL:
                    frame = new ApngFrame();
                    apng.frames.push(frame);
                    frame.width = dataView.getUint32(chunk.start + 8 + 4);
                    frame.height = dataView.getUint32(chunk.start + 8 + 8);
                    frame.left = dataView.getUint32(chunk.start + 8 + 12);
                    frame.top = dataView.getUint32(chunk.start + 8 + 16);
                    var delayN = dataView.getUint16(chunk.start + 8 + 20);
                    var delayD = dataView.getUint16(chunk.start + 8 + 22);
                    if (delayD === 0) {
                        delayD = 100;
                    }
                    frame.delay = (1000 * delayN) / delayD;
                    if (frame.delay <= 10) {
                        frame.delay = 100;
                    }
                    apng.duration += frame.delay;
                    frame.disposeOp = dataView.getUint8(chunk.start + 8 + 24);
                    frame.blendOp = dataView.getUint8(chunk.start + 8 + 25);
                    frame.dataParts = [];
                    if (apng.frames.length === 1 && frame.disposeOp === 2) {
                        frame.disposeOp = 1;
                    }
                    break;
                case fdAT:
                    if (frame) {
                        frame.dataParts.push(this.makeChunk(IDAT, bytes.subarray(chunk.start + 12, chunk.end - 4)));
                    }
                    else if (!silent) {
                        console.warn('invalid fdAT chunk before frame');
                    }
                    break;
                case IDAT:
                    if (frame) {
                        frame.dataParts.push(this.makeChunk(IDAT, bytes.subarray(chunk.start + 8, chunk.end - 4)));
                    }
                    else if (!silent) {
                        console.warn('invalid IDAT chunk before frame');
                    }
                    break;
                case IEND:
                    postDataParts.push(bytes.subarray(chunk.start, chunk.end));
                    break;
                default:
                    preDataParts.push(bytes.subarray(chunk.start, chunk.end));
            }
        }
        if (apng.frames.length === 0) {
            if (!silent) {
                console.warn('not a png file');
            }
            return undefined;
        }
        var _loop_1 = function (frm) {
            var imageData = [];
            imageData.push(PNG_SIGNATURE);
            headerDataBytes.set(toDWordArray(frm.width), 0);
            headerDataBytes.set(toDWordArray(frm.height), 4);
            imageData.push(this_1.makeChunk(IHDR, headerDataBytes));
            for (var _i = 0, preDataParts_1 = preDataParts; _i < preDataParts_1.length; _i++) {
                var part = preDataParts_1[_i];
                imageData.push(part);
            }
            for (var _a = 0, _b = frm.dataParts; _a < _b.length; _a++) {
                var part = _b[_a];
                imageData.push(part);
            }
            for (var _c = 0, postDataParts_1 = postDataParts; _c < postDataParts_1.length; _c++) {
                var part = postDataParts_1[_c];
                imageData.push(part);
            }
            delete frm.dataParts;
            switch (Runtime_1.Runtime.getRuntimeType()) {
                case Runtime_1.RuntimeType.WECHAT_MINI_GAME:
                    {
                        frm.image = Runtime_1.Runtime.get().newImage();
                        var url = 'data:image/png;base64,' + Base64_1.Base64.encode(imageData);
                        frm.image.src = url;
                    }
                    break;
                case Runtime_1.RuntimeType.WEBPAGE:
                    {
                        var url_1 = URL.createObjectURL(new Blob(imageData, { type: 'image/png' }));
                        var image = new Image();
                        frm.image = image;
                        image.src = url_1;
                        image.onload = function () {
                            URL.revokeObjectURL(url_1);
                        };
                        image.onerror = function (e) {
                            URL.revokeObjectURL(url_1);
                        };
                    }
                    break;
            }
        };
        var this_1 = this;
        for (var _a = 0, _b = apng.frames; _a < _b.length; _a++) {
            var frm = _b[_a];
            _loop_1(frm);
        }
        return apng;
    };
    ApngParser.toChunks = function (bytes) {
        var chunks = [];
        var dataView = new DataView(bytes.buffer);
        var position = 8;
        while (position <= bytes.length - 12) {
            var length_1 = dataView.getUint32(position);
            if (length_1 < 0 || position + 12 + length_1 > bytes.length) {
                console.warn('invalid chunk length, position=' +
                    position +
                    ' length=' +
                    length_1 +
                    ' total=' +
                    bytes.length);
                return undefined;
            }
            var type = dataView.getUint32(position + 4);
            chunks.push({
                type: type,
                start: position,
                end: position + length_1 + 12
            });
            position += 12 + length_1;
            if (type === IEND) {
                break;
            }
        }
        return chunks;
    };
    ApngParser.makeChunk = function (type, data) {
        var bytes = new Uint8Array(data.length + 12);
        var dataView = new DataView(bytes.buffer);
        dataView.setUint32(0, data.length);
        dataView.setUint32(4, type);
        bytes.set(data, 8);
        var crc = CRC32_1.CRC32.calculate(bytes, 4, data.length + 4);
        dataView.setUint32(data.length + 8, crc);
        return bytes;
    };
    return ApngParser;
}());
exports.ApngParser = ApngParser;


/***/ }),

/***/ "./src/parser/CSSTokenizer.ts":
/*!************************************!*\
  !*** ./src/parser/CSSTokenizer.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var State;
(function (State) {
    State[State["START"] = 0] = "START";
    State[State["VALUE"] = 1] = "VALUE";
    State[State["FUNC"] = 2] = "FUNC";
})(State || (State = {}));
var CSSTokenizer = (function () {
    function CSSTokenizer(stopLetters) {
        if (stopLetters === void 0) { stopLetters = ''; }
        this.stopLetters = '';
        this.stopLetters = stopLetters;
    }
    CSSTokenizer.prototype.isSplitter = function (ch) {
        return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
    };
    CSSTokenizer.prototype.isStopLetter = function (ch) {
        return this.stopLetters && this.stopLetters.indexOf(ch) >= 0;
    };
    CSSTokenizer.prototype.tokenize = function (content) {
        var len = content.length;
        var result = [];
        var state = State.START;
        var tokenQuota = '';
        var start = 0;
        for (var i = 0; i < len; ++i) {
            var ch = content[i];
            switch (state) {
                case State.START:
                    if (this.isStopLetter(ch)) {
                        result.push(ch);
                    }
                    else if (!this.isSplitter(ch)) {
                        start = i;
                        state = State.VALUE;
                        if (ch === "'" || ch === '"') {
                            tokenQuota = ch;
                        }
                        else {
                            tokenQuota = '';
                        }
                    }
                    break;
                case State.VALUE:
                    if (tokenQuota !== '') {
                        if (ch === tokenQuota) {
                            state = State.START;
                            result.push(content.substring(start + 1, i));
                        }
                    }
                    else if (ch === '(') {
                        state = State.FUNC;
                    }
                    else if (this.isSplitter(ch)) {
                        state = State.START;
                        result.push(content.substring(start, i));
                    }
                    else if (this.isStopLetter(ch)) {
                        state = State.START;
                        result.push(content.substring(start, i));
                        result.push(ch);
                    }
                    break;
                case State.FUNC:
                    if (ch === ')') {
                        state = State.START;
                        result.push(content.substring(start, i + 1));
                    }
                    break;
            }
        }
        if (state !== State.START) {
            if (tokenQuota === '') {
                result.push(content.substring(start));
            }
            else {
                result.push(content.substring(start + 1));
            }
        }
        return result;
    };
    return CSSTokenizer;
}());
exports.CSSTokenizer = CSSTokenizer;


/***/ }),

/***/ "./src/parser/FunctionParser.ts":
/*!**************************************!*\
  !*** ./src/parser/FunctionParser.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var State;
(function (State) {
    State[State["NAME_START"] = 0] = "NAME_START";
    State[State["NAME"] = 1] = "NAME";
    State[State["NAME_END"] = 2] = "NAME_END";
    State[State["PARAMETER_START"] = 3] = "PARAMETER_START";
    State[State["PARAMETER"] = 4] = "PARAMETER";
    State[State["PARAMETER_END"] = 5] = "PARAMETER_END";
    State[State["END"] = 6] = "END";
})(State || (State = {}));
var FunctionParser = (function () {
    function FunctionParser() {
    }
    FunctionParser.isBlank = function (ch) {
        return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
    };
    FunctionParser.parse = function (content, silent) {
        if (silent === void 0) { silent = false; }
        var func = {
            name: undefined,
            arguments: []
        };
        var state = State.NAME_START;
        var parameterQuota = '';
        var start = 0;
        var len = content.length;
        var i = 0;
        for (; i < len; ++i) {
            var ch = content[i];
            switch (state) {
                case State.NAME_START:
                    if (!this.isBlank(ch)) {
                        start = i;
                        state = State.NAME;
                    }
                    break;
                case State.NAME:
                    if (this.isBlank(ch) || ch === ')') {
                        if (!silent) {
                            console.warn('invalid function:' + content);
                        }
                        return undefined;
                    }
                    else if (ch === '(') {
                        func.name = content.substring(start, i);
                        state = ch === '(' ? State.PARAMETER_START : State.NAME_END;
                    }
                    break;
                case State.NAME_END:
                    if (ch === '(') {
                        state = State.PARAMETER_START;
                        break;
                    }
                    else if (!this.isBlank(ch)) {
                        if (!silent) {
                            console.warn('invalid function:' + content);
                        }
                        return undefined;
                    }
                case State.PARAMETER_START:
                    if (this.isBlank(ch)) {
                        break;
                    }
                    else if (ch === '"' || ch === "'") {
                        state = State.PARAMETER;
                        start = i + 1;
                        parameterQuota = ch;
                    }
                    else if (ch === ')') {
                        state = State.END;
                    }
                    else if (ch === ',') {
                        if (!silent) {
                            console.warn('invalid function:' + content);
                        }
                        return undefined;
                    }
                    else {
                        state = State.PARAMETER;
                        start = i;
                        parameterQuota = '';
                    }
                    break;
                case State.PARAMETER:
                    if (parameterQuota !== '') {
                        if (parameterQuota === ch) {
                            state = State.PARAMETER_END;
                            func.arguments.push(content.substring(start, i));
                            parameterQuota = '';
                        }
                    }
                    else {
                        if (ch === ',') {
                            state = State.PARAMETER_START;
                            func.arguments.push(content.substring(start, i).trim());
                            parameterQuota = '';
                        }
                        else if (ch === ')') {
                            state = State.END;
                            func.arguments.push(content.substring(start, i).trim());
                            parameterQuota = '';
                        }
                    }
                    break;
                case State.PARAMETER_END:
                    if (this.isBlank(ch)) {
                        break;
                    }
                    else if (ch === ',') {
                        state = State.PARAMETER_START;
                    }
                    else if (ch === ')') {
                        state = State.END;
                    }
                    break;
                case State.END:
                    if (!this.isBlank(ch)) {
                        if (!silent) {
                            console.warn('invalid function:' + content);
                        }
                        return undefined;
                    }
                    break;
            }
        }
        if (state !== State.END) {
            if (!silent) {
                console.warn('invalid function:' + content);
            }
            return undefined;
        }
        return func;
    };
    return FunctionParser;
}());
exports.FunctionParser = FunctionParser;


/***/ }),

/***/ "./src/parser/HtmlParser.ts":
/*!**********************************!*\
  !*** ./src/parser/HtmlParser.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var XObject_1 = __webpack_require__(/*! ../components/XObject */ "./src/components/XObject.ts");
var ParseState;
(function (ParseState) {
    ParseState[ParseState["START"] = 1] = "START";
    ParseState[ParseState["TAG"] = 2] = "TAG";
    ParseState[ParseState["TEXT"] = 3] = "TEXT";
})(ParseState || (ParseState = {}));
var AttrState;
(function (AttrState) {
    AttrState[AttrState["PENDING"] = 0] = "PENDING";
    AttrState[AttrState["START"] = 1] = "START";
    AttrState[AttrState["NAME"] = 2] = "NAME";
    AttrState[AttrState["EQ"] = 3] = "EQ";
    AttrState[AttrState["VALUE"] = 4] = "VALUE";
    AttrState[AttrState["VALUE_STARTED"] = 5] = "VALUE_STARTED";
})(AttrState || (AttrState = {}));
var HtmlParser = (function () {
    function HtmlParser() {
    }
    HtmlParser.registerTag = function (tag, componentClass) {
        this.tagMap[tag.toLowerCase()] = componentClass;
    };
    HtmlParser.prototype.parse = function (content) {
        var result = [];
        var nodes = this.parseHtml(content);
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var child = this.node2Component(node);
            if (child) {
                result.push(child);
            }
        }
        return result;
    };
    HtmlParser.prototype.parseHtml = function (content) {
        var nodes = [];
        var queue = [];
        var len = content.length;
        var state = ParseState.START;
        var tagStart = 0;
        var tag = null;
        var inQuota = false;
        var quota = null;
        var attrState = AttrState.PENDING;
        var attrStart = 0;
        var attrName = '';
        var attrQuota = null;
        var attr = {};
        var i = 0;
        for (; i < len; ++i) {
            var ch = content[i];
            switch (state) {
                case ParseState.START:
                    if (ch === '<') {
                        tagStart = i;
                        tag = null;
                        state = ParseState.TAG;
                        attrState = AttrState.PENDING;
                        attrStart = 0;
                        attrName = '';
                        attrQuota = null;
                        attr = {};
                    }
                    else {
                        tagStart = i;
                        state = ParseState.TEXT;
                    }
                    break;
                case ParseState.TAG:
                    if (!tag &&
                        (this.isSplitter(ch) || ch === '>' || ch === '/' || ch === '"' || ch === "'")) {
                        tag = content.substring(tagStart + 1, i);
                        attrState = AttrState.START;
                    }
                    if (tag === null) {
                        break;
                    }
                    if (inQuota) {
                        if (ch === quota) {
                            inQuota = false;
                        }
                    }
                    else {
                        if (ch === "'" || ch === '"') {
                            inQuota = true;
                            quota = ch;
                        }
                    }
                    if (ch === '>' && !inQuota) {
                        switch (attrState) {
                            case AttrState.NAME:
                                attrName = content.substring(attrStart, i);
                                this.addAttr(attr, attrName, '');
                                break;
                            case AttrState.EQ:
                                this.addAttr(attr, attrName, '');
                                break;
                            case AttrState.VALUE:
                            case AttrState.VALUE_STARTED:
                                this.addAttr(attr, attrName, content.substring(attrStart, i));
                                break;
                        }
                        if (tag.substring(0, 3) === '!--') {
                            if (i - tagStart >= 6 && content.substring(i - 2, i) === '--') {
                                state = ParseState.START;
                            }
                            break;
                        }
                        if (tag && tag[0] === '/') {
                            tag = tag.substring(1);
                            var find = false;
                            for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
                                var n = queue_1[_i];
                                if (n.tag === tag) {
                                    find = true;
                                }
                            }
                            if (find) {
                                while (queue.length > 0) {
                                    var node = queue.pop();
                                    if (!node || node.tag === tag) {
                                        break;
                                    }
                                }
                            }
                            state = ParseState.START;
                        }
                        else {
                            var node = {
                                children: [],
                                tag: tag,
                                attributes: attr
                            };
                            attr = {};
                            if (queue.length > 0) {
                                node.parent = queue[queue.length - 1];
                                queue[queue.length - 1].children.push(node);
                            }
                            else {
                                nodes.push(node);
                            }
                            if (!this.isCloseTag(tag)) {
                                queue.push(node);
                            }
                            state = ParseState.START;
                        }
                    }
                    else {
                        switch (attrState) {
                            case AttrState.START:
                                if (!this.isSplitter(ch) && ch !== '/') {
                                    attrStart = i;
                                    attrState = AttrState.NAME;
                                }
                                attrQuota = null;
                                break;
                            case AttrState.NAME:
                                if (this.isSplitter(ch)) {
                                    attrName = content.substring(attrStart, i);
                                    attrState = AttrState.EQ;
                                }
                                else if (ch === '=') {
                                    attrName = content.substring(attrStart, i);
                                    attrStart = i + 1;
                                    attrState = AttrState.VALUE;
                                }
                                break;
                            case AttrState.EQ:
                                if (this.isSplitter(ch)) {
                                    break;
                                }
                                if (ch === '=') {
                                    attrState = AttrState.VALUE;
                                    attrStart = i + 1;
                                }
                                else {
                                    this.addAttr(attr, attrName, '');
                                    attrState = AttrState.START;
                                }
                                break;
                            case AttrState.VALUE:
                                if (this.isSplitter(ch)) {
                                    break;
                                }
                                if (ch === '"' || ch === "'") {
                                    attrQuota = ch;
                                    attrStart = i + 1;
                                }
                                else {
                                    attrQuota = null;
                                    attrStart = i;
                                }
                                attrState = AttrState.VALUE_STARTED;
                                break;
                            case AttrState.VALUE_STARTED:
                                var end = false;
                                var attrEnd = i;
                                if (attrQuota) {
                                    if (ch === attrQuota) {
                                        end = true;
                                    }
                                }
                                else if (!attrQuota && this.isSplitter(ch)) {
                                    end = true;
                                }
                                if (end) {
                                    this.addAttr(attr, attrName, content.substring(attrStart, attrEnd));
                                    attrName = '';
                                    attrState = AttrState.START;
                                }
                                break;
                        }
                    }
                    break;
                case ParseState.TEXT:
                    if (ch === '<') {
                        if (tagStart < i) {
                            var text = content.substring(tagStart, i).trim();
                            if (text.length > 0) {
                                var node = {
                                    children: [],
                                    tag: 'TEXT',
                                    text: text,
                                    attributes: {}
                                };
                                if (queue.length > 0) {
                                    node.parent = queue[queue.length - 1];
                                    queue[queue.length - 1].children.push(node);
                                }
                                else {
                                    nodes.push(node);
                                }
                            }
                        }
                        state = ParseState.TAG;
                        tag = null;
                        tagStart = i;
                        attrState = AttrState.PENDING;
                        attrStart = 0;
                        attrName = '';
                        attrQuota = null;
                        attr = {};
                    }
                    break;
            }
        }
        switch (state) {
            case ParseState.TEXT:
                if (tagStart < i) {
                    var text = content.substring(tagStart, i).trim();
                    if (text.length > 0) {
                        var node = {
                            children: [],
                            tag: 'TEXT',
                            text: text,
                            attributes: {}
                        };
                        if (queue.length > 0) {
                            node.parent = queue[queue.length - 1];
                            queue[queue.length - 1].children.push(node);
                        }
                        else {
                            nodes.push(node);
                        }
                    }
                }
                break;
        }
        for (var _a = 0, nodes_2 = nodes; _a < nodes_2.length; _a++) {
            var node = nodes_2[_a];
            this.trimTextNode(node);
        }
        return nodes;
    };
    HtmlParser.prototype.trimTextNode = function (node) {
        if (node.children.length === 1 && node.children[0].tag === 'TEXT') {
            node.text = node.children[0].text;
            node.children.length = 0;
        }
        else {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.trimTextNode(child);
            }
        }
    };
    HtmlParser.prototype.node2Component = function (node) {
        var type = HtmlParser.tagMap[node.tag.toLowerCase()];
        if (!type) {
            console.warn('unknown tag:' + node.tag.toLowerCase());
            return undefined;
        }
        var options = {
            attributes: node.attributes,
            text: node.text
        };
        var component = new type(options);
        if (node.children.length > 0) {
            if (component instanceof XObject_1.IContainer) {
                for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var childComponent = this.node2Component(child);
                    if (childComponent) {
                        component.addChild(childComponent);
                    }
                }
            }
            else {
                console.warn('component is not a container:' + component);
            }
        }
        return component;
    };
    HtmlParser.prototype.isSplitter = function (ch) {
        return ch === ' ' || ch === '\r' || ch === '\n' || ch === '\t';
    };
    HtmlParser.prototype.isCloseTag = function (tag) {
        return tag === 'img';
    };
    HtmlParser.prototype.addAttr = function (attr, name, value) {
        attr[name.toLowerCase()] = value;
    };
    HtmlParser.tagMap = {};
    return HtmlParser;
}());
exports.HtmlParser = HtmlParser;


/***/ }),

/***/ "./src/parser/index.ts":
/*!*****************************!*\
  !*** ./src/parser/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./ApngParser */ "./src/parser/ApngParser.ts"));
__export(__webpack_require__(/*! ./CSSTokenizer */ "./src/parser/CSSTokenizer.ts"));
__export(__webpack_require__(/*! ./FunctionParser */ "./src/parser/FunctionParser.ts"));
__export(__webpack_require__(/*! ./HtmlParser */ "./src/parser/HtmlParser.ts"));


/***/ }),

/***/ "./src/resource/ImageClip.ts":
/*!***********************************!*\
  !*** ./src/resource/ImageClip.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __webpack_require__(/*! ../base */ "./src/base/index.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ./ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var ImageClipRotation;
(function (ImageClipRotation) {
    ImageClipRotation[ImageClipRotation["Rotation0"] = 0] = "Rotation0";
    ImageClipRotation[ImageClipRotation["Rotation90"] = 90] = "Rotation90";
    ImageClipRotation[ImageClipRotation["Rotation180"] = 180] = "Rotation180";
    ImageClipRotation[ImageClipRotation["Rotation270"] = 270] = "Rotation270";
})(ImageClipRotation = exports.ImageClipRotation || (exports.ImageClipRotation = {}));
var REG_IMAGE_CLIP = /^(.+)#([0-9\.]+),([0-9\.]+),([0-9\.]+),([0-9\.]+)@?(0|90|180|270)?$/;
var ImageClip = (function () {
    function ImageClip(src, rect, rotation, scale) {
        if (rotation === void 0) { rotation = ImageClipRotation.Rotation0; }
        if (scale === void 0) { scale = 1.0; }
        this.scale = 1;
        this.src = src;
        this.rect = rect;
        this.rotation = rotation;
        this.scale = scale;
    }
    ImageClip.of = function (clip, silent) {
        if (silent === void 0) { silent = false; }
        var matched = clip.match(REG_IMAGE_CLIP);
        if (!matched) {
            if (clip.indexOf('#') < 0) {
                return new ImageClip(clip);
            }
            else if (!silent) {
                console.warn("invalid image clip:" + clip);
            }
            return undefined;
        }
        return new ImageClip(matched[1], new base_1.Rect(parseFloat(matched[2]), parseFloat(matched[3]), parseFloat(matched[4]), parseFloat(matched[5])), (matched[6] ? parseInt(matched[6]) : 0));
    };
    ImageClip.prototype.ready = function () {
        return !!this.getImage();
    };
    ImageClip.prototype.getSrc = function () {
        return this.src;
    };
    ImageClip.prototype.setImage = function (image) {
        this.image = image;
        return this;
    };
    ImageClip.prototype.setSrc = function (src) {
        this.src = src;
        return this;
    };
    ImageClip.prototype.getRect = function () {
        return this.rect;
    };
    ImageClip.prototype.getRotation = function () {
        return this.rotation;
    };
    ImageClip.prototype.getScale = function () {
        return this.scale;
    };
    ImageClip.prototype.setRect = function (rect) {
        this.rect = rect;
        return this;
    };
    ImageClip.prototype.setRotation = function (rotation) {
        this.rotation = rotation;
        return this;
    };
    ImageClip.prototype.setScale = function (scale) {
        this.scale = scale;
        return this;
    };
    ImageClip.prototype.getImage = function () {
        return this.image
            ? this.image
            : ResourceRegistry_1.ResourceRegistry.DefaultInstance.get(this.src);
    };
    ImageClip.prototype.getWidth = function () {
        if (!this.rect) {
            var image = this.getImage();
            return image ? (this.needChangeSize() ? image.height : image.width) * this.scale : 0;
        }
        else {
            return this.scale * (this.needChangeSize() ? this.rect.height : this.rect.width);
        }
    };
    ImageClip.prototype.needChangeSize = function () {
        return (this.rotation === ImageClipRotation.Rotation90 ||
            this.rotation === ImageClipRotation.Rotation270);
    };
    ImageClip.prototype.getHeight = function () {
        if (!this.rect) {
            var image = this.getImage();
            return image ? (this.needChangeSize() ? image.width : image.height) * this.scale : 0;
        }
        else {
            return this.scale * (this.needChangeSize() ? this.rect.width : this.rect.height);
        }
    };
    ImageClip.prototype.draw = function (ctx, rect, src) {
        var image = this.getImage();
        if (!image)
            return;
        var x = this.rect ? this.rect.x : 0;
        var y = this.rect ? this.rect.y : 0;
        var w = this.rect ? this.rect.width : image.width;
        var h = this.rect ? this.rect.height : image.height;
        if (src) {
            switch (this.rotation) {
                case ImageClipRotation.Rotation0:
                    x += src.x;
                    y += src.y;
                    w = src.width;
                    h = src.height;
                    break;
                case ImageClipRotation.Rotation90:
                    x += w - src.y - src.height;
                    y += src.x;
                    w = src.height;
                    h = src.width;
                    break;
                case ImageClipRotation.Rotation180:
                    x += w - src.x - src.width;
                    y += h - src.y - src.height;
                    w = src.width;
                    h = src.height;
                    break;
                case ImageClipRotation.Rotation270:
                    x += src.y;
                    y += h - src.x - src.width;
                    w = src.height;
                    h = src.width;
                    break;
            }
        }
        switch (this.rotation) {
            case ImageClipRotation.Rotation0:
                ctx.drawImage(image, x, y, w, h, rect.x, rect.y, rect.width, rect.height);
                break;
            case ImageClipRotation.Rotation90:
                ctx.save();
                var mtx = new base_1.Matrix2D();
                ctx.translate(rect.x, rect.y);
                ctx.rotate(-Math.PI / 2);
                ctx.drawImage(image, x, y, w, h, -rect.height, 0, rect.height, rect.width);
                ctx.restore();
                break;
            case ImageClipRotation.Rotation180:
                ctx.save();
                ctx.translate(rect.x, rect.y);
                ctx.rotate(Math.PI);
                ctx.drawImage(image, x, y, w, h, -rect.width, -rect.height, rect.width, rect.height);
                ctx.restore();
                break;
            case ImageClipRotation.Rotation270:
                ctx.save();
                ctx.translate(rect.x, rect.y);
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(image, x, y, w, h, 0, -rect.width, rect.height, rect.width);
                ctx.restore();
                break;
        }
    };
    ImageClip.prototype.clone = function () {
        return new ImageClip(this.src, this.rect.clone(), this.rotation, this.scale).setImage(this.image);
    };
    return ImageClip;
}());
exports.ImageClip = ImageClip;


/***/ }),

/***/ "./src/resource/ResourceRegistry.ts":
/*!******************************************!*\
  !*** ./src/resource/ResourceRegistry.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = __webpack_require__(/*! ../base/Event */ "./src/base/Event.ts");
var ApngParser_1 = __webpack_require__(/*! ../parser/ApngParser */ "./src/parser/ApngParser.ts");
var Runtime_1 = __webpack_require__(/*! ../runtime/Runtime */ "./src/runtime/Runtime.ts");
var URLUtils_1 = __webpack_require__(/*! ../utils/URLUtils */ "./src/utils/URLUtils.ts");
var LoadState;
(function (LoadState) {
    LoadState[LoadState["LOADING"] = 1] = "LOADING";
    LoadState[LoadState["LOADED"] = 2] = "LOADED";
    LoadState[LoadState["ERROR"] = 3] = "ERROR";
})(LoadState || (LoadState = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["IMAGE"] = "image";
    ResourceType["APNG"] = "apng";
    ResourceType["JSON"] = "json";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
var ResourceRegistryEvent = (function (_super) {
    __extends(ResourceRegistryEvent, _super);
    function ResourceRegistryEvent(type, progress, currentTarget) {
        var _this = _super.call(this, type) || this;
        _this.progress = progress;
        _this.currentTarget = currentTarget;
        return _this;
    }
    return ResourceRegistryEvent;
}(Event_1.Event));
exports.ResourceRegistryEvent = ResourceRegistryEvent;
var ResourceRegistry = (function (_super) {
    __extends(ResourceRegistry, _super);
    function ResourceRegistry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = [];
        return _this;
    }
    ResourceRegistry.prototype.load = function (item) {
        switch (item.type) {
            case ResourceType.IMAGE:
                this.loadImage(item);
                break;
            case ResourceType.APNG:
                this.loadApng(item);
                break;
            case ResourceType.JSON:
                this.loadJson(item);
                break;
        }
    };
    ResourceRegistry.prototype.setAllowOriginPattern = function (pattern) {
        this.allowOriginPattern = pattern;
    };
    ResourceRegistry.prototype.isAllowOrigin = function (url) {
        if (!this.allowOriginPattern)
            return true;
        var origin = URLUtils_1.URLUtils.getOrigin(url);
        return origin === undefined || this.allowOriginPattern.test(url);
    };
    ResourceRegistry.prototype.loadImage = function (item) {
        var _this = this;
        Runtime_1.Runtime.get().loadImage({
            url: item.url,
            allowOrigin: this.isAllowOrigin(item.url),
            onLoad: function (image) {
                item.resource = image;
                _this.onLoad(item);
            },
            onError: function (error) {
                item.error = error;
                _this.onError(item);
            },
            onProgress: function (event) {
                item.loadedBytes = event.loadedBytes;
                item.totalBytes = event.totalBytes;
                _this.onProgress(item);
            }
        });
    };
    ResourceRegistry.prototype.loadJson = function (item) {
        var _this = this;
        Runtime_1.Runtime.get().loadText({
            url: item.url,
            allowOrigin: this.isAllowOrigin(item.url),
            onLoad: function (data) {
                item.resource = JSON.parse(data);
                _this.onLoad(item);
            },
            onError: function (error) {
                item.error = error;
                _this.onError(item);
            },
            onProgress: function (event) {
                item.loadedBytes = event.loadedBytes;
                item.totalBytes = event.totalBytes;
                _this.onProgress(item);
            }
        });
    };
    ResourceRegistry.prototype.loadApng = function (item) {
        var _this = this;
        Runtime_1.Runtime.get().loadArrayBuffer({
            url: item.url,
            allowOrigin: this.isAllowOrigin(item.url),
            onLoad: function (data) {
                var apng = ApngParser_1.ApngParser.parse(data);
                var opt = {
                    width: apng.width,
                    height: apng.height,
                    fps: (apng.frames.length * 1000) / apng.duration,
                    frames: [],
                    url: undefined,
                    image: undefined
                };
                for (var _i = 0, _a = apng.frames; _i < _a.length; _i++) {
                    var frame = _a[_i];
                    opt.frames.push({
                        destX: frame.left,
                        destY: frame.top,
                        destWidth: frame.width,
                        destHeight: frame.height,
                        image: frame.image
                    });
                }
                item.resource = opt;
                _this.onLoad(item);
            },
            onError: function (error) {
                console.warn('error while loading apng', error);
                item.error = error;
                _this.onError(item);
            },
            onProgress: function (event) {
                item.loadedBytes = event.loadedBytes;
                item.totalBytes = event.totalBytes;
                _this.onProgress(item);
            }
        });
    };
    ResourceRegistry.prototype.getTotalProgress = function () {
        var progress = 0;
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            progress += item.progress;
        }
        return progress / this.items.length;
    };
    ResourceRegistry.prototype.onProgress = function (item) {
        if (item.state === LoadState.LOADING && item.totalBytes > 0) {
            item.progress = item.loadedBytes / item.totalBytes;
        }
        this.dispatchEvent(new ResourceRegistryEvent('progress', this.getTotalProgress()));
        this.dispatchEvent(new ResourceRegistryEvent('itemprogress', item.totalBytes > 0 ? item.loadedBytes / item.totalBytes : 0, item));
    };
    ResourceRegistry.prototype.onLoad = function (item) {
        item.state = LoadState.LOADED;
        item.loadedBytes = item.totalBytes;
        if (item.progress < 1) {
            item.progress = 1;
            this.onProgress(item);
        }
        for (var _i = 0, _a = item.promiseHandlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.resolve(item.resource);
        }
        item.promiseHandlers = [];
        this.dispatchEvent(new ResourceRegistryEvent('load', 1, item));
        var done = true;
        for (var _b = 0, _c = this.items; _b < _c.length; _b++) {
            var i = _c[_b];
            if (i.state !== LoadState.LOADED) {
                done = false;
                break;
            }
        }
        if (done) {
            this.dispatchEvent(new ResourceRegistryEvent('done', 1));
        }
    };
    ResourceRegistry.prototype.onError = function (item) {
        item.state = LoadState.ERROR;
        for (var _i = 0, _a = item.promiseHandlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.reject(item.error);
        }
        item.promiseHandlers = [];
        this.dispatchEvent(new ResourceRegistryEvent('error', this.getTotalProgress(), item));
    };
    ResourceRegistry.prototype.add = function (url, type) {
        var _this = this;
        if (type === void 0) { type = ResourceType.IMAGE; }
        return new Promise(function (resolve, reject) {
            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.url === url) {
                    if (item.state === LoadState.LOADED) {
                        resolve(item.resource);
                    }
                    else if (item.state === LoadState.ERROR) {
                        reject(item.error);
                    }
                    else {
                        item.promiseHandlers.push({
                            resolve: resolve,
                            reject: reject
                        });
                    }
                    return;
                }
            }
            var newItem = {
                url: url,
                type: type,
                resource: undefined,
                state: LoadState.LOADING,
                progress: 0,
                loadedBytes: 0,
                totalBytes: 0,
                promiseHandlers: [{ resolve: resolve, reject: reject }]
            };
            _this.items.push(newItem);
            _this.load(newItem);
        });
    };
    ResourceRegistry.prototype.get = function (url) {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.url === url) {
                if (item.state === LoadState.LOADED) {
                    return item.resource;
                }
                else {
                    return undefined;
                }
            }
        }
        return undefined;
    };
    ResourceRegistry.prototype.release = function (url) {
        for (var i = 0; i < this.items.length; ++i) {
            var item = this.items[i];
            if (item.url === url) {
                this.items.splice(i, 1);
                item.promiseHandlers.length = 0;
                return item.resource;
            }
        }
        return undefined;
    };
    ResourceRegistry.DefaultInstance = new ResourceRegistry();
    return ResourceRegistry;
}(Event_1.EventDispatcher));
exports.ResourceRegistry = ResourceRegistry;


/***/ }),

/***/ "./src/resource/index.ts":
/*!*******************************!*\
  !*** ./src/resource/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./ResourceRegistry */ "./src/resource/ResourceRegistry.ts"));
__export(__webpack_require__(/*! ./ImageClip */ "./src/resource/ImageClip.ts"));


/***/ }),

/***/ "./src/runtime/Runtime.ts":
/*!********************************!*\
  !*** ./src/runtime/Runtime.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var WebpageRuntime_1 = __webpack_require__(/*! ./WebpageRuntime */ "./src/runtime/WebpageRuntime.ts");
var WechatMiniGameRuntime_1 = __webpack_require__(/*! ./WechatMiniGameRuntime */ "./src/runtime/WechatMiniGameRuntime.ts");
var WechatMiniProgramRuntime_1 = __webpack_require__(/*! ./WechatMiniProgramRuntime */ "./src/runtime/WechatMiniProgramRuntime.ts");
var RuntimeType;
(function (RuntimeType) {
    RuntimeType["WEBPAGE"] = "webpage";
    RuntimeType["WECHAT_MINI_GAME"] = "wechat_mini_game";
    RuntimeType["WECHAT_MINI_PROGRAM"] = "wechat_mini_program";
})(RuntimeType = exports.RuntimeType || (exports.RuntimeType = {}));
var Runtime = (function () {
    function Runtime() {
    }
    Runtime.setRuntimeType = function (runtimeType) {
        if (this.runtimeType !== runtimeType) {
            this.runtimeType = runtimeType;
            delete this.runtime;
        }
    };
    Runtime.getRuntimeType = function () {
        return this.runtimeType;
    };
    Runtime.get = function () {
        if (!this.runtime) {
            switch (this.runtimeType) {
                case RuntimeType.WEBPAGE:
                    this.runtime = new WebpageRuntime_1.WebpageRuntime();
                    break;
                case RuntimeType.WECHAT_MINI_GAME:
                    this.runtime = new WechatMiniGameRuntime_1.WechatMiniGameRuntime();
                    break;
                case RuntimeType.WECHAT_MINI_PROGRAM:
                    this.runtime = new WechatMiniProgramRuntime_1.WechatMiniProgramRuntime();
                    break;
            }
        }
        return this.runtime;
    };
    Runtime.runtimeType = RuntimeType.WEBPAGE;
    return Runtime;
}());
exports.Runtime = Runtime;


/***/ }),

/***/ "./src/runtime/WebpageRuntime.ts":
/*!***************************************!*\
  !*** ./src/runtime/WebpageRuntime.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TouchItem_1 = __webpack_require__(/*! ../components/TouchItem */ "./src/components/TouchItem.ts");
var WebpageRuntime = (function () {
    function WebpageRuntime() {
        this.canvasCache = [];
    }
    WebpageRuntime.prototype.newCanvas = function () {
        if (this.canvasCache.length > 0) {
            return this.canvasCache.shift();
        }
        else {
            return document.createElement('canvas');
        }
    };
    WebpageRuntime.prototype.releaseCanvas = function (canvas) {
        this.canvasCache.push(canvas);
    };
    WebpageRuntime.prototype.newImage = function () {
        return new Image();
    };
    WebpageRuntime.prototype.loadArrayBuffer = function (task) {
        this.loadByType(task, 'arraybuffer');
    };
    WebpageRuntime.prototype.loadText = function (task) {
        this.loadByType(task, 'text');
    };
    WebpageRuntime.prototype.loadByType = function (task, type) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = type;
        xhr.open(task.method || 'GET', task.url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                task.onLoad(xhr.response);
            }
        };
        xhr.onerror = function (event) {
            task.onError(event);
        };
        xhr.onprogress = function (event) {
            if (event.lengthComputable) {
                task.onProgress({
                    loadedBytes: event.loaded,
                    totalBytes: event.total
                });
            }
        };
        xhr.send();
    };
    WebpageRuntime.prototype.loadImage = function (task) {
        if (!task.allowOrigin) {
            this.loadImageByImageObject(task);
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.open(task.method || 'GET', task.url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var url_1 = URL.createObjectURL(xhr.response);
                var image_1 = new Image();
                image_1.src = url_1;
                image_1.onload = function () {
                    URL.revokeObjectURL(url_1);
                    task.onLoad(image_1);
                };
                image_1.onerror = function (e) {
                    URL.revokeObjectURL(url_1);
                    task.onError(e);
                };
            }
        };
        xhr.onerror = function (event) {
            task.onError(event);
        };
        xhr.onprogress = function (event) {
            if (event.lengthComputable) {
                task.onProgress({
                    loadedBytes: event.loaded,
                    totalBytes: event.total
                });
            }
        };
        xhr.send();
    };
    WebpageRuntime.prototype.loadImageByImageObject = function (task) {
        var img = new Image();
        img.onload = function () {
            task.onLoad(img);
        };
        img.onerror = function (e) {
            task.onError(e);
        };
        img.src = task.url;
    };
    WebpageRuntime.prototype.enableEvents = function (stage) {
        var _this = this;
        stage.canvas.onpointerdown = function (e) {
            stage.canvas.setPointerCapture(e.pointerId);
        };
        stage.canvas.onpointerup = function (e) {
            stage.canvas.releasePointerCapture(e.pointerId);
        };
        stage.canvas.addEventListener('mousedown', function (e) {
            _this.handleMouseEvent('mousedown', stage, e);
        });
        stage.canvas.addEventListener('mousemove', function (e) {
            _this.handleMouseEvent('mousemove', stage, e);
        });
        stage.canvas.addEventListener('pressmove', function (e) {
            _this.handleMouseEvent('mousemove', stage, e);
        });
        stage.canvas.addEventListener('mouseup', function (e) {
            _this.handleMouseEvent('mouseup', stage, e);
        });
        stage.canvas.addEventListener('mouseenter', function (e) {
            _this.handleMouseEvent('mouseenter', stage, e);
        });
        stage.canvas.addEventListener('mouseleave', function (e) {
            _this.handleMouseEvent('mouseleave', stage, e);
        });
        stage.canvas.addEventListener('mousewheel', function (e) {
            _this.handleMouseWheelEvent(stage, e);
        });
        stage.canvas.addEventListener('touchstart', function (e) {
            _this.handleTouchEvent('touchstart', stage, e);
        });
        stage.canvas.addEventListener('touchend', function (e) {
            _this.handleTouchEvent('touchend', stage, e);
        });
        stage.canvas.addEventListener('touchmove', function (e) {
            _this.handleTouchEvent('touchmove', stage, e);
        });
        stage.canvas.addEventListener('touchcancel', function (e) {
            _this.handleTouchEvent('touchcancel', stage, e);
        });
    };
    WebpageRuntime.prototype.requestAnimationFrame = function (listener) {
        requestAnimationFrame(listener);
    };
    WebpageRuntime.prototype.handleMouseEvent = function (type, stage, e) {
        e.preventDefault();
        var scaleX = stage.canvas.width / stage.canvas.clientWidth;
        var scaleY = stage.canvas.height / stage.canvas.clientHeight;
        var x = e.offsetX * scaleX;
        var y = e.offsetY * scaleY;
        stage.handleMouseOrTouchEvent(type, [new TouchItem_1.TouchItem(0, stage, x, y, Date.now())], e);
    };
    WebpageRuntime.prototype.handleMouseWheelEvent = function (stage, e) {
        e.preventDefault();
        var scaleX = stage.canvas.width / stage.canvas.clientWidth;
        var scaleY = stage.canvas.height / stage.canvas.clientHeight;
        stage.handleMouseWheelEvent(e.offsetX * scaleX, e.offsetY * scaleY, e.deltaX, e.deltaY, e);
    };
    WebpageRuntime.prototype.handleTouchEvent = function (type, stage, e) {
        e.preventDefault();
        var scaleX = stage.canvas.width / stage.canvas.clientWidth;
        var scaleY = stage.canvas.height / stage.canvas.clientHeight;
        var touches = [];
        var now = Date.now();
        for (var _i = 0, _a = e.touches; _i < _a.length; _i++) {
            var touch = _a[_i];
            touches.push(new TouchItem_1.TouchItem(touch.identifier, stage, touch.clientX * scaleX, touch.clientY * scaleY, now));
        }
        stage.handleMouseOrTouchEvent(type, touches, e);
    };
    return WebpageRuntime;
}());
exports.WebpageRuntime = WebpageRuntime;


/***/ }),

/***/ "./src/runtime/WechatMiniGameRuntime.ts":
/*!**********************************************!*\
  !*** ./src/runtime/WechatMiniGameRuntime.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TouchItem_1 = __webpack_require__(/*! ../components/TouchItem */ "./src/components/TouchItem.ts");
var URLUtils_1 = __webpack_require__(/*! ../utils/URLUtils */ "./src/utils/URLUtils.ts");
var WechatMiniGameRuntime = (function () {
    function WechatMiniGameRuntime() {
        this.canvasCache = [];
        this.systemInfo = wx.getSystemInfoSync();
    }
    WechatMiniGameRuntime.prototype.newCanvas = function () {
        if (!this.gameCanvas) {
            this.gameCanvas = wx.createCanvas();
        }
        if (this.canvasCache.length > 0) {
            return this.canvasCache.shift();
        }
        return wx.createCanvas();
    };
    WechatMiniGameRuntime.prototype.releaseCanvas = function (canvas) {
        this.canvasCache.push(canvas);
    };
    WechatMiniGameRuntime.prototype.newImage = function () {
        return wx.createImage();
    };
    WechatMiniGameRuntime.prototype.loadText = function (task) {
        if (URLUtils_1.URLUtils.isAbsolute(task.url)) {
            wx.request({
                url: task.url,
                method: task.method || 'GET',
                responseType: 'text',
                success: function (res) {
                    task.onLoad(res.data);
                },
                fail: function (error) {
                    task.onError(error);
                }
            });
        }
        else {
            wx.getFileSystemManager().readFile({
                filePath: task.url,
                encoding: 'utf-8',
                success: function (e) {
                    task.onLoad(e.data);
                },
                fail: function (e) {
                    task.onError(e);
                }
            });
        }
    };
    WechatMiniGameRuntime.prototype.loadArrayBuffer = function (task) {
        if (URLUtils_1.URLUtils.isAbsolute(task.url)) {
            wx.request({
                url: task.url,
                method: task.method || 'GET',
                responseType: 'arraybuffer',
                success: function (res) {
                    task.onLoad(res.data);
                },
                fail: function (error) {
                    task.onError(error);
                }
            });
        }
        else {
            wx.getFileSystemManager().readFile({
                filePath: task.url,
                success: function (e) {
                    task.onLoad(e.data);
                },
                fail: function (e) {
                    task.onError(e);
                }
            });
        }
    };
    WechatMiniGameRuntime.prototype.loadImage = function (task) {
        var _this = this;
        if (URLUtils_1.URLUtils.isAbsolute(task.url)) {
            var downloader = wx.downloadFile({
                url: task.url,
                success: function (res) {
                    if (res.statusCode === 200) {
                        var img_1 = _this.newImage();
                        img_1.src = res.tempFilePath;
                        img_1.onload = function () {
                            task.onLoad(img_1);
                        };
                        img_1.onerror = function (e) {
                            task.onError(e);
                        };
                    }
                    else {
                        task.onError({ msg: 'download failed, code:' + res.statusCode });
                    }
                },
                fail: function (e) {
                    task.onError(e);
                }
            });
            downloader.onProgressUpdate = function (event) {
                task.onProgress({
                    loadedBytes: event.totalBytesWritten,
                    totalBytes: event.totalBytesExpectedToWrite
                });
            };
        }
        else {
            var img_2 = this.newImage();
            img_2.src = task.url;
            img_2.onload = function () {
                task.onLoad(img_2);
            };
            img_2.onerror = function (e) {
                task.onError(e);
            };
        }
    };
    WechatMiniGameRuntime.prototype.getGameCanvas = function () {
        if (!this.gameCanvas) {
            this.gameCanvas = wx.createCanvas();
        }
        return this.gameCanvas;
    };
    WechatMiniGameRuntime.prototype.enableEvents = function (stage) {
        var _this = this;
        wx.onTouchStart(function (e) {
            _this.handleTouchEvent('touchstart', stage, e);
        });
        wx.onTouchMove(function (e) {
            _this.handleTouchEvent('touchmove', stage, e);
        });
        wx.onTouchEnd(function (e) {
            _this.handleTouchEvent('touchend', stage, e);
        });
        wx.onTouchCancel(function (e) {
            _this.handleTouchEvent('touchcancel', stage, e);
        });
    };
    WechatMiniGameRuntime.prototype.requestAnimationFrame = function (listener) {
        requestAnimationFrame(listener);
    };
    WechatMiniGameRuntime.prototype.handleTouchEvent = function (type, stage, e) {
        var scaleX = stage.canvas.width / this.systemInfo.windowWidth;
        var scaleY = stage.canvas.height / this.systemInfo.windowHeight;
        var touches = [];
        var now = Date.now();
        for (var _i = 0, _a = e.touches; _i < _a.length; _i++) {
            var touch = _a[_i];
            touches.push(new TouchItem_1.TouchItem(touch.identifier, stage, touch.clientX * scaleX, touch.clientY * scaleY, now));
        }
        stage.handleMouseOrTouchEvent(type, touches, e);
    };
    return WechatMiniGameRuntime;
}());
exports.WechatMiniGameRuntime = WechatMiniGameRuntime;


/***/ }),

/***/ "./src/runtime/WechatMiniProgramRuntime.ts":
/*!*************************************************!*\
  !*** ./src/runtime/WechatMiniProgramRuntime.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TouchItem_1 = __webpack_require__(/*! ../components/TouchItem */ "./src/components/TouchItem.ts");
var URLUtils_1 = __webpack_require__(/*! ../utils/URLUtils */ "./src/utils/URLUtils.ts");
var WechatMiniProgramRuntime = (function () {
    function WechatMiniProgramRuntime() {
        this.canvasCache = [];
    }
    WechatMiniProgramRuntime.prototype.setWxCanvas = function (wxCanvas) {
        this.wxCanvas = wxCanvas;
    };
    WechatMiniProgramRuntime.prototype.newCanvas = function () {
        if (this.canvasCache.length > 0) {
            return this.canvasCache.shift();
        }
        return wx.createOffscreenCanvas();
    };
    WechatMiniProgramRuntime.prototype.releaseCanvas = function (canvas) {
        this.canvasCache.push(canvas);
    };
    WechatMiniProgramRuntime.prototype.newImage = function () {
        return this.wxCanvas.createImage();
    };
    WechatMiniProgramRuntime.prototype.loadText = function (task) {
        if (URLUtils_1.URLUtils.isAbsolute(task.url)) {
            wx.request({
                url: task.url,
                method: task.method || 'GET',
                responseType: 'text',
                success: function (res) {
                    task.onLoad(res.data);
                },
                fail: function (error) {
                    task.onError(error);
                }
            });
        }
        else {
            wx.getFileSystemManager().readFile({
                filePath: task.url,
                encoding: 'utf-8',
                success: function (e) {
                    task.onLoad(e.data);
                },
                fail: function (e) {
                    task.onError(e);
                }
            });
        }
    };
    WechatMiniProgramRuntime.prototype.loadArrayBuffer = function (task) {
        if (URLUtils_1.URLUtils.isAbsolute(task.url)) {
            wx.request({
                url: task.url,
                method: task.method || 'GET',
                responseType: 'arraybuffer',
                success: function (res) {
                    task.onLoad(res.data);
                },
                fail: function (error) {
                    task.onError(error);
                }
            });
        }
        else {
            wx.getFileSystemManager().readFile({
                filePath: task.url,
                success: function (e) {
                    task.onLoad(e.data);
                },
                fail: function (e) {
                    task.onError(e);
                }
            });
        }
    };
    WechatMiniProgramRuntime.prototype.loadImage = function (task) {
        var _this = this;
        if (URLUtils_1.URLUtils.isAbsolute(task.url)) {
            var downloader = wx.downloadFile({
                url: task.url,
                success: function (res) {
                    if (res.statusCode === 200) {
                        var img_1 = _this.newImage();
                        img_1.src = res.tempFilePath;
                        img_1.onload = function () {
                            task.onLoad(img_1);
                        };
                        img_1.onerror = function (e) {
                            task.onError(e);
                        };
                    }
                    else {
                        task.onError({ msg: 'download failed, code:' + res.statusCode });
                    }
                },
                fail: function (e) {
                    task.onError(e);
                }
            });
            downloader.onProgressUpdate = function (event) {
                task.onProgress({
                    loadedBytes: event.totalBytesWritten,
                    totalBytes: event.totalBytesExpectedToWrite
                });
            };
        }
        else {
            var img_2 = this.newImage();
            img_2.src = task.url;
            img_2.onload = function () {
                task.onLoad(img_2);
            };
            img_2.onerror = function (e) {
                task.onError(e);
            };
        }
    };
    WechatMiniProgramRuntime.prototype.enableEvents = function (stage) {
        return;
    };
    WechatMiniProgramRuntime.prototype.requestAnimationFrame = function (listener) {
        this.wxCanvas.requestAnimationFrame(listener);
    };
    WechatMiniProgramRuntime.prototype.handleTouchEvent = function (type, stage, e) {
        var scaleX = stage.canvas.clientWidth ? stage.canvas.width / stage.canvas.clientWidth : 1;
        var scaleY = stage.canvas.clientHeight ? stage.canvas.height / stage.canvas.clientHeight : 1;
        var touches = [];
        var now = Date.now();
        for (var _i = 0, _a = e.touches; _i < _a.length; _i++) {
            var touch = _a[_i];
            touches.push(new TouchItem_1.TouchItem(touch.identifier, stage, touch.x * scaleX, touch.y * scaleY, now));
        }
        stage.handleMouseOrTouchEvent(type, touches, e);
    };
    return WechatMiniProgramRuntime;
}());
exports.WechatMiniProgramRuntime = WechatMiniProgramRuntime;


/***/ }),

/***/ "./src/runtime/index.ts":
/*!******************************!*\
  !*** ./src/runtime/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./Runtime */ "./src/runtime/Runtime.ts"));
__export(__webpack_require__(/*! ./WebpageRuntime */ "./src/runtime/WebpageRuntime.ts"));
__export(__webpack_require__(/*! ./WechatMiniGameRuntime */ "./src/runtime/WechatMiniGameRuntime.ts"));
__export(__webpack_require__(/*! ./WechatMiniProgramRuntime */ "./src/runtime/WechatMiniProgramRuntime.ts"));


/***/ }),

/***/ "./src/style/Background.ts":
/*!*********************************!*\
  !*** ./src/style/Background.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BaseValue_1 = __webpack_require__(/*! ../base/BaseValue */ "./src/base/BaseValue.ts");
var Color_1 = __webpack_require__(/*! ../base/Color */ "./src/base/Color.ts");
var Rect_1 = __webpack_require__(/*! ../base/Rect */ "./src/base/Rect.ts");
var CSSTokenizer_1 = __webpack_require__(/*! ../parser/CSSTokenizer */ "./src/parser/CSSTokenizer.ts");
var FunctionParser_1 = __webpack_require__(/*! ../parser/FunctionParser */ "./src/parser/FunctionParser.ts");
var resource_1 = __webpack_require__(/*! ../resource */ "./src/resource/index.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ../resource/ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var Runtime_1 = __webpack_require__(/*! ../runtime/Runtime */ "./src/runtime/Runtime.ts");
var EnumUtils_1 = __webpack_require__(/*! ../utils/EnumUtils */ "./src/utils/EnumUtils.ts");
var StyleUtils_1 = __webpack_require__(/*! ../utils/StyleUtils */ "./src/utils/StyleUtils.ts");
var BG_TOKENIZER = new CSSTokenizer_1.CSSTokenizer('/');
var BackgroundAttachment;
(function (BackgroundAttachment) {
    BackgroundAttachment["SCROLL"] = "scroll";
})(BackgroundAttachment = exports.BackgroundAttachment || (exports.BackgroundAttachment = {}));
var URLSource = (function () {
    function URLSource(url) {
        this.url = url;
        this.imageClip = resource_1.ImageClip.of(url);
        ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(url, ResourceRegistry_1.ResourceType.IMAGE);
    }
    URLSource.of = function (args) {
        return new URLSource(args[0]);
    };
    URLSource.prototype.draw = function (ctx, rect, srcRect) {
        this.imageClip.draw(ctx, rect, srcRect);
    };
    URLSource.prototype.ready = function () {
        return this.imageClip.ready();
    };
    URLSource.prototype.width = function (originRect) {
        return this.imageClip.getWidth();
    };
    URLSource.prototype.height = function (originRect) {
        return this.imageClip.getHeight();
    };
    URLSource.prototype.toString = function () {
        return "url(" + this.url + ")";
    };
    URLSource.prototype.clone = function () {
        return new URLSource(this.url);
    };
    URLSource.prototype.destroy = function () {
        return;
    };
    return URLSource;
}());
exports.URLSource = URLSource;
var LinearGradientSource = (function () {
    function LinearGradientSource(value) {
        this.parameters = value;
    }
    LinearGradientSource.of = function (args) {
        return new LinearGradientSource(args);
    };
    LinearGradientSource.prototype.draw = function (ctx, rect, srcRect) {
        if (this.parameters.length === 0) {
            return undefined;
        }
        var width = Math.round(rect.width);
        var height = Math.round(rect.height);
        if (this.canvas && this.canvas.width === width && this.canvas.height === height) {
            return this.canvas;
        }
        if (!this.canvas) {
            this.canvas = Runtime_1.Runtime.get().newCanvas();
        }
        if (this.canvas.width !== width) {
            this.canvas.width = width;
        }
        if (this.canvas.height !== height) {
            this.canvas.height = height;
        }
        var canvasCtx = this.canvas.getContext('2d');
        if (!canvasCtx) {
            return undefined;
        }
        var i = 0;
        var gradient;
        if (this.parameters[0].startsWith('to')) {
            var where = this.parameters[0].substring(2).replace(/\s+/g, '');
            if (where === 'left') {
                gradient = canvasCtx.createLinearGradient(width - 1, 0, 0, 0);
            }
            else if (where === 'right') {
                gradient = canvasCtx.createLinearGradient(0, 0, width - 1, 0);
            }
            else if (where === 'top') {
                gradient = canvasCtx.createLinearGradient(0, height - 1, 0, 0);
            }
            else if (where === 'bottom') {
                gradient = canvasCtx.createLinearGradient(0, 0, 0, height - 1);
            }
            else if (where === 'lefttop') {
                gradient = canvasCtx.createLinearGradient(width - 1, height - 1, 0, 0);
            }
            else if (where === 'leftbottom') {
                gradient = canvasCtx.createLinearGradient(width - 1, 0, 0, height - 1);
            }
            else if (where === 'righttop') {
                gradient = canvasCtx.createLinearGradient(0, height - 1, width - 1, 0);
            }
            else if (where === 'rightbottom') {
                gradient = canvasCtx.createLinearGradient(0, 0, width - 1, height - 1);
            }
            else {
                gradient = canvasCtx.createLinearGradient(0, 0, 0, height - 1);
            }
            i++;
        }
        else if (this.parameters[0].endsWith('deg')) {
            gradient = canvasCtx.createLinearGradient(0, 0, width - 1, height - 1);
            i++;
        }
        if (!gradient) {
            gradient = canvasCtx.createLinearGradient(0, 0, 0, height - 1);
        }
        for (var last = -1; i < this.parameters.length; ++i) {
            var parts = this.parameters[i].split(/\s+/);
            var color = parts[0];
            if (parts.length < 2) {
                if (last === -1) {
                    last = 0;
                    gradient.addColorStop(0, color);
                }
                else {
                    var next = 1;
                    var size = 0;
                    for (var j = i + 1; j < this.parameters.length; ++j) {
                        ++size;
                        var ps = this.parameters[j].split(/\s+/);
                        if (ps.length > 1) {
                            next = parseFloat(ps[1]) / 100;
                            break;
                        }
                    }
                    if (size === 0) {
                        last = 1;
                    }
                    else {
                        last = last + (next - last) / (size + 1);
                    }
                    gradient.addColorStop(last, color);
                }
            }
            else {
                for (var j = 1; j < parts.length; ++j) {
                    last = parseFloat(parts[j]) / 100;
                    gradient.addColorStop(last, color);
                }
            }
        }
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(0, 0, width, height);
        ctx.drawImage(this.canvas, 0, 0, width, height, rect.x, rect.y, rect.width, rect.height);
    };
    LinearGradientSource.prototype.ready = function () {
        return true;
    };
    LinearGradientSource.prototype.width = function (originRect) {
        return originRect.width;
    };
    LinearGradientSource.prototype.height = function (originRect) {
        return originRect.height;
    };
    LinearGradientSource.prototype.toString = function () {
        return "linear-gradient(" + this.parameters.join(',') + ")";
    };
    LinearGradientSource.prototype.clone = function () {
        return new LinearGradientSource(this.parameters);
    };
    LinearGradientSource.prototype.destroy = function () {
        if (this.canvas) {
            Runtime_1.Runtime.get().releaseCanvas(this.canvas);
            this.canvas = undefined;
        }
    };
    return LinearGradientSource;
}());
exports.LinearGradientSource = LinearGradientSource;
var NinePatchSource = (function () {
    function NinePatchSource(imageClip, top, right, bottom, left) {
        this.imageClip = imageClip;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
        ResourceRegistry_1.ResourceRegistry.DefaultInstance.add(this.imageClip.getSrc(), ResourceRegistry_1.ResourceType.IMAGE);
    }
    NinePatchSource.of = function (args) {
        var padding = StyleUtils_1.StyleUtils.parse4Dirs(args[1]);
        return new NinePatchSource(resource_1.ImageClip.of(args[0]), padding[0], padding[1], padding[2], padding[3]);
    };
    NinePatchSource.prototype.draw = function (ctx, rect, srcRect) {
        if (!this.ready())
            return;
        var width = this.imageClip.getWidth();
        var height = this.imageClip.getHeight();
        var left = this.left.getValue(width);
        var right = this.right.getValue(width);
        var xcenter = width - left - right;
        if (xcenter < 0) {
            left = Math.round((left / (left + right)) * width);
            right = width - left;
            xcenter = 0;
        }
        if (left + right > rect.width) {
            left = Math.round((left / (left + right)) * rect.width);
            right = rect.width - left;
            xcenter = 0;
        }
        var top = this.top.getValue(height);
        var bottom = this.bottom.getValue(height);
        var ycenter = height - top - bottom;
        if (ycenter < 0) {
            top = Math.round((top / (top + bottom)) * height);
            bottom = height - top;
            ycenter = 0;
        }
        if (top + bottom > rect.height) {
            top = Math.round((top / (top + bottom)) * rect.height);
            bottom = rect.height - top;
            ycenter = 0;
        }
        if (top > 0) {
            if (left > 0) {
                this.imageClip.draw(ctx, new Rect_1.Rect(rect.x, rect.y, left, top), new Rect_1.Rect(0, 0, left, top));
            }
            if (xcenter > 0 && rect.width - left - right > 0) {
                this.imageClip.draw(ctx, new Rect_1.Rect(rect.x + left, rect.y, rect.width - left - right, top), new Rect_1.Rect(left, 0, xcenter, top));
            }
            if (right > 0) {
                this.imageClip.draw(ctx, new Rect_1.Rect(rect.x + rect.width - right, rect.y, right, top), new Rect_1.Rect(width - right, 0, right, top));
            }
        }
        if (ycenter > 0) {
            var y1 = rect.y + top;
            var h = rect.height - top - bottom;
            if (h > 0) {
                if (left > 0) {
                    this.imageClip.draw(ctx, new Rect_1.Rect(rect.x, y1, left, h), new Rect_1.Rect(0, top, left, ycenter));
                }
                if (xcenter > 0 && rect.width - left - right > 0) {
                    this.imageClip.draw(ctx, new Rect_1.Rect(rect.x + left, y1, rect.width - left - right, h), new Rect_1.Rect(left, top, xcenter, ycenter));
                }
                if (right > 0) {
                    this.imageClip.draw(ctx, new Rect_1.Rect(rect.x + rect.width - right, y1, right, h), new Rect_1.Rect(width - right, top, right, ycenter));
                }
            }
        }
        if (bottom > 0) {
            var y1 = rect.y + rect.height - bottom;
            var y2 = height - bottom;
            if (left > 0) {
                this.imageClip.draw(ctx, new Rect_1.Rect(rect.x, y1, left, bottom), new Rect_1.Rect(0, y2, left, bottom));
            }
            if (xcenter > 0 && rect.width - left - right > 0) {
                this.imageClip.draw(ctx, new Rect_1.Rect(rect.x + left, y1, rect.width - left - right, bottom), new Rect_1.Rect(left, y2, xcenter, bottom));
            }
            if (right > 0) {
                this.imageClip.draw(ctx, new Rect_1.Rect(rect.x + rect.width - right, y1, right, bottom), new Rect_1.Rect(width - right, y2, right, bottom));
            }
        }
    };
    NinePatchSource.prototype.toString = function () {
        return "9patch(" + this.args.join(',') + ")";
    };
    NinePatchSource.prototype.ready = function () {
        return true;
    };
    NinePatchSource.prototype.width = function (originRect) {
        return originRect.width;
    };
    NinePatchSource.prototype.height = function (originRect) {
        return originRect.height;
    };
    NinePatchSource.prototype.clone = function () {
        return new NinePatchSource(this.imageClip.clone(), this.top.clone(), this.right.clone(), this.bottom.clone(), this.left.clone());
    };
    NinePatchSource.prototype.destroy = function () { };
    return NinePatchSource;
}());
exports.NinePatchSource = NinePatchSource;
var BackgroundRepeatType;
(function (BackgroundRepeatType) {
    BackgroundRepeatType["REPEAT"] = "repeat";
    BackgroundRepeatType["NO_REPEAT"] = "no-repeat";
    BackgroundRepeatType["SPACE"] = "space";
    BackgroundRepeatType["ROUND"] = "round";
})(BackgroundRepeatType = exports.BackgroundRepeatType || (exports.BackgroundRepeatType = {}));
var BackgroundRepeat = (function () {
    function BackgroundRepeat(x, y) {
        this.x = x;
        this.y = y;
    }
    BackgroundRepeat.of = function (tokens) {
        if (tokens.length === 1) {
            var token = tokens[0];
            if (token === 'repeat-x') {
                return new BackgroundRepeat(BackgroundRepeatType.REPEAT, BackgroundRepeatType.NO_REPEAT);
            }
            else if (token === 'repeat-y') {
                return new BackgroundRepeat(BackgroundRepeatType.NO_REPEAT, BackgroundRepeatType.REPEAT);
            }
            else if (token === 'repeat') {
                return new BackgroundRepeat(BackgroundRepeatType.REPEAT, BackgroundRepeatType.REPEAT);
            }
            else if (token === 'space') {
                return new BackgroundRepeat(BackgroundRepeatType.SPACE, BackgroundRepeatType.SPACE);
            }
            else if (token === 'round') {
                return new BackgroundRepeat(BackgroundRepeatType.ROUND, BackgroundRepeatType.ROUND);
            }
            else if (token === 'no-repeat') {
                return new BackgroundRepeat(BackgroundRepeatType.NO_REPEAT, BackgroundRepeatType.NO_REPEAT);
            }
            else {
                return undefined;
            }
        }
        else if (tokens.length === 2) {
            var x = EnumUtils_1.EnumUtils.fromStringOrUndefined(BackgroundRepeatType, tokens[0]);
            var y = EnumUtils_1.EnumUtils.fromStringOrUndefined(BackgroundRepeatType, tokens[1]);
            if (!x || !y) {
                return undefined;
            }
            return new BackgroundRepeat(x, x);
        }
        else {
            return undefined;
        }
    };
    BackgroundRepeat.prototype.clone = function () {
        return new BackgroundRepeat(this.x, this.y);
    };
    BackgroundRepeat.DEFAULT = new BackgroundRepeat(BackgroundRepeatType.REPEAT, BackgroundRepeatType.REPEAT);
    return BackgroundRepeat;
}());
var BackgroundClip;
(function (BackgroundClip) {
    BackgroundClip["BORDER_BOX"] = "border-box";
    BackgroundClip["PADDING_BOX"] = "padding-box";
    BackgroundClip["CONTENT_BOX"] = "content-box";
})(BackgroundClip = exports.BackgroundClip || (exports.BackgroundClip = {}));
var BackgroundSizeType;
(function (BackgroundSizeType) {
    BackgroundSizeType["AUTO"] = "auto";
    BackgroundSizeType["COVER"] = "cover";
    BackgroundSizeType["CONTAIN"] = "contain";
    BackgroundSizeType["VALUE"] = "value";
})(BackgroundSizeType = exports.BackgroundSizeType || (exports.BackgroundSizeType = {}));
var BackgroundSize = (function () {
    function BackgroundSize(xType, x, yType, y) {
        this.x = x;
        this.xType = xType;
        this.y = y;
        this.yType = yType;
    }
    BackgroundSize.of = function (tokens) {
        var xType;
        var x = BaseValue_1.BaseValue.ZERO;
        var yType;
        var y = BaseValue_1.BaseValue.ZERO;
        if (tokens.length === 1) {
            var token = tokens[0];
            if (token === 'auto') {
                xType = yType = BackgroundSizeType.AUTO;
            }
            else if (token === 'cover') {
                xType = yType = BackgroundSizeType.COVER;
            }
            else if (token === 'contain') {
                xType = yType = BackgroundSizeType.CONTAIN;
            }
            else {
                x = y = BaseValue_1.BaseValue.of(token);
                if (!y)
                    return undefined;
            }
        }
        else if (tokens.length === 2) {
            if (tokens[0] === 'auto') {
                xType = BackgroundSizeType.AUTO;
            }
            else {
                xType = BackgroundSizeType.VALUE;
                x = BaseValue_1.BaseValue.of(tokens[0], true);
                if (!x)
                    return undefined;
            }
            if (tokens[1] === 'auto') {
                yType = BackgroundSizeType.AUTO;
            }
            else {
                yType = BackgroundSizeType.VALUE;
                y = BaseValue_1.BaseValue.of(tokens[1], true);
                if (!y)
                    return undefined;
            }
        }
        else {
            return undefined;
        }
        return new BackgroundSize(xType, x, yType, y);
    };
    BackgroundSize.prototype.clone = function () {
        return new BackgroundSize(this.xType, this.x.clone(), this.yType, this.y.clone());
    };
    BackgroundSize.DEFAULT = new BackgroundSize(BackgroundSizeType.AUTO, BaseValue_1.BaseValue.ZERO, BackgroundSizeType.AUTO, BaseValue_1.BaseValue.ZERO);
    return BackgroundSize;
}());
var BackgroundPositionType;
(function (BackgroundPositionType) {
    BackgroundPositionType["LEFT"] = "left";
    BackgroundPositionType["TOP"] = "top";
    BackgroundPositionType["CENTER"] = "center";
    BackgroundPositionType["BOTTOM"] = "bottom";
    BackgroundPositionType["RIGHT"] = "right";
})(BackgroundPositionType || (BackgroundPositionType = {}));
var BackgroundPosition = (function () {
    function BackgroundPosition(xDir, x, yDir, y) {
        this.xDir = xDir;
        this.x = x;
        this.yDir = yDir;
        this.y = y;
    }
    BackgroundPosition.acceptToken = function (token) {
        var pattern = /^(left|center|right|top|bottom|[0-9\.]+|[0-9\.]+px|[0-9\.]+%)$/;
        return pattern.test(token);
    };
    BackgroundPosition.of = function (tokens) {
        var xDir;
        var yDir;
        var x;
        var y;
        if (tokens.length === 1) {
            var token = tokens[0];
            x = BaseValue_1.BaseValue.ZERO;
            y = BaseValue_1.BaseValue.ZERO;
            if (token === 'left' || token === 'right') {
                xDir = token;
                yDir = BackgroundPositionType.CENTER;
            }
            if (token === 'top' || token === 'bottom') {
                xDir = BackgroundPositionType.CENTER;
                yDir = token;
            }
            if (token === 'center') {
                xDir = BackgroundPositionType.CENTER;
                yDir = BackgroundPositionType.CENTER;
            }
            else {
                xDir = BackgroundPositionType.LEFT;
                x = BaseValue_1.BaseValue.of(token);
                yDir = BackgroundPositionType.CENTER;
            }
        }
        else if (tokens.length === 2) {
            var tokenX = tokens[0];
            var tokenY = tokens[1];
            if (tokenX === 'top' || tokenX === 'bottom' || tokenY === 'left' || tokenY === 'right') {
                tokenX = tokens[1];
                tokenY = tokens[0];
            }
            if (tokenX === 'left' || tokenX === 'right' || tokenX === 'center') {
                xDir = tokenX;
                x = BaseValue_1.BaseValue.ZERO;
            }
            else {
                xDir = BackgroundPositionType.LEFT;
                x = BaseValue_1.BaseValue.of(tokenX);
                if (!x) {
                    return undefined;
                }
            }
            if (tokenY === 'top' || tokenY === 'bottom' || tokenY === 'center') {
                yDir = tokenY;
                y = BaseValue_1.BaseValue.ZERO;
            }
            else {
                yDir = BackgroundPositionType.TOP;
                y = BaseValue_1.BaseValue.of(tokenY);
                if (!y) {
                    return undefined;
                }
            }
        }
        else if (tokens.length === 3) {
            if (tokens[0] === 'left' || tokens[0] === 'right') {
                xDir = tokens[0];
                x = BaseValue_1.BaseValue.of(tokens[1]);
                if (x) {
                    if (tokens[2] === 'top' || tokens[2] === 'bottom' || tokens[2] === 'center') {
                        yDir = tokens[2];
                        y = BaseValue_1.BaseValue.ZERO;
                    }
                    else {
                        return undefined;
                    }
                }
                else {
                    x = BaseValue_1.BaseValue.ZERO;
                    if (tokens[1] === 'top' || tokens[1] === 'bottom' || tokens[1] === 'center') {
                        yDir = tokens[1];
                        y = BaseValue_1.BaseValue.of(tokens[2]);
                        if (!y)
                            return undefined;
                    }
                    else {
                        return undefined;
                    }
                }
            }
            else if (tokens[0] === 'top' || tokens[0] === 'bottom') {
                yDir = tokens[0];
                y = BaseValue_1.BaseValue.of(tokens[1]);
                if (y) {
                    if (tokens[2] === 'left' || tokens[2] === 'right' || tokens[2] === 'center') {
                        xDir = tokens[2];
                        x = BaseValue_1.BaseValue.ZERO;
                    }
                    else {
                        return undefined;
                    }
                }
                else {
                    y = BaseValue_1.BaseValue.ZERO;
                    if (tokens[1] === 'left' || tokens[1] === 'right' || tokens[1] === 'center') {
                        xDir = tokens[1];
                        x = BaseValue_1.BaseValue.of(tokens[2]);
                        if (!x)
                            return undefined;
                    }
                    else {
                        return undefined;
                    }
                }
            }
        }
        else if (tokens.length === 4) {
            if (tokens[0] === 'left' || tokens[0] === 'right') {
                xDir = tokens[0];
                x = BaseValue_1.BaseValue.of(tokens[1]);
                yDir = tokens[2];
                y = BaseValue_1.BaseValue.of(tokens[3]);
            }
            else if (tokens[0] === 'top' || tokens[0] === 'bottom') {
                xDir = tokens[2];
                x = BaseValue_1.BaseValue.of(tokens[3]);
                yDir = tokens[0];
                y = BaseValue_1.BaseValue.of(tokens[1]);
            }
            if (!x ||
                !y ||
                (xDir !== 'left' && xDir !== 'right') ||
                (yDir !== 'top' && yDir !== 'bottom')) {
                return undefined;
            }
        }
        else {
            return undefined;
        }
        return new BackgroundPosition(xDir, x, yDir, y);
    };
    BackgroundPosition.prototype.clone = function () {
        return new BackgroundPosition(this.xDir, this.x.clone(), this.yDir, this.y.clone());
    };
    BackgroundPosition.DEFAULT = new BackgroundPosition(BackgroundPositionType.LEFT, BaseValue_1.BaseValue.ZERO, BackgroundPositionType.TOP, BaseValue_1.BaseValue.ZERO);
    return BackgroundPosition;
}());
var Background = (function () {
    function Background() {
        this.attachment = [];
        this.image = [];
        this.repeat = [];
        this.clip = [];
        this.origin = [];
        this.size = [];
        this.position = [];
        this.blendMode = [];
    }
    Background.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        var parts = this.split(value);
        var bg = new Background();
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            var attachment = void 0;
            var image = void 0;
            var repeat = void 0;
            var clip = void 0;
            var origin_1 = void 0;
            var size = void 0;
            var position = void 0;
            var blendMode = '';
            var tokens = BG_TOKENIZER.tokenize(part);
            for (var i = 0; i < tokens.length; ++i) {
                var token = tokens[i];
                var box = EnumUtils_1.EnumUtils.fromStringOrUndefined(BackgroundClip, token);
                if (box) {
                    if (!clip) {
                        clip = box;
                    }
                    else if (!origin_1) {
                        origin_1 = box;
                    }
                    else {
                        if (!silent) {
                            console.warn('invalid background:' + value + '\n<box> value appears 3 times in one layer');
                        }
                        return undefined;
                    }
                    continue;
                }
                var parsedAttachment = EnumUtils_1.EnumUtils.fromStringOrUndefined(BackgroundAttachment, token);
                if (parsedAttachment) {
                    if (attachment) {
                        if (!silent) {
                            console.warn('invalid background:' + value + '\n<attachment> value appears twice in one layer');
                        }
                        return undefined;
                    }
                    attachment = parsedAttachment;
                    continue;
                }
                if (BackgroundPosition.acceptToken(token)) {
                    if (position) {
                        if (!silent) {
                            console.warn('invalid background:' + value + '\n<position> value appears twice in one layer');
                        }
                        return undefined;
                    }
                    var positionTokens = [token];
                    for (++i; i < tokens.length; ++i) {
                        if (BackgroundPosition.acceptToken(tokens[i])) {
                            positionTokens.push(tokens[i]);
                        }
                        else {
                            break;
                        }
                    }
                    position = BackgroundPosition.of(positionTokens);
                    if (!position) {
                        if (!silent) {
                            console.warn('invalid background:' + value + '\nbad <position> value');
                        }
                        return undefined;
                    }
                    if (i < tokens.length && tokens[i] === '/') {
                        if (i + 2 < tokens.length) {
                            size = BackgroundSize.of([tokens[i + 1], tokens[i + 2]]);
                            if (size) {
                                i += 2;
                            }
                            else {
                                size = BackgroundSize.of([tokens[i + 1]]);
                                if (size) {
                                    ++i;
                                }
                            }
                        }
                        else if (i + 1 < tokens.length) {
                            size = BackgroundSize.of([tokens[i + 1]]);
                            if (size) {
                                ++i;
                            }
                        }
                        if (!size) {
                            if (!silent) {
                                console.warn('invalid background:' + value + '\nbad <size> value');
                            }
                            return undefined;
                        }
                    }
                    else {
                        --i;
                    }
                    continue;
                }
                var parsedRepeat = void 0;
                if (i + 1 < tokens.length) {
                    parsedRepeat = BackgroundRepeat.of([tokens[i], tokens[i + 1]]);
                    if (parsedRepeat) {
                        i += 1;
                    }
                    else {
                        parsedRepeat = BackgroundRepeat.of([tokens[i]]);
                    }
                }
                else {
                    parsedRepeat = BackgroundRepeat.of([tokens[i]]);
                }
                if (parsedRepeat) {
                    if (repeat) {
                        if (!silent) {
                            console.warn('invalid background:' + value + '\n<repeat> value appears twice in one layer');
                        }
                        return undefined;
                    }
                    else {
                        repeat = parsedRepeat;
                    }
                    continue;
                }
                var parsedImage = this.parseImage(token);
                if (parsedImage) {
                    if (image) {
                        if (!silent) {
                            console.warn('invalid background:' + value + '\n<image> value appears twice in one layer');
                        }
                        return undefined;
                    }
                    else {
                        image = parsedImage;
                    }
                    continue;
                }
                var color = Color_1.Color.of(token);
                if (color) {
                    if (bg.color) {
                        if (!silent) {
                            console.warn('invalid background:' + value + '\n<color> value appears twice');
                        }
                        return undefined;
                    }
                    bg.color = color;
                    continue;
                }
                if (!silent) {
                    console.warn('invalid background:' + value + '\nunknown token:' + token);
                }
                return undefined;
            }
            if (!image) {
                continue;
            }
            bg.image.push(image);
            bg.attachment.push(attachment || BackgroundAttachment.SCROLL);
            bg.repeat.push(repeat || BackgroundRepeat.DEFAULT);
            bg.clip.push(clip || BackgroundClip.CONTENT_BOX);
            bg.origin.push(origin_1 || BackgroundClip.PADDING_BOX);
            bg.size.push(size || BackgroundSize.DEFAULT);
            bg.position.push(position || BackgroundPosition.DEFAULT);
            bg.blendMode.push(blendMode);
        }
        return bg;
    };
    Background.parseImage = function (value) {
        var func = FunctionParser_1.FunctionParser.parse(value, true);
        if (!func) {
            return undefined;
        }
        switch (func.name) {
            case 'url':
                return URLSource.of(func.arguments);
            case 'linear-gradient':
                return LinearGradientSource.of(func.arguments);
            case '9patch':
                return NinePatchSource.of(func.arguments);
        }
        return undefined;
    };
    Background.split = function (value) {
        var result = [];
        var begin = 0;
        var inBrackets = false;
        var size = value.length;
        for (var i = 0; i < size; ++i) {
            var ch = value[i];
            if (inBrackets) {
                if (ch === ')') {
                    inBrackets = false;
                }
            }
            else if (ch === '(') {
                inBrackets = true;
            }
            else if (ch === ',') {
                if (begin < i) {
                    var part = value.substring(begin, i).trim();
                    if (part) {
                        result.push(part);
                    }
                }
                begin = i + 1;
            }
        }
        if (begin < size) {
            var part = value.substring(begin).trim();
            if (part) {
                result.push(part);
            }
        }
        return result;
    };
    Background.copyArray = function (src, dest) {
        for (var _i = 0, src_1 = src; _i < src_1.length; _i++) {
            var item = src_1[_i];
            dest.push(item);
        }
    };
    Background.cloneArray = function (src, dest) {
        for (var _i = 0, src_2 = src; _i < src_2.length; _i++) {
            var item = src_2[_i];
            if (!item) {
                dest.push(undefined);
            }
            else {
                dest.push(item.clone());
            }
        }
    };
    Background.getFromArray = function (arr, idx, defaultVal) {
        return idx >= arr.length ? defaultVal : arr[idx];
    };
    Background.prototype.setColor = function (value) {
        this.color = value instanceof Color_1.Color ? value : Color_1.Color.of(value);
    };
    Background.prototype.setAttachment = function (value) {
        var parts = Background.split(value);
        this.attachment.length = 0;
        for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
            var _ = parts_2[_i];
            this.attachment.push(BackgroundAttachment.SCROLL);
        }
    };
    Background.prototype.setImage = function (value) {
        var parts = Background.split(value);
        this.image.length = 0;
        for (var _i = 0, parts_3 = parts; _i < parts_3.length; _i++) {
            var part = parts_3[_i];
            this.image.push(Background.parseImage(part));
        }
    };
    Background.prototype.setBlendMode = function (value) {
        var parts = Background.split(value);
        this.blendMode.length = 0;
        for (var _i = 0, parts_4 = parts; _i < parts_4.length; _i++) {
            var part = parts_4[_i];
            this.blendMode.push(part);
        }
    };
    Background.prototype.setRepeat = function (value) {
        var parts = Background.split(value);
        this.repeat.length = 0;
        for (var _i = 0, parts_5 = parts; _i < parts_5.length; _i++) {
            var part = parts_5[_i];
            var repeat = BackgroundRepeat.of(BG_TOKENIZER.tokenize(part)) || BackgroundRepeat.DEFAULT;
            this.repeat.push(repeat);
        }
    };
    Background.prototype.setClip = function (value) {
        var parts = Background.split(value);
        this.clip.length = 0;
        for (var _i = 0, parts_6 = parts; _i < parts_6.length; _i++) {
            var part = parts_6[_i];
            var clip = EnumUtils_1.EnumUtils.fromString(BackgroundClip, part, BackgroundClip.BORDER_BOX);
            this.clip.push(clip);
        }
    };
    Background.prototype.setOrigin = function (value) {
        var parts = Background.split(value);
        this.origin.length = 0;
        for (var _i = 0, parts_7 = parts; _i < parts_7.length; _i++) {
            var part = parts_7[_i];
            var origin_2 = EnumUtils_1.EnumUtils.fromString(BackgroundClip, part, BackgroundClip.BORDER_BOX);
            this.origin.push(origin_2);
        }
    };
    Background.prototype.setSize = function (value) {
        var parts = Background.split(value);
        this.size.length = 0;
        for (var _i = 0, parts_8 = parts; _i < parts_8.length; _i++) {
            var part = parts_8[_i];
            var size = BackgroundSize.of(BG_TOKENIZER.tokenize(part)) || BackgroundSize.DEFAULT;
            this.size.push(size);
        }
    };
    Background.prototype.setPosition = function (value) {
        var parts = Background.split(value);
        this.position.length = 0;
        for (var _i = 0, parts_9 = parts; _i < parts_9.length; _i++) {
            var part = parts_9[_i];
            var position = BackgroundPosition.of(BG_TOKENIZER.tokenize(part)) || BackgroundPosition.DEFAULT;
            this.position.push(position);
        }
    };
    Background.prototype.draw = function (target, ctx, outerRect, innerRect) {
        if (this.image.length === 0 && this.color && this.color.a > 0) {
            ctx.fillStyle = this.color.toString();
            var rect = void 0;
            var clip = Background.getFromArray(this.clip, 0, BackgroundClip.BORDER_BOX);
            switch (clip) {
                case BackgroundClip.PADDING_BOX:
                    rect = target.getPaddingRect();
                    break;
                case BackgroundClip.CONTENT_BOX:
                    rect = target.getContentRect();
                    break;
                default:
                    rect = new Rect_1.Rect(0, 0, target.rect.width, target.rect.height);
                    break;
            }
            if (clip === BackgroundClip.BORDER_BOX) {
                outerRect.clip(ctx);
            }
            else {
                innerRect.clip(ctx);
            }
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            return;
        }
        for (var i = this.image.length - 1; i >= 0; --i) {
            var source = this.image[i];
            if (!source || !source.ready()) {
                continue;
            }
            var origin_3 = Background.getFromArray(this.origin, i, BackgroundClip.BORDER_BOX);
            var originRect = void 0;
            switch (origin_3) {
                case BackgroundClip.PADDING_BOX: {
                    originRect = target.getPaddingRect();
                    break;
                }
                case BackgroundClip.CONTENT_BOX: {
                    originRect = target.getContentRect();
                    break;
                }
                default:
                    originRect = new Rect_1.Rect(0, 0, target.rect.width, target.rect.height);
                    break;
            }
            if (originRect.width < 1 || originRect.height < 1) {
                continue;
            }
            var clipRect = void 0;
            var clip = Background.getFromArray(this.clip, i, BackgroundClip.BORDER_BOX);
            switch (clip) {
                case BackgroundClip.PADDING_BOX: {
                    clipRect = target.getPaddingRect();
                    break;
                }
                case BackgroundClip.CONTENT_BOX: {
                    clipRect = target.getContentRect();
                    break;
                }
                default:
                    clipRect = new Rect_1.Rect(0, 0, target.rect.width, target.rect.height);
                    break;
            }
            if (clip === BackgroundClip.BORDER_BOX) {
                outerRect.clip(ctx);
            }
            else {
                innerRect.clip(ctx);
            }
            if (this.color && i === this.image.length - 1) {
                ctx.fillStyle = this.color.toString();
                ctx.fillRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
            }
            var srcWidth = source.width(originRect);
            var srcHeight = source.height(originRect);
            var scaledWidth = srcWidth;
            var scaledHeight = srcHeight;
            var destX = originRect.x;
            var destY = originRect.y;
            var size = this.size.length > i ? this.size[i] : BackgroundSize.DEFAULT;
            if (size.xType === BackgroundSizeType.CONTAIN) {
                var ratio = srcWidth / srcHeight;
                if (ratio > originRect.width / originRect.height) {
                    scaledWidth = originRect.width;
                    scaledHeight = scaledWidth / ratio;
                }
                else {
                    scaledHeight = originRect.height;
                    scaledWidth = scaledHeight * ratio;
                }
            }
            else if (size.xType === BackgroundSizeType.COVER) {
                var ratio = srcWidth / srcHeight;
                if (ratio < originRect.width / originRect.height) {
                    scaledWidth = originRect.width;
                    scaledHeight = scaledWidth / ratio;
                }
                else {
                    scaledHeight = originRect.height;
                    scaledWidth = scaledHeight * ratio;
                }
            }
            else {
                if (size.xType === BackgroundSizeType.VALUE) {
                    scaledWidth = size.x.getValue(originRect.width);
                }
                if (size.yType === BackgroundSizeType.VALUE) {
                    scaledHeight = size.y.getValue(originRect.height);
                }
            }
            if (scaledWidth < 1 || scaledHeight < 1) {
                continue;
            }
            var srcScaleX = scaledWidth / srcWidth;
            var srcScaleY = scaledHeight / srcHeight;
            var repeatX = BackgroundRepeatType.NO_REPEAT;
            var repeatY = BackgroundRepeatType.NO_REPEAT;
            if (this.repeat.length > i) {
                repeatX = this.repeat[i].x;
                repeatY = this.repeat[i].y;
            }
            var gapX = 0;
            var gapY = 0;
            if (repeatX === BackgroundRepeatType.SPACE) {
                var count = Math.floor(originRect.width / scaledWidth);
                if (count === 1) {
                    gapX = originRect.width;
                }
                else {
                    gapX = (originRect.width - count * scaledWidth) / (count - 1);
                }
                destX = originRect.x;
                while (destX > clipRect.x) {
                    destX -= gapX + scaledWidth;
                }
            }
            else if (repeatX === BackgroundRepeatType.ROUND) {
                var count = Math.max(1, Math.floor(originRect.width / scaledWidth + 0.5));
                scaledWidth = originRect.width / count;
                srcScaleX = scaledWidth / srcWidth;
                destX = originRect.x;
                while (destX > clipRect.x) {
                    destX -= scaledWidth;
                }
            }
            else {
                if (this.position.length > i) {
                    var position = this.position[i];
                    if (position.xDir === BackgroundPositionType.CENTER) {
                        destX += ((originRect.width - scaledWidth) * 50) / 100;
                    }
                    else if (position.xDir === BackgroundPositionType.RIGHT) {
                        if (position.x.unit === BaseValue_1.BaseValueUnit.PERCENTAGE) {
                            destX += ((originRect.width - scaledWidth) * (100 - position.x.numberValue)) / 100;
                        }
                        else {
                            destX += originRect.width - scaledWidth - position.x.numberValue;
                        }
                    }
                    else {
                        if (position.x.unit === BaseValue_1.BaseValueUnit.PERCENTAGE) {
                            destX += ((originRect.width - scaledWidth) * position.x.numberValue) / 100;
                        }
                        else {
                            destX += position.x.numberValue;
                        }
                    }
                }
                if (repeatX === BackgroundRepeatType.REPEAT) {
                    while (destX > clipRect.x) {
                        destX -= scaledWidth;
                    }
                }
            }
            if (repeatY === BackgroundRepeatType.SPACE) {
                var count = Math.floor(originRect.height / scaledHeight);
                if (count === 1) {
                    gapY = originRect.height;
                }
                else {
                    gapY = (originRect.height - count * scaledHeight) / (count - 1);
                }
                destY = originRect.y;
                while (destY > clipRect.y) {
                    destY -= gapY + scaledHeight;
                }
            }
            else if (repeatY === BackgroundRepeatType.ROUND) {
                var count = Math.max(1, Math.floor(originRect.height / scaledHeight + 0.5));
                scaledHeight = originRect.height / count;
                srcScaleY = scaledHeight / srcHeight;
                destY = originRect.y;
                while (destY > clipRect.y) {
                    destY -= scaledHeight;
                }
            }
            else {
                if (this.position.length > i) {
                    var position = this.position[i];
                    if (position.yDir === BackgroundPositionType.CENTER) {
                        destY += ((originRect.height - scaledHeight) * 50) / 100;
                    }
                    else if (position.yDir === BackgroundPositionType.BOTTOM) {
                        if (position.x.unit === BaseValue_1.BaseValueUnit.PERCENTAGE) {
                            destY += ((originRect.height - scaledHeight) * (100 - position.y.numberValue)) / 100;
                        }
                        else {
                            destY += originRect.height - scaledHeight - position.y.numberValue;
                        }
                    }
                    else {
                        if (position.y.unit === BaseValue_1.BaseValueUnit.PERCENTAGE) {
                            destY += ((originRect.height - scaledHeight) * position.y.numberValue) / 100;
                        }
                        else {
                            destY += position.y.numberValue;
                        }
                    }
                }
                if (repeatY === BackgroundRepeatType.REPEAT) {
                    while (destY > clipRect.y) {
                        destY -= scaledHeight;
                    }
                }
            }
            var clipBottom = clipRect.y + clipRect.height;
            var clipRight = clipRect.x + clipRect.width;
            do {
                var x = destX;
                do {
                    this.drawImage(ctx, source, scaledWidth, scaledHeight, srcScaleX, srcScaleY, x, destY, clipRect);
                    x += gapX + scaledWidth;
                } while (x < clipRight && repeatX !== BackgroundRepeatType.NO_REPEAT);
                destY += gapY + scaledHeight;
            } while (destY < clipBottom && repeatY !== BackgroundRepeatType.NO_REPEAT);
        }
    };
    Background.prototype.clone = function () {
        var cloned = new Background();
        cloned.color = this.color;
        Background.copyArray(this.attachment, cloned.attachment);
        Background.cloneArray(this.image, cloned.image);
        Background.copyArray(this.blendMode, cloned.blendMode);
        Background.copyArray(this.clip, cloned.clip);
        Background.copyArray(this.origin, cloned.origin);
        Background.cloneArray(this.repeat, cloned.repeat);
        Background.cloneArray(this.size, cloned.size);
        Background.cloneArray(this.position, cloned.position);
        return cloned;
    };
    Background.prototype.drawImage = function (ctx, source, imgWidth, imgHeight, imageScaleX, imageScaleY, destX, destY, clip) {
        var srcX = 0;
        var srcY = 0;
        if (destX < clip.x) {
            srcX = clip.x - destX;
            destX = clip.x;
        }
        if (destY < clip.y) {
            srcY = clip.y - destY;
            destY = clip.y;
        }
        var srcWidth = imgWidth - srcX;
        var srcHeight = imgHeight - srcY;
        if (srcWidth + destX > clip.width + clip.x) {
            srcWidth = clip.width + clip.x - destX;
        }
        if (srcHeight + destY > clip.height + clip.y) {
            srcHeight = clip.height + clip.y - destY;
        }
        source.draw(ctx, new Rect_1.Rect(destX, destY, srcWidth, srcHeight), new Rect_1.Rect(srcX / imageScaleX, srcY / imageScaleY, srcWidth / imageScaleX, srcHeight / imageScaleY));
    };
    return Background;
}());
exports.Background = Background;


/***/ }),

/***/ "./src/style/Border.ts":
/*!*****************************!*\
  !*** ./src/style/Border.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = __webpack_require__(/*! ../base/Color */ "./src/base/Color.ts");
var BorderStyle;
(function (BorderStyle) {
    BorderStyle["SOLID"] = "solid";
})(BorderStyle = exports.BorderStyle || (exports.BorderStyle = {}));
var BORDER_PATTERN = /^[\s]*([^\s]+)[\s]+([\w]+)[\s]+(.*)$/;
var Border = (function () {
    function Border(width, style, color) {
        this.width = 0;
        this.style = BorderStyle.SOLID;
        this.color = Color_1.Color.NONE;
        this.width = width;
        this.style = style;
        this.color = color;
    }
    Border.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        var pieces = value.match(BORDER_PATTERN);
        if (!pieces) {
            if (!silent) {
                console.warn("invalid border:" + value);
            }
            return undefined;
        }
        var color = Color_1.Color.of(pieces[3], silent);
        if (!color) {
            if (!silent) {
                console.warn("invalid border:" + value);
            }
            return undefined;
        }
        return new Border(parseFloat(pieces[1]), BorderStyle.SOLID, color);
    };
    Border.prototype.toString = function () {
        return this.width.toString() + " " + this.style + " " + this.color.toString();
    };
    Border.prototype.equals = function (that) {
        return this.width === that.width && this.style === that.style && this.color.equals(that.color);
    };
    Border.prototype.isEnable = function () {
        return this.width > 0 && this.color.a > 0;
    };
    Border.prototype.clone = function () {
        return new Border(this.width, this.style, this.color.clone());
    };
    Border.prototype.update = function (target, progress) {
        return new Border(this.width + (target.width - this.width) * progress, this.style, this.color.update(target.color, progress));
    };
    Border.prototype.convertFrom = function (src) {
        var result = Border.of(src + '');
        if (result === undefined) {
            return new Border(0, BorderStyle.SOLID, Color_1.Color.BLACK);
        }
        else {
            return result;
        }
    };
    Border.prototype.isAnimatable = function () {
        return true;
    };
    Border.DEFAULT = new Border(0, BorderStyle.SOLID, Color_1.Color.BLACK);
    return Border;
}());
exports.Border = Border;


/***/ }),

/***/ "./src/style/BorderRadius.ts":
/*!***********************************!*\
  !*** ./src/style/BorderRadius.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BaseValue_1 = __webpack_require__(/*! ../base/BaseValue */ "./src/base/BaseValue.ts");
var BorderRadius = (function () {
    function BorderRadius(value1, value2) {
        if (value2 === void 0) { value2 = value1; }
        this.value1 = value1;
        this.value2 = value2;
    }
    BorderRadius.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        if (typeof value === 'number') {
            return new BorderRadius(BaseValue_1.BaseValue.of(value));
        }
        else {
            var pieces = value.split(/\s+/);
            var value1 = void 0;
            var value2 = void 0;
            if (pieces.length === 1) {
                value1 = value2 = BaseValue_1.BaseValue.of(pieces[0]);
            }
            else if (pieces.length === 2) {
                value1 = BaseValue_1.BaseValue.of(pieces[0]);
                value2 = BaseValue_1.BaseValue.of(pieces[1]);
            }
            if (value1 && value2) {
                return new BorderRadius(value1, value2);
            }
            else {
                if (!silent) {
                    console.warn("invalid border:" + value);
                }
                return undefined;
            }
        }
    };
    BorderRadius.prototype.toString = function () {
        return this.value1.toString() + " " + this.value2.toString();
    };
    BorderRadius.prototype.clone = function () {
        return new BorderRadius(this.value1, this.value2);
    };
    BorderRadius.prototype.update = function (target, progress) {
        return new BorderRadius(this.value1.update(target.value1, progress), this.value2.update(target.value2, progress));
    };
    BorderRadius.prototype.convertFrom = function (src) {
        var result = BorderRadius.of(src + '');
        if (result === undefined) {
            return new BorderRadius(BaseValue_1.BaseValue.ZERO, BaseValue_1.BaseValue.ZERO);
        }
        else {
            return result;
        }
    };
    BorderRadius.prototype.isAnimatable = function () {
        return true;
    };
    return BorderRadius;
}());
exports.BorderRadius = BorderRadius;


/***/ }),

/***/ "./src/style/Font.ts":
/*!***************************!*\
  !*** ./src/style/Font.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EnumUtils_1 = __webpack_require__(/*! ../utils/EnumUtils */ "./src/utils/EnumUtils.ts");
var LayoutUtils_1 = __webpack_require__(/*! ../utils/LayoutUtils */ "./src/utils/LayoutUtils.ts");
var LineHeight_1 = __webpack_require__(/*! ./LineHeight */ "./src/style/LineHeight.ts");
var FontStyle;
(function (FontStyle) {
    FontStyle["NORMAL"] = "normal";
    FontStyle["ITALIC"] = "italic";
    FontStyle["OBLIQUE"] = "oblique";
})(FontStyle = exports.FontStyle || (exports.FontStyle = {}));
var FontVariant;
(function (FontVariant) {
    FontVariant["NORMAL"] = "normal";
    FontVariant["SMALL_CAPS"] = "small-caps";
})(FontVariant = exports.FontVariant || (exports.FontVariant = {}));
var FontWeight;
(function (FontWeight) {
    FontWeight["NORMAL"] = "normal";
    FontWeight["BOLD"] = "bold";
    FontWeight["BOLDER"] = "bolder";
    FontWeight["W100"] = "100";
    FontWeight["W200"] = "200";
    FontWeight["W300"] = "300";
    FontWeight["W400"] = "400";
    FontWeight["W500"] = "500";
    FontWeight["W600"] = "600";
    FontWeight["W700"] = "700";
    FontWeight["W800"] = "800";
    FontWeight["W900"] = "900";
})(FontWeight = exports.FontWeight || (exports.FontWeight = {}));
var REG_PARTS = /(^|^.*\s+)([0-9]+[a-z]+[^\s]+)($|\s+(.*)$)/;
var Font = (function () {
    function Font(style, variant, weight, size, lineHeight, family) {
        this.style = style || FontStyle.NORMAL;
        this.variant = variant || FontVariant.NORMAL;
        this.weight = weight || FontWeight.NORMAL;
        this.size = size || 16;
        this.lineHeight = lineHeight;
        this.family = family;
    }
    Font.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        var matched = value.match(REG_PARTS);
        if (!matched) {
            if (!silent) {
                console.warn("invalid font:" + value);
            }
            return undefined;
        }
        var font = new Font();
        var styles = matched[1].split(/\s+/);
        for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
            var style = styles_1[_i];
            style = style.toLowerCase();
            if (style === 'normal') {
                continue;
            }
            var fontStyle = EnumUtils_1.EnumUtils.fromString(FontStyle, style, FontStyle.NORMAL);
            if (fontStyle !== FontStyle.NORMAL) {
                font.style = fontStyle;
                continue;
            }
            var fontWeight = EnumUtils_1.EnumUtils.fromString(FontWeight, style, FontWeight.NORMAL);
            if (fontWeight !== FontWeight.NORMAL) {
                font.weight = fontWeight;
                continue;
            }
            var fontVariant = EnumUtils_1.EnumUtils.fromString(FontVariant, style, FontVariant.NORMAL);
            if (fontVariant !== FontVariant.NORMAL) {
                font.variant = fontVariant;
                continue;
            }
        }
        var sizes = matched[2].split(/\//);
        font.size = parseFloat(sizes[0]);
        if (isNaN(font.size)) {
            if (!silent) {
                console.warn("invalid font:" + value);
            }
            return undefined;
        }
        if (sizes.length > 1) {
            font.lineHeight = LineHeight_1.LineHeight.of(sizes[1], silent);
            if (!font.lineHeight) {
                if (!silent) {
                    console.warn("invalid font:" + value);
                }
                return undefined;
            }
        }
        font.family = matched[3].trim();
        return font;
    };
    Font.prototype.toString = function () {
        var font = [
            this.style || FontStyle.NORMAL,
            this.variant || FontVariant.NORMAL,
            this.weight || FontWeight.NORMAL,
            this.lineHeight ? this.size + 'px/' + this.lineHeight.toString() : this.size + 'px',
            this.family || Font.DEFAULT_FONT_FAMILY
        ];
        return font.join(' ');
    };
    Font.prototype.measureTextWidth = function (text) {
        return LayoutUtils_1.LayoutUtils.measureTextWidth(text, this);
    };
    Font.prototype.clone = function () {
        return new Font(this.style, this.variant, this.weight, this.size, this.lineHeight, this.family);
    };
    Font.DEFAULT_FONT_FAMILY = 'sans-serif';
    return Font;
}());
exports.Font = Font;


/***/ }),

/***/ "./src/style/LineHeight.ts":
/*!*********************************!*\
  !*** ./src/style/LineHeight.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LineHeightType;
(function (LineHeightType) {
    LineHeightType[LineHeightType["NORMAL"] = 0] = "NORMAL";
    LineHeightType[LineHeightType["NUMBER"] = 1] = "NUMBER";
    LineHeightType[LineHeightType["LENGTH"] = 2] = "LENGTH";
    LineHeightType[LineHeightType["PERCENT"] = 3] = "PERCENT";
})(LineHeightType = exports.LineHeightType || (exports.LineHeightType = {}));
var REG_NUMBER = /^([0-9]*\.?[0-9]*)$/;
var REG_LENGTH = /^([0-9]*\.?[0-9]*)px$/i;
var REG_PERCENT = /^([0-9]*\.?[0-9]*)%$/;
var LineHeight = (function () {
    function LineHeight(type, value) {
        this.type = LineHeightType.NORMAL;
        this.value = 0;
        this.type = type;
        this.value = value;
    }
    LineHeight.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        value = value.toLowerCase();
        if (value === 'normal') {
            return new LineHeight(LineHeightType.NORMAL, 0);
        }
        else if (REG_NUMBER.test(value)) {
            return new LineHeight(LineHeightType.NUMBER, parseFloat(value));
        }
        else if (REG_LENGTH.test(value)) {
            return new LineHeight(LineHeightType.LENGTH, parseFloat(value));
        }
        else if (REG_PERCENT.test(value)) {
            return new LineHeight(LineHeightType.PERCENT, parseFloat(value));
        }
        if (!silent) {
            console.warn("invalid line height:" + value);
        }
        return undefined;
    };
    LineHeight.prototype.getValue = function (base) {
        switch (this.type) {
            case LineHeightType.NORMAL:
                return base * 1.2;
            case LineHeightType.NUMBER:
                return base * this.value;
            case LineHeightType.LENGTH:
                return this.value;
            case LineHeightType.PERCENT:
                return (this.value * base) / 100;
        }
    };
    LineHeight.prototype.toString = function () {
        switch (this.type) {
            case LineHeightType.NORMAL:
                return 'normal';
            case LineHeightType.NUMBER:
                return this.value;
            case LineHeightType.LENGTH:
                return this.value + 'px';
            case LineHeightType.PERCENT:
                return this.value + '%';
        }
    };
    LineHeight.prototype.clone = function () {
        return new LineHeight(this.type, this.value);
    };
    return LineHeight;
}());
exports.LineHeight = LineHeight;


/***/ }),

/***/ "./src/style/Shadow.ts":
/*!*****************************!*\
  !*** ./src/style/Shadow.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = __webpack_require__(/*! ../base/Color */ "./src/base/Color.ts");
var CSSTokenizer_1 = __webpack_require__(/*! ../parser/CSSTokenizer */ "./src/parser/CSSTokenizer.ts");
var Shadow = (function () {
    function Shadow(offsetX, offsetY, blur, color) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.blur = blur;
        this.color = color;
    }
    Shadow.of = function (value, silent) {
        if (silent === void 0) { silent = false; }
        var parts = new CSSTokenizer_1.CSSTokenizer().tokenize(value);
        if (parts.length !== 4) {
            if (!silent) {
                console.warn("invalid shadow:" + value);
            }
            return undefined;
        }
        var x = parseFloat(parts[0]);
        var y = parseFloat(parts[1]);
        var blur = parseFloat(parts[2]);
        var color = Color_1.Color.of(parts[3], silent);
        if (isNaN(x) || isNaN(y) || isNaN(blur) || color === undefined) {
            if (!silent) {
                console.warn("invalid shadow:" + value);
            }
            return undefined;
        }
        return new Shadow(x, y, blur, color);
    };
    Shadow.prototype.toString = function () {
        return "[Shadow (" + this.color.toString() + " " + this.offsetX + " " + this.offsetY + " " + this.blur + ")]";
    };
    Shadow.prototype.clone = function () {
        return new Shadow(this.offsetX, this.offsetY, this.blur, this.color);
    };
    Shadow.prototype.isEnable = function () {
        return this.color.a > 0 && (this.offsetX !== 0 || this.offsetY !== 0 || this.blur !== 0);
    };
    Shadow.prototype.update = function (target, progress) {
        return new Shadow(this.offsetX + (target.offsetX - this.offsetX) * progress, this.offsetY + (target.offsetY - this.offsetY) * progress, this.blur + (target.blur - this.blur) * progress, this.color.update(target.color, progress));
    };
    Shadow.prototype.convertFrom = function (src) {
        var result = Shadow.of(src + '');
        if (result === undefined) {
            return new Shadow(0, 0, 0, Color_1.Color.BLACK);
        }
        else {
            return result;
        }
    };
    Shadow.prototype.isAnimatable = function () {
        return true;
    };
    return Shadow;
}());
exports.Shadow = Shadow;


/***/ }),

/***/ "./src/style/Style.ts":
/*!****************************!*\
  !*** ./src/style/Style.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Animation_1 = __webpack_require__(/*! ../animation/Animation */ "./src/animation/Animation.ts");
var BaseValue_1 = __webpack_require__(/*! ../base/BaseValue */ "./src/base/BaseValue.ts");
var Color_1 = __webpack_require__(/*! ../base/Color */ "./src/base/Color.ts");
var EnumUtils_1 = __webpack_require__(/*! ../utils/EnumUtils */ "./src/utils/EnumUtils.ts");
var StringUtils_1 = __webpack_require__(/*! ../utils/StringUtils */ "./src/utils/StringUtils.ts");
var StyleUtils_1 = __webpack_require__(/*! ../utils/StyleUtils */ "./src/utils/StyleUtils.ts");
var Background_1 = __webpack_require__(/*! ./Background */ "./src/style/Background.ts");
var Border_1 = __webpack_require__(/*! ./Border */ "./src/style/Border.ts");
var BorderRadius_1 = __webpack_require__(/*! ./BorderRadius */ "./src/style/BorderRadius.ts");
var Font_1 = __webpack_require__(/*! ./Font */ "./src/style/Font.ts");
var LineHeight_1 = __webpack_require__(/*! ./LineHeight */ "./src/style/LineHeight.ts");
var Shadow_1 = __webpack_require__(/*! ./Shadow */ "./src/style/Shadow.ts");
var BoxSizing;
(function (BoxSizing) {
    BoxSizing["CONTENT_BOX"] = "content-box";
    BoxSizing["BORDER_BOX"] = "border-box";
})(BoxSizing = exports.BoxSizing || (exports.BoxSizing = {}));
var TextAlign;
(function (TextAlign) {
    TextAlign["LEFT"] = "left";
    TextAlign["RIGHT"] = "right";
    TextAlign["CENTER"] = "center";
})(TextAlign = exports.TextAlign || (exports.TextAlign = {}));
var VerticalAlign;
(function (VerticalAlign) {
    VerticalAlign["TOP"] = "top";
    VerticalAlign["BOTTOM"] = "bottom";
    VerticalAlign["MIDDLE"] = "middle";
})(VerticalAlign = exports.VerticalAlign || (exports.VerticalAlign = {}));
var Position;
(function (Position) {
    Position["STATIC"] = "static";
    Position["RELATIVE"] = "relative";
    Position["ABSOLUTE"] = "absolute";
    Position["FIXED"] = "fixed";
})(Position = exports.Position || (exports.Position = {}));
var Display;
(function (Display) {
    Display["INLINE"] = "inline";
    Display["BLOCK"] = "block";
    Display["NONE"] = "none";
})(Display = exports.Display || (exports.Display = {}));
var Overflow;
(function (Overflow) {
    Overflow["VISIBLE"] = "visible";
    Overflow["HIDDEN"] = "hidden";
})(Overflow = exports.Overflow || (exports.Overflow = {}));
var TextBorderPosition;
(function (TextBorderPosition) {
    TextBorderPosition["OUTER"] = "outer";
    TextBorderPosition["INNER"] = "inner";
})(TextBorderPosition = exports.TextBorderPosition || (exports.TextBorderPosition = {}));
var PointerEvents;
(function (PointerEvents) {
    PointerEvents["AUTO"] = "auto";
    PointerEvents["NONE"] = "none";
    PointerEvents["CROSS"] = "cross";
    PointerEvents["BLOCK"] = "block";
})(PointerEvents = exports.PointerEvents || (exports.PointerEvents = {}));
var Visibility;
(function (Visibility) {
    Visibility["VISIBLE"] = "visible";
    Visibility["HIDDEN"] = "hidden";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
var REG_ATTRS = /([^\s:;]+)[\s]*:[\s]*([^;]+)/gm;
var Style = (function () {
    function Style() {
        this.position = Position.STATIC;
        this.display = Display.INLINE;
        this.perspectiveOriginX = BaseValue_1.BaseValue.of('50%');
        this.perspectiveOriginY = BaseValue_1.BaseValue.of('50%');
        this.transformX = BaseValue_1.BaseValue.ZERO;
        this.transformY = BaseValue_1.BaseValue.ZERO;
        this.alpha = 1;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.skewX = 0;
        this.skewY = 0;
        this.visibility = Visibility.VISIBLE;
        this.boxSizing = BoxSizing.CONTENT_BOX;
        this.color = Color_1.Color.BLACK;
        this.overflow = Overflow.VISIBLE;
        this.pointerEvents = PointerEvents.AUTO;
        this.textBorderPosition = TextBorderPosition.OUTER;
    }
    Style.of = function (value) {
        var style = new Style();
        return style.apply(this.parse(value));
    };
    Style.parse = function (value) {
        var attrs = {};
        var matches = StringUtils_1.StringUtils.matchAll(value, REG_ATTRS);
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            attrs[match[1].toLowerCase()] = match[2];
        }
        return attrs;
    };
    Style.prototype.apply = function (attrs) {
        for (var k in attrs) {
            var key = this.normalize(k);
            var value = attrs[k] + '';
            switch (key) {
                case 'width':
                case 'minWidth':
                case 'maxWidth':
                case 'height':
                case 'minHeight':
                case 'maxHeight':
                    this[key] = BaseValue_1.BaseValue.of(value);
                    break;
                case 'position':
                    this.position = EnumUtils_1.EnumUtils.fromString(Position, value, Position.STATIC);
                    break;
                case 'display':
                    this.display = EnumUtils_1.EnumUtils.fromString(Display, value, Display.INLINE);
                    break;
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                    this[key] = BaseValue_1.BaseValue.of(value);
                    break;
                case 'padding':
                    var paddings = StyleUtils_1.StyleUtils.parse4Dirs(value);
                    if (paddings) {
                        this.paddingTop = paddings[0];
                        this.paddingRight = paddings[1];
                        this.paddingBottom = paddings[2];
                        this.paddingLeft = paddings[3];
                    }
                    break;
                case 'paddingTop':
                case 'paddingRight':
                case 'paddingBottom':
                case 'paddingLeft':
                    this[key] = BaseValue_1.BaseValue.of(value);
                    break;
                case 'margin':
                    var margins = StyleUtils_1.StyleUtils.parse4Dirs(value);
                    if (margins) {
                        this.marginTop = margins[0];
                        this.marginRight = margins[1];
                        this.marginBottom = margins[2];
                        this.marginLeft = margins[3];
                    }
                    break;
                case 'marginTop':
                case 'marginRight':
                case 'marginBottom':
                case 'marginLeft':
                    this[key] = BaseValue_1.BaseValue.of(value);
                    break;
                case 'perspectiveOrigin': {
                    var pieces = value.split(/\s+/);
                    if (pieces.length === 1) {
                        if (value === 'auto') {
                            this.perspectiveOriginX = BaseValue_1.BaseValue.of('50%');
                            this.perspectiveOriginY = BaseValue_1.BaseValue.of('50%');
                        }
                        else {
                            this.perspectiveOriginX = BaseValue_1.BaseValue.of(value);
                            this.perspectiveOriginY = BaseValue_1.BaseValue.of(value);
                        }
                    }
                    else if (pieces.length > 1) {
                        this.perspectiveOriginX =
                            pieces[0] === 'auto' ? BaseValue_1.BaseValue.of('50%') : BaseValue_1.BaseValue.of(pieces[0]);
                        this.perspectiveOriginY =
                            pieces[1] === 'auto' ? BaseValue_1.BaseValue.of('50%') : BaseValue_1.BaseValue.of(pieces[1]);
                    }
                    break;
                }
                case 'transform': {
                    var pieces = value.split(/\s+/);
                    if (pieces.length === 1) {
                        if (value === 'auto') {
                            this.transformX = BaseValue_1.BaseValue.of('50%');
                            this.transformY = BaseValue_1.BaseValue.of('50%');
                        }
                        else {
                            this.transformX = BaseValue_1.BaseValue.of(value);
                            this.transformY = BaseValue_1.BaseValue.of(value);
                        }
                    }
                    else if (pieces.length > 1) {
                        this.transformX = pieces[0] === 'auto' ? BaseValue_1.BaseValue.of('50%') : BaseValue_1.BaseValue.of(pieces[0]);
                        this.transformY = pieces[1] === 'auto' ? BaseValue_1.BaseValue.of('50%') : BaseValue_1.BaseValue.of(pieces[1]);
                    }
                    break;
                }
                case 'perspectiveOriginX':
                case 'perspectiveOriginY':
                case 'transformX':
                case 'transformY':
                    this[key] = value === 'auto' ? BaseValue_1.BaseValue.of('50%') : BaseValue_1.BaseValue.of(value);
                    break;
                case 'scaleX':
                case 'scaleY':
                case 'skewX':
                case 'skewY':
                case 'alpha':
                case 'aspectRatio':
                case 'rotation': {
                    var numberValue = parseFloat(value);
                    if (isNaN(numberValue)) {
                        console.warn("invalid " + key + " value: " + value);
                    }
                    else {
                        this[key] = numberValue;
                    }
                    break;
                }
                case 'scale': {
                    var numberValue = parseFloat(value);
                    if (isNaN(numberValue)) {
                        console.warn("invalid " + key + " value: " + value);
                    }
                    else {
                        this.scaleX = this.scaleY = numberValue;
                    }
                    break;
                }
                case 'visibility':
                    this.visibility = EnumUtils_1.EnumUtils.fromString(Visibility, value, Visibility.VISIBLE);
                    break;
                case 'background':
                    this.background = Background_1.Background.of(value);
                    break;
                case 'backgroundClip':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setClip(value);
                    break;
                case 'backgroundColor':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setColor(value);
                    break;
                case 'backgroundAttachment':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setAttachment(value);
                    break;
                case 'backgroundImage':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setImage(value);
                    break;
                case 'backgroundRepeat':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setRepeat(value);
                    break;
                case 'backgroundOrigin':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setOrigin(value);
                    break;
                case 'backgroundSize':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setSize(value);
                    break;
                case 'backgroundPosition':
                    if (!this.background) {
                        this.background = new Background_1.Background();
                    }
                    this.background.setPosition(value);
                    break;
                case 'boxSizing':
                    this.boxSizing = EnumUtils_1.EnumUtils.fromString(BoxSizing, value, BoxSizing.CONTENT_BOX);
                    break;
                case 'color': {
                    var color = Color_1.Color.of(value);
                    if (color) {
                        this.color = color;
                    }
                    break;
                }
                case 'font':
                    this.font = Font_1.Font.of(value);
                    break;
                case 'fontFamily':
                    if (!this.font) {
                        this.font = new Font_1.Font();
                    }
                    this.font.family = value;
                    break;
                case 'fontWeight':
                    if (!this.font) {
                        this.font = new Font_1.Font();
                    }
                    this.font.weight = EnumUtils_1.EnumUtils.fromString(Font_1.FontWeight, value, Font_1.FontWeight.NORMAL);
                    break;
                case 'fontStyle':
                    if (!this.font) {
                        this.font = new Font_1.Font();
                    }
                    this.font.style = EnumUtils_1.EnumUtils.fromString(Font_1.FontStyle, value, Font_1.FontStyle.NORMAL);
                    break;
                case 'fontVariant':
                    if (!this.font) {
                        this.font = new Font_1.Font();
                    }
                    this.font.variant = EnumUtils_1.EnumUtils.fromString(Font_1.FontVariant, value, Font_1.FontVariant.NORMAL);
                    break;
                case 'fontSize': {
                    var numberValue = parseFloat(value);
                    if (isNaN(numberValue)) {
                        console.warn("invalid " + key + " value: " + value);
                    }
                    else {
                        if (!this.font) {
                            this.font = new Font_1.Font();
                        }
                        this.font.size = numberValue;
                    }
                    break;
                }
                case 'lineHeight':
                    this.lineHeight = LineHeight_1.LineHeight.of(value);
                    break;
                case 'textAlign':
                    this.textAlign = EnumUtils_1.EnumUtils.fromStringOrUndefined(TextAlign, value);
                    break;
                case 'verticalAlign':
                    this.verticalAlign = EnumUtils_1.EnumUtils.fromStringOrUndefined(VerticalAlign, value);
                    break;
                case 'borderRadius':
                    {
                        var borderRadius = Style.parseBorderRadius(value);
                        if (borderRadius) {
                            this.borderTopLeftRadius = borderRadius[0];
                            this.borderTopRightRadius = borderRadius[1];
                            this.borderBottomRightRadius = borderRadius[2];
                            this.borderBottomLeftRadius = borderRadius[3];
                        }
                    }
                    break;
                case 'borderTopLeftRadius':
                case 'borderTopRightRadius':
                case 'borderBottomLeftRadius':
                case 'borderBottomRightRadius':
                    this[key] = BorderRadius_1.BorderRadius.of(value);
                    break;
                case 'border':
                    this.borderTop = this.borderRight = this.borderLeft = this.borderBottom = Border_1.Border.of(value);
                    break;
                case 'borderTop':
                case 'borderRight':
                case 'borderLeft':
                case 'borderBottom':
                case 'textBorder':
                    this[key] = Border_1.Border.of(value);
                    break;
                case 'overflow':
                    this.overflow = EnumUtils_1.EnumUtils.fromString(Overflow, value, Overflow.VISIBLE);
                    break;
                case 'compositeOperation':
                    this.compositeOperation = value;
                    break;
                case 'filter':
                    this.filter = value;
                    break;
                case 'shadow':
                case 'textShadow':
                    this[key] = Shadow_1.Shadow.of(value);
                    break;
                case 'textBorderPosition':
                    this.textBorderPosition = EnumUtils_1.EnumUtils.fromString(TextBorderPosition, value, TextBorderPosition.OUTER);
                    break;
                case 'pointerEvents':
                    this.pointerEvents = EnumUtils_1.EnumUtils.fromString(PointerEvents, value, PointerEvents.AUTO);
                    break;
                case 'cursor':
                    this.cursor = value;
                    break;
                default:
                    console.warn('unknown style:' + k + ' value:' + value);
                    break;
            }
        }
        return this;
    };
    Style.prototype.getSnapshotForAnimation = function (target, props) {
        var result = {};
        for (var name_1 in props) {
            this.fillSnapshotForAnimation(target, name_1, props[name_1], result);
        }
        return result;
    };
    Style.prototype.applyAnimationResult = function (result) {
        for (var name_2 in result) {
            if (name_2 === 'backgroundColor') {
                if (!this.background) {
                    this.background = new Background_1.Background();
                }
                this.background.color = result[name_2];
            }
            else {
                this[name_2] = result[name_2];
            }
        }
    };
    Style.prototype.clone = function () {
        var cloned = new Style();
        cloned.width = this.width;
        cloned.minWidth = this.minWidth;
        cloned.maxWidth = this.maxWidth;
        cloned.height = this.height;
        cloned.minHeight = this.minHeight;
        cloned.maxHeight = this.maxHeight;
        cloned.position = this.position;
        cloned.display = this.display;
        cloned.left = this.left;
        cloned.right = this.right;
        cloned.top = this.top;
        cloned.bottom = this.bottom;
        if (this.paddingTop) {
            cloned.paddingTop = this.paddingTop.clone();
        }
        if (this.paddingRight) {
            cloned.paddingRight = this.paddingRight.clone();
        }
        if (this.paddingBottom) {
            cloned.paddingBottom = this.paddingBottom.clone();
        }
        if (this.paddingLeft) {
            cloned.paddingLeft = this.paddingLeft.clone();
        }
        if (this.marginTop) {
            cloned.marginTop = this.marginTop.clone();
        }
        if (this.marginRight) {
            cloned.marginRight = this.marginRight.clone();
        }
        if (this.marginBottom) {
            cloned.marginBottom = this.marginBottom.clone();
        }
        if (this.marginLeft) {
            cloned.marginLeft = this.marginLeft.clone();
        }
        cloned.perspectiveOriginX = this.perspectiveOriginX;
        cloned.perspectiveOriginY = this.perspectiveOriginY;
        cloned.transformX = this.transformX;
        cloned.transformY = this.transformY;
        cloned.alpha = this.alpha;
        cloned.rotation = this.rotation;
        cloned.scaleX = this.scaleX;
        cloned.scaleY = this.scaleY;
        cloned.skewX = this.skewX;
        cloned.skewY = this.skewY;
        if (this.shadow) {
            cloned.shadow = this.shadow.clone();
        }
        if (this.textShadow) {
            cloned.textShadow = this.textShadow.clone();
        }
        cloned.textBorderPosition = this.textBorderPosition;
        if (this.textBorder) {
            cloned.textBorder = this.textBorder.clone();
        }
        cloned.visibility = this.visibility;
        if (this.background) {
            cloned.background = this.background.clone();
        }
        cloned.boxSizing = this.boxSizing;
        cloned.color = this.color.clone();
        if (this.font) {
            cloned.font = this.font.clone();
        }
        cloned.lineHeight = this.lineHeight;
        cloned.textAlign = this.textAlign;
        cloned.verticalAlign = this.verticalAlign;
        if (this.borderTop) {
            cloned.borderTop = this.borderTop.clone();
        }
        if (this.borderRight) {
            cloned.borderRight = this.borderRight.clone();
        }
        if (this.borderBottom) {
            cloned.borderBottom = this.borderBottom.clone();
        }
        if (this.borderLeft) {
            cloned.borderLeft = this.borderLeft.clone();
        }
        if (this.borderTopLeftRadius) {
            cloned.borderTopLeftRadius = this.borderTopLeftRadius.clone();
        }
        if (this.borderTopRightRadius) {
            cloned.borderTopRightRadius = this.borderTopRightRadius.clone();
        }
        if (this.borderBottomRightRadius) {
            cloned.borderBottomRightRadius = this.borderBottomRightRadius.clone();
        }
        if (this.borderBottomLeftRadius) {
            cloned.borderBottomLeftRadius = this.borderBottomLeftRadius.clone();
        }
        cloned.overflow = this.overflow;
        cloned.compositeOperation = this.compositeOperation;
        cloned.aspectRatio = this.aspectRatio;
        cloned.filter = this.filter;
        cloned.cursor = this.cursor;
        cloned.pointerEvents = this.pointerEvents;
        return cloned;
    };
    Style.prototype.fillSnapshotForAnimation = function (target, name, to, result) {
        var key = this.normalize(name);
        switch (key) {
            case 'scaleX':
            case 'scaleY':
            case 'alpha':
            case 'rotation':
            case 'skewX':
            case 'skewY':
            case 'aspectRatio':
                {
                    var numberTo = NaN;
                    if (typeof to === 'number') {
                        numberTo = to;
                    }
                    else if (typeof to === 'string') {
                        numberTo = parseFloat(to);
                    }
                    if (isNaN(numberTo)) {
                        console.warn("invalid value (" + to + ") for " + key);
                        break;
                    }
                    result[key] = {
                        from: this[key],
                        to: numberTo,
                        type: Animation_1.AnimationValueType.NUMBER
                    };
                }
                break;
            case 'paddingRight':
            case 'paddingLeft':
            case 'marginRight':
            case 'marginLeft':
            case 'transformX':
            case 'width':
            case 'minWidth':
            case 'maxWidth':
            case 'left':
            case 'right':
            case 'perspectiveOriginX': {
                var from = this[key] || BaseValue_1.BaseValue.of(0);
                var animatedValue = Style.calculateAnimationBaseValue(key, from, to, target.getWidth());
                if (animatedValue) {
                    result[key] = animatedValue;
                }
                break;
            }
            case 'paddingTop':
            case 'paddingBottom':
            case 'marginTop':
            case 'marginBottom':
            case 'transformY':
            case 'height':
            case 'minHeight':
            case 'maxHeight':
            case 'top':
            case 'bottom':
            case 'perspectiveOriginY': {
                var from = this[key] || BaseValue_1.BaseValue.of(0);
                var animatedValue = Style.calculateAnimationBaseValue(key, from, to, target.getHeight());
                if (animatedValue) {
                    result[key] = animatedValue;
                }
                break;
            }
            case 'color': {
                var color = void 0;
                if (typeof to === 'string') {
                    color = Color_1.Color.of(to);
                }
                else if (to instanceof Color_1.Color) {
                    color = to;
                }
                if (!color) {
                    console.warn("invalid value (" + to + ") for " + key);
                    break;
                }
                result[key] = {
                    from: this[key],
                    to: color,
                    type: Animation_1.AnimationValueType.ANIMATABLE
                };
                break;
            }
            case 'backgroundColor': {
                var color = void 0;
                if (typeof to === 'string') {
                    color = Color_1.Color.of(to);
                }
                else if (to instanceof Color_1.Color) {
                    color = to;
                }
                if (!color) {
                    console.warn("invalid value (" + to + ") for " + key);
                    break;
                }
                result[key] = {
                    from: (this.background && this.background.color) || Color_1.Color.WHITE,
                    to: color,
                    type: Animation_1.AnimationValueType.ANIMATABLE
                };
                break;
            }
            case 'padding':
                this.fillSnapshotForAnimation(target, 'paddingTop', to, result);
                this.fillSnapshotForAnimation(target, 'paddingRight', to, result);
                this.fillSnapshotForAnimation(target, 'paddingBottom', to, result);
                this.fillSnapshotForAnimation(target, 'paddingLeft', to, result);
                break;
            case 'margin':
                this.fillSnapshotForAnimation(target, 'marginTop', to, result);
                this.fillSnapshotForAnimation(target, 'marginRight', to, result);
                this.fillSnapshotForAnimation(target, 'marginBottom', to, result);
                this.fillSnapshotForAnimation(target, 'marginLeft', to, result);
                break;
            case 'perspectiveOrigin':
                this.fillSnapshotForAnimation(target, 'perspectiveOriginX', to, result);
                this.fillSnapshotForAnimation(target, 'perspectiveOriginY', to, result);
                break;
            case 'transform':
                this.fillSnapshotForAnimation(target, 'transformX', to, result);
                this.fillSnapshotForAnimation(target, 'transformY', to, result);
                break;
            case 'scale':
                this.fillSnapshotForAnimation(target, 'scaleX', to, result);
                this.fillSnapshotForAnimation(target, 'scaleY', to, result);
                break;
            case 'borderRadius':
                var borderRadius = Style.parseBorderRadius(to);
                if (borderRadius) {
                    this.fillSnapshotForAnimation(target, 'borderTopLeftRadius', borderRadius[0], result);
                    this.fillSnapshotForAnimation(target, 'borderTopRightRadius', borderRadius[1], result);
                    this.fillSnapshotForAnimation(target, 'borderBottomRightRadius', borderRadius[2], result);
                    this.fillSnapshotForAnimation(target, 'borderBottomLeftRadius', borderRadius[3], result);
                }
                break;
            case 'borderTopLeftRadius':
            case 'borderTopRightRadius':
            case 'borderBottomLeftRadius':
            case 'borderBottomRightRadius':
                {
                    var radius = void 0;
                    if (typeof to === 'string' || typeof to === 'number') {
                        radius = BorderRadius_1.BorderRadius.of(to);
                    }
                    else if (to instanceof BorderRadius_1.BorderRadius) {
                        radius = to;
                    }
                    if (!radius) {
                        console.warn("invalid value (" + to + ") for " + key);
                        break;
                    }
                    var from = this[key] || BorderRadius_1.BorderRadius.of(0);
                    var value1 = void 0;
                    if (radius.value1.unit === BaseValue_1.BaseValueUnit.PERCENTAGE) {
                        value1 = from.value1.toPercentage(target.getWidth());
                    }
                    else {
                        value1 = from.value1.toAbsolute(target.getWidth());
                    }
                    var value2 = void 0;
                    if (radius.value2.unit === BaseValue_1.BaseValueUnit.PERCENTAGE) {
                        value2 = from.value2.toPercentage(target.getHeight());
                    }
                    else {
                        value2 = from.value2.toAbsolute(target.getHeight());
                    }
                    result[key] = {
                        from: new BorderRadius_1.BorderRadius(value1, value2),
                        to: radius,
                        type: Animation_1.AnimationValueType.ANIMATABLE
                    };
                }
                break;
            case 'borderLeft':
            case 'borderRight':
            case 'borderTop':
            case 'borderBottom':
            case 'textBorder':
                {
                    var border = void 0;
                    if (typeof to === 'string') {
                        border = Border_1.Border.of(to);
                    }
                    else if (to instanceof Border_1.Border) {
                        border = to;
                    }
                    if (!border) {
                        console.warn("invalid value (" + to + ") for " + key);
                        break;
                    }
                    result[key] = {
                        from: this[key] || Border_1.Border.DEFAULT,
                        to: border,
                        type: Animation_1.AnimationValueType.ANIMATABLE
                    };
                }
                break;
            case 'border':
                this.fillSnapshotForAnimation(target, 'borderLeft', to, result);
                this.fillSnapshotForAnimation(target, 'borderRight', to, result);
                this.fillSnapshotForAnimation(target, 'borderTop', to, result);
                this.fillSnapshotForAnimation(target, 'borderBottom', to, result);
                break;
            case 'shadow':
            case 'textShadow':
                {
                    var shadow = void 0;
                    if (typeof to === 'string') {
                        shadow = Shadow_1.Shadow.of(to);
                    }
                    else if (to instanceof Shadow_1.Shadow) {
                        shadow = to;
                    }
                    if (!shadow) {
                        console.warn("invalid value (" + to + ") for " + key);
                        break;
                    }
                    result[key] = {
                        from: this[key] || new Shadow_1.Shadow(0, 0, 0, Color_1.Color.WHITE),
                        to: shadow,
                        type: Animation_1.AnimationValueType.ANIMATABLE
                    };
                }
                break;
            default:
                console.warn('unsupported animation attribute:' + name);
                break;
        }
    };
    Style.calculateAnimationBaseValue = function (key, from, to, base) {
        var toBaseValue;
        if (typeof to === 'number' || typeof to === 'string') {
            toBaseValue = BaseValue_1.BaseValue.of(to);
        }
        else if (to instanceof BaseValue_1.BaseValue) {
            toBaseValue = to;
        }
        if (!toBaseValue) {
            console.warn("invalid value (" + to + ") for " + key);
            return undefined;
        }
        if (toBaseValue.unit === BaseValue_1.BaseValueUnit.PERCENTAGE) {
            return {
                from: from.toPercentage(base),
                to: toBaseValue,
                type: Animation_1.AnimationValueType.ANIMATABLE
            };
        }
        else {
            return {
                from: from.toAbsolute(base),
                to: toBaseValue,
                type: Animation_1.AnimationValueType.ANIMATABLE
            };
        }
    };
    Style.parseBorderRadius = function (value) {
        if (typeof value === 'number') {
            var borderRadius = new BorderRadius_1.BorderRadius(BaseValue_1.BaseValue.of(value));
            return [borderRadius, borderRadius, borderRadius, borderRadius];
        }
        else if (Animation_1.isIAnimatable(value)) {
            return [
                value,
                value,
                value,
                value
            ];
        }
        else {
            var ps = value.toString().split('/');
            if (ps.length === 1) {
                var borderRadius = StyleUtils_1.StyleUtils.parse4Dirs(ps[0]);
                if (borderRadius) {
                    return [
                        new BorderRadius_1.BorderRadius(borderRadius[0]),
                        new BorderRadius_1.BorderRadius(borderRadius[1]),
                        new BorderRadius_1.BorderRadius(borderRadius[2]),
                        new BorderRadius_1.BorderRadius(borderRadius[3])
                    ];
                }
            }
            else if (ps.length === 2) {
                var borderRadius1 = StyleUtils_1.StyleUtils.parse4Dirs(ps[0]);
                var borderRadius2 = StyleUtils_1.StyleUtils.parse4Dirs(ps[1]);
                if (borderRadius1 && borderRadius2) {
                    return [
                        new BorderRadius_1.BorderRadius(borderRadius1[0], borderRadius2[0]),
                        new BorderRadius_1.BorderRadius(borderRadius1[1], borderRadius2[1]),
                        new BorderRadius_1.BorderRadius(borderRadius1[2], borderRadius2[2]),
                        new BorderRadius_1.BorderRadius(borderRadius1[3], borderRadius2[3])
                    ];
                }
            }
            console.warn("invalid border radius:" + value);
            return undefined;
        }
    };
    Style.prototype.normalize = function (key) {
        var pieces = key.split(/-/);
        var normalized = '';
        for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
            var piece = pieces_1[_i];
            if (normalized === '') {
                normalized = piece;
            }
            else {
                normalized += piece.substring(0, 1).toUpperCase() + piece.substring(1);
            }
        }
        return normalized;
    };
    return Style;
}());
exports.Style = Style;


/***/ }),

/***/ "./src/style/index.ts":
/*!****************************!*\
  !*** ./src/style/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./Background */ "./src/style/Background.ts"));
__export(__webpack_require__(/*! ./Border */ "./src/style/Border.ts"));
__export(__webpack_require__(/*! ./Font */ "./src/style/Font.ts"));
__export(__webpack_require__(/*! ./LineHeight */ "./src/style/LineHeight.ts"));
__export(__webpack_require__(/*! ./Shadow */ "./src/style/Shadow.ts"));
__export(__webpack_require__(/*! ./Style */ "./src/style/Style.ts"));


/***/ }),

/***/ "./src/utils/Base64.ts":
/*!*****************************!*\
  !*** ./src/utils/Base64.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var STANDARD_ENCODE_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var Base64 = (function () {
    function Base64() {
    }
    Base64.tripletToBase64 = function (num) {
        return (STANDARD_ENCODE_TABLE[(num >> 18) & 0x3f] +
            STANDARD_ENCODE_TABLE[(num >> 12) & 0x3f] +
            STANDARD_ENCODE_TABLE[(num >> 6) & 0x3f] +
            STANDARD_ENCODE_TABLE[num & 0x3f]);
    };
    Base64.next = function (dataArray, index) {
        if (dataArray[index.i].length > index.j) {
            return dataArray[index.i][index.j++];
        }
        else {
            while (dataArray[++index.i].length === 0) { }
            index.j = 1;
            return dataArray[index.i][0];
        }
    };
    Base64.encode = function (dataArray) {
        var sizes = [];
        var len = 0;
        for (var _i = 0, dataArray_1 = dataArray; _i < dataArray_1.length; _i++) {
            var data = dataArray_1[_i];
            len += data.length;
            sizes.push({ size: data.length, current: 0 });
        }
        var index = { i: 0, j: 0 };
        var extraBytes = len % 3;
        var parts = [];
        var times = Math.floor(len / 3);
        for (var i = 0; i < times; ++i) {
            parts.push(this.tripletToBase64(((this.next(dataArray, index) << 16) & 0xff0000) +
                ((this.next(dataArray, index) << 8) & 0xff00) +
                (this.next(dataArray, index) & 0xff)));
        }
        if (extraBytes === 1) {
            var tmp = this.next(dataArray, index);
            parts.push(STANDARD_ENCODE_TABLE[tmp >> 2] + STANDARD_ENCODE_TABLE[(tmp << 4) & 0x3f] + '==');
        }
        else if (extraBytes === 2) {
            var tmp = (this.next(dataArray, index) << 8) + this.next(dataArray, index);
            parts.push(STANDARD_ENCODE_TABLE[tmp >> 10] +
                STANDARD_ENCODE_TABLE[(tmp >> 4) & 0x3f] +
                STANDARD_ENCODE_TABLE[(tmp << 2) & 0x3f] +
                '=');
        }
        return parts.join('');
    };
    return Base64;
}());
exports.Base64 = Base64;


/***/ }),

/***/ "./src/utils/CRC32.ts":
/*!****************************!*\
  !*** ./src/utils/CRC32.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TABLE = new Uint32Array(256);
for (var i = 0; i < 256; i++) {
    var c = i;
    for (var k = 0; k < 8; k++) {
        c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    TABLE[i] = c;
}
var CRC32 = (function () {
    function CRC32() {
    }
    CRC32.calculate = function (bytes, start, length) {
        if (start === void 0) { start = 0; }
        if (length === void 0) { length = bytes.length - start; }
        var crc = -1;
        for (var i = start, l = start + length; i < l; i++) {
            crc = (crc >>> 8) ^ TABLE[(crc ^ bytes[i]) & 0xff];
        }
        return crc ^ -1;
    };
    return CRC32;
}());
exports.CRC32 = CRC32;


/***/ }),

/***/ "./src/utils/ContainerUtils.ts":
/*!*************************************!*\
  !*** ./src/utils/ContainerUtils.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ContainerUtils = (function () {
    function ContainerUtils() {
    }
    ContainerUtils.isEmpty = function (map) {
        if (!map)
            return true;
        for (var key in map) {
            if (map.hasOwnProperty(key))
                return false;
        }
        return true;
    };
    return ContainerUtils;
}());
exports.ContainerUtils = ContainerUtils;


/***/ }),

/***/ "./src/utils/Delay.ts":
/*!****************************!*\
  !*** ./src/utils/Delay.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Delay = (function () {
    function Delay(delayTime) {
        this.delayHandler = 0;
        this.paused = false;
        this.delayTime = delayTime;
    }
    Delay.prototype.call = function (func) {
        this.func = func;
        if (this.paused) {
            return;
        }
        if (this.delayHandler) {
            clearTimeout(this.delayHandler);
            this.delayHandler = 0;
        }
        this.start();
    };
    Delay.prototype.pause = function () {
        if (this.delayHandler) {
            clearTimeout(this.delayHandler);
            this.delayHandler = 0;
        }
        this.paused = true;
    };
    Delay.prototype.resume = function () {
        if (this.paused) {
            this.paused = false;
            if (this.func) {
                this.start();
            }
        }
    };
    Delay.prototype.cancel = function () {
        if (this.delayHandler) {
            clearTimeout(this.delayHandler);
            this.delayHandler = 0;
        }
        this.func = undefined;
        this.paused = false;
    };
    Delay.prototype.start = function () {
        var _this = this;
        if (this.func) {
            this.delayHandler = setTimeout(function () {
                _this.delayHandler = 0;
                if (_this.func) {
                    _this.func();
                    _this.func = undefined;
                }
            }, this.delayTime);
        }
    };
    return Delay;
}());
exports.Delay = Delay;


/***/ }),

/***/ "./src/utils/DrawUtils.ts":
/*!********************************!*\
  !*** ./src/utils/DrawUtils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RoundRect_1 = __webpack_require__(/*! ../base/RoundRect */ "./src/base/RoundRect.ts");
var ResourceRegistry_1 = __webpack_require__(/*! ../resource/ResourceRegistry */ "./src/resource/ResourceRegistry.ts");
var Style_1 = __webpack_require__(/*! ../style/Style */ "./src/style/Style.ts");
var DrawUtils = (function () {
    function DrawUtils() {
    }
    DrawUtils.drawElement = function (element, ctx) {
        var style = element.style;
        if (style.compositeOperation) {
            ctx.globalCompositeOperation = style.compositeOperation;
        }
        var topWidth = style.borderTop ? style.borderTop.width : 0;
        var rightWidth = style.borderRight ? style.borderRight.width : 0;
        var bottomWidth = style.borderBottom ? style.borderBottom.width : 0;
        var leftWidth = style.borderLeft ? style.borderLeft.width : 0;
        var outerRect = new RoundRect_1.RoundRect()
            .applySize(element.rect.width, element.rect.height)
            .applyRadius(style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomLeftRadius, style.borderBottomRightRadius);
        var innerRect;
        if (topWidth > 0 || rightWidth > 0 || bottomWidth > 0 || leftWidth > 0) {
            innerRect = outerRect.applyBorder(topWidth, rightWidth, bottomWidth, leftWidth);
        }
        else {
            innerRect = outerRect;
        }
        if (style.shadow && style.shadow.isEnable()) {
            ctx.save();
            ctx.shadowBlur = style.shadow.blur;
            ctx.shadowColor = style.shadow.color.toString();
            ctx.shadowOffsetX = style.shadow.offsetX;
            ctx.shadowOffsetY = style.shadow.offsetY;
            var x = Math.abs(style.shadow.offsetX) + style.shadow.blur;
            var y = Math.abs(style.shadow.offsetY) + style.shadow.blur;
            var shadowRect = new RoundRect_1.RoundRect(outerRect.x1 - x, outerRect.y1 - y, outerRect.x2 + x, outerRect.y2 + y);
            ctx.beginPath();
            shadowRect.makePath(ctx, true, true);
            outerRect.makePath(ctx, false, false);
            ctx.closePath();
            ctx.clip();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            outerRect.makePath(ctx, true, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        ctx.save();
        element.drawBackground(ctx, outerRect, innerRect);
        ctx.restore();
        if (topWidth > 0 || rightWidth > 0 || bottomWidth > 0 || leftWidth > 0) {
            var topColor = style.borderTop ? style.borderTop.color : undefined;
            var rightColor = style.borderRight ? style.borderRight.color : undefined;
            var bottomColor = style.borderBottom ? style.borderBottom.color : undefined;
            var leftColor = style.borderLeft ? style.borderLeft.color : undefined;
            var colors = [];
            if (topColor) {
                colors.push(topColor);
            }
            if (rightColor) {
                colors.push(rightColor);
            }
            if (bottomColor) {
                colors.push(bottomColor);
            }
            if (leftColor) {
                colors.push(leftColor);
            }
            var color = colors[0];
            var sameColor = true;
            for (var i = 1; i < colors.length; ++i) {
                if (!color.equals(colors[i])) {
                    sameColor = false;
                }
            }
            if (sameColor) {
                ctx.beginPath();
                outerRect.makePath(ctx, true, true);
                innerRect.makePath(ctx, false, false);
                ctx.closePath();
                ctx.fillStyle = color.toString();
                ctx.fill();
            }
            else {
                if (leftColor) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(outerRect.x1, outerRect.y1);
                    if (!topColor) {
                        ctx.lineTo(innerRect.x1 + innerRect.leftTopRadiusX, outerRect.y1);
                    }
                    ctx.lineTo(innerRect.x1 + innerRect.leftTopRadiusX, innerRect.y1 + innerRect.leftTopRadiusY);
                    ctx.lineTo(innerRect.x1 + innerRect.leftBottomRadiusX, innerRect.y2 - innerRect.leftBottomRadiusY);
                    if (!bottomColor) {
                        ctx.lineTo(innerRect.x1 + innerRect.leftBottomRadiusX, outerRect.y2);
                    }
                    ctx.lineTo(outerRect.x1, outerRect.y2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.beginPath();
                    outerRect.makePath(ctx, true, true);
                    innerRect.makePath(ctx, false, false);
                    ctx.closePath();
                    ctx.fillStyle = leftColor.toString();
                    ctx.fill();
                    ctx.restore();
                }
                if (topColor) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(outerRect.x2, outerRect.y1);
                    if (!rightColor) {
                        ctx.lineTo(outerRect.x2, outerRect.y1 + outerRect.rightTopRadiusY);
                    }
                    ctx.lineTo(innerRect.x2 - innerRect.rightTopRadiusX, innerRect.y1 + innerRect.rightTopRadiusY);
                    ctx.lineTo(innerRect.x1 + innerRect.leftTopRadiusX, innerRect.y1 + innerRect.leftTopRadiusY);
                    if (!leftColor) {
                        ctx.lineTo(outerRect.x1, outerRect.y1 + outerRect.leftTopRadiusY);
                    }
                    ctx.lineTo(outerRect.x1, outerRect.y1);
                    ctx.closePath();
                    ctx.clip();
                    ctx.beginPath();
                    outerRect.makePath(ctx, true, true);
                    innerRect.makePath(ctx, false, false);
                    ctx.closePath();
                    ctx.fillStyle = topColor.toString();
                    ctx.fill();
                    ctx.restore();
                }
                if (rightColor) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(outerRect.x2, outerRect.y2);
                    if (!bottomColor) {
                        ctx.lineTo(outerRect.x2 - outerRect.rightBottomRadiusX, outerRect.y2);
                    }
                    ctx.lineTo(innerRect.x2 - innerRect.rightBottomRadiusX, innerRect.y2 - innerRect.rightBottomRadiusY);
                    ctx.lineTo(innerRect.x2 - innerRect.rightTopRadiusX, innerRect.y1 + innerRect.rightTopRadiusY);
                    if (!topColor) {
                        ctx.lineTo(innerRect.x2 - innerRect.rightTopRadiusX, outerRect.y1);
                    }
                    ctx.lineTo(outerRect.x2, outerRect.y1);
                    ctx.closePath();
                    ctx.clip();
                    ctx.beginPath();
                    outerRect.makePath(ctx, true, true);
                    innerRect.makePath(ctx, false, false);
                    ctx.closePath();
                    ctx.fillStyle = rightColor.toString();
                    ctx.fill();
                    ctx.restore();
                }
                if (bottomColor) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(outerRect.x1, outerRect.y2);
                    if (!leftColor) {
                        ctx.lineTo(outerRect.x1, outerRect.y2 - outerRect.leftBottomRadiusY);
                    }
                    ctx.lineTo(innerRect.x1 + innerRect.leftBottomRadiusX, innerRect.y2 - innerRect.leftBottomRadiusY);
                    ctx.lineTo(innerRect.x2 - innerRect.rightBottomRadiusX, innerRect.y2 - innerRect.rightBottomRadiusY);
                    if (!rightColor) {
                        ctx.lineTo(outerRect.x2, outerRect.y2 - outerRect.rightBottomRadiusY);
                    }
                    ctx.lineTo(outerRect.x2, outerRect.y2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.beginPath();
                    outerRect.makePath(ctx, true, true);
                    innerRect.makePath(ctx, false, false);
                    ctx.closePath();
                    ctx.fillStyle = bottomColor.toString();
                    ctx.fill();
                    ctx.restore();
                }
            }
        }
        if (element.style.overflow === Style_1.Overflow.HIDDEN) {
            ctx.save();
            innerRect.clip(ctx);
            element.drawContent(ctx);
            ctx.restore();
        }
        else {
            element.drawContent(ctx);
        }
    };
    DrawUtils.getFrameImage = function (frame, parent) {
        if (frame.image) {
            return frame.image;
        }
        else if (frame.url) {
            return ResourceRegistry_1.ResourceRegistry.DefaultInstance.get(frame.url);
        }
        else if (parent.image) {
            return parent.image;
        }
        else if (parent.url) {
            return ResourceRegistry_1.ResourceRegistry.DefaultInstance.get(parent.url);
        }
        return undefined;
    };
    DrawUtils.getFrameSize = function (frame, parent) {
        var size = { width: 0, height: 0 };
        if (parent.width !== undefined) {
            size.width = parent.width;
        }
        else if (frame.destWidth !== undefined) {
            size.width = frame.destWidth + (frame.destX || 0);
        }
        else if (frame.srcWidth !== undefined) {
            size.width = frame.srcWidth;
        }
        else {
            var image = this.getFrameImage(frame, parent);
            if (image) {
                size.width = image.width;
            }
        }
        if (parent.height !== undefined) {
            size.height = parent.height;
        }
        else if (frame.destHeight !== undefined) {
            size.height = frame.destHeight + (frame.destY || 0);
        }
        else if (frame.srcHeight !== undefined) {
            size.height = frame.srcHeight;
        }
        else {
            var image = this.getFrameImage(frame, parent);
            if (image) {
                size.height = image.height;
            }
        }
        return size;
    };
    DrawUtils.drawFrame = function (ctx, rect, frame, parent) {
        var image = this.getFrameImage(frame, parent);
        if (!image) {
            return;
        }
        var size = this.getFrameSize(frame, parent);
        var scaleX = rect.width / size.width;
        var scaleY = rect.height / size.height;
        var destX = frame.destX !== undefined ? frame.destX : 0;
        var destY = frame.destY !== undefined ? frame.destY : 0;
        var destWidth = frame.destWidth !== undefined ? frame.destWidth : size.width - destX;
        var destHeight = frame.destHeight !== undefined ? frame.destHeight : size.height - destY;
        var srcX = frame.srcX !== undefined ? frame.srcX : 0;
        var srcY = frame.srcY !== undefined ? frame.srcY : 0;
        var srcWidth = frame.srcWidth !== undefined ? frame.srcWidth : destWidth;
        var srcHeight = frame.srcHeight !== undefined ? frame.srcHeight : destHeight;
        try {
            ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX * scaleX + rect.x, destY * scaleY + rect.y, destWidth * scaleX, destHeight * scaleY);
        }
        catch (e) {
            return;
        }
    };
    return DrawUtils;
}());
exports.DrawUtils = DrawUtils;


/***/ }),

/***/ "./src/utils/EnumUtils.ts":
/*!********************************!*\
  !*** ./src/utils/EnumUtils.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EnumUtils = (function () {
    function EnumUtils() {
    }
    EnumUtils.fromString = function (enumtype, value, defaultValue) {
        for (var name_1 in enumtype) {
            if (enumtype[name_1] === value) {
                return value;
            }
        }
        return defaultValue;
    };
    EnumUtils.fromStringOrUndefined = function (enumtype, value) {
        for (var name_2 in enumtype) {
            if (enumtype[name_2] === value) {
                return value;
            }
        }
        return undefined;
    };
    return EnumUtils;
}());
exports.EnumUtils = EnumUtils;


/***/ }),

/***/ "./src/utils/LatestList.ts":
/*!*********************************!*\
  !*** ./src/utils/LatestList.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LatestList = (function () {
    function LatestList(capacity) {
        if (capacity === void 0) { capacity = 10; }
        this.elements = [];
        this.capacity = capacity;
    }
    LatestList.prototype.add = function (element) {
        while (this.elements.length >= this.capacity) {
            this.elements.shift();
        }
        this.elements.push(element);
        return this;
    };
    return LatestList;
}());
exports.LatestList = LatestList;


/***/ }),

/***/ "./src/utils/LayoutUtils.ts":
/*!**********************************!*\
  !*** ./src/utils/LayoutUtils.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Runtime_1 = __webpack_require__(/*! ../runtime/Runtime */ "./src/runtime/Runtime.ts");
var Style_1 = __webpack_require__(/*! ../style/Style */ "./src/style/Style.ts");
var LayoutUtils = (function () {
    function LayoutUtils() {
    }
    LayoutUtils.updateSize = function (element, parentWidth, parentHeight) {
        element.rect.height = element.rect.width = 0;
        if (element.style.width) {
            element.rect.width = element.style.width.getValue(parentWidth);
        }
        if (element.style.minWidth) {
            element.rect.width = Math.max(element.style.minWidth.getValue(parentWidth), element.rect.width);
        }
        if (element.style.maxWidth) {
            element.rect.width = Math.min(element.style.maxWidth.getValue(parentWidth), element.rect.width);
        }
        if (element.style.height) {
            element.rect.height = element.style.height.getValue(parentHeight);
        }
        if (element.style.minHeight) {
            element.rect.height = Math.max(element.style.minHeight.getValue(parentHeight), element.rect.height);
        }
        if (element.style.maxHeight) {
            element.rect.height = Math.min(element.style.maxHeight.getValue(parentHeight), element.rect.height);
        }
        if (element.style.aspectRatio !== undefined) {
            var width = element.rect.height * element.style.aspectRatio;
            if (width >= element.rect.width) {
                element.rect.width = width;
            }
            else {
                element.rect.height = element.rect.width / element.style.aspectRatio;
            }
        }
        if (element.style.boxSizing === Style_1.BoxSizing.CONTENT_BOX) {
            element.rect.width +=
                (element.style.paddingLeft ? element.style.paddingLeft.getValue(element.rect.width) : 0) +
                    (element.style.paddingRight ? element.style.paddingRight.getValue(element.rect.width) : 0) +
                    (element.style.borderLeft ? element.style.borderLeft.width : 0) +
                    (element.style.borderRight ? element.style.borderRight.width : 0);
            element.rect.height +=
                (element.style.paddingTop ? element.style.paddingTop.getValue(element.rect.height) : 0) +
                    (element.style.paddingBottom
                        ? element.style.paddingBottom.getValue(element.rect.height)
                        : 0) +
                    (element.style.borderTop ? element.style.borderTop.width : 0) +
                    (element.style.borderBottom ? element.style.borderBottom.width : 0);
        }
    };
    LayoutUtils.updatePositionForAbsoluteElement = function (element, parentWidth, parentHeight) {
        if (element.style.right) {
            element.rect.x =
                parentWidth -
                    element.rect.width -
                    element.style.right.getValue(parentWidth) -
                    (element.style.marginRight ? element.style.marginRight.getValue(parentWidth) : 0);
        }
        else if (element.style.left) {
            element.rect.x =
                element.style.left.getValue(parentWidth) +
                    (element.style.marginLeft ? element.style.marginLeft.getValue(parentWidth) : 0);
        }
        else {
            element.rect.x = element.style.marginLeft
                ? element.style.marginLeft.getValue(parentWidth)
                : 0;
        }
        if (element.style.bottom) {
            element.rect.y =
                parentHeight -
                    element.rect.height -
                    element.style.bottom.getValue(parentHeight) -
                    (element.style.marginBottom ? element.style.marginBottom.getValue(parentHeight) : 0);
        }
        else if (element.style.top) {
            element.rect.y =
                element.style.top.getValue(parentHeight) +
                    (element.style.marginTop ? element.style.marginTop.getValue(parentHeight) : 0);
        }
        else {
            element.rect.y = element.style.marginTop ? element.style.marginTop.getValue(parentHeight) : 0;
        }
    };
    LayoutUtils.measureTextWidth = function (text, font) {
        if (text.length === 0) {
            return 0;
        }
        var canvas = Runtime_1.Runtime.get().newCanvas();
        var ctx = canvas.getContext('2d');
        var width = 0;
        if (ctx) {
            ctx.save();
            ctx.font = font.toString();
            width = ctx.measureText(text).width;
            ctx.restore();
        }
        Runtime_1.Runtime.get().releaseCanvas(canvas);
        return width;
    };
    return LayoutUtils;
}());
exports.LayoutUtils = LayoutUtils;


/***/ }),

/***/ "./src/utils/StringUtils.ts":
/*!**********************************!*\
  !*** ./src/utils/StringUtils.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StringUtils = (function () {
    function StringUtils() {
    }
    StringUtils.matchAll = function (str, regex) {
        var result = [];
        var localCopy = new RegExp(regex, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        var match = localCopy.exec(str);
        while (match) {
            result.push(match);
            match = localCopy.exec(str);
        }
        return result;
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;


/***/ }),

/***/ "./src/utils/StyleUtils.ts":
/*!*********************************!*\
  !*** ./src/utils/StyleUtils.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BaseValue_1 = __webpack_require__(/*! ../base/BaseValue */ "./src/base/BaseValue.ts");
var StyleUtils = (function () {
    function StyleUtils() {
    }
    StyleUtils.parse4Dirs = function (value) {
        var pieces = value.trim().split(/\s+/);
        if (pieces.length === 1) {
            return [
                BaseValue_1.BaseValue.of(pieces[0]),
                BaseValue_1.BaseValue.of(pieces[0]),
                BaseValue_1.BaseValue.of(pieces[0]),
                BaseValue_1.BaseValue.of(pieces[0])
            ];
        }
        else if (pieces.length === 2) {
            return [
                BaseValue_1.BaseValue.of(pieces[0]),
                BaseValue_1.BaseValue.of(pieces[1]),
                BaseValue_1.BaseValue.of(pieces[0]),
                BaseValue_1.BaseValue.of(pieces[1])
            ];
        }
        else if (pieces.length === 3) {
            return [
                BaseValue_1.BaseValue.of(pieces[0]),
                BaseValue_1.BaseValue.of(pieces[1]),
                BaseValue_1.BaseValue.of(pieces[2]),
                BaseValue_1.BaseValue.of(pieces[1])
            ];
        }
        else if (pieces.length === 4) {
            return [
                BaseValue_1.BaseValue.of(pieces[0]),
                BaseValue_1.BaseValue.of(pieces[1]),
                BaseValue_1.BaseValue.of(pieces[2]),
                BaseValue_1.BaseValue.of(pieces[3])
            ];
        }
        else {
            return undefined;
        }
    };
    return StyleUtils;
}());
exports.StyleUtils = StyleUtils;


/***/ }),

/***/ "./src/utils/URLUtils.ts":
/*!*******************************!*\
  !*** ./src/utils/URLUtils.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var URLUtils = (function () {
    function URLUtils() {
    }
    URLUtils.isAbsolute = function (url) {
        return url.indexOf('://') > 0 || url.startsWith('//');
    };
    URLUtils.getDomain = function (url) {
        var s;
        if (url.startsWith('//')) {
            s = 2;
        }
        else {
            s = url.indexOf('://');
            if (s <= 0)
                return undefined;
            s += 3;
        }
        var e = url.indexOf(':', s);
        if (e < 0) {
            e = url.indexOf('/', s);
        }
        if (e < 0) {
            return url.substring(s);
        }
        else {
            return url.substring(s, e);
        }
    };
    URLUtils.getOrigin = function (url) {
        var s;
        if (url.startsWith('//')) {
            s = 2;
        }
        else {
            s = url.indexOf('://');
            if (s <= 0)
                return undefined;
            s += 3;
        }
        var e = url.indexOf('/', s);
        if (e < 0) {
            return url;
        }
        else {
            return url.substring(0, e);
        }
    };
    return URLUtils;
}());
exports.URLUtils = URLUtils;


/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./Base64 */ "./src/utils/Base64.ts"));
__export(__webpack_require__(/*! ./ContainerUtils */ "./src/utils/ContainerUtils.ts"));
__export(__webpack_require__(/*! ./CRC32 */ "./src/utils/CRC32.ts"));
__export(__webpack_require__(/*! ./Delay */ "./src/utils/Delay.ts"));
__export(__webpack_require__(/*! ./DrawUtils */ "./src/utils/DrawUtils.ts"));
__export(__webpack_require__(/*! ./EnumUtils */ "./src/utils/EnumUtils.ts"));
__export(__webpack_require__(/*! ./LatestList */ "./src/utils/LatestList.ts"));
__export(__webpack_require__(/*! ./LayoutUtils */ "./src/utils/LayoutUtils.ts"));
__export(__webpack_require__(/*! ./StringUtils */ "./src/utils/StringUtils.ts"));
__export(__webpack_require__(/*! ./StyleUtils */ "./src/utils/StyleUtils.ts"));
__export(__webpack_require__(/*! ./URLUtils */ "./src/utils/URLUtils.ts"));


/***/ })

/******/ });
});
//# sourceMappingURL=createts.js.map