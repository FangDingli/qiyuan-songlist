import { createStore } from "vuex"

export interface StateProps {
  isLoading: boolean
  songlistSearched: TableData[]
}

export interface TableData {
  id: number
  original_name: string
  searched_name: string
  singer: string
}


const store = createStore<StateProps>({
  state: {
    isLoading: true,
    songlistSearched: []
  },
  mutations: {
    setSonglistSearched(state, payload: TableData[]) {
      state.songlistSearched = payload
    },
    setLoading(state, payload: boolean) {
      state.isLoading = payload
    }
  },
  actions: {
    setSonglistSearched(context, payload: TableData[]) {
      context.commit("setSonglistSearched", payload)
    },
    setLoading(context, payload: boolean) {
      context.commit("setLoading", payload)
    }
  },
  getters: {
    getSonglistSearched(state: StateProps) {
      return state.songlistSearched
    },
    getLoadingState(state: StateProps) {
      return state.isLoading
    }
  }
});


export default store;