import React, { useEffect, useMemo, useState } from "react";
import {
  Flex,
  Box,
  Icon,
  Text,
  Heading,
  Spinner,
  HStack,
  Tag,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { List, type RowComponentProps } from "react-window";
import styles from "./AlbumPage.module.css";
import { useParams } from "react-router-dom";
import { getAlbumInfo } from "../services/albumService";
import { getImageUrl } from "../utils/format";
import { IMAGE_SIZE } from "../constants/common";

export const AlbumPage = () => {
  const GAP = 16; // CSS gap between cards
  const ITEMS_PER_COLUMN_DEFAULT = 3; // fallback
  // responsive columns: small -> 1, md -> 2, lg -> 3 (you can tune)
  const columns = useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 3 }) || ITEMS_PER_COLUMN_DEFAULT;
  const { id } = useParams(); // album mbid

  const [albumData, setAlbumData] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getAlbumInfo(id).then((data) => {
      setAlbumData(data);
      setLoading(false);
    });
  }, [id]);

  const sortedTracks = useMemo(() => {
    return albumData && Array.isArray(albumData?.tracks)
    ? albumData.tracks
    : [];
  }, [albumData]);
  
  const onToggleFavourite = (trackName: string, isFav: boolean) => {
    if (!albumData?.tracks) return;

    let newTracks = albumData.tracks.map((track: Track) => (
      track.name === trackName ? {
       ...track,
       love: isFav,
      } : track
    ));

    setAlbumData((album) => {
      if (!album) return album;

      return {
        ...album,
        tracks: newTracks,
      };
    });
  };

  const RowComponent = ({
    index,
    tracks,
    style,
    onToggleFavourite
  }: RowComponentProps<{
    tracks: Track[], 
    onToggleFavourite: (trackName: string, isFav: boolean) => void,
   }>) => {
    const track = tracks[index];

    const handleFavouriteToggle = () => {
      if (!track.name) return;

      onToggleFavourite(track.name, !track.love);
    };

    return (
      <Flex
        key={track.mbid}
        p="12px"
        mx={2}
        my={1}
        shadow="sm"
        borderRadius="14px"
        align="center"
        justifyContent="space-between"
        gap="14px"
      >
        <Flex
          flexDirection="row"
          gap={2}
        >
          <Text w="24px" textAlign="center" color="gray.500" fontWeight="bold">
            {index + 1}
          </Text>
          <Text fontWeight="bold" truncate title={track.name}>{track.name}</Text>
        </Flex>

        <Flex
          gap={2}
        >
          {track.duration &&
            track.duration > 0 &&
            <Text fontSize="sm" opacity={0.75}>{formatDuration(track.duration)}</Text>
          }

          <Icon
            as={FiHeart}
            boxSize={5}
            onClick={handleFavouriteToggle}
            cursor="pointer"
            color={track.love ? "red.400" : "gray.400"}
            fill={track.love ? "red.400" : "transparent"}
            transition="0.2s"
          />
        </Flex>
      </Flex>
    );
  };

  function formatDuration(seconds: number | string) {
    const sec = Number(seconds) || 0;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <Box p={6}>
      {loading ? (
        <Box
          position="relative"
          height="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      ) : albumData ? (
        <>
          {/* Header */}
          <div className={styles.header}>
            <img src={getImageUrl(IMAGE_SIZE.LG, albumData.image)} alt={albumData.name} className={styles.avatar} />
            <div className={styles.info}>
              <h2 className={styles.title}>{albumData.name}</h2>
              <p className={styles.artist}>{albumData.artist}</p>
            </div>
          </div>

          {/* Detailss */}
          <Box mb={6} p={4} borderWidth="1px" borderRadius="lg">
            <HStack mb={4} flexWrap="wrap">
              <Box>
                <Text fontWeight="bold">Listeners</Text>
                <Text>{albumData.stats?.listeners}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Playcount</Text>
                <Text>{albumData.stats?.playcount}</Text>
              </Box>
            </HStack>

            <Box
              w="100%"
              h="1px"
              bg="gray.300"
              opacity={0.4}
              my={3}
            />

            <Box mb={3}>
              <Text fontWeight="bold" mb={2}>Tags</Text>
              <HStack wrap="wrap" gap="6px">
                {albumData.tags?.map((t) => (
                  <Tag.Root key={t.name}>
                    <Tag.Label>{t.name}</Tag.Label>
                  </Tag.Root>
                ))}
              </HStack>
            </Box>

            {albumData.wiki?.summary && (
              <>
                <Box
                  w="100%"
                  h="1px"
                  bg="gray.300"
                  opacity={0.4}
                  my={3}
                />
                <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: albumData.wiki.summary }} />
              </>
            )}
          </Box>

          {/* Tracks */}
          <Box className={styles.grid}>
            <Heading size="md" mb={4}>Tracks</Heading>

            {loading && (
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="rgba(255,255,255,0.6)"
                zIndex={20}
              >
                <Spinner size="xl" />
              </Box>
            )}

            <Box
              height="400px"
              width="100%"
              display="flex"
              gridTemplateColumns={`repeat(${columns}, 1fr)`}
              gap={`${GAP}px`}
              py={2}
              alignItems="stretch"
              borderWidth="1px"
              borderRadius="lg"
            >
              <List
                rowComponent={RowComponent}
                rowCount={sortedTracks.length}
                rowHeight={25}
                rowProps={{
                  tracks: sortedTracks,
                  onToggleFavourite,
                }}
              />
            </Box>

          </Box>
        </>
      ) : (
        <Text>Album not found</Text>
      )}
    </Box>
  );
};

export default AlbumPage;
