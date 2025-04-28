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
];

export const subjectsArrayEnglish = [
  'Chinese',
  'Math',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Politics',
];

export const getSubjectIdByName = (subjectName: string) => {
  return subjectsArray.indexOf(subjectName) + 1;
};

export const getSubjectNameById = (subjectId: number) => {
  return subjectsArray[subjectId - 1];
};

export const getSubjectEnglishNameById = (subjectId: number) => {
  return subjectsArrayEnglish[subjectId - 1];
};

export const getChinsesNameByEnglishName = (subjectName: string) => {
  return subjectsArray[subjectsArrayEnglish.indexOf(subjectName)];
};
