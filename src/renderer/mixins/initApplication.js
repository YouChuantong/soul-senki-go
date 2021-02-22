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
 * @FileName: initApplication.js
 * @ClassName initApplication
 * @Description: TODO 初始化程序数据
 *
 * @Version: V1.0
 * @Author: UpYou
 * @CreateTime: 2021-02-18 22:20
 */

export default {
	methods: {
		/**
		 * 加载配置文件
		 * @return {*} complete configuration
		 */
		loadConfig() {
			return new Promise((resolve, reject) => {
				this.$http.get('/2021-02-08-1828/res/config/configJson.json.string')
					.then(res => resolve(res.data))
					.catch(reject)
			})
		},
		/**
		 * 过滤配置文件，只提取"英雄"配置
		 * @param config 一个通过loadConfig得到的配置文件
		 * @return {Object} 可用的配置文件
		 */
		filterConfig(config) {
			return new Promise((resolve, reject) => {
				try{
					const {HeroResource, Keystring} = config
					const flag = 80000;
					const set = []
					// 提取女角色，id大于8w是小怪物，7w是角色
					for (const iterator of HeroResource) {
						if (iterator.id >= flag) break;
						for (const keys of Keystring) {
							if (keys.id === 'Hero_charname_' + (iterator.id - 60000)) {
								iterator['keystring'] = keys;
								break;
							}
						}
						set.push(iterator)
					}
					resolve(set)
				} catch (e) {
					reject(e)
				}
			})
		},
		/**
		 * 获取可用的配置文件
		 */
		simpleConf() {
			return new Promise(async (resolve, reject) => {
				try {
					const completeConfig = await this.loadConfig();
					const simple = await this.filterConfig(completeConfig);
					resolve(simple)
				} catch (e) {
					reject(e);
				}
			})
		}
	}
}
