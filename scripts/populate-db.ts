import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

import axios from 'axios';
import { ulid } from 'ulidx';

import { PRISMA_CLIENT } from '../src/modules/shared/infraestructure/prisma/prisma-client';

interface ExternalRecord {
  items: Item[];
  next_page: string;
}

interface Item {
  ticker: string;
  target_from?: string;
  target_to?: string;
  company: string;
  action: string;
  brokerage: string;
  rating_from: string;
  rating_to: string;
  time: Date;
}

const FILE_PATH = path.join(__dirname, 'data.txt');

const fetchAndSaveData = async (): Promise<void> => {
  let hasData = true;
  let nextPage = '';

  const writeStream = fs.createWriteStream(FILE_PATH, { encoding: 'utf-8' });

  while (hasData) {
    try {
      const res = await axios.get<ExternalRecord>(
        `https://api.karenai.click/swechallenge/list`,
        {
          params: {
            ...(nextPage.length > 0 ? { next_page: nextPage } : {}),
          },
          headers: {
            Authorization: `Bearer ${process.env['API_TOKEN']}`,
          },
        }
      );

      const { items, next_page } = res.data;

      for (const item of items) {
        writeStream.write(JSON.stringify(item) + '\n');
      }

      console.log(`Registros escritos: ${items.length}`);

      nextPage = next_page;

      if (!nextPage || nextPage.length < 0) {
        hasData = false;
      }

      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.log(error);

      hasData = false;
    }
  }

  writeStream.end();

  console.log('Datos guardados en data.json');
};

const insertDataFromFile = async (): Promise<void> => {
  try {
    const fileStream = fs.createReadStream(FILE_PATH, 'utf-8');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const items: Item[] = [];

    for await (const line of rl) {
      const parsedLine = JSON.parse(line);

      items.push(parsedLine);
    }

    const MAX_CHUNK_SIZE = 30;

    for (let i = 0; i < items.length; i += MAX_CHUNK_SIZE) {
      const chunk = items.slice(i, i + MAX_CHUNK_SIZE);

      await PRISMA_CLIENT.stock.createMany({
        data: chunk.map(
          ({
            action,
            brokerage,
            company,
            rating_from,
            rating_to,
            target_from,
            target_to,
            ticker,
            time,
          }) => ({
            id: ulid(),
            ticker,
            company_name: company,
            brokerage,
            action,
            rating_from: rating_from,
            rating_to: rating_to,
            target_from:
              target_from && target_from.startsWith('$')
                ? parseFloat(target_from.replace('$', ''))
                : 0,
            target_to:
              target_to && target_to.startsWith('$')
                ? parseFloat(target_to.replace('$', ''))
                : 0,
            time: new Date(time),
          })
        ),
      });

      console.log(
        `Lote insertado: ${i + 1} - ${Math.min(i + MAX_CHUNK_SIZE, items.length)}`
      );
    }

    console.log('Datos insertados en db');
  } catch (error) {
    console.log('Error al insertar datos:', error);
  }
};

const main = async (): Promise<void> => {
  let existFile = fs.existsSync(FILE_PATH);

  if (!existFile) {
    console.log('El archivo no existe, se va a crear.');

    await fetchAndSaveData();
  }

  const dbCount = await PRISMA_CLIENT.stock.count();

  if (dbCount <= 0) {
    existFile = fs.existsSync(FILE_PATH);

    if (!existFile) {
      throw new Error('El archivo no existe, no se puede popular.');
    }

    console.log(
      'La bd está vacía, se comenzará a popular a partir del archivo.'
    );

    await insertDataFromFile();
  }

  console.log('Proceso ejecutado correctamente');

  process.exit(0);
};

void main();
