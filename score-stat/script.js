// ===== 班级成绩统计工具（案例复现）=====
// 第一步：定义成绩数据。数据用「数组 + 对象」组织。
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