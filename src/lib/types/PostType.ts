type PostType = {
	kind: string
	data: {
		id: string
		score: number
		title: string
		selftext_html: string
		permalink: string
		url: string
		media: {
			type: string
			reddit_video?: {
				fallback_url: string
			}
		}
		media_embed: {
			content: string
		}
		post_hint: string
		num_comments: number
		subreddit: string
		link_flair_background_color: string
		link_flair_text: string
		distinguished: string
		media_metadata: {
			[key: string]: {
				status: string
				s: {
					u: string
				}
			}
		}
	}
}

export type { PostType }
