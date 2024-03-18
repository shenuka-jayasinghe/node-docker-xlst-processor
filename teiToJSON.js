const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs/promises");
const path = require("path");

async function processDataWithDocker(
  teiDirectory,
  isSudoDocker,
  xsltDirectory = ""
) {
  const sudoDockerString = isSudoDocker ? "sudo docker" : "docker";
  // to manually shell into docker container, run:
  // sudo docker run -it --rm cudl-xslt:0.0.5

  try {
    // Create a symbolic link to the data directory
    const { stdout: linkOutput } = await exec(`ln -s ${teiDirectory} data`);
    console.log("Symbolic link created for data directory:", linkOutput.trim());

    if (xsltDirectory === "") {
      //No XSLT directory specified
      // Run the ant build command inside the Docker container with local volume mount
      const { stdout: antOutput } = await exec(
        `${sudoDockerString} run --rm -v ${__dirname}/data:/opt/data -v ${__dirname}/json:/opt/json shenukacj/cudl-xslt:0.0.5 ant -buildfile ./bin/build.xml "json"`
      );
      console.log("Ant command executed:", antOutput.trim());

      // Remove the data directory
      const { stdout: removeOutput } = await exec("rm -r data");
      console.log("Data directory removed:", removeOutput.trim());

    } else {
      // else volume mount to the xslt directory as well
      const { stdout: linkOutput } = await exec(`ln -s ${xsltDirectory} xslt`);
      console.log(
        "Symbolic link created for xslt directory:",
        linkOutput.trim()
      );
      const { stdout: antOutput } = await exec(
        `${sudoDockerString} run --rm -v ${__dirname}/data:/opt/data -v ${__dirname}/json:/opt/json -v ${__dirname}/xslt:/opt/xslt shenukacj/cudl-xslt:0.0.5 ant -buildfile ./bin/build.xml "json"`
      );
      console.log("Ant command executed:", antOutput.trim());

      // Remove the data and xslt directory
      const { stdout: removeOutput } = await exec("rm -r data && rm -r xslt");
      console.log("Data directory removed:", removeOutput.trim());
    }

    // Read and parse JSON files
    const jsonDir = path.join(__dirname, "json");
    console.log("JSON directory:", jsonDir);
    const files = await fs.readdir(jsonDir);

    const jsonData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(jsonDir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
          const dirFiles = await fs.readdir(filePath);
          if (dirFiles.some((dirFile) => dirFile.endsWith(".json"))) {
            return readJsonFiles(
              path.join(
                filePath,
                dirFiles.find((dirFile) => dirFile.endsWith(".json"))
              )
            );
          }
        } else if (file.endsWith(".json")) {
          return readJsonFiles(filePath);
        }
      })
    );

    // Filter out undefined values (directories without .json files)
    return jsonData.filter((data) => data);
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
}

async function readJsonFiles(filePath) {
  try {
    const jsonData = await fs.readFile(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    return null;
  }
}

// Example usage
// processDataWithDocker("./example-data-directory", true)
//   .then((jsonData) => {
//     console.log("JSON data:", jsonData);
//   })
//   .catch((err) => {
//     console.error("Error:", err);
//   });

// Example data with XSLT directory added
processDataWithDocker('./example-data-directory', true,  './example-xslt-directory')
    .then((jsonData) => {
        console.log('process with XSLT directory input')
        console.log('JSON data:', jsonData);
    })
    .catch((err) => {
        console.error('Error:', err);
    });
