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

    // Preview de link ao passar o mouse
    doc.body.addEventListener("mousemove", (event) => {
        if (event.target.tagName === 'A') {
            const link = event.target.href;
            linkPreview.innerHTML = `<iframe src="${link}"></iframe>`;
            linkPreview.style.display = 'block';
            linkPreview.style.left = `${event.clientX + 10}px`;
            linkPreview.style.top = `${event.clientY + 10}px`;
        } else {
            linkPreview.style.display = 'none';
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

// Botão Bullet Point
bulletPointsButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const ul = doc.createElement("ul");
        const li = doc.createElement("li");
        li.textContent = range.toString() || "•";
        ul.appendChild(li);
        range.insertNode(ul);

        // Adiciona um evento para criar novos bullet points ao pressionar Enter
        li.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const newLi = doc.createElement("li");
                newLi.textContent = "•";
                ul.appendChild(newLi);
                newLi.focus();
            }
        });

        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
    }
});

// Botão H2
h2Button.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const parent = range.commonAncestorContainer;

        // Verifica se o texto selecionado já está dentro de um <h2>
        if (parent.nodeName === 'H2') {
            // Se já for <h2>, transforma em texto normal
            const textNode = doc.createTextNode(parent.textContent);
            parent.replaceWith(textNode);
        } else {
            // Se não for <h2>, transforma em <h2>
            const h2 = doc.createElement("h2");
            h2.textContent = range.toString();
            range.deleteContents();
            range.insertNode(h2);
        }

        htmlInput.value = doc.body.innerHTML.replace(/&nbsp;/g, ' ');
    }
});
