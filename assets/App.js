import CreateList from './components/ListBook.js';
import InputNewBook from './components/NewBook.js'


export const BOOKSHELF_APPS = "BOOKSHELF_APPS" // Local Storage Key Name
export const DATA_PROVIDE = {};                // Global data


const checkingWebStorage = () => {
    if (typeof (Storage)) {
        return true;
    } else {
        console.warn("Warning!: Browser Anda tidak mendukung Web Storage. Beberapa fitur mungkin tidak bisa berfungsi dengan baik. Gunakan browser yang mendukung fitur Web Storage agar Anda mendapatkan pengalaman terbaik dalam menggunakan aplikasi kami.");
        return false;
    }
}


const syncToLocalStorage = (action, global, data) => {
    const [username, newItem] = data;

    switch (action) {
        case 'SAVE':
            global.name = username;
            global.bookList ? global.bookList = [...global.bookList, newItem] : global.bookList = newItem;
            break;
        case 'UPDATE':
            global.bookList = global.bookList.map(bookItem => {
                if (bookItem.id === newItem.id) {
                    bookItem.title = newItem.title;
                    bookItem.year = newItem.year;
                    bookItem.isComplete = newItem.isComplete;
                }
                return bookItem;
            })
            break;
        case 'DELETE':
            const index = global.bookList.findIndex(bookItem => bookItem.id === newItem.id);
            if (index !== -1) {
                global.bookList.splice(index, 1);
            } else {
                return console.error("Error: failed to delete book");
            }
            break;
    }
    localStorage.setItem(BOOKSHELF_APPS, JSON.stringify(global));
    DATA_PROVIDE.name = global.name;
    DATA_PROVIDE.bookList = global.bookList;
    return;
}


const getDataFromLocalStorage = (key) => {
    const localData = localStorage.getItem(key);
    if (localData) {
        const { name, bookList } = JSON.parse(localData);
        // Passing the data to global variable
        DATA_PROVIDE.name = name;
        DATA_PROVIDE.bookList = bookList;
        // Write Name on Front page
        writeName(DATA_PROVIDE.name);
        // Update total Uncompleted book & Completed book
        calcTotalUncompletedBook();
        calcTotalCompletedBook();
        // Create List of Book
        updateListBook();
        return true;
    }
    return false;
}


const Modal = (id, isOpen) => {
    const modal = document.getElementById(id);
    isOpen ? modal.classList.add("show") : modal.classList.remove("show");
    return modal;
}


const writeName = (name) => {
    document.getElementById("user-name").innerText = `Hai ${name}, \nApa Yang Ingin Kamu Baca Hari Ini?`;
}


const calcTotalUncompletedBook = () => {
    const totalUncompleted = DATA_PROVIDE.bookList.filter(item => !item.isComplete);
    const totalCounter = document.getElementById("totalUncompletedBook");
    let info;

    if (totalUncompleted.length) {
        info = `Belum dibaca : ${totalUncompleted.length} Buku`;
    }
    else {
        DATA_PROVIDE.bookList.length > 0 ? info = 'Tidak ada buku yang belum dibaca' : info = 'Kamu belum memiliki daftar buku'
    }
    totalCounter.innerHTML = info;
    return totalUncompleted.length;
}


const calcTotalCompletedBook = () => {
    const totalCompleted = DATA_PROVIDE.bookList.filter(item => item.isComplete);
    const totalCounter = document.getElementById("totalCompletedBook");

    totalCounter.innerHTML = `${totalCompleted.length ? `Selesai dibaca : ${totalCompleted.length} Buku` : ''}`;
    return totalCompleted.length;
}


const getUsername = () => {
    const modal = Modal("modalUsername", true);    // Open Modal
    const username = document.getElementById("usernameInput");
    const saveBtn = document.getElementById("saveUsername");

    saveBtn.onclick = () => {
        if (username.value.trim() === '') return modal.querySelector(".validate-message").innerText = "Mohon isi nama kamu."
        // Write Name on Front page
        writeName(username.value.trim());
        // Save to local Storage
        syncToLocalStorage('SAVE', DATA_PROVIDE, [username.value.trim(), []]);
        // Update total Uncompleted book & Completed book
        calcTotalUncompletedBook();
        calcTotalCompletedBook();
        // Close Modal
        Modal("modalUsername", false);
    }

    username.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        if (username.value.trim() === '') return modal.querySelector(".validate-message").innerText = "Mohon isi nama kamu."
        // Write Name on Front page
        writeName(username.value.trim());
        // Save to local Storage
        syncToLocalStorage('SAVE', DATA_PROVIDE, [username.value.trim(), []]);
        // Update total Uncompleted book & Completed book
        calcTotalUncompletedBook();
        calcTotalCompletedBook();
        // Close Modal
        Modal("modalUsername", false);
    })
}


