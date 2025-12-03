import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Spinner,
  Box,
  Stack,
  ButtonGroup,
  IconButton,
  Pagination,
 } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getArtistInfo, getArtistAlbums } from "../services/artistsService";
import { AlbumCard } from "../components/AlbumCard/AlbumCard";

import styles from "./ArtistPage.module.css";
import { IMAGE_SIZE } from "../constants/common";
import { getImageUrl } from "../utils/format";

export const ArtistPage = () => {
  const PAGE_SIZE = 12;
  const { id } = useParams(); // artist mbid

  // Api calls
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingArtist, setLoadingArtist] = useState(true);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  // Pagination
  const [page, setPage] = useState(1);
  const [totalAlbums, setTotalAlbums] = useState(0);

  useEffect(() => {
    if (!id) return;

    setLoadingArtist(true);
    getArtistInfo(id).then((data) => {
      setArtist(data);
      setLoadingArtist(false);
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingAlbums(true);
    // Fetch paginating albums
    getArtistAlbums(id, page, PAGE_SIZE).then((data) => {
      setAlbums(data.album);
      setTotalAlbums(data.attr.total ?? 12);
      setLoadingAlbums(false);
    });
  }, [id, page]);

  if (loadingArtist) {
    return (
      <Box textAlign="center" mt="60px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!artist) return <p>Artist not found</p>;

  return (
    <div className={styles.wrapper}>
      {/* Details */}
      <div className={styles.header}>
        <img src={getImageUrl(IMAGE_SIZE.LG, artist.image)} className={styles.avatar} alt={artist.name}/>

        <div className={styles.infoSection}>
          <h1 className={styles.artistName}>{artist.name}</h1>

          <div className={styles.stats}>
            <span>Listeners: {artist.stats?.listeners}</span>
            <span>Playcount: {artist.stats?.playcount}</span>
          </div>
        </div>
      </div>

      {/* Albums */}
      <Box position="relative">
        <div className={styles.grid}>
          {albums.map((album, index) => (
            <Link
              key={album.mbid}
              to={`/album/${album.mbid}`}
            >
              <AlbumCard
                key={album.mbid ?? index}
                title={album.name}
                artist={artist.name}
                image={getImageUrl(IMAGE_SIZE.LG, album.image)}
              />
            </Link>
          ))}
        </div>

        {loadingAlbums && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255, 255, 255, 0.6)"
            zIndex={10}
          >
            <Spinner size="xl" />
          </Box>
        )}
      </Box>

      {/* Pagination */}
      <Stack mt={6} align="center">
        <Pagination.Root
          count={totalAlbums}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={(e: any) => setPage(e.page)}
        >
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger>
              <HiChevronLeft cursor="pointer"/>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(pageItem) => (
                <IconButton
                  variant={{ base: "ghost", _selected: "outline" }}
                  onClick={() => setPage(pageItem.value)}
                >
                  {pageItem.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger>
              <HiChevronRight cursor="pointer"/>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Stack>
    </div>
  );
};

