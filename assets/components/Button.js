import Element from './Element.js'

function Button(type, event){
    const button = new Element('button');
    event && button.element.addEventListener("click", event);

    switch (type) {
        case 'save':
            button.setClass(["btn-save", "bg-primary", "padding-x-4", "padding-y-2", "text-light", "rounded", "margin-l-auto"]);
            button.insert("Save");
            break;
        case 'undo':
            const undoIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="ic ic-undo" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>`
            button.setClass(["btn-undo", "bg-transparent", "text-light", "text-base", "font-bold", "rounded-md", "padding-0","margin-x-1-5", "margin-y-px"]);
            button.setAttr("data-info", "Undo");
            button.insertHTML(undoIcon);
            break;
        case 'remove':
            const removeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="ic ic-remove" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
            button.setClass(["btn-remove", "bg-transparent", "text-light", "text-base", "font-bold", "rounded-md", "padding-0","margin-x-1-5", "margin-y-px"]);
            button.setAttr("data-info", "Hapus");
            button.insertHTML(removeIcon);
            break;
        default:
            button.setClass([type]);
            break;
    }

    return button;
}

export default Button;