/*
 * Copyright (C) 2017 MINDORKS NEXTGEN PRIVATE LIMITED
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://mindorks.com/license/apache-v2
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */

/**
 * Created by janisharali on 07/03/17.
 */

const Response = require('./response');

class CustomError extends Error {

    constructor(name, message) {
        super();
        this._name = name;
        this._message = message;
    }

    set _name(name) {
        this.name = name;
    }

    get _name() {
        return this.name;
    }

    set _message(message) {
        this.message = (message || "error");
    }

    get _message() {
        return this.message;
    }

    static handle(err, res) {

        switch (err.name) {

            case "NoSuchUserExistsError":
            case "AuthFailureError":
                return new Response.AuthFailureResponse(err._message).send(res);

            case "AccessTokenError":
                return new Response.AccessTokenErrorResponse(err._message).send(res);

            case "InternalError":
                return new Response.InternalErrorResponse(err._message).send(res);

            case "NotFoundError":
                err._url = res.req.originalUrl;
                return new Response.NotFoundResponse(err._message).send(res);

            case "NoSuchEntityExistsError":
            case "BadRequestError":
                return new Response.BadRequestResponse(err._message).send(res);

            case "ForbiddenError":
                return new Response.ForbiddenResponse(err._message).send(res);

            case "AdminError":
                return new Response.AdminErrorResponse(err._message, err._status).send(res);
        }

        let message = err.message;

        if (NODE_ENV === 'production') {
            message = 'Something wrong happened.'
        }
        // getter is not used to access the variable because there can be not defined error being thrown
        return new Response.CustomErrorResponse(err.statusCode, message).send(res, err.status);
    }
}

class AccessTokenError extends CustomError {
    constructor(message) {
        super("AccessTokenError", (message || 'Invalid access token'))
    }
}

class AuthFailureError extends CustomError {
    constructor(message) {
        super("AuthFailureError", (message || 'Invalid Credentials'))
    }
}

class InternalError extends CustomError {
    constructor(message) {
        super("InternalError", (message || "Internal error"))
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super("BadRequestError", (message || 'Bad Request'))
    }
}

class NotFoundError extends CustomError {
    constructor(message, url) {
        super("NotFoundError", (message || 'Not Found'));
        this._url = url;
    }

    get _url(){
        return this.url;
    }

    set _url(url){
        this.url = url;
    }
}

class ForbiddenError extends CustomError {
    constructor(message) {
        super("ForbiddenError", (message || 'Permission denied'))
    }
}

class NoSuchUserExistsError extends CustomError {
    constructor(message) {
        super("NoSuchUserExistsError", (message || "User don't exists"))
    }
}

class NoSuchEntityExistsError extends CustomError {
    constructor(message) {
        super("NoSuchEntityExistsError", (message || 'No such entry'))
    }
}

class InvalidJwtTokenError extends CustomError {
    constructor(message) {
        super("InvalidJwtTokenError", (message || 'Invalid token'))
    }
}

class AdminError extends CustomError {
    constructor(message, status) {
        super("AdminError", message);
        this._status = (status || 401);
    }

    get _status(){
        return this.status;
    }

    set _status(status){
        this.status = status;
    }
}

module.exports = CustomError;
module.exports.AccessTokenError = AccessTokenError;
module.exports.AuthFailureError = AuthFailureError;
module.exports.InternalError = InternalError;
module.exports.BadRequestError = BadRequestError;
module.exports.NotFoundError = NotFoundError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.NoSuchUserExistsError = NoSuchUserExistsError;
module.exports.NoSuchEntityExistsError = NoSuchEntityExistsError;
module.exports.AdminError = AdminError;
module.exports.InvalidJwtTokenError = InvalidJwtTokenError;