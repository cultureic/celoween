#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createCourse() {
  try {
    console.log('🏗️ Creating new course...')

    // 1. Get or create supporting data
    const category = await prisma.category.upsert({
      where: { slug: 'my-category' },
      update: {},
      create: { slug: 'my-category', name: 'My Category' }
    })

    const level = await prisma.level.upsert({
      where: { slug: 'principiante' },
      update: {},
      create: { slug: 'principiante', name: 'Principiante' }
    })

    const instructor = await prisma.instructor.upsert({
      where: { id: 'my-instructor-1' },
      update: {},
      create: {
        id: 'my-instructor-1',
        name: 'Your Name',
        title: 'Course Instructor',
        bio: 'Expert in Celo development'
      }
    })

    // 2. Create the course
    const course = await prisma.course.create({
      data: {
        slug: 'my-awesome-course',
        title: 'My Awesome Course',
        subtitle: 'Learn to build amazing things on Celo',
        categoryId: category.id,
        levelId: level.id,
        isFree: true,
        visibility: 'PUBLIC',
        status: 'PUBLISHED',
        learners: 0,
        rating: 4.8,
        ratingCount: 0,
        durationHours: 10,
        lessonsCount: 15,
        coverUrl: 'https://example.com/cover.jpg',
        promoVideoUrl: 'https://youtube.com/watch?v=xyz'
      }
    })

    // 3. Link instructor to course
    await prisma.courseInstructor.create({
      data: {
        courseId: course.id,
        instructorId: instructor.id,
        role: 'Lead Instructor'
      }
    })

    // 4. Create modules
    const module1 = await prisma.module.create({
      data: {
        courseId: course.id,
        index: 1,
        title: 'Introduction',
        summary: 'Getting started with the basics'
      }
    })

    const module2 = await prisma.module.create({
      data: {
        courseId: course.id,
        index: 2,
        title: 'Advanced Topics',
        summary: 'Deep dive into complex concepts'
      }
    })

    // 5. Create lessons
    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        index: 1,
        title: 'Welcome to the Course',
        summary: 'Course overview and objectives',
        contentMdx: `# Welcome to My Awesome Course

## What You'll Learn

In this course, you will:
- Understand the basics of Celo
- Build your first dApp
- Deploy to testnet

## Prerequisites

- Basic JavaScript knowledge
- Familiarity with React (recommended)

Let's get started! 🚀`,
        status: 'PUBLISHED',
        visibility: 'PUBLIC'
      }
    })

    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        index: 2,
        title: 'Setting Up Your Environment',
        summary: 'Install tools and configure your development environment',
        contentMdx: `# Setting Up Your Development Environment

## Required Tools

1. **Node.js** (version 18+)
2. **Git** for version control
3. **VS Code** (recommended editor)

## Installation Steps

### 1. Install Node.js
\`\`\`bash
# Check if you have Node.js installed
node --version

# If not installed, download from nodejs.org
\`\`\`

### 2. Clone the Celo Composer
\`\`\`bash
git clone https://github.com/celo-org/celo-composer.git
cd celo-composer
npm install
\`\`\`

### 3. Configure your environment
Create a \`.env.local\` file:
\`\`\`env
NEXT_PUBLIC_WC_PROJECT_ID=your_project_id
\`\`\`

## Next Steps
In the next lesson, we'll create your first smart contract.`,
        status: 'PUBLISHED',
        visibility: 'PUBLIC'
      }
    })

    await prisma.lesson.create({
      data: {
        moduleId: module2.id,
        index: 1,
        title: 'Advanced Smart Contracts',
        summary: 'Learn advanced patterns and best practices',
        contentMdx: `# Advanced Smart Contract Patterns

## Upgradeable Contracts

Learn how to create contracts that can be upgraded safely:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyUpgradeableContract is Initializable {
    uint256 public value;
    
    function initialize(uint256 _value) public initializer {
        value = _value;
    }
    
    function setValue(uint256 _value) external {
        value = _value;
    }
}
\`\`\`

## Security Considerations

- Always use SafeMath for arithmetic operations
- Implement access controls
- Validate inputs thoroughly
- Test extensively

## Best Practices

1. **Gas Optimization**
2. **Error Handling**
3. **Documentation**
4. **Testing Coverage**`,
        status: 'PUBLISHED',
        visibility: 'PUBLIC'
      }
    })

    console.log(`✅ Course created successfully!`)
    console.log(`Course ID: ${course.id}`)
    console.log(`Course Slug: ${course.slug}`)
    console.log(`Access at: /academy/${course.slug}`)

  } catch (error) {
    console.error('❌ Error creating course:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createCourse()