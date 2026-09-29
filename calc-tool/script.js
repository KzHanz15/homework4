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