const {app, BrowserWindow, Menu, Shell} = require('electron')

const mainProcess = require('./index')

const menu = []

module.exports = Menu.buildFromTemplate(menu)
