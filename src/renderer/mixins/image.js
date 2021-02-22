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
 * @FileName: image.js
 * @ClassName image
 * @Description: TODO
 *
 * @Version: V1.0
 * @Author: UpYou
 * @CreateTime: 2021-02-18 23:26
 */

export default {
	methods: {
		/**
		 * 获取一组图片
		 * @param max 起始位置
		 * @param url 图片路径
		 * @return {Promise<Image[]>} 一组图片信息
		 */
		imageGroup(url, max = 0) {
			return new Promise((resolve, reject) => {
				let index = max;
				const map = []
				const go = _ => {
					const src = url.replace('${index}', index)
					console.log(src)
					index++
					this.image(src).then(img => {
						map.push(img)
						go()
					}).catch(_ => resolve(map))
				}
				go(url)
			})
		},
		/**
		 * 获取图片
		 * @param url 图片路径
		 * @return {Promise}
		 */
		image(url) {
			return new Promise((resolve, reject) => {
				const image = new Image()
				image.crossOrigin = "Anonymous";
				image.src = url;
				image.onload = _ => {
					resolve(image)
				}
				image.onerror = reject
			})
		},
		/**
		 * 获取二维图片[[],[]]
		 * @param src 图片路径
		 * @return {Promise}
		 */
		images(src) {
			const map = []
			let count = 0;
			return new Promise(async (resolve, reject) => {
				try {
					while (true) {
						try {
							let url = src.replace('${style}', String(count))
							const img = await this.imageGroup(url, 1);
							if (img.length === 0) {
								break;
							}
							count++;
							map.push(img)
						} catch (e) {
							if (count === 0) {
								break;
							}
						}
					}
					resolve(map)
				} catch (e) {
					reject(e)
				}
			})
		},
		/**
		 * 获取单个头像
		 * @param name 角色实名
		 * @param index 第几个
		 * @return {Promise} 返回目标图片DOM
		 */
		async getHeaderImage(name, index = 1) {
			const src = this.$store.state.data.url.header
				.replace('${name}', name)
				.replace('${index}', String(index))
			return await this.image(src)
		},
		/**
		 * 获取头像路径
		 * @param name 角色实名
		 * @param index 第几个
		 * @return {Promise} 返回目标图片DOM
		 */
		getHeaderUrl(name, index = 1) {
			return this.$store.state.data.url.header
				.replace('${name}', name.split('_')[0])
				.replace('${index}', String(index))
		},
		/**
		 * 获取指定角色全部头像
		 * @param name 角色名称
		 * @return {Promise} 返回该角色全部头像
		 */
		async getHeaderImages(name) {
			const src = this.$store.state.data.url.header.replace('${name}', name);
			return await this.imageGroup(src, 1);
		},
		/**
		 * 获取指定角色全部表情
		 * @param name 角色名称
		 * @return {Promise} 返回该角色全部头像
		 */
		getFaceImages(name) {
			let src = this.$store.state.data.url.face.replace('${name}', name);
			return this.images(src)
		},
		/**
		 *
		 * 获取单个头像
		 * @param name
		 * @param style
		 * @param index
		 * @return {Promise<*>}	 返回目标图片DOM
		 */
		async getFaceImage(name, style = 0, index = 1) {
			const src = this.$store.state.data.face.header.replace('${name}', name)
				.replace('${style}', String(style))
				.replace('${index}', String(index))
			return await this.image(src)
		},
		/**
		 * 获取指定角色身体
		 * @param name 角色名称
		 * @param index
		 * @return {Promise<*>}
		 */
		async getBodyImage(name, index = 0) {
			const src = this.$store.state.data.face.body.replace('${name}', name)
				.replace('${index}', String(index))
			return await this.image(src)
		},
		/**
		 * 获取指定角色身体
		 * @param name 角色名称
		 * @param index
		 * @return {Promise<*>}
		 */
		getBodyImages(name, index = 0) {
			const src = this.$store.state.data.url.body.replace('${name}', name)
			return this.images(src)
		},
		/**
		 * 取指定角色指定爆依图片
		 * @param name 角色名称
		 * @param style 服饰 0 -2
		 * @param index 破损 1 - 4
		 * @return {Promise}
		 */
		getBaoyiImage(name, style = 0, index = 1) {
			const src = this.$store.state.data.url.baoyi.replace('${name}', name)
				.replace('${style}', String(style))
				.replace('${index}', String(index))
			return this.image(src)
		},
		/**
		 * 取指定角色指定服饰的全部爆依图片
		 * @param name 角色名称
		 * @param style 服饰 0 -2
		 * @return {Promise}
		 */
		getBaoyiImageAll(name, style = 0) {
			const src = this.$store.state.data.url.baoyi.replace('${name}', name)
				.replace('${style}', String(style))
			return this.imageGroup(src, 1)
		},
		/**
		 * 取指定角色全部爆依图片
		 * @param name 角色名称
		 * @return {Promise}
		 */
		getBaoyiImages(name) {
			const src = this.$store.state.data.url.baoyi.replace('${name}', name)
			return this.images(src)
		},
		/**
		 * 指定角色性爱场景
		 * @param id 角色id
		 * @param step 场景
		 * @param index 索引
		 * @return {Promise}
		 */
		getFuckingImage(id, hindex, step = 'idle', index = 1) {
			const src = this.$store.state.data.url.fuck
				.replace('${index}', String(index))
				.replace('${step}', step)
				.replace(/\${hindex}/g, hindex)
				.replace(/\${id}/g, id)

			return this.image(src)
		},
		/**
		 * 指定角色全部性爱场景
		 * @param id {number} 角色id
		 * @param index {number} 回顾场景
		 */
		async getFuckingImageAll(id, index = 1) {
			return this.getFuckingImageDiy(id, index)
		},
		/**
		 * 指定角色全部性爱场景
		 * @param id {number} 角色id
		 * @param index {number} 回顾场景
		 * @param i {number} idle 次数
		 * @param h {number} hard 次数
		 * @param c {number} continue 次数
		 * @param e {end} 次数
		 */
		async getFuckingImageDiy(id, index = 1, i = 6, h = 12, c = 1, e = 10) {
			try {
				let map = []
				const url = this.$store.state.data.url.fuck
					.replace(/\${id}/g, String(id))
					.replace(/\${hindex}/g, String(index))
				const idleUrl = url.replace('${step}', 'idle');
				const hardUrl = url.replace('${step}', 'hard');
				const continueUrl = url.replace('${step}', 'continue');
				const endUrl = url.replace('${step}', 'end');
				const urls = [
					{url: idleUrl, count: i},
					{url: hardUrl, count: h},
					{url: continueUrl, count: c},
					{url: endUrl, count: e}
				]
				for (let i = 0; i < urls.length; i++) {
					for (let j = 0; j <= urls[i].count; j++) {
						const group = await this.imageGroup(urls[i].url, 1)
						if (group.length > 1) {
							group.pop()
							map = map.concat(group)
						}
					}
				}
				// console.log(map.map(_=>{
				// 	return _.src
				// }))
				return map
			} catch (e) {
				return []
			}
		},
		/**
		 * 获取回顾封面图片
		 * @param id 角色id
		 * @return {Promise<Image[]>}
		 */
		getRecapCover(id) {
			const url = this.$store.state.data.url.recapCover.replace('${id}', String(id))
			return this.imageGroup(url, 1)
		}
	}
}

