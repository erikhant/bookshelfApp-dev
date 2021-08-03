import {
    BOOKSHELF_APPS as bookshelfKey,
    checkingWebStorage, 
    getDataFromLocalStorage, 
    getUsername, 
    addNewBook,
    searchBook
} 
from './assets/App.js'



window.onload = () => {
    const isStorageExist = checkingWebStorage();
    if (!isStorageExist) return;
    
    const islocalDataExist = getDataFromLocalStorage(bookshelfKey);
    if (!islocalDataExist) {
        getUsername();
    };
   
}

document.getElementById("addNewListBook").addEventListener("click", addNewBook);

document.getElementById("searchInput").addEventListener("keyup", searchBook);