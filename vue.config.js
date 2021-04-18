module.exports = {
  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      externals: ['keytar'],
      //preload: 'src/preload.js',
      nodeIntegration: true
    }
  }
}