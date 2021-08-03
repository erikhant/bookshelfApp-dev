/*  Fungsi Class ini digunakan untuk membuat Element HTML 
 *  Tujuannya agar lebih mudah dalam mengakses & memanipulasi element
 * 
 */


class Element {
    constructor(element){
        this.element = create(element);
    }

    setAttr(name, value){
        this.element.setAttribute(name, value);
        return this;
    }

    setClass(classname){
        if (typeof(classname) !== "object") return console.warn("type of classname must be object (Array)");

        for (const classes of classname) {
            this.element.classList.add(classes);
        }
        return this;
    }

    insert(...element){
        this.element.append(...element);
        return this;
    }

    insertBefore(...element){
        this.element.prepend(...element);
        return this;
    }

    insertHTML(element){
        this.element.innerHTML = element;
        return this;
    }

    removeAttr(name){
        this.element.removeAttribute(name);
        return this;
    }

    removeClass(classname){
        this.element.classList.remove(classname);
        return this;
    }

}

function create(element) {
    const el = document.createElement(element);
    return el;
}


export default Element;