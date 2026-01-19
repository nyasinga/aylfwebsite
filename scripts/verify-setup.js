#!/usr/bin/env node

/**
 * Script to verify project setup
 * Checks for required files and directories
 */

const fs = require('fs')
const path = require('path')

const checks = []
let hasErrors = false

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath)
  const exists = fs.existsSync(fullPath)
  checks.push({ description, exists, path: filePath })
  if (!exists) hasErrors = true
  return exists
}

function checkDir(dirPath, description) {
  const fullPath = path.join(process.cwd(), dirPath)
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()
  checks.push({ description, exists, path: dirPath, isDir: true })
  if (!exists) hasErrors = true
  return exists
}

console.log('\n🔍 Verifying Project Setup...\n')

// Check required files
checkFile('.env', 'Environment variables file')
checkFile('package.json', 'Package configuration')
checkFile('tsconfig.json', 'TypeScript configuration')
checkFile('next.config.js', 'Next.js configuration')
checkFile('prisma/schema.prisma', 'Prisma schema')

// Check required directories
checkDir('src', 'Source directory')
checkDir('src/app', 'App directory')
checkDir('src/lib', 'Library directory')
checkDir('prisma', 'Prisma directory')

// Check logs directory (create if missing)
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
  console.log('✅ Created logs directory')
}

// Display results
console.log('\n📋 Setup Verification Results:\n')
checks.forEach((check) => {
  const icon = check.exists ? '✅' : '❌'
  const type = check.isDir ? 'Directory' : 'File'
  console.log(`${icon} ${type}: ${check.path} - ${check.description}`)
})

if (hasErrors) {
  console.log('\n⚠️  Some required files/directories are missing!')
  console.log('Please ensure all files are in place before running the application.\n')
  process.exit(1)
} else {
  console.log('\n✅ All checks passed! Project setup looks good.\n')
  process.exit(0)
}
