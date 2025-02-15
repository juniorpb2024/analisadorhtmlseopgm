const htmlInput = document.getElementById("htmlInput");
const renderedOutput = document.getElementById("renderedOutput");
const boldButton = document.getElementById("boldButton");
const linkButton = document.getElementById("linkButton");
const bulletPointsButton = document.getElementById("bulletPointsButton");
const h2Button = document.getElementById("h2Button");
const linkPreview = document.getElementById("linkPreview");

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

    // Preview de link ao passar o mouse
    doc.body.addEventListener("mousemove", (event) => {
        if (event.target.tagName === 'A') {
            const link = event.target.href;
            linkPreview.textContent = link;
            linkPreview.style.display = 'block';
            linkPreview.style.left = `${event.pageX}px`;
            linkPreview.style.top = `${event.pageY - 40}px`; // Posiciona acima do link
            linkPreview.style.opacity = "1";
        } else {
            linkPreview.style.opacity = "0";
            setTimeout(() => {
                linkPreview.style.display = "none";
            }, 200);
        }
    });

    doc.body.addEventListener("mouseout", () => {
        linkPreview.style.display = 'none';
    });
});

// Botão Negrito
boldButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const strong = doc.createElement("strong");
        strong.appendChild(range.extractContents());
        range.insertNode(strong);
        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
    }
});

// Botão Inserir Link
linkButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();
    if (selection.rangeCount > 0) {
        const link = prompt("Insira o link:");
        if (link) {
            const range = selection.getRangeAt(0);
            const selectedText = range.extractContents();
            const anchor = doc.createElement("a");
            anchor.setAttribute("href", link);
            anchor.textContent = selectedText.textContent;
            range.insertNode(anchor);
            htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
        }
    }
});

// Botão Bullet Point (corrigido)
bulletPointsButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const ul = doc.createElement("ul");
        const li = doc.createElement("li");
        li.textContent = "• ";
        ul.appendChild(li);
        range.insertNode(ul);
        range.selectNodeContents(li);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
    }
});
