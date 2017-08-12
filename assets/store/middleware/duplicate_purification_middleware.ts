import {selectBattleActionHistory} from "../selectors/battle_selectors"
import {archiveBattleAction, Actions} from "../actions/battle_actions"

export default function({dispatch, getState}) {

  return next => action => {

    if (action.type === Actions.ARCHIVE_BATTLE_ACTION) {
      return next(action);
    }

    let hasClientId = action.clientId !== undefined && action.clientId !== "";
    let hasServerId = action.serverId !== undefined;

    if (!hasClientId && !hasServerId) {
      return next(action);
    }

    let actionHistory = selectBattleActionHistory(getState());

    if (actionHistory.some(({clientId, serverId}) => (clientIdMatches(action.clientId, clientId) || serverIdMatches(action.serverId, serverId)))) {
      return;
    }

    dispatch(archiveBattleAction(action));
    let result = next(action);

    return result;
  };

};

function clientIdMatches(clientId1: string, clientId2: string) {
  if (clientId1 === undefined || clientId1 === "" || clientId2 === undefined || clientId2 === "") {
    return false;
  }
  return clientId1 === clientId2;
};

function serverIdMatches(serverId1: any[], serverId2) {
  if (!serverId1 || !serverId2) {
    return false;
  }
  return serverId1[0] === serverId2[0] && serverId1[1] === serverId2[1];
};
