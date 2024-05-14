<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
    DatasetComponent,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import { computed, defineComponent, onMounted, onUpdated, shallowRef } from "vue";

use([
    CanvasRenderer,
    BarChart,
    DatasetComponent,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

defineComponent([VChart]);

const props = defineProps<{
    dataset: {
        dimension: string[],
        source: any[],
    }
}>()

const option = computed(() => ({
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
        data: ["Carbon savings", "Diesel savings"],
    },
    xAxis: {
        type: "category",
        data: props.dataset.source.map((d: any) => d.period),
    },
    yAxis: [
        { name: "Carbon savings (t)", type: "value" },
        { name: "Diesel savings (l)", type: "value", axisLabel: { formatter: "{value}k" } },
    ],
    series: [
        {
            name: "Carbon savings",
            type: "bar",
            color: "#0DCFA7",
            data: props.dataset?.source.map((d: any) => d["Carbon savings"]),
        },
        {
            name: "Diesel savings",
            type: "bar",
            color: "#4B46FF",
            data: props.dataset?.source.map((d: any) => d["Diesel savings"]),
            yAxisIndex: 1,
        },
    ],
}));

onUpdated(() => {
    console.log("onUpdated()")
})

onMounted(() => {
    console.log("onMounted()")
})

</script>
<template>
    <div class="charts-wrapper">
        <v-chart class="chart" :option="option" autoresize />
    </div>
</template>
<style scoped>
.chart {
    height: 400px;
}
</style>