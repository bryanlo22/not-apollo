function htmlDecode(str: string) {
	if (str == null) {
		return ''
	}
	return new DOMParser().parseFromString(str, 'text/html').documentElement.textContent || ''
}

export { htmlDecode }
