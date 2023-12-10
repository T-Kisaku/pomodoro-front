<script lang="ts">
    import {PUBLIC_GOOGLE_LOGOUT_URL} from '$env/static/public'
    import type {Profile$result} from '$houdini'
    import Icon from '@iconify/svelte'
    export let user: Profile$result['profile'] | undefined = undefined
    // export let 

    // @ts-ignore
    const openModalById = (id: string) => document.getElementById(id)?.showModal()
</script>

<div class="p-3 flex flex-row justify-end gap-5">
    <button class="btn btn-square" on:click={() => openModalById('report')}>
        <Icon icon="mdi:chart-bar" class="text-2xl" />
    </button>
    <button class="btn btn-square" on:click={() => openModalById('settings')}>
        <Icon icon="mdi:gear" class="text-2xl" />
    </button>
    {#if user !== undefined}
        {#if user.profile_image_url}
            <button class="btn btn-circle" on:click={() => openModalById('profile')}>
                <img src={user.profile_image_url} alt={user.username} class="rounded-full">
            </button>
        {:else}
            <button class="btn btn-square" on:click={() => openModalById('profile')}>
                <Icon icon="mdi:account" class="text-2xl"/>
            </button>
        {/if}
    {:else}
        <a href="/login" class="btn btn-square">
            <Icon icon="mdi:account" class="text-2xl" />
        </a>
    {/if}
</div>

<!-- modals -->
<dialog id="report" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Report</h3>

        <div class="modal-action">
        <form method="dialog">
            <button class="btn">Close</button>
        </form>
        </div>
    </div>
</dialog>
<dialog id="settings" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg text-center">Settings</h3>
        <div class="p-10 flex flex-col gap-10">
            <div class="flex flex-row justify-between">
                <label class="form-control">
                    <div class="label label-text">Work</div>
                    <input type="text" class="input input-bordered w-28" />
                </label>
                <label class="form-control">
                    <div class="label label-text">Short</div>
                    <input type="text" class="input input-bordered w-28" />
                </label>
                <label class="form-control">
                    <div class="label label-text">Long</div>
                    <input type="text" class="input input-bordered w-28" />
                </label>
            </div>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text text-2xl">Auto Start Breaks</span> 
                    <input type="checkbox" class="toggle" checked />
                </label>
            </div>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text text-2xl">Auto Start Pomodoros</span> 
                    <input type="checkbox" class="toggle" checked />
                </label>
            </div>
        </div>
        <div class="modal-action">
        <form method="dialog">
            <button class="btn">Close</button>
        </form>
        </div>
    </div>
</dialog>
<dialog id="profile" class="modal">
    <div class="modal-box flex flex-col gap-10 text-center">
        <div class="mt-10 avatar hero">
            <div class="w-40 rounded-full">
                <img src={user?.profile_image_url} alt={user?.username}>
            </div>
        </div>
        <div>
            <p class="font-bold text-lg">{user?.username}</p>
            <p>{user?.email}</p>
        </div>
        <div>
            <a href={PUBLIC_GOOGLE_LOGOUT_URL} class="btn btn-primary w-56">Logout</a>
        </div>
        <div class="modal-action">
        <form method="dialog"><button class="btn">Close</button></form>
        </div>
    </div>
</dialog>