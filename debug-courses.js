const { COURSES, getCourseBySlug } = require('./data/academy.ts');

console.log('Total courses:', COURSES.length);

const course = getCourseBySlug('reputacion-on-chain-e-incentivos');
if (course) {
  console.log('Course found:', course.title);
  console.log('Modules:', course.modules.length);
  
  course.modules.forEach((module, i) => {
    console.log(`Module ${i + 1}:`, module.title);
    module.submodules.forEach((submodule, j) => {
      console.log(`  Submodule ${j + 1}:`, submodule.title);
      submodule.items.forEach((item, k) => {
        if (item.type === 'video') {
          console.log(`    VIDEO ${k + 1}:`, item.title, 'ResourceUrl:', item.resourceUrl);
        }
      });
    });
  });
} else {
  console.log('Course not found');
}



