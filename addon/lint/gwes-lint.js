// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
//gwes的校验：不允许在非字符串中出现中文小括号（）

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.registerHelper("lint", "gwes", function(text, options) {
  var found = [];
  var  messages = lintES(text), message = null;
  for ( var i = 0; i < messages.length; i++) {
    message = messages[i];
    var startLine = message.line -1, endLine = message.line -1, startCol = message.col -1, endCol = message.col;
    found.push({
      from: CodeMirror.Pos(startLine, startCol),
      to: CodeMirror.Pos(endLine, endCol),
      message: message.message,
      severity : message.type
    });
  }
  return found;
});

});

function lintES(text) {
  if(!text){
    return [];
  }
  //排除字符串的干扰,把字符串统统替换成空格
  text = replaceStrToFormat(text,' ');

  //把代码转变成数组，每一行代表一个元素
  var linesArray = text.split("\n"),
    //返回的格式化的数据
      returnArr =[],
    //检查的规则的数组
      lintRules=[
        //type取值范围：warning,error
        {name:'（',type:"error"},
        {name:'）',type:"error"},
      ];

  //遍历行
  linesArray.forEach(function(line,lineIndex){
    //遍历规则
    lintRules.forEach(function(rule){
      //获取符合规则的字符串的位置
      var indexsArr = getIndexes(line,rule.name);
      if(indexsArr.length>0){
        //同一行的多个错误
        indexsArr.forEach(function(pos){
          returnArr.push({
            type:rule.type,
            line:lineIndex+1,
            col:pos+1,
            message: rule.name + " 出现在第 " + (lineIndex+1) + " 行，第 "+ (pos+1) + " 列"
          })
        })

      }
    })


  })
  return returnArr;

}

/**
 * 从一个字符串中letter查到所有指定字符串substr的索引位置
 * @param letter 字符串母体
 * @param substr 要查找的子字符串
 * @returns {Array} index组成的数组，如果没有找到，返回空数组
 */
function getIndexes(letter,substr) {
  var indexs = [];
  var idx = letter.indexOf(substr);
  while (idx !== -1) {
    indexs.push(idx);
    idx = letter.indexOf(substr, idx + 1);
  }
  return indexs;
}

/**
 * 将任意字符串转换成用指定字符串替换掉的格式,
 * 思路：先把换行符\n用其他符号|```|代替，然后把除|```|以外的字符全部替换为空格，最后再把 |```| 替换成 \n
 * @param str 原始字符串
 * @param fmt 指定的替换格式
 */
function replaceStrToFormat(str,fmt) {
  // var p=/'.*\n*.*'/g;//单行或多行字符串，形如： a'bcd'e 或 a'b\ncd'e
  var p=/'.*?'/g;//单行或多行字符串，形如： a'bcd'e 或 a'b\ncd'e
  var nTemp = '|```|';
  str = str.replace(/\n/g,nTemp);


  var formattedStr = str.replace(p,function(matchStr){
    //将任意字符串用指定格式的字符串fmt代替
    return matchStr.replace(/[^\|```\|]/g,fmt);
  });
  return formattedStr.replace(/\|```\|/g,"\n");
}