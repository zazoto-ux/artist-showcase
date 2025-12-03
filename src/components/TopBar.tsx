import styles from "./TopBar.module.css";
import useDebounce from "../hooks/useDebounce";
import { searchTracks } from "../services/trackService";
import {
  Flex,
  Icon,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FiHeart, FiSearch } from "react-icons/fi";
import { useRef, useState, useEffect } from "react";
import { searchAlbums } from "../services/albumService";
import { getImageUrl } from "../utils/format";
import { IMAGE_SIZE } from "../constants/common";
import { Link } from "react-router-dom";

export const TopBar = () => {
  const [query, setQuery] = useState("");
  const [trackResults, setTrackResults] = useState<Track[]>([]);
  const [albumResults, setAlbumResults] = useState<Album[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const debouncedSearch = useDebounce(async (value: string) => {
    if (!value.trim()) {
      setTrackResults([]);
      setAlbumResults([]);
      setOpen(false);
      return;
    }
    setIsLoading(true);

    const [tracks, albums] = await Promise.all([
      searchTracks(value),
      searchAlbums(value)
    ]);

    setTrackResults(tracks);
    setAlbumResults(albums);
    setIsLoading(false);
    setOpen(true);
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasNoResults =
    trackResults.length === 0 && albumResults.length === 0;

  const onToggleFavourite = (trackId: string | undefined, isFav: boolean) => {
    if (!trackId || !trackResults || !Array.isArray(trackResults)) return;

    setTrackResults((tracks) => tracks.map((track: Track) => (
      track.mbid === trackId ? {
       ...track,
       love: isFav,
      } : track
    )));
  };

  return (
    <header className={styles.topbar}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          cursor="pointer"
          _hover={{ color: "teal.400" }}
        >
          Artist Showcase
        </Text>
      </Link>

      {/* Searchbar */}
      <div className={styles.searchWrapper}>
        <FiSearch className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search..."
          value={query}
          onChange={handleSearch}
          onFocus={() => query && setOpen(true)}
        />
        {isLoading && (
          <Spinner
            size="sm"
            className={styles.loadingSpinner}
          />
        )}
      </div>


      {/* Search results dropdown*/}
      <div
        ref={dropdownRef}
        className={`${styles.dropdown} ${open ? styles.open : ""}`}
      >
        {hasNoResults ? (
          <div className={styles.noResults}>No results found</div>
        ) : (
          <>
            {/* Tracks */}
            {trackResults.length > 0 && (
              <div className={styles.group}>
                <div className={styles.groupTitle}>Tracks</div>

                {trackResults.slice(0, 4).map((t, index) => {
                  let trackId = t.artist.name + index;
                  return (
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      px={2}
                    >
                      <div key={trackId} className={styles.item}>
                        <img src={getImageUrl(IMAGE_SIZE.LG, t.image)} className={styles.itemImage} alt={trackId}/>

                        <div>
                          <p className={styles.itemTitle}>{t.name}</p>
                          <p className={styles.itemArtist}>{t.artist.name}</p>
                        </div>
                      </div>
                      <Icon
                        as={FiHeart}
                        boxSize={5}
                        onClick={() => onToggleFavourite(t.mbid, !t.love)}
                        cursor="pointer"
                        color={t.love ? "red.400" : "gray.400"}
                        fill={t.love ? "red.400" : "transparent"}
                        transition="0.2s"
                      />
                    </Flex>
                    )
                  })}
              </div>
            )}

            {/* Albums */}
            {albumResults.length > 0 && (
              <div className={styles.group}>
                <div className={styles.groupTitle}>Albums</div>

                {albumResults.slice(0, 4).map((a) => (
                  <Link
                    to={`/album/${a.mbid}`}
                    key={a.mbid}
                  >
                    <div className={styles.item}>
                      <img src={getImageUrl(IMAGE_SIZE.LG, a.image)} className={styles.itemImage} alt={a.name}/>

                      <div>
                        <p className={styles.itemTitle}>{a.name}</p>
                        <p className={styles.itemArtist}>{a.artist}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* VIEW MORE */}
            <div className={styles.viewMore}>View all results →</div>
          </>
        )}
      </div>
    </header>
  );
};