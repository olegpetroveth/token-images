export function contentTypeToImageType(contentType: string | null): string {
    switch(contentType) {
        case null:
            return 'null';
        case 'image/png':
            return 'png';
        case 'image/jpeg':
            return 'jpg';
        case 'image/gif':
            return 'gif';
        default:
            return 'default';
    }
}