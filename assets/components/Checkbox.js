import Element from './Element.js';

function Checkbox(isCheked, event){

    const label = new Element('label');
    const spanOuter = new Element('span');
    const spanInner = new Element('span');
    const checkbox = new Element('input');
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`

    event && checkbox.element.addEventListener("change", event )

    label.setClass(["checkbox", "text-secondary", "text-2xl"]);
    spanOuter.setClass(["checkbox-input"]);
    spanInner.setClass(["checkbox-control", "rounded", "border-1", "border-secondary"]);
    checkbox.setClass(["checked-book"]);

    checkbox.setAttr("type", "checkbox");
    checkbox.setAttr("name", "checkbox");
    checkbox.element.checked = isCheked;

    // inserting child element
    spanInner.insertHTML(checkIcon);
    spanOuter.insert(checkbox.element, spanInner.element);
    label.insert(spanOuter.element);
    
    return label; 

}

export default Checkbox;
