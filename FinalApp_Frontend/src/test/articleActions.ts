import {resource, url} from './testResource'

export function getArticles() {
	return (dispatch) => {
		return resource('GET', 'articles', '')
		.then((response) => {
			dispatch({type:"Articles", articles: response.articles.reduce((object,item) => {
				object[item._id] = item;
				return object;
			},{})});
		})
	}	
}

export function getArticle(keyword){
	return (dispatch) => {
		return resource('GET', 'articles/'+ keyword, '')
		.then((response) => {
			dispatch({type:"Articles", articles: response.articles.reduce((object,item) => {
				object[item._id] = item;
				return object;
			},{}).filter((item) =>{
				return item.author.toLowerCase().includes(keyword) || item.text.toLowerCase().includes(keyword);
			})
			});
		})
	}
}

export function searchKeyword(keyword){
	return {type:"search", keyword};
}