export interface Person {
  name: string;
  pronouns: string;
}

export interface OverlayInfo {
  runners: Person[];
  commentators: Person[];
  category: string;
}

export interface RunInfo extends OverlayInfo {
  game: string;
  streamTitle: string;
}

export interface OverlayInfoRequest {
  kind: "OverlayInfoRequest";
}

export interface OverlayInfoResponse {
  kind: "OverlayInfoResponse";
  data: OverlayInfo;
}

export interface UnknownPayload {
  kind: undefined;
}

export type CustomEventPayload =
  | OverlayInfoRequest
  | OverlayInfoResponse
  | UnknownPayload;

export function castEventData(rawData: unknown): CustomEventPayload {
  return rawData as CustomEventPayload;
}
