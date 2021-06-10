module.exports = {
  pluginOptions: {
    electronBuilder: {
      externals: [
        'keytar'
      ],
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.electron.nextnotes',
        productName: 'Next Notes',
        mac: {
          icon: 'public/build/icon.icns'
        },
        win: {
          icon: 'public/build/icon.ico'
        }
      }
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
