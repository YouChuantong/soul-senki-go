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
 * @FileName: callThread.js
 * @ClassName callThread
 * @Description: TODO 呼叫线程
 *
 * @Version: V1.0
 * @Author: UpYou
 * @CreateTime: 2021-02-20 23:40
 */
import {ipcRenderer, remote} from 'electron'

export default {
	methods: {
		callExportGifThread(code) {
			return new Promise((resolve, reject) => {
				try {
					ipcRenderer.send('are-u-there-export-gif-thread-' + code);
					const listener = (event, arg) => {
						resolve(arg)
					}
					remote.ipcMain.once('export-gif-thread-exist-' + code, listener)
					// 无线程回应
					setTimeout(_ => {
						remote.ipcMain.removeListener('export-gif-thread-exist-' + code, listener)
						resolve(false)
					}, 500)
				} catch (e) {
					reject(e)
				}
			})
		},
		callPlayPageThread(code) {
			return new Promise((resolve, reject) => {
				try {
					ipcRenderer.send('call-exist-play-page-' + code);
					const listener = (event, arg) => {
						resolve(arg)
					}
					remote.ipcMain.once('exist-play-page-' + code, listener)
					// 无线程回应
					setTimeout(_ => {
						remote.ipcMain.removeListener('exist-play-page-' + code, listener)
						resolve(false)
					}, 500)
				} catch (e) {
					reject(e)
				}
			})
		}
	}
}