const createBookId = () => {
    const random = new Date();
    return random.getTime();
}


const saveBook = (title, author, year, isComplete) => {
    if (escapeSpaces(title) === '' || escapeSpaces(author) === '' || escapeSpaces(year) === '') {
        return false;
    }
    const id = createBookId();
    const newBook = {
        id, title, author, year: Number(year), isComplete
    }
    syncToLocalStorage('SAVE', DATA_PROVIDE, [DATA_PROVIDE.name, newBook]);
    return newBook;

}


const getInputBook = (el) => {
    const inputs = el.querySelectorAll(".input-book");

    return {
        node: [...inputs],
        value: [inputs[0].value, inputs[1].value, inputs[2].value]
    };
}


const insertBook = (e) => {
    const parentNode = findParent(e, "card-listbook")
    const book = getInputBook(parentNode);
    // Save New Book to Local Storage
    const save = saveBook(...book.value, false /*the default isComplete value*/);
    if (save) {
        const { isComplete } = save;
        const bookData = [save.id, save.title, save.author, save.year];  // Merge Book Data
        const newBook = makeBook(bookData, isComplete);          // Create list book

        Render("uncompleted-listbook", newBook, 'prepend');     // Render in Browser
        calcTotalUncompletedBook();                             // Update total uncompleted book
        parentNode.remove();                                    // Remove Input Field 

    } else {
        const validateMessage = parentNode.querySelector(".validate-message");
        const [title, author, year] = book.node;
        inputValidate(title);
        inputValidate(author);
        inputValidate(year);
        validateMessage.innerText = 'Isi kolom diatas dengan lengkap!';
    }
}


const addNewBook = () => {
    const form = InputNewBook({
        // Initialize Event
        validate: inputValidate,            // Event input validation 
        save: insertBook,               // Event Insert Book
        remove: (e) => removeInput(e, 347)  // Event remove form
    });
    // Render Input Form in browser
    Render('uncompleted-listbook', form.element, 'append');
    // Create fadeIn animation
    setTimeout(() => {
        form.removeClass("opacity-0");
        form.removeClass("fade");
        form.setClass(["opacity-1"]);
    }, 580)

}


const updateIsComplete = (id, title, author, year, isComplete) => {
    const updateBook = {
        id, title, author, year: Number(year), isComplete
    };
    syncToLocalStorage("UPDATE", DATA_PROVIDE, [DATA_PROVIDE.name, updateBook]);
    return true;
}


const setIsComplete = (e, stopRendering) => {
    const isComplete = e.target.checked;    // Get current target value
    const parent = findParent(e, "card-listbook");
    const currentBook = getBookInfo(parent);
    // Update to Local Storage
    updateIsComplete(...currentBook, isComplete);
    if (stopRendering) return;
    // Make Book Updated
    const updatedBook = makeBook(currentBook, isComplete);
    // Render in Browser
    Render(isComplete ? "completed-listbook" : "uncompleted-listbook", updatedBook, "prepend");
    // Update total Uncompleted book & Completed book
    calcTotalUncompletedBook();
    calcTotalCompletedBook();
    // Remove old book
    removeList(parent, 280);
}


const updateListBook = () => {
    DATA_PROVIDE.bookList.forEach(book => {
        const { isComplete } = book;
        const bookData = [book.id, book.title, book.author, book.year];
        const bookItem = makeBook(bookData, isComplete);
        // Render in browser
        Render(isComplete ? "completed-listbook" : "uncompleted-listbook", bookItem, "prepend");

    });
}


const removeList = (target, delay) => {
    target.classList.add("fadeOut");
    setTimeout(() => target.remove(), delay || 25);
}


const deleteBook = (e) => {
    if (!e.target) return;
    const parent = findParent(e, "card-listbook");
    const currentBook = getBookInfo(parent);
    const bookData = { id: currentBook[0] }
    // Delete individual data from Local Storage
    syncToLocalStorage('DELETE', DATA_PROVIDE, [DATA_PROVIDE.name, bookData])
    // Update total Uncompleted book & Completed book
    calcTotalUncompletedBook();
    calcTotalCompletedBook();
    // Remove Book
    removeList(parent, 250);
    // Close Modal
    Modal("modalRemove", false);
}


const editBook = (e) => {
    e.target.contentEditable = true;
    e.target.focus();
    e.target.classList.add("border-1");
}


