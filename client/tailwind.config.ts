import type { Config } from 'tailwindcss'

// @ts-expect-error
const config: Config = {
	darkMode: 'media',
	corePlugins: {
		container: false,
		boxShadow: false
	},
	theme: {
		extend: {
			colors: {
				gray: {
					950: '#0d0d0d',
					900: '#1a1a1a',
					850: '#262626',
					800: '#333333',
					750: '#404040',
					700: '#4d4d4d',
					650: '#595959',
					600: '#666666',
					550: '#737373',
					500: '#808080',
					450: '#8c8c8c',
					400: '#999999',
					350: '#a6a6a6',
					300: '#b3b3b3',
					250: '#bfbfbf',
					200: '#cccccc',
					150: '#d9d9d9',
					100: '#e6e6e6',
					50:  '#f2f2f2'
				}
			},
		},
		fontFamily: {
			sans: 'Roboto, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
			mono: 'JetBrainsMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
		},
		screens: {
			'2xl': { 'max': '1535px' },
			'xl':  { 'max': '1279px' },
			'lg':  { 'max': '1023px' },
			'md':  { 'max': '767px' },
			'sm':  { 'max': '639px' },
		},
		fontSize: {
			'2xs':   ['0.5rem', '1'],
			'xs':    ['0.75rem', '1'],
			'sm':    ['0.875rem', '1'],
			'base':  ['1rem', '1'],
			'lg':    ['1.125rem', '1'],
			'xl':    ['1.25rem', '1'],
			'2xl':   ['1.5rem', '1'],
			'2.5xl': ['1.6575rem', '1'],
			'3xl':   ['1.875rem', '1'],
			'4xl':   ['2.25rem', '1'],
			'5xl':   ['3rem', '1'],
			'6xl':   ['3.75rem', '1'],
			'7xl':   ['4.5rem', '1'],
			'8xl':   ['6rem', '1'],
			'9xl':   ['8rem', '1']
		}
	}
}

export default config
