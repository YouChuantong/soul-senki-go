import axios from "axios"

/*
 * @Author: UpYou
 * @Date: 2021-02-08 17:00:10
 * @LastEditTime: 2021-02-16 21:20:43
 * @Description:
 *
 */

const state = {
	/**
	 * 全部角色数据
	 */
	heroList: [],
	url: {
		/*头像*/
		header: 'https://angel-s.alphagame.hk/common/hero/${name}_header_${index}.png',
		/*身体：每种角色衣服数不同*/
		body: 'https://angel-s.alphagame.hk/common/hero/lihui/${name}_lihui_cutin_${index}.png',
		/*爆衣，index：衣物破损程度？1开始，style：0开始*/
		baoyi: 'https://angel-s.alphagame.hk/common/hero/lihui/${name}_lihui_baoyi_${style}_${index}.png',
		/*脸：貌似是对应衣服种类，有多少种衣服有多少张，index：害羞？1开始，style：0开始*/
		face: 'https://angel-s.alphagame.hk/common/hero/lihui/${name}_lihui_cutin_${style}_face_${index}.png',
		/*性交场景，id：角色id，step：不同动画idle、hard、continue、end，index：不同动画帧,*/
		fuck: 'https://angel-s.alphagame.hk/common/event_clear/${id}0${hindex}/${id}0${hindex}-${step}_${index}.jpg',
		/*回顾封面*/
		recapCover: 'https://angel-s.alphagame.hk/common/event_clear/h_${id}_${index}.png'
	}
}
const mutations = {
	SET_HERO_LIST: function (state, payload) {
		state.heroList = payload
	}
}

const actions = {
	setHeroList(context, args) {
		context.commit('SET_HERO_LIST', args)
	}
}

export default {
	state,
	mutations,
	actions
}
