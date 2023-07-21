<template>
  <v-container>
    <!-- Contestant scores table -->
    <v-data-table
      :headers="tableHeaders"
      :items="teams"
      :loading="loading"
      :single-expand="false"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-3 mt-5"
    >
      <template #expanded-item="{ item }">
        <td :colspan="tableHeaders.length">
          <ol>
            <li
              v-for="contestant in item.contestants"
              :key="contestant.name"
              class="my-3"
            >
              <v-btn text @click="openContestantDialog(contestant)">
                <span v-if="contestant.votedOut" class="strikethrough">{{
                  contestant.name
                }}</span>
                <span v-else>{{ contestant.name }}</span> ({{
                  contestant.totalPoints
                }}
                points)
              </v-btn>
            </li>
          </ol>
        </td>
      </template>
    </v-data-table>

    <!-- Contestant Scores dialog -->
    <v-dialog v-model="dialog" width="500" closeable>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title
            >Contestant: {{ currentContestant.name }}</v-toolbar-title
          >
          <v-spacer></v-spacer
          ><v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title>{{ displayedScore.name }}</v-card-title>
        <v-card-text>
          <div v-if="displayedScore.score?.length === 0">
            No scores available.
          </div>
          <v-simple-table v-else>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">Score</th>
                  <th class="text-left">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(score, index) in displayedScore.score" :key="index">
                  <td>{{ score.rule }}</td>
                  <td>{{ score.value }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td><b>Weekly Total</b></td>
                  <td>
                    <b>{{ calculateWeeklyTotal(displayedScore.score) }}</b>
                  </td>
                </tr>
              </tfoot>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            :disabled="isPrevDisabled"
            @click="clickPreviousWeek"
            ><v-icon> mdi-skip-previous </v-icon>previous</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="isNextDisabled"
            @click="clickNextWeek"
            >next<v-icon> mdi-skip-next </v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'IndexPage',
  data() {
    return {
      loading: false,
      expanded: [],
      tableHeaders: [
        { text: 'Team', sortable: true, value: 'name' },
        { text: 'Owner', sortable: true, value: 'owner' },
        { text: 'Total Points', sortable: true, value: 'totalPoints' },
        { text: '', value: 'data-table-expand' },
      ],
      dialog: false,
      currentContestant: {},
      currentScoreIndex: 0,
      displayedScore: {},
    };
  },
  computed: {
    ...mapGetters(['scoresByContestant', 'teams', 'scores']),
    isPrevDisabled() {
      return this.currentScoreIndex === 0;
    },
    isNextDisabled() {
      return (
        this.currentScoreIndex >= this.currentContestant.scores?.length - 1
      );
    },
  },
  watch: {
    currentContestant() {
      if (
        !this.currentContestant.scores ||
        this.currentContestant.scores.length === 0
      ) {
        this.displayedScore = [];
      } else {
        this.displayedScore =
          this.currentContestant.scores[this.currentScoreIndex];
      }
    },
    currentScoreIndex() {
      if (
        !this.currentContestant.scores ||
        this.currentContestant.scores.length === 0
      ) {
        this.displayedScore = [];
      } else {
        this.displayedScore =
          this.currentContestant.scores[this.currentScoreIndex];
      }
    },
  },
  async mounted() {
    this.loading = true;
    await this.getContestants();
    await this.getTeams();
    await this.getScores();
    this.loading = false;
  },
  methods: {
    ...mapActions(['getContestants', 'getTeams', 'getScores']),
    openContestantDialog(contestant) {
      this.currentContestant = this.scoresByContestant.find(
        (c) => c.name === contestant.name
      );

      this.currentScoreIndex = this.currentContestant.scores.length - 1;

      this.dialog = true;
    },
    clickPreviousWeek() {
      this.currentScoreIndex--;
    },
    clickNextWeek() {
      this.currentScoreIndex++;
    },
    calculateWeeklyTotal(scores) {
      let total = 0;
      scores.forEach((s) => (total += s.value));
      return total;
    },
  },
};
</script>

<style>
.strikethrough {
  text-decoration: line-through;
}
</style>
