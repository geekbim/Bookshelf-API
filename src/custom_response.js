const customResponse = (h, status, msg, data) => {
    return h.response({
        status: status,
        message: msg,
        data: data,
    });
};

module.exports = customResponse;