<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { DateTime, Interval } from 'luxon';
import SavingsChart from './components/SavingsChart.vue';

let summary: any = ref({});

let fromDate = ref<string>("");
let toDate = ref<string>("");

let dataset = shallowRef<any>({
  dimensions: ["period", "Carbon savings", "Diesel savings"],
  source: []
})
let summaryError = ref<string>("");
let graphError = ref<string>("");

const asTonnes = (inKgs?: number) => inKgs === undefined ? undefined : (inKgs / 1000).toFixed(1);

const _updateGraph = async (fromDate: string, toDate?: string) => {

  // Get 6 sub periods based
  const fromDateTime = DateTime.fromFormat(fromDate, "yyyy-MM-dd");
  const toDateTime = toDate ? DateTime.fromFormat(toDate, "yyyy-MM-dd") : DateTime.now();

  Promise.all(
    Interval.fromDateTimes(fromDateTime, toDateTime)
      .divideEqually(6)
      .map(async (interval) => {
        const fromDate = interval.start?.toFormat("yyyy-MM-dd");
        const toDate = interval.end?.toFormat("yyyy-MM-dd");
        const query = new URLSearchParams();
        if (fromDate) query.set("fromDate", fromDate);
        if (toDate) query.set("toDate", toDate);

        // Call device saving API for each sub period
        const resp = await fetch("http://localhost:8080/api/v1/device-saving/1/history?" + query.toString())
          .then((res) => res.json())

        if (resp.success === false) {
          throw new Error(resp.reason);
        }

        return {
          period: toDate,
          "Carbon savings": asTonnes(resp.data.periodCarbonSavings),
          "Diesel savings": (resp.data.periodFueldSavings / 1000).toFixed(1),
        }
      }))
    .then(savings => {
      console.log(savings);

      // Update dataset
      dataset.value = { ...dataset.value, source: savings };
    })
    .catch(e => {
      graphError.value = e.message;
    });
}

const showLast30daysOnGraph = async () => {
  _updateGraph(DateTime.now().minus({ days: 30 }).toFormat("yyyy-MM-dd"), undefined);
}
const showLast60daysOnGraph = async () => {
  _updateGraph(DateTime.now().minus({ days: 60 }).toFormat("yyyy-MM-dd"), undefined);
}
const showLastYearOnGraph = async () => {
  _updateGraph(DateTime.now().minus({ year: 1 }).toFormat("yyyy-MM-dd"), undefined);
}

const showSelectedPeriodOnGraph = async () => {
  _updateGraph(fromDate.value, toDate.value)
}

onMounted(() => {
  fetch("http://localhost:8080/api/v1/device-saving/1/summary")
    .then((res) => res.json())
    .then((dto) => {
      if (!dto.success) {
        summaryError.value = dto.reason
      } else {
        summary.value = dto.data
      }
    });

  showLastYearOnGraph()
})

const currentMonthCarbonSavings = computed(() => asTonnes(summary.value.currentMonthCarbonSavings))
const currentMonthFueldSavings = computed(() => summary.value.currentMonthFueldSavings?.toFixed(1))
const lifetimeCarbonSavings = computed(() => asTonnes(summary.value.lifetimeCarbonSavings))
const lifetimeFueldSavings = computed(() => summary.value.lifetimeFueldSavings?.toFixed(1))

</script>

<template>
  <header>
    <h1 class="text-primary-500">
      Estimated carbon savings and diesel savings
    </h1>
  </header>
  <main class="col">
    <p class="text-primary-500 bold">Download general guidelines on the estimated carbon & diesel savings calculations
    </p>
    <hr />
    <h2>Estimated carbon savings</h2>
    <p class="text-gray-500">1 Tonne = 1,000 kg</p>
    <div class="row space-around">
      <div class="col align-center">
        <div class="text-gray-500">Total</div>
        <div class="text-primary-500 text-lg bold">{{ lifetimeCarbonSavings }}</div>
        <div class="text-primary-500">Tonnes</div>
      </div>
      <div class="col align-center">
        <div class="text-gray-500">Monthly</div>
        <div class="text-primary-500 text-lg bold">{{ currentMonthCarbonSavings }}</div>
        <div class="text-primary-500">Tonnes</div>
      </div>
    </div>
    <hr />
    <h2>Estimated diesel savings</h2>
    <div class="row space-around">
      <div class="col align-center">
        <div class="text-gray-500">Total</div>
        <div class="text-secondary-500 text-lg bold">{{ lifetimeFueldSavings }}</div>
        <div class="text-secondary-500">Litres</div>
      </div>
      <div class="col align-center">
        <div class="text-gray-500">Monthly</div>
        <div class="text-secondary-500 text-lg bold">{{ currentMonthFueldSavings }}</div>
        <div class="text-secondary-500">Litres</div>
      </div>
    </div>
    <hr />
    <div class="row align-center gap-2">
      <input type="date" v-model="fromDate" />
      -
      <input type="date" v-model="toDate" />
      <button v-on:click="showSelectedPeriodOnGraph">Update date range</button>
      <div class="text-red-500 bold">{{ graphError }}</div>
    </div>
    <div class="row gap-2 my-3">
      <button v-on:click="showLast30daysOnGraph">Last 30 days</button>
      <button v-on:click="showLast60daysOnGraph">Last 60 days</button>
      <button v-on:click="showLastYearOnGraph">Last year</button>
    </div>
    <SavingsChart :dataset="dataset" />
  </main>
</template>

<style>
:root {
  --primary-200: #E9FBF7;
  --primary-500: #4DD0A7;
  --primary-800: #0DCFA7;

  --secondary-500: #4B46FF;

  --gray-200: #F7F9FD;
  --gray-500: #6E7079;
  --gray-800: #69737D;

  --red-500: #EF4444;
}

.text-primary-500 {
  color: var(--primary-500);
}

.text-secondary-500 {
  color: var(--secondary-500);
}

.text-gray-500 {
  color: var(--gray-500);
}

.text-red-500 {
  color: var(--red-500);
}

.text-lg {
  font-size: 1.25rem;
}

.bold {
  font-weight: bold;
}

#app,
body {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  font-size: 16px;
}

header {
  width: 100%;
  padding: 16px;
  background-color: var(--primary-200);
}

main {
  width: 100%;
  padding: 16px;
}

hr {
  color: var(--gray-800);
  margin: 16px 0;
}

h1,
h2,
h3 {
  all: unset
}

h1 {
  font-size: 1.5rem;
  font-weight: bolder;
}

h2 {
  font-size: 1.25rem;
  font-weight: bolder;
}

.col {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
}

.gap-2 {
  gap: 8px;
}

.space-around {
  justify-content: space-around;
}

.align-center {
  align-items: center;
}

button {
  all: unset;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid var(--gray-500);
  border-radius: 4px;
}

.my-3 {
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>
