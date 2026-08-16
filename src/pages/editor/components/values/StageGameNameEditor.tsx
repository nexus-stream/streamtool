import { useCallback, useMemo, useRef, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDebounceFn } from "ahooks";
import { useStageValue } from "../../../../data/stages/useStageValue";
import { TwitchGame, useTwitchApi } from "../../../../hooks/useTwitchApi";

interface Props {
  stageId: string;
}

// Twitch requires game titles to be exact ("Super Mario Bros" is invalid, it
// wants "Super Mario Bros."). Rather than making the user guess the exact name,
// this searches Twitch as they type and only lets them pick an exact match from
// the results, storing the canonical name on the stage.
export function StageGameNameEditor({ stageId }: Props) {
  const [gameName, setGameName] = useStageValue(stageId, "streamGameName");
  const [searchResults, setSearchResults] = useState<TwitchGame[]>([]);
  const [loading, setLoading] = useState(false);
  const latestQuery = useRef("");
  const { searchGames } = useTwitchApi();

  const search = useCallback(
    async (query: string) => {
      latestQuery.current = query;
      setLoading(true);
      try {
        const results = await searchGames(query);
        if (latestQuery.current === query) {
          setSearchResults(results);
        }
      } catch {
        if (latestQuery.current === query) {
          setSearchResults([]);
        }
      } finally {
        if (latestQuery.current === query) {
          setLoading(false);
        }
      }
    },
    [searchGames],
  );

  const { run: debouncedSearch, cancel: cancelSearch } = useDebounceFn(search, {
    wait: 300,
  });

  const clearSuggestions = useCallback(() => {
    latestQuery.current = "";
    cancelSearch();
    setSearchResults([]);
    setLoading(false);
  }, [cancelSearch]);

  // The stage stores just the name string, but Autocomplete works with option
  // objects, so synthesize a value from the stored name and match options by
  // name rather than identity.
  const value = useMemo(
    () => (gameName ? { id: "", name: gameName } : null),
    [gameName],
  );

  // Keep the currently-selected game available as an option so it stays
  // highlighted/selectable even before any search results arrive.
  const options = useMemo(() => {
    if (gameName && !searchResults.some((game) => game.name === gameName)) {
      return [{ id: "", name: gameName }, ...searchResults];
    }
    return searchResults;
  }, [gameName, searchResults]);

  return (
    <Autocomplete
      fullWidth
      size="small"
      loading={loading}
      options={options}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.name === val.name}
      // Twitch already filters by the query; don't re-filter locally.
      filterOptions={(opts) => opts}
      value={value}
      onChange={(_, option) => setGameName(option?.name ?? "")}
      onInputChange={(_, inputValue, reason) => {
        const query = inputValue.trim();
        if (!query) {
          clearSuggestions();
          return;
        }
        if (reason === "input") {
          void debouncedSearch(query);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Twitch Game Name" />
      )}
    />
  );
}
