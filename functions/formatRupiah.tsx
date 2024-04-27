const formatRupiah = (number : number) : string => {
    const numberString : string = number.toString();
    const numberChars: string[] = numberString.split('');
    let formattedRupiah : string = ''
    let count: number = 0;

    // Iterate over each character in reverse order
    for (let i = numberChars.length - 1; i >= 0; i--) {
        // Add current character to the formatted number
        formattedRupiah = numberChars[i] + formattedRupiah;
        count++;

        // If the count is divisible by 3 and it's not the last character, add a dot
        if (count % 3 === 0 && i !== 0) {
            formattedRupiah = '.' + formattedRupiah;
        }
    }
    return formattedRupiah
}

export default formatRupiah;