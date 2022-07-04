// read the file CAWAPR-01-Input.json

const jsonData = require("./CAWAPR-01-Input.json");

// assigning priorities to folders
const priority = {
  "V:/data/shot/": 3,
  "V:/data/IO/": 2,
  "V:/data/editorial/": 1,
};
const output = {};

for (let collection in jsonData) {
  output[collection] = {};
  let files = jsonData[collection].files;
  output[collection].files = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let path = file.path;
    let id = file.id;

    let pre =
      path.split("/")[0] +
      "/" +
      path.split("/")[1] +
      "/" +
      path.split("/")[2] +
      "/";
    let post = path.replace(pre, "");

    // LOGIC
    // Splitting the path into pre and post where :
    // eg for pre = V:/data/shot/
    // eg for post = 0010_0120/0010_0120_anim_v001.####.jpg

    // if output[collection].files has a file with the same "post", then replace it with the new one if the priority is higher of the current "pre" variable
    let found = false;
    for (let j = 0; j < output[collection].files.length; j++) {
      if (output[collection].files[j].post === post) {
        if (priority[pre] >= priority[output[collection].files[j].pre]) {
          output[collection].files[j] = {
            path: path,
            pre: pre,
            post: post,
            id: id,
            priority: priority[pre],
          };
        }
        found = true;
        break;
      }
    }
    if (!found) {
      output[collection].files.push({
        path: path,
        pre: pre,
        post: post,
        id: id,
        priority: priority[pre],
      });
    }
  }
}
// in files array of each collection, removing the pre,post and priority attribute to get the output json file in the desired format
for (let collection in output) {
  for (let i = 0; i < output[collection].files.length; i++) {
    delete output[collection].files[i].pre;
    delete output[collection].files[i].post;
    delete output[collection].files[i].priority;
  }
}

// exporting the output as a output.json file
const exportFile = require("fs");
exportFile.writeFileSync("./output.json", JSON.stringify(output, undefined, 4));
console.log("done");
