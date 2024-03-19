import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				},
				// Shelf Branding
				// primary | #8B3C22 
				shelf_primary: {
					50: "238 226 222", // #eee2de
					100: "232 216 211", // #e8d8d3
					200: "226 206 200", // #e2cec8
					300: "209 177 167", // #d1b1a7
					400: "174 119 100", // #ae7764
					500: "139 60 34", // #8B3C22
					600: "125 54 31", // #7d361f
					700: "104 45 26", // #682d1a
					800: "83 36 20", // #532414
					900: "68 29 17", // #441d11
				},
				// secondary | #EAE1C9 
				shelf_secondary: {
					50: "252 251 247", // #fcfbf7
					100: "251 249 244", // #fbf9f4
					200: "250 248 242", // #faf8f2
					300: "247 243 233", // #f7f3e9
					400: "240 234 217", // #f0ead9
					500: "234 225 201", // #EAE1C9
					600: "211 203 181", // #d3cbb5
					700: "176 169 151", // #b0a997
					800: "140 135 121", // #8c8779
					900: "115 110 98", // #736e62
				},
				// tertiary | #51BCBF 
				shelf_tertiary: {
					50: "229 245 245", // #e5f5f5
					100: "220 242 242", // #dcf2f2
					200: "212 238 239", // #d4eeef
					300: "185 228 229", // #b9e4e5
					400: "133 208 210", // #85d0d2
					500: "81 188 191", // #51BCBF
					600: "73 169 172", // #49a9ac
					700: "61 141 143", // #3d8d8f
					800: "49 113 115", // #317173
					900: "40 92 94", // #285c5e
				},
				// success | #0E935C
				shelf_success: { 
					50: "219 239 231", // #dbefe7
					100: "207 233 222", // #cfe9de
					200: "195 228 214", // #c3e4d6
					300: "159 212 190", // #9fd4be
					400: "86 179 141", // #56b38d
					500: "14 147 92", // #0E935C
					600: "13 132 83", // #0d8453
					700: "11 110 69", // #0b6e45
					800: "8 88 55", // #085837
					900: "7 72 45", // #07482d
				},
				// warning | #F3DC0C 
				shelf_warning: {
					50: "253 250 219", // #fdfadb
					100: "253 248 206", // #fdf8ce
					200: "252 246 194", // #fcf6c2
					300: "250 241 158", // #faf19e
					400: "247 231 85", // #f7e755
					500: "243 220 12", // #F3DC0C
					600: "219 198 11", // #dbc60b
					700: "182 165 9", // #b6a509
					800: "146 132 7", // #928407
					900: "119 108 6", // #776c06
				},
				// error | #F5480E 
				shelf_error: {
					50: "254 228 219", // #fee4db
					100: "253 218 207", // #fddacf
					200: "253 209 195", // #fdd1c3
					300: "251 182 159", // #fbb69f
					400: "248 127 86", // #f87f56
					500: "245 72 14", // #F5480E
					600: "221 65 13", // #dd410d
					700: "184 54 11", // #b8360b
					800: "147 43 8", // #932b08
					900: "120 35 7", // #782307
				},
				// surface | #FFE9E2 
				shelf_surface: {
					50: "255 252 251", // #fffcfb
					100: "255 251 249", // #fffbf9
					200: "255 250 248", // #fffaf8
					300: "255 246 243", // #fff6f3
					400: "255 240 235", // #fff0eb
					500: "255 233 226", // #FFE9E2
					600: "230 210 203", // #e6d2cb
					700: "191 175 170", // #bfafaa
					800: "153 140 136", // #998c88
					900: "125 114 111", // #7d726f
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			}
		}
	},
};

export default config;
