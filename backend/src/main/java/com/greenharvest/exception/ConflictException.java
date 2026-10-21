package com.greenharvest.exception;

/** Becomes HTTP 409 (e.g. email already registered, duplicate category name). */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
