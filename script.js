const editor = document.getElementById('editor');
const docTitle = document.getElementById('docTitle');

function format(cmd, value = null) {
    editor.focus();
    
    if (cmd === 'backColor' || cmd === 'hiliteColor') {
        try {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('hiliteColor', false, value);
        } catch (e) {
            try {
                document.execCommand('backColor', false, value);
            } catch (e2) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const span = document.createElement('span');
                    span.style.backgroundColor = value;
                    range.surroundContents(span);
                }
            }
        }
    } else if (cmd === 'foreColor') {
        try {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('foreColor', false, value);
        } catch (e) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                span.style.color = value;
                range.surroundContents(span);
            }
        }
    } else {
        document.execCommand(cmd, false, value);
    }
    
    editor.focus();
}

function updateStats() {
    const text = editor.innerText || '';
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    document.getElementById('wordCount').textContent = words;
    document.getElementById('charCount').textContent = text.length;
}

function exportDoc() {
    const content = docTitle.value + '\n\n' + editor.innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (docTitle.value || 'document') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
}

editor.addEventListener('input', updateStats);

docTitle.addEventListener('input', () => {
    localStorage.setItem('title', docTitle.value);
    localStorage.setItem('content', editor.innerHTML);
});

window.onload = () => {
    const savedTitle = localStorage.getItem('title');
    const savedContent = localStorage.getItem('content');
    if (savedTitle) docTitle.value = savedTitle;
    if (savedContent) editor.innerHTML = savedContent;
    updateStats();
};