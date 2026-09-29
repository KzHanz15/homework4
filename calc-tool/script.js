// ========== 数据计算小工具：绩点计算（GPA）==========
// 场景：根据每门课程的成绩(百分制)与学分，计算学分加权的绩点(GPA)。
// 数据用「数组 + 对象」组织：每门课一个对象 { name, category, credit, score }。

// ---- 得分方案：百分制 → 4.0 绩点（单值进、单值出，纯函数） ----
const scoreToPoint = (score) => {
  if (score >= 90) return 4.0;
  if (score >= 85) return 3.7;
  if (score >= 82) return 3.3;
  if (score >= 78) return 3.0;
  if (score >= 75) return 2.7;
  if (score >= 72) return 2.3;
  if (score >= 68) return 2.0;
  if (score >= 64) return 1.5;
  if (score >= 60) return 1.0;
  return 0.0; // 不及格
};

// ---- 原始数据：数组+对象。故意混入两条非法分数(105 / -8)用于测试清洗 ----
const courses = [
  { name: '高等数学',  category: '必修', credit: 5, score: 92 },
  { name: '数据结构',  category: '必修', credit: 4, score: 87 },
  { name: '大学英语',  category: '必修', credit: 3, score: 78 },
  { name: '体育',      category: '必修', credit: 1, score: 95 },
  { name: '毛概',      category: '必修', credit: 3, score: 59 },
  { name: '心理学',    category: '选修', credit: 2, score: 105 }, // 非法：>100
  { name: '吉他入门',  category: '选修', credit: 2, score: -8 }   // 非法：<0
];

// ---- 非法输入处理（清洗）：filter 仅保留 0~100 的合法成绩 ----
const cleanCourses = (list) => list.filter(c => c.score >= 0 && c.score <= 100);

// ---- map：为每条课程附加对应绩点 point（对象展开复制，不改原数组） ----
const attachPoint = (list) => list.map(c => ({ ...c, point: scoreToPoint(c.score) }));

// ---- reduce：加权GPA = Σ(学分×绩点) ÷ Σ学分；空数组保护避免 NaN ----
const gpa = (list) => {
  if (!list.length) return 0.0;
  const weighted = list.reduce((sum, c) => sum + c.credit * c.point, 0);
  const credits = list.reduce((sum, c) => sum + c.credit, 0);
  return (weighted / credits).toFixed(2);
};

// ---- 汇总输出 ----
const summarize = (list) => {
  const credits = list.reduce((s, c) => s + c.credit, 0);
  const passed = list.filter(c => c.score >= 60).length;
  return `课程${list.length}门，总学分${credits}分，及格${passed}门，加权GPA = ${gpa(list)}`;
};

// ---- 运行：数据 → 清洗 → 计算 ----
const clean = cleanCourses(courses);
console.log('原始数据（含非法分数）：');
console.table(courses);
console.log('被清洗掉的非法条数：', courses.length - clean.length);
const withPoint = attachPoint(clean);
console.log('各科绩点明细：');
console.table(withPoint);
console.log(summarize(withPoint));
console.log('空数组测试 GPA =', gpa([])); // 空数组不崩溃

// ==================== 独立研究任务部分 ====================

// ---- 研究任务1：排序深入研究（双字段排序）----
// Array.prototype.sort 的比较函数返回值规则：
//   返回负数 → a 排在 b 前面；返回正数 → b 排在 a 前面；返回 0 → 保持原相对顺序。
// 现代 V8 的 sort 是稳定的，因此"先按类别再按分数"可写成两个条件拼接。
// 用 [...list] 复制一份再排序，避免改动原数组（sort 默认原地修改）。
const sortByCategoryThenScore = (list) =>
  [...list].sort((a, b) => a.category.localeCompare(b.category) || b.score - a.score);

console.log('—— 研究任务1：按【类别→分数】排序 ——');
console.table(sortByCategoryThenScore(withPoint));

// ---- 研究任务2：正则表达式初探（用正则清洗课程名中的多余空格）----
// 正则 /\s+/g：\s 匹配任意空白(空格/制表/换行)，+ 匹配一个或多个，g 表示全局替换全部。
// replace('\s+',' ') 把"连续多个空白"折叠成单个空格；trim() 再去掉首尾空白。
const normalizeName = (name) => name.replace(/\s+/g, ' ').trim();

console.log('—— 研究任务2：正则清洗多余空格 ——');
console.log("'  C  语 言  ( 换行空格)' ->", normalizeName('  C  语\n言  '));

// ---- 研究任务3：性能对比（for 循环 vs reduce）----
// console.time('标识') 到 console.timeEnd('标识') 之间计时（毫秒）。
const perfCompare = () => {
  const big = Array.from({ length: 1000000 }, (_, i) => ({ v: i % 100 }));
  console.time('reduce');
  const sumA = big.reduce((acc, x) => acc + x.v, 0);
  console.timeEnd('reduce');
  console.time('for');
  let sumB = 0;
  for (let i = 0; i < big.length; i++) sumB += big[i].v;
  console.timeEnd('for');
  console.log('两法结果一致：', sumA === sumB);
};

console.log('—— 研究任务3：百万条求和耗时对比 ——');
perfCompare();