<script lang="ts">
    import { goto } from "$app/navigation";
    import { i18n } from "$lib/data/i18n.svelte";
    import { app } from "$lib/data/app.svelte";
    import { setUnlock } from "$lib/data/disable.svelte";
    import { connection } from "$lib/data/connection.svelte";
    import PageLayout from "$lib/components/PageLayout.svelte";
    import ProgressCircle from "$lib/components/ProgressCircle.svelte";

    let progress = $state(0), eta = $state(0), speed = $state(0);

    connection.c?.setListener("progress", (p, e, s) => {
        progress = p;
        eta = e;
        speed = s;
    });

    connection.c?.setListener("beforeFinish", () => {
        connection.c?.setListener("end", () => {
            connection.c?.disconnect();
            setUnlock();
            goto("/receive/done");
        });
    });
</script>

<PageLayout title={i18n.t("receive.transfer.title")} class="flex flex-col items-center">
    <div class="h-full flex justify-center items-center">
        <ProgressCircle {progress} />
    </div>
    <div class="w-1/2 flex justify-center gap-x-12">
        <div class="w-full text-right">
            <p class="text-xs text-slate-500 font-semibold">{i18n.t("send.transfer.estimated")}</p>
            <p>{app.formatTime(eta, [i18n.t("send.transfer.hours"), i18n.t("send.transfer.minutes"), i18n.t("send.transfer.seconds")])}</p>
        </div>
        <div class="w-full text-left">
            <p class="text-xs text-slate-500 font-semibold">{i18n.t("send.transfer.speed")}</p>
            <p>{app.formatFileSize(speed, 1)}/s</p>
        </div>
    </div>
</PageLayout>