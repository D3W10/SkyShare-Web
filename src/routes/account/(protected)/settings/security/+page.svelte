<script lang="ts">
    import { i18n } from "$lib/data/i18n.svelte";
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import { transitions } from "$lib/utils";

    let oldPassword = $state(""), password = $state(""), passwordConfirm = $state("");
    let passwordAlert = $state(false);
</script>

<div class="w-full py-2 flex flex-col gap-y-6" in:transitions.pageIn out:transitions.pageOut>
    <div class="w-full flex justify-between items-center gap-x-6">
        <div>
            <h3 class="mb-1 font-semibold">{i18n.t("account.settings.password")}</h3>
            <p class="text-sm text-slate-500">{i18n.t("account.settings.passwordDesc")}</p>
        </div>
        <Button class="w-32" onclick={() => passwordAlert = true}>{i18n.t("account.settings.passwordButton")}</Button>
    </div>
</div>
<Dialog bind:show={passwordAlert} title={i18n.t("account.settings.password")} text={i18n.t("account.settings.passwordButton")} onsubmit={() => {}}>
    <p>{i18n.t("dialog.logoutRequiredDesc")}</p>
    <Input class="w-full mt-4" bind:value={oldPassword} type="password" placeholder={i18n.t("account.settings.oldPassword")} />
    <Input class="w-full mt-2" bind:value={password} type="password" placeholder={i18n.t("account.settings.newPassword")} />
    <Input class="w-full mt-2" bind:value={passwordConfirm} type="password" placeholder={i18n.t("account.settings.confirmPassword")} />
</Dialog>