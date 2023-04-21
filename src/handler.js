const { nanoid } = require('nanoid');
const books = require('./books');
const { bookValidate, Action } = require('./sanitizer');
const { customResponse, customResponseWithoutData } = require('./custom_response');

const addBookHandler = (request, h) => {
    const { 
        name, year, author,
        summary, publisher, pageCount,
        readPage, reading,
    } = request.payload;

    try {
        bookValidate(request, Action.Create);
    } catch (err) {
        const response = customResponseWithoutData(h, "fail", err.message)
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year,
        author, summary, publisher,
        pageCount, readPage, finished,
        reading, insertedAt, updatedAt,
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (!isSuccess) {
        const response = customResponseWithoutData(h, "fail", 'Buku gagal ditambahkan')
        response.code(500);
        return response;
    }

    const data = {
        bookId: newBook.id,
    }
    const response = customResponse(h, "success", 'Buku berhasil ditambahkan', data)
    response.code(201);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (Object.keys(request.query).length != 0) {
        let newBooks = books;
        
        if (name !== undefined) {
            newBooks = newBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (reading !== undefined) {
            newBooks = newBooks.filter((book) => book.reading === !!Number(reading));
        }
        if (finished !== undefined) {
            newBooks = newBooks.filter((book) => book.finished === !!Number(finished));
        }

        const data = {
            books: newBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
        const response = customResponse(h, "success", 'Buku berhasil ditampilkan', data)
        response.code(200);
        return response;
    } else {
        const data = {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
        const response = customResponse(h, "success", 'Buku berhasil ditampilkan', data)
        response.code(200);
        return response;
    }
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book === undefined) {
        const response = customResponseWithoutData(h, "fail", 'Buku tidak ditemukan')
        response.code(404);
        return response;
    }

    data = {
        book: book,
    }
    const response = customResponse(h, "success", 'Buku berhasil ditemukan', data)
    response.code(200);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    
    const {
        name, year, author,
        summary, publisher, pageCount,
        readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    try {
        bookValidate(request, Action.Update);
    } catch (err) {
        const response = customResponseWithoutData(h, "fail", err.message)
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        
        const response = customResponseWithoutData(h, "success", 'Buku berhasil diperbarui')
        response.code(200);
        return response;
    }

    const response = customResponseWithoutData(h, "fail", 'Gagal memperbarui buku. Id tidak ditemukan',)
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    
    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
        const response = customResponseWithoutData(h, "fail", 'Buku gagal dihapus. Id tidak ditemukan', null)
        response.code(404);
        return response;
    }

    books.splice(index, 1);

    const response = customResponseWithoutData(h, "success", 'Buku berhasil dihapus', null)
    response.code(200);
    return response;
};

module.exports = { 
    addBookHandler, 
    getAllBooksHandler, 
    getBookByIdHandler, 
    editBookByIdHandler,
    deleteBookByIdHandler,
};