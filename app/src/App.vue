<script setup lang="ts">
import { computed, onMounted, reactive, shallowRef } from 'vue';
import { DateTime, Interval } from 'luxon';
import BarChart from './components/BarChart.vue';

// TODO: use a real state management solution
let store: any | undefined = reactive({ summary: undefined, graph: undefined });

let fromDate: Date | undefined;
let toDate: Date | undefined;

let dataset = {
  dimensions: ["period", "Carbon savings", "Diesel savings"],
  source: [
    {
      period: "Sep 2023",
      ["Carbon savings"]: 1,
      ["Diesel savings"]: 2,
    },
    {
      period: "Oct 2023",
      ["Carbon savings"]: 3,
      ["Diesel savings"]: 4,
    },
  ]
}

const formatAsTonnes = (inKgs?: number) => inKgs === undefined ? "-" : (inKgs / 1000).toFixed(1);

const _updateGraph = async (fromDate: string, toDate?: string) => {

  // Get 6 sub periods based
  const fromDateTime = DateTime.fromFormat(fromDate, "yyyy-MM-dd");
  const toDateTime = toDate ? DateTime.fromFormat(toDate, "yyyy-MM-dd") : DateTime.now();

  const savingsDataByInterval = await Promise.all(
    Interval.fromDateTimes(fromDateTime, toDateTime)
      .divideEqually(12)
      .map(interval => {
        const fromDate = interval.start?.toFormat("yyyy-MM-dd");
        const toDate = interval.end?.toFormat("yyyy-MM-dd");
        const query = new URLSearchParams();
        if (fromDate) query.set("fromDate", fromDate);
        if (toDate) query.set("toDate", toDate);

        // Call device saving API for each sub period
        return fetch("http://localhost:8080/api/v1/device-saving/1/history?" + query.toString())
          .then((res) => res.json())
      }));

  // Update dataset

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

onMounted(() => {
  fetch("http://localhost:8080/api/v1/device-saving/1/summary")
    .then((res) => res.json())
    .then((dto) => {
      store.summary = dto
    });
})

const currentMonthCarbonSavings = computed(() => formatAsTonnes(store.summary?.currentMonthCarbonSavings))
const currentMonthFueldSavings = computed(() => store.summary?.currentMonthFueldSavings.toFixed(2))
const lifetimeCarbonSavings = computed(() => formatAsTonnes(store.summary?.lifetimeCarbonSavings))
const lifetimeFueldSavings = computed(() => store.summary?.lifetimeFueldSavings.toFixed(2))

</script>

<template>
  <header>
    <h1 class="text-primary-500">
      Estimated carbon savings and diesel savings
    </h1>
  </header>
  <main class="col">
    <p class="text-primary-500">Download general guidelines on the estimated carbon & diesel savings calculations</p>
    <hr />
    <h2>Estimated carbon savings</h2>
    <p class="subtle">1 Tonne = 1,000 kg</p>
    <div class="row space-around">
      <div class="col align-center">
        <div class="subtle">Total</div>
        <div class="text-primary-500 text-lg">{{ lifetimeCarbonSavings }}</div>
        <div class="text-primary-500">Tonnes</div>
      </div>
      <div class="col align-center">
        <div class="subtle">Monthly</div>
        <div class="text-primary-500 text-lg">{{ currentMonthCarbonSavings }}</div>
        <div class="text-primary-500">Tonnes</div>
      </div>
    </div>
    <hr />
    <div class="row space-around">
      <div class="col align-center">
        <div class="subtle">Total</div>
        <div class="text-secondary-500 text-lg">{{ lifetimeFueldSavings }}</div>
        <div class="text-secondary-500">Litres</div>
      </div>
      <div class="col align-center">
        <div class="subtle">Monthly</div>
        <div class="text-secondary-500 text-lg">{{ currentMonthFueldSavings }}</div>
        <div class="text-secondary-500">Litres</div>
      </div>
    </div>
    <hr />
    <div class="row">
      <input type="date" v-bind:value="fromDate" />
      -
      <input type="date" v-bind:value="toDate" />
    </div>
    <div class="row">
      <button v-on:click="showLast30daysOnGraph">Last 30 days</button>
      <button v-on:click="showLast60daysOnGraph">Last 60 days</button>
      <button v-on:click="showLastYearOnGraph">Last year</button>
    </div>
    <BarChart title="" v-bind:dataset="dataset" />
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

}

.text-primary-500 {
  color: var(--primary-500);
}

.text-secondary-500 {
  color: var(--secondary-500);
}

.text-lg {
  font-size: 1.25rem;
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

.subtle {
  color: var(--gray-500);
}

.col {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
}

.space-around {
  justify-content: space-around;
}

.align-center {
  align-items: center;
}
</style>
