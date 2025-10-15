import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
async function main(){
  console.log('🌱 Seeding database...')
  
  // Create levels
  const principiante = await p.level.upsert({ where:{ slug:'principiante' }, update:{}, create:{ slug:'principiante', name:'Principiante' }})
  const intermedio = await p.level.upsert({ where:{ slug:'intermedio' }, update:{}, create:{ slug:'intermedio', name:'Intermedio' }})
  const avanzado = await p.level.upsert({ where:{ slug:'avanzado' }, update:{}, create:{ slug:'avanzado', name:'Avanzado' }})
  
  // Create categories
  const celo = await p.category.upsert({ where:{ slug:'celo' }, update:{}, create:{ slug:'celo', name:'Celo' }})
  const fundamentos = await p.category.upsert({ where:{ slug:'fundamentos' }, update:{}, create:{ slug:'fundamentos', name:'Fundamentos' }})
  const desarrollo = await p.category.upsert({ where:{ slug:'desarrollo' }, update:{}, create:{ slug:'desarrollo', name:'Desarrollo' }})
  
  // Create instructor
  const inst = await p.instructor.upsert({ where:{ id:'seed-inst-1' }, update:{}, create:{ id:'seed-inst-1', name:'Celo México', title:'Equipo Instructor', bio:'Formación práctica para construir en el ecosistema Celo.' }})
  
  // Create courses
  const course1 = await p.course.upsert({
    where:{ slug:'introduccion-a-celo' },
    update:{},
    create:{
      slug:'introduccion-a-celo',
      title:'Introducción a Celo',
      subtitle:'Primeros pasos en el ecosistema Celo.',
      levelId: principiante.id, categoryId: celo.id,
      isFree:true, visibility:'PUBLIC', status:'PUBLISHED',
      learners: 1200, rating: 4.8, ratingCount: 100, durationHours: 8, lessonsCount: 30,
      coverUrl: 'https://via.placeholder.com/400x225/FCFF52/000000?text=Introduccion+a+Celo',
      promoVideoUrl: 'https://www.youtube.com/watch?v=QOCO1G8cJyI'
    }
  })
  
  const course2 = await p.course.upsert({
    where:{ slug:'fundamentos-web3' },
    update:{},
    create:{
      slug:'fundamentos-web3',
      title:'Fundamentos de Web3',
      subtitle:'Aprende los conceptos básicos de blockchain y Web3.',
      levelId: principiante.id, categoryId: fundamentos.id,
      isFree:true, visibility:'PUBLIC', status:'PUBLISHED',
      learners: 800, rating: 4.7, ratingCount: 85, durationHours: 6, lessonsCount: 25,
      coverUrl: 'https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Fundamentos+Web3'
    }
  })
  
  const course3 = await p.course.upsert({
    where:{ slug:'desarrollo-dapps' },
    update:{},
    create:{
      slug:'desarrollo-dapps',
      title:'Desarrollo de dApps',
      subtitle:'Construye aplicaciones descentralizadas en Celo.',
      levelId: intermedio.id, categoryId: desarrollo.id,
      isFree:true, visibility:'PUBLIC', status:'PUBLISHED',
      learners: 500, rating: 4.9, ratingCount: 60, durationHours: 12, lessonsCount: 40,
      coverUrl: 'https://via.placeholder.com/400x225/10B981/FFFFFF?text=Desarrollo+dApps'
    }
  })
  
  // Link instructors to courses
  await p.courseInstructor.upsert({ where:{ courseId_instructorId:{ courseId:course1.id, instructorId:inst.id }}, update:{}, create:{ courseId:course1.id, instructorId:inst.id, role:'Lead' }})
  await p.courseInstructor.upsert({ where:{ courseId_instructorId:{ courseId:course2.id, instructorId:inst.id }}, update:{}, create:{ courseId:course2.id, instructorId:inst.id, role:'Lead' }})
  await p.courseInstructor.upsert({ where:{ courseId_instructorId:{ courseId:course3.id, instructorId:inst.id }}, update:{}, create:{ courseId:course3.id, instructorId:inst.id, role:'Lead' }})
  
  // Create modules and lessons for course 1
  const m1 = await p.module.upsert({ 
    where:{ courseId_index:{ courseId:course1.id, index:1 }}, 
    update:{}, 
    create:{ courseId:course1.id, index:1, title:'Bienvenida', summary:'Setup rápido' }
  })
  
  await p.lesson.upsert({
    where:{ moduleId_index:{ moduleId:m1.id, index:1 }},
    update:{},
    create:{
      moduleId:m1.id, index:1, title:'¿Qué es Celo?', summary:'Visión y casos',
      contentMdx: `# ¿Qué es Celo?
**Celo** es una cadena enfocada en impacto. 
- Stablecoins (cUSD, cEUR)
- MiniPay / Valora
- Ecosistema DeFi
`,
      status:'PUBLISHED', visibility:'PUBLIC'
    }
  })
  
  await p.lesson.upsert({
    where:{ moduleId_index:{ moduleId:m1.id, index:2 }},
    update:{},
    create:{
      moduleId:m1.id, index:2, title:'Tu primera wallet', summary:'Onboarding',
      contentMdx: `## Tu primera wallet
Sigue estos pasos para crear y respaldar tu wallet. _Tip:_ prueba en testnet.`,
      status:'PUBLISHED', visibility:'PUBLIC'
    }
  })
  
  console.log('✅ Database seeded successfully!')
}
main().then(()=>p.$disconnect()).catch(async e=>{ console.error(e); await p.$disconnect(); process.exit(1) })


