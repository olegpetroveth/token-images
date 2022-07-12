import fs from 'fs';
import fetch from 'node-fetch';

/**
 * @param  {string[]} array
 * @param  {string} fileName
 * @returns boolean
 */
 export function writeArrayToFile(array: string[], fileName: string): boolean {
    try {
        fs.writeFileSync(fileName, array.join('\n'));
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * @param  {Buffer} image
 * @param  {string} fileName
 * @returns boolean
 */
export function writeImageToFile(image: Buffer, fileName: string): boolean {
    try {
        fs.writeFileSync(fileName, image);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * @param  {string} url
 * @returns Promise
 */
export async function fetchImageToBuffer(imageUrl: string): Promise<[Buffer | null, string | null, boolean]> {
    try {
        const response = await fetch(imageUrl);

        const success = response.status === 200 ? true : false;
        if(!success) throw Error(`Image not found ${imageUrl}`);

        const imageType = response.headers.get('content-type');

        const imageBuffer = Buffer.from(await response.arrayBuffer());
        return [imageBuffer, imageType, success];
    } catch(e) {
        console.log(e);
        return [null, null, false];
    }
}

/**
 * @param  {string} directory
 * @returns boolean
 */
export function directoryExists(directory: string): boolean {
    return fs.existsSync(directory);
}

/**
 * @param  {string} directory
 * @returns boolean
 */
export function createDirectory(directory: string): boolean {
    try {
        fs.mkdirSync(directory);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}