import type { AppStore } from "../data/storeFactory";
import type {
  Race,
  RaceParticipantWithLiveData,
  RaceParticipantStatus,
} from "../data/races/types";
import type { User } from "../data/users/types";
import type { RaceStage } from "../data/stages/types";
import { upsertRace } from "../data/races/raceSlice";
import { upsertUser } from "../data/users/userSlice";
import { setStage, setCurrentStageId } from "../data/stages/stageSlice";

// Shared fixtures for seeding a "current race stage" into a test store. Kept tiny
// and stable so journey tests focus on behavior, not data plumbing.
//
// extractTheRunId in StageCreateModal matches /therun\.gg\/races\/([a-zA-Z0-9-]+)/.
export const RACE_ID = "race123";
export const STAGE_ID = "stage-1";
export const STAGE_2_ID = "stage-2";

export const PARTICIPANT_1_USER = "runner_one";
export const PARTICIPANT_2_USER = "runner_two";

function participantFixture(
  user: string,
  status: RaceParticipantStatus
): RaceParticipantWithLiveData {
  return {
    raceId: RACE_ID,
    user,
    status,
    pb: "1:23:45",
    disqualified: false,
    disqualifiedBy: null,
    disqualifiedReason: null,
    finalTime: null,
    joinedAtDate: "2024-01-01T00:30:00Z",
    readyAtDate: "2024-01-01T00:45:00Z",
    finishedAtDate: null,
    confirmedAtDate: null,
    abandondedAtDate: null,
    ratingBefore: 1000,
    ratingAfter: null,
    comment: null,
  };
}

export function makeParticipant(
  user: string,
  status: RaceParticipantStatus,
  overrides: Partial<RaceParticipantWithLiveData> = {}
): RaceParticipantWithLiveData {
  return { ...participantFixture(user, status), ...overrides };
}

export const raceFixture: Race = {
  raceId: RACE_ID,
  creator: "admin",
  createdAt: "2024-01-01T00:00:00Z",
  game: "sm64",
  displayGame: "Super Mario 64",
  category: "120-star",
  displayCategory: "120 Star",
  gameImage: "",
  description: "",
  canStartEarly: false,
  status: "progress",
  customRules: [],
  customName: "SM64 120 Star",
  visible: true,
  participants: [
    participantFixture(PARTICIPANT_1_USER, "started"),
    participantFixture(PARTICIPANT_2_USER, "joined"),
  ],
  results: [],
  moderators: [],
  participantCount: 2,
  readyParticipantCount: 2,
  finishedParticipantCount: 0,
  startTime: "2024-01-01T01:00:00Z",
  endTime: null,
  firstFinishedParticipantTime: null,
  isTestRace: false,
  isFeatured: false,
  ranked: true,
  autoConfirm: false,
  countdownSeconds: 0,
  startMethod: "everyone-ready",
  timeLeaderboards: [],
  mmrLeaderboards: [],
};

export const userFixtures: User[] = [
  {
    user: PARTICIPANT_1_USER,
    login: "runner_one",
    picture: "https://example.com/one.png",
    pronouns: "she/her",
    bio: "",
    searchName: "runner one",
  },
  {
    user: PARTICIPANT_2_USER,
    login: "runner_two",
    picture: "https://example.com/two.png",
    pronouns: "he/him",
    bio: "",
    searchName: "runner two",
  },
];

export const raceStageFixture: RaceStage = {
  id: STAGE_ID,
  name: "Main Stage",
  kind: "race",
  raceId: RACE_ID,
  raceOverrides: {},
  participantOverrides: {},
};

// A second stage over the same race. Its participant override changes the frame
// text, so switching stages produces an observable difference in the overlay.
export const secondRaceStageFixture: RaceStage = {
  id: STAGE_2_ID,
  name: "Second Stage",
  kind: "race",
  raceId: RACE_ID,
  raceOverrides: {},
  participantOverrides: {
    [PARTICIPANT_1_USER]: { displayName: "Stage Two Runner" },
  },
};

type Store = AppStore["store"];

// Seeds a store with a race, its users, and the stage set as current - the state
// the host would have after creating a race stage. Uses the real action creators
// so the reducer behavior under test is production code, not a hand-built state.
export function seedRaceStage(store: Store) {
  store.dispatch(upsertRace(raceFixture));
  for (const user of userFixtures) {
    store.dispatch(upsertUser(user));
  }
  store.dispatch(setStage(raceStageFixture));
  store.dispatch(setCurrentStageId(STAGE_ID));
}

export function seedSecondStage(store: Store) {
  store.dispatch(setStage(secondRaceStageFixture));
}
