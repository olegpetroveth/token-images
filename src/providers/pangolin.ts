/* eslint-disable import/extensions */
import fetch from 'node-fetch';
import async from 'async';
import path from 'path';
import { fileURLToPath } from 'url';

import { OneInchTokenList } from 'src/interfaces/oneInch';

import { writeArrayToFile, writeImageToFile, fetchImageToBuffer, directoryExists, createDirectory, sleep } from '../utils/fs';
import { contentTypeToImageType } from '../utils/image';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Pangolin {
  static url: string = 'https://raw.githubusercontent.com/pangolindex/tokenlists/main/pangolin.tokenlist.json';
  static directory: string = `${__dirname}/../../assets/pangolin`;
  static chain: string = 'avax';

  /**
   * @param  {boolean} process
   * @returns OneInchTokenList
   */
  static async fetchImages(process: boolean): Promise<OneInchTokenList> {
    const response = await fetch(Pangolin.url);
    const oneInchTokenReponse = (await response.json()) as unknown as OneInchTokenList;
    if (process) {
      await Pangolin.processImages(oneInchTokenReponse);
    }

    return oneInchTokenReponse;
  }

  /**
   * @param  {OneInchTokenList} oneInchTokenReponse
   * @returns boolean
   */
  static async processImages(oneInchTokenReponse: OneInchTokenList): Promise<boolean> {
    const notFoundTokens: string[] = [];

    try {
      if (!directoryExists(Pangolin.directory)) {
        const createSuccess = createDirectory(Pangolin.directory);

        if (!createSuccess) throw Error('Could not create directory');
      }

      await async.eachLimit(oneInchTokenReponse.tokens, 5, async token => {
        let imageFilename: string = token.logoURI;

        const [imageBuffer, imageType, isImageOk] = await fetchImageToBuffer(token.logoURI);

        if (isImageOk && imageBuffer) {
          const fileExtension = contentTypeToImageType(imageType);
          imageFilename = `${Pangolin.chain.toLowerCase()}.${token.symbol.toLowerCase()}-${token.address.toLowerCase()}.${fileExtension}`;

          const imageWriteSuccess = writeImageToFile(imageBuffer, `${Pangolin.directory}/${imageFilename}`);
          if (!imageWriteSuccess) throw new Error(`Could not write ${imageFilename}`);
        } else {
          notFoundTokens.push(imageFilename);
        }

        sleep(5000);
      });

      const notFoundWriteSuccess = writeArrayToFile(notFoundTokens, `${Pangolin.directory}/notFoundTokens.json`);

      if (!notFoundWriteSuccess) {
        throw new Error('Could not write notFoundTokens.json');
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}