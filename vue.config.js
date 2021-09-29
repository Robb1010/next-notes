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
        icon: 'public/assets/icon.png',
        mac: {
          icon: 'public/assets/icon.icns'
        },
        win: {
          icon: 'public/assets/icon.ico'
        }
      }
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
