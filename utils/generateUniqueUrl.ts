export function generateUniqueUrl(filename: string): string {
    const timestamp = Date.now(); // current time in ms
    const randomString = Math.random().toString(36).substring(2, 10); // 8-char alphanumeric
    const fileExtension = filename.split('.').pop(); // e.g. "jpg"
    const sanitizedFilename = filename
        .split('.')[0]
        .replace(/[^a-zA-Z0-9-_]/g, '') // remove unsafe chars

    return `uploads/${sanitizedFilename}-${timestamp}-${randomString}.${fileExtension}`;
}
