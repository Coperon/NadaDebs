module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                // use font family here. Default is for the main font of the site, secondary usually for headings or other featured elements
                default: 'helvetica-neue-lt-pro, sans-serif'
                // secondary: ['ABCDiatype', 'sans-serif'],
            },
            spacing: {
                '21': '5.25rem',
                '25': '6.25rem',
                '30': '7.5rem',
            },
            colors: {
                black: '#151515',
                sand: '#E0DCD6',
                beige: '#F1EAE4',
                'primary-button': '#F8EFD7',
                grey: '#A1A1A1'
            },
            // Typography styles
            fontSize: {
                'h1': ['1.375rem', {
                    lineHeight: '1',
                    letterSpacing: '0.05em',
                    fontWeight: '700',
                }],
                'h1-mobile': ['1.125rem', {
                    lineHeight: '1',
                    letterSpacing: '0.05em',
                    fontWeight: '700',
                }],
                'h2': ['0.875rem', {
                    lineHeight: '1.35714286',
                    letterSpacing: '0.02em',
                    fontWeight: '700',
                }],
                'h3-upper': ['1.375rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '0.04em',
                }],
                'h3-upper-mobile': ['1.125rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '0.04em',
                }],
                'h3-lower': ['1.375rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '0.01em',
                }],
                'h3-lower-mobile': ['1.125rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '0.01em',
                }],
                'a1-bold': ['1rem', {
                    lineHeight: '1.375',
                    letterSpacing: '0.03em',
                    fontWeight: '700',
                }],
                'a1-light': ['1rem', {
                    lineHeight: '1.375',
                    letterSpacing: '0.04em',
                    fontWeight: '300',
                }],
                'p1': ['0.875rem', {
                    lineHeight: '1.35714286',
                    letterSpacing: '0.01em',
                }],
                'p2': ['0.75rem', {
                    lineHeight: '1.41666667',
                    letterSpacing: '0.01em',
                }],
                'p2-upper': ['0.75rem', {
                    lineHeight: '1',
                    letterSpacing: '0.05em',
                    fontWeight: '700',
                }],
                'a2': ['0.75rem', {
                    lineHeight: '1.16666667',
                    letterSpacing: '0.05em',
                }],
                'a2-bold': ['0.75rem', {
                    lineHeight: '1.16666667',
                    letterSpacing: '0.01em',
                    fontWeight: '700',
                }],
            },
        },
        container: {
            center: true,      
            // default breakpoints but with 40px removed
            screens: {
              md: '640px',
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
}
