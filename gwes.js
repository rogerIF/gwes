// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// gwes syntax highlight - simple mode


(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../../addon/mode/simple"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../../addon/mode/simple"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineSimpleMode("gwes", {
    // The start state contains the rules that are intially used
    start: [
      // 关键字
      {regex: /\b(?:and|or|not|xor|to|pre)\b/i,token: "keyword"},
      //操作符
      {regex: /[=<>!]+/, token: "number"},
      {regex: /[%#?]+/, token: "atom"},

      //中文括号，当错误提示
      {regex: /（+/, token: "error"},
      {regex: /）+/, token: "error"},
      //英文括号，不缩进
      {regex: /\(/, token:"bracket"/*, indent: true*/},
      {regex: /\)/, token:"bracket"/*, dedent: true*/},
      //字符串
      // { regex: /'(?:[^\\']|\\.)*'?/, token: "string" },
      { regex: /'(?:[^\\']|\\.)*?/, token: "string",next:"string" },


    ],
    string: [
      {regex: /(?:[^\\]|\\.)*?'/, token: "string", next: "start"},
      {regex: /.*/, token: "string"}
    ],

    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      //模式的自动缩进不应生效的状态数组。通常用于多行注释和字符串状态。
      //dontIndentStates: ["start", "vocabulary", "string", "string3", "stack"],
    }
  });

  CodeMirror.defineMIME("text/gwes", "gwes");
});
