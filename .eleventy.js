module.exports = function(config) {

  config.addPassthroughCopy("src/script.js");
  return  {
    dir: {
      input: "src",
      output: "dist",
      data: "data"
    }
  };

};