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

// Botão Negrito (Melhorado)
boldButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.extractContents();
        const parentTag = range.commonAncestorContainer.parentElement;

        if (parentTag && parentTag.tagName === "STRONG") {
            // Se já está em negrito, remover
            const textNode = document.createTextNode(parentTag.textContent);
            parentTag.replaceWith(textNode);
        } else {
            // Se não está em negrito, aplicar
            const strong = doc.createElement("strong");
            strong.appendChild(selectedText);
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
        const selectedText = range.extractContents();
        const link = prompt("Insira o link:");

        if (link) {
            const anchor = doc.createElement("a");
            anchor.setAttribute("href", link);
            anchor.textContent = selectedText.textContent;
            range.deleteContents();
            range.insertNode(anchor);
        }

        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
    }
});
