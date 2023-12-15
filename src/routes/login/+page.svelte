<script lang="ts">
    import {PUBLIC_GOOGLE_LOGIN_URL} from '$env/static/public'
	import Icon from '@iconify/svelte';
</script>

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content">
        <div class="flex flex-col items-center">
            <div class="card shrink-0 w-full max-w-md shadow-2xl bg-base-100">
                <div class="card-body">
                    <form>
                        <input type="email" placeholder="Email" class="input input-bordered" required />
                        <div class="form-control mt-6">
                            <button class="btn btn-primary">Login</button>
                        </div>
                    </form>
                    <div class="divider">OR</div>
                    <div>
                        <div class="form-control">
                            <a href={PUBLIC_GOOGLE_LOGIN_URL} class="btn btn-outline">
                                <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
                                <span>Login with Google</span>
                            </a>
                        </div>
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