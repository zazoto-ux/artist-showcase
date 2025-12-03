import {
  Box,
  Flex,
  Image,
  Grid,
  Text,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useTrackStore } from "../store/trackStore";
import { useArtistsStore } from "../store/artistStore";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/format";
import { IMAGE_SIZE } from "../constants/common";

const Home = () => {
  const { tracks, loadTopTracks } = useTrackStore();
  const { artists, loadTopArtists } = useArtistsStore();

  useEffect(() => {
    loadTopArtists();
    loadTopTracks();
  }, []);

  return (
    <Flex p="24px" gap="24px">
      <Box flex="4">
        {/* Top Artists */}
        <Heading mb="14px" size="md">
          Top Artists
        </Heading>

        <Grid
          templateColumns="repeat(auto-fill, minmax(170px, 1fr))"
          gap="20px"
        >
          {artists.slice(0, 5).map((artist: Artist, index) => {
            let artistKey = artist.mbid;
            return(
              <Link
                key={artistKey}
                to={`/artist/${artist.mbid}`}
              >
                <Box
                  shadow="md"
                  borderRadius="16px"
                  p="12px"
                >
                  <Image
                    src={getImageUrl(IMAGE_SIZE.LG, artist.image)}
                    alt={artist.name}
                    borderRadius="12px"
                    h="150px"
                    w="100%"
                    objectFit="cover"
                  />
                  <Text fontWeight="bold" mt="8px">
                    {artist.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {artist.stats?.playcount} plays
                  </Text>
                </Box>
              </Link>
          )})}
        </Grid>

        {/* Top Tracks */}
        <Heading mt="40px" mb="14px" size="md">
          Top Tracks
        </Heading>

        <VStack align="stretch">
          {tracks.slice(0, 6).map((track: Track, index: number) => {
            let trackKey = track.artist.name + index;
            return (
            <Flex
              key={trackKey}
              p="12px"
              shadow="sm"
              borderRadius="14px"
              align="center"
              gap="14px"
            >
              <Text w="24px" textAlign="center" color="gray.500" fontWeight="bold">
                {index + 1}
              </Text>

              <Image
                src={getImageUrl(IMAGE_SIZE.LG, track.image)}
                alt={track.name}
                borderRadius="10px"
                boxSize="54px"
                objectFit="cover"
              />

              <Box flex="1">
                <Text fontWeight="bold">{track.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {track.artist.name}
                </Text>
              </Box>

              {track.duration ? 
                (<Text fontSize="sm" w="50px">
                  {Math.floor(track.duration / 60)}:
                  {String(track.duration % 60).padStart(2, "0")}
                </Text>)
                : null
              }
            </Flex>
          )})}
        </VStack>
      </Box>
    </Flex>
  );
};

export default Home;
