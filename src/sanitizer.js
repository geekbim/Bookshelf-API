const Action = {
    Create: "create",
    Update: "update",
}

const bookValidate = (request, action) => {
    switch (action) {
        case Action.Create:
            if (!request.payload.name || request.payload.name == "") {
                throw new Error('Gagal menambahkan buku. Mohon isi nama buku');
            }
            if (request.payload.readPage > request.payload.pageCount) {
                throw new Error('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
            }
            break;
        case Action.Update:
            if (!request.payload.name || request.payload.name == "") {
                throw new Error('Gagal memperbarui buku. Mohon isi nama buku');
            }
            if (request.payload.readPage > request.payload.pageCount) {
                throw new Error('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
            }
            break;
        default:
            throw new Error('invalid action');
    }
};

module.exports = {
    Action,
    bookValidate,
};