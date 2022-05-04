"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var utils = __importStar(require("./utils"));
function niceError(errorsDictionary, errors) {
    var createContext = this || {};
    if (errorsDictionary && !errors && !createContext.dictionary) {
        errors = errorsDictionary;
        errorsDictionary = undefined;
    }
    else if (errorsDictionary && !errors && createContext.dictionary) {
        errors = errorsDictionary;
        errorsDictionary = createContext.dictionary;
    }
    else if (errorsDictionary && errors && createContext.dictionary) {
        errorsDictionary = __assign(__assign({}, createContext.dictionary), errorsDictionary);
    }
    var methods = {
        throw: function (code) {
            var _a, _b;
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (errorsDictionary && errorsDictionary[code]) {
                throw new utils.CustomError(code, (_a = errorsDictionary)[code].apply(_a, params));
            }
            else {
                throw new ((_b = utils.CustomError).bind.apply(_b, __spreadArray([void 0], Array.from(arguments), false)))();
            }
        }
    };
    function Interator() {
        var _this_1 = this;
        var others = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            others[_i] = arguments[_i];
        }
        var index = 0;
        var _this = this;
        this.errors = [];
        this.next = function () {
            try {
                var error = !this.position ? errors[index++] : errors[this.position];
                error.apply(Object.assign({ params: others, errorName: error === null || error === void 0 ? void 0 : error.name }, {
                    message: typeof this.message !== 'function' ? this.message : undefined,
                    methods: {
                        next: this.next.bind(_this),
                        repeatNext: this.repeatNext.bind(_this),
                        message: _this.message,
                        error: this.error.bind(_this),
                        errors: this.errors
                    },
                    throw: methods.throw
                }), Array.from(arguments));
            }
            catch (error) {
                this.errors.push(error);
                if (createContext.onError)
                    createContext.onError(error);
                throw error;
            }
        };
        this.repeatNext = function (repeatCount) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var messages = [].concat(_this_1.message);
            var repeatPosition = 0;
            while (repeatPosition++ < repeatCount) {
                _this_1.next.apply(__assign(__assign({}, _this_1), { message: messages[repeatPosition - 1] }), args);
            }
        }; };
        this.message = function (message) {
            var _this = Object.assign({}, this);
            var context = Object.assign({}, this, { message: [].concat(message)[0] });
            _this.next = _this.next.bind(context);
            _this.repeatNext = _this.repeatNext.bind(Object.assign({}, this, { message: message }));
            _this.error = _this.error.bind(context);
            return _this;
        };
        this.error = function (position) { return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var positionName = position;
            if (typeof position == 'string' && errors) {
                position = errors.findIndex(function (e) { return (e === null || e === void 0 ? void 0 : e.name) == position; });
            }
            if (!(position >= 0))
                throw new Error("Invalid position: ".concat(positionName));
            return _this_1.next.apply(__assign(__assign(__assign({ params: others }, methods), _this_1), { position: position }), args);
        }; };
        return this;
    }
    return Interator.bind({});
}
/**
 *
 * @example
 *
 * //----------------config.ts-------------------------------
 *  import {create} from 'niceerror'
    export const handleError = create({
        dictionary: {
            'E001'() => 'ERRO 1',
            'E002': (name) => 'ERRO: '+name,
            'E003': () => 'ERRO 3 here',
        },
        onError(error){
            console.log(error.name, error.message)
        }
    })

 */
var create = function (data) { return niceError.bind(data); };
exports.create = create;
exports.default = niceError;
