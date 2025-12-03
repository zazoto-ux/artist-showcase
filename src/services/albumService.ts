import axios, { AxiosError } from "axios";
import { HTTP_STATUS } from "../constants/common";
import { lastFMApi } from "./api/musicApi";
import { formatImages } from "../utils/format";

const formatTracks = (tracksArr: any[]): Track[] => {
  if (!Array.isArray(tracksArr)) return [];

  return tracksArr.map((track) => ({
    name: track.name,
    streamable: track.streamable.fulltrack,
    duration: track.duration,
    url: track.url,
    rank: track["@attr"].rank,
    artist: track.artist,
  }));
};

export const getAlbumInfo = async (albumMBID: string): Promise<Album> => {
  try {
    const res = await lastFMApi.get("", {
      params: {
        method: "album.getInfo",
        mbid: albumMBID,
      },
    });
    
    if (res.status !== HTTP_STATUS.OK) {
      throw new Error(`Unexpected status code: ${res.status}`);
    }
    
    const album = res.data?.album;

    return {
      mbid: album.mbid,
      name: album.name,
      artist: album.artist,
      image: formatImages(album.image),
      streamable: Number(album.streamable),
      url: album.url,
      tags: album.tags.tag,
      tracks: formatTracks(album.tracks.track),
      stats: {
        listeners: album.listeners,
        playcount: album.playcount,
      },
      wiki: {
        published: album.wiki.published,
        summary: album.wiki.summary,
        content: album.wiki.content,
      },
    };
  } catch (err) {
    let errorMessage = "Error fetching Albums details: ";

    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>;

      errorMessage = errorMessage + (
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        axiosErr.message
      );
    }
      
    console.error(errorMessage, err);
    throw new Error(errorMessage);
  }
}

export const searchAlbums = async (albumQuery: string): Promise<Album[]> => {
  try {
    const albumsResponse = await lastFMApi.get("", {
      params: {
        method: "album.search",
        album: albumQuery,
      },
    });
    const albums = albumsResponse.data?.results?.albummatches?.album;

    if (albumsResponse.status !== HTTP_STATUS.OK) {
      throw new Error(`Unexpected status code: ${albumsResponse.status}`);
    }

    if (!Array.isArray(albums)) {
      throw new Error("Invalid response structure: No albums found");
    }

    return albums.map((t: any): Album => ({
      mbid: t.mbid,
      name: t.name,
      artist: t.artist,
      image: formatImages(t.image),
      streamable: Number(t.streamable),
      url: t.url,
    }));
  } catch (err) {
    let errorMessage = "Error searching Albums with given query: ";

    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>;

      errorMessage = errorMessage + (
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        axiosErr.message
      );
    }
      
    console.error(errorMessage, err);
    throw new Error(errorMessage);
  }
}
