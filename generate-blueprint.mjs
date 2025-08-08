import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// CONFIGURATION
const CONFIG = {
    outputFile: 'BLUEPRINT.md',
    contentDirectory: 'src/content',
    maxDirectoryDepth: 5,
    maxContentPreviews: 3,
    maxContentLines: 10,
    maxCodeLines: 50,
    ignoreDirectories: ['node_modules', '.git', '.astro', '.vscode', 'dist'],
    ignoreFiles: ['.DS_Store', '.env', '*.log', '.gitignore', 'package-lock.json'],
    showcaseFiles: [
        'package.json',
        'astro.config.mjs',
        './src/pages/index.astro',
        './src/pages/[...page].astro',
    ]
};

// PATH UTILITIES
const getCurrentDirectory = () => path.dirname(fileURLToPath(import.meta.url));
const resolveRelativePath = relativePath =>
    path.resolve(getCurrentDirectory(), relativePath);

// FILE SYSTEM HELPERS
const isDirectory = path => fs.statSync(path).isDirectory();
const isMarkdownFile = name => name.endsWith('.md');
const shouldBeIgnored = name =>
    CONFIG.ignoreDirectories.includes(name) ||
    CONFIG.ignoreFiles.some(pattern => name.includes(pattern));

const safelyReadFile = filePath => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch {
        return '';
    }
};

// TREE GENERATION
const createTreeEntry = (name, depth, isDirectory) => {
    const indent = '  '.repeat(depth);
    const icon = isDirectory ? '📁' : '📄';
    return `${indent}${icon} ${name}`;
};

const generateDirectoryTree = (currentPath, depth = 0) => {
    if (depth > CONFIG.maxDirectoryDepth) return [];

    return fs
        .readdirSync(currentPath)
        .filter(entry => !shouldBeIgnored(entry))
        .flatMap(entry => {
            const entryPath = path.join(currentPath, entry);
            const isDir = isDirectory(entryPath);

            const currentEntry = createTreeEntry(entry, depth, isDir);
            const childEntries = isDir
                ? generateDirectoryTree(entryPath, depth + 1)
                : [];

            return [currentEntry, ...childEntries];
        });
};

// CONTENT HANDLERS
const getMarkdownContent = () => {
    const contentPath = resolveRelativePath(CONFIG.contentDirectory);
    return fs
        .readdirSync(contentPath)
        .filter(isMarkdownFile)
        .slice(0, CONFIG.maxContentPreviews)
        .map(file => ({
            name: file,
            content: safelyReadFile(path.join(contentPath, file)),
        }));
};

const getCodeContent = () => {
    return CONFIG.showcaseFiles
        .map(file => ({
            name: file,
            content: safelyReadFile(resolveRelativePath(file)),
            path: resolveRelativePath(file),
        }))
        .filter(file => file.content && fs.existsSync(file.path));
};

// FORMATTING UTILITIES
const formatMarkdownPreview = file => {
    const previewLines = file.content.split('\n').slice(0, 5).join('\n');
    return `### ${file.name}\n\`\`\`markdown\n${previewLines}\n...\n\`\`\``;
};

const detectCodeLanguage = fileName => {
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.toml')) return 'toml';
    if (fileName.endsWith('.astro')) return 'javascript';
    return 'javascript';
};

const formatCodeContent = file => {
    const codeContent = file.content
        .split('\n')
        .slice(0, CONFIG.maxCodeLines)
        .join('\n');
    return `### ${file.name}\n\`\`\`${detectCodeLanguage(
        file.name
    )}\n${codeContent}\n\`\`\``;
};

// DOCUMENT GENERATION
const getTimestamp = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
  }).format(now);
};

const generateTemplate = (fileTree, markdownPreviews, codeExamples) => {
  return `# 🗺️ PROJECT BLUEPRINT
*Generated ${getTimestamp()}*

## CORE WORKFLOW
1. **Content**: Add/edit markdown files in \`${CONFIG.contentDirectory}/\` 
2. **Build**: \`npm run build\` (Astro generates static site)
3. **Deploy**: Commit changes, submit a pull request for review

## PROJECT STRUCTURE
\`\`\`
${fileTree.join('\n')}
\`\`\`

## KEY FILE CODE EXAMPLES
${codeExamples.join('\n\n')}

## CONTENT EXAMPLES
${markdownPreviews.join('\n\n')}
`;

};

const generateBlueprintDocument = () => {
    const fileTree = generateDirectoryTree(getCurrentDirectory());
    const markdownPreviews = getMarkdownContent().map(formatMarkdownPreview);
    const codeExamples = getCodeContent().map(formatCodeContent);
    return generateTemplate(fileTree, markdownPreviews, codeExamples);
};

// MAIN EXECUTION
const writeBlueprintFile = () => {
    const blueprintContent = generateBlueprintDocument();
    fs.writeFileSync(CONFIG.outputFile, blueprintContent);
    console.log(`BLUEPRINT generated: ${CONFIG.outputFile}`);
};

writeBlueprintFile();
