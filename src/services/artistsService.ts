import axios, { AxiosError } from "axios";
import { HTTP_STATUS } from "../constants/common";
import { lastFMApi } from "./api/musicApi";
import { formatImages } from "../utils/format";

interface ArtistAlbumsResponse {
  attr: {
    artist?: string;
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  },
  album: Album[],
}

const loadSimilerArtists = (artistsArr: any[]): Artist[] => {
  if (!Array.isArray(artistsArr)) return [];
  return artistsArr.map((artist: any):Artist => ({
    name: artist.name,
    image: formatImages(artist.image),
    url: artist.url,
  }));
};
const loadArtistBio = (bio: any): ArtistBio => {
  return {
    published: bio.published,
    content: bio.content,
    summary: bio.summary,
    link: bio.links.link.href,
  };
};

export const getTopArtists = async () => {
  try {
    const topArtistsResponse = await lastFMApi.get("", {
      params: { method: "chart.getTopArtists" },
    });
    const artists = topArtistsResponse.data?.artists?.artist;

    if (topArtistsResponse.status !== HTTP_STATUS.OK) {
      throw new Error(`Unexpected status code: ${topArtistsResponse.status}`);
    }

    if (!Array.isArray(artists)) {
      throw new Error("Invalid response structure: Top artists not found");
    }

    return artists.map((t: any): Artist => ({
      mbid: t.mbid,
      name: t.name,
      stats: {
        playcount: Number(t.playcount),
      },
      streamable: Number(t.streamable),
      image: formatImages(t.image),
      url: t.url,
    }));
  } catch (err) {
    let errorMessage = "Error fetching Top Artists: ";

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
};

export const getArtistInfo = async (artistMBID: string): Promise<Artist> => {
  try {
    const res = await lastFMApi.get("", {
      params: {
        method: "artist.getinfo",
        mbid: artistMBID
      }
    });

    if (res.status !== HTTP_STATUS.OK) {
      throw new Error(`Unexpected status code: ${res.status}`);
    }

    const artist = res.data?.artist;

    return {
      mbid: artist.mbid,
      name: artist.name,
      streamable: Number(artist.streamable),
      image: formatImages(artist.image),
      url: artist.url,
      ontour: Number(artist.ontour),
      stats: {
        listeners: Number(artist.stats.listeners),
        playcount: Number(artist.stats.playcount),
      },
      similarArtists: loadSimilerArtists(artist.similar.artist),
      tags: artist.tags.tag,
      bio: loadArtistBio(artist.bio),
    };
  } catch (err) {
    let errorMessage = "Error fetching Artist details: ";

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
};

export const getArtistAlbums = async (
  artistMBID: string,
  page: number,
  limit: number,
): Promise<ArtistAlbumsResponse> => {
  try {
    const res = await lastFMApi.get("", {
      params: {
        method: "artist.gettopalbums",
        mbid: artistMBID,
        page,
        limit,
      }
    });

    const albums = res.data?.topalbums?.album;
    const attr = res.data?.topalbums?.["@attr"];

    if (res.status !== HTTP_STATUS.OK) {
      throw new Error(`Unexpected status code: ${res.status}`);
    }
    if (!Array.isArray(albums) && !albums.length) {
      throw new Error("No albums found");
    }

    return {
      attr: {
        artist: attr.artist,
        page: Number(attr.page),
        perPage: Number(attr.perPage),
        total: Number(attr.total),
        totalPages: Number(attr.totalPages),
      },
      album: albums?.map((alb: any): Album => ({
        mbid: alb.mbid,
        name: alb.name,
        image: formatImages(alb.image),
        stats: { playcount: alb.playcount },
        url: alb.url,
        rank: Number(alb["@attr"].rank),
      })),
    }
  } catch (err) {
    let errorMessage = "Error fetching Artist Albums: ";

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
};