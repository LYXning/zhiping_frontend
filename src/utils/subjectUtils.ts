export const subjectsArray = [
  '语文',
  '数学',
  '英语',
  '物理',
  '化学',
  '生物',
  '历史',
  '地理',
  '政治',
  '体育',
  '音乐',
  '美术',
  '信息技术',
  '语言',
  '社会',
  '教育',
  '法律',
];

export const getSubjectIdByName = (subjectName: string) => {
  return subjectsArray.indexOf(subjectName) + 1;
};

export const getSubjectNameById = (subjectId: number) => {
  return subjectsArray[subjectId - 1];
};
