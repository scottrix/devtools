document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initHTTPStatusCodes();
    initAsciiTable();
    updateCurrentTimestamp();
    setInterval(updateCurrentTimestamp, 1000);
    loadTheme();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-items a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const toolId = this.getAttribute('data-tool');
            showTool(toolId);
        });
    });

    const firstCategory = document.querySelector('.category-header');
    if (firstCategory) {
        firstCategory.classList.add('active');
        firstCategory.nextElementSibling.classList.add('show');
    }
}

function toggleCategory(header) {
    const navItems = header.nextElementSibling;
    const isOpen = navItems.classList.contains('show');
    
    document.querySelectorAll('.nav-items').forEach(items => items.classList.remove('show'));
    document.querySelectorAll('.category-header').forEach(h => h.classList.remove('active'));
    
    if (!isOpen) {
        navItems.classList.add('show');
        header.classList.add('active');
    }
}

function showTool(toolId) {
    document.querySelectorAll('.tool-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const toolPanel = document.getElementById(toolId);
    if (toolPanel) {
        toolPanel.classList.add('active');
    }
    
    document.querySelectorAll('.nav-items a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tool') === toolId) {
            link.classList.add('active');
        }
    });
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    navigator.clipboard.writeText(element.value || element.textContent).then(() => {
        const btn = element.parentElement.querySelector('.copy-btn, .copy-btn-sm');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = originalText, 1500);
        }
    });
}

function toggleTheme() {
    const root = document.documentElement;
    const icon = document.getElementById('theme-icon');
    
    if (root.classList.contains('light-mode')) {
        root.classList.remove('light-mode');
        icon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        root.classList.add('light-mode');
        icon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('theme-icon');
    
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        if (icon) icon.textContent = '☀️';
    }
}

// ==================== TEXT & STRING TOOLS ====================

function convertCase(type) {
    const input = document.getElementById('case-input').value;
    const output = document.getElementById('case-output');
    
    switch(type) {
        case 'camel':
            output.value = toCamelCase(input);
            break;
        case 'snake':
            output.value = toSnakeCase(input);
            break;
        case 'pascal':
            output.value = toPascalCase(input);
            break;
        case 'kebab':
            output.value = toKebabCase(input);
            break;
        case 'upper':
            output.value = input.toUpperCase();
            break;
        case 'lower':
            output.value = input.toLowerCase();
            break;
    }
}

function toCamelCase(str) {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
              .replace(/^[A-Z]/, (m) => m.toLowerCase())
              .replace(/[^a-zA-Z0-9]/g, '');
}

function toSnakeCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2')
              .replace(/[^a-zA-Z0-9]+/g, '_')
              .toLowerCase()
              .replace(/^_|_$/g, '');
}

function toPascalCase(str) {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/[^a-zA-Z0-9]+/g, '-')
              .toLowerCase()
              .replace(/^-|-$/g, '');
}

function formatJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    const status = document.getElementById('json-status');
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, 2);
        status.className = 'status-message success';
        status.textContent = '✓ Valid JSON - Formatted successfully';
    } catch (e) {
        status.className = 'status-message error';
        status.textContent = '✗ Invalid JSON: ' + e.message;
    }
}

function minifyJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    const status = document.getElementById('json-status');
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed);
        status.className = 'status-message success';
        status.textContent = '✓ Valid JSON - Minified successfully';
    } catch (e) {
        status.className = 'status-message error';
        status.textContent = '✗ Invalid JSON: ' + e.message;
    }
}

function validateJSON() {
    const input = document.getElementById('json-input').value;
    const status = document.getElementById('json-status');
    
    try {
        JSON.parse(input);
        status.className = 'status-message success';
        status.textContent = '✓ Valid JSON';
    } catch (e) {
        status.className = 'status-message error';
        status.textContent = '✗ Invalid JSON: ' + e.message;
    }
}

function computeDiff() {
    const text1 = document.getElementById('diff-input1').value.split('\n');
    const text2 = document.getElementById('diff-input2').value.split('\n');
    const output = document.getElementById('diff-output');
    
    const diff = [];
    const maxLen = Math.max(text1.length, text2.length);
    
    for (let i = 0; i < maxLen; i++) {
        const line1 = text1[i] || '';
        const line2 = text2[i] || '';
        
        if (line1 === line2) {
            diff.push(`  ${line1}`);
        } else {
            if (line1) diff.push(`<span class="removed">- ${line1}</span>`);
            if (line2) diff.push(`<span class="added">+ ${line2}</span>`);
        }
    }
    
    output.innerHTML = diff.join('\n');
}

const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

function generateLorem() {
    const count = parseInt(document.getElementById('lorem-paragraphs').value) || 3;
    const type = document.getElementById('lorem-type').value;
    const startClassic = document.getElementById('lorem-start').checked;
    const output = document.getElementById('lorem-output');
    
    let result = '';
    
    if (type === 'words') {
        result = generateLoremWords(count, startClassic);
    } else if (type === 'sentences') {
        result = generateLoremSentences(count, startClassic);
    } else {
        result = generateLoremParagraphs(count, startClassic);
    }
    
    output.value = result;
}

function generateLoremWords(count, startClassic) {
    const words = [];
    if (startClassic) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    }
    while (words.length < count) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.slice(0, count).join(' ');
}

function generateLoremSentences(count, startClassic) {
    const sentences = [];
    for (let i = 0; i < count; i++) {
        const wordCount = Math.floor(Math.random() * 10) + 8;
        if (i === 0 && startClassic) {
            sentences.push('Lorem ipsum dolor sit amet, ' + generateLoremWords(wordCount - 5, false) + '.');
        } else {
            sentences.push(capitalizeFirst(generateLoremWords(wordCount, false)) + '.');
        }
    }
    return sentences.join(' ');
}

