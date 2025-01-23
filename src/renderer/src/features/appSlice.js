import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "app",
  initialState: {
    user: null,
    groupList: [],
    activeGroup: null,
  },
  reducers: {
    addGroup(state, action) {
      state.groupList.unshift(action.payload);
    },
    deleteGroup(state, action) {
      state.groupList = state?.groupList?.filter(
        (group) => group.id !== action.payload,
      );
    },
    updateGroup(state, action) {
      state.groupList = state?.groupList?.map((group) =>
        group.id === action.payload?.id ? action.payload : group,
      );
    },
    initActiveGroup(state, action) {
      state.activeGroup = action.payload;
    },

    deleteProxy(state, action) {
      const proxyId = action.payload;
      const updatedGroupList = state.groupList.map((group) => {
        if (group.id !== state.activeGroup.id) return group;
        const updatedProxies = group.proxies.filter(
          (proxy) => proxy.id !== proxyId,
        );
        return { ...group, proxies: updatedProxies };
      });
      state.groupList = updatedGroupList;
    },
    updatedActiveGroup(state) {
      const updatedActiveGroup = state.groupList.find(
        (group) => group.id === state.activeGroup.id,
      );
      state.activeGroup = updatedActiveGroup;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const {
  setUser,
  addGroup,
  deleteGroup,
  updateGroup,
  deleteProxy,
  initActiveGroup,
  updatedActiveGroup,
} = todosSlice.actions;
export default todosSlice.reducer;
