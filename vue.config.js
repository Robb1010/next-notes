module.exports = {
  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      externals: ['keytar'],
      //preload: 'src/preload.js',
      nodeIntegration: true,
      builderOptions: {
        appId: "com.electron.nextnotes",
        productName: "Next Notes",
        mac: {
          icon: "public/build/icon.icns"
        },
        win: {
          icon: "public/build/icon.ico"
        }
      }
    }
  }
}