function generateLoremParagraphs(count, startClassic) {
    const paragraphs = [];
    for (let i = 0; i < count; i++) {
        const sentenceCount = Math.floor(Math.random() * 4) + 4;
        paragraphs.push(generateLoremSentences(sentenceCount, i === 0 && startClassic));
    }
    return paragraphs.join('\n\n');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function removeWhitespace() {
    let text = document.getElementById('ws-input').value;
    const trailing = document.getElementById('ws-trailing').checked;
    const double = document.getElementById('ws-double').checked;
    const empty = document.getElementById('ws-empty').checked;
    const leading = document.getElementById('ws-leading').checked;
    const output = document.getElementById('ws-output');
    
    if (trailing) {
        text = text.split('\n').map(line => line.trimEnd()).join('\n');
    }
    
    if (leading) {
        text = text.split('\n').map(line => line.trimStart()).join('\n');
    }
    
    if (double) {
        text = text.replace(/[^\S\n]+/g, ' ');
    }
    
    if (empty) {
        text = text.split('\n').filter(line => line.trim() !== '').join('\n');
    }
    
    output.value = text;
}

function testRegex() {
    const pattern = document.getElementById('regex-pattern').value;
    const text = document.getElementById('regex-input').value;
    const matchesDiv = document.getElementById('regex-matches');
    
    if (!pattern) {
        matchesDiv.innerHTML = '<span style="color: var(--error)">Please enter a pattern</span>';
        return;
    }
    
    try {
        let flags = '';
        if (document.getElementById('flag-g').checked) flags += 'g';
        if (document.getElementById('flag-i').checked) flags += 'i';
        if (document.getElementById('flag-m').checked) flags += 'm';
        
        const regex = new RegExp(pattern, flags);
        const matches = text.match(regex);
        
        if (matches && matches.length > 0) {
            matchesDiv.innerHTML = matches.map(m => `<span class="match">${escapeHtml(m)}</span>`).join('');
        } else {
            matchesDiv.innerHTML = '<span style="color: var(--text-secondary)">No matches found</span>';
        }
    } catch (e) {
        matchesDiv.innerHTML = `<span style="color: var(--error)">Invalid regex: ${escapeHtml(e.message)}</span>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    const output = document.getElementById('base64-output');
    try {
        output.value = btoa(unescape(encodeURIComponent(input)));
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value;
    const output = document.getElementById('base64-output');
    try {
        output.value = decodeURIComponent(escape(atob(input)));
    } catch (e) {
        output.value = 'Error: Invalid Base64 string';
    }
}

function stringToHex() {
    const input = document.getElementById('hex-input').value;
    const addSpaces = document.getElementById('hex-spaces').checked;
    const uppercase = document.getElementById('hex-uppercase').checked;
    const output = document.getElementById('hex-output');
    
    let hex = '';
    for (let i = 0; i < input.length; i++) {
        const code = input.charCodeAt(i);
        let hexChar = code.toString(16).padStart(2, '0');
        if (uppercase) hexChar = hexChar.toUpperCase();
        hex += hexChar;
        if (addSpaces && i < input.length - 1) hex += ' ';
    }
    
    output.value = hex;
}

function hexToString() {
    let input = document.getElementById('hex-input').value;
    const output = document.getElementById('hex-output');
    
    input = input.replace(/\s+/g, '').replace(/0x/gi, '');
    
    if (!/^[0-9a-fA-F]*$/.test(input) || input.length % 2 !== 0) {
        output.value = 'Error: Invalid hex string';
        return;
    }
    
    let str = '';
    for (let i = 0; i < input.length; i += 2) {
        str += String.fromCharCode(parseInt(input.substr(i, 2), 16));
    }
    
    output.value = str;
}

// ==================== WEB & FRONTEND TOOLS ====================

function convertColor(fromType) {
    let hex, rgb, hsl;
    
    if (fromType === 'hex') {
        hex = document.getElementById('color-hex').value;
        rgb = hexToRgb(hex);
        hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    } else if (fromType === 'rgb') {
        const rgbText = document.getElementById('color-rgb').value;
        const match = rgbText.match(/(\d+)/g);
        if (match && match.length >= 3) {
            rgb = { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        }
    } else if (fromType === 'hsl') {
        const hslText = document.getElementById('color-hsl').value;
        const match = hslText.match(/(\d+)/g);
        if (match && match.length >= 3) {
            rgb = hslToRgb(parseInt(match[0]), parseInt(match[1]), parseInt(match[2]));
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            hsl = { h: parseInt(match[0]), s: parseInt(match[1]), l: parseInt(match[2]) };
        }
    }
    
    if (hex) {
        document.getElementById('color-hex').value = hex;
        document.getElementById('color-rgb').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('color-hsl').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        document.getElementById('color-preview').style.background = hex;
        document.getElementById('color-picker').value = hex;
    }
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
    };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

document.getElementById('color-picker')?.addEventListener('input', function(e) {
    document.getElementById('color-hex').value = e.target.value;
    convertColor('hex');
});

function pxToRem() {
    const px = parseFloat(document.getElementById('px-value').value);
    const base = parseFloat(document.getElementById('base-font-size').value) || 16;
    const result = document.getElementById('px-result');
    
    if (!isNaN(px)) {
        const rem = (px / base).toFixed(4);
        result.textContent = `${px}px = ${rem}rem`;
    }
}

function pxToEm() {
    const px = parseFloat(document.getElementById('px-value').value);
    const base = parseFloat(document.getElementById('base-font-size').value) || 16;
    const result = document.getElementById('px-result');
    
    if (!isNaN(px)) {
        const em = (px / base).toFixed(4);
        result.textContent = `${px}px = ${em}em`;
    }
}

function remToPx() {
    const rem = parseFloat(document.getElementById('rem-value').value);
    const base = parseFloat(document.getElementById('base-font-size').value) || 16;
    const result = document.getElementById('px-result');
    
    if (!isNaN(rem)) {
        const px = (rem * base).toFixed(2);
        result.textContent = `${rem}rem = ${px}px`;
    }
}

function generateGrid() {
    const cols = parseInt(document.getElementById('grid-cols').value) || 3;
    const rows = parseInt(document.getElementById('grid-rows').value) || 2;
    const gap = parseInt(document.getElementById('grid-gap').value) || 20;
    const colType = document.getElementById('grid-col-type').value;
    
    const preview = document.getElementById('grid-preview');
    const output = document.getElementById('grid-output');
    
    const colValue = colType === 'fr' ? `repeat(${cols}, 1fr)` : 
                     colType === 'px' ? `repeat(${cols}, 100px)` :
                     `repeat(${cols}, ${Math.floor(100/cols)}%)`;
    
    preview.style.gridTemplateColumns = colValue.includes('repeat') ? 
        `repeat(${cols}, 1fr)` : colValue;
    preview.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    preview.style.gap = `${gap}px`;
    
    preview.innerHTML = '';
    for (let i = 0; i < cols * rows; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.textContent = i + 1;
        preview.appendChild(item);
    }
    
    output.value = `.container {\n  display: grid;\n  grid-template-columns: ${colValue};\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n}`;
}

function optimizeSvg() {
    let svg = document.getElementById('svg-input').value;
    const removeComments = document.getElementById('svg-remove-comments').checked;
    const removeMetadata = document.getElementById('svg-remove-metadata').checked;
    const collapseWhitespace = document.getElementById('svg-collapse-whitespace').checked;
    
    const originalSize = new Blob([svg]).size;
    
    if (removeComments) {
        svg = svg.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    if (removeMetadata) {
        svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
    }
    
    if (collapseWhitespace) {
        svg = svg.replace(/\s+/g, ' ');
        svg = svg.replace(/>\s+</g, '><');
        svg = svg.replace(/\s*=\s*/g, '=');
    }
    
    const optimizedSize = new Blob([svg]).size;
    const saved = Math.round((1 - optimizedSize / originalSize) * 100);
    
    document.getElementById('svg-output').value = svg.trim();
    document.getElementById('svg-original-size').textContent = originalSize;
    document.getElementById('svg-optimized-size').textContent = optimizedSize;
    document.getElementById('svg-saved').textContent = saved;
}

function encodeURL() {
    const input = document.getElementById('url-input').value;
    document.getElementById('url-output').value = encodeURI(input);
}

function decodeURL() {
    const input = document.getElementById('url-input').value;
    document.getElementById('url-output').value = decodeURI(input);
}

function encodeURLComponent() {
    const input = document.getElementById('url-input').value;
    document.getElementById('url-output').value = encodeURIComponent(input);
}

function decodeURLComponent() {
    const input = document.getElementById('url-input').value;
    document.getElementById('url-output').value = decodeURIComponent(input);
}

function encodeHTMLEntities() {
    const input = document.getElementById('entity-input').value;
    const output = document.getElementById('entity-output');
    output.value = input.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[match]));
}

function decodeHTMLEntities() {
    const input = document.getElementById('entity-input').value;
    const output = document.getElementById('entity-output');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    output.value = textarea.value;
}

// ==================== DATA FORMAT CONVERTERS ====================

function jsonToCSV() {
    const input = document.getElementById('json-csv-input').value;
    const output = document.getElementById('json-csv-output');
    
    try {
        const json = JSON.parse(input);
        const arr = Array.isArray(json) ? json : [json];
        
        if (arr.length === 0) {
            output.value = '';
            return;
        }
        
        const headers = Object.keys(arr[0]);
        const csv = [headers.join(',')];
        
        arr.forEach(obj => {
            const row = headers.map(h => {
                const val = obj[h];
                if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                    return '"' + val.replace(/"/g, '""') + '"';
                }
                return val;
            });
            csv.push(row.join(','));
        });
        
        output.value = csv.join('\n');
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
}

function csvToJSON() {
    const input = document.getElementById('json-csv-input').value;
    const output = document.getElementById('json-csv-output');
    
    try {
        const lines = input.split('\n').filter(l => l.trim());
        if (lines.length < 2) {
            output.value = '[]';
            return;
        }
        
        const headers = parseCSVLine(lines[0]);
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h] = values[idx] || '';
            });
            result.push(obj);
        }
        
        output.value = JSON.stringify(result, null, 2);
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

function jsonToYAML() {
    const input = document.getElementById('json-yaml-input').value;
    const output = document.getElementById('json-yaml-output');
    
    try {
        const json = JSON.parse(input);
        output.value = objectToYaml(json, 0);
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
}

function objectToYaml(obj, indent) {
    const spaces = '  '.repeat(indent);
    let yaml = '';
    
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                yaml += spaces + '-\n';
                for (const [key, val] of Object.entries(item)) {
                    yaml += spaces + '  ' + key + ': ' + formatYamlValue(val, indent + 2) + '\n';
                }
            } else {
                yaml += spaces + '- ' + formatYamlValue(item, indent) + '\n';
            }
        });
    } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === 'object' && val !== null) {
                yaml += spaces + key + ':\n' + objectToYaml(val, indent + 1);
            } else {
                yaml += spaces + key + ': ' + formatYamlValue(val, indent) + '\n';
            }
        }
    } else {
        yaml += formatYamlValue(obj, indent);
    }
    
    return yaml;
}

function formatYamlValue(val, indent) {
    if (val === null) return 'null';
    if (typeof val === 'string') {
        if (val.includes('\n') || val.includes(':')) {
            return '|\n' + val.split('\n').map(l => '  '.repeat(indent + 1) + l).join('\n');
        }
        return val.includes(' ') ? `"${val}"` : val;
    }
    return String(val);
}

function yamlToJSON() {
    const input = document.getElementById('json-yaml-input').value;
    const output = document.getElementById('json-yaml-output');
    
    try {
        const result = parseYaml(input);
        output.value = JSON.stringify(result, null, 2);
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
}

function parseYaml(yaml) {
    const lines = yaml.split('\n');
    const result = {};
    let currentKey = null;
    let currentArray = null;
    
    lines.forEach(line => {
        if (!line.trim() || line.trim().startsWith('#')) return;
        
        const indent = line.search(/\S/);
        const trimmed = line.trim();
        
        if (trimmed.startsWith('- ')) {
            if (!currentArray) {
                currentArray = result[currentKey] = [];
            }
            const value = trimmed.slice(2).trim();
            currentArray.push(parseYamlValue(value));
        } else {
            const colonIdx = trimmed.indexOf(':');
            if (colonIdx > 0) {
                currentKey = trimmed.slice(0, colonIdx).trim();
                const value = trimmed.slice(colonIdx + 1).trim();
                if (value) {
                    result[currentKey] = parseYamlValue(value);
                    currentArray = null;
                } else {
                    result[currentKey] = {};
                }
            }
        }
    });
    
    return result;
}

function parseYamlValue(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!isNaN(value) && value !== '') return Number(value);
    if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
    return value;
}

function xmlToJSON() {
    const input = document.getElementById('xml-json-input').value;
    const output = document.getElementById('xml-json-output');
    
    try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(input, 'text/xml');
        const result = xmlNodeToJson(xml.documentElement);
        output.value = JSON.stringify(result, null, 2);
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
}

function xmlNodeToJson(node) {
    const obj = {};
    
    if (node.attributes && node.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let i = 0; i < node.attributes.length; i++) {
            obj['@attributes'][node.attributes[i].name] = node.attributes[i].value;
        }
    }
    
    if (node.childNodes && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child.nodeType === 1) {
                const childJson = xmlNodeToJson(child);
                if (obj[child.nodeName]) {
                    if (!Array.isArray(obj[child.nodeName])) {
                        obj[child.nodeName] = [obj[child.nodeName]];
                    }
                    obj[child.nodeName].push(childJson);
                } else {
                    obj[child.nodeName] = childJson;
                }
            } else if (child.nodeType === 3 && child.textContent.trim()) {
                obj['#text'] = child.textContent.trim();
            }
        }
    }
    
    return obj;
}

function jsonToXML() {
    const input = document.getElementById('xml-json-input').value;
    const output = document.getElementById('xml-json-output');
    
    try {
        const json = JSON.parse(input);
        output.value = '<?xml version="1.0" encoding="UTF-8"?>\n' + objectToXml(json, 'root');
    } catch (e) {
        output.value = 'Error: ' + e.message;
    }
}

function objectToXml(obj, nodeName, indent = 0) {
    const spaces = '  '.repeat(indent);
    let xml = '';
    
    if (typeof obj !== 'object' || obj === null) {
        return `${spaces}<${nodeName}>${obj}</${nodeName}>\n`;
    }
    
    xml += `${spaces}<${nodeName}>\n`;
    
    for (const [key, val] of Object.entries(obj)) {
        if (key === '@attributes' || key === '#text') continue;
        
        if (Array.isArray(val)) {
            val.forEach(item => {
                xml += objectToXml(item, key, indent + 1);
            });
        } else if (typeof val === 'object' && val !== null) {
            xml += objectToXml(val, key, indent + 1);
        } else {
            xml += `${spaces}  <${key}>${val}</${key}>\n`;
        }
    }
    
    if (obj['#text']) {
        xml = `${spaces}<${nodeName}>${obj['#text']}</${nodeName}>\n`;
    } else {
        xml += `${spaces}</${nodeName}>\n`;
    }
    
    return xml;
}

function formatSQL() {
    let sql = document.getElementById('sql-input').value;
    const output = document.getElementById('sql-output');
    
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION', 'UNION ALL', 'DISTINCT'];
    
    sql = sql.replace(/\s+/g, ' ').trim();
    
    keywords.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
        sql = sql.replace(regex, '\n' + keyword);
    });
    
    sql = sql.replace(/\n\s*\n/g, '\n').trim();
    
    let formatted = '';
    let indent = 0;
    sql.split('\n').forEach(line => {
        line = line.trim();
        if (line.match(/^(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|UNION|UNION ALL)/i)) {
            formatted += line + '\n';
        } else if (line.match(/^(AND|OR)/i)) {
            formatted += '  ' + line + '\n';
        } else {
            formatted += line + '\n';
        }
    });
    
    output.value = formatted.trim();
}

const mdInput = document.getElementById('md-input');
if (mdInput) {
    mdInput.addEventListener('input', function() {
        const input = this.value;
        const output = document.getElementById('md-output');
        output.innerHTML = parseMarkdown(input);
    });
}

function parseMarkdown(md) {
    let html = md;
    
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, function(match) {
        return '<ol>' + match + '</ol>';
    });
    
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    html = html.replace(/---/g, '<hr>');
    
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<[hulob])/g, '$1');
    html = html.replace(/(<\/[hulob][^>]*>)<\/p>/g, '$1');
    
    return html;
}

// ==================== SECURITY TOOLS ====================

function updateLengthDisplay() {
    const length = document.getElementById('pwd-length').value;
    document.getElementById('pwd-length-display').textContent = length;
}

function generatePassword() {
    const length = parseInt(document.getElementById('pwd-length').value);
    const useUpper = document.getElementById('pwd-upper').checked;
    const useLower = document.getElementById('pwd-lower').checked;
    const useNumbers = document.getElementById('pwd-numbers').checked;
    const useSymbols = document.getElementById('pwd-symbols').checked;
    
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;
    
    if (!chars) {
        document.getElementById('pwd-output').value = 'Please select at least one character type';
        return;
    }
    
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }
    
    document.getElementById('pwd-output').value = password;
    updatePasswordStrength(password);
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('pwd-strength');
    const strengthText = document.getElementById('pwd-strength-text');
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    strengthBar.className = 'strength-bar';
    
    if (score <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Strength: Weak';
    } else if (score <= 4) {
        strengthBar.classList.add('fair');
        strengthText.textContent = 'Strength: Fair';
    } else if (score <= 6) {
        strengthBar.classList.add('good');
        strengthText.textContent = 'Strength: Good';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strength: Strong';
    }
}

async function generateHash(algorithm) {
    const input = document.getElementById('hash-input').value;
    
    if (!input) {
        alert('Please enter text to hash');
        return;
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    try {
        const hashBuffer = await crypto.subtle.digest(algorithm.replace('-', '').replace('MD5', 'MD5'), data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (algorithm === 'MD5') document.getElementById('hash-md5').value = hashHex;
        else if (algorithm === 'SHA-1') document.getElementById('hash-sha1').value = hashHex;
        else if (algorithm === 'SHA-256') document.getElementById('hash-sha256').value = hashHex;
        else if (algorithm === 'SHA-512') document.getElementById('hash-sha512').value = hashHex;
    } catch (e) {
        alert('MD5 is not supported in browser crypto API. Using SHA-256 instead.');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        document.getElementById('hash-md5').value = 'Not available';
        document.getElementById('hash-sha256').value = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    if (algorithm === 'SHA-256' || algorithm === 'MD5') {
        const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
        document.getElementById('hash-sha256').value = Array.from(new Uint8Array(sha256Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
        document.getElementById('hash-sha1').value = Array.from(new Uint8Array(sha1Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
        document.getElementById('hash-sha512').value = Array.from(new Uint8Array(sha512Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        document.getElementById('hash-md5').value = 'Not available (use SHA)';
    }
}

function decodeJWT() {
    const token = document.getElementById('jwt-input').value;
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        document.getElementById('jwt-header').value = JSON.stringify(header, null, 2);
        document.getElementById('jwt-payload').value = JSON.stringify(payload, null, 2);
    } catch (e) {
        document.getElementById('jwt-header').value = 'Error: ' + e.message;
        document.getElementById('jwt-payload').value = '';
    }
}

function generateUUID() {
    const version = document.getElementById('uuid-version').value;
    const count = parseInt(document.getElementById('uuid-count').value) || 1;
    const output = document.getElementById('uuid-output');
    
    const uuids = [];
    for (let i = 0; i < count; i++) {
        if (version === 'v4') {
            uuids.push(generateUUIDv4());
        } else {
            uuids.push(generateUUIDv1());
        }
    }
    
    output.value = uuids.join('\n');
}

function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateUUIDv1() {
    const now = Date.now();
    const node = Math.random().toString(16).slice(2, 14);
    const clockSeq = Math.random().toString(16).slice(2, 6);
    
    const timeLow = (now & 0xFFFFFFFF).toString(16).padStart(8, '0');
    const timeMid = ((now >> 32) & 0xFFFF).toString(16).padStart(4, '0');
    const timeHi = ((now >> 48) & 0x0FFF | 0x1000).toString(16).padStart(4, '0');
    
    return `${timeLow}-${timeMid}-${timeHi}-1${clockSeq.slice(1)}-${node}`;
}

// ==================== MATH & LOGIC TOOLS ====================

function convertFromBase(fromBase) {
    let decimal;
    const decInput = document.getElementById('base-decimal');
    const binInput = document.getElementById('base-binary');
    const hexInput = document.getElementById('base-hex');
    const octInput = document.getElementById('base-octal');
    
    switch(fromBase) {
        case 'decimal':
            decimal = parseInt(decInput.value, 10);
            break;
        case 'binary':
            decimal = parseInt(binInput.value, 2);
            break;
        case 'hex':
            decimal = parseInt(hexInput.value, 16);
            break;
        case 'octal':
            decimal = parseInt(octInput.value, 8);
            break;
    }
    
    if (isNaN(decimal)) return;
    
    decInput.value = decimal.toString(10);
    binInput.value = decimal.toString(2);
    hexInput.value = decimal.toString(16).toUpperCase();
    octInput.value = decimal.toString(8);
}

function updateCurrentTimestamp() {
    const ts = Math.floor(Date.now() / 1000);
    const el = document.getElementById('current-ts');
    if (el) el.textContent = ts;
}

function timestampToDate() {
    const ts = parseInt(document.getElementById('ts-unix').value);
    if (isNaN(ts)) return;
    
    const date = new Date(ts * 1000);
    document.getElementById('ts-date').value = date.toISOString().slice(0, 16);
    document.getElementById('ts-iso').value = date.toISOString();
    document.getElementById('ts-readable').value = date.toLocaleString();
}

function dateToTimestamp() {
    const dateStr = document.getElementById('ts-date').value;
    if (!dateStr) return;
    
    const date = new Date(dateStr);
    const ts = Math.floor(date.getTime() / 1000);
    document.getElementById('ts-unix').value = ts;
    document.getElementById('ts-iso').value = date.toISOString();
    document.getElementById('ts-readable').value = date.toLocaleString();
}

function bitwiseOp(operation) {
    const a = parseInt(document.getElementById('bit-a').value) || 0;
    const b = parseInt(document.getElementById('bit-b').value) || 0;
    
    document.getElementById('bit-a-bin').value = a.toString(2);
    document.getElementById('bit-b-bin').value = b.toString(2);
    
    let result;
    switch(operation) {
        case 'AND': result = a & b; break;
        case 'OR': result = a | b; break;
        case 'XOR': result = a ^ b; break;
        case 'NOT': result = ~a; break;
        case 'LEFT': result = a << b; break;
        case 'RIGHT': result = a >> b; break;
    }
    
    document.getElementById('bit-result-dec').value = result;
    document.getElementById('bit-result-bin').value = result.toString(2);
}

const primeModeSelect = document.getElementById('prime-mode');
if (primeModeSelect) {
    primeModeSelect.addEventListener('change', function() {
        document.getElementById('prime-check-section').style.display = 
            this.value === 'check' ? 'block' : 'none';
        document.getElementById('prime-gen-section').style.display = 
            this.value === 'generate' ? 'block' : 'none';
    });
}

function checkPrime() {
    const num = parseInt(document.getElementById('prime-check-input').value);
    const result = document.getElementById('prime-check-result');
    
    if (isNaN(num) || num < 2) {
        result.textContent = 'Please enter a number >= 2';
        return;
    }
    
    const isPrime = isPrimeNumber(num);
    result.textContent = `${num} is ${isPrime ? 'a prime' : 'not a prime'} number`;
    result.style.color = isPrime ? 'var(--success)' : 'var(--error)';
}

function isPrimeNumber(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function generatePrimes() {
    const from = parseInt(document.getElementById('prime-from').value) || 2;
    const to = parseInt(document.getElementById('prime-to').value) || 100;
    
    const primes = [];
    for (let i = Math.max(2, from); i <= to; i++) {
        if (isPrimeNumber(i)) primes.push(i);
    }
    
    document.getElementById('prime-output').value = primes.join(', ');
    document.getElementById('prime-count').textContent = primes.length;
}

// ==================== DEVOPS & NETWORKING TOOLS ====================

function generateCron() {
    const minute = document.getElementById('cron-minute').value;
    const hour = document.getElementById('cron-hour').value;
    const dom = document.getElementById('cron-dom').value;
    const month = document.getElementById('cron-month').value;
    const dow = document.getElementById('cron-dow').value;
    
    const expression = `${minute} ${hour} ${dom} ${month} ${dow}`;
    document.getElementById('cron-output').value = expression;
    
    const human = describeCron(minute, hour, dom, month, dow);
    document.getElementById('cron-human').value = human;
    
    showNextRuns(expression);
}

function describeCron(minute, hour, dom, month, dow) {
    let desc = '';
    
    if (minute === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') {
        return 'Every minute';
    }
    
    if (minute.startsWith('*/')) {
        desc = `Every ${minute.slice(2)} minutes`;
    } else if (minute !== '*') {
        desc = `At minute ${minute}`;
    } else {
        desc = 'Every minute';
    }
    
    if (hour.startsWith('*/')) {
        desc += `, every ${hour.slice(2)} hours`;
    } else if (hour !== '*') {
        desc += ` past hour ${hour}`;
    }
    
    if (dow !== '*') {
        if (dow === '1-5') desc += ', Monday to Friday';
        else if (dow === '0,6') desc += ', on weekends';
        else desc += `, on day ${dow} of the week`;
    }
    
    if (dom !== '*') {
        desc += `, on day ${dom} of the month`;
    }
    
    if (month !== '*') {
        desc += `, only in month ${month}`;
    }
    
    return desc;
}

function showNextRuns(expression) {
    const parts = expression.split(' ');
    const nextRuns = document.getElementById('cron-next');
    nextRuns.innerHTML = '';
    
    const now = new Date();
    for (let i = 0; i < 5; i++) {
        const next = getNextCronRun(parts, now);
        if (next) {
            const div = document.createElement('div');
            div.textContent = next.toLocaleString();
            nextRuns.appendChild(div);
        }
    }
}

function getNextCronRun(parts, startDate) {
    const next = new Date(startDate);
    next.setMinutes(next.getMinutes() + 1);
    next.setSeconds(0);
    next.setMilliseconds(0);
    
    for (let i = 0; i < 10000; i++) {
        if (matchesCron(parts, next)) {
            return next;
        }
        next.setMinutes(next.getMinutes() + 1);
    }
    return null;
}

function matchesCron(parts, date) {
    const minute = parts[0];
    const hour = parts[1];
    const dom = parts[2];
    const month = parts[3];
    const dow = parts[4];
    
    if (!cronMatch(minute, date.getMinutes())) return false;
    if (!cronMatch(hour, date.getHours())) return false;
    if (!cronMatch(dom, date.getDate())) return false;
    if (!cronMatch(month, date.getMonth() + 1)) return false;
    if (!cronMatch(dow, date.getDay())) return false;
    
    return true;
}

function cronMatch(pattern, value) {
    if (pattern === '*') return true;
    if (pattern.startsWith('*/')) {
        const step = parseInt(pattern.slice(2));
        return value % step === 0;
    }
    if (pattern.includes('-')) {
        const [start, end] = pattern.split('-').map(Number);
        return value >= start && value <= end;
    }
    if (pattern.includes(',')) {
        return pattern.split(',').map(Number).includes(value);
    }
    return parseInt(pattern) === value;
}

function calculateIP() {
    const ip = document.getElementById('ip-address').value;
    const cidr = parseInt(document.getElementById('ip-cidr').value) || 24;
    
    const octets = ip.split('.').map(Number);
    if (octets.length !== 4) {
        alert('Invalid IP address');
        return;
    }
    
    const mask = [];
    for (let i = 0; i < 4; i++) {
        const bits = Math.min(8, Math.max(0, cidr - i * 8));
        mask.push(256 - Math.pow(2, 8 - bits));
    }
    
    document.getElementById('ip-mask').value = mask.join('.');
    
    const network = octets.map((o, i) => o & mask[i]);
    document.getElementById('ip-network').value = network.join('.');
    
    const broadcast = octets.map((o, i) => o | (255 - mask[i]));
    document.getElementById('ip-broadcast').value = broadcast.join('.');
    
    const firstHost = [...network];
    firstHost[3] = Math.max(1, firstHost[3] + 1);
    document.getElementById('ip-first').value = firstHost.join('.');
    
    const lastHost = [...broadcast];
    lastHost[3] = Math.max(1, lastHost[3] - 1);
    document.getElementById('ip-last').value = lastHost.join('.');
    
    const totalHosts = Math.pow(2, 32 - cidr);
    document.getElementById('ip-total').value = totalHosts;
    
    document.getElementById('ip-usable').value = Math.max(0, totalHosts - 2);
}

const httpStatusCodes = [
    { code: 100, name: 'Continue', description: 'Server received request headers, client should proceed with request body', class: 'info' },
    { code: 101, name: 'Switching Protocols', description: 'Server agrees to switch protocols as requested', class: 'info' },
    { code: 200, name: 'OK', description: 'Request succeeded', class: 'success' },
    { code: 201, name: 'Created', description: 'Resource successfully created', class: 'success' },
    { code: 204, name: 'No Content', description: 'Request succeeded but no content returned', class: 'success' },
    { code: 301, name: 'Moved Permanently', description: 'Resource has been permanently moved', class: 'redirect' },
    { code: 302, name: 'Found', description: 'Resource temporarily moved', class: 'redirect' },
    { code: 304, name: 'Not Modified', description: 'Resource has not been modified since last request', class: 'redirect' },
    { code: 400, name: 'Bad Request', description: 'Server could not understand the request', class: 'client-error' },
    { code: 401, name: 'Unauthorized', description: 'Authentication required', class: 'client-error' },
    { code: 403, name: 'Forbidden', description: 'Access denied', class: 'client-error' },
    { code: 404, name: 'Not Found', description: 'Resource not found', class: 'client-error' },
    { code: 405, name: 'Method Not Allowed', description: 'HTTP method not allowed for this resource', class: 'client-error' },
    { code: 408, name: 'Request Timeout', description: 'Server timed out waiting for request', class: 'client-error' },
    { code: 409, name: 'Conflict', description: 'Request conflicts with current state of resource', class: 'client-error' },
    { code: 418, name: "I'm a teapot", description: 'Server refuses to brew coffee because it is a teapot', class: 'client-error' },
    { code: 429, name: 'Too Many Requests', description: 'Rate limit exceeded', class: 'client-error' },
    { code: 500, name: 'Internal Server Error', description: 'Server encountered an unexpected condition', class: 'server-error' },
    { code: 501, name: 'Not Implemented', description: 'Server does not support the functionality', class: 'server-error' },
    { code: 502, name: 'Bad Gateway', description: 'Invalid response from upstream server', class: 'server-error' },
    { code: 503, name: 'Service Unavailable', description: 'Server is temporarily unable to handle request', class: 'server-error' },
    { code: 504, name: 'Gateway Timeout', description: 'Upstream server failed to respond in time', class: 'server-error' },
];

function initHTTPStatusCodes() {
    const container = document.getElementById('http-status-list');
    if (!container) return;
    
    httpStatusCodes.forEach(status => {
        const div = document.createElement('div');
        div.className = `http-status-item ${status.class}`;
        div.innerHTML = `
            <span class="code">${status.code}</span>
            <span class="name">${status.name}</span>
            <div class="description">${status.description}</div>
        `;
        container.appendChild(div);
    });
}

function filterHTTPStatus() {
    const search = document.getElementById('http-search').value.toLowerCase();
    const items = document.querySelectorAll('.http-status-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(search) ? 'block' : 'none';
    });
}

function curlToFetch() {
    const curl = document.getElementById('curl-input').value;
    const output = document.getElementById('curl-output');
    
    try {
        const parsed = parseCurl(curl);
        let code = `fetch('${parsed.url}'`;
        
        if (parsed.method !== 'GET' || Object.keys(parsed.headers).length > 0 || parsed.body) {
            code += `, {\n`;
            if (parsed.method !== 'GET') {
                code += `  method: '${parsed.method}',\n`;
            }
            if (Object.keys(parsed.headers).length > 0) {
                code += `  headers: {\n`;
                for (const [key, value] of Object.entries(parsed.headers)) {
                    code += `    '${key}': '${value}',\n`;
                }
                code += `  },\n`;
            }
            if (parsed.body) {
                code += `  body: '${parsed.body.replace(/'/g, "\\'")}',\n`;
            }
            code += `}`;
        }
        
        code += `)\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));`;
        
        output.value = code;
    } catch (e) {
        output.value = 'Error parsing curl command: ' + e.message;
    }
}

