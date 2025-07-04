<script lang="ts">
    import { onMount, tick } from "svelte";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { base } from "$app/paths";
    import { changeLanguage, i18n } from "$lib/data/i18n.svelte";
    import { disable } from "$lib/data/disable.svelte";
    import { error, hideError } from "$lib/data/error.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import ProgressBar from "$lib/components/ProgressBar.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import "../app.css";

    let { children } = $props();

    let instantChange = true;

    const accentColor = $derived(
        page.url.pathname.startsWith(base + "/send") ? ["--color-send", "--color-send-light", "--color-send-dark"] :
        page.url.pathname.startsWith(base + "/receive") ? ["--color-receive", "--color-receive-light", "--color-receive-dark"] :
        page.url.pathname.startsWith(base + "/settings") ? ["--color-settings", "--color-settings-light", "--color-settings-dark"] :
        page.url.pathname.startsWith(base + "/account") ? ["--color-account", "--color-account-light", "--color-account-dark"] :
        ["--color-home", "--color-home-light", "--color-home-dark"]
    );

    $effect(() => {
        document.body.style.setProperty("--color-accent", `var(${accentColor[0]})`);
        document.body.style.setProperty("--color-accent-light", `var(${accentColor[1]})`);    
        document.body.style.setProperty("--color-accent-dark", `var(${accentColor[2]})`);
    });

    $effect(() => console.log("Navigating to", page.url.pathname.replace(base, "")));

    const setTheme = async (theme: string, instant = false) => {
        if (document.documentElement.getAttribute("data-theme") === theme) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || instant) {
            document.documentElement.setAttribute("data-theme", theme);
            return;
        }

        await document.startViewTransition(async () => {
            await tick();
            document.documentElement.setAttribute("data-theme", theme);
        }).ready;

        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const maxRadius = Math.hypot(x, y);

        document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
            { duration: 800, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
        );
    };

    onMount(() => {
        let media = window.matchMedia("(prefers-color-scheme: dark)");

        window.goto = goto;
        changeLanguage(navigator.language);

        media.addEventListener("change", e => setTheme(e.matches ? "dark" : "light"));
        setTheme(media.matches ? "dark" : "light", instantChange);
        instantChange = false;
    });
</script>

<div class="w-260 h-150 flex gap-x-4">
    <Sidebar />
    <main class="h-full flex flex-1 relative text-slate-950 dark:text-slate-100 bg-slate-50/60 dark:bg-slate-900/90 rounded-2xl ring-1 ring-slate-400/10 dark:ring-slate-50/10 shadow-sm overflow-hidden">
        {#if disable.loading}
            <div class="absolute top-0 left-0 right-0" transition:fade={{ duration: 200 }}>
                <ProgressBar class="rounded-none" indeterminate />
            </div>
        {/if}
        {@render children()}
    </main>
    <div class="fixed inset-0 bg-blue-900/10 -z-2"></div>
    <Dialog bind:show={error.show} title={i18n.t("dialog." + error.e, error.vars).toString()} cancelable={false} onsubmit={() => hideError()}>
        <p>{i18n.t(`dialog.${error.e}Desc`, error.vars)}</p>
    </Dialog>
</div>