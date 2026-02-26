import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STACKS_DIR = path.resolve(__dirname, '../stacks');
const OUTPUT_DIR = path.resolve(STACKS_DIR, '__generated__');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'graphql_mocks.json');

async function getFilesRecursively(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFilesRecursively(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function convertStacks() {
  console.log(`Scanning directory: ${STACKS_DIR}`);
  const allFiles = await getFilesRecursively(STACKS_DIR);
  const tiFiles = allFiles.filter(file => file.endsWith('.ti'));

  const entities = [];

  for (const file of tiFiles) {
    try {
      let content = await fs.readFile(file, 'utf8');
      
      // Pre-process YAML to handle unescaped characters in values
      const lines = content.split('\n');
      const processedLines = lines.map(line => {
        // Match list items: "  - Some value..."
        const listMatch = line.match(/^(\s+- )(.*)$/);
        if (listMatch) {
          const prefix = listMatch[1];
          let value = listMatch[2];
          // If value is not already quoted and contains problematic chars
          if (!value.startsWith('"') && !value.startsWith("'") && 
              (value.startsWith('`') || value.includes(': ') || value.includes('**') || value.startsWith('*'))) {
            value = `"${value.replace(/"/g, '\\"')}"`;
            return `${prefix}${value}`;
          }
        }

        // Match dictionary keys with values: "  key: Some value..."
        const dictMatch = line.match(/^(\s+[a-zA-Z0-9_-]+:\s+)(.*)$/);
        if (dictMatch) {
          const prefix = dictMatch[1];
          let value = dictMatch[2];
          // Ignore empty values or already quoted values
          if (value && !value.startsWith('"') && !value.startsWith("'") && value.includes(': ')) {
            value = `"${value.replace(/"/g, '\\"')}"`;
            return `${prefix}${value}`;
          }
        }

        return line;
      });

      content = processedLines.join('\n');
      const parsed = yaml.parse(content);
      
      if (!parsed) continue;

      const filename = path.basename(file, '.ti');
      const relativePath = path.relative(STACKS_DIR, file);
      const category = path.dirname(relativePath).split(path.sep)[0] || 'general';
      
      const id = filename.toLowerCase() === category.toLowerCase() 
                 ? category.toLowerCase() 
                 : `${category.toLowerCase()}-${filename.toLowerCase()}`;

      // Extract raw properties
      const { role, focus, security, anti_patterns, ...rest } = parsed;

      // Map to standard entity shape
      const entity = {
        id,
        category,
        name: filename,
        role: role || '',
        focus: focus ? focus.split(',').map(s => s.trim()) : [],
        security: security || [],
        anti_patterns: anti_patterns || [],
        features: rest // Dump the rest dynamically here
      };

      entities.push(entity);
    } catch (e) {
      console.error(`Error parsing file: ${file}`, e.message);
    }
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  const mockData = {
    stacks: entities
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(mockData, null, 2));
  console.log(`✅ Converted ${entities.length} stacks and saved to ${OUTPUT_FILE}`);
}

convertStacks().catch(console.error);
