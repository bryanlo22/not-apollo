type CommentType = {
	data: {
		id: string
		author: string
		body_html: string
		permalink: string
		distinguished: string
		replies: {
			data: {
				children: CommentType[]
			}
		}
	}
}

export type { CommentType }
