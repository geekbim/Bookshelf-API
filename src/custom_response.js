const customResponse = (h, status, msg, data) => {
    return h.response({
        status: status,
        message: msg,
        data: data,
    });
};

const customResponseWithoutData = (h, status, msg) => {
    return h.response({
        status: status,
        message: msg,
    });
};

module.exports = {
    customResponse,
    customResponseWithoutData,
};