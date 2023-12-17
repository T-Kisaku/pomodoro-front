<script lang="ts">
    import {page} from '$app/stores'
    import {goto} from '$app/navigation'
    import {
        PUBLIC_GOOGLE_LOGIN_URL,
        PUBLIC_HOTP_SEND_URL,
        PUBLIC_HOTP_VERIFY_URL
    } from '$env/static/public'
	import Icon from '@iconify/svelte';
    import { loading } from '$src/lib/stores/utils';
	import DigitInput from './DigitInput.svelte';

    let email: string = ''
    let digits: {ref: HTMLInputElement | null, value: number | null}[] = [
        {ref: null, value: null},
        {ref: null, value: null},
        {ref: null, value: null},
        {ref: null, value: null},
        {ref: null, value: null},
        {ref: null, value: null}
    ]
    $: queryEmail = $page.url.searchParams.get('email')
    $: token = digits.map(digit => digit.value).join('')
    $: if(queryEmail) email = queryEmail

    $: onClickSendHOTP = async () => {
        loading.set(true)
        const res = await fetch(PUBLIC_HOTP_SEND_URL,{
            body: JSON.stringify({email}),
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        })
        const data = await res.json()
        if(data.succeeded){
            console.log('fire')
            const query = new URLSearchParams()
            query.set('email', email)
            query.set('token', '')
            await goto(`${$page.url.pathname}?${query.toString()}`)
        }
        loading.set(false)
    }
    $: onClickVerifyHOTP = async () => {
        loading.set(true)
        if(token){
            const query = new URLSearchParams()
            query.set('email', email)
            query.set('token', token)
            await goto(`${PUBLIC_HOTP_VERIFY_URL}?${query.toString()}`)
        }
        loading.set(false)
    }

    // Focus next you inputed
    $: digits.find(digit => digit.value === null)?.ref?.focus()

</script>

{#if queryEmail === null || queryEmail === ''}
    <div class="hero min-h-screen bg-base-200">
        <div class="hero-content">
            <div class="flex flex-col items-center">
                <div class="card shrink-0 w-80 shadow-2xl bg-base-100">
                    <div class="card-body">
                        <input type="email" placeholder="Email" class="input input-bordered" required bind:value={email} />
                        <div class="form-control mt-6">
                            <button class="btn btn-primary" on:click={onClickSendHOTP}>
                                Login
                            </button>
                        </div>
                        <div class="divider">OR</div>
                        <div class="form-control">
                            <a href={PUBLIC_GOOGLE_LOGIN_URL} class="btn btn-outline">
                                <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
                                <span>Login with Google</span>
                            </a>
                        </div>
                    </div>
                </div>
                <a href="/" class="mt-10 btn btn-outline w-32">
                    <Icon icon="mdi:arrow-left" class="text-xl" />
                    Go to top
                </a>
            </div>
        </div>
    </div>
{:else}
    <div class="hero min-h-screen bg-base-200">
        <div class="flex flex-col items-center gap-5">
            <div class="hero-content">
                {#each digits as _, i}
                    <DigitInput
                        bind:ref={digits[i].ref}
                        bind:value={digits[i].value}
                    />
                {/each}
            </div>
            <button class="btn btn-primary w-32" on:click={onClickVerifyHOTP}>Login</button>
        </div>
    </div>
{/if}