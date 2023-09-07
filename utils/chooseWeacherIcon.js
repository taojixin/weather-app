function chooseWeatherIcon(weather) {
	let weacherIcon;
	switch (weather) {
		case '晴':
			weacherIcon = '&#xe629;'
			break;
		case '阴':
			weacherIcon = '&#xe62f;'
			break;
		case '多云':
			weacherIcon = '&#xe628;'
			break;
		case '小雨':
			weacherIcon = '&#xe62a;'
			break;
		case '中雨':
			weacherIcon = '&#xe62e;'
			break;
		case '大雨':
			weacherIcon = '&#xe62b;'
			break;
		case '暴雨':
			weacherIcon = '&#xe62d;'
			break;
		case '晴间多云':
			weacherIcon = '&#xe62c;'
			break;
		case '雷阵雨':
			weacherIcon = '&#xe631;'
			break;
		case '阵雨':
			weacherIcon = '&#xe631;'
			break;
		case '少云':
			weacherIcon = '&#xe630;'
			break;
	}
	return '<span class="iconfont">' + weacherIcon + '</span>'
}

export {
	chooseWeatherIcon
}