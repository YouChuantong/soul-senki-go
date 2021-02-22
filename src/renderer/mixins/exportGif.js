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
 * @FileName: exportGif.js
 * @ClassName exportGif
 * @Description: TODO
 *
 * @Version: V1.0
 * @Author: UpYou
 * @CreateTime: 2021-02-20 17:54
 */
import GIFEncoder from 'gifencoder'
import fs from 'fs'
import {createCanvas} from 'canvas'
import image from "./image";

export default {
	mixins: [image],
	methods: {
		/**
		 * 导出gif
		 * @param op 参数：delay,path,data,size
		 * @return {Promise<boolean>}
		 */
		async exportGifTo(op, progress) {
			const {data, path, delay, size} = op
			const encoder = new GIFEncoder(size.width, size.height)
			encoder.createReadStream().pipe(fs.createWriteStream(path));
			encoder.start();
			encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
			encoder.setDelay(delay || 80);  // frame delay in ms
			encoder.setQuality(10); // image quality. 10 is default.
			const canvas = createCanvas(size.width, size.height);
			const ctx = canvas.getContext('2d');

			let y = 0
			for (const datum of data) {
				ctx.drawImage(datum, 0, 0, size.width, size.height)
				encoder.addFrame(ctx);
				if (progress) {
					progress(y)
				}
				y++;
			}
			encoder.finish();
			return true
		}
	}
}
