package com.greenharvest.exception;

/** Becomes HTTP 400 (the request was understood but cannot be done, e.g. not enough stock). */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
