<template></template>
<script setup>
import useCookieConsent from '~/composables/cookieConsent'
const props = defineProps({
    cookiesPolicyLink: {
        type: String,
        required: true,
    },
    enableConfigBanner: {
        type: Boolean,
        default: false,
    },
})
const cookieConsent = useCookieConsent()

function showCookieConsent() {
    /**
     * All config. options available here:
     * https://cookieconsent.orestbida.com/reference/configuration-reference.html
     */
    /**
     * All config. options available here:
     * https://cookieconsent.orestbida.com/reference/configuration-reference.html
     */
    cookieConsent.run({
        autoclear_cookies: true,
        page_scripts: true,
        categories: {
            necessary: {
                readOnly: true,
                enabled: true,
            },
            analytics: {
                autoClear: {
                    cookies: [
                        {
                            name: /^(_ga|_gid)/,
                        },
                    ],
                },
            },
            ads: {},
        },
        // root: 'body',
        // autoShow: true,
        // disablePageInteraction: true,
        // hideFromBots: true,
        // mode: 'opt-in',
        // revision: 0,

        cookie: {
            name: 'cc_cookie',
            // domain: location.hostname,
            // path: '/',
            // sameSite: "Lax",
            // expiresAfterDays: 365,
        },

        // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
        guiOptions: {
            consentModal: {
                layout: 'cloud inline',
                position: 'bottom center',
                equalWeightButtons: true,
                flipButtons: false,
            },
            preferencesModal: {
                layout: 'box',
                equalWeightButtons: true,
                flipButtons: false,
            },
        },

        onFirstConsent: ({ cookie }) => {
            // console.log('onFirstConsent fired', cookie)
        },

        onConsent: ({ cookie }) => {
            // console.log('onConsent fired!', cookie)
        },

        onChange: ({ changedCategories, changedServices }) => {
            // console.log('onChange fired!', changedCategories, changedServices)
        },

        onModalReady: ({ modalName }) => {
            // console.log('ready:', modalName)
        },

        onModalShow: ({ modalName }) => {
            // console.log('visible:', modalName)
        },

        onModalHide: ({ modalName }) => {
            // console.log('hidden:', modalName)
        },

        categories: {
            necessary: {
                enabled: true, // this category is enabled by default
                readOnly: true, // this category cannot be disabled
            },
            analytics: {
                autoClear: {
                    cookies: [
                        {
                            name: /^_ga/, // regex: match all cookies starting with '_ga'
                        },
                        {
                            name: '_gid', // string: exact cookie name
                        },
                    ],
                },

                // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
                services: {
                    ga: {
                        label: 'Google Analytics',
                        onAccept: () => {},
                        onReject: () => {},
                    },
                    // youtube: {
                    //     label: 'Youtube Embed',
                    //     onAccept: () => {},
                    //     onReject: () => {},
                    // },
                },
            },
            ads: {},
        },

        language: {
            default: 'en',
            translations: {
                en: {
                    consentModal: {
                        title: false,
                        description:
                            `<div class="cc-message-wrapper">This website uses its own and third-party cookies necessary for its operation and to analyze your browsing habits. For more information, please access our <a class="c-bn" target="_blank" href="${
                                props.cookiesPolicyLink
                                    ? props.cookiesPolicyLink
                                    : ''
                            }">Cookie Policy</a>` +
                            (props.enableConfigBanner
                                ? ` or visit <a class="underline" type="button" data-cc="show-preferencesModal">Cookie Settings</a> to provide a controlled consent. `
                                : `. `) +
                            `To accept all cookies click Accept All. To reject all click on Reject All.</div>`,
                        acceptAllBtn: 'Accept all',
                        acceptNecessaryBtn: 'Reject all',
                        showPreferencesBtn: false,
                        // closeIconLabel: 'Reject all and close modal',
                        //         footer: `
                        //     <a href="#path-to-impressum.html" target="_blank">Impressum</a>
                        //     <a href="#path-to-privacy-policy.html" target="_blank">Privacy Policy</a>
                        // `,
                    },
                    preferencesModal: {
                        title: 'Manage cookie preferences',
                        acceptAllBtn: 'Accept all',
                        acceptNecessaryBtn: 'Reject all',
                        savePreferencesBtn: 'Accept current selection',
                        closeIconLabel: 'Close modal',
                        serviceCounterLabel: 'Service|Services',
                        sections: [
                            {
                                title: 'Your Privacy Choices',
                                description: `In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link. To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject all” button and confirm you want to save your choices.`,
                            },
                            {
                                title: 'Strictly Necessary',
                                description:
                                    'These cookies are essential for the proper functioning of the website and cannot be disabled.',

                                //this field will generate a toggle linked to the 'necessary' category
                                linkedCategory: 'necessary',
                            },
                            {
                                title: 'Performance and Analytics',
                                description:
                                    'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                                linkedCategory: 'analytics',
                                cookieTable: {
                                    caption: 'Cookie table',
                                    headers: {
                                        name: 'Cookie',
                                        domain: 'Domain',
                                        desc: 'Description',
                                    },
                                    body: [
                                        {
                                            name: '_ga',
                                            domain: location.hostname,
                                            desc: 'Description 1',
                                        },
                                        {
                                            name: '_gid',
                                            domain: location.hostname,
                                            desc: 'Description 2',
                                        },
                                    ],
                                },
                            },
                            {
                                title: 'Targeting and Advertising',
                                description:
                                    'These cookies are used to make advertising messages more relevant to you and your interests. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.',
                                linkedCategory: 'ads',
                            },
                            {
                                title: 'More information',
                                description:
                                    'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>',
                            },
                        ],
                    },
                },
            },
        },
    })
}
onMounted(() => {
    showCookieConsent()
})
</script>

