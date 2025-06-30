export function generateUniqueUrl(): string {
    const timestamp = Date.now(); // current time in ms
    const randomString = Math.random().toString(36).substring(2, 10); // 8-char alphanumeric    

    return `${timestamp}-${randomString}`;
}
