#!/usr/bin/env node

import 'dotenv/config'
import express from 'express';
import { Config } from './config.js'

import OneInch from './providers/oneInch';
import CoinGecko from './providers/coinGecko';

const app = express();
const port = process.env.PORT || Config.port

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/1inch', async (req, res) => {
  const response = await OneInch.fetchImages(true);
  res.status(200).json(response);
});

app.get('/coinGecko', async (req, res) => {
  const response = await CoinGecko.fetchImages(true);
  res.status(200).json(response);
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});