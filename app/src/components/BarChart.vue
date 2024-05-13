<script lang="ts">
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
import { ref } from "vue";

use([
    CanvasRenderer,
    BarChart,
    DatasetComponent,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

export default {
    name: "BarChart",
    components: {
        VChart,
    },
    props: {
        title: String,
        dataset: Object
    },
    setup(props: {
        title?: string,
        dataset?: object
    }) {
        const option = ref({
            title: {
                text: props.title,
                left: "center",
            },
            dataset: props.dataset,
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            xAxis: {
                type: "category"
            },
            yAxis: {
                type: "value",
            },
            series: [{ type: "bar" }, { type: "bar" }],
        });

        return { option };
    },
};

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