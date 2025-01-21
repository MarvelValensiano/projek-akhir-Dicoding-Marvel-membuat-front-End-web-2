// Key untuk penyimpanan data buku di localStorage
const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];

// Cek apakah browser mendukung localStorage
function isStorageExist() {
    return typeof (Storage) !== undefined;
}

// Menyimpan data buku ke localStorage
function saveData() {
    if (isStorageExist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
}

// Memuat data buku dari localStorage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData !== null) {
        books = JSON.parse(serializedData);
    }
}

// Menghasilkan ID unik
function generateId() {
    return +new Date();
}

// Membuat objek buku
function createBookObject(id, title, author, year, isComplete) {
    return { id, title, author, year, isComplete };
}

// Menambahkan buku baru
function addBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const bookId = generateId();
    const bookObject = createBookObject(bookId, title, author, year, isComplete);
    books.push(bookObject);

    saveData();
    renderBooks();

    alert("Buku berhasil ditambahkan!");
}


// Ambil elemen checkbox dan tombol submit
const bookFormIsCompleteCheckbox = document.getElementById('bookFormIsComplete');
const bookFormSubmitButton = document.getElementById('bookFormSubmit');

// Fungsi untuk mengubah teks tombol berdasarkan status checkbox
function updateSubmitButtonText() {
    if (bookFormIsCompleteCheckbox.checked) {
        bookFormSubmitButton.innerText = 'Masukan buku ke rak selesai dibaca';
    } else {
        bookFormSubmitButton.innerText = 'Masukan buku ke rak belum selesai dibaca';
    }
}

// Pasang event listener untuk perubahan pada checkbox
bookFormIsCompleteCheckbox.addEventListener('change', updateSubmitButtonText);

// Panggil fungsi ini saat halaman dimuat agar teks tombol sesuai dengan status awal checkbox
window.addEventListener('load', updateSubmitButtonText);



// Membuat elemen buku di DOM
function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.classList.add("book-item");

    // Tambahkan elemen untuk menampilkan ID buku
    const idElement = document.createElement("p");
    idElement.innerText = "ID: " + book.id;  // Tampilkan ID buku

    const titleElement = document.createElement("h3");
    titleElement.innerText = book.title;
    titleElement.setAttribute("data-testid", "bookItemTitle");

    const authorElement = document.createElement("p");
    authorElement.innerText = "Penulis: " + book.author;
    authorElement.setAttribute("data-testid", "bookItemAuthor");

    const yearElement = document.createElement("p");
    yearElement.innerText = "Tahun: " + book.year;
    yearElement.setAttribute("data-testid", "bookItemYear");

    const actionContainer = document.createElement("div");

    const isCompleteButton = document.createElement("button");
    isCompleteButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    isCompleteButton.addEventListener('click', () => {
        toggleBookCompletion(book.id);
    });
    isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener('click', () => {
        removeBook(book.id);
    });
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener('click', () => {
        editBook(book.id);
    });
    editButton.setAttribute("data-testid", "bookItemEditButton");

    actionContainer.append(isCompleteButton, deleteButton, editButton);
    bookItem.append(titleElement, idElement, authorElement, yearElement, actionContainer);  // Tambahkan idElement

    return bookItem;
}


// Fungsi untuk menghapus buku
function removeBook(bookId) {
    books = books.filter(book => book.id !== bookId);
    saveData();
    renderBooks();

    alert("Buku berhasil dihapus!");
}

// Fungsi untuk memindahkan buku antara rak Selesai dan Belum Selesai
function toggleBookCompletion(bookId) {
    const book = books.find(book => book.id === bookId);
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();

    alert("Buku berhasil dipindahkan!");
}

// Fungsi untuk me-render semua buku dengan pencarian
function renderBooks(searchTitle = "") {
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    const lowerCaseSearchTitle = searchTitle.toLowerCase();

    books.forEach(book => {
        if (book.title.toLowerCase().includes(lowerCaseSearchTitle)) {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.append(bookElement);
            } else {
                incompleteBookList.append(bookElement);
            }
        }
    });
}

// Fungsi untuk menangani form penambahan buku
document.getElementById('bookForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const bookId = document.getElementById('bookId').value;
    if (bookId) {
        saveEditedBook(parseInt(bookId));  // Simpan perubahan
    } else {
        addBook();  // Tambahkan buku baru
    }
    document.getElementById('bookForm').reset();  // Reset form setelah submit
    document.getElementById('bookId').value = '';  // Kosongkan ID buku
});

// Muat data dari localStorage ketika halaman dibuka
window.addEventListener('load', () => {
    if (isStorageExist()) {
        loadDataFromStorage();
    }
    renderBooks();
});


// Fungsi untuk menangani pencarian melalui tombol search
document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Ambil nilai input pencarian
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    
    // Panggil renderBooks dengan parameter pencarian
    const foundBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
    renderBooks(searchTitle);

    // Menampilkan alert berdasarkan hasil pencarian
    if (foundBooks.length > 0) {
        alert("Buku ini ada di daftar!");
    } else {
        alert("Buku ini tidak ada di daftar!");
    }
});



// Event listener untuk pencarian otomatis
document.getElementById('searchBookTitle').addEventListener('input', function () {
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    renderBooks(searchTitle);  // Panggil renderBooks dengan parameter pencarian
});

// Fungsi untuk menampilkan semua buku (reset pencarian)
function resetSearch() {
    document.getElementById('searchBookTitle').value = ''; // Kosongkan kolom pencarian
    renderBooks();  // Render ulang semua buku tanpa filter
}

// Event listener untuk tombol reset pencarian
document.getElementById('searchReset').addEventListener('click', resetSearch);

// Fungsi untuk mengedit buku
function editBook(bookId) {
    const book = books.find(book => book.id === bookId);

    // Mengisi form dengan data buku yang ingin diedit
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    // membuat tulisan pada tombol sesuai dengan asal rak dari buku nya 
    updateSubmitButtonText();

    // Tampilkan form pengeditan dan scroll ke form
    document.getElementById('bookForm').scrollIntoView({ behavior: 'smooth' });

    // Menyimpan ID buku yang sedang diedit
    document.getElementById('bookId').value = bookId;
}

// Fungsi untuk menyimpan perubahan buku
function saveEditedBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);

    books[bookIndex].title = document.getElementById('bookFormTitle').value;
    books[bookIndex].author = document.getElementById('bookFormAuthor').value;
    books[bookIndex].year = Number(document.getElementById('bookFormYear').value);
    books[bookIndex].isComplete = document.getElementById('bookFormIsComplete').checked;

    saveData();
    renderBooks();

    alert("Buku berhasil diedit!");
}
