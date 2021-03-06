const { sendResponse } = require("./sendResponse");

const sendTokenResponse = (company, statusCode, res) => {
    const token = company.getSignedJwtToken();
    console.log(token)

    let options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 10000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    return sendResponse(res, {
        status: "Sucess",
        token
    }, statusCode, 'application/json', setCookie=true, options=options)
}


module.exports = sendTokenResponse;