export const state = () => ({
  teams: [],
  contestants: [],
  scores: [],
});

export const getters = {
  contestants(state) {
    return state.contestants;
  },
  teams(state) {
    return state.teams;
  },
  scores(state) {
    return state.scores;
  },
  scoresByContestant(state) {
    const contestantObjs = state.contestants.map((c) => {
      return { name: c.name, scores: [] };
    });

    contestantObjs.forEach((c) => {
      state.scores.forEach((week) => {
        const weeklyScore = week.contestants.find((w) => w.name === c.name);
        c.scores.push({ name: week.name, score: weeklyScore.scores });
      });
    });

    return contestantObjs;
  },
};

export const mutations = {
  SET_TEAMS(state, teams) {
    state.teams = teams;
  },
  SET_SCORES(state, scores) {
    state.scores = scores;
  },
  SET_CONTESTANTS(state, contestants) {
    state.contestants = contestants;
  },
};

export const actions = {
  // Get list of contestants
  async getContestants({ commit }) {
    try {
      const res = await this.$axios.get(`${process.env.baseUrl}/contestants`);
      await commit('SET_CONTESTANTS', res.data);
      return res.data;
    } catch (err) {
      return err;
    }
  },

  // Get list of pool teams
  async getTeams({ commit }) {
    try {
      const res = await this.$axios.get(`${process.env.baseUrl}/teams`);
      await commit('SET_TEAMS', res.data);
      return res.data;
    } catch (err) {
      return err;
    }
  },

  // Get list of weekly scores
  async getScores({ commit }) {
    try {
      const res = await this.$axios.get(`${process.env.baseUrl}/scores`);
      await commit('SET_SCORES', res.data);
      return res.data;
    } catch (err) {
      return err;
    }
  },
};
