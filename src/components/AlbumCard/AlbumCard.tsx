import styles from "./AlbumCard.module.css";

interface AlbumCardProps {
  title: string;
  artist: string;
  image?: string;
}

export const AlbumCard = ({ title, artist, image }: AlbumCardProps) => {
  return (
    <div className={styles.card}>
      <img src={image} className={styles.cover} alt={title}/>
      <p className={styles.title}>{title}</p>
      <p className={styles.artist}>{artist}</p>
    </div>
  );
};
