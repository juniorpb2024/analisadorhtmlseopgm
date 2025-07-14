const htmlInput = document.getElementById("htmlInput");
const renderedOutput = document.getElementById("renderedOutput");
const boldButton = document.getElementById("boldButton");
const linkButton = document.getElementById("linkButton");
const copyTextButton = document.getElementById("copyTextButton");
const clearTextButton = document.getElementById("clearTextButton");
const copyHtmlButton = document.getElementById("copyHtmlButton");
const linkCount = document.getElementById("linkCount");
const progressFill = document.getElementById("progressFill");
const linkStatus = document.getElementById("linkStatus");

// Função para identar HTML
function formatHTML(html) {
    let formatted = '';
    let indent = 0;
    const tab = '    '; // 4 espaços para indentação
    
    html.split(/(<[^>]*>)/g).forEach(function(element) {
        if (element.match(/^<\/\w/)) {
            // Tag de fechamento
            indent--;
            formatted += tab.repeat(Math.max(0, indent)) + element.trim();
        } else if (element.match(/^<\w[^>]*[^\/]>$/)) {
            // Tag de abertura
            formatted += tab.repeat(indent) + element.trim();
            indent++;
        } else if (element.match(/^<\w.*\/>/)) {
            // Tag auto-fechamento
            formatted += tab.repeat(indent) + element.trim();
        } else if (element.trim()) {
            // Conteúdo de texto
            formatted += tab.repeat(indent) + element.trim();
        }
        
        if (element.trim()) {
            formatted += '\n';
        }
    });
    
    return formatted.trim();
}

// Função para contar links e atualizar barra
function updateLinkCounter() {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const links = doc.querySelectorAll('a[href]');
    const count = links.length;
    
    linkCount.textContent = count;
    
    let percentage = 0;
    let status = '';
    let statusClass = '';
    
    if (count >= 0 && count <= 2) {
        percentage = (count / 2) * 30; // Máximo 30% para vermelho
        status = 'Ruim!';
        statusClass = 'bad';
    } else if (count >= 3 && count <= 5) {
        percentage = 30 + ((count - 3) / 2) * 40; // 30% a 70% para amarelo
        status = 'Padrão';
        statusClass = 'average';
    } else {
        percentage = Math.min(70 + ((count - 5) / 5) * 30, 100); // 70% a 100% para verde
        status = 'Muito Bom';
        statusClass = 'good';
    }
    
    progressFill.style.width = percentage + '%';
    linkStatus.textContent = status;
    linkStatus.className = 'link-status ' + statusClass;
    progressFill.className = 'progress-fill ' + statusClass;
}

// Atualiza o iframe quando o conteúdo do textarea muda
htmlInput.addEventListener("input", () => {
    // Formatar HTML automaticamente
    const formattedHtml = formatHTML(htmlInput.value);
    if (formattedHtml !== htmlInput.value) {
        const cursorPos = htmlInput.selectionStart;
        htmlInput.value = formattedHtml;
        htmlInput.setSelectionRange(cursorPos, cursorPos);
    }
    
    renderedOutput.srcdoc = htmlInput.value;
});

// Sincroniza o HTML de volta ao textarea quando o iframe é editado
renderedOutput.addEventListener("load", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    doc.body.contentEditable = true;

    doc.body.addEventListener("input", () => {
        const content = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        htmlInput.value = formatHTML(content);
        updateLinkCounter();
    });

    // Abrir links na mesma página ou em nova aba com CTRL
    doc.body.addEventListener("click", (event) => {
        if (event.target.tagName === 'A') {
            if (event.ctrlKey) {
                event.preventDefault();
                window.open(event.target.href, '_blank');
            } else {
                event.preventDefault();
                window.location.href = event.target.href;
            }
        }
    });
    
    // Atualizar contador quando o iframe carrega
    updateLinkCounter();
});

// Botão Negrito (Corrigido)
boldButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let selectedText = range.toString();

        if (selectedText.trim() === "") return; // Evita negrito sem texto selecionado

        let parentTag = range.commonAncestorContainer.parentElement;

        if (parentTag.tagName === "STRONG" || parentTag.tagName === "B") {
            // Se já está em negrito, remover negrito mantendo o texto
            const textNode = document.createTextNode(parentTag.textContent);
            parentTag.replaceWith(textNode);
        } else {
            // Se não está em negrito, aplicar negrito
            const strong = doc.createElement("strong");
            strong.textContent = selectedText;
            range.deleteContents();
            range.insertNode(strong);
        }

        // Atualiza o textarea com a nova formatação
        const content = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        htmlInput.value = formatHTML(content);
    }
});

// Botão Inserir Link
linkButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let selectedText = range.toString();

        if (selectedText.trim() === "") return; // Evita link sem texto selecionado

        const link = prompt("Insira o link:");
        if (link) {
            const anchor = doc.createElement("a");
            anchor.setAttribute("href", link);
            anchor.textContent = selectedText;
            range.deleteContents();
            range.insertNode(anchor);
        }

        const content = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        htmlInput.value = formatHTML(content);
        updateLinkCounter();
    }
});

// Botão Copiar Texto
copyTextButton.addEventListener("click", async () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const textContent = doc.body.textContent || doc.body.innerText || '';
    
    try {
        await navigator.clipboard.writeText(textContent);
        copyTextButton.textContent = 'Copiado!';
        setTimeout(() => {
            copyTextButton.textContent = 'Copiar';
        }, 2000);
    } catch (err) {
        alert('Erro ao copiar texto');
    }
});

// Botão Apagar Texto
clearTextButton.addEventListener("click", () => {
    if (confirm('Tem certeza que deseja apagar todo o conteúdo?')) {
        htmlInput.value = '';
        renderedOutput.srcdoc = '';
        updateLinkCounter();
    }
});

// Botão Copiar HTML
copyHtmlButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(htmlInput.value);
        copyHtmlButton.textContent = 'Copiado!';
        setTimeout(() => {
            copyHtmlButton.textContent = 'Copiar';
        }, 2000);
    } catch (err) {
        alert('Erro ao copiar HTML');
    }
});

// Inicializar contador
updateLinkCounter();
