const htmlInput = document.getElementById("htmlInput");
const renderedOutput = document.getElementById("renderedOutput");
const boldButton = document.getElementById("boldButton");
const linkButton = document.getElementById("linkButton");
const copyTextButton = document.getElementById("copyTextButton");
const copyHtmlButton = document.getElementById("copyHtmlButton");
const clearButton = document.getElementById("clearButton");
const linkProgressBar = document.getElementById("linkProgressBar");
const linkStatus = document.getElementById("linkStatus");

function formatHTML(html) {
    const formatted = html
        .replace(/>\s+</g, '>\n<')
        .split('\n')
        .map(line => line.trim())
        .join('\n');
    return formatted;
}

function updateLinkStatus() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput.value, 'text/html');
    const links = doc.querySelectorAll('a').length;

    let percent = Math.min((links / 5) * 100, 100);
    linkProgressBar.style.width = percent + '%';

    if (links <= 2) {
        linkProgressBar.style.backgroundColor = 'red';
        linkStatus.textContent = "Ruim!";
    } else if (links <= 5) {
        linkProgressBar.style.backgroundColor = 'orange';
        linkStatus.textContent = "Padrão";
    } else {
        linkProgressBar.style.backgroundColor = 'green';
        linkStatus.textContent = "Muito Bom";
    }
}

htmlInput.addEventListener("input", () => {
    const formattedHTML = formatHTML(htmlInput.value);
    renderedOutput.srcdoc = formattedHTML;
    updateLinkStatus();
});

renderedOutput.addEventListener("load", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    doc.body.contentEditable = true;

    doc.body.addEventListener("input", () => {
        htmlInput.value = formatHTML(doc.body.innerHTML.replace(/&nbsp;/g, ' '));
        updateLinkStatus();
    });

    doc.body.addEventListener("click", (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            if (event.ctrlKey) {
                window.open(event.target.href, '_blank');
            } else {
                window.location.href = event.target.href;
            }
        }
    });
});

boldButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        if (!selectedText) return;
        const parentTag = range.commonAncestorContainer.parentElement;
        if (parentTag.tagName === "STRONG" || parentTag.tagName === "B") {
            const textNode = document.createTextNode(parentTag.textContent);
            parentTag.replaceWith(textNode);
        } else {
            const strong = doc.createElement("strong");
            strong.textContent = selectedText;
            range.deleteContents();
            range.insertNode(strong);
        }
        htmlInput.value = formatHTML(doc.body.innerHTML.replace(/&nbsp;/g, ' '));
        updateLinkStatus();
    }
});

linkButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    const selection = doc.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        if (!selectedText) return;
        const url = prompt("Insira o link:");
        if (url) {
            const anchor = doc.createElement("a");
            anchor.href = url;
            anchor.textContent = selectedText;
            range.deleteContents();
            range.insertNode(anchor);
            htmlInput.value = formatHTML(doc.body.innerHTML.replace(/&nbsp;/g, ' '));
            updateLinkStatus();
        }
    }
});

copyTextButton.addEventListener("click", () => {
    navigator.clipboard.writeText(htmlInput.value);
});

copyHtmlButton.addEventListener("click", () => {
    const doc = renderedOutput.contentDocument || renderedOutput.contentWindow.document;
    navigator.clipboard.writeText(formatHTML(doc.body.innerHTML));
});

clearButton.addEventListener("click", () => {
    htmlInput.value = "";
    renderedOutput.srcdoc = "";
    updateLinkStatus();
});
