const fs = require('fs');
const path = require('path');

// 定义需要搜索的目录
const searchDir = './pages';

// 定义目标文件扩展名
const targetExtensions = ['.wxml', '.js', '.wxss'];

// 定义替换规则
const replaceRules = [
  { from: /\/static\/images\/icons\//g, to: '/images/icons/' },
  { from: /\/static\/images\/incons\//g, to: '/images/incons/' },
  { from: /\/static\/images\//g, to: '/images/' },
  { from: /static\/images\//g, to: 'images/' } // 相对路径的情况
];

// 处理所有文件
function processFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 如果是目录，递归处理
      processFiles(filePath);
    } else if (stats.isFile() && targetExtensions.includes(path.extname(file))) {
      // 如果是目标文件类型
      replaceInFile(filePath);
    }
  });
}

// 替换文件内容
function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // 应用所有替换规则
    replaceRules.forEach(rule => {
      const newContent = content.replace(rule.from, rule.to);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    });
    
    // 如果有变化，保存文件
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`已更新: ${filePath}`);
    }
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 开始处理
console.log('开始批量替换图片路径...');
processFiles(searchDir);
console.log('批量替换完成!'); 