const updateBook = (e) => {
    const parent = findParent(e, "card-listbook");
    const oldBook = getBookInfo(parent);
    const isComplete = parent.querySelector(".checked-book").checked;
    const [id, title, author, year] = oldBook;
    const update = { id, title, author, year: Number(year), isComplete }

    let value = e.target.textContent.trim();

    if (e.target.classList.contains("book-title")) {
        if (value === "") value = "Untitled Book";
        update.title = value;
    }

    if (e.target.classList.contains("book-year")) {
        if (value === "" || escapeWord(value)) value = 9999;
        update.year = Number(value);
    };
    e.target.classList.remove("border-1");
    e.target.innerText = value;
    e.target.contentEditable = false;
    syncToLocalStorage("UPDATE", DATA_PROVIDE, [DATA_PROVIDE.name, update]);
}


const escapeWord = (str) => {
    const regEx = /[a-zA-Z\W]+/gi
    return regEx.test(str);
}


const escapeSpaces = (str) => {
    return str.replace(/\s+/g, '');
}


const cleanSection = () => {
    document.querySelector("#uncompleted-listbook .wrapper-listbook").innerHTML = '';
    document.querySelector("#completed-listbook .wrapper-listbook").innerHTML = '';
    document.querySelector("#totalCompletedBook").innerHTML = '';
}


const searchBook = (e) => {
    const sec = document.querySelector("#add-new");
    const total = document.getElementById("totalUncompletedBook");

    if (e.target.value.trim() === "") {
        sec.classList.remove("none");
        cleanSection();

        updateListBook();
        calcTotalUncompletedBook();
        calcTotalCompletedBook();
        return;
    };

    const keyword = e.target.value.trim();
    const regEx = new RegExp('\\b[' + keyword + ']+\\b', 'gi');
    const result = []

    DATA_PROVIDE.bookList.forEach(book => regEx.test(book.title) || regEx.test(book.author) ? result.push(book) : '')
    sec.classList.add("none");
    cleanSection();

    if (result.length === 0) {
        total.innerHTML = `<span class="inline-block">Hasil pencarian : Not found</span>`
        return false;
    }

    result.forEach(bookFound => {
        const { isComplete } = bookFound;
        const bookData = [bookFound.id, bookFound.title, bookFound.author, bookFound.year];  // Merge Book Data
        const bookList = makeBook(bookData, isComplete, true);
        Render("uncompleted-listbook", bookList, "prepend");
    })

    total.innerHTML = `<span class="inline-block">Hasil pencarian : ${result.length} Hasil</span>`
}


const makeBook = (bookData, isComplete, stopRender) => {
    const events = {
        isComplete: (e) => setIsComplete(e, stopRender || false),
        edit: editBook,
        update: updateBook,
        remove: (e) => {
            const modal = Modal("modalRemove", true);
            modal.querySelector("#confirm").onclick = () => deleteBook(e)
            modal.querySelector("#cancel").onclick = () => Modal("modalRemove", false)
        }
    }

    const newBook = CreateList(bookData, isComplete, events);
    return newBook.element;
}


const findParent = (eventObj, parentClassname) => {
    const parent = eventObj.path.find(element => element.classList.contains(parentClassname));
    if (!parent) return console.error("Cannot find the parent element. Make sure the the classname of the parent element is correct!");
    return parent;
}


const getBookInfo = (currentElement) => {
    const book = currentElement.querySelectorAll(".book");
    return [Number(book[3].innerText), book[0].innerText, book[2].innerText, book[1].innerText];
}


function inputValidate(currentInput) {
    const inputValue = currentInput.parentElement.parentElement.querySelectorAll(".input-book");
    const validateMessage = currentInput.parentElement.parentElement.querySelector(".validate-message");

    if (inputValue[0].value !== '' && inputValue[1].value !== '' && inputValue[2].value !== '') {
        validateMessage.innerText = ''
    }

    if (escapeSpaces(currentInput.value) !== '') {
        currentInput.classList.remove('border-danger');
        currentInput.classList.add('border-primary');
    } else {
        currentInput.classList.add('border-danger');
        currentInput.classList.remove('border-primary');
    }
}


function removeInput(eventObj, delay) {
    const parent = findParent(eventObj, "card-listbook")
    parent.classList.add("fadeOut");
    setTimeout(() => parent.remove(), delay || 25);
}


function Render(parentId, child, position) {
    const parent = document.querySelector("#" + parentId + " .wrapper-listbook");
    if (!parent) return console.error("Cannot render because parent element is null. Make sure the id of the parent element is correct ")

    if (position === 'prepend') {
        parent.prepend(child);
    }
    else if (position === 'append') {
        parent.append(child);
    }
    else {
        console.error("Error rendering: Use 'append' or 'prepend' to insert position of the element!");
        return false;
    }
}



export { checkingWebStorage, getDataFromLocalStorage, getUsername, writeName, addNewBook, searchBook };


