// console-mirror.js
// 作用：把浏览器 Console 的输出同时渲染到页面的 <pre id="console"> 上，
// 方便将运行结果以页面形式截图保存。不影响 script.js 的原始逻辑。
(function () {
  var box = document.getElementById('console');
  if (!box) return;
  box.innerHTML = '';

  function line(text, cls, tableRows) {
    var d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    if (tableRows) {
      var thead = document.createElement('div');
      thead.className = 'row0';
      thead.textContent = text;
      d.appendChild(thead);
      tableRows.forEach(function (r) {
        var rd = document.createElement('div');
        rd.textContent = r;
        d.appendChild(rd);
      });
    } else {
      d.textContent = text;
    }
    box.appendChild(d);
  }

  function encode(obj) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (Array.isArray(obj)) {
      var keys = obj.length ? Object.keys(obj[0]) : [];
      var out = ['['];
      obj.forEach(function (o) {
        out.push('  ' + keys.map(function (k) { return o[k]; }).join('\t'));
      });
      out.push(']');
      return out.join('\n');
    }
    if (typeof obj === 'object') return JSON.stringify(obj);
    return String(obj);
  }

  function tableLines(obj) {
    if (!Array.isArray(obj) || !obj.length) return [];
    var keys = Object.keys(obj[0]);
    var head = keys.join('\t');
    var rows = obj.map(function (o) { return keys.map(function (k) { return o[k]; }).join('\t'); });
    return ['  ' + head].concat(rows.map(function (r) { return '  ' + r; }));
  }

  var _log = console.log, _error = console.error, _table = console.table,
      _time = console.time, _timeEnd = console.timeEnd, _timeMap = {};
  console.time = function (label) { _timeMap[label] = performance.now(); _time(label); };
  console.timeEnd = function (label) {
    _timeEnd(label);
    var ms = performance.now() - (_timeMap[label] || performance.now());
    line('» ' + label + ': ~' + ms.toFixed(2) + ' ms（精确值见Console）', 'dim');
  };
  console.log = function () {
    var parts = [];
    for (var i = 0; i < arguments.length; i++) parts.push(encode(arguments[i]));
    var joined = parts.join('; ');
    joined.split('\n').forEach(function (s) { line(s); });
    _log.apply(console, arguments);
  };
  console.error = function () {
    line('⚠ ' + Array.prototype.map.call(arguments, String).join(' '), 'dim');
    _error.apply(console, arguments);
  };
  console.table = function (obj) {
    line(tableLines(obj).length ? '┌ 表格 ─────────────' : '（空表格）', 'tbl', tableLines(obj).length ? tableLines(obj) : undefined);
    _table.apply(console, arguments);
  };
})();