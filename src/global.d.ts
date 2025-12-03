interface Artist {
  mbid?: string;
  name: string;
  streamable?: number;
  image?: ArtistImage[];
  url?: string;
  ontour?: number;
  stats?: {
    listeners?: number;
    playcount?: number;
  };
  similarArtists?: Artist[];
  tags?: Tag[];
  bio?: ArtistBio;
}

interface Track {
  mbid?: string;
  name: string;
  artist: Artist;
  duration?: number;
  playcount?: number;
  listeners?: number;
  image?: ArtistImage[];
  url?: string;
  streamable?: Streamable;
  rank?: number;
  love?: boolean;
}

interface Album {
  id?: number;
  mbid: string;
  name: string;
  artist?: string;
  image: ArtistImage[];
  streamable?: number;
  url: string;
  releasedate?: string;
  releasedatenum?: number;
  stats?: {
    listeners?: number;
    playcount?: number;
  }
  topTags?: Tag[];
  tags?: Tag[];
  tracks?: Track[];
  rank?: number;
  wiki?: AlbumWiki;
}

interface ArtistImage {
  text: string;
  size: 'mega' | 'extralarge' | 'large' | 'medium' | 'small';
}

interface Streamable {
  text?: number;
  fulltrack?: number;
}

interface Tag {
  name: string;
  url: string;
}

interface ArtistBio {
  published: string;
  summary: string;
  content: string;
  link: string;
}

interface AlbumWiki {
  published: string;
  summary: string;
  content: string;
}
