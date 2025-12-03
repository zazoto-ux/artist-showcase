import axios, { AxiosError } from "axios";
import { HTTP_STATUS } from "../constants/common";
import { lastFMApi } from "./api/musicApi";
import { formatImages } from "../utils/format";

export const getTopTracks = async (): Promise<Track[]> => {
  try {
    const topTracksResponse = await lastFMApi.get("", {
      params: { method: "chart.getTopTracks" },
    });
    const tracks = topTracksResponse.data?.tracks?.track;

    if (topTracksResponse.status !== HTTP_STATUS.OK) {
      throw new Error(`Unexpected status code: ${topTracksResponse.status}`);
    }

    if (!Array.isArray(tracks)) {
      throw new Error("Invalid response structure: Top tracks not found");
    }

    return tracks.map((t: any): Track => ({
      mbid: t.mbid,
      name: t.name,
      artist: t.artist,
      duration: Number(t.duration),
      playcount: Number(t.playcount),
      listeners: Number(t.listeners),
      image: formatImages(t.image),
      url: t.url,
      streamable: {
        text: Number(t.streamable["#text"]),
        fulltrack: Number(t.streamable.fulltrack),
      },
    }));
  } catch (err) {
    let errorMessage = "Error fetching Top Tracks: ";

    // Axios error?
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

export const searchTracks = async (trackQuery: string): Promise<Track[]> => {
  try {
    const topTracksResponse = await lastFMApi.get("", {
      params: {
        method: "track.search",
        track: trackQuery,
      },
    });
    const tracks = topTracksResponse.data?.results?.trackmatches?.track;

    if (topTracksResponse.status !== HTTP_STATUS.OK) {
      throw new Error(`Unexpected status code: ${topTracksResponse.status}`);
    }

    if (!Array.isArray(tracks)) {
      throw new Error("Invalid response structure: No tracks found");
    }

    return tracks.map((t: any): Track => ({
      mbid: t.mbid,
      name: t.name,
      artist: { name: t.artist },
      listeners: Number(t.listeners),
      image: formatImages(t.image),
      streamable: { fulltrack: Number(t.streamable) },
      url: t.url,
    }));
  } catch (err) {
    let errorMessage = "Error searching Tracks with given query: ";

    // Axios error?
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
