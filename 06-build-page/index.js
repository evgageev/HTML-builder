const path = require('path');
const fs = require('fs');
const outputFolder = path.join(__dirname, 'project-dist');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');
const inputAssets = path.join(__dirname, 'assets');
const outputAssets = path.join(outputFolder, 'assets');
const inputStyles = path.join(__dirname, 'styles');

const createFolder = async (folder) => {
  fs.promises.mkdir(folder, { recursive: true });
  console.log(`Создана папка ${folder}`);
};

const deleteFolder = async (folder) => {
  try {
    await fs.promises.rm(folder, { recursive: true });
  } catch (err) {
    console.log('Папка "project-dist" не найдена, удаление не требуется');
  }
};

const readFolder = async (folder) => {
  const files = await fs.promises.readdir(folder, {
    withFileTypes: true
  });
  return files;
};

const copyFiles = async (files, inputFolder, outputFolder) => {
  for (let file of files) {
    const inputFile = path.join(inputFolder, file.name);
    const outputFile = path.join(outputFolder, file.name);
    if (file.isFile()) {
      await fs.promises.copyFile(inputFile, outputFile);
    } else {
      await copyDirectory(inputFile, outputFile);
    }
  }
};

const copyDirectory = async (input, output) => {
  try {
    await createFolder(output);
    const folderData = await readFolder(input);
    await copyFiles(folderData, input, output);
  } catch (err) {
    throw new Error(err);
  }
};

const buildTemplate = async (template, outputFolder) => {
  let templateHtml = await fs.promises.readFile(template, 'utf8');
  const matches = templateHtml.matchAll(/{{(.*?)}}/g);

  for (let match of matches) {
    const componentName = match[1];
    let componentFile = path.join(components, `${componentName}.html`);
    const componentHTML = await fs.promises.readFile(componentFile, 'utf8');

    templateHtml = templateHtml.replace(match[0], componentHTML);
  }

  await fs.promises.writeFile(
    path.join(outputFolder, 'index.html'),
    templateHtml,
    'utf-8'
  );
};

const buildCss = async () => {
  const output = fs.createWriteStream(path.join(outputFolder, 'style.css'));
  output.setMaxListeners(15);
  const files = await fs.promises.readdir(inputStyles, {
    withFileTypes: true
  });

  for await (const file of files) {
    const filePath = path.join(inputStyles, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
      const input = fs.createReadStream(filePath);
      input.pipe(output);
    }
  }
};

const buildHtml = async () => {
  await deleteFolder(outputFolder);
  await createFolder(outputFolder);
  await copyDirectory(inputAssets, outputAssets);
  await buildTemplate(template, outputFolder);
  await buildCss();
};

buildHtml();
