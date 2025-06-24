// This file exports utility functions that assist in formatting and processing data for the prompt.

export function formatString(input) {
    return input.trim().replace(/\s+/g, ' ');
}

export function validateInput(input) {
    if (typeof input !== 'string' || input.trim() === '') {
        throw new Error('Input must be a non-empty string.');
    }
    return true;
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}