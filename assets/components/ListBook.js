import Element from './Element.js'
import Card from './Card.js'
import Button from './Button.js'
import Checkbox from './Checkbox.js';

function ListBook(bookData, isCompleteBook, events){
    const [idBook, bookTitle, bookAuthor, bookYear] = bookData;
    const {remove, isComplete, edit, update} = events || {}

    const cardBook = Card();
    const removeBtn = Button('remove', remove);
    const checkbox = Checkbox(isCompleteBook, isComplete);
    const bookInfo = new Element('div');
    const cardInner = new Element('div');
    const actionWrapper = new Element('div');
    const title = new Element('h1');
    const author = new Element('p');
    const year = new Element('span');
    const id = new Element('p');

    bookInfo.setClass(["book-info","padding-1-5"]);
    cardInner.setClass(["card-inner"]);
    actionWrapper.setClass(["action-listbook", "margin-l-auto"]);
    title.setClass(["book", "book-title", "text-base", "padding-1", "letter-space-wide", "border-primary", isCompleteBook ? "text-muted" : "text-light"]);
    author.setClass(["book", "book-author", "text-sm", "padding-1", "letter-space-wide", "border-primary", isCompleteBook ? "text-muted" : "text-light"]);
    year.setClass(["book", "book-year", "padding-1", "font-normal", "border-primary", isCompleteBook ? "text-muted" : "text-light"]);
    id.setClass(["book", "book-id"]);
    id.setAttr("hidden", "true");

    // inserting text content
    title.insert(bookTitle);
    author.insert(bookAuthor);
    year.insert(bookYear);
    id.insert(idBook)

    edit && [title, year].forEach(el => el.element.addEventListener("dblclick", edit));
    update && [title, year].forEach(el => el.element.addEventListener("blur", update));
    update && [title, year].forEach(el => el.element.addEventListener("keydown", (e)=> e.keyCode !== 13 ?  false : update(e)));

    // inserting child element
    cardInner.insert(title.element, year.element);
    bookInfo.insert(cardInner.element, author.element, id.element);
    actionWrapper.insert(removeBtn.element);
    cardBook.insert(checkbox.element, bookInfo.element, actionWrapper.element);
    
    return cardBook;
}

export default ListBook;