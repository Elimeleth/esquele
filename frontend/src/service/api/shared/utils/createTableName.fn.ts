export function generateRandomTableName() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const lettersPart = Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const timestamp = Date.now().toString();
    const numbers = '0123456789';
    const numbersPart = Array.from({ length: 2 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    return `${lettersPart}${timestamp}${numbersPart}`;
}