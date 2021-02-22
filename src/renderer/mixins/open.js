'use strict'

/**
 *
 *   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
 *  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
 *  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 *  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 *           ░     ░ ░      ░  ░
 *
 * Copyright Copyright 2020 UpYou.
 * @FileName: open.js
 * @ClassName open
 * @Description: TODO
 *
 * @Version: V1.0
 * @Author: UpYou
 * @CreateTime: 2021-02-19 02:28
 */
import {app, BrowserWindow, remote, ipcRenderer} from 'electron'
import path from 'path'
import callThread from "./callThread";

const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080/#`
	: `file://${__dirname}/#`
export default {
	mixins: [callThread],
	methods: {

		openGifWin(title, data) {
			this.callPlayPageThread(data.id).then(exist => {
				if (!exist) {
					const gifWin = new remote.BrowserWindow({
						minWidth: 814,
						minHeight: 563,
						show: true,
						title
					})
					gifWin.webContents.closeDevTools()
					gifWin.loadURL(`${winURL}/playGif`)
					remote.ipcMain.once('play-gif-page-loaded', () => {
						ipcRenderer.send('play-gif-in-play-page', data);
					})
					return;
				}
				ipcRenderer.send('show-play-page-' + data.id, data);
			})
		},
		openPreview(parent) {
			// remote.BrowserWindow()
			console.log(parent);
			let newwin = new remote.BrowserWindow({
				width: 600,
				modal: true,
				height: 400,
				opacity: 0.4,
				parent: parent, //win是主窗口
			})
			console.log(newwin)
			newwin.loadURL(`${winURL}/preview`); //new.html是新开窗口的渲染进程
			// newwin.on('closed', () => {
			// 	newwin = null
			// })
		}
	}
}
