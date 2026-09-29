// ===== 班级成绩统计工具（案例复现）=====
// 全程不写页面，输出到浏览器 Console。
// 数据用「数组 + 对象」组织：每个学生一个对象 { name, score }

// ---------- 第一步：成绩数据 ----------
const scores = [
  { name: '李四', score: 92 },
  { name: '王五', score: 45 },
  { name: '赵六', score: 77 },
  { name: '孙七', score: 59 },
  { name: '周八', score: 88 },
  { name: '吴九', score: 105 }, // 故意混入非法值：超过满分100
  { name: '郑十', score: -3 } //  负分
];

console.log('原始数据：');
console.table(scores);

// ---------- 第二步：清洗与统计函数 ----------
// 清洗：只保留 0 至 100 之间的合法成绩（filter）
const cleanScores = (list) => list.filter(s => s.score >= 0 && s.score <= 100);

// 平均分：先用 reduce 求和，再除以人数，保留两位小数
const average = (list) => {
  if (list.length === 0) return 0; // 空数组保护，避免除以 0 产生 NaN
  const total = list.reduce((sum, s) => sum + s.score, 0);
  return (total / list.length).toFixed(2);
};

// 最高分：reduce 逐项比较，返回分数最高的对象
const highest = (list) => list.reduce((max, s) => s.score > max.score ? s : max, list[0]);

// 不及格名单：filter 挑出 <60，再 map 取出姓名
const failed = (list) => list.filter(s => s.score < 60).map(s => s.name);

const valid = cleanScores(scores);
console.log('清洗后数据：');
console.table(valid);
console.log('平均分：', average(valid));
console.log('最高分：', highest(valid));
console.log('不及格名单：', failed(valid));

// ---------- 第三步：等级分布与格式化输出 ----------
// 等级判定：单值进单值出，纯函数
const toGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// 各等级人数统计
const gradeCount = (list) => {
  const result = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  list.forEach(s => { result[toGrade(s.score)]++; });
  return result;
};

// 格式化报告
const report = (list) => {
  const v = cleanScores(list);
  if (v.length === 0) {
    return '没有有效成绩';
  }
  const dist = gradeCount(v);
  return `有效人数${v.length}人，平均${average(v)}分，最高${highest(v).score}分（${highest(v).name}）;
等级分布：A${dist.A}人 B${dist.B}人 C${dist.C}人 D${dist.D}人 F${dist.F}人；
不及格名单：${failed(v).join('、') || '无'}`;
};

try {
  console.log('报告：');
  console.log(report(scores));
} catch (err) {
  console.error('报告生成失败：', err.message);
}

// 故意实验：空数组不会崩溃，输出“没有有效成绩”
console.log('—— 空数组测试 ——');
console.log(report([]));