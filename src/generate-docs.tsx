/***
 * This script is adapted from the following url and transposed into typescript manually
 * 
 */
const path = require("path");
const fs = require("fs");
const reactDocs = require("react-docgen-typescript");
const options = {
    savePropValueAsString: true,
}
// const tsConfigParser = reactDocs.withCustomConfig("./tsconfig.json", {
//     savePropValueAsString: true,
//   });
const componentFolder = "./src/components/";

const componentJsonPath = "./src/docs/components/components.json";

let componentDataArray: Array<string>;


function pushComponent(component: string) {
    componentDataArray.push(component);
  }
function createComponentFile() {
    const componentJsonArray = JSON.stringify(componentDataArray, null, 2);
    fs.writeFile(componentJsonPath, componentJsonArray, "utf8", (err: string, data: string) => {
        if (err) {
        throw err;
        }
        console.log("Created component file");
    });
    }
    /**
     * Use React-Docgen-typescript to parse the loaded component
     * into JS object of props, comments
     *
     * @param {File} component
     * @param {String} filename
     */
function parseComponent(component: any, filename: string) {
    const componentInfo = reactDocs.parse(component);
    const splitIndex = filename.indexOf("/src/");
    const shortname = filename.substring(splitIndex + 4);
    componentInfo.filename = shortname;
    pushComponent(componentInfo);
}
/**
 * Loads a component file, then runs parsing callback
 * @param {String} file
 * @param {Promise} resolve
 */
function loadComponent(file: string, resolve: any) {
fs.readFile(file, (err: string, data: string) => {
    if (err) {
    throw err;
    }
    // Parse the component into JS object
    resolve(parseComponent(data, file));
});
}
  /**
   * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
   *
   * @see http://stackoverflow.com/a/5827895/4241030
   * @param {String} dir
   * @param {Function} done
   */
function filewalker(dir: string, done: any) {
    let results: Array<string> = [];
    fs.readdir(dir, async (err: string, list: any) => {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file: string){
        file = path.resolve(dir, file);
        fs.stat(file, async (err: string, stat: any) => {
            // If directory, execute a recursive call
            if (stat && stat.isDirectory()) {
            filewalker(file, (err: string, res: any) => {
                results = results.concat(res);
                if (!--pending) done(null, results);
            });
            } else {
            // Check if is a typescript file
            // And not a story or test
            if (
                file.endsWith(".js") &&
                !file.endsWith(".story.js") &&
                !file.endsWith(".test.tsx")
            ) {
                await new Promise(resolve => {
                loadComponent(file, resolve);
                });
                await results.push(file);
            }
            if (!--pending) done(null, results);
            }
        });
        });
    });
}
filewalker(componentFolder, (err: string, data: any) => {
    if (err) {
      throw err;
    }
    createComponentFile();
  });
export {filewalker as walker}