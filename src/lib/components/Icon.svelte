<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import type { IconT } from "$lib/models/IconT.type";

    interface Props {
        class?: string;
        name: IconT;
    }

    let {
        class: className,
        name
    }: Props = $props();

    let iconSvg = $state("");

    $effect(() => {
        if (name)
            fetch(`/icons/${name}.svg`).then(r => r.text()).then(i => iconSvg = i);
    });
</script>

{#if iconSvg}
    <icon class={twMerge("flex justify-center items-center *:size-full", className)}>
        {@html iconSvg}
    </icon>
{/if}