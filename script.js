const htmlInput = document.getElementById("htmlInput");
const renderedOutput = document.getElementById("renderedOutput");
const boldButton = document.getElementById("boldButton");
const linkButton = document.getElementById("linkButton");

// Atualiza o iframe quando o conteúdo do textarea muda
htmlInput.addEventListener("input", () => {
    renderedOutput.srcdoc = htmlInput.value;
});

// Sincroniza o HTML de volta ao textarea quando o iframe é editado
renderedOutput.addEventListener("load", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    doc.body.contentEditable = true;

    doc.body.addEventListener("input", () => {
        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
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
        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
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

        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
    }
});