<style>
/* TODO: refactor banner to improve styles management (we are mixing two versions of the plugin) */
/* cookie banner */

body #cc-main {
    --cc-font-family: inherit;
    --cc-modal-border-radius: 0;
    --cc-btn-border-radius: 0;
    --cc-modal-transition-duration: 0.1s;
    --cc-modal-margin: 0;
    --cc-z-index: 2147483647;
}


body #cc-main .cm__texts {
    @apply w-full max-w-[1280px] p-0;
}

body #cc-main .cc--anim .cm {
    @apply max-w-none m-0 rounded-none p-0 bg-white text-black left-0 bottom-0 shadow-none scale-100 text-[100%];
}

body #cc-main .cm,
body .show--consent #cc-main .cc--anim .cm {
    @apply translate-y-0;
}

body #cc-main .cm .cc-message-wrapper {
    @apply block leading-normal text-black;
}

body #cc-main .cm button,
body #cc-main .cm button:visited,
body #cc-main .cm button:hover,
body #cc-main .cm a,
body #cc-main .cm a:visited,
body #cc-main .cm a:hover {
    @apply text-black bg-[transparent] border-black border-none rounded-none font-normal p-0 font-default text-[14px] transition-none hover:bg-none;
}

body #cc-main .pm__service-icon {
    @apply hidden;
}

body #cc-main .pm__section-services,
body #cc-main .pm__service {
    @apply py-[0.5em];
}

body #cc-main {
    --cc-modal-margin: 0;
    @apply m-0;
}

body #cc-main .cm a,
body #cc-main .cm [data-cc='c-settings'] {
    @apply underline inline;
}

/* body #cm__desc {
    @apply flex flex-col lg:flex-row lg:justify-between gap-[16px] lg:gap-y-0 p-[16px];
} */
#cc-main .cm--cloud .cm__body {
    @apply !p-[16px] gap-[16px];
    border-top: 1px solid #000;
}

body #cc-main .cm--cloud .cm__desc {
    @apply max-h-none !p-0;
}

body #cc-main .cm__btn-group {
    @apply flex !flex-row gap-x-[16px] items-start uppercase !justify-between;
}

body #cc-main .cm--cloud .cm__btns {
    @apply !border-none justify-start !px-0 !pt-0 !pb-0;
}

body #cc-main .cm-wrapper .cm__btn-group button {
    @apply flex items-center my-auto py-[10px] px-[20px] min-w-[124px] border border-black border-solid text-center justify-center rounded-full leading-none min-h-0 h-fit !m-auto;
}

body #cc-main .cm__btn-group button:hover {
    @apply text-white bg-black;
}
</style>
