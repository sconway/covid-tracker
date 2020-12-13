export const abbreviateNumber = (number, truncation) => {
    truncation = Math.pow(10, truncation);
    
    let abbreviation = ["k", "m", "b", "t"];

    for (let index = abbreviation.length - 1; index >= 0; index--) {
        let size = Math.pow(10, (index + 1) * 3);

        if (size <= number) {
            number = Math.round((number * truncation) / size) / truncation;
            number += abbreviation[index];

            break;
        }
    }

    return number;
};