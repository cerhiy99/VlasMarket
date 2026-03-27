const fs = require('fs');
const path = require('path');
const { globSync } = require('glob'); // якщо немає, npm install glob

// Цільовий файл, який ми імпортуємо
const TARGET_FILE = 'app/[lang]/(basic-layout)/App.scss';

// Шукаємо всі scss файли в папці app
const files = globSync('app/**/*.scss');

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // Перевіряємо, чи перший рядок починається з @import
    if (lines[0] && lines[0].startsWith('@import')) {
        const fileDir = path.dirname(file);
        const targetAbsPath = path.resolve('app/[lang]/(basic-layout)/App.scss');
        
        // Вираховуємо відносний шлях від поточного файлу до цільового
        let relativePath = path.relative(fileDir, targetAbsPath);

        // Якщо шлях не починається з '.', додаємо './'
        if (!relativePath.startsWith('.')) {
            relativePath = './' + relativePath;
        }

        // Оновлюємо перший рядок
        lines[0] = `@import "${relativePath}";`;
        
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        console.log(`Updated: ${file} -> ${relativePath}`);
    }
});
