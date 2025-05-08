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
                default: 'system-ui, sans-serif'
                // secondary: ['ABCDiatype', 'sans-serif'],
            },
            spacing: {
                '21': '5.25rem',
                '25': '6.25rem',
                '30': '7.5rem',
            },
            // Typography styles
            fontSize: {
                'h1': ['1.375rem', {
                    lineHeight: '1',
                    letterSpacing: '5%',
                    fontWeight: '700',
                }],
                'h2': ['0.875rem', {
                    lineHeight: '1',
                    letterSpacing: '2%',
                    fontWeight: '700',
                }],
                'h3-upper-bold': ['1.375rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '4%',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                }],
                'h3-upper-light': ['1.375rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '4%',
                    fontWeight: '300',
                    textTransform: 'uppercase',
                }],
                'h3-lower-bold': ['1.375rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '1%',
                    fontWeight: '700',
                }],
                'h3-lower-light': ['1.375rem', {
                    lineHeight: '1.09090909',
                    letterSpacing: '1%',
                    fontWeight: '300',
                }],
                'a1-bold': ['1rem', {
                    lineHeight: '1.375',
                    letterSpacing: '3%',
                    fontWeight: '700',
                }],
                'a1-light': ['1rem', {
                    lineHeight: '1.375',
                    letterSpacing: '4%',
                    fontWeight: '300',
                }],
                'p1': ['0.875rem', {
                    lineHeight: '1.35714286',
                    letterSpacing: '1%',
                }],
                'p2': ['0.75rem', {
                    lineHeight: '1.41666667',
                    letterSpacing: '1%',
                }],
                'p2-upper': ['0.75rem', {
                    lineHeight: '1',
                    letterSpacing: '5%',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                }],
                'a2': ['0.75rem', {
                    lineHeight: '1.16666667',
                    letterSpacing: '5%',
                }],
                'a2-bold': ['0.75rem', {
                    lineHeight: '1.16666667',
                    letterSpacing: '1%',
                    fontWeight: '700',
                }],
            },
            fontWeight: {
                light: '300',
                medium: '500',
                bold: '700',
            },
            letterSpacing: {
                '1': '1%',
                '2': '2%',
                '3': '3%',
                '4': '4%',
                '5': '5%',
            },
        },
        container: {
            center: true,      
            // default breakpoints but with 40px removed
            screens: {
              md: '640px',
            },
        },
        colors: {
            white: '#ffffff',
            black: '#000000',
            blue: '#0000ff',
            gray: '#f8f8f8',
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
}
