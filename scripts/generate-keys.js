#!/usr/bin/env node

/**
 * Script to generate secure random keys for environment variables
 * Usage: node scripts/generate-keys.js
 */

const crypto = require('crypto')

function generateKey(length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

console.log('\n🔐 Generate Secure Keys for Environment Variables\n')
console.log('Copy these values to your .env file:\n')
console.log(`APP_KEY=${generateKey(32)}`)
console.log(`JWT_SECRET=${generateKey(32)}`)
console.log(`SESSION_SECRET=${generateKey(32)}`)
console.log('\n⚠️  Keep these keys secure and never commit them to version control!\n')
