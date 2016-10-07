module.exports = {
  client: {
    files: [
      {
        flatten: true,
        expand: true,
        cwd: 'lib',
        src: "client/*",
        dest: "dist/client"
      },
    ]
  }
};
