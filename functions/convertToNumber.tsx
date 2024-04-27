function convertToNumber(price: string | string[]): number | number[] {
    if (typeof price === 'string') {
        // If price is a string, convert it to a number
        return parseFloat(price);
    } else if (Array.isArray(price)) {
        // If price is an array, convert each element to a number
        return price.map(p => parseFloat(p));
    } else {
        // Handle other cases, such as null or undefined
        return NaN; // Or handle it based on your specific requirements
    }
}

export default convertToNumber;