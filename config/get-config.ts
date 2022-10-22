import { ecr } from './ecr';
import fs from 'node:fs/promises';

export const getConfig = async () => {
  // write the file to the base directory as ecr.json
  try {
    const config = ecr(process);
    const configString = JSON.stringify(config, null, 2);
    await fs.writeFile('ecr.json', configString);
  } catch (error) {
    console.log(error, 'WRITING CONFIG FILES');
  }
};
