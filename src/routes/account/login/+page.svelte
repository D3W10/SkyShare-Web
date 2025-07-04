<script lang="ts">
    import { i18n } from "$lib/data/i18n.svelte";
    import { getLogin, getSignup } from "$lib/data/account.svelte";
    import PageLayout from "$lib/components/PageLayout.svelte";
    import Button from "$lib/components/Button.svelte";
    import OneAction from "$lib/components/OneAction.svelte";
    import Dialog from "$lib/components/Dialog.svelte";

    let historyDialog = $state(false), syncDialog = $state(false), identificationDialog = $state(false);
</script>

<PageLayout title={i18n.t("account.login.title")} class="px-14 flex gap-x-6">
    <div class="pl-16 flex flex-col justify-center flex-1 gap-y-8">
        <div class="flex items-center gap-x-4">
            <img class="h-10" src="/logo.svg" alt="SkyShare Logo" />
            <div>
                <h3 class="text-2xl font-semibold">SkyShare</h3>
                <h4 class="-mt-0.5 text-sm font-semibold">Account</h4>
            </div>
        </div>
        <div class="space-y-2.5">
            <OneAction type="button" icon="history" onclick={() => historyDialog = true}>{i18n.t("account.login.history")}</OneAction>
            <OneAction type="button" icon="sync" onclick={() => syncDialog = true}>{i18n.t("account.login.sync")}</OneAction>
            <OneAction type="button" icon="identification" onclick={() => identificationDialog = true}>{i18n.t("account.login.identification")}</OneAction>
        </div>
    </div>
    <div class="flex flex-col justify-center items-center flex-1">
        <div class="w-40 space-y-3">
            <Button class="w-full" onclick={() => window.open(getLogin())}>{i18n.t("account.login.login")}</Button>
            <Button class="w-full" type="secondary" onclick={() => window.open(getSignup())}>{i18n.t("account.login.signup")}</Button>
        </div>
    </div>
</PageLayout>
<Dialog bind:show={historyDialog} title={i18n.t("account.login.history")} cancelable={false}>
    <p>{i18n.t("account.login.historyDesc")}</p>
</Dialog>
<Dialog bind:show={syncDialog} title={i18n.t("account.login.sync")} cancelable={false}>
    <p>{i18n.t("account.login.syncDesc")}</p>
</Dialog>
<Dialog bind:show={identificationDialog} title={i18n.t("account.login.identification")} cancelable={false}>
    <p>{i18n.t("account.login.identificationDesc")}</p>
</Dialog>