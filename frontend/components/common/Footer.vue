<template>
    <footer class="px-4 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-12 xl:py-16">
        <div class="flex justify-center">
            <CommonFooterMailchimpSubscription />
        </div>

        <div class="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 sm:text-center">
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">News</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="/news/latest" class="lowercase">Latest</NuxtLink></li>
                    <li><NuxtLink to="" class="lowercase">Press</NuxtLink></li>
                    <li><NuxtLink to="" class="lowercase">Awards</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Connect</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="" class="lowercase">Find us</NuxtLink></li>
                    <li><NuxtLink to="" class="lowercase">Contact us</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Work with us</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="" class="lowercase">Open positions</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Trade</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="" class="lowercase">Make a request</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Info</h2>
                <ul class="flex flex-col gap-1.5">
                    <li><NuxtLink to="" class="lowercase">Shipping & Returns</NuxtLink></li>
                    <li><NuxtLink to="" class="lowercase">Terms & Conditions</NuxtLink></li>
                    <li><NuxtLink to="" class="lowercase">Privacy Policy</NuxtLink></li>
                </ul>
            </div>
            <div class="flex flex-col gap-3">
                <h2 class="text-a2 font-medium uppercase">Follow us</h2>
                <ul class="flex gap-2 sm:justify-center">
                    <li><a href="https://www.instagram.com/studionadadebs/" target="_blank">
                        <img src="/icons/instagram.svg" alt="Instagram" />
                    </a></li>
                    <li><a href="https://www.facebook.com/studionadadebs" target="_blank">
                        <img src="/icons/facebook.svg" alt="Facebook" />
                    </a></li>
                    <li><a href="https://www.linkedin.com/in/nadadebs/" target="_blank">
                        <img src="/icons/linkedin.svg" alt="LinkedIn" />
                    </a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>
