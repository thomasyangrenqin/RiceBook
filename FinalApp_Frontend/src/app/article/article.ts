export class Article{
	_id: string;
	text: string;
	date: string;
	img: string;
	comments: Comment[];
	author: string;
}

export class Comment{
	_id: string;
	text: string;
	date: string;
	author: string;
}