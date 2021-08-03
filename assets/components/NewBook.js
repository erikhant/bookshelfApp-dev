import Element from './Element.js'
import Card from './Card.js'
import Button from './Button.js'


function NewBook(events){
    const { save, remove, validate } = events || {};

    const cardBook = Card();
    const removeBtn = Button('remove', remove);
    const saveBtn = Button('save', save);
    const saveBtnMobile = Button('save', save);
    const listInput = new Element('div');
    const actionInput = new Element('div');
    const bookTitleInput = new Element('input');
    const bookAuthorInput = new Element('input');
    const bookYearInput = new Element('input');
    const validateMessage = new Element('p');

    // parent list book
    listInput.setClass(["input-listbook", "padding-1-5"]);
    // parent action button
    actionInput.setClass(["action-listbook", "margin-l-auto"])
    
    bookTitleInput.setAttr("type", "text");
    bookTitleInput.setAttr("placeholder", "Judul Buku");
    bookTitleInput.setClass(["input-book", "input-title", "width-full", "margin-b-1", "margin-r-1", "padding-y-3", "padding-x-2", "text-light", "text-base", "letter-space-wide", "rounded-lg", "bg-transparent", "border-1", "border-primary"]);
    bookTitleInput.element.addEventListener("change", function() { validate(this) });
    bookTitleInput.element.addEventListener("keyup", (e) => e.keyCode !== 13 ? false : save(e));
    
    bookAuthorInput.setAttr("type", "text");
    bookAuthorInput.setAttr("placeholder", "Penulis");
    bookAuthorInput.setClass(["input-book", "input-author", "width-full", "margin-b-1", "margin-r-1", "padding-y-3", "padding-x-2", "text-light", "text-base", "letter-space-wide", "rounded-lg", "bg-transparent", "border-1", "border-primary"])
    bookAuthorInput.element.addEventListener("change", function() { validate(this) });
    bookAuthorInput.element.addEventListener("keyup", (e) => e.keyCode !== 13 ? false : save(e));

    bookYearInput.setAttr("type", "number"); 
    bookYearInput.setAttr("placeholder", "Tahun");
    bookYearInput.setClass(["input-book", "input-year", "width-full", "padding-y-3", "margin-r-1", "padding-x-2", "text-light", "text-base", "letter-space-wide", "rounded-lg", "bg-transparent", "border-1", "border-primary"])
    bookYearInput.element.addEventListener("change", function() { validate(this) });
    bookYearInput.element.addEventListener("keyup", (e) => e.keyCode !== 13 ? false : save(e));
    
    validateMessage.setClass(["validate-message", "text-sm", "text-danger", "margin-t-1", "font-normal"]);
    saveBtnMobile.setClass(["margin-t-2"]);

    // insert element child 
    listInput.insert(bookTitleInput.element, bookAuthorInput.element, bookYearInput.element, validateMessage.element, saveBtnMobile.element);
    actionInput.insert(saveBtn.element, removeBtn.element);
    cardBook.insert(listInput.element, actionInput.element);
    cardBook.setClass(["opacity-0", "fade"]);

    return cardBook;

}

export default NewBook;