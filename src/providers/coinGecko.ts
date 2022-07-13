/* eslint-disable import/extensions */
import fetch from 'node-fetch';
import async from 'async';
import path from 'path';
import { fileURLToPath } from 'url';

import { CoinGeckoTokenList } from 'src/interfaces/coinGecko';

import { writeArrayToFile, writeImageToFile, fetchImageToBuffer, directoryExists, createDirectory, sleep } from '../utils/fs';
import { contentTypeToImageType } from '../utils/image';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CoinGecko {
    static url: string = 'https://tokens.coingecko.com/uniswap/all.json';
    static directory: string = `${__dirname}/../../assets/coinGecko`;
    static chain: string = 'eth';
    
    /**
     * @param  {boolean} process
     * @returns CoinGeckoTokenList
     */
    static async fetchImages(process: boolean): Promise<CoinGeckoTokenList> {
        const response = await fetch(CoinGecko.url);
        const CoinGeckoTokenReponse = await response.json() as unknown as CoinGeckoTokenList;

        if(process) {
            await CoinGecko.processImages(CoinGeckoTokenReponse);
        }

        return CoinGeckoTokenReponse;
    }
    
    /**
     * @param  {CoinGeckoTokenList} CoinGeckoTokenReponse
     * @returns boolean
     */
    static async processImages(CoinGeckoTokenReponse: CoinGeckoTokenList): Promise<boolean> {
        const notFoundTokens:string[] = [];

        try {
            if(!directoryExists(CoinGecko.directory)) {
                const createSuccess = createDirectory(CoinGecko.directory);

                if(!createSuccess) throw Error('Could not create directory');
            }
    
            await async.eachLimit(CoinGeckoTokenReponse.tokens, 5, async token => {
                let imageFilename: string = token.logoURI;
                let imageUrl;

                if(token.logoURI && token.logoURI.startsWith('http')) {
                    
                    imageUrl = token.logoURI.replace('thumb', 'large');
                    const [imageBuffer, imageType, isImageOk] = await fetchImageToBuffer(imageUrl);
                    
                    if(isImageOk && imageBuffer) {
                        const fileExtension = contentTypeToImageType(imageType);
                        imageFilename = `${CoinGecko.chain.toLowerCase()}.${token.symbol.toLowerCase()}-${token.address.toLowerCase()}.${fileExtension}`;
                        
                        const imageWriteSuccess = writeImageToFile(imageBuffer, `${CoinGecko.directory}/${imageFilename}`);
                        if(!imageWriteSuccess) throw new Error(`Could not write ${imageFilename}`);
                        
                    } else {
                        notFoundTokens.push(imageFilename);
                    }
                } else {
                    notFoundTokens.push(imageFilename);
                }

                sleep(3000);
            });

            const notFoundWriteSuccess = writeArrayToFile(notFoundTokens, `${CoinGecko.directory}/notFoundTokens.json`);

            if(!notFoundWriteSuccess) {
                throw new Error('Could not write notFoundTokens.json');
            }
    
            return true;
        } catch(e)  {
            console.log(e);
            return false;
        }
    }
}