<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { page } from "$app/state";
    import { base } from "$app/paths";
    import { i18n } from "$lib/data/i18n.svelte";
    import { account } from "$lib/data/account.svelte";
    import { cleanAll } from "$lib/data/cleanup.svelte";
    import LinkItem from "./LinkItem.svelte";
    import ProfilePicture from "./ProfilePicture.svelte";
    import type { IconT } from "$lib/models/IconT.type";

    const accountSelected = $derived(page.url.pathname.startsWith(base + "/account"));
</script>

<aside class="w-64 p-4 flex flex-col gap-y-1 text-slate-950 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-900/90 rounded-2xl">
    <LinkItem class="p-0 grid *:col-[1] *:row-[1]" href={!account.loggedIn ? "/account/login" : "/account"} selected={accountSelected} onclick={cleanAll}>
        {#key account.loggedIn}
            <div class="p-2 flex items-center gap-x-2">
                <div in:scale={{ duration: 300, delay: 300, start: 0.5 }} out:scale={{ duration: 300, start: 0.5 }}>
                    <ProfilePicture class="size-9 m-1 {!accountSelected ? "text-slate-500 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-400" : "text-slate-800 dark:text-slate-300"}" />
                </div>
                <p in:fade|global={{ duration: 100, delay: 100 }} out:fade|global={{ duration: 100 }}>{!account.loggedIn ? i18n.t("app.login") : account.username}</p>
            </div>
        {/key}
    </LinkItem>
    <hr class="h-0.5 mx-0.5 my-2 bg-slate-950/10 dark:bg-slate-50/10 border-0 rounded-full" />
    {@render item(i18n.t("app.home"), "home", "/")}
    {@render item(i18n.t("app.send"), "send", "/send")}
    {@render item(i18n.t("app.receive"), "receive", "/receive")}
</aside>

{#snippet item(name: string, icon: IconT, url: string)}
    <LinkItem href={url} {icon} selected={url !== "/" && page.url.pathname.replace(base, "").startsWith(/\/\w+/g.exec(url)![0]) || page.url.pathname.replace(base, "").replace("index.html", "") === url} onclick={cleanAll}>
        <p in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>{name}</p>
    </LinkItem>
{/snippet}