function curlToAxios() {
    const curl = document.getElementById('curl-input').value;
    const output = document.getElementById('curl-output');
    
    try {
        const parsed = parseCurl(curl);
        
        let code = `axios.${parsed.method.toLowerCase()}('${parsed.url}'`;
        
        if (Object.keys(parsed.headers).length > 0 || parsed.body) {
            code += `, {\n`;
            if (Object.keys(parsed.headers).length > 0) {
                code += `  headers: {\n`;
                for (const [key, value] of Object.entries(parsed.headers)) {
                    code += `    '${key}': '${value}',\n`;
                }
                code += `  },\n`;
            }
            if (parsed.body) {
                code += `  data: ${parsed.body}\n`;
            }
            code += `}`;
        }
        
        code += `)\n  .then(response => console.log(response.data))\n  .catch(error => console.error('Error:', error));`;
        
        output.value = code;
    } catch (e) {
        output.value = 'Error parsing curl command: ' + e.message;
    }
}

function parseCurl(curl) {
    const result = {
        url: '',
        method: 'GET',
        headers: {},
        body: ''
    };
    
    const urlMatch = curl.match(/['"]?(https?:\/\/[^'"\s]+)['"]?/);
if (urlMatch) result.url = urlMatch[1];

    const methodMatch = curl.match(/-X\s+['"]?(\w+)['"]?/i);
    if (methodMatch) result.method = methodMatch[1].toUpperCase();

    const headerMatches = curl.matchAll(/-H\s+['"]([^'"]+)['"]/g);
    for (const match of headerMatches) {
        const [key, value] = match[1].split(': ');
        result.headers[key] = value;
    }

    const dataMatch = curl.match(/-d\s+['"](.+?)['"]/s);
    if (dataMatch) result.body = dataMatch[1];

    return result;
}

let calcExpression = '';
let calcHistoryValue = '';

function calcInput(val) {
    const display = document.getElementById('calc-display');
    if (calcExpression === '' && display.value === '0') {
        display.value = '';
    }
    calcExpression += val;
    display.value = calcExpression;
}

function calcClear() {
    calcExpression = '';
    document.getElementById('calc-display').value = '0';
    document.getElementById('calc-history').textContent = '';
}

function calcBackspace() {
    calcExpression = calcExpression.slice(0, -1);
    document.getElementById('calc-display').value = calcExpression || '0';
}

function calcEquals() {
    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');
    
    try {
        let expr = calcExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');
        
        const result = Function('"use strict"; return (' + expr + ')')();
        
        history.textContent = calcExpression + ' =';
        display.value = result;
        calcExpression = String(result);
    } catch (e) {
        display.value = 'Error';
        calcExpression = '';
    }
}

function calcFunc(func) {
    const display = document.getElementById('calc-display');
    const currentVal = parseFloat(calcExpression) || 0;
    let result;
    
    switch(func) {
        case 'sqrt': result = Math.sqrt(currentVal); break;
        case 'pow': result = Math.pow(currentVal, 2); break;
        case 'sin': result = Math.sin(currentVal * Math.PI / 180); break;
        case 'cos': result = Math.cos(currentVal * Math.PI / 180); break;
        case 'tan': result = Math.tan(currentVal * Math.PI / 180); break;
        case 'log': result = Math.log10(currentVal); break;
        case 'ln': result = Math.log(currentVal); break;
    }
    
    display.value = result;
    calcExpression = String(result);
}

function calcConst(constant) {
    switch(constant) {
        case 'pi': 
            calcInput(String(Math.PI));
            break;
    }
}

const asciiData = [];

function initAsciiTable() {
    const tbody = document.getElementById('ascii-tbody');
    if (!tbody) return;
    
    const controlChars = [
        'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL',
        'BS', 'HT', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
        'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB',
        'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US', 'Space'
    ];
    
    for (let i = 0; i < 256; i++) {
        let char, description, category;
        
        if (i < 32) {
            char = controlChars[i] || '';
            description = getControlDescription(i);
            category = 'control';
        } else if (i === 32) {
            char = 'SP';
            description = 'Space';
            category = 'printable';
        } else if (i < 127) {
            char = String.fromCharCode(i);
            description = getPrintableDescription(i);
            category = 'printable';
        } else if (i === 127) {
            char = 'DEL';
            description = 'Delete';
            category = 'control';
        } else {
            char = String.fromCharCode(i);
            description = 'Extended ASCII';
            category = 'extended';
        }
        
        asciiData.push({
            dec: i,
            hex: i.toString(16).toUpperCase().padStart(2, '0'),
            oct: i.toString(8).padStart(3, '0'),
            char: char,
            description: description,
            category: category
        });
    }
    
    renderAsciiTable(asciiData);
}

function getControlDescription(code) {
    const descriptions = {
        0: 'Null character',
        1: 'Start of heading',
        2: 'Start of text',
        3: 'End of text',
        4: 'End of transmission',
        5: 'Enquiry',
        6: 'Acknowledgment',
        7: 'Bell',
        8: 'Backspace',
        9: 'Horizontal tab',
        10: 'Line feed',
        11: 'Vertical tab',
        12: 'Form feed',
        13: 'Carriage return',
        14: 'Shift out',
        15: 'Shift in',
        16: 'Data link escape',
        17: 'Device control 1',
        18: 'Device control 2',
        19: 'Device control 3',
        20: 'Device control 4',
        21: 'Negative acknowledgment',
        22: 'Synchronous idle',
        23: 'End of trans. block',
        24: 'Cancel',
        25: 'End of medium',
        26: 'Substitute',
        27: 'Escape',
        28: 'File separator',
        29: 'Group separator',
        30: 'Record separator',
        31: 'Unit separator'
    };
    return descriptions[code] || 'Control character';
}

function getPrintableDescription(code) {
    if (code >= 48 && code <= 57) return 'Digit ' + String.fromCharCode(code);
    if (code >= 65 && code <= 90) return 'Uppercase ' + String.fromCharCode(code);
    if (code >= 97 && code <= 122) return 'Lowercase ' + String.fromCharCode(code);
    if (code === 33) return 'Exclamation mark';
    if (code === 34) return 'Double quote';
    if (code === 35) return 'Number sign';
    if (code === 36) return 'Dollar sign';
    if (code === 37) return 'Percent sign';
    if (code === 38) return 'Ampersand';
    if (code === 39) return 'Single quote';
    if (code === 40) return 'Left parenthesis';
    if (code === 41) return 'Right parenthesis';
    if (code === 42) return 'Asterisk';
    if (code === 43) return 'Plus sign';
    if (code === 44) return 'Comma';
    if (code === 45) return 'Hyphen';
    if (code === 46) return 'Period';
    if (code === 47) return 'Slash';
    if (code === 58) return 'Colon';
    if (code === 59) return 'Semicolon';
    if (code === 60) return 'Less than';
    if (code === 61) return 'Equals sign';
    if (code === 62) return 'Greater than';
    if (code === 63) return 'Question mark';
    if (code === 64) return 'At sign';
    if (code === 91) return 'Left bracket';
    if (code === 92) return 'Backslash';
    if (code === 93) return 'Right bracket';
    if (code === 94) return 'Caret';
    if (code === 95) return 'Underscore';
    if (code === 96) return 'Grave accent';
    if (code === 123) return 'Left brace';
    if (code === 124) return 'Vertical bar';
    if (code === 125) return 'Right brace';
    if (code === 126) return 'Tilde';
    return 'Printable character';
}

function renderAsciiTable(data) {
    const tbody = document.getElementById('ascii-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = `ascii-row ${item.category}-char`;
        tr.innerHTML = `
            <td>${item.dec}</td>
            <td>${item.hex}</td>
            <td>${item.oct}</td>
            <td class="char-cell">${item.char}</td>
            <td>${item.description}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filterAsciiCategory(category) {
    document.querySelectorAll('.ascii-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let filtered;
    if (category === 'all') {
        filtered = asciiData;
    } else {
        filtered = asciiData.filter(item => item.category === category);
    }
    renderAsciiTable(filtered);
}

function filterAsciiTable() {
    const search = document.getElementById('ascii-search').value.toLowerCase();
    
    const filtered = asciiData.filter(item => 
        item.dec.toString().includes(search) ||
        item.hex.toLowerCase().includes(search) ||
        item.char.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
    );
    
    renderAsciiTable(filtered);
}
