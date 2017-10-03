/**
 * manages the replies for the client
 * 
 * @param {array} result
 * @param {integer} successCode
 * @param {integer} failCode
 * @param {integer} internalServerError
 */
exports.makeReply = function(reply, result, successCode, failCode, internalServerError = 500) {
    if(result.affectedRows == 0 || result.length == 0) {
        return reply(result).code(failCode);
    }
    
    else if(result.affectedRows > 0 || result.length > 0) {
        return reply(result).code(successCode);
    }
    
    else {
        return reply(result).code(internalServerError);
    }
}