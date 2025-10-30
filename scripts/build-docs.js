#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load environment configuration
const envConfigPath = path.join(__dirname, 'env-config.json');
const envConfig = JSON.parse(fs.readFileSync(envConfigPath, 'utf8'));

// Detect current git branch
function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch;
  } catch (error) {
    console.error('Error detecting git branch:', error.message);
    console.log('Defaulting to production environment');
    return 'main';
  }
}

// Determine environment based on branch
function getEnvironment(branch) {
  if (branch === 'dev' || branch === 'development') {
    return 'staging';
  }
  return 'production';
}

// Get configuration for current environment
const currentBranch = getCurrentBranch();
const environment = getEnvironment(currentBranch);
const config = envConfig[environment];

console.log(`Branch: ${currentBranch}`);
console.log(`Environment: ${environment}`);
console.log(`Base URL: ${config.baseUrl}`);
console.log(`API Key: ${config.apiKey}`);

// Production values to replace
const prodBaseUrl = envConfig.production.baseUrl;
const prodApiKey = envConfig.production.apiKey;

// Staging values to replace
const stagingBaseUrl = envConfig.staging.baseUrl;
const stagingApiKey = envConfig.staging.apiKey;

// Replace function for JSON files
function replaceInJsonFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  
  // Replace server URLs
  updated = updated.replace(new RegExp(prodBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), config.baseUrl);
  updated = updated.replace(new RegExp(stagingBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), config.baseUrl);
  
  // Replace API keys
  updated = updated.replace(new RegExp(prodApiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), config.apiKey);
  updated = updated.replace(new RegExp(stagingApiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), config.apiKey);
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Replace function for MDX/Markdown files
function replaceInMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  let changed = false;
  
  // Replace URLs in curl commands and examples
  const urlPatterns = [
    new RegExp(prodBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    new RegExp(stagingBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
  ];
  
  urlPatterns.forEach(pattern => {
    if (pattern.test(updated)) {
      updated = updated.replace(pattern, config.baseUrl);
      changed = true;
    }
  });
  
  // Replace API keys in examples
  const apiKeyPatterns = [
    new RegExp(prodApiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    new RegExp(stagingApiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    // Also replace generic placeholders
    /YOUR_API_KEY/g,
    /'YOUR_API_KEY'/g,
    /"YOUR_API_KEY"/g
  ];
  
  apiKeyPatterns.forEach(pattern => {
    if (pattern.test(updated)) {
      updated = updated.replace(pattern, (match) => {
        // Keep quotes if they exist
        if (match.includes("'")) return `'${config.apiKey}'`;
        if (match.includes('"')) return `"${config.apiKey}"`;
        return config.apiKey;
      });
      changed = true;
    }
  });
  
  // Add environment banner if on dev branch
  if (environment === 'staging' && filePath.includes('index.mdx')) {
    const bannerPattern = /<Warning>[\s\S]*?<\/Warning>/;
    const devBanner = `<Warning>
  **Development Environment:** This documentation is using staging credentials and pointing to the development API. 
  
  **Base URL:** \`${config.baseUrl}\`
  
  **Test API Key:** \`${config.apiKey}\`
</Warning>

`;
    
    // Check if banner already exists
    if (!updated.includes('Development Environment')) {
      // Insert after frontmatter
      const frontmatterEnd = updated.indexOf('---', 3);
      if (frontmatterEnd !== -1) {
        updated = updated.slice(0, frontmatterEnd + 3) + '\n\n' + devBanner + updated.slice(frontmatterEnd + 3);
        changed = true;
      }
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

// Process all files
const rootDir = path.join(__dirname, '..');
let filesUpdated = 0;

// Process openapi.json
const openapiJsonPath = path.join(rootDir, 'openapi.json');
if (fs.existsSync(openapiJsonPath)) {
  if (replaceInJsonFile(openapiJsonPath)) filesUpdated++;
}

// Process all openapi/*.json files
const openapiDir = path.join(rootDir, 'openapi');
if (fs.existsSync(openapiDir)) {
  const openapiFiles = fs.readdirSync(openapiDir).filter(f => f.endsWith('.json'));
  openapiFiles.forEach(file => {
    const filePath = path.join(openapiDir, file);
    if (replaceInJsonFile(filePath)) filesUpdated++;
  });
}

// Process all .mdx files
function processMdxFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processMdxFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      if (replaceInMarkdownFile(fullPath)) filesUpdated++;
    }
  });
}

// Process all .md files in docs directory
function processMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processMarkdownFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (replaceInMarkdownFile(fullPath)) filesUpdated++;
    }
  });
}

// Process root directory for .mdx files
processMdxFiles(rootDir);

// Process docs directory for .md files
const docsDir = path.join(rootDir, 'docs');
if (fs.existsSync(docsDir)) {
  processMarkdownFiles(docsDir);
}

console.log(`\n✅ Build complete! Updated ${filesUpdated} files for ${environment} environment.`);

