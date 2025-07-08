<script lang="ts">
    import { i18n } from "$lib/data/i18n.svelte";
    import { account } from "$lib/data/account.svelte";
    import PageLayout from "$lib/components/PageLayout.svelte";
    import OneAction from "$lib/components/OneAction.svelte";

    let greetingKey = $state("home.morning");

    function updateGreeting() {
        let currentHour = new Date().getHours();

        if (currentHour >= 6 && currentHour <= 12)
            greetingKey = "home.morning";
        else if (currentHour >= 13 && currentHour <= 19)
            greetingKey = "home.afternoon";
        else if (currentHour >= 20 || currentHour <= 5)
            greetingKey = "home.evening";
    }

    updateGreeting();
    setInterval(updateGreeting, 60000);
</script>

<PageLayout title={i18n.t(greetingKey, { count: !account.loggedIn ? 0 : 1, name: account.username })} class="px-14 pb-8 flex gap-x-8">
    <div class="w-1/2 pl-16 flex flex-col justify-center gap-y-8">
        <div class="flex items-center gap-x-4">
            <img class="h-10" src="/logo.svg" alt="SkyShare Logo" />
            <h3 class="text-2xl font-semibold">SkyShare</h3>
        </div>
        <div class="space-y-2.5">
            <OneAction icon="send" href="/send">{i18n.t("home.send")}</OneAction>
            <OneAction icon="receive" href="/receive">{i18n.t("home.receive")}</OneAction>
            <OneAction icon="download" href="https://github.com/D3W10/SkyShare/releases">{i18n.t("home.download")}</OneAction>
        </div>
    </div>
    <div class="w-1/2 px-4 flex justify-center items-center">
        <img src="/heroLight.svg" class="w-full block dark:hidden" alt="SkyShare Hero" />
        <img src="/heroDark.svg" class="w-full hidden dark:block" alt="SkyShare Hero" />
    </div>
</PageLayout>