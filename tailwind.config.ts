import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
  	extend: {
  		screens: {
  			'xs': '475px',
  			'sm': '640px',
  			'md': '768px',
  			'lg': '1024px',
  			'xl': '1280px',
  			'2xl': '1536px',
  		},
		colors: {
  			celo: {
					bg: 'var(--celo-bg)',
					fg: 'var(--celo-fg)',
					muted: 'var(--celo-muted)',
					border: 'var(--celo-border)',
					yellow: 'var(--celo-yellow)',
					yweak: 'var(--celo-yellow-weak)',
					accent: 'var(--celo-accent)'
				},
				spook: {
					orange: 'var(--spook-orange)',
					violet: 'var(--spook-violet)',
					surface: 'var(--spook-surface)',
					green: 'var(--spook-green)',
					red: 'var(--spook-red)',
					blue: 'var(--spook-blue)'
				},
				// legacy direct tokens kept for compatibility
				celoLegacy: {
					yellow: '#F7FF58',
					yellowAlt: '#FFF96B',
					lime: '#D9FF3F',
					black: '#0A0A0A',
					white: '#FFFFFF',
					gray: {
						'100': '#F6F6F6',
						'200': '#ECECEC',
						'300': '#D9D9D9',
						'500': '#9A9A9A',
						'700': '#4A4A4A',
						'900': '#171717'
					}
				},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
		borderRadius: {
			xl: '1rem',
			'2xl': '1.25rem',
			'xl2': '1.25rem',
			'xl3': '1.75rem',
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
  		boxShadow: {
			soft: '0 10px 30px -12px rgba(0,0,0,0.15)',
			focus: '0 0 0 2px var(--celo-yellow)',
			'glow-orange': '0 0 20px rgba(255,107,0,0.4), 0 0 40px rgba(255,107,0,0.2)',
			'glow-violet': '0 0 20px rgba(184,115,255,0.4), 0 0 40px rgba(184,115,255,0.2)',
			'glow-orange-sm': '0 0 10px rgba(255,107,0,0.4)',
			'glow-violet-sm': '0 0 10px rgba(184,115,255,0.4)'
  		},
  		fontFamily: {
  			creepster: ['Creepster', 'cursive'],
  			display: 'var(--font-display)',
  			body: 'var(--font-body)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-10px)' }
  			},
  			glow: {
  				'0%': { opacity: '0.5' },
  				'100%': { opacity: '1' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'spin-slow': 'spin 3s linear infinite',
  			'float': 'float 3s ease-in-out infinite',
  			'glow': 'glow 2s ease-in-out infinite alternate'
  		}
  	}
  },
  plugins: [
    animate, 
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
};

export default config;



